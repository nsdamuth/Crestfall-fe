"use client";

import { Check, Palette, X } from "lucide-react";

function PaletteSwatches({ palette = {}, compact = false }) {
  const swatches = Array.isArray(palette?.swatches) ? palette.swatches : [];

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}>
      {swatches.map((color, index) => (
        <span
          key={`${palette?.id || "palette"}-${index}`}
          className={compact ? "h-3 w-3 rounded-full" : "h-5 w-5 rounded-full"}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function PalettePreviewCard({ palette = {}, selected = false, onSelect = null }) {
  const colors = palette?.previewColors || {};

  return (
    <button
      type="button"
      onClick={() => onSelect?.()}
      className={`relative rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
        selected
          ? "border-[var(--muted-gold)]/70 bg-[var(--muted-gold)]/10"
          : "border-white/10 bg-black/30 hover:border-white/25"
      }`}
      style={{ boxShadow: selected ? `0 0 0 1px ${colors.border}` : undefined }}
    >
      {selected ? (
        <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--muted-gold)] text-black">
          <Check size={14} />
        </span>
      ) : null}

      <PaletteSwatches palette={palette} />

      <p className="mt-3 pr-8 text-sm font-medium" style={{ color: colors.speaker }}>
        {palette?.label || "Untitled Palette"}
      </p>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
        {palette?.description || ""}
      </p>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/35 p-3">
        <p className="text-xs italic" style={{ color: colors.narration }}>
          She turns toward the old workshop door.
        </p>
        <p className="mt-2 text-xs" style={{ color: colors.dialogue }}>
          “We should leave before the bells ring.”
        </p>
        <p className="mt-2 text-xs" style={{ color: colors.emphasis }}>
          Emphasis · <span style={{ color: colors.strong }}>Strong</span> ·{" "}
          <span style={{ color: colors.whisper }}>Whisper</span>
        </p>
      </div>
    </button>
  );
}

export default function CharacterColorPaletteModalView({
  open = false,
  triggerEyebrow = "Character Color Palette",
  triggerPalette = {},
  triggerDescription = "",
  modalAriaLabel = "Select character color palette",
  modalEyebrow = "Character Preference",
  modalTitle = "Choose a Color Palette",
  modalDescription = "",
  selectedPaletteId = "",
  paletteFamilies = [],
  onOpen = null,
  onClose = null,
  onChoosePalette = null,
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-left transition hover:border-[var(--muted-gold)]/40"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          {triggerEyebrow}
        </span>

        <span className="mt-3 flex items-center justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-sm text-[var(--foreground)]">
              {triggerPalette?.label || "Untitled Palette"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              {triggerDescription}
            </span>
          </span>

          <span className="shrink-0">
            <PaletteSwatches palette={triggerPalette} compact />
          </span>
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose?.();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={modalAriaLabel}
            className="max-h-[88vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-[var(--muted-gold)]/25 bg-[#090807] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
                  <Palette size={15} />
                  {modalEyebrow}
                </p>
                <h2 className="mt-2 font-display text-4xl">{modalTitle}</h2>
                {modalDescription ? (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    {modalDescription}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-full border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label="Close palette selector"
              >
                <X size={18} />
              </button>
            </div>

            {paletteFamilies.length > 0 ? (
              <div className="mt-7 space-y-7">
                {paletteFamilies.map((family) => {
                  const palettes = Array.isArray(family?.palettes)
                    ? family.palettes
                    : [];

                  if (!palettes.length) return null;

                  return (
                    <section key={family?.id || family?.label}>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                        {family?.label || "Palette Family"}
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {palettes.map((palette) => (
                          <PalettePreviewCard
                            key={palette?.id || palette?.label}
                            palette={palette}
                            selected={palette?.id === selectedPaletteId}
                            onSelect={() => onChoosePalette?.(palette?.id || "")}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm leading-6 text-[var(--muted)]">
                No color palettes are available.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
