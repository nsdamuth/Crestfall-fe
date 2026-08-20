"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createSkillsProfileDraft } from "@/lib/client/studio/skills/skillsClient";
import SkillsProfileEditor from "../SkillsProfileEditor";
import {
  SKILLS_CONTENT_RATING_OPTIONS,
  SKILLS_PROFILE_CREATION_TYPE,
  SKILLS_VISIBILITY_OPTIONS,
  createSkillsProfileBuilderDraft,
  resolveSkillsProfileCreationTitle,
} from "./SkillsProfileBuilder.contract";
import { validateSkillsProfileEditorValue } from "../skills-profile-editor/SkillsProfileEditor.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function useSkillsProfileBuilderViewModel({ initialDraft = null } = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => initialDraft || createSkillsProfileBuilderDraft());
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const validation = useMemo(
    () => validateSkillsProfileEditorValue(draft.skillsProfile),
    [draft.skillsProfile]
  );
  const resolvedTitle = resolveSkillsProfileCreationTitle({
    creationTitle: draft.title,
    profileTitle: draft.skillsProfile?.title,
  });
  const saveDisabled =
    saveStatus === "saving" || !resolvedTitle || validation.errors.length > 0;

  function updateIdentity(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateProfile(nextProfile) {
    setDraft((current) => ({ ...current, skillsProfile: nextProfile }));
  }

  async function save() {
    if (saveDisabled) return;
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createSkillsProfileDraft({
        type: SKILLS_PROFILE_CREATION_TYPE,
        title: resolvedTitle,
        description:
          normalizeString(draft.description) ||
          normalizeString(draft.skillsProfile?.description) ||
          "A reusable Crestfall Skills Profile.",
        visibility: draft.visibility,
        status: "DRAFT",
        contentRating: draft.contentRating,
        canonStatus: "NONE",
        data: {
          skills_profile: validation.normalized,
          builder: "SKILLS_PROFILE",
          builder_version: "skills_profile_builder_v0",
        },
      });
      const creation = payload?.data?.creation || payload?.creation || null;
      if (!creation?.id) {
        throw new Error("Skills Profile was saved without a creation ID.");
      }
      setSaveStatus("saved");
      setSaveMessage("Skills Profile draft saved.");
      router.push(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Skills Profile draft could not be saved.");
    }
  }

  return {
    title: resolvedTitle,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: SKILLS_VISIBILITY_OPTIONS,
    contentRatingOptions: SKILLS_CONTENT_RATING_OPTIONS,
    editor: <SkillsProfileEditor value={draft.skillsProfile} onChange={updateProfile} />,
    saveDisabled,
    saveStatus,
    saveMessage,
    errorCount: validation.errors.length,
    warningCount: validation.warnings.length,
    onUpdateIdentity: updateIdentity,
    onSave: save,
  };
}
