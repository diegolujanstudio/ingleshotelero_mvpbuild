# Getting Started — for Diego

Written for you, the operator — not for a developer. You won't write code; you'll *run* code that's already written. Every step is copy-paste ready.

By the end you'll have:

1. The site running on your own laptop (`localhost`)
2. The site live on the internet on a free Vercel URL (`ingles-hotelero.vercel.app`)
3. A proper domain pointing at it (`ingleshotelero.com`)
4. A Supabase database connected (for when you turn the exam on)

Total time: **~2 hours**, split into stages you can do on different days.

---

## Before you start — the accounts you'll need

Open these tabs and create an account in each. **All have free tiers that are enough to launch.**

| # | Service      | What it does                              | URL |
|---|--------------|--------------------------------------------|-----|
| 1 | **GitHub**   | Stores the code online                     | https://github.com/signup |
| 2 | **Vercel**   | Hosts the site (free)                      | https://vercel.com/signup — sign in *with GitHub* |
| 3 | **Supabase** | Database (later, Stage D)                  | https://supabase.com — skip for now |

Optional but recommended:
- **Cursor** or **Visual Studio Code** — free code editor. Useful if you want to peek at or edit any file. Not required. https://cursor.com

---

## STAGE A — Run the site on your computer (~15 min)

### A.1 · Install Node.js

Node is the program that runs the site. Without it, nothing starts.

1. Go to https://nodejs.org
2. Download the **LTS** version (the big green button on the left).
3. Run the installer — next, next, next.
4. Confirm it installed by opening a terminal:
   - **Mac:** press `Cmd + Space`, type `Terminal`, Enter.
   - **Windows:** press the Windows key, type `PowerShell`, Enter.
5. Paste this and press Enter:

   ```
   node -v
   ```

   You should see something like `v20.11.0`. Any number 18 or higher is fine. If you see an error, close the terminal, reopen, try again.

### A.2 · Navigate to the project folder

The folder you selected in Cowork ("Ingles Hotelero") is a real folder on your computer. You're going to enter it from the terminal.

**Mac:**
1. Open Finder and find the "Ingles Hotelero" folder.
2. In Terminal, type `cd ` (with a trailing space — *do not press Enter yet*).
3. Drag the folder from Finder into Terminal. The full path gets pasted for you.
4. Press Enter.

**Windows:**
1. Open File Explorer and find "Ingles Hotelero".
2. Right-click the folder → "Copy as path".
3. In PowerShell, type `cd ` then paste (`Ctrl+V`). Press Enter.

To confirm you're in the right place, type:

```
ls
```
(or `dir` on Windows). You should see `package.json`, `README.md`, `src`, `supabase`, etc.

### A.3 · Install the dependencies

Still in the terminal, inside the project folder, run:

```
npm install
```

This downloads ~400 MB of libraries the site needs. **It takes 1–3 minutes.** You'll see text streaming by — that's normal. It finishes when the cursor returns for the next command.

- Yellow `warnings`: ignore them.
- Red `errors`: screenshot and send to me.

### A.4 · Start the dev server

Run:

```
npm run dev
```

You should see something like:

```
  ▲ Next.js 14.2.18
  - Local:        http://localhost:3000
  - Ready in 1.2s
```

Open your browser and go to → **http://localhost:3000**

That's your landing page. The one written for hotel HR directors.

To preview the hotel exam entry, go to → **http://localhost:3000/e/gran-hotel-cancun** (any slug works — it renders in preview mode without a database).

**To stop it:** in the terminal, press `Ctrl + C`. Next time you want to see it, come back to the folder and run `npm run dev` again.

---

## STAGE B — Publish it to the internet (~20 min)

We're going to host the site on Vercel — a free platform made for Next.js apps. Five minutes after you set it up, you'll have a public URL like `ingles-hotelero-diego.vercel.app`.

### B.1 · Push the code to GitHub

GitHub is where the code lives online. Vercel reads from there.

1. Make sure you have an account at https://github.com
2. Install **GitHub Desktop** — easiest, no commands: https://desktop.github.com
3. Open GitHub Desktop, sign in with your account.
4. Top menu → `File` → `Add Local Repository…`
5. Select the "Ingles Hotelero" folder.
6. It'll say *"This directory does not appear to be a Git repository"* → click **`create a repository here instead`**.
7. Fill in:
   - **Name:** `ingles-hotelero`
   - **Description:** `Hotel English training platform`
   - **Local path:** already filled
   - **.gitignore:** `None` (the project already has one)
