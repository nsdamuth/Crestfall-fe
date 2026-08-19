export const ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION =
  "item_equipment_modifier_reference.presentation.v1";

export const ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION =
  "item_equipment_modifier_reference_v0";

export const ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT = 16;

export const ITEM_EQUIPMENT_MODIFIER_REFERENCE_CALLBACK_KEYS = Object.freeze([
  "onAddReference",
  "onUpdateReference",
  "onRemoveReference",
]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeIdentifier(value, fallback = "") {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || fallback;
}

function normalizeStacks(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed)
    ? Math.min(1000, Math.max(1, parsed))
    : 1;
}

export function normalizeItemEquipmentModifierReference(
  value = {},
  index = 0
) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};

  return {
    referenceVersion: ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION,
    id: normalizeIdentifier(
      source.id,
      `equipment_modifier_${index + 1}`
    ),
    enabled: source.enabled !== false,
    statsPoolsBindingId: normalizeIdentifier(
      source.statsPoolsBindingId ||
        source.stats_pools_binding_id ||
        source.bindingId ||
        source.binding_id,
      "stats"
    ),
    modifierDefinitionId: normalizeIdentifier(
      source.modifierDefinitionId ||
        source.modifier_definition_id ||
        source.definitionId ||
        source.definition_id
    ),
    stacks: normalizeStacks(source.stacks),
    metadata:
      source.metadata &&
      typeof source.metadata === "object" &&
      !Array.isArray(source.metadata)
        ? { ...source.metadata }
        : {},
  };
}

export function projectItemEquipmentModifierReferencesPresentation({
  references = [],
  maxReferences = ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
} = {}) {
  const normalizedLimit = Math.min(
    ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
    Math.max(0, Number.parseInt(maxReferences, 10) || 0)
  );
  const normalizedReferences = (Array.isArray(references) ? references : [])
    .slice(0, normalizedLimit)
    .map(normalizeItemEquipmentModifierReference);

  return {
    contractVersion:
      ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,
    title: "Equipment Effects",
    description:
      "Optionally activate existing Stats & Pools modifiers while this item is equipped. The Item Registry stores references only; modifier definitions remain owned by Stats & Pools.",
    referenceContractVersion:
      ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION,
    maxReferences: normalizedLimit,
    references: normalizedReferences,
    summary: {
      referenceCount: normalizedReferences.length,
      enabledReferenceCount: normalizedReferences.filter(
        (reference) => reference.enabled
      ).length,
      canAdd: normalizedReferences.length < normalizedLimit,
      isEmpty: normalizedReferences.length === 0,
    },
    emptyState:
      "No equipment modifier references. This item keeps normal Item Runtime behavior with no Stats & Pools effect.",
  };
}
