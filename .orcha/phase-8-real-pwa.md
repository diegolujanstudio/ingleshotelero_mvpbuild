# Phase 8 — Production-Grade PWA

**Status:** 🔴 Not started  
**Goal:** Service worker (next-pwa + Workbox), IndexedDB offline queue for exam answers and recordings, bulletproof iOS Safari + Chrome Android support, Lighthouse PWA ≥ 90. Zero exam data loss regardless of network conditions.

---

## Decisions (deferred — Phase 8 starts after Phase 7 is merged)

> **Q4 — Audio format for listening items:** Deferred to Phase 8 kickoff. Recommendation stands: generate 90 TTS audio files in the same pass as the SW/offline work.

> **Q5 — Offline scope boundary:** Deferred. Recommendation stands: `/hr/*` is network-only. Only exam flow + landing get offline support.

> **Deployment note (decided 2026-04-24):** Hosting is Netlify (not Vercel). `netlify.toml` with `@netlify/plugin-nextjs` is already committed. Demo branch deploys go to `demo.ingleshotelero.com` with `NEXT_PUBLIC_DEMO_MODE=true`. Production main deploy never has that flag.

---

## Architecture decisions

### 1. Service worker framework
Use `@ducanh2912/next-pwa` — the only actively maintained Next.js 14 App Router-compatible fork of next-pwa (Workbox 7 under the hood). The unmaintained `next-pwa` by shadowwalker does not support the App Router.

**Alternative rejected:** Hand-written service worker with Workbox CLI. Rejected because next-pwa auto-generates the precache manifest from Next.js build output. Getting that right by hand is fragile across deploys.

### 2. Offline queue storage
Use `idb` (the thin IndexedDB promise wrapper) for the offline queue. Two object stores:

**`offline-queue` store** — serializable metadata per queued request:
```typescript
interface QueuedRequest {
  id: string;              // crypto.randomUUID()
  type: 'answer' | 'recording';
  endpoint: string;
  method: 'POST' | 'PATCH';
  headers: Record<string, string>;
  body: string;            // JSON.stringify(payload) for answers
  blobKey?: string;        // key into 'offline-blobs' store for recordings
  timestamp: number;
  attempts: number;
  sessionId: string;
  idempotencyKey: string;  // `${sessionId}-q${questionIndex}` or `${sessionId}-p${promptIndex}`
}
```

**`offline-blobs` store** — binary audio blobs keyed by `blobKey`. IDB handles binary natively; localStorage cannot.

**Alternative rejected:** `localStorage`. 5MB iOS limit. Can't store audio blobs.

### 3. Cache strategies per resource type

| Resource | Strategy | TTL | Notes |
|----------|----------|-----|-------|
| Next.js JS chunks (`/_next/static/*`) | StaleWhileRevalidate | 7 days | Versioned by content hash; safe to serve stale |
| Next.js CSS (`/_next/static/*`) | StaleWhileRevalidate | 7 days | Same |
| Fonts (`/fonts/*`) | CacheFirst | 365 days | Immutable; large; critical for offline UI |
| Google Fonts CSS | StaleWhileRevalidate | 1 day | Changes rarely |
| Exam audio (`/audio/exam/*`) | CacheFirst | 365 days | Immutable after TTS generation |
| `/` landing | StaleWhileRevalidate | 10 min | Public; safe to show slightly stale |
| `/e/[slug]` | NetworkFirst → cache fallback | 5 min | Hotel branding may update |
| `/exam/*` pages | NetworkFirst → cache fallback | 1 min | Session state must be fresh |
| `/api/*` | NetworkOnly (no SW interception) | — | Managed by offline queue in page JS |
| `/hr/*` | NetworkOnly | — | Auth-dependent; no offline mode |
| `/offline` fallback | CacheFirst | Permanent | Served when all network navigation fails |

**Critical rule:** SW does NOT intercept `/api/*`. The offline queue lives in page-level JS, not the service worker. This avoids conflicts with Vercel Edge Functions and keeps replay logic accessible to React components.

### 4. iOS Safari compatibility

