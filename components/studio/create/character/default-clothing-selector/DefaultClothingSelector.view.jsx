import { Shirt, X } from "lucide-react";

export default function DefaultClothingSelectorView({
  selectedClothing = null,
  emptyMessage =
    "No default clothing selected. Choose one Outfit or one Wardrobe.",
  outfitActionLabel = "Select Outfit",
  wardrobeActionLabel = "Select Wardrobe",
  onOpenOutfitPicker = null,
  onOpenWardrobePicker = null,
  onClearDefaultClothing = null,
} = {}) {
  return (
    <div className="md:col-span-2">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Clothing Style
      </p>

      <div className="mt-2 rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-4">
        {selectedClothing ? (
          <div className="flex flex-wrap items-start gap-4">
            <div
              className="h-24 w-24 shrink-0 rounded-xl border border-white/10 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  selectedClothing?.imageUrl || "/images/placeholder-card.jpg"
                })`,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {selectedClothing?.typeLabel || "Clothing Source"}
              </p>
              <h4 className="mt-1 font-display text-3xl">
                {selectedClothing?.title || "Selected Clothing Source"}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                {selectedClothing?.description || "No description."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClearDefaultClothing?.()}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-3 py-2 text-[var(--status-danger)] transition hover:bg-white/5"
              aria-label="Clear default clothing"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        ) : (
          <p className="text-sm leading-6 text-[var(--muted)]">
            {emptyMessage}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenOutfitPicker?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            <Shirt size={14} />
            {outfitActionLabel}
          </button>

          <button
            type="button"
            onClick={() => onOpenWardrobePicker?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            <Shirt size={14} />
            {wardrobeActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
