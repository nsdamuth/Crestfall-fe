import assert from "node:assert/strict";
import fs from "node:fs";

import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../LocationRegistryBuilder.contract.js";

import {
  LOCATION_REGISTRY_CONNECTION_ENDPOINT_CALLBACK_KEYS,
  LOCATION_REGISTRY_CROSS_REGISTRY_CONNECTION_BINDING_CONTRACT_VERSION,
  projectLocationRegistryCrossRegistryConnectionBinding,
} from "./LocationRegistryCrossRegistryConnectionBinding.contract.js";

import {
  locationRegistryCrossRegistryDegradedFixture,
  locationRegistryCrossRegistryLocalLinkedLocationFixture,
  locationRegistryCrossRegistrySavedFixture,
  locationRegistryCrossRegistryUnsavedFixture,
} from "./LocationRegistryCrossRegistryConnectionBinding.fixtures.js";

assert.equal(
  LOCATION_REGISTRY_CROSS_REGISTRY_CONNECTION_BINDING_CONTRACT_VERSION,
  "location_registry_cross_registry_connection_binding_v1"
);

assert.deepEqual(
  LOCATION_REGISTRY_CONNECTION_ENDPOINT_CALLBACK_KEYS,
  [
    "onSelectEndpointRegistry",
    "onSelectEndpointLocation",
  ]
);

const saved =
  projectLocationRegistryCrossRegistryConnectionBinding(
    locationRegistryCrossRegistrySavedFixture
  );

assert.equal(
  saved.bindingContractVersion,
  LOCATION_REGISTRY_CROSS_REGISTRY_CONNECTION_BINDING_CONTRACT_VERSION
);

assert.equal(
  saved.locationRegistryBuilderViewContractVersion,
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  saved.locationRegistryBuilderViewContractVersion,
  "location-registry-builder.view.v1"
);

assert.equal(
  saved.authoring.savedRegistry,
  true
);

assert.equal(
  saved.authoring.crossRegistryAvailable,
  true
);

assert.equal(
  saved.authoring.saveFirstNotice,
  ""
);

assert.deepEqual(
  saved.authoring.registryOptions,
  [
    {
      value:
        "22222222-2222-4222-8222-222222222222",
      label:
        "Aethelgard City Registry",
    },
    {
      value:
        "33333333-3333-4333-8333-333333333333",
      label:
        "Outer Roads Registry",
    },
  ]
);

assert.deepEqual(
  saved.authoring.registrySelectors.from,
  {
    label: "From Registry",
    value: "",
    includeBlank: true,
    blankLabel: "This Registry",
    disabled: false,
    options:
      saved.authoring.registryOptions,
    callback: null,
  }
);

assert.equal(
  saved.authoring.registrySelectors.to.value,
  "22222222-2222-4222-8222-222222222222"
);

assert.equal(
  saved.authoring.registrySelectors.to.blankLabel,
  "This Registry"
);

assert.deepEqual(
  saved.authoring.locationSelectors.from.options.map(
    (option) => [
      option.value,
      option.label,
      option.creationId,
    ]
  ),
  [
    [
      "loc_district",
      "Acceptance District",
      "",
    ],
    [
      "loc_workshop",
      "Test Workshop",
      "",
    ],
    [
      "loc_linked",
      "Linked Location",
      "11111111-1111-4111-8111-111111111111",
    ],
  ]
);

assert.deepEqual(
  saved.authoring.locationSelectors.to.options.map(
    (option) => [
      option.value,
      option.label,
      option.creationId,
    ]
  ),
  [
    [
      "remote_brass_gate",
      "Brass Gate",
      "44444444-4444-4444-8444-444444444444",
    ],
    [
      "remote_market",
      "Central Market",
      "",
    ],
  ]
);

assert.deepEqual(
  saved.endpoints.from,
  {
    side: "from",
    registryCreationId: "",
    effectiveRegistryCreationId:
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    usingExternalRegistry: false,
    registryTitle:
      "This Registry",
    locationEntryId:
      "loc_workshop",
    locationCreationId: "",
    locationName:
      "Test Workshop",
    label:
      "Test Workshop",
    resolved: true,
    degraded: false,
    degradedMessage: "",
    locationOptions:
      saved.authoring.locationSelectors.from.options,
    selectedOption:
      saved.authoring.locationSelectors.from.options[1],
  }
);

assert.equal(
  saved.endpoints.to.registryCreationId,
  "22222222-2222-4222-8222-222222222222"
);

assert.equal(
  saved.endpoints.to.registryTitle,
  "Aethelgard City Registry"
);

assert.equal(
  saved.endpoints.to.locationEntryId,
  "remote_brass_gate"
);

assert.equal(
  saved.endpoints.to.locationCreationId,
  "44444444-4444-4444-8444-444444444444"
);

assert.equal(
  saved.endpoints.to.label,
  "Aethelgard City Registry · Brass Gate"
);

assert.deepEqual(
  saved.connectionPresentation,
  {
    crossRegistry: true,
    fromLocationDisplay:
      "Test Workshop",
    toLocationDisplay:
      "Aethelgard City Registry · Brass Gate",
    endpointSummary:
      "Test Workshop → Aethelgard City Registry · Brass Gate",
    degraded: false,
    degradedMessages: [],
  }
);

assert.equal(
  saved.saveGate.blocked,
  false
);

assert.equal(
  saved.endpointSelectionSemantics.authoritativeResolution,
  "CHASSIS_APPLICATION_VIEWMODEL"
);

