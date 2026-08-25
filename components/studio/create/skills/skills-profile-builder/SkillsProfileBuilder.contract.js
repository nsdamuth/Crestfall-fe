import { createEmptySkillsProfile } from "../skills-profile-editor/SkillsProfileEditor.contract";

export const SKILLS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";
export const SKILLS_PROFILE_CREATION_TYPE = "SKILLS_PROFILE";
export const SKILLS_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "INTERNAL", label: "Internal / Unlisted" },
]);
export const SKILLS_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
]);

export function createSkillsProfileBuilderDraft() {
  const skillsProfile = createEmptySkillsProfile();
  return {
    title: skillsProfile.title,
    description: skillsProfile.description,
    visibility: "PRIVATE",
    contentRating: "SFW",
    skillsProfile,
  };
}

export function resolveSkillsProfileCreationTitle({ creationTitle, profileTitle } = {}) {
  return String(creationTitle || "").trim() || String(profileTitle || "").trim();
}
