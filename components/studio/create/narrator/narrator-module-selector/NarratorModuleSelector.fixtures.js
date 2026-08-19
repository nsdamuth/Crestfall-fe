const RESPONSE_GROUPS = [
  {
    id: "auto_responder_mode",
    label: "Primary Interaction",
    description: "Controls who owns ordinary AUTO responses.",
    options: [
      {
        id: "ADAPTIVE_CAST",
        value: "ADAPTIVE_CAST",
        title: "Adaptive Cast",
        body: "AUTO may choose the Narrator or an eligible active Character according to the current scene.",
      },
      {
        id: "NARRATOR_PRIMARY",
        value: "NARRATOR_PRIMARY",
        title: "Narrator Primary",
        body: "AUTO returns to the Narrator while explicit Character selection remains available.",
      },
    ],
  },
  {
    id: "portrayal_mode",
    label: "Character Portrayal",
    description:
      "Controls how much authority a Narrator-owned response has over loaded Characters.",
    options: [
      {
        id: "SCENE_ONLY",
        value: "SCENE_ONLY",
        title: "Scene Narration Only — Default",
        body: "Narrates environments, transitions, consequences, arrivals, and passive continuity.",
      },
      {
        id: "ENSEMBLE",
        value: "ENSEMBLE",
        title: "Ensemble Narration — Opt In",
        body: "Allows the Narrator to portray a bounded number of active Scene Cast Characters.",
      },
    ],
  },
];

const MODULE_GROUPS = [
  {
    id: "prose_style",
    label: "Prose Style",
    description: "Shapes story-wide non-dialogue narration and staging.",
    modules: [
      { id: "cinematic", title: "Cinematic", body: "Scene-forward and visual." },
      { id: "literary", title: "Literary", body: "Reflective and prose-rich." },
      { id: "sensory_rich", title: "Sensory Rich", body: "Selective sensory texture." },
      { id: "direct", title: "Direct", body: "Clear and economical." },
    ],
  },
  {
    id: "detail_level",
    label: "Detail Level",
    description: "Guides non-speech descriptive density without setting a word count.",
    modules: [
      { id: "minimal", title: "Minimal", body: "Essential scene detail." },
      { id: "balanced", title: "Balanced", body: "Moderate scene grounding." },
      { id: "rich", title: "Rich", body: "More useful descriptive texture." },
      { id: "lavish", title: "Lavish", body: "Layered immersive scene detail." },
    ],
  },
  {
    id: "pacing",
    label: "Pacing",
    description: "Guides flow pressure within the current authorized beat only.",
    modules: [
      { id: "fast", title: "Fast", body: "Economical, action-forward composition." },
      { id: "balanced", title: "Balanced", body: "Normal movement and breathing room." },
      { id: "slow_burn", title: "Slow Burn", body: "Allows tension and anticipation to breathe." },
      { id: "scene_heavy", title: "Scene Heavy", body: "Emphasizes staging and moment-to-moment texture." },
    ],
  },
  {
    id: "atmosphere",
    label: "Atmosphere",
    description: "Controls the story-wide emotional and genre flavor of scenes.",
    modules: [
      { id: "adventurous", title: "Adventurous", body: "Wonder, danger, travel, discovery, and forward possibility." },
      { id: "dark_fairytale", title: "Dark Fairytale", body: "Beautiful, strange, dangerous, symbolic, and slightly uncanny." },
      { id: "noir", title: "Noir", body: "Suspicion, leverage, secrets, debts, shadows, and social pressure." },
      { id: "romantic", title: "Romantic", body: "Emotional tension, intimacy, longing, attention, and charged closeness." },
      { id: "horror", title: "Horror", body: "Dread, unease, vulnerability, threat, and controlled fear." },
      { id: "whimsical", title: "Whimsical", body: "Playful strangeness, charm, surprise, and light magical oddity." },
    ],
  },
];

const ENSEMBLE_LIMITS = [
  { id: "1", value: 1, title: "1 Character" },
  { id: "2", value: 2, title: "2 Characters" },
  { id: "3", value: 3, title: "3 Characters" },
  { id: "ALL_RELEVANT", value: "ALL_RELEVANT", title: "All Relevant" },
];

