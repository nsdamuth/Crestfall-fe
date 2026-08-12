import { Image as ImageIcon, RefreshCw, X } from "lucide-react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

function ReferenceCard({ card = {} }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {card.eyebrow}
          </p>
          <h4 className="mt-2 font-display text-2xl">{card.label}</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {card.description}
          </p>
        </div>

        {card.onClear ? (
          <button
            type="button"
            onClick={() => card.onClear?.()}
            className="cf-btn cf-btn--danger"
            aria-label={card.clearLabel}
          >
            <X size={16} />
            {card.clearLabel || "Clear"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/45">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.label}
            className="aspect-[3/4] w-full object-cover"
          />
        ) : (
          <div className="relative flex aspect-[3/4] items-center justify-center p-6 text-center">
            <KitArtPlaceholderView size="lg" />
            <p className="pointer-events-none absolute bottom-4 left-4 right-4 text-sm text-[var(--ink-dim)]">
              {card.emptyMessage}
            </p>
          </div>
        )}
      </div>

      {card.imageOutputId ? (
        <p className="mt-3 break-all text-xs text-[var(--ink-dim)]">
          Image output ID:{" "}
          <span className="text-[var(--ink)]">
            {card.imageOutputId}
          </span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => card.onChoose?.()}
        className="cf-btn cf-btn--primary mt-4"
      >
        <ImageIcon size={14} />
        {card.chooseLabel}
      </button>
    </article>
  );
}

export default function VisualReferencesSectionView({
  sectionEyebrow = "Visual Consistency",
  sectionTitle = "Visual References",
  sectionDescription = "",
  refreshLabel = "Refresh library",
  loadStatus = "idle",
  loadErrorMessage = "Image library could not be loaded.",
  referenceCards = [],
  onRefresh = null,
  pickerModal = null,
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {sectionEyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl">{sectionTitle}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            {sectionDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRefresh?.()}
          className="cf-btn cf-btn--secondary"
        >
          <RefreshCw size={14} />
          {refreshLabel}
        </button>
      </div>

      {loadStatus === "error" ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loadErrorMessage}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {referenceCards.map((card) => (
          <ReferenceCard key={card.key} card={card} />
        ))}
      </div>

      {pickerModal}
    </div>
  );
}
