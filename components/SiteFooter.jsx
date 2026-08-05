import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line-strong)] bg-[rgba(5,5,4,0.92)] px-[var(--space-6)] py-[var(--space-10)] text-[var(--ink-dim)] sm:px-[var(--space-10)] lg:px-[var(--space-16)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.45em] text-[var(--gold-ornament)]">
            Crestfall Chronicles
          </p>
          <p className="mt-3 max-w-xl font-serif text-base leading-7">
            A dark fantasy lore archive of records, fragments, histories,
            characters, places, and unfolding stories.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav className="flex flex-wrap gap-5 font-display text-xs uppercase tracking-[0.25em]">
            <Link href="/lore" className="hover:text-[var(--ink)]">
              Lore
            </Link>
            <Link href="/characters" className="hover:text-[var(--ink)]">
              Characters
            </Link>
            <Link href="/locations" className="hover:text-[var(--ink)]">
              Locations
            </Link>
            <Link href="/factions" className="hover:text-[var(--ink)]">
              Factions
            </Link>
            <Link href="/stories" className="hover:text-[var(--ink)]">
              Stories
            </Link>
            <Link href="/chronicle" className="hover:text-[var(--ink)]">
              Chronicle
            </Link>
          </nav>

          <nav
            aria-label="Legal and support"
            className="flex flex-wrap gap-5 font-display text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]"
          >
            <Link href="/terms/privacy-policy" className="hover:text-[var(--ink)]">
              Privacy Policy
            </Link>
            <Link href="/terms/service" className="hover:text-[var(--ink)]">
              Terms of Service
            </Link>
            <Link href="/terms" className="hover:text-[var(--ink)]">
              Policies
            </Link>
            <Link href="/contact" className="hover:text-[var(--ink)]">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}