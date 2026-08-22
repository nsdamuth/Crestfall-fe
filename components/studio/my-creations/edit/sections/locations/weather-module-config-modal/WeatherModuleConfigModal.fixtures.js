const selectOptions = (values) =>
  values.map((value) => ({ value, label: value }));

export const weatherModuleConfigExistingFixture = Object.freeze({
  isInitializing: false,
  loadingMessage: "Loading weather module...",
  eyebrow: "Location Runtime Module",
  title: "Configure In-World Weather",
  description:
    "Choose recommended weather conditions, control which conditions are available here, and tune how strongly weather appears in the scene.",
  message: "Existing fixture module loaded.",
  moduleTitle: "Old Crescent Weather Rules",
  priority: "45",
  moduleDescription:
    "Weather rules for streets, shops, and interiors in the Old Crescent.",
  moduleTypeLabel: "In-World Weather",
  moduleStatusLabel: "Existing weather module",
  currentConditionId: "blue_mist",
  currentConditionOptions: [
    { value: "blue_mist", label: "Blue Mist" },
    { value: "light_rain", label: "Light Rain" },
  ],
  weatherDisplayName: "Blue Mist",
  weatherDisplayPlaceholder: "Blue Mist",
  climateProfile: "Old Crescent City",
  selectedPresetId: "warm_wind",
  recommendedConditionOptions: [
    { value: "warm_wind", label: "Warm Wind · TEMPERATE_MAGICAL" },
    { value: "fog", label: "Fog · FOG" },
    { value: "snowfall", label: "Snowfall · SNOW" },
  ],
  conditionCards: [
    {
      id: "blue_mist",
      label: "Blue Mist",
      summary: "MAGICAL · ATMOSPHERIC · LOW hazard · Can affect interiors",
      category: "MAGICAL",
      sceneImpact: "ATMOSPHERIC",
      hazardLevel: "LOW",
      tagsText: "mist, magic, blue",
      sensoryNotesText:
        "Sight: soft blue vapor pooling near lamps\nSound: faint glasslike ringing\nTouch: cool damp air\nSmell: rain and ozone",
      composerGuidance:
        "Use as magical atmosphere, not a hard obstacle unless intensified.",
      allowed: true,
      blocked: false,
      allowedIndoors: true,
      weight: "30",
      isCurrent: true,
      categoryOptions: selectOptions(["MAGICAL", "FOG", "CUSTOM"]),
      sceneImpactOptions: selectOptions([
        "BACKGROUND",
        "ATMOSPHERIC",
        "SCENE_SHAPING",
        "OBSTACLE",
      ]),
      hazardLevelOptions: selectOptions(["NONE", "LOW", "MEDIUM", "HIGH"]),
    },
    {
      id: "light_rain",
      label: "Light Rain",
      summary: "RAIN · ATMOSPHERIC · LOW hazard · Primarily outdoor",
      category: "RAIN",
      sceneImpact: "ATMOSPHERIC",
      hazardLevel: "LOW",
      tagsText: "rain, wet, calm",
      sensoryNotesText:
        "Sight: thin rain on stone and glass\nSound: soft rain tapping on awnings\nSmell: wet stone",
      composerGuidance: "Use for mood, texture, and travel atmosphere.",
      allowed: true,
      blocked: false,
      allowedIndoors: false,
      weight: "40",
      isCurrent: false,
      categoryOptions: selectOptions(["RAIN", "TEMPERATE", "CUSTOM"]),
      sceneImpactOptions: selectOptions([
        "BACKGROUND",
        "ATMOSPHERIC",
        "SCENE_SHAPING",
        "OBSTACLE",
      ]),
      hazardLevelOptions: selectOptions(["NONE", "LOW", "MEDIUM", "HIGH"]),
    },
  ],
  detailLevel: "MEDIUM",
  detailLevelOptions: selectOptions(["MINIMAL", "LOW", "MEDIUM", "HIGH", "RICH"]),
  frequency: "OCCASIONAL",
  frequencyOptions: selectOptions([
    "RARE",
    "OCCASIONAL",
    "NORMAL",
    "FREQUENT",
    "CONSTANT",
  ]),
  tone: "ATMOSPHERIC",
  surfaceSensoryNotes: true,
  allowWeatherComplications: false,
  respectIndoorOutdoorLogic: true,
  isSaving: false,
  footerNote:
    "Weather module changes save immediately. Location binding changes still require the normal Location save button.",
});

export const weatherModuleConfigBlockedFixture = Object.freeze({
  ...weatherModuleConfigExistingFixture,
  message: "Dust Haze is retained in the library but blocked here.",
  currentConditionId: "dust_haze",
  currentConditionOptions: [
    { value: "dust_haze", label: "Dust Haze" },
  ],
  weatherDisplayName: "Dust Haze",
  conditionCards: [
    {
      ...weatherModuleConfigExistingFixture.conditionCards[1],
      id: "dust_haze",
      label: "Dust Haze",
      summary: "URBAN_DRY · ATMOSPHERIC · LOW hazard · Primarily outdoor",
      category: "URBAN_DRY",
      tagsText: "dust, dry, city",
      sensoryNotesText:
        "Sight: golden dust hanging in streetlight\nSmell: dry stone and grit\nTouch: fine dust clinging to fabric",
      composerGuidance: "Use as street-level haze, not heavy danger.",
      blocked: true,
      isCurrent: true,
      weight: "10",
    },
  ],
});

export const weatherModuleConfigLoadingFixture = Object.freeze({
  isInitializing: true,
  loadingMessage: "Loading weather module...",
});

// Fresh-create variant (DOC-DRIFT fix, ED1G SW6): no existing module
// instance yet, the module is created on save.
export const weatherModuleConfigFreshCreateFixture = Object.freeze({
  ...weatherModuleConfigExistingFixture,
  message: "",
  moduleTitle: "Location Weather Rules",
  moduleDescription: "Configurable weather module instance for this location.",
  moduleStatusLabel: "Will be created on save",
  hasUnsavedChanges: false,
});

// Error messageTone variant (DOC-DRIFT fix, ED1G SW6): exercises the
// --status-danger chip path the existing fixture never reached.
export const weatherModuleConfigErrorFixture = Object.freeze({
  ...weatherModuleConfigExistingFixture,
  message: "Weather module instance could not be loaded. You can create a new one by saving.",
  messageTone: "error",
});
