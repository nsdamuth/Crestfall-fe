"use client";

// Home destination tile (docs/SPRINT-G-PLAN.md OPEN item 37, ruled
// option A, 10 Aug 2026): a compact picture tile carrying the section
// name and one short supporting line, one per non-Home section, eight
// per Home. Follows the creation-card art-anchor law (object-position
// center 18%, docs/BUILD-BLUEPRINT.md 2.6 second revision) and the
// no-art fallback surface rule (--surface-2). Corner tier is
// STANDARD (--radius-md), the grid-sibling tier
// (docs/DESIGN-TOKENS.md "Spacing, radius, sizing"). The 4/3 aspect
// ratio is a package-local choice, not previously ruled, distinct
// from the portrait creation-card, chosen to read as a compact tile
// rather than an asset card.
import KitArtPlaceholderView from "../art-placeholder/KitArtPlaceholder.view";

function stopAndRun(event, handler) {
  event.preventDefault();
  handler?.();
}

export default function KitDestinationTileView({
  label = "",
  supportingLine = "",
  imageSrc = null,
  onOpen = null,
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <button
      type="button"
      onClick={(event) => stopAndRun(event, onOpen)}
      aria-label={label || "Destination"}
      className="kit-focus group relative block aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] text-left transition-[transform,box-shadow] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)]"
    >
      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_45%,transparent)] to-transparent"
          />
        </>
      ) : (
        <div className="absolute inset-0">
          <KitArtPlaceholderView size="sm" />
        </div>
      )}

      <div className="pointer-events-none relative z-[1] flex h-full flex-col justify-end gap-[var(--space-1)] p-[var(--space-3)]">
        <h3
          className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] ${
            hasImage ? "text-[var(--art-ink)]" : "text-[var(--ink)]"
          }`}
        >
          {label || "Section"}
        </h3>
        {supportingLine && (
          <p
            className={`line-clamp-2 text-[length:var(--text-label)] leading-[var(--lh-label)] ${
              hasImage ? "text-[var(--art-ink-dim)]" : "text-[var(--ink-dim)]"
            }`}
          >
            {supportingLine}
          </p>
        )}
      </div>
    </button>
  );
}
