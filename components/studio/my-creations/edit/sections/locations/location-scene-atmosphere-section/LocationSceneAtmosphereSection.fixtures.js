const sharedCopy = {
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
};

export const locationSceneAtmosphereCompleteFixture = Object.freeze({
  ...sharedCopy,
  moodValue:
    "Warm, guarded, commercially alive, and quietly suspicious beneath the surface.",
  lightingValue:
    "Warm brass lamps, rain-dim window light, and small glyph glows under glass.",
  timeOfDayValue: "Rainy morning",
  weatherValue:
    "Steady rain outside with damp market air entering whenever the door opens.",
  activityLevelValue:
    "Moderate workshop activity with a busy trade district immediately outside.",
  populationPresenceValue:
    "The artificer is usually present; customers and couriers appear intermittently.",
  sensoryNotesValue:
    "Warm brass, machine oil, rain-wet stone, parchment dust, soft ticking, sliding drawers, and distant bargaining voices.",
});

export const locationSceneAtmosphereLegacyFixture = Object.freeze({
  ...sharedCopy,
  moodValue: "Legacy atmosphere fallback: tense but controlled",
  lightingValue: "Cold archive strips and intermittent warning lights",
  timeOfDayValue: "Late shift",
  weatherValue: "Legacy conditions fallback: heavy fog beyond the windows",
  activityLevelValue: "Low",
  populationPresenceValue: "Two archivists and one security observer",
  sensoryNotesValue: "Dry paper, ozone, quiet ventilation, and distant lift cables",
});

export const locationSceneAtmosphereSparseFixture = Object.freeze({
  ...sharedCopy,
  moodValue: "Peaceful",
  lightingValue: "",
  timeOfDayValue: "",
  weatherValue: "",
  activityLevelValue: "",
  populationPresenceValue: "",
  sensoryNotesValue: "",
});

export const locationSceneAtmosphereEmptyFixture = Object.freeze({
  ...sharedCopy,
  moodValue: "",
  lightingValue: "",
  timeOfDayValue: "",
  weatherValue: "",
  activityLevelValue: "",
  populationPresenceValue: "",
  sensoryNotesValue: "",
});
