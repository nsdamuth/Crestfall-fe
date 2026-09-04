"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SCENARIO_REGISTRY_BINDINGS,
  buildScenarioRegistryBindingState,
  getScenarioRegistrySelection,
} from "@/components/studio/create/scenario/scenarioRegistryBindings";
import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import { indexCreationSummaries } from "@/lib/shared/creations/creationReferenceHydration";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Cast, Location, Narrator, and Registries",
  sectionDescription:
    "Edit cast recommendations and authoritative Faction or Organization Registry attachments. Player Characters remain excluded from Scenario cast recommendations.",
});

function normalizeCreationType(type) {
  return String(type || "").trim().toUpperCase();
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

  return options.filter((option) =>
    allowed.has(normalizeCreationType(option.type))
  );
}

function getSelectedReferences(selected, multiple) {
  if (multiple) {
    return Array.isArray(selected) ? selected : [];
  }

  return selected ? [selected] : [];
}

function toViewReference(item) {
  const title = String(item?.title || "Untitled Creation");

  return {
    id: item?.id || "",
    title,
    typeLabel: normalizeCreationType(item?.type) || "REFERENCE",
    imageUrl: getReferenceImageUrl(item) || "",
    imageAltText: `${title} reference image`,
    initial: title.slice(0, 1).toUpperCase(),
  };
}

function buildViewField({
  id,
  label,
  description,
  selected,
  multiple = false,
  onOpen,
  onRemove,
}) {
  return {
    id,
    label,
    description,
    selectedItems: getSelectedReferences(selected, multiple).map(toViewReference),
    onOpen,
    onRemove,
  };
}

export function useScenarioCastRequirementsSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [referenceLoadError, setReferenceLoadError] = useState("");
  const [referencePicker, setReferencePicker] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReferenceOptions() {
      setReferenceLoadError("");

      try {
        const creations = await fetchOwnedCreations(
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
  }, []);

  function openReferencePicker(config) {
    setReferencePicker(config);
  }

  function closeReferencePicker() {
    setReferencePicker(null);
  }

  function updateRegistryBinding(binding, value) {
    const next = buildScenarioRegistryBindingState(data, binding, value);

    updateDataField?.("boundRegistries", next.boundRegistries);
    updateDataField?.("boundRegistryLinks", next.boundRegistryLinks);
  }

  function updateReferenceSelection(value) {
    if (!referencePicker) return;

    if (referencePicker.registryBinding) {
      updateRegistryBinding(referencePicker.registryBinding, value);
      return;
    }

    updateDataField?.(referencePicker.field, value);
  }

  function removeRegistryReference(binding, referenceId) {
    const selected = getScenarioRegistrySelection(data, binding).filter(
      (item) => item.id !== referenceId
    );

    updateRegistryBinding(binding, selected);
  }

  function removeReference(field, referenceId) {
    const currentValue = data[field];

    if (Array.isArray(currentValue)) {
      updateDataField?.(
        field,
        currentValue.filter((item) => item.id !== referenceId)
      );
      return;
    }

    updateDataField?.(field, null);
  }

  const pickerOptions = useMemo(() => {
    if (!referencePicker) return [];

    return filterReferenceOptions(referenceOptions, referencePicker.allowedTypes);
  }, [referenceOptions, referencePicker]);

  const referenceIndex = useMemo(
    () => indexCreationSummaries(referenceOptions),
    [referenceOptions]
  );

  const fields = [
    buildViewField({
      id: "required-characters",
      label: "Required Characters",
      description: "Characters required for this scenario to function.",
      selected: data.required_characters || [],
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
    buildViewField({
      id: "optional-characters",
      label: "Optional Characters",
      description: "Characters that fit well but are not required.",
      selected: data.optional_characters || [],
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
    buildViewField({
      id: "suggested-location",
      label: "Suggested Location",
      description: "Select one LOCATION creation for this scenario.",
      selected: data.suggested_location || null,
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
    buildViewField({
      id: "suggested-narrator",
      label: "Suggested Narrator",
      description: "Select one NARRATOR creation for this scenario.",
      selected: data.suggested_narrator || null,
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
    buildViewField({
      id: "suggested-npc-registries",
      label: "Suggested NPC Registries",
      description: "NPC Registries recommended for Stories using this scenario.",
      selected: data.suggested_npc_registries || [],
      multiple: true,
      onOpen: () =>
        openReferencePicker({
          field: "suggested_npc_registries",
          title: "Suggested NPC Registries",
          body:
            "Select NPC Registry creations recommended for Stories using this scenario. Registry entries remain runtime-managed rather than automatically becoming participants.",
          allowedTypes: ["NPC_REGISTRY"],
          multiple: true,
          emptyMessage: "No NPC Registry creations are available yet.",
        }),
      onRemove: (referenceId) =>
        removeReference("suggested_npc_registries", referenceId),
    }),
    buildViewField({
      id: "attached-faction-registries",
      label: "Attached Faction Registries",
      description:
        "Authoritative faction context inherited by Stories using this Scenario.",
      selected: getScenarioRegistrySelection(
        data,
        SCENARIO_REGISTRY_BINDINGS.faction,
        referenceIndex
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
    buildViewField({
      id: "attached-organization-registries",
      label: "Attached Organization Registries",
      description:
        "Authoritative organization context inherited by Stories using this Scenario.",
      selected: getScenarioRegistrySelection(
        data,
        SCENARIO_REGISTRY_BINDINGS.organization,
        referenceIndex
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

  const selectedReference = referencePicker?.registryBinding
    ? getScenarioRegistrySelection(
        data,
        referencePicker.registryBinding,
        referenceIndex
      )
    : referencePicker
      ? data[referencePicker.field]
      : null;

  return {
    viewProps: {
      ...DEFAULT_COPY,
      fields,
      referenceLoadError,
    },
    referencePickerProps: referencePicker
      ? {
          title: referencePicker.title,
          body: referencePicker.body,
          options: pickerOptions,
          selected: selectedReference,
          multiple: referencePicker.multiple,
          onChange: updateReferenceSelection,
          onClose: closeReferencePicker,
          emptyMessage: referencePicker.emptyMessage,
        }
      : null,
  };
}
