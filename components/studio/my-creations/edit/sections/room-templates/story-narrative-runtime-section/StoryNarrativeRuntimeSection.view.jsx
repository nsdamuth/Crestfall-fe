import {
  SectionTitle,
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

// ED1C dropdown law: the local native-select PolicySelect is replaced
// by the SharedFields SelectField (branded kit dropdown grammar).
// Same props, same onChange(value) intent.
function PolicySelect({
  label = "",
  value = "",
  options = [],
  onChange = null,
}) {
  return (
    <SelectField
      label={label}
      value={value}
      options={options}
      onChange={(nextValue) => onChange?.(nextValue)}
    />
  );
}

// K1 folding field pattern (SharedFields.jsx TextAreaField), ED1d
// Defect 2: this local textarea bypassed it entirely (no fold, no
// counter). `rows` drops since TextAreaField owns its own resting/
// expanded heights.
function GuidanceField({
  label = "",
  value = "",
  placeholder = "",
  className = "",
  onChange = null,
}) {
  return (
    <div className={className}>
      <TextAreaField
        label={label}
        value={value}
        onChange={(nextValue) => onChange?.(nextValue)}
        placeholder={placeholder}
        maxLength={SHORT_LONGFORM_MAX_LENGTH}
      />
    </div>
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
        onChange={onChangeCompletionGuidance}
      />

      <div className="space-y-4">
        {phases.map((phase) => (
          <details
            key={phase.id}
            open={phase.initiallyOpen}
            className="group rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]"
          >
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between gap-[var(--space-4)]">
                <div>
                  <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    {phase.phaseEyebrow}
                  </p>
                  <h3 className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
                    {phase.phaseTitle}
                  </h3>
                </div>
                <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                  <span className="group-open:hidden">{openLabel}</span>
                  <span className="hidden group-open:inline">{closeLabel}</span>
                </span>
              </div>
            </summary>

            <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] md:grid-cols-2">
              <GuidanceField
                label={phaseObjectiveLabel}
                value={phase.objectiveValue}
                placeholder={phaseObjectivePlaceholder}
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
