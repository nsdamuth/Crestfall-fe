"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createActorMechanicsProfileDraft } from "@/lib/client/studio/actor-mechanics-profile/actorMechanicsProfileClient";
import {
  normalizeActorMechanicsProfileEditorValue,
  useActorMechanicsProfileEditorViewModel,
  validateActorMechanicsProfileEditorValue,
} from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor/useActorMechanicsProfileEditorViewModel";
import {
  ACTOR_MECHANICS_PROFILE_CONTENT_RATING_OPTIONS,
  ACTOR_MECHANICS_PROFILE_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_VISIBILITY_OPTIONS,
} from "./ActorMechanicsProfileBuilder.contract";

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

function createInitialProfile() {
  return normalizeActorMechanicsProfileEditorValue({
    presetId: "CUSTOM",
    title: "Custom",
    summary:
      "A creator-defined actor mechanics profile assembled from explicit actor-scoped bindings.",
    enabled: true,
    owner: {
      bindingMode: "UNBOUND_TEMPLATE",
      ownerType: "CHARACTER",
      ownerId: null,
      ownerTitle: "",
    },
    bindings: [],
  });
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
    actorMechanicsProfile: normalizeActorMechanicsProfileEditorValue(
      source.actorMechanicsProfile ||
        source.actor_mechanics_profile ||
        source.mechanicsLoadout ||
        source.mechanics_loadout ||
        createInitialProfile()
    ),
  };
}

export function useActorMechanicsProfileBuilderViewModel({
  initialDraft = null,
  createDraft = createActorMechanicsProfileDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => createInitialDraft(initialDraft));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const profileValidation = useMemo(
    () => validateActorMechanicsProfileEditorValue(draft.actorMechanicsProfile),
    [draft.actorMechanicsProfile]
  );
  const errors = Array.isArray(profileValidation?.errors)
    ? profileValidation.errors
    : [];
  const warnings = Array.isArray(profileValidation?.warnings)
    ? profileValidation.warnings
    : [];

  function updateIdentity(field, value) {
    if (!["title", "description", "visibility", "contentRating"].includes(field)) {
      return;
    }

    setDraft((current) => ({
      ...current,
      [field]: String(value ?? ""),
    }));
  }

  function updateActorMechanicsProfile(nextValue) {
    setDraft((current) => ({
      ...current,
      actorMechanicsProfile: normalizeActorMechanicsProfileEditorValue(nextValue),
    }));
  }

  const { viewProps: editorViewProps, pickerProps: editorPickerProps } =
    useActorMechanicsProfileEditorViewModel({
      value: draft.actorMechanicsProfile,
      onChange: updateActorMechanicsProfile,
    });

  const saveDisabled =
    saveStatus === "saving" || !normalizeString(draft.title) || errors.length > 0;

  async function save() {
    if (saveDisabled) return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft({
        type: ACTOR_MECHANICS_PROFILE_CREATION_TYPE,
        title: normalizeString(draft.title),
        description:
          normalizeString(draft.description) ||
          "A reusable Crestfall Actor Mechanics Profile.",
        visibility: draft.visibility,
        content_rating: draft.contentRating,
        data: {
          builder: "ACTOR_MECHANICS_PROFILE_BUILDER",
          builder_version: "0.1",
          actor_mechanics_profile: normalizeActorMechanicsProfileEditorValue(
            draft.actorMechanicsProfile
          ),
        },
      });

      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          "Actor Mechanics Profile was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Actor Mechanics Profile draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Actor Mechanics Profile draft could not be saved."
      );
    }
  }

  return {
    title: draft.title,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: ACTOR_MECHANICS_PROFILE_VISIBILITY_OPTIONS,
    contentRatingOptions: ACTOR_MECHANICS_PROFILE_CONTENT_RATING_OPTIONS,
    editorViewProps,
    editorPickerProps,
    saveDisabled,
    saveStatus,
    saveMessage,
    errorCount: errors.length,
    warningCount: warnings.length,
    onUpdateIdentity: updateIdentity,
    onSave: save,
  };
}
