import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const url = request.nextUrl;

  // Extract locale from the path if present. Next-intl routing uses /en, /es etc.
  const localeMatch = url.pathname.match(/^\/([a-zA-Z-]+)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  const isApiRoute =
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/trpc") ||
    url.pathname.startsWith("/__clerk");

  // Basic check to see if the user is authenticated and we are not on an API route
  if (userId && !isApiRoute) {
    if (url.pathname === `/${locale}`) {
      // Basic redirect from landing page to dashboard for authenticated users.
      // (The dashboard component itself will check Convex database to see if they need onboarding)
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  if (isApiRoute) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
