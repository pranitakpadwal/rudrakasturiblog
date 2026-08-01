import Link from "next/link";
import { categorySlug } from "@/lib/content";

const ELSEWHERE = [
  { label: "LinkedIn", href: "https://linkedin.com/in/rudrakasturi" },
  { label: "AppStudioX", href: "https://appstudiox.com" },
  { label: "AI Vidhyarthi", href: "https://aividhyarthi.org" },
  { label: "HerMidLife", href: "https://hermidlife.org" },
  { label: "AppRankr (ASO tool)", href: "https://apprankr.in" },
];

const GOOGLE_PREFERRED_SOURCE_URL =
  "https://www.google.com/preferences/source?q=https://blog.rudrakasturi.com/";

export default function SiteFooter({ categories }: { categories: string[] }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-paper">
                R
              </span>
              <span className="font-display text-base font-semibold text-ink">
                Rudra Kasturi
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Search. Strategy. AI. Growth. Coach. Revenue. Writing on SEO,
              AEO, and how AI is rewriting the rules of search.
            </p>
            <a
              href={GOOGLE_PREFERRED_SOURCE_URL}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft transition hover:border-accent hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Follow on Google
            </a>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
              Explore
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-soft">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${categorySlug(c)}`}
                    className="transition hover:text-accent"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
              Site
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/about-rudra-kasturi" className="transition hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact-rudrakasturi" className="transition hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="transition hover:text-accent">
                  Terms
                </Link>
              </li>
              <li>
                <a href="/llms.txt" className="transition hover:text-accent">
                  llms.txt
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
              Elsewhere
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-soft">
              {ELSEWHERE.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="transition hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-6 text-xs text-ink-soft">
          © {new Date().getFullYear()} Rudra Kasturi
        </div>
      </div>
    </footer>
  );
}