8. Click `Create Repository`.
9. Click `Publish repository` in the top-right.
   Keep "Keep this code private" checked if you want private, or uncheck for public. Vercel works with both on the free tier.
10. Click `Publish Repository`.

Now go to github.com — you'll see `ingles-hotelero` in your repos.

### B.2 · Connect Vercel

1. Go to https://vercel.com. If you haven't signed up, do it *with GitHub* (button "Continue with GitHub").
2. In the Vercel dashboard: `Add New…` → `Project`.
3. Vercel asks permission to read your GitHub repos → accept.
4. Find `ingles-hotelero` in the list → click `Import`.
5. On the configuration screen:
   - **Framework Preset:** auto-detected as Next.js. Don't change anything.
   - **Environment Variables:** leave blank for now (we fill these in Stage D).
6. Click `Deploy`.

Wait 1–2 minutes. When it finishes you'll see confetti 🎉 and a URL like `https://ingles-hotelero-abc123.vercel.app`.

**Click the URL.** That's your site, live on the internet, reachable from anywhere in the world.

### B.3 · Shipping future changes

When you edit something — say, wording in `src/content/landing.ts`:

1. Open GitHub Desktop. It shows you which files changed.
2. Bottom-left, write a short message (e.g., "Tighten hero copy").
3. Click `Commit to main`.
4. Click `Push origin`.

Vercel detects the push and redeploys automatically in ~1 minute. Your URL updates itself.

---

## STAGE C — Proper domain (~30 min + DNS propagation)

The Vercel URL works fine, but for hoteliers you want `ingleshotelero.com`.

### C.1 · Buy the domain

If you don't already have it:

1. Go to https://porkbun.com or https://namecheap.com (both cheap and reliable).
2. Search for `ingleshotelero.com`. If it's free, it costs about $10–15 USD/year.
3. Buy it. **Don't** pay for extras like "privacy protection" — Porkbun includes it free, Namecheap too in most TLDs.

### C.2 · Connect it to Vercel

1. In Vercel, open your project → `Settings` → `Domains`.
2. Type `ingleshotelero.com` → `Add`.
3. Vercel gives you DNS instructions. Two options:
   - **Option A — Change nameservers to Vercel's** (easier; Vercel manages everything).
   - **Option B — Keep your registrar's nameservers and add A + CNAME records manually.**
4. **Recommended: Option A**, unless you already have a mailbox or other service on that domain.
   - Copy the two nameservers Vercel shows you (they end in `.vercel-dns.com`).
   - In Porkbun/Namecheap → your domain → Nameservers → Custom → paste both.
   - Save.
5. Wait. DNS changes take 10 minutes to 2 hours to propagate. Vercel emails you when it's live.
6. Also add `www.ingleshotelero.com` in Domains — Vercel auto-redirects it.

Once active: **anyone typing ingleshotelero.com sees your site.**

---

## STAGE D — Database (~30 min, when you're ready)

You only need this when you want to activate `/e/[hotel-slug]` with real hotels instead of preview mode. You can skip this stage until you close your first pilot.

### D.1 · Create the Supabase project

1. Go to https://supabase.com and create a project:
   - **Name:** `ingles-hotelero`
   - **Database Password:** let Supabase generate one, **save it to your password manager**. You'll need it later.
   - **Region:** `East US (North Virginia)` or whichever is closest to Mexico.
   - **Pricing Plan:** Free (good for the first 500 employees).
2. Wait ~2 minutes while it provisions.

### D.2 · Run the SQL migration

The full schema is already in your project.

1. In Supabase, open `SQL Editor` (sidebar icon).
2. Click `New query`.
3. On your computer, open `supabase/migrations/0001_initial_schema.sql` (Cursor, VS Code, or any text editor).
4. Select all contents (`Cmd/Ctrl + A`, then `Cmd/Ctrl + C`).
5. Paste into Supabase's SQL Editor.
6. Click `Run`.
7. It should say `Success. No rows returned` or similar. If you get an error, screenshot it to me.

