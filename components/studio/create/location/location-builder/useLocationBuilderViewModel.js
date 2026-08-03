"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { assetBuilderConfigs } from "@/components/studio/create/assets/assetBuilderConfigs";
import { createLocationDraft } from "@/lib/client/studio/locations/locationClient";
import {
  LOCATION_CONTENT_RATING_OPTIONS,
  LOCATION_IMAGE_COUNT_OPTIONS,
  LOCATION_IMAGE_PROMPT_MAX_LENGTH,
  LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
  LOCATION_RENDERING_STYLE_OPTIONS,
  LOCATION_VISIBILITY_OPTIONS,
} from "./LocationBuilder.contract";

export const LOCATION_BUILDER_INITIAL_FORM = Object.freeze({
  name: "",
  description: "",
  prompt: "",
  image_prompt: "",
  negative_prompt: "",
  tags: "",
  visibility: "PRIVATE",
  content_rating: "SFW",
  rendering_style: "EITHER",
  image_count: "4",
});

export const LOCATION_BUILDER_INITIAL_DATA = Object.freeze({
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

const LOCATION_CONFIG = assetBuilderConfigs.location;
const WEATHER_MODULE_ID = "core.inWorldWeather.v1";
const TIME_CALENDAR_MODULE_ID = "core.timeCalendar.v1";

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

function cloneInitialForm(value) {
  return {
    ...LOCATION_BUILDER_INITIAL_FORM,
    ...normalizeObject(value),
  };
}

function cloneInitialLocationData(value) {
  const source = normalizeObject(value);

  return {
    ...LOCATION_BUILDER_INITIAL_DATA,
    ...source,
    inheritance: {
      ...LOCATION_BUILDER_INITIAL_DATA.inheritance,
      ...normalizeObject(source.inheritance),
    },
    engine_module_bindings: normalizeArray(source.engine_module_bindings),
    boundRegistries: {
      ...LOCATION_BUILDER_INITIAL_DATA.boundRegistries,
      ...normalizeObject(source.boundRegistries),
    },
    boundRegistryLinks: {
      ...LOCATION_BUILDER_INITIAL_DATA.boundRegistryLinks,
      ...normalizeObject(source.boundRegistryLinks),
    },
  };
}

export function limitLocationPromptValue(
  value,
  maxLength = LOCATION_IMAGE_PROMPT_MAX_LENGTH
) {
  return normalizeString(value).slice(0, maxLength);
}

export function parseLocationTags(value) {
  return normalizeString(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildLocationDescription(form) {
  return (
    normalizeString(form?.description).trim() ||
    normalizeString(form?.prompt).trim() ||
    "A reusable Crestfall location."
  );
}

export function buildLocationCreationPayload({
  form,
  locationData,
  selectedCover,
}) {
  const normalizedForm = cloneInitialForm(form);
  const normalizedLocationData = cloneInitialLocationData(locationData);
  const title = normalizeString(normalizedForm.name).trim() || "Untitled Location";

  return {
    type: "LOCATION",
    title,
    description: buildLocationDescription(normalizedForm),
    visibility: normalizedForm.visibility || "PRIVATE",
    content_rating: normalizedForm.content_rating || "SFW",
    data: {
      ...LOCATION_BUILDER_INITIAL_DATA,
      ...normalizedForm,
      ...normalizedLocationData,

      name: title,
      title,
      tags: parseLocationTags(normalizedForm.tags),

      builder: "LOCATION_BUILDER",
      builder_version: "1.0",

      asset_type: "LOCATION",
      ingredient_type: "LOCATION",
      visual_asset: true,
      image_gen_ingredient: true,

      prompt_guidance: normalizedForm.prompt,
      image_prompt: limitLocationPromptValue(
        normalizedForm.image_prompt,
        LOCATION_IMAGE_PROMPT_MAX_LENGTH
      ),
      negative_prompt: limitLocationPromptValue(
        normalizedForm.negative_prompt,
        LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
      ),
      selected_cover: selectedCover,

      playable: false,
      chat_enabled: false,
      addable_to_rooms_as_character: false,

      registry_links: [],
    },
  };
}

function extractCreation(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

function buildCoverCandidates(imageCount) {
  const parsedCount = Number(imageCount || 4);
  const count = Number.isFinite(parsedCount) ? parsedCount : 4;

  return Array.from({ length: count }, (_, index) => ({
    id: `candidate-${index + 1}`,
    label: `Candidate ${index + 1}`,
  }));
}

function countBoundRegistries(locationData) {
  return Object.values(normalizeObject(locationData?.boundRegistries)).reduce(
    (total, value) => total + normalizeArray(value).length,
    0
  );
}

function hasEnabledModule(locationData, moduleId) {
  return normalizeArray(locationData?.engine_module_bindings).some(
    (binding) => binding?.moduleId === moduleId && binding?.enabled !== false
  );
}

export function useLocationBuilderViewModel({
  initialForm = null,
  initialLocationData = null,
  createDraft = createLocationDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(() => cloneInitialForm(initialForm));
  const [locationData, setLocationData] = useState(() =>
    cloneInitialLocationData(initialLocationData)
  );
  const [selectedCover, setSelectedCover] = useState(null);
  const [parentPickerOpen, setParentPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const candidates = useMemo(
    () => buildCoverCandidates(form.image_count),
    [form.image_count]
  );

  const runtimeForm = useMemo(
    () => ({
      ...form,
      title: form.name,
      type: "LOCATION",
      data: {
        ...locationData,
        name: form.name,
      },
    }),
    [form, locationData]
  );

  const runtimeSummary = useMemo(
    () => ({
      registryCount: countBoundRegistries(locationData),
      hasWeatherModule: hasEnabledModule(locationData, WEATHER_MODULE_ID),
      hasTimeCalendarModule: hasEnabledModule(
        locationData,
        TIME_CALENDAR_MODULE_ID
      ),
    }),
    [locationData]
  );

  function updateField(field, value) {
    const nextValue =
      field === "image_prompt"
        ? limitLocationPromptValue(value, LOCATION_IMAGE_PROMPT_MAX_LENGTH)
        : field === "negative_prompt"
          ? limitLocationPromptValue(value, LOCATION_NEGATIVE_PROMPT_MAX_LENGTH)
          : value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
  }

  function updateLocationData(field, value) {
    setLocationData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateLocationDataFields(patch) {
    setLocationData((current) => ({
      ...current,
      ...normalizeObject(patch),
    }));
  }

  function updateInheritance(field, value) {
    setLocationData((current) => ({
      ...current,
      inheritance: {
        ...normalizeObject(current.inheritance),
        [field]: value,
      },
    }));
  }

  function selectParentLocation(selection = {}) {
    updateLocationDataFields({
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
    updateLocationDataFields({
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
      const payload = await createDraft(
        buildLocationCreationPayload({
          form,
          locationData,
          selectedCover,
        })
      );
      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          "Location draft was saved, but no creation ID was returned."
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
      setSaveMessage(error?.message || "Location draft could not be saved.");
    }
  }

  return {
    viewProps: {
      form,
      locationData,
      classificationFields: LOCATION_CONFIG.extraFields || [],
      promptLabel: LOCATION_CONFIG.promptLabel,
      promptPlaceholder: LOCATION_CONFIG.promptPlaceholder,
      candidates,
      selectedCover,
      runtimeSummary,
      visibilityOptions: LOCATION_VISIBILITY_OPTIONS,
      contentRatingOptions: LOCATION_CONTENT_RATING_OPTIONS,
      renderingStyleOptions: LOCATION_RENDERING_STYLE_OPTIONS,
      imageCountOptions: LOCATION_IMAGE_COUNT_OPTIONS,
      saveStatus,
      saveMessage,
      saveDisabled: saveStatus === "saving",
      onUpdateField: updateField,
      onUpdateLocationData: updateLocationData,
      onUpdateInheritance: updateInheritance,
      onSelectCover: setSelectedCover,
      onOpenParentPicker: () => setParentPickerOpen(true),
      onClearParentLocation: clearParentLocation,
      onSave: saveDraft,
    },
    applicationContentProps: {
      sensoryEnvironmentProps: {
        sensoryProfile: locationData.sensoryProfile,
        onChange: (sensoryProfile) =>
          updateLocationData("sensoryProfile", sensoryProfile),
      },
      runtimeModulesProps: {
        form: runtimeForm,
        updateDataField: updateLocationData,
      },
      registryAttachmentsProps: {
        form: runtimeForm,
        updateDataField: updateLocationData,
      },
      parentPickerProps: parentPickerOpen
        ? {
            selectedLocationId: locationData.parentLocationId || "",
            onClose: () => setParentPickerOpen(false),
            onSelect: selectParentLocation,
          }
        : null,
    },
  };
}
