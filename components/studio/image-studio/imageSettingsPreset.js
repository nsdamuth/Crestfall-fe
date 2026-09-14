import {
  aspectRatioOptions,
  getCameraPresetDefinition,
  normalizeCameraPresetValue,
  wardrobeThemeOptions,
} from "./imageStudioData.js";
import {
  getImageWorkflowTuningDefinition,
  getRenderStyleRailStop,
  normalizeImageWorkflowTuning,
  normalizeRenderStyleRailSelection,
} from "./imageWorkflowTuning.js";

export const IMAGE_SETTINGS_PRESET_CONTRACT = "crestfall.imageSettings.v1";

const COMPOSER_ASPECT_RATIO_BY_RAW = Object.freeze({
  "4:5": "PORTRAIT_4_5",
  "5:4": "LANDSCAPE_5_4",
  "9:16": "PORTRAIT_9_16",
  "16:9": "LANDSCAPE_16_9",
  "1:1": "SQUARE_1_1",
  "3:4": "PORTRAIT_4_5",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function hasOption(options, value) {
  return options.some((option) => String(option.value) === String(value));
}

export function normalizeImageSettingsPreset(value) {
  const source = normalizeObject(value);
  if (source.contract !== IMAGE_SETTINGS_PRESET_CONTRACT) {
    throw new Error("This is not a supported Crestfall image settings preset.");
  }

  const renderStyle = normalizeRenderStyleRailSelection(source.renderStyle);
  const cameraFraming = normalizeCameraPresetValue(source.cameraFraming || "AUTO");
  const rawAspectRatio = String(source.aspectRatio || "4:5");
  const aspectRatio = COMPOSER_ASPECT_RATIO_BY_RAW[rawAspectRatio] ||
    (hasOption(aspectRatioOptions, rawAspectRatio) ? rawAspectRatio : "PORTRAIT_4_5");
  const wardrobeTheme = hasOption(wardrobeThemeOptions, source.wardrobeTheme)
    ? String(source.wardrobeTheme)
    : "AUTO";

  return {
    contract: IMAGE_SETTINGS_PRESET_CONTRACT,
    renderStyle,
    cameraFraming,
    aspectRatio,
    wardrobeTheme,
    workflowTuning: normalizeImageWorkflowTuning(renderStyle, source.workflowTuning),
    sceneryOnlyHelperEnabled:
      typeof source.sceneryOnlyHelperEnabled === "boolean"
        ? source.sceneryOnlyHelperEnabled
        : true,
    locationViewMode:
      ["INTERIOR", "EXTERIOR"].includes(String(source.locationViewMode || "").toUpperCase())
        ? String(source.locationViewMode).toUpperCase()
        : "AUTO",
    negativePrompt: typeof source.negativePrompt === "string" ? source.negativePrompt : "",
  };
}

export function parseImageSettingsPresetText(text) {
  let parsed;
  try {
    parsed = JSON.parse(String(text || ""));
  } catch {
    throw new Error("Paste the settings copied from Crestfall Image Details.");
  }
  return normalizeImageSettingsPreset(parsed);
}

export function serializeImageSettingsPreset(value) {
  const normalized = normalizeImageSettingsPreset(value);
  const rawAspect = aspectRatioOptions.find((option) => option.value === normalized.aspectRatio)?.value;
  const exportAspect = Object.entries(COMPOSER_ASPECT_RATIO_BY_RAW).find(([, composer]) => composer === rawAspect)?.[0] || "4:5";
  return JSON.stringify(
    {
      contract: IMAGE_SETTINGS_PRESET_CONTRACT,
      renderStyle: normalized.renderStyle,
      cameraFraming: normalized.cameraFraming,
      aspectRatio: exportAspect,
      wardrobeTheme: normalized.wardrobeTheme,
      workflowTuning: normalized.workflowTuning,
      sceneryOnlyHelperEnabled: normalized.sceneryOnlyHelperEnabled,
      locationViewMode: normalized.locationViewMode,
      negativePrompt: normalized.negativePrompt,
    },
    null,
    2
  );
}

export function getImageSettingsPresetPresentation(value) {
  const normalized = normalizeImageSettingsPreset(value);
  const renderStyle = getRenderStyleRailStop(normalized.renderStyle);
  const camera = getCameraPresetDefinition(normalized.cameraFraming);
  const definition = getImageWorkflowTuningDefinition(normalized.renderStyle);
  const tuningParts = [];

  for (const control of definition?.controls || []) {
    const labels = {
      referenceInfluence: "Ref",
      styleBalance: control.label.includes("Fantasy") ? "Fantasy" : "Balance",
      foundationDetail: "Foundation",
      polishDetail: "Polish",
      detailLevel: "Detail",
    };
    tuningParts.push(`${labels[control.id] || control.label} ${Math.round(normalized.workflowTuning[control.id])}%`);
  }

  return {
    renderStyleLabel: renderStyle.shortLabel,
    cameraFramingLabel: camera.label,
    tuningSummary: tuningParts.join(" · "),
  };
}
