import {
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  normalizeItemEquipmentModifierReference,
} from "./item-equipment-modifier-references/ItemEquipmentModifierReferences.contract.js";
import {
  ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
  normalizeItemOperationEffectReference,
  normalizeItemOperationRequirementSet,
} from "./item-operation-authoring/ItemOperationAuthoring.contract.js";

export const ITEM_REGISTRY_KIND =
  "ITEM_REGISTRY";

export const ITEM_REGISTRY_VERSION =
  "1.2";

export const ITEM_ROLE_OPTIONS = [
  "SIGNATURE_OBJECT",
  "INVENTORY_ITEM",
  "CONSUMABLE",
  "EQUIPMENT",
  "WEAPON",
  "WARDROBE_SET",
  "QUEST_OBJECT",
  "LOCATION_PROP",
  "FACTION_CACHE",
  "MEMORY_OBJECT",
  "CURRENCY_RESOURCE",
];

export const ITEM_CATEGORY_OPTIONS = [
  "General",
  "Weapon",
  "Armor",
  "Clothing / Wardrobe",
  "Tool",
  "Document",
  "Key / Access",
  "Evidence",
  "Relic / Artifact",
  "Consumable",
  "Resource",
  "Vehicle / Transport",
  "Furniture / Decor",
  "Technology",
  "Other",
];

export const DEFAULT_PLACEMENT_OPTIONS = [
  "CARRIED",
  "STORED",
  "DISPLAYED",
  "HIDDEN",
  "LOCATION_BOUND",
  "FACTION_CONTROLLED",
  "CONDITIONAL",
  "UNKNOWN",
];

export const QUANTITY_MODE_OPTIONS = [
  "UNIQUE",
  "COUNTED",
  "ABSTRACT",
  "UNLIMITED",
  "UNKNOWN",
];

export const CONSUMPTION_MODE_OPTIONS = [
  "NONE",
  "CONSUMABLE",
  "AMMO_RESOURCE",
  "CHARGES",
];

export const DURABILITY_MODE_OPTIONS = [
  "NONE",
  "CONDITION_PERCENT",
  "BROKEN_REPAIRABLE",
];

export const ITEM_STARTING_HOLDER_TYPE_OPTIONS = [
  "UNASSIGNED",
  "STORY",
  "CHARACTER",
  "PLAYER_CHARACTER",
  "LOCATION",
];

export const ITEM_PLACEMENT_SPECIFICITY_OPTIONS = [
  "UNSPECIFIED",
  "EXPLICIT",
];

export const ITEM_PLACEMENT_STEP_KIND_OPTIONS = [
  "COLLECTION",
  "CARRY_STATE",
  "STORAGE_STATE",
  "CONTAINER",
  "AREA",
  "SURFACE",
  "SLOT",
  "CUSTOM",
];

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeUpper(
  value,
  fallback = ""
) {
  return (
    normalizeString(value)
      .toUpperCase() ||
    fallback
  );
}

function normalizeArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

