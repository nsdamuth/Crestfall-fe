export const PROGRESSION_PROFILE_CREATION_TYPE = "PROGRESSION_PROFILE";
export const PROGRESSION_PROFILE_BUILDER_CONTRACT_VERSION =
  "progression_profile_builder_view_contract_v0";

export const PROGRESSION_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const PROGRESSION_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

function normalizeTitle(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function resolveProgressionProfileCreationTitle({
  creationTitle = "",
  profileTitle = "",
} = {}) {
  return normalizeTitle(creationTitle) || normalizeTitle(profileTitle);
}