const localLinked =
  projectLocationRegistryCrossRegistryConnectionBinding(
    locationRegistryCrossRegistryLocalLinkedLocationFixture
  );

assert.equal(
  localLinked.endpoints.from.locationCreationId,
  "11111111-1111-4111-8111-111111111111"
);

assert.equal(
  localLinked.endpoints.from.label,
  "Linked Location"
);

assert.equal(
  localLinked.connectionPresentation.crossRegistry,
  false
);

const unsaved =
  projectLocationRegistryCrossRegistryConnectionBinding(
    locationRegistryCrossRegistryUnsavedFixture
  );

assert.equal(
  unsaved.authoring.savedRegistry,
  false
);

assert.equal(
  unsaved.authoring.crossRegistryAvailable,
  false
);

assert.equal(
  unsaved.authoring.registrySelectors.from.disabled,
  true
);

assert.equal(
  unsaved.authoring.registrySelectors.to.disabled,
  true
);

assert.equal(
  unsaved.authoring.saveFirstNotice,
  "Save this Location Registry before authoring cross-Registry parent or connection references."
);

assert.equal(
  unsaved.saveGate.blocked,
  true
);

assert.equal(
  unsaved.saveGate.reason,
  "CROSS_REGISTRY_REQUIRES_SAVED_LOCATION_REGISTRY"
);

assert.equal(
  unsaved.saveGate.message,
  "Save this Location Registry before saving a connection that references another Location Registry."
);

const degraded =
  projectLocationRegistryCrossRegistryConnectionBinding(
    locationRegistryCrossRegistryDegradedFixture
  );

assert.equal(
  degraded.authoring.referenceRegistryLoadError,
  "A referenced Location Registry could not be loaded."
);

assert.equal(
  degraded.endpoints.from.resolved,
  false
);

assert.equal(
  degraded.endpoints.from.degraded,
  true
);

assert.equal(
  degraded.endpoints.from.locationEntryId,
  "missing_remote_location"
);

assert.equal(
  degraded.endpoints.from.locationCreationId,
  "55555555-5555-4555-8555-555555555555"
);

assert.equal(
  degraded.endpoints.from.locationName,
  "missing_remote_location"
);

assert.equal(
  degraded.endpoints.from.label,
  "Outer Roads Registry · missing_remote_location"
);

assert.match(
  degraded.endpoints.from.degradedMessage,
  /reference identity is preserved/i
);

assert.equal(
  degraded.connectionPresentation.degraded,
  true
);

assert.equal(
  degraded.connectionPresentation.degradedMessages.length,
  1
);

assert.equal(
  degraded.visualExtensionStatus.degradedEndpointReference,
  "WIRED"
);

assert.deepEqual(
  saved.applicationWiringStatus,
  {
    sharedLocationRegistryFoundation: "WIRED",
    registryCandidateLoading: "WIRED",
    referencedRegistryHydration: "WIRED",
    endpointSelectionMutation: "WIRED",
    endpointIdentityResolution: "WIRED",
    editCreationIdBridge: "PENDING_PROTECTED_EDITOR_WIRING",
  }
);

assert.deepEqual(
  saved.visualExtensionStatus,
  {
    crossRegistrySelectors:
      "WIRED",
    qualifiedConnectionLabels:
      "WIRED",
    degradedEndpointReference:
      "WIRED",
  }
);

assert.deepEqual(
  saved.architecture,
  {
    registryCandidateLoadingOwnedByChassis: true,
    referencedRegistryLoadingOwnedByChassis: true,
    registryLocationOptionHydrationOwnedByChassis: true,
    endpointSelectionMutationOwnedByChassis: true,
    endpointIdentityResolutionOwnedByChassis: true,
    crossRegistrySaveEnforcementOwnedByChassis: true,
    connectionPersistenceOwnedByChassis: true,
    selectorAndQualifiedLabelPresentationOwnedByFe: true,
    degradedReferencePresentationOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./LocationRegistryCrossRegistryConnectionBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "fetchLocationRegistryById",
  "setReferenceRegistryCreationsById",
  "resolveLocationConnectionEndpointSelection",
  "selectConnectionEndpointRegistry",
  "selectConnectionEndpointLocation",
  "setConnectionDraft",
  "saveConnectionDraft",
  "commitRegistry",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "location_registry_cross_registry_connection_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    LOCATION_REGISTRY_CROSS_REGISTRY_CONNECTION_BINDING_CONTRACT_VERSION,
  locationRegistryBuilderViewContractVersion:
    LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  savedRegistryCrossRegistryAuthoringCovered: true,
  unsavedSaveFirstGateCovered: true,
  thisRegistryBlankSelectionCovered: true,
  localAndRemoteLocationOptionSwitchCovered: true,
  locationCreationIdPropagationPresentationCovered: true,
  qualifiedConnectionLabelsCovered: true,
  degradedReferenceIdentityPreservationCovered: true,
  crossRegistrySelectorsWired: true,
  qualifiedConnectionLabelsWired: true,
  degradedEndpointReferenceRecoveryWired: true,
  sharedLocationRegistryApplicationFoundationWired: true,
  registryHydrationAndEndpointMutationWired: true,
  editCreationIdBridgePendingProtectedEditorWiring: true,
  locationRegistryBuilderViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  locationRegistryBuilderViewModelWiredToChassisAuthority: true,
  chassisLoadingResolutionMutationSaveAndPersistenceExcludedFromBindingContract: true,
}, null, 2));