function withActiveOptions(items, activeValue) {
  return items.map((item) => ({
    ...item,
    active: item.value === activeValue,
  }));
}

function withActiveModules(groups, selectedModules) {
  return groups.map((group) => ({
    ...group,
    modules: group.modules.map((module) => ({
      ...module,
      active: selectedModules[group.id] === module.id,
    })),
  }));
}

function buildFixture({
  autoResponderMode = "ADAPTIVE_CAST",
  portrayalMode = "SCENE_ONLY",
  ensembleCharacterLimit = 2,
  selectedModules = {
    prose_style: "cinematic",
    detail_level: "balanced",
    pacing: "balanced",
    atmosphere: "adventurous",
  },
  overrides = {},
} = {}) {
  return {
    sectionEyebrow: "Official Starter Modules",
    sectionTitle: "Build from Modules",
    sectionDescription:
      "Choose official prebuilt narrator modules. These are lightweight style and behavior presets that can later be bundled into a reusable narrator.",
    responseEyebrow: "Response Direction",
    responseTitle: "Narrator Control",
    responseDescription:
      "Choose whether AUTO follows the active Cast or returns to the Narrator, and whether Narrator-owned responses remain scene-only or may portray an active ensemble.",
    responseDirectionGroups: RESPONSE_GROUPS.map((group) => ({
      ...group,
      options: withActiveOptions(
        group.options,
        group.id === "auto_responder_mode"
          ? autoResponderMode
          : portrayalMode
      ),
    })),
    showEnsembleLimit: portrayalMode === "ENSEMBLE",
    ensembleLimitLabel: "Ensemble Character Limit",
    ensembleLimitDescription:
      "Maximum active Characters the Narrator may portray in one Narrator-owned response.",
    ensembleLimitOptions: withActiveOptions(
      ENSEMBLE_LIMITS,
      ensembleCharacterLimit
    ),
    safeDefaultNote:
      "Scene Narration Only remains the safe default. Ensemble authority is not activated unless the creator explicitly selects it.",
    moduleGroups: withActiveModules(MODULE_GROUPS, selectedModules),
    ...overrides,
  };
}

export const narratorModuleSelectorDefaultFixture = buildFixture();

export const narratorModuleSelectorNarratorPrimaryFixture = buildFixture({
  autoResponderMode: "NARRATOR_PRIMARY",
  selectedModules: {
    prose_style: "literary",
    detail_level: "rich",
    pacing: "slow_burn",
    atmosphere: "noir",
  },
});

export const narratorModuleSelectorEnsembleFixture = buildFixture({
  portrayalMode: "ENSEMBLE",
  ensembleCharacterLimit: 3,
  selectedModules: {
    prose_style: "sensory_rich",
    detail_level: "lavish",
    pacing: "scene_heavy",
    atmosphere: "dark_fairytale",
  },
});

export const narratorModuleSelectorNoActiveModulesFixture = buildFixture({
  selectedModules: {},
});

export const narratorModuleSelectorLongContentFixture = buildFixture({
  overrides: {
    sectionTitle:
      "Build a Deliberately Detailed Narrator from Independently Configurable Starter Modules",
    sectionDescription:
      "This deliberately long fixture verifies that the module selector remains readable when headings, descriptions, and option copy expand across multiple lines on narrow and wide screens.",
    moduleGroups: [
      {
        id: "long_group",
        label: "Deliberately Long Module Group Heading",
        description:
          "A longer supporting explanation verifies responsive wrapping without changing the option-card hierarchy or selected-state presentation.",
        modules: [
          {
            id: "long_module",
            title:
              "Extremely Descriptive, Deliberate, and Atmospherically Layered Narration",
            body: "A deliberately extended module description that spans several lines and tests card height, wrapping, spacing, and readability across responsive layouts.",
            active: true,
          },
        ],
      },
    ],
  },
});

export const narratorModuleSelectorEmptyFixture = buildFixture({
  overrides: {
    responseDirectionGroups: [],
    ensembleLimitOptions: [],
    moduleGroups: [],
  },
});

export const narratorModuleSelectorMissingCallbacksFixture = {
  ...narratorModuleSelectorDefaultFixture,
  onSelectResponseDirection: null,
  onSelectEnsembleCharacterLimit: null,
  onSelectModule: null,
};
