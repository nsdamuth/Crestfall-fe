const baseModules = [
  {
    id: "phase_gates",
    title: "Phase Gates",
    iconKey: "flag",
    body:
      "Track story beats and prevent jumping to later phases before required story conditions are met.",
    isEnabled: true,
    onToggle: null,
  },
  {
    id: "reward_gates",
    title: "Reward Gates",
    iconKey: "key",
    body:
      "Lock rewards, codes, characters, images, or reveals until scenario conditions are completed.",
    isEnabled: false,
    onToggle: null,
  },
  {
    id: "knowledge_boundaries",
    title: "Knowledge Boundaries",
    iconKey: "lock",
    body:
      "Help prevent NPCs from knowing events, secrets, or facts they have not witnessed or learned.",
    isEnabled: true,
    onToggle: null,
  },
  {
    id: "hidden_media_unlocks",
    title: "Hidden Media Unlocks",
    iconKey: "eye",
    body:
      "Reveal prestaged images, scenes, or future media only when story conditions are satisfied.",
    isEnabled: false,
    onToggle: null,
  },
  {
    id: "time_weather",
    title: "Time / Weather Support",
    iconKey: "compass",
    body:
      "Allow room state to track broad time, weather, atmosphere, and travel pacing later.",
    isEnabled: false,
    onToggle: null,
  },
  {
    id: "recap_support",
    title: "Recap Support",
    iconKey: "refresh",
    body:
      "Support structured recaps, phase summaries, and memory rollover prompts later.",
    isEnabled: true,
    onToggle: null,
  },
];

const baseFixture = {
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Scenario Add-ons",
  sectionDescription:
    "Edit future platform-level supports. For now these define intent; later they can become structured middleware rules.",
  modules: baseModules,
};

export const scenarioMiddlewareDefaultsFixture = {
  ...baseFixture,
};

export const scenarioMiddlewareAllEnabledFixture = {
  ...baseFixture,
  modules: baseModules.map((module) => ({ ...module, isEnabled: true })),
};

export const scenarioMiddlewareAllDisabledFixture = {
  ...baseFixture,
  modules: baseModules.map((module) => ({ ...module, isEnabled: false })),
};

export const scenarioMiddlewareCustomConfigurationFixture = {
  ...baseFixture,
  modules: baseModules.map((module) => ({
    ...module,
    isEnabled: ["reward_gates", "hidden_media_unlocks", "time_weather"].includes(
      module.id
    ),
  })),
};

export const scenarioMiddlewareMissingCallbacksFixture = {
  ...baseFixture,
  modules: baseModules.map((module) => ({ ...module, onToggle: null })),
};

export const scenarioMiddlewareLongCopyFixture = {
  ...baseFixture,
  sectionDescription:
    "Preview a longer handoff description that explains how author intent can be captured before the corresponding middleware becomes an enforced runtime subsystem.",
  modules: baseModules.map((module) => ({
    ...module,
    body: `${module.body} This additional preview sentence checks wrapping and vertical card balance without changing the semantic module contract.`,
  })),
};