| Feature | iOS Support | Mitigation |
|---------|------------|------------|
| Service Worker | iOS 11.3+ | ✅ Fine |
| IndexedDB | iOS 8+ | ✅ Fine |
| MediaRecorder | iOS 14.3+ (`audio/mp4` only) | Detect mime type at runtime |
| Background Sync API | ❌ Not on iOS | Use `window.addEventListener('online', ...)` in foreground |
| Push Notifications in PWA | ❌ Not on iOS | Out of scope |
| Storage quota (~50MB default) | Upgradeable | Call `navigator.storage.persist()` on exam start |
| `beforeinstallprompt` event | ❌ Not on iOS | Show manual "Add to Home Screen" instructional sheet |
| PWA standalone mode | ✅ iOS 11.3+ | `display: standalone` in manifest |
| `viewportFit: cover` | ✅ | Already set in `layout.tsx` |
| IDB in Private Browsing | ❌ IDB disabled | Catch error; fallback to sessionStorage; show banner |

**MediaRecorder mime type detection (required for iOS):**
```typescript
export function getSupportedAudioMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',  // Chrome desktop + Android
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2', // iOS Safari 14.3+
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return types.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
}
```

If `getSupportedAudioMimeType()` returns `''`, show a fallback UI instead of letting MediaRecorder throw.

### 5. Install prompt timing strategy
The `beforeinstallprompt` event must be captured immediately (before user interaction), but the prompt should fire only when the user has seen the product's value.

**Timing:** Fire when user lands on `/exam/[id]/speaking` (first time only). At that point they've completed diagnostic + listening — they've seen real value.

**iOS:** No `beforeinstallprompt`. Show a custom bottom sheet: "Para instalar: toca Compartir → Agregar a pantalla de inicio."

**Gate:** `localStorage.getItem('install_prompt_shown')` — show once per device.

**Never:** Auto-prompt on first page load.

### 6. Offline fallback page
`/offline` route — served from SW cache when all navigation requests fail offline.

Content (in design system tokens):
- Card with espresso/ivory palette
- "Sin conexión"
- "Sus respuestas están guardadas en este dispositivo. Cuando regrese la señal, se sincronizarán automáticamente."
- Retry button that calls `window.location.reload()`

---

## Data flow

### Happy path (online)
```
User submits diagnostic answer
→ POST /api/exams/[id]/answer { question_index, answer_value }
→ 200 OK → next question
```

### Offline answer path
```
User submits answer (offline)
→ fetch throws NetworkError
→ offline/queue.ts catches it
→ Check: does idempotencyKey already exist in IDB queue? → skip if yes
→ enqueue({ type: 'answer', idempotencyKey: 'sess-abc-q7', body: '...', ... }) → write to IDB
→ Show subtle status: "Guardando localmente..." (non-blocking)
→ Render next question immediately — never block UX on network

Network reconnects (`window` fires 'online' event):
→ sync.ts drains queue FIFO
→ For each item: POST to original endpoint
→ Server UPSERT on (session_id, question_index): safe to replay
→ 200: remove item from IDB queue
→ 4xx (permanent client error): log + remove (don't retry)
→ 5xx / NetworkError: leave in queue; retry with backoff (1s → 2s → 4s → 8s → 32s max)
→ Show: "X respuestas sincronizadas" toast when queue drains
```

### Offline recording path
```
User records speaking answer (offline or upload fails)
→ POST /api/recordings fails
→ Store audio Blob in IDB 'offline-blobs' store (key: `blob-${sessionId}-p${promptIndex}`)
→ Enqueue { type: 'recording', blobKey: '...', endpoint: '/api/recordings', ... }
→ Show: "Grabación guardada. Se subirá cuando haya señal."

On reconnect:
→ sync.ts picks up recording queue items
→ Load Blob from IDB by blobKey
→ Reconstruct FormData({ session_id, prompt_index, audio: Blob, ... })
→ POST /api/recordings
→ On success: DELETE blob from IDB, remove queue item
→ On failure: leave both in queue for next retry
```

### Queue deduplication
Before any enqueue: check `idempotencyKey` in IDB queue — skip if already there.  
Server is also idempotent: `INSERT ... ON CONFLICT (session_id, question_index) DO NOTHING`.  
Double protection — no duplicate writes even if the page crashes between enqueue and the network call.

