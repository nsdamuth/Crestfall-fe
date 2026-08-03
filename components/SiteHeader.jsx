import Link from "next/link";

export default function SiteHeader({ home = false }) {
  return (
    <header className="relative z-20 grid w-full grid-cols-[minmax(260px,auto)_1fr] items-center gap-8 px-6 py-8 sm:px-10 lg:px-16">
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
          <p className="font-display text-xs uppercase tracking-[0.45em] text-[var(--muted-gold)]">
            Crestfall
          </p>

          <h1 className="mt-2 font-display text-2xl tracking-[0.08em]">
            The Chronicles
          </h1>
        </div>
      </Link>

      <nav className="hidden min-w-0 flex-wrap justify-end gap-x-8 gap-y-3 text-sm uppercase tracking-[0.22em] text-[var(--muted)] md:flex">
        <Link href="/intro" className="transition hover:text-[var(--foreground)]">
          Intro
        </Link>
        <Link href="/lore" className="transition hover:text-[var(--foreground)]">
          Lore
        </Link>
        <Link href="/characters" className="transition hover:text-[var(--foreground)]">
          Characters
        </Link>
        <Link href="/locations" className="transition hover:text-[var(--foreground)]">
          Locations
        </Link>
        <Link href="/factions" className="transition hover:text-[var(--foreground)]">
          Factions
        </Link>
        <Link href="/stories" className="transition hover:text-[var(--foreground)]">
          Stories
        </Link>
        <Link href="/chronicle" className="transition hover:text-[var(--foreground)]">
          Chronicle
        </Link>
        <Link href="/studio" className="transition hover:text-[var(--foreground)]">
          Studio
        </Link>
      </nav>
    </header>
  );
}