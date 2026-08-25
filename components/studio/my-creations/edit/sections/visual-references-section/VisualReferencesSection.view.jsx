import { Image as ImageIcon, RefreshCw, X } from "lucide-react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";
import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

// A card list item keeps its own border (repeatable list item, the
// same allowance the mechanics-modules sibling card lists use); the
// media well loses its own inner border (a second nested border) and
// clips through the card's own radius instead.
function ReferenceCard({ card = {} }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <div className="flex items-start justify-between gap-[var(--space-4)]">
        <div>
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {card.eyebrow}
          </p>
          <h4 className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
            {card.label}
          </h4>
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
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

      <div className="mt-[var(--space-4)] overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-2)]">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.label}
            className="aspect-[3/4] w-full object-cover"
          />
        ) : (
          <div className="relative flex aspect-[3/4] items-center justify-center p-[var(--space-6)] text-center">
            <KitArtPlaceholderView size="lg" />
            <p className="pointer-events-none absolute bottom-[var(--space-4)] left-[var(--space-4)] right-[var(--space-4)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
              {card.emptyMessage}
            </p>
          </div>
        )}
      </div>

      {card.imageOutputId ? (
        <p className="mt-[var(--space-3)] break-all text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-faint)]">
          Image output ID:{" "}
          <span className="text-[var(--ink)]">
            {card.imageOutputId}
          </span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => card.onChoose?.()}
        className="cf-btn cf-btn--primary mt-[var(--space-4)]"
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
        {/* ED1C: same suppression as SharedFields SectionTitle; the
            v2 editor shell's section box carries the one header. The
            refresh action stays either way. */}
        <SectionTitle
          eyebrow={sectionEyebrow}
          title={sectionTitle}
          body={sectionDescription}
        />

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
        <p className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--status-danger)]">
          {loadErrorMessage}
        </p>
      ) : null}

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] lg:grid-cols-2">
        {referenceCards.map((card) => (
          <ReferenceCard key={card.key} card={card} />
        ))}
      </div>

      {pickerModal}
    </div>
  );
}
