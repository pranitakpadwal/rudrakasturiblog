import Link from "next/link";
import { categorySlug } from "@/lib/content";

export default function SiteFooter({ categories }: { categories: string[] }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
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
        </div>
        <div className="mt-12 border-t border-line pt-6 text-xs text-ink-soft">
          © {new Date().getFullYear()} Rudra Kasturi
        </div>
      </div>
    </footer>
  );
}
