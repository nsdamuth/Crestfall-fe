"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createPlayerCharacterDraft } from "@/lib/client/studio/player-characters/playerCharacterClient";
import {
  PLAYER_CHARACTER_CONTENT_RATING_OPTIONS,
  PLAYER_CHARACTER_RENDERING_STYLE_OPTIONS,
  PLAYER_CHARACTER_ROLE_ARCHETYPE_OPTIONS,
  PLAYER_CHARACTER_STEPS,
  PLAYER_CHARACTER_VISIBILITY_OPTIONS,
} from "./PlayerCharacterCreator.contract";

export const PLAYER_CHARACTER_INITIAL_FORM = Object.freeze({
  name: "",
  alias: "",
  age: "",
  species: "",
  custom_species: "",
  gender_presentation: "",
  custom_gender_presentation: "",
  role_archetype: "",
  character_color_palette_id: "CRESTFALL_DEFAULT",

  skin_tone: "",
  eye_color: "",
  hair_color: "",
  hair_style: "",
  clothing_style: "",

  body_type: "",
  height: "",
  build: "",
  body_notes: "",

  personality_summary: "",
  backstory: "",
  narrator_notes: "",

  visibility: "PRIVATE",
  content_rating: "SFW",
  default_rendering_style: "EITHER",

  default_clothing_mode: "NONE",

  default_outfit_id: null,
  default_outfit_title: "",
  default_outfit_description: "",
  default_outfit_image_url: "",
  default_outfit_content_rating: "",

  default_wardrobe_id: null,
  default_wardrobe_title: "",
  default_wardrobe_description: "",
  default_wardrobe_image_url: "",
  default_wardrobe_content_rating: "",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function cloneInitialForm(initialForm) {
  return {
    ...PLAYER_CHARACTER_INITIAL_FORM,
    ...normalizeObject(initialForm),
  };
}

function buildPlayerCharacterDescription(form) {
  return (
    form.personality_summary ||
    form.alias ||
    form.role_archetype ||
    "A private player character persona created in Crestfall Studio."
  );
}

export function buildPlayerCharacterCreationPayload(formValue) {
  const form = cloneInitialForm(formValue);
  const name = form.name?.trim() || "Unnamed Player Character";
  const alias = form.alias?.trim() || "";

  return {
    type: "PLAYER_CHARACTER",
    title: name,
    description: buildPlayerCharacterDescription(form),
    visibility: "PRIVATE",
    content_rating: form.content_rating || "SFW",
    data: {
      ...form,
      name,
      alias,

      // Compatibility with the shared creation edit shell.
      title: alias,
      short_concept: form.role_archetype || "",
      rendering_style: form.default_rendering_style || "EITHER",
      outward_personality: form.personality_summary || "",
      personality_notes: form.personality_summary || "",
      extra_runtime_notes: form.narrator_notes || "",

      // Product boundary markers.
      builder: "PLAYER_CHARACTER_CREATOR",
      builder_version: "1.0",
      persona_type: "PLAYER_CHARACTER",
      profile_showcase: true,
      playable: false,
      discoverable: false,
      searchable: false,
      addable_to_rooms: false,
      ai_controlled: false,
    },
  };
}

function extractCreation(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

function calculateProgress(form) {
  const values = Object.values(form);
  const filled = values.filter(Boolean).length;

  return Math.round((filled / values.length) * 100);
}

export function usePlayerCharacterCreatorViewModel({
  initialForm = null,
  createDraft = createPlayerCharacterDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("identity");
  const [form, setForm] = useState(() => cloneInitialForm(initialForm));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const activeIndex = Math.max(
    0,
    PLAYER_CHARACTER_STEPS.findIndex((step) => step.id === activeStep)
  );

  const progress = useMemo(() => calculateProgress(form), [form]);

  const stepItems = useMemo(
    () =>
      PLAYER_CHARACTER_STEPS.map((step, index) => ({
        ...step,
        active: step.id === activeStep,
        visited: index <= activeIndex,
      })),
    [activeIndex, activeStep]
  );

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function normalizeAdultAge() {
    if (form.age && Number(form.age) < 18) {
      updateField("age", "18");
    }
  }

  function goNext() {
    const nextStep =
      PLAYER_CHARACTER_STEPS[
        Math.min(activeIndex + 1, PLAYER_CHARACTER_STEPS.length - 1)
      ];

    setActiveStep(nextStep.id);
  }

  function goBack() {
    const previousStep =
      PLAYER_CHARACTER_STEPS[Math.max(activeIndex - 1, 0)];

    setActiveStep(previousStep.id);
  }

  async function saveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft(
        buildPlayerCharacterCreationPayload(form),
        "Player character draft could not be saved."
      );
      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          "Player character draft was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
        return;
      }

      router.push(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Player character draft could not be saved."
      );
    }
  }

  return {
    viewProps: {
      activeStep,
      activeIndex,
      stepItems,
      form,
      progress,
      saveStatus,
      saveMessage,
      saveDisabled: saveStatus === "saving",
      roleArchetypeOptions: PLAYER_CHARACTER_ROLE_ARCHETYPE_OPTIONS,
      visibilityOptions: PLAYER_CHARACTER_VISIBILITY_OPTIONS,
      contentRatingOptions: PLAYER_CHARACTER_CONTENT_RATING_OPTIONS,
      renderingStyleOptions: PLAYER_CHARACTER_RENDERING_STYLE_OPTIONS,
      onSelectStep: setActiveStep,
      onUpdateField: updateField,
      onNormalizeAdultAge: normalizeAdultAge,
      onBack: goBack,
      onNext: goNext,
      onSave: saveDraft,
    },
    applicationFieldProps: {
      form,
      updateField,
    },
  };
}
