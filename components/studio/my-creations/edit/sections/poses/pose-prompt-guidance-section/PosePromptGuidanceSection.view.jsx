import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function PosePromptGuidanceSectionView({
  sectionEyebrow = "Pose Editor",
  sectionTitle = "Prompt Guidance",
  sectionDescription = "",
  promptGuidanceLabel = "Prompt Guidance",
  promptGuidanceValue = "",
  promptGuidancePlaceholder = "",
  promptGuidanceHelper = "",
  suggestedPromptGuidance = "",
  usageNotesLabel = "Usage Notes",
  usageNotesValue = "",
  usageNotesPlaceholder = "",
  usageNotesHelper = "",
  compatibilityNotesLabel = "Compatibility Notes",
  compatibilityNotesValue = "",
  compatibilityNotesPlaceholder = "",
  compatibilityNotesHelper = "",
  onChangePromptGuidance = null,
  onUseSuggestedPromptGuidance = null,
  onChangeUsageNotes = null,
  onChangeCompatibilityNotes = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label={promptGuidanceLabel}
          value={promptGuidanceValue}
          onChange={(value) => onChangePromptGuidance?.(value)}
          placeholder={promptGuidancePlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
          helperText={promptGuidanceHelper}
        />

        {suggestedPromptGuidance && onUseSuggestedPromptGuidance ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
              <div>
                <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                  Semantic Suggestion
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  Built from Body Position and Motion / Staging. Applying it replaces Prompt Guidance only; structured semantics remain unchanged.
                </p>
              </div>
              <button
                type="button"
                className="cf-btn cf-btn--secondary"
                onClick={() => onUseSuggestedPromptGuidance?.()}
              >
                Use semantic suggestion
              </button>
            </div>
            <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
              {suggestedPromptGuidance}
            </p>
          </div>
        ) : null}

        <TextAreaField
          label={usageNotesLabel}
          value={usageNotesValue}
          onChange={(value) => onChangeUsageNotes?.(value)}
          placeholder={usageNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
          helperText={usageNotesHelper}
        />

        <TextAreaField
          label={compatibilityNotesLabel}
          value={compatibilityNotesValue}
          onChange={(value) => onChangeCompatibilityNotes?.(value)}
          placeholder={compatibilityNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
          helperText={compatibilityNotesHelper}
        />
      </div>
    </div>
  );
}
