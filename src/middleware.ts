import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth front door for the product app.
 *
 * Protects:
 *   /hr/*  /api/hr/*          — any authenticated, active HR user
 *   /masteros/*  /api/masteros/* — super_admin only
 *
 * Public exceptions: /hr/login, /hr/accept-invite, /api/auth/*.
 *
 * WHY A LOCAL COOKIE CHECK (not supabase.auth.getUser):
 * The middleware runs on Netlify's Edge runtime. supabase.auth.getUser()
 * makes a network revalidation call to GoTrue that is unreliable from
 * Edge (proven in QA: getUser() returns the user fine from a Node
 * route — /api/debug/whoami — with the exact same cookie, but null
 * from Edge middleware, bouncing every authenticated request).
 *
 * Supabase's own guidance: do the authoritative check with getUser()
 * in the page/route (Node runtime), and keep middleware to a cheap
 * gate. So here we only verify a NON-EXPIRED Supabase session cookie
 * is present + decode its `sub`/role-free payload locally (no network).
 * The page-level requireHRUser() / requireSuperAdmin() (Node runtime,
 * getUser works there) perform the real identity + role enforcement,
 * including the super_admin → /__notfound rewrite for /masteros.
 */

/**
 * Base64 → UTF-8 string, EDGE-SAFE (no Node `Buffer` — it does not
 * exist in the Netlify Edge runtime; using it throws and silently
 * invalidated every session, which was THE bug). Uses Web `atob`
 * + TextDecoder.
 */
function b64ToUtf8(b64: string): string {
  // Normalize base64url → base64 + pad.
  let s = b64.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

function decodeSupabaseCookie(raw: string | undefined): {
  valid: boolean;
  sub?: string;
} {
  if (!raw) return { valid: false };
  try {
    // @supabase/ssr 0.5.x stores the session as `base64-<base64(JSON)>`.
    let json = raw;
    if (raw.startsWith("base64-")) {
      json = b64ToUtf8(raw.slice("base64-".length));
    }
    const session = JSON.parse(json) as {
      access_token?: string;
      expires_at?: number;
    };
    if (!session.access_token) return { valid: false };

    // Trust expires_at when present; otherwise decode the JWT exp.
    let exp = session.expires_at;
    let sub: string | undefined;
    if (!exp) {
      const payload = session.access_token.split(".")[1];
      if (!payload) return { valid: false };
      const decoded = JSON.parse(b64ToUtf8(payload)) as {
        exp?: number;
        sub?: string;
      };
      exp = decoded.exp;
      sub = decoded.sub;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    return { valid: typeof exp === "number" && exp > nowSec, sub };
  } catch {
    return { valid: false };
  }
}

function readSessionCookie(request: NextRequest): {
  valid: boolean;
} {
  // Single cookie, or chunked into .0/.1 when large. Reassemble.
  const all = request.cookies.getAll();
  const base = all.find(
    (c) => /^sb-.*-auth-token$/.test(c.name) && !/\.\d+$/.test(c.name),
  );
  if (base) return decodeSupabaseCookie(base.value);

  const chunks = all
    .filter((c) => /^sb-.*-auth-token\.\d+$/.test(c.name))
    .sort((a, b) => {
      const ai = Number(a.name.split(".").pop());
      const bi = Number(b.name.split(".").pop());
      return ai - bi;
    });
  if (chunks.length > 0) {
    return decodeSupabaseCookie(chunks.map((c) => c.value).join(""));
  }
  return { valid: false };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/hr/login" ||
    pathname === "/hr/accept-invite" ||
    pathname === "/masteros/login" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  const isHR = pathname.startsWith("/hr") || pathname.startsWith("/api/hr");
  const isMaster =
    pathname.startsWith("/masteros") || pathname.startsWith("/api/masteros");

  if (!isHR && !isMaster) return NextResponse.next();

  // Pure-demo deployments (no Supabase env) — don't gate; in-page
  // DemoGuard / demo bypass handles it.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  const { valid } = readSessionCookie(request);

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    const home = request.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    home.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(home);
  }

  // Authenticated session present. The authoritative identity + role
  // check (incl. super_admin gating for /masteros and the
  // /__notfound rewrite) happens in the page/route via
  // requireHRUser() / requireSuperAdmin(), which run on the Node
  // runtime where supabase.auth.getUser() is reliable.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|audio|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
  ],
};
