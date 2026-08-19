import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_OPENING_LOCATION_AUTHORING_VERSION,
  STORY_OPENING_LOCATION_MODES,
} from "../../room-templates/story-opening-location-authoring/StoryOpeningLocationAuthoring.contract.js";

import {
  STORY_START_OPENING_LOCATION_CALLBACK_KEYS,
  STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  projectStoryStartOpeningLocationPresentation,
} from "./StoryStartOpeningLocationPresentation.contract.js";

import {
  storyStartOpeningLocationClosedFixture,
  storyStartOpeningLocationEmptyAllowedSetFixture,
  storyStartOpeningLocationFixedFixture,
  storyStartOpeningLocationInvalidSelectionFixture,
  storyStartOpeningLocationOpenFixture,
  storyStartOpeningLocationPendingFixture,
  storyStartOpeningLocationSelectedFixture,
} from "./StoryStartOpeningLocationPresentation.fixtures.js";

const closed =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationClosedFixture
  );

assert.equal(
  closed.contractVersion,
  STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  closed.authoringContractVersion,
  STORY_OPENING_LOCATION_AUTHORING_VERSION
);
assert.equal(
  closed.mode,
  STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
);
assert.equal(closed.selectionRequired, true);
assert.equal(closed.open, false);
assert.equal(closed.options.length, 3);
assert.equal(closed.actions.canConfirm, false);
assert.equal(closed.actions.confirmDisabled, true);

const open =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationOpenFixture
  );

assert.equal(open.open, true);
assert.equal(open.pending, false);
assert.equal(open.eyebrow, "Choose Starting Location");
assert.equal(
  open.description,
  "This Story lets the player choose where the opening hard state begins. Only the creator-authored Locations below are valid."
);
assert.equal(open.options.length, 3);
assert.equal(
  open.options.every((option) => option.selected === false),
  true
);
assert.equal(open.selectedLocationId, "");
assert.equal(open.selectedOption, null);
assert.equal(open.actions.cancelLabel, "Cancel");
assert.equal(open.actions.confirmLabel, "Start Here");
assert.equal(open.actions.cancelDisabled, false);
assert.equal(open.actions.confirmDisabled, true);
assert.equal(open.actions.canConfirm, false);

const selected =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationSelectedFixture
  );

assert.equal(
  selected.selectedLocationId,
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"
);
assert.equal(
  selected.selectedOption.title,
  "Sunreach"
);
assert.equal(
  selected.options.filter((option) => option.selected).length,
  1
);
assert.equal(
  selected.options.find((option) => option.selected).title,
  "Sunreach"
);
assert.equal(selected.actions.confirmDisabled, false);
assert.equal(selected.actions.canConfirm, true);

const pending =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationPendingFixture
  );

assert.equal(pending.pending, true);
assert.equal(
  pending.actions.confirmLabel,
  "Starting..."
);
assert.equal(
  pending.actions.cancelDisabled,
  true
);
assert.equal(
  pending.actions.confirmDisabled,
  true
);
assert.equal(
  pending.actions.canConfirm,
  false
);
assert.equal(
  pending.options.every((option) => option.disabled),
  true
);

const invalid =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationInvalidSelectionFixture
  );

assert.equal(invalid.selectedLocationId, "");
assert.equal(invalid.selectedOption, null);
assert.equal(invalid.actions.canConfirm, false);
assert.equal(
  invalid.errorMessage,
  "The selected starting Location is not allowed by this Story."
);

const empty =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationEmptyAllowedSetFixture
  );

assert.equal(empty.open, true);
assert.equal(empty.options.length, 0);
assert.equal(empty.actions.canConfirm, false);
assert.equal(
  empty.emptyState.title,
  "No starting Locations available"
);
assert.match(
  empty.emptyState.message,
  /requires a player-selected starting Location.*no creator-authored allowed Locations/i
);

const fixed =
  projectStoryStartOpeningLocationPresentation(
    storyStartOpeningLocationFixedFixture
  );

assert.equal(
  fixed.mode,
  STORY_OPENING_LOCATION_MODES.FIXED
);
assert.equal(fixed.selectionRequired, false);
assert.equal(fixed.open, false);
assert.equal(fixed.actions.canConfirm, false);
assert.equal(fixed.emptyState, null);

assert.deepEqual(
  STORY_START_OPENING_LOCATION_CALLBACK_KEYS,
  [
    "onSelect",
    "onCancel",
    "onConfirm",
  ]
);

assert.deepEqual(selected.architecture, {
  openingLocationConfigOwnedByChassis: true,
  allowedLocationIdsOwnedByChassis: true,
  selectedLocationValidationOwnedByChassis: true,
  roomCreationOwnedByChassis: true,
  openingHardStateCommitOwnedByChassis: true,
  pickerVisualCompositionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./StoryStartOpeningLocationPresentation.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "getStoryOpeningLocationStartConfig",
  "startStoryFromCreation",
  "playStoryTemplate",
  "createStoryRoom",
  "openingLocationId:",
  "allowedLocationIds.includes",
  "navigate(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "story_start_opening_location_fe_presentation_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  authoringContractVersion:
    STORY_OPENING_LOCATION_AUTHORING_VERSION,
  fixedModeSuppressionCovered: true,
  playerSelectPickerCovered: true,
  selectedOptionProjectionCovered: true,
  pendingStartStateCovered: true,
  invalidSelectionDegradedStateCovered: true,
  emptyAllowedSetDegradedStateCovered: true,
  chassisAllowedIdValidationExcluded: true,
  chassisRoomCreationExcluded: true,
}, null, 2));
