const branchingPolicyOptions = [
  { value: "PLAYER_LED", label: "PLAYER LED" },
  { value: "GUIDED", label: "GUIDED" },
  { value: "AUTHORED", label: "AUTHORED" },
];

const completionPolicyOptions = [
  { value: "EVIDENCE_BASED", label: "EVIDENCE BASED" },
  { value: "OBJECTIVE_BASED", label: "OBJECTIVE BASED" },
  { value: "MANUAL", label: "MANUAL" },
];

const phaseDefinitions = [
  ["you", "You"],
  ["need", "Need"],
  ["go", "Go"],
  ["search", "Search"],
  ["find", "Find"],
  ["take", "Take"],
  ["return", "Return"],
  ["change", "Change"],
];

function createEmptyPhases() {
  return phaseDefinitions.map(([id, title], index) => ({
    id,
    phaseEyebrow: `Story Circle Phase ${index + 1}`,
    phaseTitle: title,
    initiallyOpen: index === 0,
    objectiveValue: "",
    pressuresValue: "",
    consequencesValue: "",
    reentryHooksValue: "",
    beatSuggestionsValue: "",
  }));
}

const baseFixture = {
  sectionEyebrow: "Story Runtime",
  sectionTitle: "Narrative Objectives and Reentry",
  sectionDescription:
    "Author the Story-level gravity that surrounds the active Beat. These fields guide objectives, consequences, and natural reentry without forcing player decisions.",
  branchingPolicyLabel: "Branching Policy",
  branchingPolicyValue: "PLAYER_LED",
  branchingPolicyOptions,
  completionPolicyLabel: "Completion Policy",
  completionPolicyValue: "EVIDENCE_BASED",
  completionPolicyOptions,
  completionGuidanceLabel: "Story Completion Guidance",
  completionGuidanceValue:
    "The Story concludes when the missing courier is found and the harbor conspiracy is exposed.",
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
  phases: createEmptyPhases(),
  onChangeBranchingPolicy: null,
  onChangeCompletionPolicy: null,
  onChangeCompletionGuidance: null,
  onChangePhaseObjective: null,
  onChangePhasePressures: null,
  onChangePhaseConsequences: null,
  onChangePhaseReentryHooks: null,
  onChangePhaseBeatSuggestions: null,
};

export const storyNarrativeRuntimePopulatedFixture = {
  ...baseFixture,
  phases: createEmptyPhases().map((phase) => {
    if (phase.id === "you") {
      return {
        ...phase,
        objectiveValue:
          "Establish the party's ordinary position in the harbor district before the disappearance reshapes their priorities.",
        pressuresValue:
          "A storm is closing the eastern shipping lane.\nDockworkers are preparing to strike.",
        consequencesValue:
          "Delay makes witnesses harder to locate.\nOpen conflict draws the harbor watch.",
        reentryHooksValue:
          "A courier token appears among the party's belongings.\nA witness requests a private meeting.",
        beatSuggestionsValue:
          "Introduce the harbor's daily rhythm.\nReveal the first contradiction in the official account.",
      };
    }

    if (phase.id === "need") {
      return {
        ...phase,
        objectiveValue:
          "Make the courier's disappearance personally or strategically important to the party.",
        pressuresValue:
          "The courier's employer threatens to blame the party.",
        consequencesValue:
          "The investigation becomes public knowledge.",
        reentryHooksValue:
          "A rival offers partial information in exchange for a favor.",
        beatSuggestionsValue:
          "Connect one player history to the missing courier.",
      };
    }

    return phase;
  }),
};

export const storyNarrativeRuntimeEmptyFixture = {
  ...baseFixture,
  completionGuidanceValue: "",
  phases: createEmptyPhases(),
};

export const storyNarrativeRuntimeLatePhaseFixture = {
  ...baseFixture,
  branchingPolicyValue: "GUIDED",
  completionPolicyValue: "OBJECTIVE_BASED",
  phases: createEmptyPhases().map((phase) => ({
    ...phase,
    initiallyOpen: phase.id === "return",
    objectiveValue:
      phase.id === "return"
        ? "Bring the party back to the harbor with knowledge that changes the meaning of their original objective."
        : "",
    pressuresValue:
      phase.id === "return"
        ? "The harbor authority has sealed the docks.\nThe conspirators are destroying evidence."
        : "",
    consequencesValue:
      phase.id === "return"
        ? "Returning openly triggers a confrontation."
        : "",
    reentryHooksValue:
      phase.id === "return"
        ? "An ally leaves a signal in the abandoned customs house."
        : "",
    beatSuggestionsValue:
      phase.id === "return"
        ? "Reframe an early location with the new evidence."
        : "",
  })),
};

export const storyNarrativeRuntimeLongContentFixture = {
  ...storyNarrativeRuntimePopulatedFixture,
  sectionTitle:
    "Narrative Objectives, Consequences, and Reentry for a Large Multi-Region Story",
  sectionDescription:
    "A deliberately long description used to stress responsive layout while presenting Story-level objectives, branching constraints, consequences, and natural reentry guidance across an ensemble campaign with several competing factions.",
  completionGuidanceValue:
    "The Story may conclude only after the players have identified who altered the courier manifests, recovered enough evidence to survive public scrutiny, and made a meaningful decision about whether the harbor council should remain intact, be exposed, or be replaced.",
};

export const storyNarrativeRuntimeCustomCopyFixture = {
  ...storyNarrativeRuntimePopulatedFixture,
  sectionEyebrow: "Narrative Chassis",
  sectionTitle: "Story Circle Direction",
  sectionDescription:
    "Preview alternate presentation copy without changing authoring behavior.",
  branchingPolicyLabel: "Branch Freedom",
  completionPolicyLabel: "Ending Rule",
  completionGuidanceLabel: "Ending Evidence",
  phaseObjectiveLabel: "Narrative Gravity",
  pressuresLabel: "Active Pressures",
  beatSuggestionsLabel: "Suggested Beats",
  openLabel: "Expand",
  closeLabel: "Collapse",
};

export const storyNarrativeRuntimeMissingCallbacksFixture = {
  ...storyNarrativeRuntimePopulatedFixture,
  onChangeBranchingPolicy: null,
  onChangeCompletionPolicy: null,
  onChangeCompletionGuidance: null,
  onChangePhaseObjective: null,
  onChangePhasePressures: null,
  onChangePhaseConsequences: null,
  onChangePhaseReentryHooks: null,
  onChangePhaseBeatSuggestions: null,
};
