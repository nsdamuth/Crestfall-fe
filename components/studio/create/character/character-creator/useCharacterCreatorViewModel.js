"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import initialCharacterForm from "@/components/studio/create/character/constants/form";
import characterTemplates from "@/data/mocks/characterTemplates";
import { createCharacterDraft } from "@/lib/client/studio/characters/characterClient";
import {
  applyCharacterTemplateToForm,
  buildCharacterCreationPayload,
  extractCreationFromApiResponse,
} from "@/components/studio/characters/characterUtils";
import {
  CHARACTER_CREATOR_STEP_IDS,
  buildCharacterCreatorStepItems,
} from "./CharacterCreator.contract";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function cloneInitialForm(initialForm) {
  return {
    ...initialCharacterForm,
    ...normalizeObject(initialForm),
  };
}

export function calculateCharacterCreatorProgress(formValue) {
  const form = normalizeObject(formValue);
  const keys = Object.keys(form);

  if (keys.length === 0) return 0;

  const filled = Object.values(form).filter(Boolean).length;
  return Math.round((filled / keys.length) * 100);
}

export function useCharacterCreatorViewModel({
  initialForm = null,
  templates = characterTemplates,
  createDraft = createCharacterDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("identity");
  const [form, setForm] = useState(() => cloneInitialForm(initialForm));
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const activeIndex = Math.max(
    0,
    CHARACTER_CREATOR_STEP_IDS.findIndex((stepId) => stepId === activeStep)
  );

  const progress = useMemo(
    () => calculateCharacterCreatorProgress(form),
    [form]
  );

  const stepItems = useMemo(
    () => buildCharacterCreatorStepItems(activeStep),
    [activeStep]
  );

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function applyTemplate(template) {
    setForm((current) => applyCharacterTemplateToForm(current, template));
    setTemplateModalOpen(false);
  }

  function goNext() {
    const nextStepId =
      CHARACTER_CREATOR_STEP_IDS[
        Math.min(activeIndex + 1, CHARACTER_CREATOR_STEP_IDS.length - 1)
      ];

    setActiveStep(nextStepId);
  }

  function goBack() {
    const previousStepId =
      CHARACTER_CREATOR_STEP_IDS[Math.max(activeIndex - 1, 0)];

    setActiveStep(previousStepId);
  }

  async function saveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const creationPayload = buildCharacterCreationPayload(form);
      const apiPayload = await createDraft(creationPayload);
      const creation = extractCreationFromApiResponse(apiPayload);

      if (!creation?.id) {
        throw new Error(
          "Character draft was saved, but no creation ID was returned."
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
      setSaveMessage(error?.message || "Character draft could not be saved.");
    }
  }

  return {
    viewProps: {
      activeStep,
      activeIndex,
      stepItems,
      progress,
      saveStatus,
      saveMessage,
      saveDisabled: saveStatus === "saving",
      onSelectStep: setActiveStep,
      onBack: goBack,
      onNext: goNext,
      onSave: saveDraft,
    },
    applicationContentProps: {
      activeStep,
      form,
      advancedOpen,
      templateModalOpen,
      characterTemplates: Array.isArray(templates) ? templates : [],
      setAdvancedOpen,
      setTemplateModalOpen,
      updateField,
      applyTemplate,
    },
  };
}
