import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Routes that signed-in users should NOT be redirected away from
const AUTH_ROUTES = ["/sign-in", "/sign-up", "/onboarding", "/sso-callback"];

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const url = request.nextUrl;

  const isApiRoute =
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/trpc") ||
    url.pathname.startsWith("/__clerk");

  if (isApiRoute) {
    return NextResponse.next();
  }

  // Detect locale by checking the first path segment against supported locales
  const segments = url.pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const locale = (routing.locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale;

  // The path after stripping the locale prefix
  const pathWithoutLocale = segments.slice(locale === firstSegment ? 1 : 0).join("/");

  const isAuthRoute = AUTH_ROUTES.some((r) =>
    pathWithoutLocale.startsWith(r.replace("/", ""))
  );

  // Redirect authenticated users away from the bare landing page to dashboard
  // but NOT away from auth/onboarding routes (avoid redirect loops)
  if (userId && !isAuthRoute) {
    const isLanding = url.pathname === `/${locale}` || url.pathname === "/";
    if (isLanding) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|riv|gltf|glb|bin)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
