"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import AbilitySpellProfileEditor from "../AbilitySpellProfileEditor";
import { createAbilitySpellProfileDraft } from "@/lib/client/studio/ability-spell/abilitySpellClient";
import {
  createEmptyAbilitySpellProfile,
  normalizeAbilitySpellProfileEditorValue,
  validateAbilitySpellProfileEditorValue,
} from "../ability-spell-profile-editor/AbilitySpellProfileEditor.contract";
import {
  ABILITY_SPELL_PROFILE_CONTENT_RATING_OPTIONS,
  ABILITY_SPELL_PROFILE_CREATION_TYPE,
  ABILITY_SPELL_PROFILE_VISIBILITY_OPTIONS,
} from "./AbilitySpellProfileBuilder.contract";

function extractCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

export function useAbilitySpellProfileBuilderViewModel() {
  const router = useRouter();
  const saveInFlightRef = useRef(false);
  const [title, setTitle] = useState("New Ability & Spell Profile");
  const [description, setDescription] = useState("Reusable Ability, Spell, Technique, Special Attack, and Passive definitions.");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [contentRating, setContentRating] = useState("SFW");
  const [profile, setProfile] = useState(() => createEmptyAbilitySpellProfile());
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const validation = useMemo(() => validateAbilitySpellProfileEditorValue(profile), [profile]);

  function updateIdentity(field, value) {
    if (field === "title") {
      setTitle(value);
      setProfile((current) => normalizeAbilitySpellProfileEditorValue({ ...current, title: value }));
    } else if (field === "description") {
      setDescription(value);
      setProfile((current) => normalizeAbilitySpellProfileEditorValue({ ...current, description: value }));
    } else if (field === "visibility") setVisibility(value);
    else if (field === "contentRating") setContentRating(value);
  }

  function updateProfile(nextProfile) {
    const normalized = normalizeAbilitySpellProfileEditorValue(nextProfile);
    setProfile(normalized);
    setTitle(normalized.title);
    setDescription(normalized.description);
    setSaveMessage("");
  }

  async function save() {
    if (saveInFlightRef.current || saveStatus === "saved") return;

    const result = validateAbilitySpellProfileEditorValue(profile);
    if (!result.valid) {
      setSaveStatus("error");
      setSaveMessage(`Fix ${result.errors.length} validation ${result.errors.length === 1 ? "error" : "errors"} before saving.`);
      return;
    }

    saveInFlightRef.current = true;
    setSaveStatus("saving");
    setSaveMessage("");
    try {
      const payload = await createAbilitySpellProfileDraft({
        type: ABILITY_SPELL_PROFILE_CREATION_TYPE,
        title: title.trim() || result.normalized.title,
        description: description.trim(),
        visibility,
        status: "DRAFT",
        content_rating: contentRating,
        data: {
          builder: "ABILITY_SPELL_PROFILE_BUILDER",
          builder_version: "ability_spell_profile_builder_v0",
          ability_spell_profile: result.normalized,
        },
      });
      const creation = extractCreation(payload);
      if (!creation?.id) {
        throw new Error(
          "Ability & Spell Profile was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Draft saved. Opening editor…");
      router.replace(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      saveInFlightRef.current = false;
      setSaveStatus("error");
      setSaveMessage(error?.message || "Ability & Spell Profile draft could not be saved.");
    }
  }

  return {
    title,
    description,
    visibility,
    contentRating,
    visibilityOptions: ABILITY_SPELL_PROFILE_VISIBILITY_OPTIONS,
    contentRatingOptions: ABILITY_SPELL_PROFILE_CONTENT_RATING_OPTIONS,
    editor: <AbilitySpellProfileEditor value={profile} onChange={updateProfile} />,
    saveDisabled:
      saveStatus === "saving" || saveStatus === "saved" || !validation.valid,
    saveStatus,
    saveMessage,
    errorCount: validation.errors.length,
    warningCount: validation.warnings.length,
    onUpdateIdentity: updateIdentity,
    onSave: save,
  };
}
