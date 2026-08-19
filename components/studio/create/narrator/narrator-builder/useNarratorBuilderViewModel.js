"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createNarratorDraft } from "@/lib/client/studio/narrators/narratorClient";
import {
  contentRatingOptions,
  initialForm,
  toneOptions,
  visibilityOptions,
} from "../constants";
import {
  narratorResponseDirectionDefaults,
} from "../narratorModulePresets";
import { getNarratorModuleSelectorViewProps } from "../narrator-module-selector/useNarratorModuleSelectorViewModel";
import { NARRATOR_BUILDER_DEFAULT_MODULES } from "./NarratorBuilder.contract";

function parseTags(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeLabel(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .trim();
}

function buildNarratorDescription(form) {
  return (
    form.description?.trim() ||
    form.name?.trim() ||
    "A reusable Crestfall narrator."
  );
}

export function buildNarratorCreationPayload({
  form,
  selectedModules,
  responseDirection,
}) {
  const title = form.name?.trim() || "Unnamed Narrator";
  const tags = parseTags(form.tags);

  return {
    type: "NARRATOR",
    title,
    description: buildNarratorDescription(form),
    visibility: form.visibility || "PRIVATE",
    content_rating: form.content_rating || "SFW",
    data: {
      ...form,
      name: title,
      title,
      tags,

      // Story Presentation modules are canonical and independently scoped.
      selected_modules: selectedModules,
      response_direction: {
        ...narratorResponseDirectionDefaults,
        ...(responseDirection || {}),
      },

      builder: "NARRATOR_BUILDER",
      builder_version: "1.0",
      creation_kind: "NARRATOR",
      image_gen_ingredient: false,
      playable_directly: false,
      chat_enabled: true,
    },
  };
}

function extractCreation(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function useNarratorBuilderViewModel({
  createDraft = createNarratorDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedModules, setSelectedModules] = useState({
    ...NARRATOR_BUILDER_DEFAULT_MODULES,
  });
  const [responseDirection, setResponseDirection] = useState({
    ...narratorResponseDirectionDefaults,
  });

  function updateField(field, value) {
    const storageField =
      field === "narratorGuidance"
        ? "narrator_guidance"
        : field === "avoidGuidance"
          ? "avoid_guidance"
          : field === "contentRating"
            ? "content_rating"
            : field;

    setForm((current) => ({
      ...current,
      [storageField]: value,
    }));
  }

  function updateModule(groupId, moduleId) {
    setSelectedModules((current) => ({
      ...current,
      [groupId]: moduleId,
    }));
  }

  function updateResponseDirection(field, value) {
    setResponseDirection((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft(
        buildNarratorCreationPayload({
          form,
          selectedModules,
          responseDirection,
        })
      );
      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          "Narrator draft was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.push(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Narrator draft could not be saved.");
    }
  }

  const moduleSelectorViewProps = getNarratorModuleSelectorViewProps({
    selectedModules,
    updateModule,
    responseDirection,
    updateResponseDirection,
  });

  const moduleSummaryItems = Object.entries(selectedModules).map(
    ([groupId, moduleId]) => ({
      id: `${groupId}-${moduleId}`,
      label: `${normalizeLabel(groupId)}: ${normalizeLabel(moduleId)}`,
    })
  );

  return {
    name: form.name,
    description: form.description,
    tone: form.tone,
    narratorGuidance: form.narrator_guidance,
    avoidGuidance: form.avoid_guidance,
    tags: form.tags,
    visibility: form.visibility,
    contentRating: form.content_rating,
    toneOptions,
    visibilityOptions,
    contentRatingOptions,
    moduleSummaryItems,
    moduleSelectorViewProps,
    saveStatus,
    saveMessage,
    saveDisabled: saveStatus === "saving",
    onUpdateField: updateField,
    onSave: saveDraft,
  };
}