---

## File changes

### New files
| File | Purpose |
|------|---------|
| `src/lib/offline/queue.ts` | IDB queue manager: `enqueue`, `dequeue`, `getAll`, `remove`, `deduplicate` |
| `src/lib/offline/sync.ts` | Network state manager: listen for `online` event, drain queue, exponential backoff |
| `src/lib/offline/audio-store.ts` | Binary blob IDB store: `storeBlob(key, blob)`, `loadBlob(key)`, `deleteBlob(key)` |
| `src/lib/offline/db.ts` | IDB database init via `idb`; opens `offline-queue` + `offline-blobs` stores |
| `src/components/pwa/InstallPrompt.tsx` | Install prompt: Android (deferred `beforeinstallprompt`) + iOS (manual instruction sheet) |
| `src/app/offline/page.tsx` | Offline fallback page (cached by SW) |
| `public/icons/icon-192.png` | Real PNG — required for Lighthouse PWA audit |
| `public/icons/icon-512.png` | Real PNG — required for Lighthouse PWA audit |
| `public/icons/apple-touch-icon.png` | 180×180 PNG for iOS bookmark icon |
| `scripts/generate-tts-audio.ts` | One-time script: call OpenAI TTS for all 90 listening items → `public/audio/exam/` |

### Modified files
| File | Change |
|------|--------|
| `package.json` | Add `@ducanh2912/next-pwa`, `idb` |
| `next.config.mjs` | Wrap export with `withPWA({ dest: 'public', disable: process.env.NODE_ENV === 'development', cacheOnFrontEndNav: true, reloadOnOnline: true })` |
| `src/app/manifest.ts` | Reference real PNG icons; add `screenshots` array for enhanced Android install UI |
| `src/app/layout.tsx` | Import `<InstallPrompt />` (client component, lazy) |
| `src/app/exam/[id]/diagnostic/page.tsx` | Wrap POST calls: try fetch → on NetworkError, enqueue offline |
| `src/app/exam/[id]/listening/page.tsx` | Same pattern; also init `sync.ts` listener on mount |
| `src/app/exam/[id]/speaking/page.tsx` | iOS mime type detection; blob queuing on upload failure; mount `InstallPrompt` trigger |

---

## Failure modes (top 10)

### 1. Stale Next.js chunks served after Vercel redeploy
**Risk:** User has old JS bundle cached. After redeploy, new HTML references new chunk hashes. Mismatch causes hydration error or blank screen.  
**Prevention:** next-pwa generates a unique SW on each build (build ID in precache manifest). On activation, new SW calls `self.skipWaiting()` + `clients.claim()`. Add a `controllerchange` listener in the app:
```typescript
navigator.serviceWorker.addEventListener('controllerchange', () => {
  showToast('Nueva versión disponible'); // non-blocking
});
```
The toast offers a "Recargar" button. Don't force-reload — let user finish what they're doing.

### 2. iOS storage quota exhaustion mid-exam
**Risk:** iOS PWA default storage is ~50MB evictable. Five exam sessions with cached audio + app shell can hit this.  
**Prevention:**
- Call `navigator.storage.persist()` on exam start. iOS shows a permission dialog; user grants it; storage becomes non-evictable up to device capacity.
- Workbox `ExpirationPlugin`: purge audio cache entries older than 30 days.
- Keep IDB blobs lean: delete immediately after successful upload.

### 3. MediaRecorder unavailable (old iOS / restricted context)
**Risk:** `window.MediaRecorder` undefined on iOS < 14.3. On some Android WebViews (banking apps, in-app browsers), it's also missing.  
**Prevention:** Feature gate at the speaking section entry:
```typescript
if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
  return <FallbackScreen message="Tu navegador no soporta grabación. Abre en Safari o Chrome." />;
}
```
Never let the user hit the record button if it will throw.

