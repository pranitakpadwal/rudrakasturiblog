import Link from "next/link";
import { categorySlug } from "@/lib/content";
import MobileMenu from "@/components/MobileMenu";
import SiteSearch from "@/components/SiteSearch";

export default function SiteHeader({ categories }: { categories: string[] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-base font-semibold text-paper">
            R
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Rudra Kasturi
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/category/${categorySlug(c)}`}
              className="transition hover:text-accent"
            >
              {c}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <SiteSearch />
          <Link
            href="/contact-rudrakasturi"
            className="rounded-full border border-ink px-4 py-1.5 text-sm text-ink transition hover:bg-ink hover:text-paper"
          >
            Contact
          </Link>
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
}
