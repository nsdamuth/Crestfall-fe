"use client";

import { Check } from "lucide-react";

// The reference implementation for a secondary panel body: every
// palette visible at once, no per-card copy beyond the label, choosing
// applies immediately (same behavior the palette selector always had).
export default function PalettePanelBody({
  paletteFamilies = [],
  selectedPaletteId = "",
  onChoosePalette = null,
}) {
  return (
    <div className="space-y-[var(--space-5)]">
      {paletteFamilies.map((family) => (
        <div key={family.id}>
          <p className="text-[10px] font-medium uppercase leading-[0.9rem] tracking-[0.14em] text-[var(--gold-ornament)]">
            {family.label}
          </p>

          <div className="mt-[var(--space-2)] grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3">
            {family.palettes.map((palette) => {
              const active = palette.id === selectedPaletteId;

              return (
                <button
                  key={palette.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChoosePalette?.(palette.id)}
                  className={`rounded-[var(--radius-md)] border p-[var(--space-3)] text-left transition ${
                    active
                      ? "border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                      : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-[var(--space-2)]">
                    <span className="flex items-center gap-1">
                      {palette.swatches.map((color, index) => (
                        <span
                          key={`${palette.id}-${index}`}
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    {active ? (
                      <Check size={14} className="text-[var(--gold-bright)]" />
                    ) : null}
                  </span>
                  <p className="mt-[var(--space-2)] text-sm text-[var(--ink)]">
                    {palette.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