Verify: open `Table Editor`. You should see `organizations`, `properties`, `employees`, `exam_sessions`, and several more.

### D.3 · Copy credentials to Vercel

1. In Supabase → `Settings` → `API`. You'll see three values:
   - `Project URL` — e.g., `https://abcxyz.supabase.co`
   - `anon public` — a long key
   - `service_role` — another long key (**secret — never share**)
2. In Vercel → your project → `Settings` → `Environment Variables`.
3. Add these three one by one, checking all three environments (Production, Preview, Development):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the `anon public` key |
   | `SUPABASE_SERVICE_ROLE_KEY` | the `service_role` key |

4. `Save`.
5. Go to the `Deployments` tab → three dots on the most recent deploy → `Redeploy`. This is how it picks up the new variables.

### D.4 · Add your first hotel

1. In Supabase → `SQL Editor` → `New query`:

   ```sql
   insert into organizations (name, type) values ('My Pilot Hotel', 'independent');
   ```

   Click Run.

2. Then another query:

   ```sql
   insert into properties (organization_id, name, slug, city, country)
   values (
     (select id from organizations where name = 'My Pilot Hotel' limit 1),
     'Gran Hotel Cancún',
     'gran-hotel-cancun',
     'Cancún',
     'MX'
   );
   ```

3. Visit `https://ingleshotelero.com/e/gran-hotel-cancun` — it should say "Bienvenido a **Gran Hotel Cancún**." (no yellow preview banner).

---

## Installing the site on your phone

Because this is a Progressive Web App (PWA), employees and HR managers can install it to their home screen like a native app — no App Store, no Play Store.

**iPhone (Safari):**
1. Open `ingleshotelero.com` in Safari.
2. Tap the Share button (square with arrow up).
3. Scroll down → `Add to Home Screen`.
4. Icon lands on the home screen. Tapping it opens the app full-screen with no browser chrome.

**Android (Chrome):**
1. Open the site in Chrome.
2. Tap the three-dot menu → `Install app` (or `Add to Home screen`).
3. Icon on the home screen, full-screen launch.

This is the installation path you'll point employees to during onboarding. No downloads, no approvals.

---

## Troubleshooting

### `npm install` hangs or fails

- Check your internet connection.
- Try again: `npm install`. Sometimes one package fails the first time.
- If it keeps failing, delete the `node_modules` folder (if it exists) and the `package-lock.json` file, and run `npm install` again.

### `npm run dev` errors out

- Make sure you're in the right folder: `ls` (Mac) or `dir` (Windows) should show `package.json`.
- Port 3000 may be in use — in that case Next.js uses 3001. Read the message.

### Vercel deploys but the page is blank

- Open the browser console (F12 in Chrome → Console). There's a red error that'll help me diagnose. Send me a screenshot.

### Domain still not connecting after 2 hours

- Nameservers sometimes take up to 48 hours. After that, check https://dnschecker.org/ — your domain's nameservers should be pointing at `.vercel-dns.com`.

### `/e/something` still shows "preview mode" after configuring Supabase

- Double-check that all three env vars are set in Vercel (nothing missed).
- Make sure you clicked `Redeploy` after adding them — they don't apply automatically.
- Confirm the slug exists in `properties` (Supabase Table Editor).

---

## Weekly rhythm once you're live

**To edit copy:**
1. Open `src/content/landing.ts` in Cursor / VS Code / even Notepad.
2. Change the text.
3. Save.
4. In GitHub Desktop: commit → push.
5. Vercel redeploys in ~1 minute.

**To add a new hotel:**
1. Supabase → SQL Editor → insert into `properties` like in D.4.
2. Hand the HR director the URL: `https://ingleshotelero.com/e/their-slug-here`.

**To read incoming leads (from the mailto):**
1. Check `hola@ingleshotelero.com`.
2. Emails arrive with the form fields pre-structured — easy to triage.

---

## What's next

Stage A leaves you with a local site. Stage B puts it on the internet. Stages C and D make it truly yours.

After this, the next layers of the product (the exam that reads and scores voice, the HR dashboard, WhatsApp, Stripe billing) get added in **subsequent Claude Code sessions**, each reading the plan in `.orcha/phase-2-exam-flow.md` and onward. Every session is another conversation like this one.

You're ready.

— the team
