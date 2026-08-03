"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createProgressionProfileDraft } from "@/lib/client/studio/progression/progressionClient";
import {
  createDefaultProgressionProfile,
  normalizeProgressionProfileEditorValue,
  validateProgressionProfileEditorValue,
} from "@/components/studio/create/progression/progression-profile-editor/ProgressionProfileEditor.contract";
import { useProgressionProfileEditorViewModel } from "@/components/studio/create/progression/progression-profile-editor/useProgressionProfileEditorViewModel";
import {
  PROGRESSION_CONTENT_RATING_OPTIONS,
  PROGRESSION_PROFILE_CREATION_TYPE,
  PROGRESSION_VISIBILITY_OPTIONS,
  resolveProgressionProfileCreationTitle,
} from "./ProgressionProfileBuilder.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

function createInitialDraft(initialDraft) {
  const source = normalizeObject(initialDraft);
  return {
    title: typeof source.title === "string" ? source.title : "",
    description:
      typeof source.description === "string" ? source.description : "",
    visibility: source.visibility === "UNLISTED" ? "UNLISTED" : "PRIVATE",
    contentRating: ["SFW", "MATURE", "EXPLICIT"].includes(source.contentRating)
      ? source.contentRating
      : "SFW",
    progressionProfile: normalizeProgressionProfileEditorValue(
      source.progressionProfile ||
        source.progression_profile ||
        createDefaultProgressionProfile()
    ),
  };
}

export function useProgressionProfileBuilderViewModel({
  initialDraft = null,
  createDraft = createProgressionProfileDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => createInitialDraft(initialDraft));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const validation = useMemo(
    () => validateProgressionProfileEditorValue(draft.progressionProfile),
    [draft.progressionProfile]
  );
  const errors = Array.isArray(validation.errors) ? validation.errors : [];
  const warnings = Array.isArray(validation.warnings) ? validation.warnings : [];

  function updateIdentity(field, value) {
    if (!["title", "description", "visibility", "contentRating"].includes(field)) {
      return;
    }
    setDraft((current) => ({ ...current, [field]: String(value ?? "") }));
  }

  function updateProfile(nextValue) {
    setDraft((current) => ({
      ...current,
      progressionProfile: normalizeProgressionProfileEditorValue(nextValue),
    }));
  }

  const editorViewProps = useProgressionProfileEditorViewModel({
    value: draft.progressionProfile,
    onChange: updateProfile,
  });

  const resolvedTitle = resolveProgressionProfileCreationTitle({
    creationTitle: draft.title,
    profileTitle: draft.progressionProfile?.title,
  });

  const saveDisabled =
    saveStatus === "saving" || !resolvedTitle || errors.length > 0;

  async function save() {
    if (saveDisabled) return;
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft({
        type: PROGRESSION_PROFILE_CREATION_TYPE,
        title: resolvedTitle,
        description:
          normalizeString(draft.description) ||
          "A reusable Crestfall Progression Profile.",
        visibility: draft.visibility,
        content_rating: draft.contentRating,
        data: {
          builder: "PROGRESSION_PROFILE_BUILDER",
          builder_version: "0.1",
          progression_profile: normalizeProgressionProfileEditorValue(
            draft.progressionProfile
          ),
        },
      });

      const creation = extractCreation(payload);
      if (!creation?.id) {
        throw new Error(
          "Progression Profile was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Progression Profile draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Progression Profile draft could not be saved."
      );
    }
  }

  return {
    title: resolvedTitle,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: PROGRESSION_VISIBILITY_OPTIONS,
    contentRatingOptions: PROGRESSION_CONTENT_RATING_OPTIONS,
    editorViewProps,
    saveDisabled,
    saveStatus,
    saveMessage,
    errorCount: errors.length,
    warningCount: warnings.length,
    onUpdateIdentity: updateIdentity,
    onSave: save,
  };
}
