"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import { createScenarioDraft } from "@/lib/client/studio/scenarios/scenarioClient";
import {
  SCENARIO_REGISTRY_BINDINGS,
  buildScenarioRegistryBindingState,
  getScenarioRegistrySelection,
  normalizeScenarioRegistryBindings,
} from "../scenarioRegistryBindings";
import {
  contentRatingOptions,
  initialForm,
  middlewareModules,
  participantModeOptions,
  storyCircleSteps,
  toneOptions,
  visibilityOptions,
} from "../constants";

export const SCENARIO_BUILDER_INITIAL_MODULES = Object.freeze({
  phase_gates: true,
  reward_gates: false,
  knowledge_boundaries: true,
  hidden_media_unlocks: false,
  time_weather: false,
  recap_support: true,
});

function normalizeCreationType(type) {
  return String(type || "").trim().toUpperCase();
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function isFilledValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Boolean(value.id);
  return Boolean(value);
}

function getReferenceImageUrl(creation) {
  const featuredMedia = creation?.featuredMedia || creation?.featured_media || [];
  const firstMedia = Array.isArray(featuredMedia) ? featuredMedia[0] : null;

  return (
    creation?.imageUrl ||
    creation?.image_url ||
    firstMedia?.imageUrl ||
    firstMedia?.image_url ||
    firstMedia?.url ||
    null
  );
}

function toScenarioReferenceOption(creation) {
  const type = normalizeCreationType(creation?.type);

  if (!creation?.id || !type) return null;

  return {
    id: creation.id,
    type,
    title: creation.title || "Untitled Creation",
    subtitle: creation.subtitle || creation.description || "",
    contentRating: creation.contentRating || creation.content_rating || "SFW",
    imageUrl: getReferenceImageUrl(creation),
  };
}

function filterReferenceOptions(options, allowedTypes = []) {
  const allowed = new Set(allowedTypes.map(normalizeCreationType));
  return options.filter((option) => allowed.has(normalizeCreationType(option.type)));
}

function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeReference(reference) {
  if (!reference || typeof reference !== "object") return null;

  return {
    id: reference.id,
    type: reference.type,
    title: reference.title,
    subtitle: reference.subtitle || "",
    contentRating: reference.contentRating || "SFW",
    imageUrl: reference.imageUrl || null,
  };
}

function normalizeReferenceArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeReference).filter(Boolean);
}

function buildScenarioDescription(form) {
  return (
    form.public_description?.trim() ||
    form.title?.trim() ||
    "A reusable Crestfall scenario."
  );
}

export function buildScenarioCreationPayload({ form, circle, enabledModules }) {
  const title = form.title?.trim() || "Untitled Scenario";
  const registryBindings = normalizeScenarioRegistryBindings(form);

  return {
    type: "SCENARIO",
    title,
    description: buildScenarioDescription(form),
    visibility: form.visibility || "PRIVATE",
    content_rating: form.content_rating || "SFW",
    data: {
      ...form,
      title,
      tags: parseTags(form.tags),
      required_characters: normalizeReferenceArray(form.required_characters),
      optional_characters: normalizeReferenceArray(form.optional_characters),
      suggested_location: normalizeReference(form.suggested_location),
      suggested_narrator: normalizeReference(form.suggested_narrator),
      suggested_npc_registries: normalizeReferenceArray(
        form.suggested_npc_registries
      ),
      boundRegistries: registryBindings.boundRegistries,
      boundRegistryLinks: registryBindings.boundRegistryLinks,
      story_circle: circle,
      middleware_modules: enabledModules,
      builder: "SCENARIO_BUILDER",
      builder_version: "1.0",
      creation_kind: "SCENARIO",
      playable_directly: false,
      chat_enabled: false,
    },
  };
}

