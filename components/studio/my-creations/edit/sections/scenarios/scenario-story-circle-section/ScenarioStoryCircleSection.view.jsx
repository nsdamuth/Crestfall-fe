import {
  SectionTitle,
  TextAreaField,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ScenarioStoryCircleSectionView({
  sectionEyebrow = "Scenario Editor",
  sectionTitle = "Story Circle",
  sectionDescription = "",
  steps = [],
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)]">
        {steps.map((step) => (
          // Section 5 de-nesting: inset hairline, tier 4 label, no
          // bordered/backgrounded panel.
          <div
            key={step.id}
            className="border-t border-[var(--line-whisper)] pt-[var(--space-4)] first:border-t-0 first:pt-0"
          >
            <div className="grid gap-[var(--space-4)] lg:grid-cols-[0.35fr_1fr]">
              <div>
                <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                  {step.label}
                </p>

                <h3 className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
                  {step.title}
                </h3>

                <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                  {step.helper}
                </p>
              </div>

              <TextAreaField
                label=""
                value={step.value}
                onChange={(value) => step.onChange?.(value)}
                placeholder={step.placeholder}
                maxLength={DEEP_LONGFORM_MAX_LENGTH}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
