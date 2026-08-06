"use client";

import { ChipRow, Eyebrow, FieldPair, SectionLabel } from "../shared/Controls";
import {
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
  colorPaletteLabel = "",
  colorPaletteSwatches = [],
  onChangeVisibility = null,
  onChangeContentRating = null,
  onChangeAge = null,
  onOpenColorPalette = null,
} = {}) {
  return (
    <>
      <Eyebrow>Set the seal</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Who may meet them?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Visibility, rating, and an adult age.
      </p>

      <div className="mt-6">
        <FieldPair>
          <div>
            <SectionLabel>Visibility</SectionLabel>
            <ChipRow
              options={VISIBILITY_LABELS}
              value={labelFor(VISIBILITY_OPTIONS, visibility)}
              onChange={(label) =>
                onChangeVisibility?.(valueFor(VISIBILITY_OPTIONS, label))
              }
            />
          </div>

          <div>
            <SectionLabel>Content rating</SectionLabel>
            <ChipRow
              options={CONTENT_RATING_LABELS}
              value={labelFor(CONTENT_RATING_OPTIONS, contentRating)}
              onChange={(label) =>
                onChangeContentRating?.(valueFor(CONTENT_RATING_OPTIONS, label))
              }
            />
          </div>
        </FieldPair>
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
          className="cf-field w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
        />
        <p className="mt-[var(--space-2)] text-xs text-[var(--ink-faint)]">
          Every character on Crestfall is an adult. Ages under 18 are raised
          to 18.
        </p>
      </div>

      <div className="mt-6 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <SectionLabel>Chat color when this character speaks</SectionLabel>
        <button
          type="button"
          onClick={() => onOpenColorPalette?.()}
          className="flex w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-left transition hover:border-[var(--line)]"
        >
          <span className="text-sm text-[var(--ink)]">
            {colorPaletteLabel || "Untitled Palette"}
          </span>
          <span className="flex flex-none items-center gap-1">
            {colorPaletteSwatches.map((color, index) => (
              <span
                key={`${color}-${index}`}
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
        </button>
      </div>
    </>
  );
}
