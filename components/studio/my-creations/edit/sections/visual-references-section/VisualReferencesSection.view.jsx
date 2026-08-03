import { Image as ImageIcon, RefreshCw, X } from "lucide-react";

function ReferenceCard({ card = {} }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            {card.eyebrow}
          </p>
          <h4 className="mt-2 font-display text-2xl">{card.label}</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {card.description}
          </p>
        </div>

        {card.onClear ? (
          <button
            type="button"
            onClick={() => card.onClear?.()}
            className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15"
            aria-label={card.clearLabel}
          >
            <X size={16} />
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
          <div className="flex aspect-[3/4] items-center justify-center p-6 text-center">
            <div>
              <ImageIcon
                size={30}
                className="mx-auto text-[var(--muted-gold)]"
              />
              <p className="mt-3 text-sm text-[var(--muted)]">
                {card.emptyMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {card.imageOutputId ? (
        <p className="mt-3 break-all text-xs text-[var(--muted)]">
          Image output ID:{" "}
          <span className="text-[var(--foreground)]">
            {card.imageOutputId}
          </span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => card.onChoose?.()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
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
  refreshLabel = "Refresh Library",
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
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            {sectionEyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl">{sectionTitle}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {sectionDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRefresh?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
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
