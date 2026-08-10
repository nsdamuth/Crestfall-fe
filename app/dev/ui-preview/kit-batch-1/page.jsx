import Link from "next/link";
import { notFound } from "next/navigation";

const PACKAGES = [
  {
    href: "/dev/ui-preview/kit-studio-filter-bar",
    name: "Kit Studio Filter Bar",
    summary: "Sticky search, filter chips, sort, and a view-mode slot.",
  },
  {
    href: "/dev/ui-preview/kit-filter-chip",
    name: "Kit Filter Chip",
    summary: "The selectable filter chip: default, sort, toggle, dropdown.",
  },
  {
    href: "/dev/ui-preview/kit-load-more",
    name: "Kit Load More",
    summary: "No infinite scroll: an initial batch, then a show-more control.",
  },
  {
    href: "/dev/ui-preview/kit-creation-card",
    name: "Kit Creation Card",
    summary: "Grid and list creation cards, with lightbox and share actions.",
  },
  {
    href: "/dev/ui-preview/kit-badge",
    name: "Kit Badge",
    summary: "The constrained badge set: Canon gold, every other quiet.",
  },
];

export default function KitBatch1IndexPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-[var(--space-4)] py-[var(--space-10)] text-[var(--ink)] sm:px-[var(--space-6)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            docs/BUILD-BLUEPRINT.md, kit batch 1
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            The browse kit
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            Five LOOM packages built exactly to their chapter 2 specs:
            fixture-driven, no live data wiring, every visible state covered.
          </p>
        </header>

        <nav className="flex flex-col gap-[var(--space-3)]">
          {PACKAGES.map((pkg) => (
            <Link
              key={pkg.href}
              href={pkg.href}
              className="group flex flex-col gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-4)] transition-colors hover:border-[var(--gold-action)]"
            >
              <span className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)] group-hover:text-[var(--gold-bright)]">
                {pkg.name}
              </span>
              <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {pkg.summary}
              </span>
              <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
                {pkg.href}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
