export const LOCATION_SCENE_ATMOSPHERE_SECTION_VIEW_CONTRACT_VERSION =
  "locationSceneAtmosphereSection.view.v1";

export const LOCATION_SCENE_ATMOSPHERE_SECTION_VIEW_CONTRACT = Object.freeze({
  feature: "LocationSceneAtmosphereSection",
  version: LOCATION_SCENE_ATMOSPHERE_SECTION_VIEW_CONTRACT_VERSION,
  boundary:
    "Portable View receives display-ready atmosphere values, a semantic sensory slot, and semantic callbacks only.",
  viewInputs: Object.freeze([
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "moodValue",
    "lightingValue",
    "timeOfDayValue",
    "weatherValue",
    "activityLevelValue",
    "populationPresenceValue",
    "sensoryNotesValue",
    "sensoryEnvironmentSlot",
  ]),
  semanticCallbacks: Object.freeze([
    "onChangeMood",
    "onChangeLighting",
    "onChangeTimeOfDay",
    "onChangeWeather",
    "onChangeActivityLevel",
    "onChangePopulationPresence",
    "onChangeSensoryNotes",
  ]),
  storageFields: Object.freeze([
    "mood",
    "lighting",
    "time_of_day",
    "weather",
    "activity_level",
    "population_presence",
    "sensory_notes",
    "sensoryProfile",
  ]),
  legacyReadFields: Object.freeze([
    "atmosphere",
    "conditions",
    "sensory_profile",
  ]),
  applicationOwned: Object.freeze([
    "Creation form hydration",
    "legacy field normalization",
    "structured sensory editor composition",
    "Creation save orchestration",
    "persistence",
  ]),
});
