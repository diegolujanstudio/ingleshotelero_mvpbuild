import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth middleware — protects /hr/* routes.
 *
 * 1. Refreshes the Supabase JWT (auto-rotates before expiry).
 * 2. If not authenticated → redirect to /hr/login?returnTo=<path>.
 * 3. /hr/login itself is public (so you can actually log in).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Don't protect the login page itself or the accept-invite page.
  if (pathname === "/hr/login" || pathname === "/hr/accept-invite") {
    return NextResponse.next();
  }

  // Only protect /hr/* routes.
  if (!pathname.startsWith("/hr")) {
    return NextResponse.next();
  }

  // No Supabase configured: let the page render (local dev / demo mode).
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
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
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

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/hr/login";
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/hr/:path*"],
};
