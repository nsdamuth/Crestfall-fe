"use client";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Location Editor",
  sectionTitle: "Scene / Atmosphere",
  sectionDescription:
    "Define lighting, mood, environmental conditions, sensory texture, and scene presence for this location.",
  moodLabel: "Mood / Atmosphere",
  lightingLabel: "Lighting",
  timeOfDayLabel: "Time of Day",
  weatherLabel: "Weather / Conditions",
  activityLevelLabel: "Activity Level",
  populationPresenceLabel: "Population / Presence",
  sensoryNotesLabel: "Sensory Notes",
  sensoryNotesPlaceholder:
    "Optional details about sound, smell, temperature, texture, ambience, movement, or environmental feel.",
  sensoryEnvironmentFallbackText:
    "Structured sensory-environment controls are supplied by the application Binding Shell.",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function normalizeLocationSceneAtmosphereData(form = {}) {
  const source = normalizeObject(form?.data);

  return {
    mood: source.mood || source.atmosphere || "",
    lighting: source.lighting || "",
    timeOfDay: source.time_of_day || "",
    weather: source.weather || source.conditions || "",
    activityLevel: source.activity_level || "",
    populationPresence: source.population_presence || "",
    sensoryNotes: source.sensory_notes || "",
    sensoryProfile: source.sensoryProfile || source.sensory_profile || null,
  };
}

export function useLocationSceneAtmosphereSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const normalized = normalizeLocationSceneAtmosphereData(form);

  return {
    viewProps: {
      ...DEFAULT_COPY,
      moodValue: normalized.mood,
      lightingValue: normalized.lighting,
      timeOfDayValue: normalized.timeOfDay,
      weatherValue: normalized.weather,
      activityLevelValue: normalized.activityLevel,
      populationPresenceValue: normalized.populationPresence,
      sensoryNotesValue: normalized.sensoryNotes,
      onChangeMood: (value) => updateDataField?.("mood", value),
      onChangeLighting: (value) => updateDataField?.("lighting", value),
      onChangeTimeOfDay: (value) => updateDataField?.("time_of_day", value),
      onChangeWeather: (value) => updateDataField?.("weather", value),
      onChangeActivityLevel: (value) =>
        updateDataField?.("activity_level", value),
      onChangePopulationPresence: (value) =>
        updateDataField?.("population_presence", value),
      onChangeSensoryNotes: (value) =>
        updateDataField?.("sensory_notes", value),
    },
    sensoryProfile: normalized.sensoryProfile,
    onChangeSensoryProfile: (sensoryProfile) =>
      updateDataField?.("sensoryProfile", sensoryProfile),
  };
}
