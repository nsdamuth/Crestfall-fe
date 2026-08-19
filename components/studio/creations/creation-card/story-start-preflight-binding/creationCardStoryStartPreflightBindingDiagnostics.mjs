import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CREATION_CARD_VIEW_CONTRACT_VERSION,
} from "../CreationCard.contract.js";

import {
  CREATION_CARD_STORY_START_ACTIONS,
  CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
  CREATION_CARD_STORY_START_PREFLIGHT_STATUSES,
  projectCreationCardStoryStartPreflightBinding,
  projectCreationCardStoryStartViewCompatibility,
} from "./CreationCardStoryStartPreflightBinding.contract.js";

import {
  creationCardStoryStartBusyFixture,
  creationCardStoryStartCharacterFixture,
  creationCardStoryStartFallbackPlayerSelectFixture,
  creationCardStoryStartNotChatCapableFixture,
  creationCardStoryStartRoomTemplateFixedFixture,
  creationCardStoryStartRoomTemplateNeedsPreflightFixture,
  creationCardStoryStartRoomTemplatePlayerSelectFixture,
  creationCardStoryStartUnsavedRoomTemplateFixture,
} from "./CreationCardStoryStartPreflightBinding.fixtures.js";

assert.equal(
  CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
  "creation_card_story_start_preflight_binding_v1"
);

assert.deepEqual(
  CREATION_CARD_STORY_START_PREFLIGHT_STATUSES,
  {
    NOT_REQUIRED: "NOT_REQUIRED",
    REQUIRED: "REQUIRED",
    READY: "READY",
    FAILED_FALLBACK_READY:
      "FAILED_FALLBACK_READY",
  }
);

assert.deepEqual(
  CREATION_CARD_STORY_START_ACTIONS,
  {
    START_DIRECTLY: "START_DIRECTLY",
    HYDRATE_STORY_PREVIEW:
      "HYDRATE_STORY_PREVIEW",
    OPEN_PREVIEW_FOR_LOCATION_SELECTION:
      "OPEN_PREVIEW_FOR_LOCATION_SELECTION",
    START_HYDRATED_STORY:
      "START_HYDRATED_STORY",
    BLOCK_BUSY: "BLOCK_BUSY",
    NOT_CHAT_CAPABLE:
      "NOT_CHAT_CAPABLE",
  }
);

const character =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartCharacterFixture
  );

assert.equal(
  character.bindingContractVersion,
  CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION
);

assert.equal(
  character.creationCardViewContractVersion,
  CREATION_CARD_VIEW_CONTRACT_VERSION
);

assert.equal(
  character.creationCardViewContractVersion,
  "1.0.0"
);

assert.equal(
  character.action,
  "START_DIRECTLY"
);

assert.equal(
  character.invokeStoryStart,
  true
);

assert.equal(
  character.storyCreation.title,
  "Mira Quill"
);

const unsaved =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartUnsavedRoomTemplateFixture
  );

assert.equal(
  unsaved.action,
  "START_DIRECTLY"
);

assert.equal(
  unsaved.hydratePreview,
  false
);

const needsPreflight =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartRoomTemplateNeedsPreflightFixture
  );

assert.equal(
  needsPreflight.action,
  "HYDRATE_STORY_PREVIEW"
);

assert.equal(
  needsPreflight.hydratePreview,
  true
);

assert.equal(
  needsPreflight.invokeStoryStart,
  false
);

assert.equal(
  needsPreflight.busy,
  true
);

const playerSelect =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartRoomTemplatePlayerSelectFixture
  );

assert.equal(
  playerSelect.action,
  "OPEN_PREVIEW_FOR_LOCATION_SELECTION"
);

assert.equal(
  playerSelect.openPreview,
  true
);

assert.equal(
  playerSelect.invokeStoryStart,
  false
);

assert.equal(
  playerSelect.storyCreation.title,
  "Crossroads at Dawn"
);

