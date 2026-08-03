"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createMechanicsModuleDraft } from "@/lib/client/studio/mechanics-modules/mechanicsModuleClient";
import {
  createDefaultMechanicsDocument,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentDefaults.js";
import {
  replaceMechanicsRootFields,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentCompatibility.js";
import {
  asMechanicsObject,
  normalizeMechanicsDocument,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentNormalization.js";
import {
  selectMechanicsModuleIdentity,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentSelectors.js";
import {
  MECHANICS_MODULE_CONTENT_RATING_OPTIONS,
  MECHANICS_MODULE_VISIBILITY_OPTIONS,
} from "./MechanicsModuleBuilder.contract";
import {
  buildMechanicsModuleCreationPayload,
} from "./mechanicsModuleCreationPayload.js";

export { buildMechanicsModuleCreationPayload };

function extractCreation(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function createInitialMechanicsModuleData() {
  return createDefaultMechanicsDocument();
}

function createInitialForm(initialDraft) {
  const source = asMechanicsObject(initialDraft);

  return {
    title: typeof source.title === "string" ? source.title : "",
    description:
      typeof source.description === "string" ? source.description : "",
    visibility: source.visibility === "UNLISTED" ? "UNLISTED" : "PRIVATE",
    content_rating: ["SFW", "MATURE", "EXPLICIT"].includes(
      source.content_rating || source.contentRating
    )
      ? source.content_rating || source.contentRating
      : "SFW",
    data: normalizeMechanicsDocument(source.data),
  };
}

export function useMechanicsModuleBuilderViewModel({
  initialDraft = null,
  createDraft = createMechanicsModuleDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(() => createInitialForm(initialDraft));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  function updateField(field, value) {
    const storageField = field === "contentRating" ? "content_rating" : field;

    if (
      ![
        "title",
        "description",
        "visibility",
        "content_rating",
      ].includes(storageField)
    ) {
      return;
    }

    setForm((current) => ({
      ...current,
      [storageField]: value,
    }));
  }

  function updateMechanicsDataField(field, value) {
    setForm((current) => ({
      ...current,
      data: replaceMechanicsRootFields(current.data, {
        [field]: value,
      }),
    }));
  }

  function replaceMechanicsData(nextData) {
    setForm((current) => ({
      ...current,
      data: normalizeMechanicsDocument(nextData),
    }));
  }

  async function saveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft(
        buildMechanicsModuleCreationPayload(form)
      );
      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          "Mechanics module draft was saved, but no creation ID was returned."
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
      setSaveMessage(
        error?.message || "Mechanics module draft could not be saved."
      );
    }
  }

  const previewForm = useMemo(
    () => ({
      ...form,
      type: "MECHANICS_MODULE",
      data: normalizeMechanicsDocument(form.data),
    }),
    [form]
  );

  const identity = selectMechanicsModuleIdentity(form.data);

  return {
    title: form.title,
    description: form.description,
    visibility: form.visibility,
    contentRating: form.content_rating,
    visibilityOptions: MECHANICS_MODULE_VISIBILITY_OPTIONS,
    contentRatingOptions: MECHANICS_MODULE_CONTENT_RATING_OPTIONS,
    moduleId: identity.moduleId,
    contractVersion: identity.contractVersion,
    runtimeStorageNote:
      "These fields save into creation.data.instanceData. Runtime sessions store live values separately.",
    saveStatus,
    saveMessage,
    saveDisabled: saveStatus === "saving",
    onUpdateField: updateField,
    onSave: saveDraft,
    mechanicsFieldsProps: {
      form: previewForm,
      updateDataField: updateMechanicsDataField,
      replaceData: replaceMechanicsData,
    },
  };
}
