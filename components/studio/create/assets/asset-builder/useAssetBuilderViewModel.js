"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createVisualAssetDraft } from "@/lib/client/studio/assets/assetClient";
import {
  ASSET_CONTENT_RATING_OPTIONS,
  ASSET_IMAGE_COUNT_OPTIONS,
  ASSET_IMAGE_PROMPT_MAX_LENGTH,
  getAssetNegativePromptMaxLength,
  ASSET_RENDERING_STYLE_OPTIONS,
  ASSET_VISIBILITY_OPTIONS,
} from "./AssetBuilder.contract";
import {
  normalizePoseDataForPersistence,
  updatePoseSemanticField,
} from "@/lib/shared/creations/poseSemantics";

export const ASSET_BUILDER_INITIAL_FORM = Object.freeze({
  name: "",
  description: "",
  prompt: "",
  image_prompt: "",
  negative_prompt: "",
  anime_prompt: "",
  realistic_prompt: "",
  anime_negative_prompt: "",
  realistic_negative_prompt: "",
  tags: "",
  visibility: "PRIVATE",
  content_rating: "SFW",
  rendering_style: "EITHER",
  image_count: "4",
});

export const ASSET_BUILDER_INITIAL_LOCATION_DATA = Object.freeze({
  parentLocationId: "",
  parentLocationTitle: "",
  parentLocationDescription: "",
  parentLocationImageUrl: "",
  parentLocationScale: "",
  parentLocationSpaceType: "",
  inheritance: {
    inheritsWeather: true,
    inheritsTime: true,
    inheritsKnowledgeRules: true,
    inheritsTravelRules: true,
  },
  engine_module_bindings: [],
  boundRegistries: {
    eventRegistryIds: [],
    questRegistryIds: [],
    npcRegistryIds: [],
    itemRegistryIds: [],
    locationRegistryIds: [],
    factionRegistryIds: [],
    organizationRegistryIds: [],
  },
  boundRegistryLinks: {
    eventRegistries: [],
    questRegistries: [],
    npcRegistries: [],
    itemRegistries: [],
    locationRegistries: [],
    factionRegistries: [],
    organizationRegistries: [],
  },
});

