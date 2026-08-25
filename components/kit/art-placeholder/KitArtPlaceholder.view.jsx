"use client";

// The shared empty-art-slot mark (RULED 11 Aug 2026, Sprint H render
// review item 5): a geometric gold line-art camellia, six petals drawn
// as overlapping ellipses radiating from a center ring, stroke only,
// never filled, centered on --surface-2. Package-local size steps,
// not previously ruled, cover the smallest reference-slot use through
// the largest showcase/preview use.
const SIZE_CLASSES = {
  sm: "h-[var(--space-6)] w-[var(--space-6)]",
  md: "h-[var(--space-10)] w-[var(--space-10)]",
  lg: "h-[var(--space-12)] w-[var(--space-12)]",
};

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

export default function KitArtPlaceholderView({ size = "md" } = {}) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--surface-2)]">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={`${sizeClass} text-[var(--gold-ornament)]`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      >
        {PETAL_ANGLES.map((angle) => (
          <ellipse
            key={angle}
            cx="32"
            cy="18"
            rx="7"
            ry="12"
            transform={`rotate(${angle} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="5" />
        <circle cx="32" cy="32" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