function extractCreation(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

function cloneInitialForm(value) {
  const source = normalizeObject(value);
  return {
    ...initialForm,
    ...source,
    required_characters: Array.isArray(source.required_characters)
      ? source.required_characters
      : [],
    optional_characters: Array.isArray(source.optional_characters)
      ? source.optional_characters
      : [],
    suggested_npc_registries: Array.isArray(source.suggested_npc_registries)
      ? source.suggested_npc_registries
      : [],
    boundRegistries: {
      ...initialForm.boundRegistries,
      ...normalizeObject(source.boundRegistries),
    },
    boundRegistryLinks: {
      ...initialForm.boundRegistryLinks,
      ...normalizeObject(source.boundRegistryLinks),
    },
  };
}

function buildInitialCircle(value) {
  const source = normalizeObject(value);
  return Object.fromEntries(
    storyCircleSteps.map((step) => [step.id, source[step.id] || ""])
  );
}

function buildReferenceField({
  id,
  label,
  description,
  selected,
  multiple = false,
  onOpen,
  onRemove,
}) {
  const selectedItems = multiple
    ? Array.isArray(selected)
      ? selected
      : []
    : selected
      ? [selected]
      : [];

  return {
    id,
    label,
    description,
    selectedItems,
    onOpen,
    onRemove,
  };
}

export function useScenarioBuilderViewModel({
  initialScenarioForm = null,
  initialStoryCircle = null,
  initialEnabledModules = null,
  createDraft = createScenarioDraft,
  loadCreations = fetchOwnedCreations,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(() => cloneInitialForm(initialScenarioForm));
  const [circle, setCircle] = useState(() => buildInitialCircle(initialStoryCircle));
  const [enabledModules, setEnabledModules] = useState(() => ({
    ...SCENARIO_BUILDER_INITIAL_MODULES,
    ...normalizeObject(initialEnabledModules),
  }));
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [referenceLoadError, setReferenceLoadError] = useState("");
  const [referencePicker, setReferencePicker] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReferenceOptions() {
      setReferenceLoadError("");

      try {
        const creations = await loadCreations(
          {},
          "Creation references could not be loaded."
        );

        if (!cancelled) {
          setReferenceOptions(
            creations
              .map(toScenarioReferenceOption)
              .filter(Boolean)
              .filter((item) => item.type !== "PLAYER_CHARACTER")
          );
        }
      } catch (error) {
        if (!cancelled) {
          setReferenceLoadError(
            error?.message || "Creation references could not be loaded."
          );
        }
      }
    }

    loadReferenceOptions();
    return () => {
      cancelled = true;
    };
  }, [loadCreations]);

  const completion = useMemo(() => {
    const formFilled = Object.values(form).filter(isFilledValue).length;
    const circleFilled = Object.values(circle).filter(Boolean).length;
    const total = Object.keys(form).length + Object.keys(circle).length;
    return total ? Math.round(((formFilled + circleFilled) / total) * 100) : 0;
  }, [form, circle]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateCircle(field, value) {
    setCircle((current) => ({ ...current, [field]: value }));
  }

  function toggleModule(moduleId) {
    setEnabledModules((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }));
  }

  function openReferencePicker(config) {
    setReferencePicker(config);
  }

  function closeReferencePicker() {
    setReferencePicker(null);
  }

  function updateRegistryBinding(binding, value) {
    setForm((current) => ({
      ...current,
      ...buildScenarioRegistryBindingState(current, binding, value),
    }));
  }

  function updateReferenceSelection(value) {
    if (!referencePicker) return;

    if (referencePicker.registryBinding) {
      updateRegistryBinding(referencePicker.registryBinding, value);
      return;
    }

    updateField(referencePicker.field, value);
  }

  function removeRegistryReference(binding, referenceId) {
    const selected = getScenarioRegistrySelection(form, binding).filter(
      (item) => item.id !== referenceId
    );
    updateRegistryBinding(binding, selected);
  }

  function removeReference(field, referenceId) {
    setForm((current) => {
      const currentValue = current[field];
      if (Array.isArray(currentValue)) {
        return {
          ...current,
          [field]: currentValue.filter((item) => item.id !== referenceId),
        };
      }
      return { ...current, [field]: null };
    });
  }

  async function saveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createDraft(
        buildScenarioCreationPayload({ form, circle, enabledModules })
      );
      const creation = extractCreation(payload);

      if (!creation?.id) {
        throw new Error(
          "Scenario draft was saved, but no creation ID was returned."
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
      setSaveMessage(error?.message || "Scenario draft could not be saved.");
    }
  }

  const referenceFields = [
    buildReferenceField({
      id: "required-characters",
      label: "Required Characters",
      description: "Characters required for this scenario to function.",
      selected: form.required_characters,
      multiple: true,
      onOpen: () =>
        openReferencePicker({
          field: "required_characters",
          title: "Required Characters",
          body:
            "Select CHARACTER creations required for this scenario. Player Characters are not available here.",
          allowedTypes: ["CHARACTER"],
          multiple: true,
          emptyMessage: "No Character creations are available yet.",
        }),
      onRemove: (referenceId) =>
        removeReference("required_characters", referenceId),
    }),
    buildReferenceField({
      id: "optional-characters",
      label: "Optional Characters",
      description: "Characters that fit well but are not required.",
      selected: form.optional_characters,
      multiple: true,
      onOpen: () =>
        openReferencePicker({
          field: "optional_characters",
          title: "Optional Characters",
          body:
            "Select CHARACTER creations that can participate in this scenario without being required.",
          allowedTypes: ["CHARACTER"],
          multiple: true,
          emptyMessage: "No Character creations are available yet.",
        }),
      onRemove: (referenceId) =>
        removeReference("optional_characters", referenceId),
    }),
    buildReferenceField({
      id: "suggested-location",
      label: "Suggested Location",
      description: "Select one LOCATION creation for this scenario.",
      selected: form.suggested_location,
      onOpen: () =>
        openReferencePicker({
          field: "suggested_location",
          title: "Suggested Location",
          body: "Select one LOCATION creation for this scenario.",
          allowedTypes: ["LOCATION"],
          multiple: false,
          emptyMessage: "No Location creations are available yet.",
        }),
      onRemove: () => removeReference("suggested_location"),
    }),
    buildReferenceField({
      id: "suggested-narrator",
      label: "Suggested Narrator",
      description: "Select one NARRATOR creation for this scenario.",
      selected: form.suggested_narrator,
      onOpen: () =>
        openReferencePicker({
          field: "suggested_narrator",
          title: "Suggested Narrator",
          body: "Select one NARRATOR creation for this scenario.",
          allowedTypes: ["NARRATOR"],
          multiple: false,
          emptyMessage: "No Narrator creations are available yet.",
        }),
      onRemove: () => removeReference("suggested_narrator"),
    }),
    buildReferenceField({
      id: "suggested-npc-registries",
      label: "Suggested NPC Registries",
      description:
        "Select NPC Registry creations whose authored NPCs and relationships fit this scenario.",
      selected: form.suggested_npc_registries,
      multiple: true,
      onOpen: () =>
        openReferencePicker({
          field: "suggested_npc_registries",
          title: "Suggested NPC Registries",
          body:
            "Select NPC Registry creations recommended for Stories using this scenario. Registry entries remain runtime-managed and are not all loaded as participants at Story boot.",
          allowedTypes: ["NPC_REGISTRY"],
          multiple: true,
          emptyMessage: "No NPC Registry creations are available yet.",
        }),
      onRemove: (referenceId) =>
        removeReference("suggested_npc_registries", referenceId),
    }),
    buildReferenceField({
      id: "attached-faction-registries",
      label: "Attached Faction Registries",
      description:
        "Faction Registries that define the scenario's political powers, affiliations, rivalries, and territorial pressure.",
      selected: getScenarioRegistrySelection(
        form,
        SCENARIO_REGISTRY_BINDINGS.faction
      ),
      multiple: true,
      onOpen: () =>
        openReferencePicker({
          title: "Attached Faction Registries",
          body:
            "Attach Faction Registry creations as authoritative scenario context. Stories using this Scenario inherit these bindings automatically.",
          allowedTypes: ["FACTION_REGISTRY"],
          multiple: true,
          emptyMessage: "No Faction Registry creations are available yet.",
          registryBinding: SCENARIO_REGISTRY_BINDINGS.faction,
        }),
      onRemove: (referenceId) =>
        removeRegistryReference(
          SCENARIO_REGISTRY_BINDINGS.faction,
          referenceId
        ),
    }),
    buildReferenceField({
      id: "attached-organization-registries",
      label: "Attached Organization Registries",
      description:
        "Organization Registries that define the scenario's institutions, authority structures, memberships, and controlled locations.",
      selected: getScenarioRegistrySelection(
        form,
        SCENARIO_REGISTRY_BINDINGS.organization
      ),
      multiple: true,
      onOpen: () =>
        openReferencePicker({
          title: "Attached Organization Registries",
          body:
            "Attach Organization Registry creations as authoritative scenario context. Stories using this Scenario inherit these bindings automatically.",
          allowedTypes: ["ORGANIZATION_REGISTRY"],
          multiple: true,
          emptyMessage: "No Organization Registry creations are available yet.",
          registryBinding: SCENARIO_REGISTRY_BINDINGS.organization,
        }),
      onRemove: (referenceId) =>
        removeRegistryReference(
          SCENARIO_REGISTRY_BINDINGS.organization,
          referenceId
        ),
    }),
  ];

  const referencePickerProps = referencePicker
    ? {
        title: referencePicker.title,
        body: referencePicker.body,
        options: filterReferenceOptions(
          referenceOptions,
          referencePicker.allowedTypes
        ),
        selected: referencePicker.registryBinding
          ? getScenarioRegistrySelection(form, referencePicker.registryBinding)
          : form[referencePicker.field],
        multiple: referencePicker.multiple,
        onChange: updateReferenceSelection,
        onClose: closeReferencePicker,
        emptyMessage: referencePicker.emptyMessage,
      }
    : null;

  return {
    viewProps: {
      form,
      circle,
      enabledModules,
      completion,
      storyCircleSteps,
      middlewareModules,
      toneOptions,
      participantModeOptions,
      visibilityOptions,
      contentRatingOptions,
      referenceFields,
      referenceLoadError,
      saveStatus,
      saveMessage,
      saveDisabled: saveStatus === "saving",
      onUpdateField: updateField,
      onUpdateCircle: updateCircle,
      onToggleModule: toggleModule,
      onSave: saveDraft,
    },
    applicationContentProps: {
      referencePickerProps,
    },
  };
}
