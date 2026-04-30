import { NextRequest, NextResponse } from "next/server";

const appRoutes = ["/admin", "/dashboard", "/editor", "/projects", "/templates", "/preview", "/uploads"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const subdomainRewrite = getSubdomainRewrite(request);
  if (subdomainRewrite) {
    // Don't rewrite internal API or Next.js routes accessed via subdomain
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
      const passthrough = NextResponse.next();
      setSecurityHeaders(passthrough);
      return passthrough;
    }
    const url = request.nextUrl.clone();
    url.pathname = subdomainRewrite;
    const rewriteResponse = NextResponse.rewrite(url);
    setSecurityHeaders(rewriteResponse);
    return rewriteResponse;
  }

  const response = NextResponse.next();
  setSecurityHeaders(response);

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

function setSecurityHeaders(response: NextResponse) {
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("x-frame-options", "SAMEORIGIN");
  response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
}

function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("better-auth.session_token")?.value
      || request.cookies.get("__Secure-better-auth.session_token")?.value
      || request.cookies.get("better-auth-session_token")?.value
      || request.cookies.get("__Secure-better-auth-session_token")?.value,
  );
}

/**
 * Detects subdomain requests and returns the rewritten path to /sites/{subdomain}/...
 *
 * In development:  meusite.localhost:3000/about  → /sites/meusite/about
 * In production:   meusite.exemplo.com/about     → /sites/meusite/about
 *
 * The app host itself (app.exemplo.com, localhost:3000, or the bare domain) is not rewritten.
 */
function getSubdomainRewrite(request: NextRequest): string | null {
  const baseDomain = process.env.SITE_BASE_DOMAIN;
  if (!baseDomain) return null;

  const host = request.headers.get("host")?.split(":")[0] ?? "";
  if (!host) return null;

  // Bare domain or app subdomain — not a published site
  if (host === baseDomain || host === `app.${baseDomain}`) return null;

  let subdomain: string | null = null;

  if (baseDomain === "localhost") {
    // {sub}.localhost
    if (host.endsWith(".localhost") && host !== "localhost") {
      subdomain = host.slice(0, -".localhost".length);
    }
  } else {
    // {sub}.exemplo.com
    if (host.endsWith(`.${baseDomain}`)) {
      subdomain = host.slice(0, -(baseDomain.length + 1));
    }
  }

  if (!subdomain || subdomain === "app" || subdomain === "www") return null;

  const { pathname } = request.nextUrl;
  return `/sites/${subdomain}${pathname}`;
}