export function createRegistryId(
  prefix = "item"
) {
  return `${prefix}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function normalizeListText(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToText(value) {
  return Array.isArray(value)
    ? value.join("\n")
    : "";
}

export function normalizePlacementKey(
  value
) {
  return normalizeString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function createEmptyItemPlacementStep({
  kind = "CUSTOM",
  label = "",
} = {}) {
  const safeLabel =
    normalizeString(label);

  return {
    id:
      createRegistryId(
        "placement"
      ),

    kind:
      normalizeUpper(
        kind,
        "CUSTOM"
      ),

    key:
      normalizePlacementKey(
        safeLabel
      ),

    label:
      safeLabel,
  };
}

export function normalizeItemPlacementStep(
  value = {}
) {
  const source =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? value
      : {};

  const existingId =
    normalizeString(source.id);

  const label =
    normalizeString(
      source.label ||
        source.title ||
        source.name
    );

  // Blank rows created in the editor retain
  // their ID while the creator is typing.
  // Completely empty legacy values are dropped.
  if (!existingId && !label) {
    return null;
  }

  const requestedKind =
    normalizeUpper(
      source.kind ||
        source.type,
      "CUSTOM"
    );

  const safeKind =
    ITEM_PLACEMENT_STEP_KIND_OPTIONS.includes(
      requestedKind
    )
      ? requestedKind
      : "CUSTOM";

  return {
    id:
      existingId ||
      createRegistryId(
        "placement"
      ),

    kind:
      safeKind,

    key:
      normalizePlacementKey(
        source.key ||
          label
      ),

    label,
  };
}

export function createEmptyItemPlacement() {
  return {
    specificity:
      "UNSPECIFIED",

    path: [],

    note: "",
  };
}

export function normalizeItemPlacement(
  value = {},
  {
    legacyPlacementNote = "",
  } = {}
) {
  const source =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? value
      : {};

  const path =
    normalizeArray(
      source.path ||
        source.steps ||
        source.placementPath ||
        source.placement_path
    )
      .map(
        normalizeItemPlacementStep
      )
      .filter(Boolean)
      .slice(0, 16);

  const note =
    normalizeString(
      source.note ||
        source.placementNote ||
        source.placement_note ||
        legacyPlacementNote
    );

  const requestedSpecificity =
    normalizeUpper(
      source.specificity,
      ""
    );

  const specificity =
    requestedSpecificity ===
      "EXPLICIT" ||
    path.length > 0 ||
    Boolean(note)
      ? "EXPLICIT"
      : "UNSPECIFIED";

  if (
    specificity ===
    "UNSPECIFIED"
  ) {
    return createEmptyItemPlacement();
  }

  return {
    specificity:
      "EXPLICIT",

    path,

    note,
  };
}

export function createEmptyItemStartingAssignment() {
  return {
    holderType:
      "UNASSIGNED",

    holderCreationId:
      null,

    holderCreationType:
      null,

    holderTitle:
      "",

    placement:
      createEmptyItemPlacement(),

    // Retained for backward compatibility
    // with the current runtime hydrator.
    placementNote:
      "",
  };
}

export function itemStartingHolderUsesCreation(
  holderType
) {
  return [
    "CHARACTER",
    "PLAYER_CHARACTER",
    "LOCATION",
  ].includes(
    normalizeUpper(
      holderType
    )
  );
}

export function normalizeItemStartingAssignment(
  value = {}
) {
  const source =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? value
      : {};

  const requestedHolderType =
    normalizeUpper(
      source.holderType ||
        source.holder_type,
      "UNASSIGNED"
    );

  const holderType =
    ITEM_STARTING_HOLDER_TYPE_OPTIONS.includes(
      requestedHolderType
    )
      ? requestedHolderType
      : "UNASSIGNED";

  const usesCreation =
    itemStartingHolderUsesCreation(
      holderType
    );

  const placement =
    normalizeItemPlacement(
      source.placement ||
        source.itemPlacement ||
        source.item_placement,
      {
        legacyPlacementNote:
          source.placementNote ||
          source.placement_note,
      }
    );

  return {
    holderType,

    holderCreationId:
      usesCreation
        ? normalizeString(
            source.holderCreationId ||
              source.holder_creation_id ||
              source.creationId ||
              source.creation_id
          ) || null
        : null,

    holderCreationType:
      usesCreation
        ? normalizeUpper(
            source.holderCreationType ||
              source.holder_creation_type ||
              source.creationType ||
              source.creation_type,
            holderType
          )
        : null,

    holderTitle:
      holderType ===
      "UNASSIGNED"
        ? ""
        : holderType ===
            "STORY"
          ? normalizeString(
              source.holderTitle ||
                source.holder_title
            ) ||
            "Story Inventory"
          : normalizeString(
              source.holderTitle ||
                source.holder_title ||
                source.title
            ),

    placement,

    // Mirror the new note into the old field
    // until the runtime migration is applied.
    placementNote:
      placement.note,
  };
}

export function createEmptyItemEntry() {
  return {
    id:
      createRegistryId("item"),

    name: "",

    aliases: [],

    role:
      "SIGNATURE_OBJECT",

    category:
      "General",

    description: "",

    visualDescription: "",

    symbolicMeaning: "",

    defaultPlacement:
      "UNKNOWN",

    availabilityRule: "",

    quantityMode:
      "UNIQUE",

    startingQuantity: "",

    consumptionMode:
      "NONE",

    durabilityMode:
      "NONE",

    conditionPercent: "",

    doNotHallucinateAvailability:
      true,

    startingAssignment:
      createEmptyItemStartingAssignment(),

    ownershipNotes: "",

    locationNotes: "",

    promptGuidance: "",

    negativePromptNotes: "",

    linkedCreations: [],

    equipmentModifierReferences: [],

    operationRequirementSets: [],

    operationEffectReferences: [],
  };
}

export function createEmptyItemRegistryData() {
  return {
    registry_kind:
      ITEM_REGISTRY_KIND,

    registry_version:
      ITEM_REGISTRY_VERSION,

    scope: "",

    entries: [],

    associations: [],

    tracking_rules: [],

    prompt_guidance: {
      summary: "",
      usageNotes: "",
      negativePromptNotes: "",
    },

    middleware_hints: {
      intendedUse: [
        "inventory_state",
        "signature_objects",
        "image_generation_props",
      ],

      strictness:
        "guided",

      allowRuntimeMutation:
        true,
    },

    builder:
      "ITEM_REGISTRY_BUILDER",

    builder_version:
      "1.2",
  };
}

export function normalizeItemEntry(
  entry = {}
) {
  const source =
    entry &&
    typeof entry === "object" &&
    !Array.isArray(entry)
      ? entry
      : {};

  return {
    ...createEmptyItemEntry(),
    ...source,

    id:
      source.id ||
      createRegistryId("item"),

    aliases:
      normalizeArray(
        source.aliases
      )
        .map(normalizeString)
        .filter(Boolean),

    startingAssignment:
      normalizeItemStartingAssignment(
        source.startingAssignment ||
          source.starting_assignment
      ),

    linkedCreations:
      normalizeArray(
        source.linkedCreations ||
          source.linked_creations
      ),

    equipmentModifierReferences:
      normalizeArray(
        source.equipmentModifierReferences ||
          source.equipment_modifier_references ||
          source.equippedModifierReferences ||
          source.equipped_modifier_references
      )
        .slice(0, ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT)
        .map(normalizeItemEquipmentModifierReference),

    operationRequirementSets:
      normalizeArray(
        source.operationRequirementSets ||
          source.operation_requirement_sets
      )
        .slice(0, ITEM_OPERATION_REQUIREMENT_SET_LIMIT)
        .map(normalizeItemOperationRequirementSet),

    operationEffectReferences:
      normalizeArray(
        source.operationEffectReferences ||
          source.operation_effect_references
      )
        .slice(0, ITEM_OPERATION_EFFECT_REFERENCE_LIMIT)
        .map(normalizeItemOperationEffectReference),

    doNotHallucinateAvailability:
      source
        .doNotHallucinateAvailability !==
      false,
  };
}

export function normalizeItemRegistryData(
  data = {}
) {
  const source =
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
      ? data
      : {};

  const base =
    createEmptyItemRegistryData();

  return {
    ...base,
    ...source,

    registry_kind:
      ITEM_REGISTRY_KIND,

    registry_version:
      ITEM_REGISTRY_VERSION,

    entries:
      normalizeArray(
        source.entries
      ).map(
        normalizeItemEntry
      ),

    associations:
      normalizeArray(
        source.associations
      ),

    tracking_rules:
      normalizeArray(
        source.tracking_rules
      ),

    prompt_guidance: {
      ...base.prompt_guidance,

      ...(
        source.prompt_guidance ||
        {}
      ),
    },

    middleware_hints: {
      ...base.middleware_hints,

      ...(
        source.middleware_hints ||
        {}
      ),
    },

    builder:
      "ITEM_REGISTRY_BUILDER",

    builder_version:
      "1.2",
  };
}

export function buildItemRegistryCreationPayload({
  title,
  description,
  data,
}) {
  return {
    type:
      ITEM_REGISTRY_KIND,

    title:
      String(
        title ||
        "Untitled Item Registry"
      ).trim(),

    description:
      String(
        description ||
        ""
      ).trim(),

    visibility:
      "PRIVATE",

    status:
      "DRAFT",

    contentRating:
      "SFW",

    canonStatus:
      "NONE",

    data:
      normalizeItemRegistryData(
        data
      ),
  };
}