"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useStorylineReferenceOptions } from "@/components/studio/storylines/hooks/useStorylineReferenceOptions";
import { createStorylineDraft } from "@/lib/client/studio/storylines/storylineClient";
import {
  buildStorylineCreationPayload,
  normalizeStorylineData,
  validateStorylineData,
} from "@/lib/shared/storylines/storylineAuthoring.mjs";
import { extractStorylineCreationFromResponse } from "@/lib/shared/storylines/storylineSaveResponse.mjs";

export const STORYLINE_BUILDER_INITIAL_FORM = Object.freeze({
  title: "",
  description: "",
  visibility: "PRIVATE",
  contentRating: "SFW",
  tags: "",
  data: normalizeStorylineData({}),
});

const VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

const CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
]);

function normalizeText(value) {
  return String(value ?? "");
}

function normalizeForm(form = {}) {
  return {
    title: normalizeText(form.title),
    description: normalizeText(form.description),
    visibility: normalizeText(form.visibility) || "PRIVATE",
    contentRating: normalizeText(form.contentRating) || "SFW",
    tags: normalizeText(form.tags),
    data: normalizeStorylineData(form.data || {}),
  };
}

export function getStorylineBuilderShellViewProps({
  form = STORYLINE_BUILDER_INITIAL_FORM,
  saveStatus = "idle",
  saveMessage = "",
  updateField = () => {},
  saveDraft = () => {},
} = {}) {
  const normalizedForm = normalizeForm(form);
  const normalizedSaveStatus = normalizeText(saveStatus).toLowerCase() || "idle";

  return {
    eyebrow: "Storyline Builder",
    displayTitle: normalizedForm.title || "Untitled Storyline",
    description:
      "Sequence Stories and Scenarios inside one continuing chat. Completion may return the player to open-world play until the next authored trigger is satisfied.",
    titleLabel: "Title",
    titleValue: normalizedForm.title,
    onChangeTitle: (value) => updateField("title", value),
    descriptionLabel: "Description",
    descriptionValue: normalizedForm.description,
    onChangeDescription: (value) => updateField("description", value),
    visibilityLabel: "Visibility",
    visibilityValue: normalizedForm.visibility,
    visibilityOptions: VISIBILITY_OPTIONS,
    onChangeVisibility: (value) => updateField("visibility", value),
    contentRatingLabel: "Content Rating",
    contentRatingValue: normalizedForm.contentRating,
    contentRatingOptions: CONTENT_RATING_OPTIONS,
    onChangeContentRating: (value) => updateField("contentRating", value),
    tagsLabel: "Tags",
    tagsValue: normalizedForm.tags,
    tagsPlaceholder: "One tag per line",
    onChangeTags: (value) => updateField("tags", value),
    saveButtonLabel:
      normalizedSaveStatus === "saving" ? "Saving..." : "Save Draft",
    saveDisabled: normalizedSaveStatus === "saving",
    onSaveDraft: saveDraft,
    saveMessage: normalizeText(saveMessage),
    saveMessageTone:
      normalizedSaveStatus === "error" ? "error" : "success",
  };
}

export function useStorylineBuilderShellViewModel({
  createDraft = createStorylineDraft,
  navigate,
  initialForm = STORYLINE_BUILDER_INITIAL_FORM,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(() => normalizeForm(initialForm));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const references = useStorylineReferenceOptions();
  const validation = useMemo(
    () => validateStorylineData(form.data),
    [form.data]
  );

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: field === "data" ? normalizeStorylineData(value || {}) : value,
    }));
  }

  async function saveDraft() {
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      if (!form.title.trim()) {
        throw new Error("A Storyline title is required.");
      }

      if (validation.errors.length) {
        throw new Error(validation.errors[0]);
      }

      const payload = buildStorylineCreationPayload({
        title: form.title,
        description: form.description,
        visibility: form.visibility,
        contentRating: form.contentRating,
        tags: form.tags,
        data: form.data,
      });
      const response = await createDraft(payload);
      const creation = extractStorylineCreationFromResponse(response);

      if (!creation?.id) {
        throw new Error(
          "Storyline draft was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Draft saved.");

      const target = `/studio/my-creations/${creation.id}/edit`;
      if (typeof navigate === "function") {
        navigate(target);
      } else {
        router.push(target);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Storyline draft could not be saved.");
    }
  }

  const viewProps = useMemo(
    () =>
      getStorylineBuilderShellViewProps({
        form,
        saveStatus,
        saveMessage,
        updateField,
        saveDraft,
      }),
    [form, saveStatus, saveMessage]
  );

  const nodeEditorProps = useMemo(
    () => ({
      data: form.data,
      onChange: (data) => updateField("data", data),
      stories: references.stories,
      scenarios: references.scenarios,
      loadError: references.loadError,
      mode: "full",
    }),
    [form.data, references.stories, references.scenarios, references.loadError]
  );

  const openWorldSettingsProps = useMemo(
    () => ({
      data: form.data,
      onChange: (data) => updateField("data", data),
    }),
    [form.data]
  );

  return {
    form,
    saveStatus,
    saveMessage,
    validation,
    ...references,
    updateField,
    saveDraft,
    viewProps,
    nodeEditorProps,
    openWorldSettingsProps,
  };
}

export const useStorylineBuilderViewModel = useStorylineBuilderShellViewModel;
