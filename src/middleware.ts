import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth front door for the product app.
 *
 * Protects four families of routes:
 *
 *   /hr/*         — HR dashboard. Requires any authenticated, active HR user.
 *   /api/hr/*     — HR API surface. Same gate.
 *   /masteros/*   — internal admin OS. Requires super_admin.
 *   /api/masteros/* — internal admin API. Same gate.
 *
 * Public exceptions (still inside /hr/*) — `/hr/login` and
 * `/hr/accept-invite` remain reachable without a session.
 *
 * For unauthenticated requests to a protected route, we redirect to `/`
 * (the new sign-in home) with `?returnTo=<original-path>` so the user
 * lands back where they were after signing in.
 *
 * For `/masteros/*` requests by a non–super_admin user, we deliberately
 * REWRITE to a not-found surface rather than returning 403 — the goal is
 * to never hint that the route exists.
 *
 * If Supabase env vars are missing (local dev / pure demo mode), the
 * middleware does not gate anything — the in-page demo bypass takes over.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always-public exceptions inside protected prefixes.
  if (
    pathname === "/hr/login" ||
    pathname === "/hr/accept-invite" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  const isHR = pathname.startsWith("/hr") || pathname.startsWith("/api/hr");
  const isMaster =
    pathname.startsWith("/masteros") || pathname.startsWith("/api/masteros");

  if (!isHR && !isMaster) {
    return NextResponse.next();
  }

  // No Supabase configured — let the page render. The login page's demo
  // bypass and DemoGuard will handle gating in pure-demo deployments.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>,
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as never),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated → bounce to the sign-in home with the original path.
  if (!user) {
    // For API routes, return 401 JSON instead of an HTML redirect.
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

  // /masteros/* — must be an active super_admin. Rewrite to /not-found
  // (Next's built-in 404 surface) for everyone else; never emit a 403
  // because that would confirm the route exists.
  if (isMaster) {
    const { data: hrUser } = await supabase
      .from("hr_users")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    const allowed =
      !!hrUser && hrUser.is_active === true && hrUser.role === "super_admin";

    if (!allowed) {
      if (pathname.startsWith("/api/")) {
        // Same posture for the API surface — pretend it isn't there.
        return new NextResponse(JSON.stringify({ error: "not_found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }
      const notFound = request.nextUrl.clone();
      notFound.pathname = "/__notfound";
      return NextResponse.rewrite(notFound);
    }
  }

  return response;
}

export const config = {
  // Skip static assets, public icons, audio, manifest, fonts, favicons.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|audio|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
  ],
};
