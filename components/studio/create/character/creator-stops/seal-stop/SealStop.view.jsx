"use client";

import { ChipRow, Fold, SectionLabel, SwatchGrid } from "../shared/Controls";
import {
  COLOR_PALETTE_OPTIONS,
  CONTENT_RATING_OPTIONS,
  normalizeAdultAge,
  VISIBILITY_OPTIONS,
} from "./SealStop.contract";

const VISIBILITY_LABELS = VISIBILITY_OPTIONS.map((option) => option.label);
const CONTENT_RATING_LABELS = CONTENT_RATING_OPTIONS.map(
  (option) => option.label
);

function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? "";
}

function valueFor(options, label) {
  return options.find((option) => option.label === label)?.value ?? "";
}

export default function SealStopView({
  visibility = "",
  contentRating = "",
  age = "",
  characterColorPaletteId = "",
  onChangeVisibility = null,
  onChangeContentRating = null,
  onChangeAge = null,
  onChangeCharacterColorPaletteId = null,
  renderingFoldOpen = false,
  onToggleRenderingFold = null,
} = {}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-6">
      <h2 className="font-display text-3xl text-[var(--ink)]">
        Who may meet them?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Visibility, rating, and an adult age.
      </p>

      <div className="mt-6">
        <SectionLabel>Visibility</SectionLabel>
        <ChipRow
          options={VISIBILITY_LABELS}
          value={labelFor(VISIBILITY_OPTIONS, visibility)}
          onChange={(label) =>
            onChangeVisibility?.(valueFor(VISIBILITY_OPTIONS, label))
          }
        />
      </div>

      <div className="mt-6">
        <SectionLabel>Content rating</SectionLabel>
        <ChipRow
          options={CONTENT_RATING_LABELS}
          value={labelFor(CONTENT_RATING_OPTIONS, contentRating)}
          onChange={(label) =>
            onChangeContentRating?.(valueFor(CONTENT_RATING_OPTIONS, label))
          }
        />
      </div>

      <div className="mt-6 max-w-[10rem]">
        <SectionLabel>Age</SectionLabel>
        <input
          type="number"
          min={18}
          value={age}
          onChange={(event) => onChangeAge?.(event.target.value)}
          onBlur={(event) => onChangeAge?.(normalizeAdultAge(event.target.value))}
          placeholder="18+"
          className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
        />
        <p className="mt-[var(--space-2)] text-xs text-[var(--ink-faint)]">
          Every character on Crestfall is an adult. Ages under 18 are raised
          to 18.
        </p>
      </div>

      <Fold
        title="Presentation"
        sub="Chat color palette"
        open={renderingFoldOpen}
        onToggle={onToggleRenderingFold}
        filled={Boolean(characterColorPaletteId)}
      >
        <SwatchGrid
          options={COLOR_PALETTE_OPTIONS}
          value={characterColorPaletteId}
          onChange={onChangeCharacterColorPaletteId}
        />
      </Fold>
    </div>
  );
}
