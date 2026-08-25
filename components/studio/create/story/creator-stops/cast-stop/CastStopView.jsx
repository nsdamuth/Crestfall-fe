"use client";

import { X } from "lucide-react";

import { Eyebrow, SectionLabel } from "../shared/Controls";

// Picker pattern, RULED (the Q3 story quick-create brief): cast is
// multi-select, picked from the person's existing characters via
// KitPickerModal (components/kit/picker-modal/), the kit's existing
// branded, fixture-fed selection modal. The picker itself is owned
// and opened by StoryCreatorModal (it renders as its own stacked
// modal, not a CreatorStopsView secondaryPanel takeover); this stop
// only shows the current selection and the trigger to open it.
export default function CastStopView({
  selectedCharacters = [],
  onOpenCastPicker = null,
  onRemoveCastMember = null,
} = {}) {
  return (
    <>
      <Eyebrow>The cast</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Who is in this story?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Choose from your existing characters. You can add or remove
        anyone later.
      </p>

      <div className="mt-6">
        <SectionLabel>Cast</SectionLabel>

        <div className="flex flex-col gap-[var(--space-2)]">
          {selectedCharacters.length ? (
            selectedCharacters.map((character) => (
              <div
                key={character.id}
                className="flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)]"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 font-display text-sm text-[var(--gold-ornament)]">
                  {(character.title || "?").slice(0, 1).toUpperCase()}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-[var(--ink)]">
                    {character.title || "Untitled Character"}
                  </span>
                  {character.subtitle ? (
                    <span className="block truncate text-xs text-[var(--ink-dim)]">
                      {character.subtitle}
                    </span>
                  ) : null}
                </span>

                <button
                  type="button"
                  onClick={() => onRemoveCastMember?.(character.id)}
                  aria-label={`Remove ${character.title || "character"} from the cast`}
                  className="flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--status-danger)]"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-[var(--space-4)] text-sm text-[var(--ink-dim)]">
              No characters selected yet.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenCastPicker?.()}
          className="mt-[var(--space-3)] cf-btn cf-btn--secondary"
        >
          {selectedCharacters.length ? "Add another character" : "Choose characters"}
        </button>
      </div>
    </>
  );
}
