import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../LocationRegistryBuilder.contract.js";

export const LOCATION_REGISTRY_PRESENCE_DUAL_AUTHORITY_BINDING_CONTRACT_VERSION =
  "location_registry_presence_dual_authority_binding_v1";

export const LOCATION_REGISTRY_PRESENCE_PERSON_KINDS = Object.freeze({
  CREATION_REF: "CREATION_REF",
  NPC_REGISTRY_ENTRY: "NPC_REGISTRY_ENTRY",
  LEGACY_NPC_REGISTRY_ENTRY:
    "LEGACY_NPC_REGISTRY_ENTRY",
});

export const LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES = Object.freeze({
  RESOLVED: "RESOLVED",
  UNRESOLVED: "UNRESOLVED",
  UNAVAILABLE: "UNAVAILABLE",
  LEGACY_UNRESOLVED: "LEGACY_UNRESOLVED",
});

export const LOCATION_REGISTRY_PRESENCE_CALLBACK_KEYS = Object.freeze([
  "onApplyCharacter",
  "onApplyNpcEntry",
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

function normalizedReferenceStatus(person = {}) {
  const status =
    upper(person.referenceStatus);

  if (
    Object.values(
      LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES
    ).includes(status)
  ) {
    return status;
  }

  return text(person.displayName)
    ? LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.RESOLVED
    : LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.UNRESOLVED;
}

function normalizedPersonKind(person = {}) {
  const kind = upper(person.kind);

  if (
    Object.values(
      LOCATION_REGISTRY_PRESENCE_PERSON_KINDS
    ).includes(kind)
  ) {
    return kind;
  }

  if (
    text(person.registryCreationId) ||
    text(person.registryEntryId)
  ) {
    return LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.NPC_REGISTRY_ENTRY;
  }

  return LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.CREATION_REF;
}

function selectedCharacterId(person = {}) {
  return normalizedPersonKind(person) ===
      LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.CREATION_REF
    ? text(person.creationId)
    : "";
}

function selectedNpcEntryId(person = {}) {
  const kind =
    normalizedPersonKind(person);

  if (
    kind !==
      LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.NPC_REGISTRY_ENTRY &&
    kind !==
      LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.LEGACY_NPC_REGISTRY_ENTRY
  ) {
    return "";
  }

  const registryCreationId =
    text(person.registryCreationId);
  const registryEntryId =
    text(person.registryEntryId);

  return registryCreationId &&
    registryEntryId
    ? `${registryCreationId}:${registryEntryId}`
    : "";
}

function selectedPersonSubtitle(person = {}) {
  const kind =
    normalizedPersonKind(person);

  if (
    kind ===
      LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.NPC_REGISTRY_ENTRY ||
    kind ===
      LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.LEGACY_NPC_REGISTRY_ENTRY
  ) {
    const registryTitle =
      text(person.registryTitle) ||
      "NPC Registry";

    const entryKind =
      upper(person.entryKind);

    const entryLabel =
      entryKind === "AD_HOC"
        ? "Lightweight NPC"
        : "Linked Character Entry";

    return `${registryTitle} · ${entryLabel}`;
  }

  return "Character";
}

function selectedPersonRecovery(person = {}) {
  const status =
    normalizedReferenceStatus(person);

  if (
    status ===
    LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.LEGACY_UNRESOLVED
  ) {
    return {
      degraded: true,
      tone: "WARNING",
      title:
        "Legacy NPC Registry reference unavailable",
      message:
        "The stored legacy NPC Registry reference is preserved, but its current Registry entry could not be resolved. Select a current Character or NPC Registry entry to repair the binding when appropriate.",
    };
  }

  if (
    status ===
    LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.UNAVAILABLE
  ) {
    const registryReference =
      Boolean(
        text(person.registryCreationId) ||
        text(person.registryEntryId)
      );

    return {
      degraded: true,
      tone: "ERROR",
      title:
        registryReference
          ? "NPC Registry entry unavailable"
          : "Linked Character unavailable",
      message:
        registryReference
          ? "The stored NPC Registry entry identity is preserved, but the referenced entry is not currently available."
          : "The stored Character UUID is preserved, but the referenced Character is not currently available.",
    };
  }

  if (
    status ===
    LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.UNRESOLVED
  ) {
    return {
      degraded: false,
      tone: "NEUTRAL",
      title:
        "Character selection required",
      message:
        "Choose either a full Character or a stable NPC Registry entry for this presence rule.",
    };
  }

  return null;
}

function projectCharacterOption(option = {}) {
  const source = object(option);

  return {
    id: text(source.id),
    type: "CHARACTER",
    title:
      text(source.title) ||
      "Untitled Character",
    subtitle:
      text(source.subtitle) ||
      "Character",
    description:
      text(source.description),
    imageUrl:
      text(source.imageUrl),
    contentRating:
      text(source.contentRating) ||
      "SFW",
    visibility:
      text(source.visibility) ||
      "PRIVATE",
    status:
      text(source.status) ||
      "DRAFT",
  };
}

function projectNpcEntryOption(option = {}) {
  const source = object(option);
  const entryKind =
    upper(source.entryKind) ===
    "CREATION_REF"
      ? "CREATION_REF"
      : "AD_HOC";

  const registryTitle =
    text(source.registryTitle) ||
    "NPC Registry";

  const title =
    text(
      source.displayName ||
      source.title
    ) ||
    "Untitled NPC";

  return {
    id:
      text(source.id) ||
      (
        text(source.registryCreationId) &&
        text(source.registryEntryId)
          ? `${text(source.registryCreationId)}:${text(source.registryEntryId)}`
          : ""
      ),

    title,

    subtitle:
      `${registryTitle} · ${
        entryKind === "CREATION_REF"
          ? "Linked Character"
          : "Lightweight NPC"
      }`,

    description:
      text(source.description),

    imageUrl:
      text(source.imageUrl),

    contentRating:
      text(source.contentRating) ||
      "SFW",

    type:
      entryKind === "CREATION_REF"
        ? upper(source.creationType) ||
          "CHARACTER"
        : "LIGHTWEIGHT_NPC",

    registryCreationId:
      text(source.registryCreationId),

    registryEntryId:
      text(source.registryEntryId),

    registryTitle,

    entryKind,

    creationId:
      text(source.creationId),

    creationType:
      upper(source.creationType),

    aliases:
      array(source.aliases)
        .map(text)
        .filter(Boolean),
  };
}

export function projectLocationRegistryPresenceDualAuthorityBinding({
  presenceBindingDraft = {},
  characterOptions = [],
  npcEntryOptions = [],
  disabledCharacterIds = [],
  disabledNpcEntryIds = [],
  characterLoadError = "",
  npcEntryLoadError = "",
  callbacks = {},
} = {}) {
  const draft =
    object(presenceBindingDraft);
  const person =
    object(draft.person);
  const callbackSource =
    object(callbacks);

  const kind =
    normalizedPersonKind(person);
  const referenceStatus =
    normalizedReferenceStatus(person);

  const projectedCharacterOptions =
    array(characterOptions)
      .map(projectCharacterOption)
      .filter((option) => option.id);

  const projectedNpcEntryOptions =
    array(npcEntryOptions)
      .map(projectNpcEntryOption)
      .filter(
        (option) =>
          option.id &&
          option.registryCreationId &&
          option.registryEntryId
      );

  const selectedCharacter =
    selectedCharacterId(person);

  const selectedNpcEntry =
    selectedNpcEntryId(person);

  const displayName =
    text(person.displayName) ||
    (
      referenceStatus ===
      LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.LEGACY_UNRESOLVED
        ? "Legacy NPC Registry reference unavailable"
        : referenceStatus ===
          LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES.UNAVAILABLE
          ? (
              selectedNpcEntry
                ? "NPC Registry entry unavailable"
                : "Linked Character unavailable"
            )
          : "Character selection required"
    );

  return {
    bindingContractVersion:
      LOCATION_REGISTRY_PRESENCE_DUAL_AUTHORITY_BINDING_CONTRACT_VERSION,

    locationRegistryBuilderViewContractVersion:
      LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,

    selectedPerson: {
      visible:
        Boolean(
          text(person.displayName) ||
          selectedCharacter ||
          selectedNpcEntry
        ),
      displayName,
      subtitle:
        selectedPersonSubtitle(person),
      kind,
      entryKind:
        upper(person.entryKind),
      creationId:
        text(person.creationId),
      creationType:
        upper(person.creationType),
      registryCreationId:
        text(person.registryCreationId),
      registryEntryId:
        text(person.registryEntryId),
      registryTitle:
        text(person.registryTitle),
      contentRating:
        text(person.contentRating),
      visibility:
        text(person.visibility),
      status:
        text(person.status),
      referenceStatus,
      recovery:
        selectedPersonRecovery(person),
    },

    pickerSections: {
      character: {
        eyebrow: "Character",
        description:
          "Select a full Character directly. The Location Registry stores the Character UUID and the authored presence rule.",
        pageSize: 12,
        searchPlaceholder:
          "Search Character creations...",
        emptyMessage:
          "No Character creations were found.",
        options:
          projectedCharacterOptions,
        selectedIds:
          selectedCharacter
            ? [selectedCharacter]
            : [],
        disabledIds:
          array(disabledCharacterIds)
            .map(text)
            .filter(Boolean),
        loadError:
          text(characterLoadError),
        callback:
          callbackSource.onApplyCharacter ||
          null,
      },

      npcRegistry: {
        eyebrow:
          "NPC Registry",
        description:
          "Select a stable NPC Registry entry. Lightweight / ad-hoc NPCs stay registry-owned and do not need to become Character creations.",
        pageSize: 12,
        searchPlaceholder:
          "Search NPC Registry entries...",
        emptyMessage:
          "No NPC Registry entries were found.",
        options:
          projectedNpcEntryOptions,
        selectedIds:
          selectedNpcEntry
            ? [selectedNpcEntry]
            : [],
        disabledIds:
          array(disabledNpcEntryIds)
            .map(text)
            .filter(Boolean),
        loadError:
          text(npcEntryLoadError),
        callback:
          callbackSource.onApplyNpcEntry ||
          null,
      },
    },

    authority: {
      directCharacterKind:
        LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.CREATION_REF,
      registryEntryKind:
        LOCATION_REGISTRY_PRESENCE_PERSON_KINDS.NPC_REGISTRY_ENTRY,
      lightweightAdHocNpcRegistryEntriesSelectable:
        true,
      linkedCharacterNpcRegistryEntriesSelectable:
        true,
      playerCharacterNpcRegistryEntriesExpectedFromChassis:
        false,
      candidateLoadingOwnedByChassis:
        true,
      hydrationOwnedByChassis:
        true,
      identityDuplicateGuardOwnedByChassis:
        true,
      persistenceOwnedByChassis:
        true,
    },

    applicationWiringStatus: {
      sharedLocationRegistryFoundation: "WIRED",
      characterCandidateLoading: "WIRED",
      npcRegistryEntryCandidateLoading: "WIRED",
      presenceHydration: "WIRED",
      identityDuplicateGuard: "WIRED",
      persistenceMutation: "WIRED",
    },

    visualExtensionStatus: {
      dualCharacterAndNpcRegistryPicker: "WIRED",
      selectedPersonCard: "WIRED",
      degradedReferenceRecovery: "WIRED",
    },

    callbacks: {
      onApplyCharacter:
        callbackSource.onApplyCharacter ||
        null,
      onApplyNpcEntry:
        callbackSource.onApplyNpcEntry ||
        null,
    },
  };
}
