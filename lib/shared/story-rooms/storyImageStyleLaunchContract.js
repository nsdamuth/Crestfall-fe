export const STORY_IMAGE_STYLE_LAUNCH_VERSION =
  "story_image_style_launch_v1";

export const STORY_IMAGE_STYLE_PREFERENCE_VERSION =
  "story_image_style_preference_v1";

export const STORY_IMAGE_STYLE_LAUNCH_MODES = Object.freeze({
  OFF: "OFF",
  PLAYER_SELECT: "PLAYER_SELECT",
});

export const STORY_IMAGE_STYLE_VALUES = Object.freeze([
  "EITHER",
  "ANIME",
  "REALISTIC",
]);

const ALLOWED_STYLE_VALUES = new Set(STORY_IMAGE_STYLE_VALUES);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function normalizeStoryImageStyleValue(value) {
  const normalized = normalizeString(value).toUpperCase();
  return ALLOWED_STYLE_VALUES.has(normalized) ? normalized : "";
}

export function normalizeStoryImageStyleLaunchConfig(value = {}) {
  const data = normalizeObject(value);
  const authored = normalizeObject(
    data.image_style_launch || data.imageStyleLaunch || value
  );
  const requestedMode = normalizeString(authored.mode).toUpperCase();
  const mode =
    requestedMode === STORY_IMAGE_STYLE_LAUNCH_MODES.PLAYER_SELECT
      ? STORY_IMAGE_STYLE_LAUNCH_MODES.PLAYER_SELECT
      : STORY_IMAGE_STYLE_LAUNCH_MODES.OFF;
  const source = Array.isArray(
    authored.allowedStyles || authored.allowed_styles
  )
    ? authored.allowedStyles || authored.allowed_styles
    : [];
  const allowedStyles = [
    ...new Set(source.map(normalizeStoryImageStyleValue).filter(Boolean)),
  ];
  const requestedDefaultStyle = normalizeStoryImageStyleValue(
    authored.defaultStyle || authored.default_style
  );
  const defaultStyle = allowedStyles.includes(requestedDefaultStyle)
    ? requestedDefaultStyle
    : allowedStyles[0] || "";

  return {
    version: STORY_IMAGE_STYLE_LAUNCH_VERSION,
    mode,
    allowedStyles,
    defaultStyle,
  };
}

export function getStoryImageStyleLaunchStartConfig(value = {}) {
  const config = normalizeStoryImageStyleLaunchConfig(value);

  if (
    config.mode !== STORY_IMAGE_STYLE_LAUNCH_MODES.PLAYER_SELECT ||
    !config.allowedStyles.length
  ) {
    return {
      version: STORY_IMAGE_STYLE_LAUNCH_VERSION,
      mode: STORY_IMAGE_STYLE_LAUNCH_MODES.OFF,
      selectionRequired: false,
      allowedStyles: [],
      defaultStyle: "",
    };
  }

  return {
    ...config,
    selectionRequired: true,
  };
}

export function buildStoryImageStylePreference(style, {
  source = "PLAYER_SELECTION",
} = {}) {
  const normalizedStyle = normalizeStoryImageStyleValue(style);
  if (!normalizedStyle) return null;

  return {
    version: STORY_IMAGE_STYLE_PREFERENCE_VERSION,
    style: normalizedStyle,
    source: normalizeString(source).toUpperCase() || "PLAYER_SELECTION",
  };
}
