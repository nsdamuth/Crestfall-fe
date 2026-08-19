export const CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION =
  "camera_preset.presentation.v1";

export const CAMERA_PRESET_GROUPS = Object.freeze([
  Object.freeze({ id: "shot-size", label: "Shot Size" }),
  Object.freeze({ id: "camera-angle", label: "Camera Angle" }),
  Object.freeze({ id: "camera-movement", label: "Camera Movement" }),
  Object.freeze({ id: "lens", label: "Lens" }),
  Object.freeze({ id: "focus", label: "Focus" }),
  Object.freeze({ id: "lighting-direction", label: "Lighting Direction" }),
  Object.freeze({ id: "specialized", label: "Specialized" }),
]);

export const CAMERA_PRESET_OPTIONS = Object.freeze([
  Object.freeze({ value: "AUTO", label: "Auto / No Camera Filter", groupId: "auto", description: "Let the image model choose framing and camera treatment." }),
  Object.freeze({ value: "EXTREME_WIDE_SHOT", label: "Extreme Wide Shot (EWS)", groupId: "shot-size", description: "Establishing view with the character small in the environment." }),
  Object.freeze({ value: "WIDE_SHOT", label: "Wide Shot (WS)", groupId: "shot-size", description: "Full figure visible from head to toe." }),
  Object.freeze({ value: "MEDIUM_WIDE_SHOT", label: "Medium Wide Shot (MWS)", groupId: "shot-size", description: "Character-focused full-body framing, generally from the knees up." }),
  Object.freeze({ value: "MEDIUM_SHOT", label: "Medium Shot (MS)", groupId: "shot-size", description: "Waist-up framing centered on the upper body." }),
  Object.freeze({ value: "MEDIUM_CLOSE_UP", label: "Medium Close-Up (MCU)", groupId: "shot-size", description: "Chest-up framing for expression and upper-torso detail." }),
  Object.freeze({ value: "CLOSE_UP", label: "Close-Up (CU)", groupId: "shot-size", description: "Face-focused framing with detailed features and expression." }),
  Object.freeze({ value: "EXTREME_CLOSE_UP", label: "Extreme Close-Up (ECU)", groupId: "shot-size", description: "Macro-style intimate detail such as the eyes or a texture." }),
  Object.freeze({ value: "LOW_ANGLE_SHOT", label: "Low Angle Shot", groupId: "camera-angle", description: "Looks upward to make the subject feel imposing or heroic." }),
  Object.freeze({ value: "HIGH_ANGLE_SHOT", label: "High Angle Shot", groupId: "camera-angle", description: "Looks down from above for a vulnerable or observational perspective." }),
  Object.freeze({ value: "DUTCH_ANGLE", label: "Dutch Angle / Dutch Tilt", groupId: "camera-angle", description: "Tilts the horizon for an off-kilter dynamic composition." }),
  Object.freeze({ value: "POINT_OF_VIEW_SHOT", label: "Point of View (POV) Shot", groupId: "camera-angle", description: "First-person framing from the character's perspective." }),
  Object.freeze({ value: "OVER_THE_SHOULDER_SHOT", label: "Over-the-Shoulder Shot", groupId: "camera-angle", description: "Frames the scene from behind a foreground shoulder." }),
  Object.freeze({ value: "TRACKING_SHOT", label: "Tracking Shot", groupId: "camera-movement", description: "Follows movement with a smooth lateral or dolly feel." }),
  Object.freeze({ value: "CRANE_SHOT", label: "Crane Shot", groupId: "camera-movement", description: "Elevated sweeping view with a sense of grand scale." }),
  Object.freeze({ value: "HANDHELD_SHOT", label: "Handheld Shot", groupId: "camera-movement", description: "Natural documentary-style movement with a raw feel." }),
  Object.freeze({ value: "ZOOM_SHOT", label: "Zoom Shot", groupId: "camera-movement", description: "Dynamic focal change and perspective shift." }),
  Object.freeze({ value: "WIDE_ANGLE_LENS", label: "Wide Angle Lens", groupId: "lens", description: "Expansive environmental view with exaggerated depth." }),
  Object.freeze({ value: "TELEPHOTO_LENS", label: "Telephoto Lens", groupId: "lens", description: "Compressed space with selective focus and background blur." }),
  Object.freeze({ value: "FISH_EYE_LENS", label: "Fish Eye Lens", groupId: "lens", description: "Surreal circular framing with strong barrel distortion." }),
  Object.freeze({ value: "SHALLOW_DEPTH_OF_FIELD", label: "Shallow Depth of Field", groupId: "focus", description: "Isolates the subject against a soft blurred background." }),
  Object.freeze({ value: "DEEP_FOCUS", label: "Deep Focus", groupId: "focus", description: "Keeps foreground through background sharp and detailed." }),
  Object.freeze({ value: "RACK_FOCUS", label: "Rack Focus", groupId: "focus", description: "Suggests a dramatic focal shift that guides attention." }),
  Object.freeze({ value: "BACKLIT_SHOT", label: "Backlit Shot", groupId: "lighting-direction", description: "Rim light, silhouette, and halo effects from behind." }),
  Object.freeze({ value: "SIDE_LIT_SHOT", label: "Side Lit Shot", groupId: "lighting-direction", description: "Dimensional side light with dramatic shadow and texture." }),
  Object.freeze({ value: "FRONT_LIT_SHOT", label: "Front Lit Shot", groupId: "lighting-direction", description: "Even frontal illumination with minimal shadow." }),
  Object.freeze({ value: "DUTCH_PAN", label: "Dutch Pan", groupId: "specialized", description: "Rotating tilt-and-pan treatment for a cinematic sweep." }),
  Object.freeze({ value: "VERTIGO_SHOT", label: "Vertigo Shot / Dolly Zoom", groupId: "specialized", description: "Dolly-zoom perspective distortion for a dizzy cinematic effect." }),
  Object.freeze({ value: "THROUGH_VIEWFINDER", label: "Through the Viewfinder", groupId: "specialized", description: "A restricted frame-within-frame camera viewpoint." }),
]);

