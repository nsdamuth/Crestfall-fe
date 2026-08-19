import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../LocationRegistryBuilder.contract.js";

export const LOCATION_REGISTRY_CROSS_REGISTRY_CONNECTION_BINDING_CONTRACT_VERSION =
  "location_registry_cross_registry_connection_binding_v1";

export const LOCATION_REGISTRY_CONNECTION_ENDPOINT_CALLBACK_KEYS = Object.freeze([
  "onSelectEndpointRegistry",
  "onSelectEndpointLocation",
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

function normalizeRegistryOption(option = {}) {
  const source = object(option);
  const id = text(source.id || source.value);

  if (!id) return null;

  return {
    value: id,
    label:
      text(source.label || source.title) ||
      "Untitled Location Registry",
  };
}

function normalizeLocationOption(option = {}) {
  const source = object(option);
  const id = text(source.id || source.value);

  if (!id) return null;

  return {
    value: id,
    label:
      text(source.label || source.name) ||
      "Untitled Location",
    creationId:
      text(source.creationId || source.creation_id),
    creationType:
      text(source.creationType || source.creation_type),
    kind:
      text(source.kind),
  };
}

function buildLocalLocationOptions(entries = []) {
  return array(entries)
    .map((entry) => {
      const source = object(entry);
      const id = text(source.id);

      if (!id) return null;

      return {
        value: id,
        label:
          text(source.name) ||
          id,
        creationId:
          text(source.creationId),
        creationType:
          text(source.creationType),
        kind:
          text(source.kind),
      };
    })
    .filter(Boolean);
}

function endpointState({
  side,
  endpoint = {},
  localEntries = [],
  referencedLocationOptions = [],
  registryTitleById = {},
  currentCreationId = "",
} = {}) {
  const source = object(endpoint);
  const registryCreationId =
    text(source.registryCreationId);

  const usingExternalRegistry =
    Boolean(registryCreationId);

  const options = usingExternalRegistry
    ? array(referencedLocationOptions)
        .map(normalizeLocationOption)
        .filter(Boolean)
    : buildLocalLocationOptions(localEntries);

  const locationEntryId =
    text(source.locationEntryId);

  const selectedOption =
    options.find(
      (option) =>
        option.value === locationEntryId
    ) || null;

  const storedLocationCreationId =
    text(source.locationCreationId);

  const selectedLocationCreationId =
    text(selectedOption?.creationId);

  const locationCreationId =
    selectedLocationCreationId ||
    storedLocationCreationId;

  const registryTitle =
    usingExternalRegistry
      ? (
          text(
            object(registryTitleById)[
              registryCreationId
            ]
          ) ||
          "Linked Location Registry"
        )
      : "This Registry";

  const locationName =
    text(selectedOption?.label) ||
    locationEntryId ||
    "Unknown Location";

  const resolved =
    Boolean(
      locationEntryId &&
      selectedOption
    );

  const degraded =
    Boolean(locationEntryId) &&
    !resolved;

  return {
    side,
    registryCreationId,
    effectiveRegistryCreationId:
      registryCreationId ||
      text(currentCreationId),

    usingExternalRegistry,

    registryTitle,

    locationEntryId,

    locationCreationId,

    locationName,

    label:
      usingExternalRegistry
        ? `${registryTitle} · ${locationName}`
        : locationName,

    resolved,
    degraded,

    degradedMessage:
      degraded
        ? (
            usingExternalRegistry
              ? "The stored Location entry is not present in the currently loaded linked Registry options. Its reference identity is preserved."
              : "The stored Location entry is not present in this Registry's current entries. Its reference identity is preserved."
          )
        : "",

    locationOptions:
      options,

    selectedOption,
  };
}

export function projectLocationRegistryCrossRegistryConnectionBinding({
  currentCreationId = "",
  connectionDraft = {},
  localEntries = [],
  registryOptions = [],
  connectionFromLocationOptions = [],
  connectionToLocationOptions = [],
  registryTitleById = {},
  referenceRegistryLoadError = "",
  authoringAvailable = false,
  callbacks = {},
} = {}) {
  const draft = object(connectionDraft);
  const callbackSource = object(callbacks);

  const savedRegistry =
    Boolean(text(currentCreationId));

  const crossRegistryAvailable =
    savedRegistry &&
    authoringAvailable === true;

  const normalizedRegistryOptions =
    array(registryOptions)
      .map(normalizeRegistryOption)
      .filter(Boolean);

  const from = endpointState({
    side: "from",
    endpoint: draft.from || {
      registryCreationId: "",
      locationEntryId:
        text(draft.fromLocationId),
      locationCreationId: "",
    },
    localEntries,
    referencedLocationOptions:
      connectionFromLocationOptions,
    registryTitleById,
    currentCreationId,
  });

  const to = endpointState({
    side: "to",
    endpoint: draft.to || {
      registryCreationId: "",
      locationEntryId:
        text(draft.toLocationId),
      locationCreationId: "",
    },
    localEntries,
    referencedLocationOptions:
      connectionToLocationOptions,
    registryTitleById,
    currentCreationId,
  });

  const crossRegistry =
    from.usingExternalRegistry ||
    to.usingExternalRegistry;

  const unsavedExternalReference =
    !savedRegistry &&
    crossRegistry;

  return {
    bindingContractVersion:
      LOCATION_REGISTRY_CROSS_REGISTRY_CONNECTION_BINDING_CONTRACT_VERSION,

    locationRegistryBuilderViewContractVersion:
      LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,

    authoring: {
      savedRegistry,
      crossRegistryAvailable,

      saveFirstNotice:
        savedRegistry
          ? ""
          : "Save this Location Registry before authoring cross-Registry parent or connection references.",

      referenceRegistryLoadError:
        text(referenceRegistryLoadError),

      registryOptions:
        normalizedRegistryOptions,

      registrySelectors: {
        from: {
          label: "From Registry",
          value:
            from.registryCreationId,
          includeBlank: true,
          blankLabel: "This Registry",
          disabled:
            !crossRegistryAvailable,
          options:
            normalizedRegistryOptions,
          callback:
            callbackSource.onSelectEndpointRegistry ||
            null,
        },

        to: {
          label: "To Registry",
          value:
            to.registryCreationId,
          includeBlank: true,
          blankLabel: "This Registry",
          disabled:
            !crossRegistryAvailable,
          options:
            normalizedRegistryOptions,
          callback:
            callbackSource.onSelectEndpointRegistry ||
            null,
        },
      },

      locationSelectors: {
        from: {
          label: "From Location",
          value:
            from.locationEntryId,
          includeBlank: true,
          blankLabel: "Select source",
          options:
            from.locationOptions,
          callback:
            callbackSource.onSelectEndpointLocation ||
            null,
        },

        to: {
          label: "To Location",
          value:
            to.locationEntryId,
          includeBlank: true,
          blankLabel: "Select target",
          options:
            to.locationOptions,
          callback:
            callbackSource.onSelectEndpointLocation ||
            null,
        },
      },
    },

    endpoints: {
      from,
      to,
    },

    connectionPresentation: {
      crossRegistry,

      fromLocationDisplay:
        from.label,

      toLocationDisplay:
        to.label,

      endpointSummary:
        `${from.label} → ${to.label}`,

      degraded:
        from.degraded ||
        to.degraded,

      degradedMessages:
        [
          from.degradedMessage,
          to.degradedMessage,
        ].filter(Boolean),
    },

    saveGate: {
      blocked:
        unsavedExternalReference,

      reason:
        unsavedExternalReference
          ? "CROSS_REGISTRY_REQUIRES_SAVED_LOCATION_REGISTRY"
          : "",

      message:
        unsavedExternalReference
          ? "Save this Location Registry before saving a connection that references another Location Registry."
          : "",
    },

    endpointSelectionSemantics: {
      registryChange:
        "Changing an endpoint Registry clears that endpoint's Location entry and Location Creation IDs.",

      locationChange:
        "Changing an endpoint Location resolves against local entries when no external Registry is selected, otherwise against the Chassis-supplied linked Registry options.",

      creationIdPropagation:
        "If the selected Location option is backed by a Location Creation, its creationId is carried as locationCreationId.",

      authoritativeResolution:
        "CHASSIS_APPLICATION_VIEWMODEL",
    },

    applicationWiringStatus: {
      sharedLocationRegistryFoundation: "WIRED",
      registryCandidateLoading: "WIRED",
      referencedRegistryHydration: "WIRED",
      endpointSelectionMutation: "WIRED",
      endpointIdentityResolution: "WIRED",
      editCreationIdBridge: "PENDING_PROTECTED_EDITOR_WIRING",
    },

    visualExtensionStatus: {
      crossRegistrySelectors:
        "WIRED",

      qualifiedConnectionLabels:
        "WIRED",

      degradedEndpointReference:
        "WIRED",
    },

    architecture: {
      registryCandidateLoadingOwnedByChassis: true,
      referencedRegistryLoadingOwnedByChassis: true,
      registryLocationOptionHydrationOwnedByChassis: true,
      endpointSelectionMutationOwnedByChassis: true,
      endpointIdentityResolutionOwnedByChassis: true,
      crossRegistrySaveEnforcementOwnedByChassis: true,
      connectionPersistenceOwnedByChassis: true,
      selectorAndQualifiedLabelPresentationOwnedByFe: true,
      degradedReferencePresentationOwnedByFe: true,
    },
  };
}