### 4. IndexedDB blocked in iOS Private Browsing
**Risk:** iOS Safari Private Browsing disables IDB entirely. `openDB()` throws `SecurityError`.  
**Prevention:** Wrap all IDB init in try/catch in `src/lib/offline/db.ts`:
```typescript
try {
  db = await openDB('ih-offline', 1, { upgrade });
} catch (e) {
  db = null; // signal: offline queue unavailable
}
```
If `db === null`: skip queueing, show banner: "Modo privado detectado — sus respuestas no se guardarán si pierde conexión." Exam still works online.

### 5. Offline queue replays a request the server already processed
**Risk:** Request succeeded but network dropped before `200` arrived. SW retries → duplicate write.  
**Prevention:** Server endpoints already use idempotent UPSERTs:
- `diagnostic_answers`: `ON CONFLICT (session_id, question_index) DO NOTHING`
- `listening_answers`: same
- `speaking_recordings`: `ON CONFLICT (session_id, prompt_index) DO NOTHING`  
Replay is always safe. Queue idempotency key is a second layer.

### 6. `beforeinstallprompt` fired before capture, lost forever
**Risk:** If the `beforeinstallprompt` event fires before we attach a listener (e.g., script loads late), Chrome won't fire it again for 90 days after a dismiss.  
**Prevention:** Capture in `layout.tsx` root (earliest possible, synchronous):
```typescript
// In a "use client" root component, useEffect runs immediately:
useEffect(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptRef.current = e; // save for later
  });
}, []);
```
The actual `prompt()` call happens at speaking section mount — well after capture.

### 7. `@ducanh2912/next-pwa` incompatibility with Next.js 14.x minor update
**Risk:** A Next.js patch release changes build output structure; next-pwa breaks.  
**Prevention:** Pin `@ducanh2912/next-pwa` to an exact version tested against `next@14.2.18`. next-pwa has a `disable: true` flag — add it to `withPWA` config so we can turn off the SW in an emergency without a code change (just redeploy with `DISABLE_PWA=true` env var):
```typescript
withPWA({ disable: process.env.DISABLE_PWA === 'true' || process.env.NODE_ENV !== 'production' })
```

### 8. Workbox precache bloats install payload
**Risk:** If audio files are added to precache, the SW install payload becomes 10-50MB. First visit stalls. iOS shows "Storage full" prompt.  
**Prevention:** Audio files MUST NOT be precached. They use runtime CacheFirst (lazy — cached on first access, not at install). Only precache the app shell (HTML skeleton, critical CSS, critical JS ≈ ~500KB total). Verify with Chrome DevTools → Application → Service Workers → Storage.

### 9. SW intercepts `/api/*` calls, breaking Vercel Edge routing
**Risk:** A catch-all SW fetch handler intercepts API calls that Vercel routes to Edge Functions. Response format mismatch or CORS errors.  
**Prevention:** Explicitly exclude `/api/*` from SW:
```typescript
// In next.config.mjs withPWA config:
runtimeCaching: [
  { urlPattern: /^\/api\//, handler: 'NetworkOnly' },
  // ... other rules
]
```
The offline queue lives entirely in page-level JS (React + IDB). The SW never touches API requests.

### 10. Lighthouse fails on dynamically-generated icon routes
**Risk:** Current icons are `src/app/icon.tsx` and `apple-icon.tsx` — Next.js dynamic image routes that return SVG/PNG at runtime. Lighthouse PWA audit requires manifest icons to resolve to real cacheable PNG files at predictable static paths.  
**Prevention:** Add real PNG files to `public/icons/`. Update `manifest.ts`:
```typescript
icons: [
  { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  { src: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
]
```
Keep the dynamic `icon.tsx` and `apple-icon.tsx` routes — they still serve the browser tab favicon and `<link rel="apple-touch-icon">` correctly. The manifest just also needs the static PNGs.

---

## Lighthouse PWA ≥ 90 checklist

