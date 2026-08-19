import {
  STRUCTURED_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../StructuredRegistryBuilder.contract.js";

import {
  STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  isStructuredRegistryType,
  projectStructuredRegistryReferenceSelection,
} from "../../../../registries/structured-registry-references/StructuredRegistryReferencePresentation.contract.js";

export const STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_BINDING_CONTRACT_VERSION =
  "structured_registry_builder_reference_precision_binding_v1";

export const STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_CALLBACK_KEYS =
  Object.freeze([
    "onOpenLinkPicker",
    "onSelectLinkedReference",
    "onRemoveLinkedReference",
    "onLinkedReferenceNotesChange",
  ]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

function projectRelationshipGroup({
  group = {},
  activeEntry = {},
  linkedCreations = [],
  currentRegistryCreationId = "",
} = {}) {
  const source = object(group);
  const fieldId = text(source.id);
  const references = array(activeEntry?.[fieldId]);

  const precision =
    projectStructuredRegistryReferenceSelection({
      references,
      creations: linkedCreations,
      currentRegistryCreationId,
      currentRegistryEntryId: text(activeEntry?.id),
    });

  const allowedTypes = array(source.allowedTypes)
    .map(upper)
    .filter(Boolean);

  const structuredAllowed =
    allowedTypes.some(isStructuredRegistryType);

  return {
    id: fieldId,
    label: text(source.label),
    pickerTitle:
      text(source.pickerTitle) || "Link Creation",
    emptyLabel:
      text(source.emptyLabel) ||
      "No linked creations yet.",
    addLabel:
      text(source.addLabel) || "Link Creation",

    allowedTypes,

    selectionMode:
      structuredAllowed
        ? "REGISTRY_ENTRY"
        : "WHOLE_CREATION",

    referencePrecisionRequired:
      structuredAllowed,

    selectedReferenceKeys:
      precision.selectedReferenceKeys,

    excludedReferenceKeys:
      precision.excludedReferenceKeys,

    references:
      precision.references,

    summary:
      precision.summary,

    helper:
      structuredAllowed
        ? "Choose a specific registry entry. Older whole-registry links remain visible but are imprecise and should be relinked when practical."
        : "Choose the linked Creation.",

    degradedStateLabels: {
      legacyRegistryReference:
        "Legacy whole-registry link",
      missingRegistryEntry:
        "Missing registry entry",
      unavailable:
        "Unavailable linked creation",
    },
  };
}

export function projectStructuredRegistryBuilderReferencePrecisionBinding({
  config = {},
  activeEntry = null,
  linkedCreations = [],
  currentRegistryCreationId = "",
  callbacks = {},
} = {}) {
  const safeConfig = object(config);
  const safeEntry = object(activeEntry);
  const callbackSource = object(callbacks);

  const relationshipGroups = array(
    safeConfig.relationshipGroups
  ).map((group) =>
    projectRelationshipGroup({
      group,
      activeEntry: safeEntry,
      linkedCreations,
      currentRegistryCreationId,
    })
  );

  const selectedReferenceKeys = [
    ...new Set(
      relationshipGroups.flatMap(
        (group) => group.selectedReferenceKeys
      )
    ),
  ];

  const excludedReferenceKeys = [
    ...new Set(
      relationshipGroups.flatMap(
        (group) => group.excludedReferenceKeys
      )
    ),
  ];

  const precisionSummary = {
    resolvedCreationCount:
      relationshipGroups.reduce(
        (total, group) =>
          total +
          group.summary.resolvedCreationCount,
        0
      ),
    resolvedRegistryEntryCount:
      relationshipGroups.reduce(
        (total, group) =>
          total +
          group.summary.resolvedRegistryEntryCount,
        0
      ),
    legacyRegistryReferenceCount:
      relationshipGroups.reduce(
        (total, group) =>
          total +
          group.summary.legacyRegistryReferenceCount,
        0
      ),
    missingRegistryEntryCount:
      relationshipGroups.reduce(
        (total, group) =>
          total +
          group.summary.missingRegistryEntryCount,
        0
      ),
    unavailableCount:
      relationshipGroups.reduce(
        (total, group) =>
          total +
          group.summary.unavailableCount,
        0
      ),
  };

  return {
    bindingContractVersion:
      STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_BINDING_CONTRACT_VERSION,

    structuredRegistryBuilderViewContractVersion:
      STRUCTURED_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,

    referencePresentationContractVersion:
      STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,

    activeEntryId:
      text(safeEntry.id),

    relationshipGroups,

    pickerState: {
      selectedReferenceKeys,
      excludedReferenceKeys,
      preciseStructuredRegistryIdentity:
        "registryCreationId + registryEntryId",
      directSelfReferenceExcluded: true,
      sameRegistrySiblingReferenceAllowed: true,
    },

    precisionSummary,

    functionalWiringStatus: {
      preciseRegistryEntrySelection: "WIRED",
      linkedReferenceHydration: "WIRED",
      directSelfReferenceExclusion: "WIRED",
      sameRegistrySiblingReference: "WIRED",
      canonicalReferencePersistence: "WIRED",
    },

    visualWiringStatus: {
      registryTitlePresentation: "WIRED",
      legacyRegistryReferenceRecovery: "WIRED",
      missingRegistryEntryRecovery: "WIRED",
      unavailableReferenceRecovery: "WIRED",
    },

    structuredRegistryBuilderProps: {
      relationshipGroups,

      onOpenLinkPicker:
        callbackSource.onOpenLinkPicker || null,

      onSelectLinkedReference:
        callbackSource.onSelectLinkedReference || null,

      onRemoveLinkedReference:
        callbackSource.onRemoveLinkedReference || null,

      onLinkedReferenceNotesChange:
        callbackSource.onLinkedReferenceNotesChange || null,
    },

    architecture: {
      linkedCreationLoadingOwnedByChassis: true,
      pickerSearchOwnedByChassis: true,
      referenceMutationOwnedByChassis: true,
      relationshipPersistenceOwnedByChassis: true,
      authoritativeGraphResolutionOwnedByChassis: true,
      directSelfReferenceValidationOwnedByChassis: true,
      preciseReferencePresentationOwnedByFe: true,
      degradedReferencePresentationOwnedByFe: true,
    },
  };
}
