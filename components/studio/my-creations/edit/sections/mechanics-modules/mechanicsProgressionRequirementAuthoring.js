export const MECHANICS_PROGRESSION_REQUIREMENT_AUTHORING_VERSION =
  "mechanics_progression_requirement_authoring_v1";

export function normalizeProgressionTierId(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function normalizeProgressionTierIdList(value) {
  const entries = Array.isArray(value)
    ? value
    : String(value ?? "").split(",");

  return [
    ...new Set(entries.map(normalizeProgressionTierId).filter(Boolean)),
  ];
}
