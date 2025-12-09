import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/en/login", "/en/register"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Protected routes that require authentication
  const protectedRoutes = ["/favorites", "/en/favorites", "/my-properties", "/en/my-properties", "/add-property", "/en/add-property"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/en/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already logged in and trying to access login/register, redirect to home
  if (isPublicRoute && pathname !== "/" && pathname !== "/en") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en)/:path*"],
};
