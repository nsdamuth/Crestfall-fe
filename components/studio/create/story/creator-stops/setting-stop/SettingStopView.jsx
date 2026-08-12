"use client";

import { X } from "lucide-react";

import { Eyebrow, SectionLabel } from "../shared/Controls";

// Picker pattern, RULED (the Q3 story quick-create brief): setting is
// single-select, picked from the person's existing locations via
// KitPickerModal (components/kit/picker-modal/), the same branded
// selection modal the cast stop uses. Single-select confirms and
// closes on the first tap (KitPickerModal's own behavior); this stop
// only shows the current selection and the trigger to open it.
export default function SettingStopView({
  selectedLocation = null,
  onOpenSettingPicker = null,
  onClearSetting = null,
} = {}) {
  return (
    <>
      <Eyebrow>The setting</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Where does this story happen?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Choose one existing world or place this story is set in.
      </p>

      <div className="mt-6">
        <SectionLabel>Setting</SectionLabel>

        {selectedLocation ? (
          <div className="flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)]">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 font-display text-sm text-[var(--gold-ornament)]">
              {(selectedLocation.title || "?").slice(0, 1).toUpperCase()}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-[var(--ink)]">
                {selectedLocation.title || "Untitled World"}
              </span>
              {selectedLocation.subtitle ? (
                <span className="block truncate text-xs text-[var(--ink-dim)]">
                  {selectedLocation.subtitle}
                </span>
              ) : null}
            </span>

            <button
              type="button"
              onClick={() => onClearSetting?.()}
              aria-label={`Remove ${selectedLocation.title || "setting"}`}
              className="flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--status-danger)]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-[var(--space-4)] text-sm text-[var(--ink-dim)]">
            No setting chosen yet.
          </p>
        )}

        <button
          type="button"
          onClick={() => onOpenSettingPicker?.()}
          className="mt-[var(--space-3)] cf-btn cf-btn--secondary"
        >
          {selectedLocation ? "Change setting" : "Choose a setting"}
        </button>
      </div>
    </>
  );
}
