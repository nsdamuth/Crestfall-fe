export const LOCATION_CUSTOM_VIEW_LABEL_MAX_LENGTH = 80;
export const LOCATION_CUSTOM_VIEW_PROMPT_MAX_LENGTH = 2000;
export const LOCATION_CUSTOM_VIEW_NEGATIVE_MAX_LENGTH = 300;
export const LOCATION_CUSTOM_VIEW_MODE_PREFIX = "CUSTOM:";

function normalizeString(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function slugify(value) {
  return normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
}

export function normalizeLocationCustomImageViews(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();
  const result = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;

    const id = normalizeString(entry.id);
    const label = normalizeString(entry.label || entry.name).slice(
      0,
      LOCATION_CUSTOM_VIEW_LABEL_MAX_LENGTH
    );

    if (!id || !label || seen.has(id)) continue;

    seen.add(id);
    result.push({
      id,
      label,
      prompt: normalizeString(entry.prompt).slice(
        0,
        LOCATION_CUSTOM_VIEW_PROMPT_MAX_LENGTH
      ),
      negative_prompt: normalizeString(
        entry.negative_prompt || entry.negativePrompt
      ).slice(0, LOCATION_CUSTOM_VIEW_NEGATIVE_MAX_LENGTH),
    });
  }

  return result;
}

export function createLocationCustomImageViewId(label, existingViews = []) {
  const existingIds = new Set(
    normalizeLocationCustomImageViews(existingViews).map((entry) => entry.id)
  );
  const base = slugify(label) || `view-${Date.now().toString(36)}`;
  let candidate = base;
  let suffix = 2;

  while (existingIds.has(candidate)) {
    candidate = `${base.slice(0, 52)}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function toLocationCustomViewMode(id) {
  const normalized = normalizeString(id);
  return normalized
    ? `${LOCATION_CUSTOM_VIEW_MODE_PREFIX}${normalized}`
    : "AUTO";
}

export function getLocationCustomViewIdFromMode(value) {
  const normalized = normalizeString(value);
  return normalized.toUpperCase().startsWith(LOCATION_CUSTOM_VIEW_MODE_PREFIX)
    ? normalized.slice(LOCATION_CUSTOM_VIEW_MODE_PREFIX.length)
    : "";
}

export function findLocationCustomImageView(value, id) {
  const normalizedId = normalizeString(id);
  return (
    normalizeLocationCustomImageViews(value).find(
      (entry) => entry.id === normalizedId
    ) || null
  );
}
