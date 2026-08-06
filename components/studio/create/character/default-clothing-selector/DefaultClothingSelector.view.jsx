import { Shirt, X } from "lucide-react";

export default function DefaultClothingSelectorView({
  selectedClothing = null,
  emptyMessage =
    "No default clothing selected. Choose one Outfit or one Wardrobe.",
  outfitActionLabel = "Select outfit",
  wardrobeActionLabel = "Select wardrobe",
  onOpenOutfitPicker = null,
  onOpenWardrobePicker = null,
  onClearDefaultClothing = null,
} = {}) {
  return (
    <div className="md:col-span-2">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
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
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                {selectedClothing?.typeLabel || "Clothing Source"}
              </p>
              <h4 className="mt-1 font-display text-3xl">
                {selectedClothing?.title || "Selected Clothing Source"}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
                {selectedClothing?.description || "No description."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClearDefaultClothing?.()}
              className="cf-btn cf-btn--danger"
              aria-label="Clear default clothing"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        ) : (
          <p className="text-sm leading-6 text-[var(--ink-dim)]">
            {emptyMessage}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenOutfitPicker?.()}
            className="cf-btn cf-btn--primary"
          >
            <Shirt size={14} />
            {outfitActionLabel}
          </button>

          <button
            type="button"
            onClick={() => onOpenWardrobePicker?.()}
            className="cf-btn cf-btn--secondary"
          >
            <Shirt size={14} />
            {wardrobeActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
