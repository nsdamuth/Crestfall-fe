import { Pencil, Plus, Trash2, X } from "lucide-react";

import {
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function LocationPromptGuidanceSectionView({
  sectionEyebrow = "Location Editor",
  sectionTitle = "Prompt Guidance",
  sectionDescription = "",
  promptGuidanceLabel = "Prompt Guidance",
  promptGuidanceValue = "",
  promptGuidancePlaceholder = "",
  imagePromptLabel = "Standalone Image Prompt",
  imagePromptValue = "",
  imagePromptPlaceholder = "",
  imagePromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  negativePromptLabel = "Negative Prompt",
  negativePromptValue = "",
  negativePromptPlaceholder = "",
  negativePromptMaxLength = 300,
  interiorPromptLabel = "Interior Prompt",
  interiorPromptValue = "",
  interiorPromptPlaceholder = "",
  interiorPromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  interiorNegativePromptLabel = "Interior Negative Prompt",
  interiorNegativePromptValue = "",
  interiorNegativePromptPlaceholder = "",
  interiorNegativePromptMaxLength = 300,
  exteriorPromptLabel = "Exterior Prompt",
  exteriorPromptValue = "",
  exteriorPromptPlaceholder = "",
  exteriorPromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  exteriorNegativePromptLabel = "Exterior Negative Prompt",
  exteriorNegativePromptValue = "",
  exteriorNegativePromptPlaceholder = "",
  exteriorNegativePromptMaxLength = 300,
  scenicPromptLabel = "Scenic Prompt",
  scenicPromptValue = "",
  scenicPromptPlaceholder = "",
  scenicPromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  scenicNegativePromptLabel = "Scenic Negative Prompt",
  scenicNegativePromptValue = "",
  scenicNegativePromptPlaceholder = "",
  scenicNegativePromptMaxLength = 300,
  customViewsTitle = "Additional Views",
  customViewsDescription = "",
  customViews = [],
  customViewEditor = null,
  customViewLabelMaxLength = 80,
  usageNotesLabel = "Usage Notes",
  usageNotesValue = "",
  usageNotesPlaceholder = "",
  compatibilityNotesLabel = "Compatibility Notes",
  compatibilityNotesValue = "",
  compatibilityNotesPlaceholder = "",
  registryNotesLabel = "Future Registry Notes",
  registryNotesValue = "",
  registryNotesPlaceholder = "",
  onChangePromptGuidance = null,
  onChangeImagePrompt = null,
  onChangeNegativePrompt = null,
  onChangeInteriorPrompt = null,
  onChangeInteriorNegativePrompt = null,
  onChangeExteriorPrompt = null,
  onChangeExteriorNegativePrompt = null,
  onChangeScenicPrompt = null,
  onChangeScenicNegativePrompt = null,
  onAddCustomView = null,
  onEditCustomView = null,
  onRemoveCustomView = null,
  onChangeCustomViewEditor = null,
  onSaveCustomView = null,
  onCloseCustomViewEditor = null,
  onChangeUsageNotes = null,
  onChangeCompatibilityNotes = null,
  onChangeRegistryNotes = null,
} = {}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)]">
        <TextAreaField
          label={promptGuidanceLabel}
          value={promptGuidanceValue}
          onChange={(value) => onChangePromptGuidance?.(value)}
          placeholder={promptGuidancePlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={imagePromptLabel}
          value={imagePromptValue}
          onChange={(value) => onChangeImagePrompt?.(value)}
          placeholder={imagePromptPlaceholder}
          maxLength={imagePromptMaxLength}
        />

        <TextAreaField
          label={negativePromptLabel}
          value={negativePromptValue}
          onChange={(value) => onChangeNegativePrompt?.(value)}
          placeholder={negativePromptPlaceholder}
          maxLength={negativePromptMaxLength}
          helperText="Persistent image-generation guidance. Added automatically whenever this location is selected. Max 300 characters."
        />

        <div className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Interior
          </p>
          <TextAreaField
            label={interiorPromptLabel}
            value={interiorPromptValue}
            onChange={(value) => onChangeInteriorPrompt?.(value)}
            placeholder={interiorPromptPlaceholder}
            maxLength={interiorPromptMaxLength}
          />
          <TextAreaField
            label={interiorNegativePromptLabel}
            value={interiorNegativePromptValue}
            onChange={(value) => onChangeInteriorNegativePrompt?.(value)}
            placeholder={interiorNegativePromptPlaceholder}
            maxLength={interiorNegativePromptMaxLength}
          />
        </div>

        <div className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Exterior
          </p>
          <TextAreaField
            label={exteriorPromptLabel}
            value={exteriorPromptValue}
            onChange={(value) => onChangeExteriorPrompt?.(value)}
            placeholder={exteriorPromptPlaceholder}
            maxLength={exteriorPromptMaxLength}
          />
          <TextAreaField
            label={exteriorNegativePromptLabel}
            value={exteriorNegativePromptValue}
            onChange={(value) => onChangeExteriorNegativePrompt?.(value)}
            placeholder={exteriorNegativePromptPlaceholder}
            maxLength={exteriorNegativePromptMaxLength}
          />
        </div>

        <div className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Scenic
          </p>
          <TextAreaField
            label={scenicPromptLabel}
            value={scenicPromptValue}
            onChange={(value) => onChangeScenicPrompt?.(value)}
            placeholder={scenicPromptPlaceholder}
            maxLength={scenicPromptMaxLength}
          />
          <TextAreaField
            label={scenicNegativePromptLabel}
            value={scenicNegativePromptValue}
            onChange={(value) => onChangeScenicNegativePrompt?.(value)}
            placeholder={scenicNegativePromptPlaceholder}
            maxLength={scenicNegativePromptMaxLength}
          />
        </div>

        <section className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
          <div className="flex flex-wrap items-start justify-between gap-[var(--space-3)]">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                {customViewsTitle}
              </p>
              {customViewsDescription ? (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
                  {customViewsDescription}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onAddCustomView?.()}
              className="cf-btn cf-btn--secondary shrink-0"
            >
              <Plus size={14} />
              Add view
            </button>
          </div>

          {customViews.length ? (
            <div className="mt-[var(--space-4)] grid gap-[var(--space-3)]">
              {customViews.map((view) => (
                <div
                  key={view.id}
                  className="flex flex-col gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)] md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--ink)]">{view.label}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
                      {view.prompt || "No prompt authored yet."}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditCustomView?.(view.id)}
                      className="cf-btn cf-btn--secondary"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomView?.(view.id)}
                      className="cf-btn cf-btn--danger"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-[var(--space-4)] text-sm text-[var(--ink-dim)]">
              No additional views yet.
            </p>
          )}
        </section>

        <TextAreaField
          label={usageNotesLabel}
          value={usageNotesValue}
          onChange={(value) => onChangeUsageNotes?.(value)}
          placeholder={usageNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={compatibilityNotesLabel}
          value={compatibilityNotesValue}
          onChange={(value) => onChangeCompatibilityNotes?.(value)}
          placeholder={compatibilityNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={registryNotesLabel}
          value={registryNotesValue}
          onChange={(value) => onChangeRegistryNotes?.(value)}
          placeholder={registryNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>

      {customViewEditor ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label={customViewEditor.editingId ? "Edit additional Location view" : "Add additional Location view"}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">Location View</p>
                <h3 className="mt-2 font-display text-2xl">
                  {customViewEditor.editingId ? "Edit additional view" : "Add additional view"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onCloseCustomViewEditor?.()}
                className="rounded-full border border-[var(--line)] p-2 text-[var(--ink-dim)] hover:text-[var(--ink)]"
                aria-label="Close additional view editor"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-[var(--space-5)] grid gap-[var(--space-4)]">
              <TextField
                label="View Name"
                value={customViewEditor.label}
                onChange={(value) => onChangeCustomViewEditor?.("label", value)}
                placeholder="e.g., Grand Palace Courtyard"
                maxLength={customViewLabelMaxLength}
              />
              <TextAreaField
                label="Prompt"
                value={customViewEditor.prompt}
                onChange={(value) => onChangeCustomViewEditor?.("prompt", value)}
                placeholder="Describe this specific view of the Location."
                maxLength={DEEP_LONGFORM_MAX_LENGTH}
              />
              <TextAreaField
                label="Negative Prompt"
                value={customViewEditor.negativePrompt}
                onChange={(value) => onChangeCustomViewEditor?.("negativePrompt", value)}
                placeholder="Optional negatives specific to this view."
                maxLength={300}
              />
            </div>

            <div className="mt-[var(--space-5)] flex justify-end gap-2">
              <button type="button" onClick={() => onCloseCustomViewEditor?.()} className="cf-btn cf-btn--secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSaveCustomView?.()}
                disabled={!String(customViewEditor.label || "").trim() || !String(customViewEditor.prompt || "").trim()}
                className="cf-btn cf-btn--primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save view
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