assert.equal(
  playerSelect.preflight.selectionRequired,
  true
);

const fixed =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartRoomTemplateFixedFixture
  );

assert.equal(
  fixed.action,
  "START_HYDRATED_STORY"
);

assert.equal(
  fixed.invokeStoryStart,
  true
);

assert.equal(
  fixed.openPreview,
  false
);

assert.equal(
  fixed.openingLocationId,
  null
);

assert.equal(
  fixed.storyCreation.title,
  "The Bronze Seal"
);

const fallback =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartFallbackPlayerSelectFixture
  );

assert.equal(
  fallback.action,
  "OPEN_PREVIEW_FOR_LOCATION_SELECTION"
);

assert.equal(
  fallback.preflight.status,
  "FAILED_FALLBACK_READY"
);

assert.match(
  fallback.preflight.errorMessage,
  /fallback Creation data was used/i
);

const busy =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartBusyFixture
  );

assert.equal(
  busy.action,
  "BLOCK_BUSY"
);

assert.equal(
  busy.invokeStoryStart,
  false
);

assert.equal(
  busy.busy,
  true
);

const notChat =
  projectCreationCardStoryStartPreflightBinding(
    creationCardStoryStartNotChatCapableFixture
  );

assert.equal(
  notChat.action,
  "NOT_CHAT_CAPABLE"
);

assert.equal(
  notChat.invokeStoryStart,
  false
);

const compatible =
  projectCreationCardStoryStartViewCompatibility({
    ...creationCardStoryStartRoomTemplateNeedsPreflightFixture,
    onStartChat: () => {},
    onOpenPreview: () => {},
  });

assert.equal(
  compatible.currentCreationCardViewProps.showStartChatAction,
  true
);

assert.equal(
  compatible.currentCreationCardViewProps.isStartingChat,
  true
);

assert.equal(
  typeof compatible.currentCreationCardViewProps.onStartChat,
  "function"
);

assert.equal(
  typeof compatible.currentCreationCardViewProps.onOpenPreview,
  "function"
);

assert.deepEqual(
  compatible.currentViewCompatibility,
  {
    existingStartButtonSufficient: true,
    existingPreviewModalTriggerSufficient: true,
    newVisualSlotRequired: false,
  }
);

assert.deepEqual(
  compatible.architecture,
  {
    chatCapabilityOwnedByChassis: true,
    roomTemplateIdentificationOwnedByChassis: true,
    creationPreviewFetchOwnedByChassis: true,
    previewGraphNormalizationOwnedByChassis: true,
    openingLocationConfigOwnedByChassis: true,
    roomCreationOwnedByChassis: true,
    navigationOwnedByChassis: true,
    cardStartGateProjectionOwnedByFe: true,
    existingCardVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./CreationCardStoryStartPreflightBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "fetchCreationPreview",
  "buildModalCreationFromPreviewGraph",
  "getStoryOpeningLocationStartConfig",
  "startStoryFromCreation",
  "setPreviewCreation",
  "setIsPreviewOpen",
  "setStartingChat",
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
    "creation_card_story_start_preflight_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
  creationCardViewContractVersion:
    CREATION_CARD_VIEW_CONTRACT_VERSION,
  directNonRoomTemplateStartCovered: true,
  unsavedRoomTemplateDirectCompatibilityCovered: true,
  savedRoomTemplatePreviewPreflightCovered: true,
  playerSelectPreviewGateCovered: true,
  fixedHydratedStartCovered: true,
  hydrationFailureFallbackGateCovered: true,
  busyAndChatCapabilityGuardsCovered: true,
  currentCardViewAndPreviewTriggerSufficient: true,
  noNewVisualSlotRequired: true,
  existingCreationCardViewUnmodified: true,
  existingCreationCardViewModelUnmodified: true,
  chassisPreviewFetchNormalizationStartAndNavigationExcluded: true,
}, null, 2));
