"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createCharacterTemplateDraft } from "@/lib/client/studio/character-templates/characterTemplateClient";
import {
  EMPTY_CHARACTER_TEMPLATE_FORM,
  buildCharacterTemplateCreationPayload,
  extractCharacterTemplateFromApiResponse,
  getCharacterTemplateCompletion,
  getCharacterTemplateFilledFieldCount,
  getCharacterTemplateSectionStatus,
} from "@/components/studio/character-templates/characterTemplateUtils";
import {
  CHARACTER_TEMPLATE_BUILDER_STEP_IDS,
  buildCharacterTemplateBuilderStepItems,
} from "./CharacterTemplateBuilder.contract";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function cloneInitialForm(initialForm) {
  const normalized = normalizeObject(initialForm);

  return {
    ...EMPTY_CHARACTER_TEMPLATE_FORM,
    ...normalized,
    proportions: Array.isArray(normalized.proportions)
      ? [...normalized.proportions]
      : [...EMPTY_CHARACTER_TEMPLATE_FORM.proportions],
  };
}

export function useCharacterTemplateBuilderViewModel({
  initialForm = null,
  createDraft = createCharacterTemplateDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(() => cloneInitialForm(initialForm));
  const [activeStep, setActiveStep] = useState("template");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const activeIndex = Math.max(
    0,
    CHARACTER_TEMPLATE_BUILDER_STEP_IDS.findIndex(
      (stepId) => stepId === activeStep
    )
  );

  const completion = useMemo(
    () => getCharacterTemplateCompletion(form),
    [form]
  );

  const filledFieldCount = useMemo(
    () => getCharacterTemplateFilledFieldCount(form),
    [form]
  );

  const sectionStatus = useMemo(
    () => getCharacterTemplateSectionStatus(form),
    [form]
  );

  const creationPayload = useMemo(
    () => buildCharacterTemplateCreationPayload(form),
    [form]
  );

  const stepItems = useMemo(
    () => buildCharacterTemplateBuilderStepItems(activeStep),
    [activeStep]
  );

  function clearSaveFeedback() {
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    clearSaveFeedback();
  }

  function resetTemplate() {
    setForm(cloneInitialForm(initialForm));
    setActiveStep("template");
    clearSaveFeedback();
  }

  function goNext() {
    const nextStepId =
      CHARACTER_TEMPLATE_BUILDER_STEP_IDS[
        Math.min(
          activeIndex + 1,
          CHARACTER_TEMPLATE_BUILDER_STEP_IDS.length - 1
        )
      ];

    setActiveStep(nextStepId);
  }

  function goBack() {
    const previousStepId =
      CHARACTER_TEMPLATE_BUILDER_STEP_IDS[Math.max(activeIndex - 1, 0)];

    setActiveStep(previousStepId);
  }

  async function saveTemplate() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const apiPayload = await createDraft(creationPayload);
      const creation = extractCharacterTemplateFromApiResponse(apiPayload);

      if (!creation?.id) {
        throw new Error(
          "Character template was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Character template saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
        return;
      }

      router.push("/studio/my-creations");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Character template could not be saved."
      );
    }
  }

  const templateTitle = String(form.title || "");

  return {
    viewProps: {
      templateTitle,
      templateCategory: String(form.category || ""),
      templateDescription: String(form.description || ""),
      templateInitial: (templateTitle || "T").slice(0, 1).toUpperCase(),
      activeStep,
      activeIndex,
      stepItems,
      completion,
      filledFieldCount,
      saveStatus,
      saveMessage,
      saveDisabled: saveStatus === "saving",
      isFinalStep:
        activeIndex === CHARACTER_TEMPLATE_BUILDER_STEP_IDS.length - 1,
      onReset: resetTemplate,
      onSelectStep: setActiveStep,
      onBack: goBack,
      onNext: goNext,
      onSave: saveTemplate,
    },
    applicationContentProps: {
      activeStep,
      form,
      completion,
      filledFieldCount,
      sectionStatus,
      updateField,
    },
    compatibilityProps: {
      form,
      activeStep,
      activeIndex,
      completion,
      filledFieldCount,
      sectionStatus,
      creationPayload,
      saveStatus,
      saveMessage,
      steps: stepItems,
      setActiveStep,
      updateField,
      resetTemplate,
      goNext,
      goBack,
      saveTemplate,
    },
  };
}
