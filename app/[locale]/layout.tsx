import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Energulator — Smart Energy Savings",
    template: "%s | Energulator",
  },
  description:
    "Find your optimal energy tariff and start saving immediately. Energulator analyses your bill and matches you with the best rate.",
  keywords: ["energy savings", "energy tariff", "electricity bill", "energy comparison", "smart tariff"],
  authors: [{ name: "Energulator" }],
  creator: "Energulator",
  applicationName: "Energulator",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Energulator",
    startupImage: [
      {
        url: "/apple-touch-icon.png",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/android-chrome-512x512.png", color: "#2d5a27" },
    ],
  },
  openGraph: {
    type: "website",
    title: "Energulator — Smart Energy Savings",
    description: "Find your optimal energy tariff and start saving immediately.",
    siteName: "Energulator",
  },
  twitter: {
    card: "summary",
    title: "Energulator — Smart Energy Savings",
    description: "Find your optimal energy tariff and start saving immediately.",
  },
  formatDetection: {
    telephone: false,   // Prevents iOS auto-linking phone numbers
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,        // Allow pinch-zoom for accessibility
  userScalable: true,
  viewportFit: "cover",  // Enables safe-area env() on iOS (notch/Dynamic Island)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2d5a27" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3d1b" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Clerk appearance — forest green theme matching the onboarding design
const clerkAppearance = {
  variables: {
    colorPrimary: "#2d5a27",
    colorBackground: "#ffffff",
    colorText: "#1a1a1a",
    colorTextSecondary: "#555555",
    colorInputBackground: "#ffffff",
    colorInputText: "#1a1a1a",
    borderRadius: "1rem",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    fontSize: "18px",
  },
  elements: {
    card: "shadow-2xl shadow-[#2d5a27]/10 border border-white/60 backdrop-blur-xl",
    headerTitle: "text-2xl font-black text-[#1a1a1a]",
    headerSubtitle: "text-base text-[#555]",
    formButtonPrimary:
      "bg-[#2d5a27] hover:bg-[#1e3d1b] text-white font-bold text-lg rounded-2xl py-4 transition-all",
    socialButtonsBlockButton:
      "border-2 border-[#1a1a1a]/15 hover:border-[#2d5a27] rounded-2xl font-bold text-[#1a1a1a] text-base py-3 transition-all",
    footerActionLink: "text-[#2d5a27] font-bold hover:text-[#1e3d1b]",
    formFieldInput:
      "border-2 border-[#2d5a27]/20 focus:border-[#2d5a27] rounded-xl text-lg py-3 px-4",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ka")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <ClerkProvider
          appearance={clerkAppearance}
          signInUrl={`/${locale}/sign-in`}
          signUpUrl={`/${locale}/sign-up`}
          signInFallbackRedirectUrl={`/${locale}/onboarding`}
          signUpFallbackRedirectUrl={`/${locale}/onboarding`}
          afterSignOutUrl={`/${locale}`}
        >
          <NextIntlClientProvider messages={messages}>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
