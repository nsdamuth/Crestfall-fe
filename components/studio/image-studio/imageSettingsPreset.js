import {
  aspectRatioOptions,
  getCameraPresetDefinition,
  normalizeCameraPresetValue,
  wardrobeThemeOptions,
} from "./imageStudioData.js";
import {
  getImageWorkflowTuningDefinition,
  getRenderStyleRailStop,
  getWorkflowTuningPresentationValue,
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

function normalizeLocationViewMode(value) {
  const raw = String(value || "").trim();
  const normalized = raw.toUpperCase();
  if (["INTERIOR", "EXTERIOR", "SCENIC"].includes(normalized)) return normalized;
  if (normalized.startsWith("CUSTOM:")) {
    const customId = raw.slice(raw.indexOf(":") + 1).trim();
    return customId ? `CUSTOM:${customId}` : "AUTO";
  }
  return "AUTO";
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
    locationViewMode: normalizeLocationViewMode(source.locationViewMode),
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


export function getImageSettingsPresetPresentation(
  value,
  { workflowTuningPresentation = null } = {}
) {
  const normalized = normalizeImageSettingsPreset(value);
  const renderStyle = getRenderStyleRailStop(normalized.renderStyle);
  const camera = getCameraPresetDefinition(normalized.cameraFraming);
  const definition = getImageWorkflowTuningDefinition(
    normalized.renderStyle,
    normalized.workflowTuning
  );
  const presentationSnapshot = normalizeObject(workflowTuningPresentation);
  const tuningParts = [];

  for (const control of definition?.controls || []) {
    if (control.id === "referenceInfluence") {
      continue;
    }

    if (control.id === "detailScale") {
      const option = control.options?.find(
        (entry) => Number(entry.value) === Number(normalized.workflowTuning.detailScale)
      );
      const detailLabel =
        typeof presentationSnapshot.detailScaleLabel === "string" &&
        presentationSnapshot.detailScaleLabel.trim()
          ? presentationSnapshot.detailScaleLabel.trim()
          : option?.label || String(normalized.workflowTuning.detailScale);
      tuningParts.push(`Detail ${detailLabel}`);
      continue;
    }

    const snapshotValue = Number(presentationSnapshot[control.id]);
    const presentedValue = Number.isFinite(snapshotValue)
      ? Math.min(Math.max(Math.round(snapshotValue), 0), 100)
      : getWorkflowTuningPresentationValue(
          normalized.renderStyle,
          control.id,
          normalized.workflowTuning[control.id],
          normalized.workflowTuning
        );

    tuningParts.push(
      `${control.label} ${control.formatValue ? control.formatValue(presentedValue) : String(presentedValue)}`
    );
  }

  return {
    renderStyleLabel: renderStyle.shortLabel,
    cameraFramingLabel: camera.label,
    tuningSummary: tuningParts.join(" · "),
  };
}
