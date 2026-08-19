import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
} from "../creation-profile-page/CreationProfilePage.contract.js";

import {
  CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION,
} from "../creation-preview-modal/CreationPreviewModal.contract.js";

import {
  STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
} from "../../story-rooms/story-start-opening-location/StoryStartOpeningLocationPresentation.contract.js";

import {
  CREATION_STORY_START_CALLBACK_KEYS,
  CREATION_STORY_START_INTENTS,
  CREATION_STORY_START_OPENING_LOCATION_BINDING_CONTRACT_VERSION,
  CREATION_STORY_START_SURFACES,
  projectCreationStoryStartIntent,
  projectCreationStoryStartOpeningLocationBinding,
} from "./CreationStoryStartOpeningLocationBinding.contract.js";

import {
  creationStoryStartFixedProfileFixture,
  creationStoryStartInvalidSelectionFixture,
  creationStoryStartNotChatCapableFixture,
  creationStoryStartPendingFixture,
  creationStoryStartPlayerSelectPreviewFixture,
  creationStoryStartPlayerSelectProfileFixture,
} from "./CreationStoryStartOpeningLocationBinding.fixtures.js";

assert.equal(
  CREATION_STORY_START_OPENING_LOCATION_BINDING_CONTRACT_VERSION,
  "creation_story_start_opening_location_binding_v1"
);

assert.deepEqual(
  CREATION_STORY_START_SURFACES,
  {
    PROFILE_PAGE: "PROFILE_PAGE",
    PREVIEW_MODAL: "PREVIEW_MODAL",
  }
);

assert.deepEqual(
  CREATION_STORY_START_INTENTS,
  {
    START_DIRECTLY: "START_DIRECTLY",
    OPEN_LOCATION_PICKER: "OPEN_LOCATION_PICKER",
    BLOCK_INVALID_SELECTION: "BLOCK_INVALID_SELECTION",
    START_WITH_SELECTED_LOCATION: "START_WITH_SELECTED_LOCATION",
    BLOCK_BUSY: "BLOCK_BUSY",
    NOT_CHAT_CAPABLE: "NOT_CHAT_CAPABLE",
  }
);

assert.deepEqual(
  CREATION_STORY_START_CALLBACK_KEYS,
  [
    "onSelectLocation",
    "onCancelLocationPicker",
    "onConfirmLocation",
  ]
);

const fixed =
  projectCreationStoryStartOpeningLocationBinding(
    creationStoryStartFixedProfileFixture
  );

assert.equal(
  fixed.bindingContractVersion,
  CREATION_STORY_START_OPENING_LOCATION_BINDING_CONTRACT_VERSION
);

assert.equal(
  fixed.creationProfilePageViewContractVersion,
  CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION
);

assert.equal(
  fixed.creationPreviewModalViewContractVersion,
  CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION
);

assert.equal(
  fixed.storyStartOpeningLocationPresentationContractVersion,
  STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION
);

assert.equal(
  fixed.surface,
  "PROFILE_PAGE"
);

assert.equal(
  fixed.openingLocation.selectionRequired,
  false
);

assert.equal(
  fixed.openingLocation.picker.open,
  false
);

assert.equal(
  fixed.startAction.initial.intent,
  "START_DIRECTLY"
);

assert.equal(
  fixed.startAction.initial.invokeStoryStart,
  true
);

assert.equal(
  fixed.startAction.initial.openingLocationId,
  null
);

assert.equal(
  fixed.visualExtensionStatus.fixedStoryStart,
  "CURRENT_START_ACTION_COMPATIBLE"
);

const playerProfile =
  projectCreationStoryStartOpeningLocationBinding(
    creationStoryStartPlayerSelectProfileFixture
  );

assert.equal(
  playerProfile.openingLocation.selectionRequired,
  true
);

assert.equal(
  playerProfile.openingLocation.picker.open,
  true
);

assert.equal(
  playerProfile.openingLocation.picker.mode,
  "PLAYER_SELECT"
);

assert.equal(
  playerProfile.openingLocation.picker.selectedLocationId,
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"
);

assert.equal(
  playerProfile.openingLocation.picker.selectedOption.title,
  "Sunreach"
);

assert.equal(
  playerProfile.startAction.initial.intent,
  "START_WITH_SELECTED_LOCATION"
);

assert.equal(
  playerProfile.startAction.initial.invokeStoryStart,
  true
);

assert.equal(
  playerProfile.startAction.initial.openingLocationId,
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"
);

assert.equal(
  playerProfile.surfaceIntegration.profilePage.requiredVisualSlot.slotName,
  "openingLocationPickerSlot"
);

assert.equal(
  playerProfile.surfaceIntegration.profilePage.requiredVisualSlot.status,
  "WIRED"
);

assert.equal(
  playerProfile.visualExtensionStatus.creationProfileOpeningLocationPicker,
  "WIRED"
);

const playerPreview =
  projectCreationStoryStartOpeningLocationBinding(
    creationStoryStartPlayerSelectPreviewFixture
  );

assert.equal(
  playerPreview.surface,
  "PREVIEW_MODAL"
);

assert.equal(
  playerPreview.startAction.initial.intent,
  "OPEN_LOCATION_PICKER"
);

