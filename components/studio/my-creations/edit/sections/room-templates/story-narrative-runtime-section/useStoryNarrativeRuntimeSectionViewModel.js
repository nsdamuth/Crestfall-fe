"use client";

import {
  joinGuidanceLines,
  normalizeStoryAuthoring,
  STORY_BRANCHING_POLICIES,
  STORY_COMPLETION_POLICIES,
} from "@/lib/shared/storylines/storylineAuthoring.mjs";

const PHASE_LABELS = Object.freeze({
  you: "You",
  need: "Need",
  go: "Go",
  search: "Search",
  find: "Find",
  take: "Take",
  return: "Return",
  change: "Change",
});

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Runtime",
  sectionTitle: "Narrative Objectives and Reentry",
  sectionDescription:
    "Author the Story-level gravity that surrounds the active Beat. These fields guide objectives, consequences, and natural reentry without forcing player decisions.",
  branchingPolicyLabel: "Branching Policy",
  completionPolicyLabel: "Completion Policy",
  completionGuidanceLabel: "Story Completion Guidance",
  completionGuidancePlaceholder:
    "Optional evidence or outcome that confirms the Story has concluded.",
  phaseObjectiveLabel: "Phase Objective",
  phaseObjectivePlaceholder:
    "What unresolved narrative objective supplies gravity during this phase?",
  pressuresLabel: "World Pressures",
  consequencesLabel: "Consequences",
  reentryHooksLabel: "Reentry Hooks",
  beatSuggestionsLabel: "Authored Beat Suggestions",
  guidanceLinesPlaceholder: "One entry per line",
  openLabel: "Open",
  closeLabel: "Close",
});

function toPolicyOptions(policies) {
  return policies.map((policy) => ({
    value: policy,
    label: policy.replaceAll("_", " "),
  }));
}

export function useStoryNarrativeRuntimeSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const authoring = normalizeStoryAuthoring(
    form.data?.story_runtime_authoring || {}
  );

  function commit(next) {
    updateDataField?.(
      "story_runtime_authoring",
      normalizeStoryAuthoring(next)
    );
  }

  function updatePolicy(field, value) {
    commit({
      ...authoring,
      [field]: value,
    });
  }

  function updatePhase(phaseId, field, value) {
    commit({
      ...authoring,
      phases: authoring.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              [field]: value,
            }
          : phase
      ),
    });
  }

  return {
    ...DEFAULT_COPY,
    branchingPolicyValue: authoring.branchingPolicy,
    branchingPolicyOptions: toPolicyOptions(STORY_BRANCHING_POLICIES),
    completionPolicyValue: authoring.completionPolicy,
    completionPolicyOptions: toPolicyOptions(STORY_COMPLETION_POLICIES),
    completionGuidanceValue: authoring.completionGuidance,
    phases: authoring.phases.map((phase, index) => ({
      id: phase.id,
      phaseEyebrow: `Story Circle Phase ${index + 1}`,
      phaseTitle: PHASE_LABELS[phase.id] || phase.id,
      initiallyOpen: index === 0,
      objectiveValue: phase.objective,
      pressuresValue: joinGuidanceLines(phase.pressures),
      consequencesValue: joinGuidanceLines(phase.consequences),
      reentryHooksValue: joinGuidanceLines(phase.reentryHooks),
      beatSuggestionsValue: joinGuidanceLines(phase.beatSuggestions),
    })),
    onChangeBranchingPolicy: (value) =>
      updatePolicy("branchingPolicy", value),
    onChangeCompletionPolicy: (value) =>
      updatePolicy("completionPolicy", value),
    onChangeCompletionGuidance: (value) =>
      updatePolicy("completionGuidance", value),
    onChangePhaseObjective: (phaseId, value) =>
      updatePhase(phaseId, "objective", value),
    onChangePhasePressures: (phaseId, value) =>
      updatePhase(phaseId, "pressures", value),
    onChangePhaseConsequences: (phaseId, value) =>
      updatePhase(phaseId, "consequences", value),
    onChangePhaseReentryHooks: (phaseId, value) =>
      updatePhase(phaseId, "reentryHooks", value),
    onChangePhaseBeatSuggestions: (phaseId, value) =>
      updatePhase(phaseId, "beatSuggestions", value),
  };
}
