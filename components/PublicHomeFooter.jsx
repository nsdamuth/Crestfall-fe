import Link from "next/link";

function PublicHomeFooter() {
  return (
    <footer className="border-t border-[var(--gold-ornament)]/20 px-[var(--space-6)] py-[var(--space-10)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-ornament)]">
            Crestfall Chronicles
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
            A dark fantasy creator platform for characters, stories, visual
            assets, public profiles, and playable rooms.
          </p>
        </div>

        <nav
          aria-label="Legal and support"
          className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]"
        >
          <Link href="/privacy" className="transition hover:text-[var(--ink)]">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition hover:text-[var(--ink)]">
            Terms of Service
          </Link>
          <Link href="/legal" className="transition hover:text-[var(--ink)]">
            Legal
          </Link>
          <Link href="/contact" className="transition hover:text-[var(--ink)]">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}