| Criterion | Current status | Fix |
|-----------|---------------|-----|
| Registers a service worker | ❌ None | Add next-pwa |
| SW responds with 200 when offline | ❌ | Precache `/offline` fallback |
| `start_url` loads offline | ❌ | Precache `/` |
| Installability: valid manifest | ✅ Mostly | Add real PNG icons |
| Maskable icon 512×512 | ✅ Manifest references it | Must be real PNG |
| `theme_color` defined | ✅ `#2B1D14` | Nothing needed |
| `background_color` defined | ✅ `#F5F0E6` | Nothing needed |
| `display: standalone` | ✅ | Nothing needed |
| Short name ≤ 12 chars | ✅ "Inglés Hote" = 11 | Nothing needed |
| HTTPS | ✅ Vercel | Nothing needed |
| No content wider than viewport | Check on 360px Android | Test on Moto G |

---

## iOS Safari + Chrome Android quirks checklist

| Quirk | Handled | How |
|-------|---------|-----|
| No `beforeinstallprompt` on iOS | ✅ | Custom instruction bottom sheet |
| `audio/mp4` only for MediaRecorder | ✅ | `getSupportedAudioMimeType()` at recording start |
| IDB storage quota ~50MB | ✅ | `navigator.storage.persist()` on exam start |
| No Background Sync | ✅ | `window.addEventListener('online', ...)` in exam pages |
| IDB disabled in Private Browsing | ✅ | try/catch + sessionStorage fallback + banner |
| `safe-area-inset-*` (notch, home bar) | ✅ | `viewportFit: cover` already in `layout.tsx` |
| Audio autoplay blocked | ✅ | All audio triggered by explicit user gesture |
| SW update shows stale content | ✅ | `controllerchange` toast with reload option |
| Chrome Android: address bar height shift | Verify | Test with `100dvh` instead of `100vh` in exam layout |

---

## Observability hooks

Log to `analytics_events` via `navigator.sendBeacon` (non-blocking, survives page unload):

| Event type | When |
|------------|------|
| `sw_installed` | Service worker activates for first time |
| `sw_updated` | New service worker takes control |
| `offline_answer_queued` | An answer is stored in IDB offline queue |
| `offline_recording_queued` | A recording blob is stored in IDB |
| `offline_queue_synced` | Queue drains successfully on reconnect |
| `offline_queue_item_failed` | Item exhausts retries (permanent failure) |
| `install_prompt_shown` | Install prompt displayed |
| `install_prompt_accepted` | User added to home screen (Android) |
| `storage_persist_granted` | `navigator.storage.persist()` approved |
| `mediarecorder_unavailable` | Feature gate blocked speaking section |

---

## Cost estimates

PWA infrastructure adds $0 at any scale. Audio CDN is the only variable:

| Tier | Audio files | CDN egress/mo | Cost |
|------|-------------|---------------|------|
| 10K users | 90 files × ~200KB = 18MB total; cached aggressively | ~negligible | $0 |
| 100K users | Same files; Cloudflare R2 CDN | ~100GB × $0.015/GB | ~$2 |
| 1M users | Same files | ~1TB × $0.015/GB | ~$15 |

TTS pre-generation one-time cost: 90 files × ~500 chars each ≈ 45,000 chars. OpenAI TTS: $0.015/1K chars = **~$0.68 total**.

---

## Acceptance criteria

- [ ] Lighthouse PWA score ≥ 90 (Chrome DevTools, mobile preset, on Vercel preview URL)
- [ ] Exam completes fully offline: submit 13 diagnostic + 10 listening answers while Chrome DevTools → Network → Offline; answers sync after re-enabling network
- [ ] No duplicate server writes after offline queue replay (verify via Supabase Table Editor row counts)
- [ ] iOS 16 Safari: exam completes, speaking records successfully as `audio/mp4`, install instruction sheet appears at speaking section
- [ ] Android Chrome: `beforeinstallprompt` captured; install banner fires at speaking section (not on page load)
- [ ] IDB unavailable (Private Browsing): exam works online; no crash; banner shown
- [ ] MediaRecorder unavailable: fallback screen shown instead of crash
- [ ] `navigator.storage.persist()` called on exam start (verify in DevTools → Application → Storage)
- [ ] SW update: "Nueva versión disponible" toast shown within 30 seconds of a Vercel redeploy
- [ ] Audio files (`/audio/exam/*`) served from cache on second visit (Network tab shows `(ServiceWorker)`)
- [ ] `/offline` page loads with no network connection
