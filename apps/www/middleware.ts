import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth-token";

function getAccountSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/accounts\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function isValidAccountSlug(slug: string | null): boolean {
  if (!slug || slug.trim().length === 0) {
    return false;
  }
  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  return slugRegex.test(slug);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const accountSlug = getAccountSlugFromPathname(pathname);

  if (accountSlug && !isValidAccountSlug(accountSlug)) {
    return NextResponse.json({ message: "Invalid account slug format" }, { status: 400 });
  }

  const isAccountRoute = pathname.startsWith("/accounts/");
  const isPublicAccountRoute =
    isAccountRoute &&
    (pathname.includes("/login") ||
      pathname.includes("/forgot-password") ||
      pathname.includes("/reset-password"));

  if (isPublicAccountRoute) {
    return NextResponse.next();
  }

  if (isAccountRoute) {
    const authToken = request.cookies.get(COOKIE_NAME);
    if (!authToken) {
      const loginUrl = new URL(`/accounts/${accountSlug}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// middleware.ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