function normalizeString(value) {
  return typeof value === "string" ? value : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function cloneInitialForm(initialForm) {
  return {
    ...ASSET_BUILDER_INITIAL_FORM,
    ...normalizeObject(initialForm),
  };
}

function cloneInitialLocationData(initialValues) {
  const source = normalizeObject(initialValues);

  return {
    ...ASSET_BUILDER_INITIAL_LOCATION_DATA,
    ...source,
    inheritance: {
      ...ASSET_BUILDER_INITIAL_LOCATION_DATA.inheritance,
      ...normalizeObject(source.inheritance),
    },
    boundRegistries: {
      ...ASSET_BUILDER_INITIAL_LOCATION_DATA.boundRegistries,
      ...normalizeObject(source.boundRegistries),
    },
    boundRegistryLinks: {
      ...ASSET_BUILDER_INITIAL_LOCATION_DATA.boundRegistryLinks,
      ...normalizeObject(source.boundRegistryLinks),
    },
    engine_module_bindings: normalizeArray(source.engine_module_bindings),
  };
}

export function limitAssetPromptValue(
  value,
  maxLength = ASSET_IMAGE_PROMPT_MAX_LENGTH
) {
  return normalizeString(value).slice(0, maxLength);
}

export function parseAssetTags(value) {
  return normalizeString(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getCreationTypeFromAssetConfig(config = {}) {
  if (config.creationType) return config.creationType;

  const source = `${config.id || ""} ${config.typeLabel || ""} ${
    config.title || ""
  }`.toLowerCase();

  if (source.includes("outfit") || source.includes("clothing")) {
    return "OUTFIT";
  }

  if (source.includes("pose")) {
    return "POSE";
  }

  if (source.includes("image preset") || source.includes("preset")) {
    return "IMAGE_PRESET";
  }

  if (source.includes("location") || source.includes("scene")) {
    return "LOCATION";
  }

  return "LOCATION";
}

function buildAssetDescription(form, config) {
  return (
    normalizeString(form?.description).trim() ||
    normalizeString(form?.prompt).trim() ||
    `A reusable ${config?.typeLabel || "visual"} image-generation asset.`
  );
}

export function buildAssetCreationPayload({
  form,
  extraValues,
  selectedCover,
  config,
}) {
  const normalizedForm = cloneInitialForm(form);
  const normalizedExtras = normalizeObject(extraValues);
  const creationType = getCreationTypeFromAssetConfig(config);
  const name =
    normalizeString(normalizedForm.name).trim() ||
    `Untitled ${config?.typeLabel || "Asset"}`;
  const tags = parseAssetTags(normalizedForm.tags);

  const outfitDefaults =
    creationType === "OUTFIT"
      ? {
          clothing_mode: "NORMAL",
          normal_clothing_prompt: normalizedForm.prompt,
          clothing_sections: {},
          signature_clothing: "",
          image_prompt: limitAssetPromptValue(
            normalizedForm.image_prompt,
            ASSET_IMAGE_PROMPT_MAX_LENGTH
          ),
          negative_prompt: limitAssetPromptValue(
            normalizedForm.negative_prompt,
            getAssetNegativePromptMaxLength(creationType)
          ),
          anime_prompt: limitAssetPromptValue(
            normalizedForm.anime_prompt,
            ASSET_IMAGE_PROMPT_MAX_LENGTH
          ),
          realistic_prompt: limitAssetPromptValue(
            normalizedForm.realistic_prompt,
            ASSET_IMAGE_PROMPT_MAX_LENGTH
          ),
          anime_negative_prompt: limitAssetPromptValue(
            normalizedForm.anime_negative_prompt,
            getAssetNegativePromptMaxLength(creationType)
          ),
          realistic_negative_prompt: limitAssetPromptValue(
            normalizedForm.realistic_negative_prompt,
            getAssetNegativePromptMaxLength(creationType)
          ),
        }
      : {};

  const locationDefaults =
    creationType === "LOCATION"
      ? cloneInitialLocationData(normalizedExtras)
      : {};

  const baseData = {
    ...normalizedForm,
    ...outfitDefaults,
    ...locationDefaults,
    ...normalizedExtras,
    negative_prompt: limitAssetPromptValue(
      normalizedForm.negative_prompt,
      getAssetNegativePromptMaxLength(creationType)
    ),
    name,
    tags,

    builder: "VISUAL_ASSET_BUILDER",
    builder_version: "1.0",

    asset_type: creationType,
    ingredient_type: creationType,
    visual_asset: true,
    image_gen_ingredient: true,

    prompt_guidance: normalizedForm.prompt,
    selected_cover: selectedCover,

    playable: false,
    chat_enabled: false,
    addable_to_rooms_as_character: false,

    registry_links: [],
  };

  return {
    type: creationType,
    title: name,
    description: buildAssetDescription(normalizedForm, config),
    visibility: normalizedForm.visibility || "PRIVATE",
    content_rating: normalizedForm.content_rating || "SFW",
    data:
      creationType === "POSE"
        ? normalizePoseDataForPersistence(baseData)
        : baseData,
  };
}

function extractCreation(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

function buildCandidates(imageCount) {
  const count = Number(imageCount || 4);

  return Array.from({ length: Number.isFinite(count) ? count : 4 }, (_, index) => ({
    id: `candidate-${index + 1}`,
    label: `Candidate ${index + 1}`,
  }));
}

export function useAssetBuilderViewModel({
  config = {},
  initialForm = null,
  initialExtraValues = null,
  createDraft = createVisualAssetDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const creationType = getCreationTypeFromAssetConfig(config);
  const [form, setForm] = useState(() => cloneInitialForm(initialForm));
  const negativePromptMaxLength = getAssetNegativePromptMaxLength(creationType);
  const [extraValues, setExtraValues] = useState(() =>
    creationType === "LOCATION"
      ? cloneInitialLocationData(initialExtraValues)
      : normalizeObject(initialExtraValues)
  );
  const [selectedCover, setSelectedCover] = useState(null);
  const [parentPickerOpen, setParentPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const candidates = useMemo(
    () => buildCandidates(form.image_count),
    [form.image_count]
  );

  const supportsImagePromptFields = [
    "OUTFIT",
    "POSE",
    "LOCATION",
    "IMAGE_PRESET",
  ].includes(creationType);

  function updateField(field, value) {
    const nextValue =
      ["image_prompt", "anime_prompt", "realistic_prompt"].includes(field)
        ? limitAssetPromptValue(value, ASSET_IMAGE_PROMPT_MAX_LENGTH)
        : [
              "negative_prompt",
              "anime_negative_prompt",
              "realistic_negative_prompt",
            ].includes(field)
          ? limitAssetPromptValue(value, negativePromptMaxLength)
          : value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
  }

  function updateExtra(field, value) {
    setExtraValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePoseDataField(field, value) {
    if (field === "name") {
      updateField("name", value);
      return;
    }

    if (field === "tags") {
      updateField("tags", Array.isArray(value) ? value.join(", ") : value);
      return;
    }

    if (field === "prompt_guidance") {
      updateField("prompt", value);
      return;
    }

    setExtraValues((current) =>
      updatePoseSemanticField(current, field, value)
    );
  }

  function updateExtraFields(patch) {
    setExtraValues((current) => ({
      ...current,
      ...normalizeObject(patch),
    }));
  }

  function selectParentLocation(selection = {}) {
    updateExtraFields({
      parentLocationId: selection.parentLocationId || "",
      parentLocationTitle: selection.parentLocationTitle || "",
      parentLocationDescription: selection.parentLocationDescription || "",
      parentLocationImageUrl: selection.parentLocationImageUrl || "",
      parentLocationScale: selection.parentLocationScale || "",
      parentLocationSpaceType: selection.parentLocationSpaceType || "",
    });
    setParentPickerOpen(false);
  }

  function clearParentLocation() {
    updateExtraFields({
      parentLocationId: "",
      parentLocationTitle: "",
      parentLocationDescription: "",
      parentLocationImageUrl: "",
      parentLocationScale: "",
      parentLocationSpaceType: "",
    });
  }

  async function saveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const fallbackMessage = `${config?.typeLabel || "Asset"} draft could not be saved.`;
      const payload = await createDraft(
        buildAssetCreationPayload({
          form,
          extraValues,
          selectedCover,
          config,
        }),
        fallbackMessage
      );
      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          `${config?.typeLabel || "Asset"} draft was saved, but no creation ID was returned.`
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation, payload);
        return;
      }

      router.push(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message ||
          `${config?.typeLabel || "Asset"} draft could not be saved.`
      );
    }
  }

  const poseRuntimeForm = {
    ...form,
    title: form.name,
    type: "POSE",
    data: normalizePoseDataForPersistence({
      ...extraValues,
      name: form.name,
      tags: parseAssetTags(form.tags),
      prompt: form.prompt,
      prompt_guidance: form.prompt,
      image_prompt: form.image_prompt,
      negative_prompt: form.negative_prompt,
    }),
  };

  const runtimeForm = {
    ...form,
    title: form.name,
    type: "LOCATION",
    data: {
      ...extraValues,
      name: form.name,
    },
  };

  return {
    config: {
      typeLabel: config?.typeLabel || "Asset",
      title: config?.title || "Create Asset",
      description: config?.description || "Create a reusable visual asset.",
      promptLabel: config?.promptLabel || "Asset Guidance",
      promptPlaceholder:
        config?.promptPlaceholder || "Describe the visual asset.",
    },
    creationType,
    form,
    extraFields: normalizeArray(config?.extraFields),
    extraValues,
    candidates,
    selectedCover,
    supportsImagePromptFields,
    negativePromptMaxLength,
    parentLocation: {
      id: extraValues.parentLocationId || "",
      title: extraValues.parentLocationTitle || "",
      imageUrl: extraValues.parentLocationImageUrl || "",
      scale: extraValues.parentLocationScale || "",
      spaceType: extraValues.parentLocationSpaceType || "",
    },
    visibilityOptions: ASSET_VISIBILITY_OPTIONS,
    contentRatingOptions: ASSET_CONTENT_RATING_OPTIONS,
    renderingStyleOptions: ASSET_RENDERING_STYLE_OPTIONS,
    imageCountOptions: ASSET_IMAGE_COUNT_OPTIONS,
    saveStatus,
    saveMessage,
    saveDisabled: saveStatus === "saving",
    onUpdateField: updateField,
    onUpdateExtra: updateExtra,
    onSelectCover: setSelectedCover,
    onOpenParentPicker: () => setParentPickerOpen(true),
    onClearParentLocation: clearParentLocation,
    onSave: saveDraft,
    poseEditorProps:
      creationType === "POSE"
        ? {
            form: poseRuntimeForm,
            updateDataField: updatePoseDataField,
          }
        : null,
    locationRuntimeProps:
      creationType === "LOCATION"
        ? {
            form: runtimeForm,
            updateDataField: updateExtra,
          }
        : null,
    locationRegistryProps:
      creationType === "LOCATION"
        ? {
            form: runtimeForm,
            updateDataField: updateExtra,
          }
        : null,
    parentPickerProps:
      creationType === "LOCATION" && parentPickerOpen
        ? {
            selectedLocationId: extraValues.parentLocationId || "",
            onClose: () => setParentPickerOpen(false),
            onSelect: selectParentLocation,
          }
        : null,
  };
}
