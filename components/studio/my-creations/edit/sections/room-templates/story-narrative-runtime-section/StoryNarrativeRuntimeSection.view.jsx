import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

function PolicySelect({
  label = "",
  value = "",
  options = [],
  onChange = null,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function GuidanceField({
  label = "",
  value = "",
  placeholder = "",
  rows = 4,
  className = "",
  onChange = null,
}) {
  return (
    <label className={`block ${className}`.trim()}>
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
      />
    </label>
  );
}

export default function StoryNarrativeRuntimeSectionView({
  sectionEyebrow = "Story Runtime",
  sectionTitle = "Narrative Objectives and Reentry",
  sectionDescription = "",
  branchingPolicyLabel = "Branching Policy",
  branchingPolicyValue = "",
  branchingPolicyOptions = [],
  completionPolicyLabel = "Completion Policy",
  completionPolicyValue = "",
  completionPolicyOptions = [],
  completionGuidanceLabel = "Story Completion Guidance",
  completionGuidanceValue = "",
  completionGuidancePlaceholder = "",
  phaseObjectiveLabel = "Phase Objective",
  phaseObjectivePlaceholder = "",
  pressuresLabel = "World Pressures",
  consequencesLabel = "Consequences",
  reentryHooksLabel = "Reentry Hooks",
  beatSuggestionsLabel = "Authored Beat Suggestions",
  guidanceLinesPlaceholder = "One entry per line",
  openLabel = "Open",
  closeLabel = "Close",
  phases = [],
  onChangeBranchingPolicy = null,
  onChangeCompletionPolicy = null,
  onChangeCompletionGuidance = null,
  onChangePhaseObjective = null,
  onChangePhasePressures = null,
  onChangePhaseConsequences = null,
  onChangePhaseReentryHooks = null,
  onChangePhaseBeatSuggestions = null,
} = {}) {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <PolicySelect
          label={branchingPolicyLabel}
          value={branchingPolicyValue}
          options={branchingPolicyOptions}
          onChange={onChangeBranchingPolicy}
        />

        <PolicySelect
          label={completionPolicyLabel}
          value={completionPolicyValue}
          options={completionPolicyOptions}
          onChange={onChangeCompletionPolicy}
        />
      </div>

      <GuidanceField
        label={completionGuidanceLabel}
        value={completionGuidanceValue}
        placeholder={completionGuidancePlaceholder}
        rows={3}
        onChange={onChangeCompletionGuidance}
      />

      <div className="space-y-4">
        {phases.map((phase) => (
          <details
            key={phase.id}
            open={phase.initiallyOpen}
            className="group rounded-2xl border border-white/10 bg-black/25 p-4"
          >
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                    {phase.phaseEyebrow}
                  </p>
                  <h3 className="mt-1 font-display text-3xl">
                    {phase.phaseTitle}
                  </h3>
                </div>
                <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span className="group-open:hidden">{openLabel}</span>
                  <span className="hidden group-open:inline">{closeLabel}</span>
                </span>
              </div>
            </summary>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <GuidanceField
                label={phaseObjectiveLabel}
                value={phase.objectiveValue}
                placeholder={phaseObjectivePlaceholder}
                rows={3}
                className="md:col-span-2"
                onChange={(value) =>
                  onChangePhaseObjective?.(phase.id, value)
                }
              />

              <GuidanceField
                label={pressuresLabel}
                value={phase.pressuresValue}
                placeholder={guidanceLinesPlaceholder}
                onChange={(value) =>
                  onChangePhasePressures?.(phase.id, value)
                }
              />

              <GuidanceField
                label={consequencesLabel}
                value={phase.consequencesValue}
                placeholder={guidanceLinesPlaceholder}
                onChange={(value) =>
                  onChangePhaseConsequences?.(phase.id, value)
                }
              />

              <GuidanceField
                label={reentryHooksLabel}
                value={phase.reentryHooksValue}
                placeholder={guidanceLinesPlaceholder}
                onChange={(value) =>
                  onChangePhaseReentryHooks?.(phase.id, value)
                }
              />

              <GuidanceField
                label={beatSuggestionsLabel}
                value={phase.beatSuggestionsValue}
                placeholder={guidanceLinesPlaceholder}
                onChange={(value) =>
                  onChangePhaseBeatSuggestions?.(phase.id, value)
                }
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
