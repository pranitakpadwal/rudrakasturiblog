import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getTopCategories } from "@/lib/content";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-51ZDEXDSP8";
const ADSENSE_CLIENT_ID = "ca-pub-2121262893172079";
const GOOGLE_SITE_VERIFICATION = "sxPoZT3xoLuLLAEMqhOPd_IGbac5xcnxQdckPe7_Gp0";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rudra Kasturi — Search. Strategy. AI. Growth.",
    template: "%s | Rudra Kasturi",
  },
  description: "Search. Strategy. AI. Growth. Coach. Revenue.",
  metadataBase: new URL("https://blog.rudrakasturi.com"),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
  alternates: {
    types: {
      "text/plain": "/llms.txt",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topCategories = getTopCategories(5);

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="llms-sitemap" href="/llms.txt" />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
        />
        <SiteHeader categories={topCategories} />
        <main className="flex-1">{children}</main>
        <SiteFooter categories={topCategories} />
      </body>
    </html>
  );
}
