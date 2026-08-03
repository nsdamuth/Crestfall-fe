import Link from "next/link";

function PublicHomeFooter() {
  return (
    <footer className="border-t border-[var(--muted-gold)]/20 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Crestfall Chronicles
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            A dark fantasy creator platform for characters, stories, visual
            assets, public profiles, and playable rooms.
          </p>
        </div>

        <nav
          aria-label="Legal and support"
          className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
        >
          <Link href="/privacy" className="transition hover:text-[var(--foreground)]">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition hover:text-[var(--foreground)]">
            Terms of Service
          </Link>
          <Link href="/legal" className="transition hover:text-[var(--foreground)]">
            Legal
          </Link>
          <Link href="/contact" className="transition hover:text-[var(--foreground)]">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}