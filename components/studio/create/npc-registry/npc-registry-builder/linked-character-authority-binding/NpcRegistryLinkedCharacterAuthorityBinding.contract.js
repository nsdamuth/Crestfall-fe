import {
  NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../NpcRegistryBuilder.contract.js";

export const NPC_REGISTRY_LINKED_CHARACTER_AUTHORITY_BINDING_CONTRACT_VERSION =
  "npc_registry_linked_character_authority_binding_v1";

export const NPC_REGISTRY_ENTRY_KINDS = Object.freeze({
  AD_HOC: "AD_HOC",
  CREATION_REF: "CREATION_REF",
});

export const NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES = Object.freeze({
  RESOLVED: "RESOLVED",
  UNAVAILABLE: "UNAVAILABLE",
});

export const NPC_REGISTRY_CREATION_REF_CANONICAL_FIELDS = Object.freeze([
  "id",
  "kind",
  "notes",
  "creationId",
  "creationType",
]);

export const NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS =
  Object.freeze([
    "name",
    "hydratedCharacter",
    "hydrated_character",
    "actorMechanicsProfileAttachmentContractVersion",
    "actorMechanicsProfileId",
    "actorMechanicsProfileLink",
    "actor_mechanics_profile_attachment_contract_version",
    "actor_mechanics_profile_id",
    "actor_mechanics_profile_link",
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

function normalizeKind(value) {
  return upper(value) === NPC_REGISTRY_ENTRY_KINDS.CREATION_REF
    ? NPC_REGISTRY_ENTRY_KINDS.CREATION_REF
    : NPC_REGISTRY_ENTRY_KINDS.AD_HOC;
}

function normalizeReferenceStatus(value, kind) {
  if (kind !== NPC_REGISTRY_ENTRY_KINDS.CREATION_REF) {
    return "";
  }

  return upper(value) ===
    NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.UNAVAILABLE
    ? NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.UNAVAILABLE
    : NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.RESOLVED;
}

function mechanicsAttachment(entry = {}) {
  const source = object(entry);
  const link =
    object(
      source.actorMechanicsProfileLink ||
        source.actor_mechanics_profile_link
    );

  const creationId = text(
    source.actorMechanicsProfileId ||
      source.actor_mechanics_profile_id ||
      link.creationId ||
      link.creation_id
  );

  if (!creationId) return null;

  return {
    creationId,
    title:
      text(link.title) ||
      creationId,
    presetId:
      text(link.presetId || link.preset_id),
    ownerType:
      text(link.ownerType || link.owner_type),
    enabledDomains:
      array(
        link.enabledDomains ||
          link.enabled_domains
      )
        .map(upper)
        .filter(Boolean),
  };
}

function canonicalEntryById(registry = {}) {
  return new Map(
    array(object(registry).entries)
      .filter((entry) => text(entry?.id))
      .map((entry) => [
        text(entry.id),
        object(entry),
      ])
  );
}

function auditCanonicalCreationRef(entry = {}) {
  const source = object(entry);

  const forbiddenFieldsPresent =
    NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS
      .filter(
        (field) =>
          Object.prototype.hasOwnProperty.call(
            source,
            field
          ) &&
          source[field] !== undefined &&
          source[field] !== null &&
          source[field] !== ""
      );

  const missingRequiredFields = [];

  if (!text(source.id)) {
    missingRequiredFields.push("id");
  }

  if (!text(source.creationId)) {
    missingRequiredFields.push("creationId");
  }

  if (!text(source.creationType)) {
    missingRequiredFields.push("creationType");
  }

  return {
    canonical:
      forbiddenFieldsPresent.length === 0 &&
      missingRequiredFields.length === 0,

    forbiddenFieldsPresent,
    missingRequiredFields,
  };
}

function projectDisplayEntry({
  hydratedEntry = {},
  canonicalEntry = {},
} = {}) {
  const hydrated = object(hydratedEntry);
  const canonical = object(canonicalEntry);

  const kind =
    normalizeKind(
      canonical.kind ||
      hydrated.kind
    );

  if (kind === NPC_REGISTRY_ENTRY_KINDS.CREATION_REF) {
    const referenceStatus =
      normalizeReferenceStatus(
        hydrated.referenceStatus,
        kind
      );

    const hydratedCharacter =
      object(
        hydrated.hydratedCharacter ||
        hydrated.hydrated_character
      );

    const displayName =
      referenceStatus ===
      NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.UNAVAILABLE
        ? "Linked Character unavailable"
        : (
            text(hydratedCharacter.title) ||
            text(hydrated.name) ||
            "Linked Character"
          );

    const copiedDescriptionDetected =
      Boolean(
        text(canonical.notes) &&
        text(hydratedCharacter.description) &&
        text(canonical.notes) ===
          text(hydratedCharacter.description)
      );

    return {
      id:
        text(canonical.id || hydrated.id),
      kind:
        NPC_REGISTRY_ENTRY_KINDS.CREATION_REF,

      creationId:
        text(
          canonical.creationId ||
          hydrated.creationId
        ),

      creationType:
        upper(
          canonical.creationType ||
          hydrated.creationType
        ) ||
        "CHARACTER",

      name:
        displayName,

      notes:
        text(canonical.notes),

      referenceStatus,

      hydratedCharacter:
        referenceStatus ===
          NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.RESOLVED
          ? {
              id:
                text(hydratedCharacter.id) ||
                text(
                  canonical.creationId ||
                  hydrated.creationId
                ),
              title:
                displayName,
              subtitle:
                text(hydratedCharacter.subtitle),
              description:
                text(hydratedCharacter.description),
              imageUrl:
                text(hydratedCharacter.imageUrl),
              contentRating:
                text(hydratedCharacter.contentRating) ||
                "SFW",
              visibility:
                text(hydratedCharacter.visibility) ||
                "PRIVATE",
              status:
                text(hydratedCharacter.status) ||
                "DRAFT",
            }
          : null,

      mechanicsPresentation: {
        source:
          "LINKED_CHARACTER_CREATION",
        editableOnRegistryEntry:
          false,
        label:
          "Mechanics follow the linked Character creation.",
      },

      recovery:
        referenceStatus ===
        NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.UNAVAILABLE
          ? {
              degraded: true,
              tone: "ERROR",
              title:
                "Linked Character unavailable",
              message:
                "The NPC Registry preserves the linked Character Creation ID, but the Character is not currently available. Relink or remove the entry deliberately rather than replacing it with stale copied Character data.",
            }
          : null,

      canonicalAudit:
        auditCanonicalCreationRef(canonical),

      migrationObservation: {
        copiedCharacterDescriptionDetected:
          copiedDescriptionDetected,
        message:
          copiedDescriptionDetected
            ? "The Registry-local notes currently duplicate the hydrated Character description. Chassis serialization should omit that copied description unless the creator intentionally authored it as Registry-local notes."
            : "",
      },
    };
  }

  const attachment =
    mechanicsAttachment(
      canonical
    ) ||
    mechanicsAttachment(
      hydrated
    );

  return {
    id:
      text(canonical.id || hydrated.id),
    kind:
      NPC_REGISTRY_ENTRY_KINDS.AD_HOC,
    creationId: "",
    creationType: "",
    name:
      text(canonical.name || hydrated.name) ||
      "Unnamed NPC",
    notes:
      text(canonical.notes),
    referenceStatus: "",
    hydratedCharacter: null,

    actorMechanicsProfileAttachment:
      attachment,

    mechanicsPresentation: {
      source:
        attachment
          ? "REGISTRY_ENTRY_ATTACHMENT"
          : "NONE",
      editableOnRegistryEntry:
        true,
      label:
        attachment
          ? `Actor Mechanics: ${attachment.title}`
          : "Actor Mechanics: Default NPC preset",
    },

    recovery: null,
    canonicalAudit: {
      canonical: true,
      forbiddenFieldsPresent: [],
      missingRequiredFields: [],
    },
    migrationObservation: {
      copiedCharacterDescriptionDetected:
        false,
      message: "",
    },
  };
}

export function projectNpcRegistryLinkedCharacterAuthorityBinding({
  canonicalRegistry = {},
  hydratedRegistry = {},
  characterLoadError = "",
} = {}) {
  const canonical =
    object(canonicalRegistry);
  const hydrated =
    object(hydratedRegistry);

  const canonicalById =
    canonicalEntryById(canonical);

  const hydratedEntries =
    array(hydrated.entries);

  const displayEntries =
    hydratedEntries.map(
      (hydratedEntry) =>
        projectDisplayEntry({
          hydratedEntry,
          canonicalEntry:
            canonicalById.get(
              text(hydratedEntry?.id)
            ) || {},
        })
    );

  const seenDisplayIds =
    new Set(
      displayEntries.map(
        (entry) => entry.id
      )
    );

  for (const canonicalEntry of
    array(canonical.entries)) {
    const id =
      text(canonicalEntry?.id);

    if (
      !id ||
      seenDisplayIds.has(id)
    ) {
      continue;
    }

    displayEntries.push(
      projectDisplayEntry({
        hydratedEntry:
          canonicalEntry,
        canonicalEntry,
      })
    );
  }

  const linkedEntries =
    displayEntries.filter(
      (entry) =>
        entry.kind ===
        NPC_REGISTRY_ENTRY_KINDS.CREATION_REF
    );

  const adHocEntries =
    displayEntries.filter(
      (entry) =>
        entry.kind ===
        NPC_REGISTRY_ENTRY_KINDS.AD_HOC
    );

  const unavailableEntries =
    linkedEntries.filter(
      (entry) =>
        entry.referenceStatus ===
        NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES.UNAVAILABLE
    );

  const canonicalViolations =
    linkedEntries
      .filter(
        (entry) =>
          !entry.canonicalAudit.canonical
      )
      .map((entry) => ({
        entryId: entry.id,
        forbiddenFieldsPresent:
          entry.canonicalAudit.forbiddenFieldsPresent,
        missingRequiredFields:
          entry.canonicalAudit.missingRequiredFields,
      }));

  const copiedDescriptionObservations =
    linkedEntries
      .filter(
        (entry) =>
          entry.migrationObservation
            .copiedCharacterDescriptionDetected
      )
      .map((entry) => ({
        entryId: entry.id,
        message:
          entry.migrationObservation.message,
      }));

  return {
    bindingContractVersion:
      NPC_REGISTRY_LINKED_CHARACTER_AUTHORITY_BINDING_CONTRACT_VERSION,

    npcRegistryBuilderViewContractVersion:
      NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,

    persistenceContract: {
      authority:
        "CHASSIS",

      creationRefCanonicalFields:
        [
          ...NPC_REGISTRY_CREATION_REF_CANONICAL_FIELDS,
        ],

      creationRefForbiddenPersistedFields:
        [
          ...NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS,
        ],

      creationRefRule:
        "A linked Character NPC Registry entry persists stable Character identity and Registry-local notes only. Current Character display data is hydrated for editing and is not duplicated into Registry authority.",

      adHocRule:
        "A lightweight AD_HOC NPC remains Registry-owned and may persist its authored name, notes, and optional Actor Mechanics Profile attachment.",

      canonicalViolations,
      copiedDescriptionObservations,
    },

    displayRegistry: {
      ...hydrated,
      ...canonical,
      entries:
        displayEntries,
    },

    summary: {
      entryCount:
        displayEntries.length,
      linkedCharacterCount:
        linkedEntries.length,
      adHocCount:
        adHocEntries.length,
      unavailableLinkedCharacterCount:
        unavailableEntries.length,
      canonicalViolationCount:
        canonicalViolations.length,
      copiedDescriptionObservationCount:
        copiedDescriptionObservations.length,
    },

    characterLoadError:
      text(characterLoadError),

    functionalWiringStatus: {
      canonicalSerialization:
        "WIRED",
      linkedCharacterHydration:
        "WIRED",
      linkedCharacterMechanicsAuthority:
        "WIRED",
      adHocRegistryOwnership:
        "WIRED",
    },

    visualExtensionStatus: {
      linkedCharacterHydratedDisplay:
        "WIRED",

      unavailableReferenceRecovery:
        unavailableEntries.length > 0
          ? "WIRED"
          : "AVAILABLE_WHEN_DEGRADED",

      canonicalPersistenceAudit:
        canonicalViolations.length > 0
          ? "CHASSIS_CORRECTION_REQUIRED"
          : "CANONICAL",
    },

    architecture: {
      canonicalEntrySerializationOwnedByChassis: true,
      characterCandidateLoadingOwnedByChassis: true,
      linkedCharacterHydrationOwnedByChassis: true,
      characterReferenceMutationOwnedByChassis: true,
      registryPersistenceOwnedByChassis: true,
      linkedCharacterDisplayProjectionOwnedByFe: true,
      unavailableReferencePresentationOwnedByFe: true,
      adHocNpcPresentationOwnedByFe: true,
    },
  };
}
