"use client";

import { ChevronRight, Palette } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

function PaletteSwatches({ palette = {}, compact = false }) {
  const swatches = Array.isArray(palette?.swatches) ? palette.swatches : [];

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-[var(--space-1)]"}`}>
      {swatches.map((color, index) => (
        <span
          key={`${palette?.id || "palette"}-${index}`}
          className={`rounded-[var(--radius-md)] ${compact ? "h-3 w-3" : "h-5 w-5"}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

// ChipRow selected recipe (components/studio/create/character/creator-stops/shared/Controls.jsx):
// border --gold-action, inset hairline, --gold-bright text. Replaces
// the gold-pill check badge (literal text-black) and rounded-full
// swatch-dot pills this card used to carry.
function PalettePreviewCard({ palette = {}, selected = false, onSelect = null }) {
  const colors = palette?.previewColors || {};

  return (
    <button
      type="button"
      onClick={() => onSelect?.()}
      aria-pressed={selected}
      className={`relative rounded-[var(--radius-md)] border p-[var(--space-4)] text-left transition-colors ${
        selected
          ? "border-[var(--gold-action)] bg-[var(--fill-whisper)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
          : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] hover:border-[var(--line)]"
      }`}
    >
      <PaletteSwatches palette={palette} />

      <p
        className={`mt-[var(--space-3)] text-[length:var(--text-body)] font-medium ${selected ? "text-[var(--gold-bright)]" : ""}`}
        style={selected ? undefined : { color: colors.speaker }}
      >
        {palette?.label || "Untitled Palette"}
      </p>
      <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
        {palette?.description || ""}
      </p>

      <div className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)]">
        <p className="text-[length:var(--text-label)] italic" style={{ color: colors.narration }}>
          She turns toward the old workshop door.
        </p>
        <p className="mt-[var(--space-2)] text-[length:var(--text-label)]" style={{ color: colors.dialogue }}>
          "We should leave before the bells ring."
        </p>
        <p className="mt-[var(--space-2)] text-[length:var(--text-label)]" style={{ color: colors.emphasis }}>
          Emphasis &middot; <span style={{ color: colors.strong }}>Strong</span> &middot;{" "}
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
    <div>
      <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {triggerEyebrow}
      </span>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="mt-[var(--space-1)] flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-left transition-colors hover:border-[var(--state-hover-line)]"
      >
        <span className="min-w-0">
          <span className="block truncate text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
            {triggerPalette?.label || "Untitled Palette"}
          </span>
          <span className="mt-[var(--space-1)] block truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {triggerDescription}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-[var(--space-3)]">
          <PaletteSwatches palette={triggerPalette} compact />
          <ChevronRight size={16} className="text-[var(--ink-faint)]" aria-hidden="true" />
        </span>
      </button>

      {open ? (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-4xl"
          onClose={onClose}
          ariaLabel={modalAriaLabel}
        >
          <div className="flex max-h-[92dvh] flex-col p-[var(--space-6)] pt-[var(--space-8)]">
            <div>
              <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                <Palette size={15} aria-hidden="true" />
                {modalEyebrow}
              </p>
              <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                {modalTitle}
              </h2>
              {modalDescription ? (
                <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  {modalDescription}
                </p>
              ) : null}
            </div>

            <div
              aria-hidden="true"
              className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
            />

            <div className="min-h-0 flex-1 overflow-y-auto pb-[var(--space-2)] pr-1">
              {paletteFamilies.length > 0 ? (
                <div className="space-y-[var(--space-7)]">
                  {paletteFamilies.map((family) => {
                    const palettes = Array.isArray(family?.palettes)
                      ? family.palettes
                      : [];

                    if (!palettes.length) return null;

                    return (
                      <section key={family?.id || family?.label}>
                        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                          {family?.label || "Palette Family"}
                        </p>
                        <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] md:grid-cols-2 xl:grid-cols-3">
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
                <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-6)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  No color palettes are available.
                </div>
              )}
            </div>
          </div>
        </KitModalFrame>
      ) : null}
    </div>
  );
}
