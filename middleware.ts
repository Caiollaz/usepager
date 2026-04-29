import { NextRequest, NextResponse } from "next/server";

const appRoutes = ["/admin", "/dashboard", "/editor", "/projects", "/templates", "/preview", "/uploads"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("x-frame-options", "SAMEORIGIN");
  response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");

  if (appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)) && !hasSessionCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(url, { headers: response.headers });
  }

  if (authRoutes.includes(pathname) && hasSessionCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";

    return NextResponse.redirect(url, { headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("better-auth.session_token")?.value
      || request.cookies.get("__Secure-better-auth.session_token")?.value
      || request.cookies.get("better-auth-session_token")?.value
      || request.cookies.get("__Secure-better-auth-session_token")?.value,
  );
}
