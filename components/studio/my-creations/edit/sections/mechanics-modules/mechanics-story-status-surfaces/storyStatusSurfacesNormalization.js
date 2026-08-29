import {
  STORY_STATUS_SURFACE_CONTRACT_VERSION,
  STORY_STATUS_SURFACE_MAX_READOUTS,
  STORY_STATUS_SURFACE_MAX_SURFACES,
  STORY_STATUS_SURFACE_MECHANICS_BUCKETS,
  STORY_STATUS_SURFACE_PLACEMENTS,
  STORY_STATUS_SURFACE_SOURCE_DOMAINS,
  STORY_STATUS_SURFACE_STATS_KINDS,
} from "./StoryStatusSurfaces.contract.js";

export function asStoryStatusSurfaceObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function normalizeStoryStatusSurfaceString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeStoryStatusSurfaceBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeStoryStatusSurfaceString(value).toLowerCase();
  if (["true", "yes", "1", "enabled", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "disabled", "off"].includes(normalized)) return false;
  return fallback;
}

export function normalizeStoryStatusSurfaceIdentifier(value, fallback = "") {
  const normalized = normalizeStoryStatusSurfaceString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = normalizeStoryStatusSurfaceString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

export function normalizeStoryStatusSurfaceReadout(value = {}, index = 0) {
  const source = asStoryStatusSurfaceObject(value);
  const sourceConfig = asStoryStatusSurfaceObject(source.source);
  const domain = normalizeEnum(
    sourceConfig.domain || source.sourceDomain || source.source_domain,
    STORY_STATUS_SURFACE_SOURCE_DOMAINS,
    "MECHANICS"
  );
  const valueId = normalizeStoryStatusSurfaceIdentifier(
    sourceConfig.valueId ||
      sourceConfig.value_id ||
      sourceConfig.definitionId ||
      sourceConfig.definition_id ||
      sourceConfig.currencyId ||
      sourceConfig.currency_id ||
      sourceConfig.targetId ||
      sourceConfig.target_id ||
      source.valueId ||
      source.value_id
  );

  return {
    ...source,
    id: normalizeStoryStatusSurfaceIdentifier(
      source.id || source.key,
      `readout_${index + 1}`
    ),
    label:
      normalizeStoryStatusSurfaceString(source.label || source.title || source.name) ||
      valueId ||
      `Readout ${index + 1}`,
    enabled: normalizeStoryStatusSurfaceBoolean(source.enabled, true),
    prefix: normalizeStoryStatusSurfaceString(source.prefix),
    suffix: normalizeStoryStatusSurfaceString(source.suffix),
    missingLabel:
      normalizeStoryStatusSurfaceString(source.missingLabel || source.missing_label) ||
      "Unavailable",
    source: {
      ...sourceConfig,
      domain,
      bindingId: normalizeStoryStatusSurfaceIdentifier(
        sourceConfig.bindingId || sourceConfig.binding_id
      ),
      valueId,
      kind: normalizeEnum(
        sourceConfig.kind || sourceConfig.valueKind || sourceConfig.value_kind,
        STORY_STATUS_SURFACE_STATS_KINDS,
        "POOL"
      ),
      bucket: normalizeEnum(
        sourceConfig.bucket || sourceConfig.stateType || sourceConfig.state_type,
        STORY_STATUS_SURFACE_MECHANICS_BUCKETS,
        "COUNTER"
      ),
    },
  };
}

export function normalizeStoryStatusSurface(value = {}, index = 0) {
  const source = asStoryStatusSurfaceObject(value);
  const presentation = asStoryStatusSurfaceObject(source.presentation);
  const requestedHost = normalizeStoryStatusSurfaceString(
    presentation.host || source.host
  ).toUpperCase();
  const readoutsSource = Array.isArray(source.readouts)
    ? source.readouts
    : Array.isArray(source.fields)
      ? source.fields
      : Array.isArray(source.values)
        ? source.values
        : [];

  return {
    ...source,
    version:
      normalizeStoryStatusSurfaceString(source.version) ||
      STORY_STATUS_SURFACE_CONTRACT_VERSION,
    id: normalizeStoryStatusSurfaceIdentifier(
      source.id || source.key,
      `surface_${index + 1}`
    ),
    title: normalizeStoryStatusSurfaceString(
      source.title || source.label || source.heading
    ),
    enabled: normalizeStoryStatusSurfaceBoolean(source.enabled, true),
    presentation: {
      ...presentation,
      // Preserve future hosts rather than silently converting them to INLINE.
      host: requestedHost || "INLINE",
      placement: normalizeEnum(
        presentation.placement || source.placement,
        STORY_STATUS_SURFACE_PLACEMENTS,
        "BOTTOM"
      ),
    },
    readouts: readoutsSource
      .slice(0, STORY_STATUS_SURFACE_MAX_READOUTS)
      .map(normalizeStoryStatusSurfaceReadout),
  };
}

export function normalizeStoryStatusSurfaces(value) {
  const source = Array.isArray(value)
    ? value
    : Array.isArray(value?.surfaces)
      ? value.surfaces
      : [];
  return source
    .slice(0, STORY_STATUS_SURFACE_MAX_SURFACES)
    .map(normalizeStoryStatusSurface);
}

export function summarizeStoryStatusSurface(surface, fallbackIndex = 0) {
  const normalized = normalizeStoryStatusSurface(surface, fallbackIndex);
  const enabledReadouts = normalized.readouts.filter(
    (readout) => readout.enabled !== false
  ).length;
  return [
    normalized.presentation.host,
    normalized.presentation.placement,
    `${enabledReadouts} ${enabledReadouts === 1 ? "readout" : "readouts"}`,
  ].join(" · ");
}
