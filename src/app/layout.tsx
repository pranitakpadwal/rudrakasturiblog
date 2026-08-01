import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rudra Kasturi",
    template: "%s | Rudra Kasturi",
  },
  description: "Search. Strategy. AI. Growth. Coach. Revenue.",
  metadataBase: new URL("https://blog.rudrakasturi.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Rudra Kasturi
            </Link>
            <nav className="flex gap-5 text-sm text-neutral-600">
              <Link href="/about-rudra-kasturi" className="hover:text-neutral-900">
                About
              </Link>
              <Link href="/contact-rudrakasturi" className="hover:text-neutral-900">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Rudra Kasturi
        </footer>
      </body>
    </html>
  );
}
