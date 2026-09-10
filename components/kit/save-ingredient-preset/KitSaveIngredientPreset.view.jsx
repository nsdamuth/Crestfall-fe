"use client";

// THE custom asset modal for Media Studio (FE/MEDIA-STUDIO session 2,
// Brian's note 4, 9 Sep 2026). Tapping Custom in any asset picker
// opens this modal for that asset type; it never switches the slot
// into an inline text mode. One modal, one field order, one spacing
// for every type. Primary "Save and use preset" on the right,
// secondary "Use once" on the left. No bottom note: the sentence under
// the title says everything. Fields follow the composer's three-step
// hierarchy (quiet control titles, values at --text-ui) and grow from
// one row with the composer's own growTextarea. Under 700px it opens
// as the same bottom sheet the composer uses. Tokens only; no fetch.
import { Check, ChevronLeft, Loader2, Save } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import { growTextarea } from "../form-field/growTextarea";
import { usePhoneWidth } from "../modal-frame/usePhoneWidth";

// The composer's field recipe (KitImageCreatorPanel), byte for byte:
// resize-none and overflow-hidden are what growTextarea measures
// against.
const FIELD_RECIPE =
  "mt-[var(--space-2)] w-full resize-none overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)]";

// The composer's CONTROL title: the quiet, smaller eyebrow at
// --text-label in --ink-faint, with an optional "(optional)" note in
// the composer's note style. Gold appears only at section level and
// on active states.
function FieldCaption({ children, note = "" }) {
  return (
    <span className="inline-flex items-baseline gap-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {children}
      </span>
      {note ? (
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {note}
        </span>
      ) : null}
    </span>
  );
}

export default function KitSaveIngredientPresetView({
  assetLabel = "Asset",
  introText = "",
  message = "",
  messageTone = "info",
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
  canUseOnce = true,
  saveAvailable = true,
  hasUnsavedChanges = false,
  onSavePreset = null,
  onUseOnce = null,
  backLabel = null,
  onClose = null,
}) {
  const isPhoneWidth = usePhoneWidth();
  const lowerLabel = String(assetLabel || "asset").toLowerCase();
  const saveDisabled = isSaving || !canSave || !saveAvailable;

  return (
    <KitModalFrame
      variant={isPhoneWidth ? "sheet" : "modal"}
      sheetGrabber={isPhoneWidth}
      panelClassName="w-full min-[700px]:w-[min(42rem,calc(100vw-2rem))]"
      onClose={onClose}
      ariaLabel={`Custom ${assetLabel}`}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div
        className={`flex flex-col gap-[var(--space-4)] ${
          isPhoneWidth ? "p-[var(--space-5)] pt-[var(--space-4)]" : "p-[var(--space-6)] pt-[var(--space-8)]"
        }`}
      >
        {backLabel && (
          <button
            type="button"
            onClick={() => onClose?.()}
            className="inline-flex w-fit items-center gap-[var(--space-1)] cf-btn cf-btn--secondary cf-btn--sm max-[699.98px]:min-h-[var(--control-md)]"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            {backLabel}
          </button>
        )}

        <div className={isPhoneWidth ? "" : "pr-[var(--space-10)]"}>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Custom asset
          </p>
          <h2 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {assetLabel}
          </h2>
          {introText && (
            <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {introText}
            </p>
          )}
        </div>

        <label className="block">
          <FieldCaption>Preset name</FieldCaption>
          <input
            type="text"
            name="custom-asset-name"
            id="custom-asset-name"
            value={nameValue}
            onChange={(event) => onChangeName?.(event.target.value)}
            placeholder={`Name your ${lowerLabel}...`}
            className={FIELD_RECIPE}
          />
        </label>

        <label className="block">
          <FieldCaption note="(optional)">Description</FieldCaption>
          <textarea
            ref={growTextarea}
            name="custom-asset-description"
            id="custom-asset-description"
            value={descriptionValue}
            onChange={(event) => {
              growTextarea(event.target);
              onChangeDescription?.(event.target.value);
            }}
            placeholder="What this preset is for..."
            rows={1}
            className={FIELD_RECIPE}
          />
        </label>

        <label className="block">
          <FieldCaption>Prompt</FieldCaption>
          <textarea
            ref={growTextarea}
            name="custom-asset-prompt"
            id="custom-asset-prompt"
            value={promptValue}
            onChange={(event) => {
              growTextarea(event.target);
              onChangePrompt?.(event.target.value);
            }}
            placeholder={`Describe the ${lowerLabel}...`}
            rows={1}
            className={FIELD_RECIPE}
          />
        </label>

        <label className="block">
          <FieldCaption note="(optional)">Tags</FieldCaption>
          <input
            type="text"
            name="custom-asset-tags"
            id="custom-asset-tags"
            value={tagsValue}
            onChange={(event) => onChangeTags?.(event.target.value)}
            placeholder="fantasy, formal, battle-ready..."
            className={FIELD_RECIPE}
          />
        </label>

        {message ? (
          // Status law: state only, the word beside the color. The
          // -text tier is the ruled step for running text on a dark
          // panel; info stays in the ink family.
          <p
            role={messageTone === "error" ? "alert" : "status"}
            className={`text-[length:var(--text-label)] leading-[var(--lh-label)] ${
              messageTone === "error" ? "text-[var(--status-danger-text)]" : "text-[var(--ink-dim)]"
            }`}
          >
            {messageTone === "error" ? "Error: " : ""}
            {message}
          </p>
        ) : null}

        {/* B1 fade divider, never edge-to-edge; B8 footer alignment
            to the fade line's own ends. */}
        <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />

        <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
          <button
            type="button"
            onClick={() => onUseOnce?.()}
            disabled={isSaving || !canUseOnce}
            className="cf-btn cf-btn--secondary"
          >
            <Check size={14} aria-hidden="true" />
            Use once
          </button>

          {saveAvailable ? (
            <button
              type="button"
              onClick={() => onSavePreset?.()}
              disabled={saveDisabled}
              className="goldring cf-btn cf-btn--primary"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <Save size={14} aria-hidden="true" />
              )}
              {isSaving ? "Saving..." : "Save and use preset"}
            </button>
          ) : (
            // No backend can save this asset type yet (Character has no
            // preset type): the button stays where it belongs, disabled,
            // with the composer's Soon chip, never a faked save.
            <button
              type="button"
              disabled
              title="Not available yet"
              className="cf-btn cf-btn--secondary cursor-not-allowed opacity-[var(--state-disabled-opacity)]"
            >
              <Save size={14} aria-hidden="true" />
              Save and use preset
              <span className="ml-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                Soon
              </span>
            </button>
          )}
        </div>
      </div>
    </KitModalFrame>
  );
}
