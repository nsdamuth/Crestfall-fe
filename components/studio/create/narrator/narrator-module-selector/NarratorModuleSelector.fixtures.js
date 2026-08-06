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
        title: "Scene Narration Only · Default",
        body: "Narrates environments, transitions, consequences, arrivals, and passive continuity.",
      },
      {
        id: "ENSEMBLE",
        value: "ENSEMBLE",
        title: "Ensemble Narration · Opt In",
        body: "Allows the Narrator to portray a bounded number of active Scene Cast Characters.",
      },
    ],
  },
];

const MODULE_GROUPS = [
  {
    id: "prose_style",
    label: "Prose Style",
    description: "Controls the narrator's sentence style and descriptive voice.",
    modules: [
      {
        id: "cinematic",
        title: "Cinematic",
        body: "Scene-forward, visual, dramatic, and composed like a film sequence.",
      },
      {
        id: "literary",
        title: "Literary",
        body: "Elegant, reflective, and prose-rich without becoming purple.",
      },
      {
        id: "sensory_rich",
        title: "Sensory Rich",
        body: "Leans into scent, texture, sound, light, atmosphere, and physical sensation.",
      },
      {
        id: "direct",
        title: "Direct",
        body: "Clear, clean, efficient narration with minimal ornament.",
      },
    ],
  },
  {
    id: "detail_level",
    label: "Detail Level",
    description: "Controls how much detail the narrator tends to include.",
    modules: [
      {
        id: "minimal",
        title: "Minimal",
        body: "Short narration that leaves more room for dialogue and player action.",
      },
      {
        id: "balanced",
        title: "Balanced",
        body: "Moderate detail that grounds scenes without slowing play.",
      },
      {
        id: "rich",
        title: "Rich",
        body: "More descriptive texture, emotional detail, and environmental grounding.",
      },
      {
        id: "lavish",
        title: "Lavish",
        body: "Highly detailed, atmospheric narration for slower scenes.",
      },
    ],
  },
  {
    id: "atmosphere",
    label: "Atmosphere",
    description: "Controls the emotional and genre flavor of scenes.",
    modules: [
      {
        id: "adventurous",
        title: "Adventurous",
        body: "Wonder, danger, travel, discovery, and forward motion.",
      },
      {
        id: "dark_fairytale",
        title: "Dark Fairytale",
        body: "Beautiful, strange, dangerous, symbolic, and slightly uncanny.",
      },
      {
        id: "noir",
        title: "Noir",
        body: "Suspicion, leverage, secrets, debts, shadows, and social pressure.",
      },
      {
        id: "romantic",
        title: "Romantic",
        body: "Emotional tension, intimacy, longing, attention, and charged closeness.",
      },
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
    atmosphere: "noir",
  },
});

export const narratorModuleSelectorEnsembleFixture = buildFixture({
  portrayalMode: "ENSEMBLE",
  ensembleCharacterLimit: 3,
  selectedModules: {
    prose_style: "sensory_rich",
    detail_level: "lavish",
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
