const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Scenario Add-ons",
  sectionDescription:
    "Edit future platform-level supports. For now these define intent; later they can become structured middleware rules.",
});

export const SCENARIO_MIDDLEWARE_MODULE_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "phase_gates",
    title: "Phase Gates",
    iconKey: "flag",
    body:
      "Track story beats and prevent jumping to later phases before required story conditions are met.",
    defaultEnabled: true,
  }),
  Object.freeze({
    id: "reward_gates",
    title: "Reward Gates",
    iconKey: "key",
    body:
      "Lock rewards, codes, characters, images, or reveals until scenario conditions are completed.",
    defaultEnabled: false,
  }),
  Object.freeze({
    id: "knowledge_boundaries",
    title: "Knowledge Boundaries",
    iconKey: "lock",
    body:
      "Help prevent NPCs from knowing events, secrets, or facts they have not witnessed or learned.",
    defaultEnabled: true,
  }),
  Object.freeze({
    id: "hidden_media_unlocks",
    title: "Hidden Media Unlocks",
    iconKey: "eye",
    body:
      "Reveal prestaged images, scenes, or future media only when story conditions are satisfied.",
    defaultEnabled: false,
  }),
  Object.freeze({
    id: "time_weather",
    title: "Time / Weather Support",
    iconKey: "compass",
    body:
      "Allow room state to track broad time, weather, atmosphere, and travel pacing later.",
    defaultEnabled: false,
  }),
  Object.freeze({
    id: "recap_support",
    title: "Recap Support",
    iconKey: "refresh",
    body:
      "Support structured recaps, phase summaries, and memory rollover prompts later.",
    defaultEnabled: true,
  }),
]);

export const DEFAULT_SCENARIO_MIDDLEWARE_MODULES = Object.freeze(
  SCENARIO_MIDDLEWARE_MODULE_DEFINITIONS.reduce((defaults, module) => {
    defaults[module.id] = module.defaultEnabled;
    return defaults;
  }, {})
);

export function normalizeScenarioMiddlewareModules(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

export function getScenarioMiddlewareSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const storedModules = normalizeScenarioMiddlewareModules(
    form?.data?.middleware_modules
  );
  const enabledModules = {
    ...DEFAULT_SCENARIO_MIDDLEWARE_MODULES,
    ...storedModules,
  };

  return {
    ...DEFAULT_COPY,
    modules: SCENARIO_MIDDLEWARE_MODULE_DEFINITIONS.map((module) => ({
      id: module.id,
      title: module.title,
      body: module.body,
      iconKey: module.iconKey,
      isEnabled: Boolean(enabledModules[module.id]),
      onToggle: () =>
        updateDataField?.("middleware_modules", {
          ...enabledModules,
          [module.id]: !enabledModules[module.id],
        }),
    })),
  };
}

export function useScenarioMiddlewareSectionViewModel(props = {}) {
  return getScenarioMiddlewareSectionViewProps(props);
}
