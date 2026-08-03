import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[rgba(5,5,4,0.92)] px-6 py-10 text-[var(--muted)] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.45em] text-[var(--muted-gold)]">
            Crestfall Chronicles
          </p>
          <p className="mt-3 max-w-xl font-serif text-base leading-7">
            A dark fantasy lore archive of records, fragments, histories,
            characters, places, and unfolding stories.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav className="flex flex-wrap gap-5 font-display text-xs uppercase tracking-[0.25em]">
            <Link href="/lore" className="hover:text-[var(--foreground)]">
              Lore
            </Link>
            <Link href="/characters" className="hover:text-[var(--foreground)]">
              Characters
            </Link>
            <Link href="/locations" className="hover:text-[var(--foreground)]">
              Locations
            </Link>
            <Link href="/factions" className="hover:text-[var(--foreground)]">
              Factions
            </Link>
            <Link href="/stories" className="hover:text-[var(--foreground)]">
              Stories
            </Link>
            <Link href="/chronicle" className="hover:text-[var(--foreground)]">
              Chronicle
            </Link>
          </nav>

          <nav
            aria-label="Legal and support"
            className="flex flex-wrap gap-5 font-display text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]"
          >
            <Link href="/terms/privacy-policy" className="hover:text-[var(--foreground)]">
              Privacy Policy
            </Link>
            <Link href="/terms/service" className="hover:text-[var(--foreground)]">
              Terms of Service
            </Link>
            <Link href="/terms" className="hover:text-[var(--foreground)]">
              Policies
            </Link>
            <Link href="/contact" className="hover:text-[var(--foreground)]">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}