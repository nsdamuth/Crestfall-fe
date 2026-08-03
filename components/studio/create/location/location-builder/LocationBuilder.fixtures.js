import {
  LOCATION_CONTENT_RATING_OPTIONS,
  LOCATION_IMAGE_COUNT_OPTIONS,
  LOCATION_RENDERING_STYLE_OPTIONS,
  LOCATION_VISIBILITY_OPTIONS,
} from "./LocationBuilder.contract";
import {
  LOCATION_BUILDER_INITIAL_DATA,
  LOCATION_BUILDER_INITIAL_FORM,
} from "./useLocationBuilderViewModel";

const classificationFields = [
  {
    id: "space_type",
    label: "Space Type",
    options: [
      { value: "", label: "Not chosen" },
      { value: "INTERIOR", label: "Interior" },
      { value: "EXTERIOR", label: "Exterior" },
      { value: "CITY", label: "City" },
      { value: "WILDERNESS", label: "Wilderness" },
      { value: "DREAMLIKE", label: "Dreamlike" },
    ],
  },
  {
    id: "locationScale",
    label: "Location Scale",
    options: [
      { value: "", label: "Not chosen" },
      { value: "REALM", label: "Realm / Plane" },
      { value: "CITY", label: "City" },
      { value: "DISTRICT", label: "District" },
      { value: "BUILDING", label: "Building" },
      { value: "ROOM", label: "Room" },
    ],
  },
  {
    id: "mood",
    label: "Mood",
    options: [
      { value: "", label: "Not chosen" },
      { value: "PEACEFUL", label: "Peaceful" },
      { value: "DANGEROUS", label: "Dangerous" },
      { value: "MYSTERIOUS", label: "Mysterious" },
      { value: "ANCIENT", label: "Ancient" },
    ],
  },
];

function buildFixture(overrides = {}) {
  return {
    form: {
      ...LOCATION_BUILDER_INITIAL_FORM,
      name: "Moonwell Tea House",
      description:
        "A lantern-lit tea house built around a moon-bright spring in the Old Crescent.",
      prompt:
        "Warm brass lanterns, rain-dark stone, carved wood screens, moonlit water, quiet market traffic, and intimate tables for rumor-heavy scenes.",
      image_prompt:
        "Fantasy tea house interior around a luminous moonwell, brass lanterns, carved wood, rain outside, cinematic depth.",
      negative_prompt: "modern logos, fluorescent office lighting",
      tags: "tea house, old crescent, moonwell, market",
    },
    locationData: {
      ...LOCATION_BUILDER_INITIAL_DATA,
      space_type: "INTERIOR",
      locationScale: "BUILDING",
      mood: "MYSTERIOUS",
      parentLocationId: "location-old-crescent",
      parentLocationTitle: "Old Crescent",
      parentLocationDescription: "An artisan district of narrow lanes and markets.",
      parentLocationImageUrl: "",
      parentLocationScale: "DISTRICT",
      parentLocationSpaceType: "CITY",
    },
    classificationFields,
    promptLabel: "Location Guidance",
    promptPlaceholder:
      "Describe the place, mood, lighting, time, weather, architecture, atmosphere, and story use.",
    candidates: Array.from({ length: 4 }, (_, index) => ({
      id: `candidate-${index + 1}`,
      label: `Candidate ${index + 1}`,
    })),
    selectedCover: "candidate-2",
    runtimeSummary: {
      registryCount: 3,
      hasWeatherModule: true,
      hasTimeCalendarModule: true,
    },
    visibilityOptions: LOCATION_VISIBILITY_OPTIONS,
    contentRatingOptions: LOCATION_CONTENT_RATING_OPTIONS,
    renderingStyleOptions: LOCATION_RENDERING_STYLE_OPTIONS,
    imageCountOptions: LOCATION_IMAGE_COUNT_OPTIONS,
    sensoryEnvironmentContent: null,
    runtimeModulesContent: null,
    registryAttachmentsContent: null,
    parentPickerContent: null,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    onUpdateField: () => {},
    onUpdateLocationData: () => {},
    onUpdateInheritance: () => {},
    onSelectCover: () => {},
    onOpenParentPicker: () => {},
    onClearParentLocation: () => {},
    onSave: () => {},
    ...overrides,
  };
}

export const locationBuilderConfiguredFixture = buildFixture();

export const locationBuilderEmptyFixture = buildFixture({
  form: { ...LOCATION_BUILDER_INITIAL_FORM },
  locationData: { ...LOCATION_BUILDER_INITIAL_DATA },
  selectedCover: null,
  runtimeSummary: {
    registryCount: 0,
    hasWeatherModule: false,
    hasTimeCalendarModule: false,
  },
});

export const locationBuilderLocalRuntimeFixture = buildFixture({
  locationData: {
    ...LOCATION_BUILDER_INITIAL_DATA,
    space_type: "EXTERIOR",
    locationScale: "LANDMARK",
    mood: "ANCIENT",
    inheritance: {
      inheritsWeather: false,
      inheritsTime: false,
      inheritsKnowledgeRules: true,
      inheritsTravelRules: true,
    },
  },
  runtimeSummary: {
    registryCount: 1,
    hasWeatherModule: true,
    hasTimeCalendarModule: true,
  },
});

export const locationBuilderSavingFixture = buildFixture({
  saveStatus: "saving",
  saveDisabled: true,
});

export const locationBuilderSavedFixture = buildFixture({
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});

export const locationBuilderErrorFixture = buildFixture({
  saveStatus: "error",
  saveMessage: "Location draft could not be saved.",
});