assert.equal(
  playerPreview.startAction.initial.invokeStoryStart,
  false
);

assert.equal(
  playerPreview.startAction.initial.openLocationPicker,
  true
);

assert.equal(
  playerPreview.startAction.confirm.intent,
  "BLOCK_INVALID_SELECTION"
);

assert.equal(
  playerPreview.startAction.confirm.errorMessage,
  "Choose one of the allowed starting Locations."
);

assert.equal(
  playerPreview.surfaceIntegration.previewModal.requiredVisualSlot.slotName,
  "openingLocationPickerSlot"
);

assert.equal(
  playerPreview.surfaceIntegration.previewModal.requiredVisualSlot.status,
  "WIRED"
);

assert.equal(
  playerPreview.visualExtensionStatus.creationPreviewOpeningLocationPicker,
  "WIRED"
);

const invalid =
  projectCreationStoryStartOpeningLocationBinding(
    creationStoryStartInvalidSelectionFixture
  );

assert.equal(
  invalid.openingLocation.selectedLocationId,
  ""
);

assert.equal(
  invalid.openingLocation.picker.selectedLocationId,
  ""
);

assert.equal(
  invalid.openingLocation.picker.errorMessage,
  "Choose one of the allowed starting Locations."
);

assert.equal(
  invalid.startAction.initial.intent,
  "OPEN_LOCATION_PICKER"
);

assert.equal(
  invalid.startAction.confirm.intent,
  "BLOCK_INVALID_SELECTION"
);

const pending =
  projectCreationStoryStartOpeningLocationBinding(
    creationStoryStartPendingFixture
  );

assert.equal(
  pending.startAction.initial.intent,
  "BLOCK_BUSY"
);

assert.equal(
  pending.startAction.confirm.intent,
  "BLOCK_BUSY"
);

assert.equal(
  pending.openingLocation.picker.pending,
  true
);

assert.equal(
  pending.openingLocation.picker.actions.confirmLabel,
  "Starting..."
);

assert.equal(
  pending.openingLocation.picker.actions.confirmDisabled,
  true
);

const notChat =
  projectCreationStoryStartOpeningLocationBinding(
    creationStoryStartNotChatCapableFixture
  );

assert.equal(
  notChat.startAction.initial.intent,
  "NOT_CHAT_CAPABLE"
);

assert.equal(
  notChat.startAction.initial.invokeStoryStart,
  false
);

assert.equal(
  notChat.startAction.confirm.intent,
  "NOT_CHAT_CAPABLE"
);

assert.deepEqual(
  projectCreationStoryStartIntent({
    supportsChat: true,
    selectionRequired: true,
    selectedLocationId:
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    allowedLocationIds: [
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    ],
    forceSelection: true,
  }),
  {
    intent:
      "START_WITH_SELECTED_LOCATION",
    invokeStoryStart: true,
    openLocationPicker: false,
    openingLocationId:
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    errorMessage: "",
  }
);

assert.deepEqual(
  playerProfile.functionalWiringStatus,
  {
    creationProfileOpeningLocationPicker:
      "WIRED",
    creationPreviewOpeningLocationPicker:
      "WIRED",
    creationCardStoryStartPreflight:
      "WIRED",
    selectedLocationValidation:
      "WIRED",
    selectedLocationCommitRouting:
      "WIRED",
  }
);

assert.deepEqual(
  playerProfile.architecture,
  {
    storyCreationParsingOwnedByChassis: true,
    openingLocationModeOwnedByChassis: true,
    allowedLocationIdsOwnedByChassis: true,
    selectedLocationStateOwnedByChassisApplicationViewModel: true,
    selectedLocationValidationOwnedByChassis: true,
    roomCreationOwnedByChassis: true,
    openingHardStateCommitOwnedByChassis: true,
    navigationOwnedByChassis: true,
    startGatePresentationProjectionOwnedByFe: true,
    pickerVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./CreationStoryStartOpeningLocationBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "getStoryOpeningLocationStartConfig",
  "startStoryFromCreation",
  "setOpeningLocationPickerOpen",
  "setOpeningLocationId",
  "setStartingChat",
  "setChatError",
  "navigate(",
  "router.push",
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
    "creation_story_start_opening_location_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    CREATION_STORY_START_OPENING_LOCATION_BINDING_CONTRACT_VERSION,
  creationProfilePageViewContractVersion:
    CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
  creationPreviewModalViewContractVersion:
    CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION,
  storyStartOpeningLocationPresentationContractVersion:
    STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  fixedStartDirectCompatibilityCovered: true,
  profilePlayerSelectBindingCovered: true,
  previewPlayerSelectBindingCovered: true,
  openPickerGateCovered: true,
  selectedLocationStartIntentCovered: true,
  invalidSelectionBlockCovered: true,
  busyAndNonChatGuardsCovered: true,
  profileOpeningLocationPickerWired: true,
  previewOpeningLocationPickerWired: true,
  creationCardPreflightWired: true,
  selectedLocationValidationWired: true,
  selectedLocationCommitRoutingWired: true,
  creationProfileViewContractSupersededToV2WithoutPickerRegression: true,
  creationPreviewViewContractRemainsV1WithPickerLive: true,
  chassisParsingValidationRoomCreationCommitAndNavigationExcluded: true,
}, null, 2));
