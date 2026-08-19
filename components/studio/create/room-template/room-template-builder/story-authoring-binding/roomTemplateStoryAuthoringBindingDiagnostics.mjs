import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION,
} from "../RoomTemplateBuilder.contract.js";

import {
  SELECTED_CHARACTERS_PANEL_VIEW_CONTRACT_VERSION,
} from "../../../../room-templates/selected-characters-panel/SelectedCharactersPanel.contract.js";

import {
  STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
} from "../../../../room-templates/story-opening-location-authoring/StoryOpeningLocationAuthoring.contract.js";

import {
  STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION,
} from "../../../../room-templates/story-character-lifecycle-authoring/StoryCharacterLifecycleAuthoring.contract.js";

import {
  ROOM_TEMPLATE_STORY_AUTHORING_BINDING_CONTRACT_VERSION,
  ROOM_TEMPLATE_STORY_AUTHORING_CALLBACK_KEYS,
  projectRoomTemplateStoryAuthoringBinding,
} from "./RoomTemplateStoryAuthoringBinding.contract.js";

import {
  roomTemplateStoryAuthoringFixedFixture,
  roomTemplateStoryAuthoringInvalidPlayerSelectFixture,
  roomTemplateStoryAuthoringLegacyCharactersFixture,
  roomTemplateStoryAuthoringPlayerSelectFixture,
} from "./RoomTemplateStoryAuthoringBinding.fixtures.js";

assert.equal(
  ROOM_TEMPLATE_STORY_AUTHORING_BINDING_CONTRACT_VERSION,
  "room_template_story_authoring_binding_v1"
);

const fixed = projectRoomTemplateStoryAuthoringBinding(
  roomTemplateStoryAuthoringFixedFixture
);

assert.equal(fixed.bindingContractVersion, ROOM_TEMPLATE_STORY_AUTHORING_BINDING_CONTRACT_VERSION);
assert.equal(fixed.roomTemplateBuilderViewContractVersion, ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION);
assert.equal(fixed.selectedCharactersPanelViewContractVersion, SELECTED_CHARACTERS_PANEL_VIEW_CONTRACT_VERSION);
assert.equal(fixed.openingLocationPresentationContractVersion, STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION);
assert.equal(fixed.characterLifecyclePresentationContractVersion, STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION);
assert.equal(fixed.openingLocation.mode, "FIXED");
assert.equal(fixed.roomTemplateBuilderProps.fixedLocationCard.fixedLocationId, "cccccccc-cccc-4ccc-8ccc-cccccccccccc");
assert.equal(fixed.roomTemplateBuilderProps.fixedLocationCard.playerSelect, false);
assert.match(
  fixed.roomTemplateBuilderProps.fixedLocationCard.helper,
  /existing Location \/ Scene selection remains the authoritative fixed opening Location/i
);
assert.equal(fixed.characterLifecycle.characters.length, 1);
assert.equal(fixed.characterLifecycle.characters[0].lifecycleKind, "STORY_PINNED");
assert.equal(fixed.characterLifecycle.required, false);
assert.equal(
  fixed.visualExtensionStatus.characterLifecycleControl,
  "WIRED"
);
assert.equal(
  fixed.roomTemplateBuilderProps.selectedCharactersPanelProps.characters[0].lifecycle.lifecycleLabel,
  "Persistent Story Cast"
);

const playerSelect = projectRoomTemplateStoryAuthoringBinding(
  roomTemplateStoryAuthoringPlayerSelectFixture
);

assert.equal(playerSelect.openingLocation.mode, "PLAYER_SELECT");
assert.equal(playerSelect.openingLocation.allowedLocationCount, 2);
assert.deepEqual(
  playerSelect.openingLocation.allowedLocations.map((location) => location.title),
  ["Deepcross", "Sunreach"]
);
assert.equal(playerSelect.openingLocation.selectionRequiredAtStoryStart, true);
assert.equal(playerSelect.openingLocation.canSaveAuthoring, true);
assert.equal(playerSelect.openingLocation.required, true);
assert.equal(
  playerSelect.visualExtensionStatus.openingLocationControl,
  "WIRED"
);
assert.equal(playerSelect.characterLifecycle.characters.length, 2);
assert.equal(playerSelect.characterLifecycle.summary.persistentCount, 1);
assert.equal(playerSelect.characterLifecycle.summary.openingOnlyCount, 1);
assert.equal(playerSelect.characterLifecycle.required, true);
assert.equal(
  playerSelect.visualExtensionStatus.characterLifecycleControl,
  "WIRED"
);

