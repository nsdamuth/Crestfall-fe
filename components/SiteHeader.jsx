import Link from "next/link";

export default function SiteHeader({ home = false }) {
  return (
    <header className="relative z-20 grid w-full grid-cols-[minmax(260px,auto)_1fr] items-center gap-[var(--space-8)] px-[var(--space-6)] py-[var(--space-8)] sm:px-[var(--space-10)] lg:px-[var(--space-16)]">
      <Link href="/" className="flex items-center gap-4 transition hover:opacity-90">
        <img
          src="/assets/branding/crestfall-seal.svg"
          alt="Crestfall Chronicles"
          className={
            home
              ? "h-40 w-40 object-contain"
              : "h-12 w-12 object-contain"
          }
        />

        <div>
          <p className="font-display text-xs uppercase tracking-[0.45em] text-[var(--gold-ornament)]">
            Crestfall
          </p>

          <h1 className="mt-2 font-display text-2xl tracking-[0.08em]">
            The Chronicles
          </h1>
        </div>
      </Link>

      {!home ? (
        <nav className="hidden min-w-0 flex-wrap justify-end gap-x-8 gap-y-3 text-sm uppercase tracking-[0.22em] text-[var(--ink-dim)] md:flex">
          <Link href="/intro" className="transition hover:text-[var(--ink)]">
            Intro
          </Link>
          <Link href="/lore" className="transition hover:text-[var(--ink)]">
            Lore
          </Link>
          <Link href="/characters" className="transition hover:text-[var(--ink)]">
            Characters
          </Link>
          <Link href="/locations" className="transition hover:text-[var(--ink)]">
            Locations
          </Link>
          <Link href="/factions" className="transition hover:text-[var(--ink)]">
            Factions
          </Link>
          <Link href="/stories" className="transition hover:text-[var(--ink)]">
            Stories
          </Link>
          <Link href="/chronicle" className="transition hover:text-[var(--ink)]">
            Chronicle
          </Link>
          <Link href="/studio/v2/home" className="transition hover:text-[var(--ink)]">
            Studio
          </Link>
        </nav>
      ) : null}
    </header>
  );
}