import {
  SectionTitle,
  TextAreaField,
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

      <div className="mt-6 grid gap-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="rounded-2xl border border-white/10 bg-black/25 p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[0.35fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                  {step.label}
                </p>

                <h3 className="mt-2 font-display text-3xl">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {step.helper}
                </p>
              </div>

              <TextAreaField
                label=""
                value={step.value}
                onChange={(value) => step.onChange?.(value)}
                placeholder={step.placeholder}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