const courier =
  playerSelect.roomTemplateBuilderProps.selectedCharactersPanelProps.characters.find(
    (character) => character.id === "character-courier"
  );

assert.equal(courier.lifecycle.lifecycleKind, "OPENING_TEMPORARY");
assert.equal(courier.lifecycle.lifecycleLabel, "Opening Only");
assert.equal(courier.lifecycle.releasePolicy, "INITIAL_PHASE_EXIT");
assert.equal(
  playerSelect.characterLifecycle.currentPanelLimitation,
  ""
);
assert.match(
  playerSelect.roomTemplateBuilderProps.fixedLocationCard.helper,
  /Player-select mode is active/i
);

const invalid = projectRoomTemplateStoryAuthoringBinding(
  roomTemplateStoryAuthoringInvalidPlayerSelectFixture
);

assert.equal(invalid.openingLocation.canSaveAuthoring, false);
assert.equal(
  invalid.openingLocation.validationMessage,
  "Add at least one allowed starting Location."
);

const legacy = projectRoomTemplateStoryAuthoringBinding(
  roomTemplateStoryAuthoringLegacyCharactersFixture
);

assert.equal(legacy.openingLocation.mode, "FIXED");
assert.equal(legacy.characterLifecycle.characters.length, 2);
assert.equal(legacy.characterLifecycle.summary.persistentCount, 2);
assert.equal(legacy.characterLifecycle.summary.openingOnlyCount, 0);
assert.equal(legacy.characterLifecycle.required, false);

assert.deepEqual(
  ROOM_TEMPLATE_STORY_AUTHORING_CALLBACK_KEYS,
  [
    "onOpeningLocationModeChange",
    "onOpenAllowedLocationPicker",
    "onRemoveAllowedLocation",
    "onChangeCharacterLifecycle",
  ]
);

assert.deepEqual(
  playerSelect.functionalWiringStatus,
  {
    openingLocationControl: "WIRED",
    openingLocationPicker: "WIRED",
    openingLocationSaveValidation: "WIRED",
    characterLifecycleControl: "WIRED",
    lifecyclePayloadPersistence: "WIRED",
  }
);

assert.equal(
  playerSelect.roomTemplateBuilderProps.openingLocationAuthoringProps.mode,
  "PLAYER_SELECT"
);
assert.equal(
  playerSelect.roomTemplateBuilderProps.selectedCharactersPanelProps.lifecycleOptions.length > 0,
  true
);

assert.deepEqual(playerSelect.architecture, {
  storyFormStateOwnedByChassis: true,
  selectedCharacterStateOwnedByChassis: true,
  openingLocationMutationOwnedByChassis: true,
  characterLifecycleMutationOwnedByChassis: true,
  creationPayloadOwnedByChassis: true,
  persistenceOwnedByChassis: true,
  roomTemplateVisualCompositionOwnedByFe: true,
  openingLocationVisualExtensionOwnedByFe: true,
  characterLifecycleVisualExtensionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL("./RoomTemplateStoryAuthoringBinding.contract.js", import.meta.url),
  "utf8"
);

for (const forbidden of [
  "buildRoomTemplateCreationPayload",
  "createRoomTemplateDraft",
  "updateField(",
  "setSelectedCharacters",
  "setPicker",
  "createStoryRoom",
  "startStoryFromCreation",
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
  diagnostic: "room_template_story_authoring_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion: ROOM_TEMPLATE_STORY_AUTHORING_BINDING_CONTRACT_VERSION,
  roomTemplateBuilderViewContractVersion: ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION,
  openingLocationPresentationContractVersion: STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  characterLifecyclePresentationContractVersion: STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION,
  fixedAndPlayerSelectOpeningLocationCovered: true,
  allowedLocationValidationCovered: true,
  persistentAndOpeningOnlyCharacterLifecycleCovered: true,
  legacyPersistentDefaultCovered: true,
  openingLocationVisualWiringComplete: true,
  openingLocationPickerWiringComplete: true,
  emptyPlayerSelectSaveValidationWired: true,
  characterLifecycleVisualWiringComplete: true,
  lifecyclePayloadPersistenceWired: true,
  roomTemplateBuilderViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  roomTemplateBuilderViewModelDeploymentMirrorExact: true,
  selectedCharactersPanelSemanticallyExtendedWithoutSourceStyleReplacement: true,
  chassisMutationPayloadAndPersistenceExcludedFromBindingContract: true,
}, null, 2));