export const CAMERA_PRESET_LEGACY_ALIASES = Object.freeze({
  FACE_CLOSEUP: "CLOSE_UP",
  HEAD_SHOULDERS: "MEDIUM_CLOSE_UP",
  BUST: "MEDIUM_CLOSE_UP",
  WAIST_UP: "MEDIUM_SHOT",
  THREE_QUARTER: "MEDIUM_WIDE_SHOT",
  FULL_BODY: "WIDE_SHOT",
});

const CAMERA_PRESET_VALUES = new Set(
  CAMERA_PRESET_OPTIONS.map((option) => option.value)
);

export function normalizeCameraPresetPresentationValue(value) {
  const normalized = String(value || "AUTO").trim().toUpperCase();
  const aliased = CAMERA_PRESET_LEGACY_ALIASES[normalized] || normalized;
  return CAMERA_PRESET_VALUES.has(aliased) ? aliased : "AUTO";
}

export function getCameraPresetPresentationOption(value) {
  const normalized = normalizeCameraPresetPresentationValue(value);
  return (
    CAMERA_PRESET_OPTIONS.find((option) => option.value === normalized) ||
    CAMERA_PRESET_OPTIONS[0]
  );
}

function matchesQuery(option, query) {
  if (!query) return true;
  const haystack =
    `${option.label} ${option.description} ${option.groupId}`.toLowerCase();
  return haystack.includes(query);
}

function toPickerItem(option, selectedValue) {
  return {
    id: option.value,
    title: option.label,
    subtitle: option.description,
    badgeLabel:
      option.groupId === "auto"
        ? "Auto"
        : CAMERA_PRESET_GROUPS.find(
            (group) => group.id === option.groupId
          )?.label || "",
    selected: option.value === selectedValue,
  };
}

export function projectCameraPresetPickerPresentation({
  selectedValue = "AUTO",
  searchValue = "",
} = {}) {
  const normalizedSelectedValue =
    normalizeCameraPresetPresentationValue(selectedValue);
  const normalizedQuery = String(searchValue || "").trim().toLowerCase();
  const autoOption = CAMERA_PRESET_OPTIONS[0];

  const groupedOptions = CAMERA_PRESET_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    options: CAMERA_PRESET_OPTIONS.filter(
      (option) =>
        option.groupId === group.id &&
        matchesQuery(option, normalizedQuery)
    ).map((option) => ({
      ...option,
      selected: option.value === normalizedSelectedValue,
    })),
  })).filter((group) => group.options.length > 0);

  const autoMatches = matchesQuery(autoOption, normalizedQuery);
  const flatItems = [
    ...(autoMatches ? [autoOption] : []),
    ...groupedOptions.flatMap((group) => group.options),
  ].map((option) => toPickerItem(option, normalizedSelectedValue));

  return {
    contractVersion: CAMERA_PRESET_PRESENTATION_CONTRACT_VERSION,
    selectedValue: normalizedSelectedValue,
    selectedOption: getCameraPresetPresentationOption(
      normalizedSelectedValue
    ),
    searchValue,
    searchPlaceholder: "Search camera presets...",
    catalogSize: CAMERA_PRESET_OPTIONS.length,
    groupCount: CAMERA_PRESET_GROUPS.length,
    autoOption: {
      ...autoOption,
      selected: autoOption.value === normalizedSelectedValue,
    },
    groups: groupedOptions,
    picker: {
      title: "Camera / Framing",
      layout: "rows",
      isMultiSelect: false,
      items: flatItems,
      selectedIds: [normalizedSelectedValue],
      searchValue,
      searchPlaceholder: "Search camera presets...",
      filters: [],
      isLoading: false,
      hasMore: false,
      isSearching: false,
      emptyMessage: "No camera presets match this search.",
      errorMessage: "",
    },
  };
}
