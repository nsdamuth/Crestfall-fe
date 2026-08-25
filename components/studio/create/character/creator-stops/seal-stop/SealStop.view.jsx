"use client";

import { ChipRow, Eyebrow, FieldPair, InlineDropdown, SectionLabel } from "../shared/Controls";
import {
  CONTENT_RATING_OPTIONS,
  normalizeAdultAge,
  RENDERING_STYLE_OPTIONS,
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
  renderingStyle = "",
  colorPaletteLabel = "",
  colorPaletteSwatches = [],
  onChangeVisibility = null,
  onChangeContentRating = null,
  onChangeAge = null,
  onChangeRenderingStyle = null,
  onOpenColorPalette = null,
  // RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section 2.2): QUICK is Age
  // (stays) plus the newly added Default Rendering Style. Visibility,
  // Content Rating, and Character Color Palette are ADVANCED, editor
  // only. Removed fields keep their form-state keys and defaults
  // (PRIVATE, SFW) so the save payload shape is unchanged.
  fieldScope = "full",
} = {}) {
  const isQuick = fieldScope === "quick";

  return (
    <>
      <Eyebrow>Set the seal</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Who may meet them?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Visibility, rating, and an adult age.
      </p>

      {!isQuick ? (
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
      ) : null}

      <div className="mt-6 max-w-[10rem]">
        <SectionLabel>Age</SectionLabel>
        <input
          type="number"
          min={18}
          value={age}
          onChange={(event) => onChangeAge?.(event.target.value)}
          onBlur={(event) => onChangeAge?.(normalizeAdultAge(event.target.value))}
          placeholder="18+"
          className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
        />
        <p className="mt-[var(--space-2)] text-xs text-[var(--ink-faint)]">
          Every character on Crestfall is an adult. Ages under 18 are raised
          to 18.
        </p>
      </div>

      {/* Default Rendering Style, QUICK field ADDED per
          docs/STUDIO-SPEC.md section 2.2 (10 Aug 2026, Studio brief
          S2), both scopes. Schema catch-up is CR-002, Nick's. */}
      <div className="mt-6 max-w-xs">
        <InlineDropdown
          label="Default rendering style"
          options={RENDERING_STYLE_OPTIONS}
          value={renderingStyle}
          onChange={onChangeRenderingStyle}
        />
      </div>

      {!isQuick ? (
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
      ) : null}
    </>
  );
}
