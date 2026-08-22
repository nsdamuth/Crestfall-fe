"use client";

// Fixture-driven mirror of the live save-preset modal's function
// (docs/SPRINT-E-PLAN.md section 1.3, R6), never its code
// (components/studio/image-studio/save-ingredient-preset/, READ ONLY
// reference). Standing on KitModalFrame variant="modal". Tokens only;
// no fetch anywhere.
import { Check, ChevronLeft, Loader2, Save } from "lucide-react";

import KitModalFrame from "../KitModalFrame";

const FIELD_RECIPE =
  "cf-field mt-[var(--space-2)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

function FieldCaption({ children }) {
  return (
    <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      {children}
    </span>
  );
}

export default function KitSaveIngredientPresetView({
  presetTypeLabel = "Ingredient Preset",
  introText = "",
  helperText = "",
  nameValue = "",
  onChangeName = null,
  descriptionValue = "",
  onChangeDescription = null,
  promptValue = "",
  onChangePrompt = null,
  tagsValue = "",
  onChangeTags = null,
  isSaving = false,
  canSave = false,
  onSavePreset = null,
  onUseOnce = null,
  backLabel = null,
  onClose = null,
}) {
  // A4 checkable condition 3: dismissing a modal with unsaved state
  // routes through a confirm step. Dirty state is whichever of this
  // form's fields the caller has typed into; presentation-only, the
  // frame owns no form state of its own.
  const hasUnsavedChanges = Boolean(
    nameValue || descriptionValue || promptValue || tagsValue
  );

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-2xl"
      onClose={onClose}
      ariaLabel={`Save ${presetTypeLabel}`}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]">
        {backLabel && (
          <button
            type="button"
            onClick={() => onClose?.()}
            className="kit-focus inline-flex w-fit items-center gap-[var(--space-1)] cf-btn cf-btn--secondary cf-btn--sm"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            {backLabel}
          </button>
        )}

        <div>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Save Preset
          </p>
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {presetTypeLabel}
          </h2>
          {introText && (
            <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {introText}
            </p>
          )}
        </div>

        <label className="block">
          <FieldCaption>Preset Name</FieldCaption>
          <input
            type="text"
            name="save-preset-name"
            id="save-preset-name"
            value={nameValue}
            onChange={(event) => onChangeName?.(event.target.value)}
            placeholder="Name this preset..."
            className={FIELD_RECIPE}
          />
        </label>

        <label className="block">
          <FieldCaption>Description</FieldCaption>
          <textarea
            name="save-preset-description"
            id="save-preset-description"
            value={descriptionValue}
            onChange={(event) => onChangeDescription?.(event.target.value)}
            placeholder="Optional description for later browsing and editing..."
            rows={3}
            className={`${FIELD_RECIPE} resize-none`}
          />
        </label>

        <label className="block">
          <FieldCaption>Prompt / Guidance</FieldCaption>
          <textarea
            name="save-preset-prompt"
            id="save-preset-prompt"
            value={promptValue}
            onChange={(event) => onChangePrompt?.(event.target.value)}
            placeholder="The reusable prompt fragment lives here..."
            rows={5}
            className={`${FIELD_RECIPE} resize-none`}
          />
        </label>

        <label className="block">
          <FieldCaption>Tags</FieldCaption>
          <input
            type="text"
            name="save-preset-tags"
            id="save-preset-tags"
            value={tagsValue}
            onChange={(event) => onChangeTags?.(event.target.value)}
            placeholder="fantasy, formal, battle-ready..."
            className={FIELD_RECIPE}
          />
        </label>

        {helperText && (
          <p className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--fill-whisper)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {helperText}
          </p>
        )}

        {/* B1 fade divider, never edge-to-edge; B8 footer alignment
            to the fade line's own ends. */}
        <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />

        <div className="flex flex-wrap justify-between gap-[var(--space-3)]">
          <button
            type="button"
            onClick={() => onSavePreset?.()}
            disabled={isSaving || !canSave}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Save size={14} aria-hidden="true" />
            )}
            {isSaving ? "Saving..." : "Save as preset"}
          </button>

          <button
            type="button"
            onClick={() => onUseOnce?.()}
            disabled={isSaving}
            className="kit-focus cf-btn cf-btn--primary"
          >
            <Check size={14} aria-hidden="true" />
            Use once
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}
