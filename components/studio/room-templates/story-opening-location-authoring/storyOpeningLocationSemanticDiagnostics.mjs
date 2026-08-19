import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_OPENING_LOCATION_AUTHORING_VERSION,
  STORY_OPENING_LOCATION_CALLBACK_KEYS,
  STORY_OPENING_LOCATION_MODES,
  STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  buildFixedOpeningLocationConfig,
  buildPlayerSelectableOpeningLocationConfig,
  normalizeStoryOpeningLocationAuthoring,
  normalizeStoryOpeningLocationReference,
  projectStoryOpeningLocationAuthoringPresentation,
  toggleOpeningLocationReference,
} from "./StoryOpeningLocationAuthoring.contract.js";
import {
  storyOpeningLocationFixedFixture,
  storyOpeningLocationInvalidEmptyPlayerSelectFixture,
  storyOpeningLocationMissingReferenceFixture,
  storyOpeningLocationOptionsFixture,
  storyOpeningLocationPlayerSelectFixture,
  storyOpeningLocationStoredFallbackFixture,
} from "./StoryOpeningLocationAuthoring.fixtures.js";

const fixed = projectStoryOpeningLocationAuthoringPresentation(
  storyOpeningLocationFixedFixture
);

assert.equal(
  fixed.contractVersion,
  STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  fixed.authoringVersion,
  STORY_OPENING_LOCATION_AUTHORING_VERSION
);
assert.equal(
  fixed.mode,
  STORY_OPENING_LOCATION_MODES.FIXED
);
assert.equal(
  fixed.fixedLocationId,
  "cccccccc-cccc-4ccc-8ccc-cccccccccccc"
);
assert.equal(fixed.playerSelect, false);
assert.equal(fixed.selectionRequiredAtStoryStart, false);
assert.equal(fixed.canSaveAuthoring, true);

const playerSelect =
  projectStoryOpeningLocationAuthoringPresentation(
    storyOpeningLocationPlayerSelectFixture
  );

assert.equal(
  playerSelect.mode,
  STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
);
assert.equal(playerSelect.playerSelect, true);
assert.equal(playerSelect.selectionRequiredAtStoryStart, true);
assert.equal(playerSelect.allowedLocationCount, 2);
assert.deepEqual(
  playerSelect.allowedLocations.map(
    (location) => location.title
  ),
  ["Deepcross", "Sunreach"]
);
assert.equal(playerSelect.validationMessage, "");
assert.equal(playerSelect.canSaveAuthoring, true);

const built = buildPlayerSelectableOpeningLocationConfig([
  storyOpeningLocationOptionsFixture[0],
  storyOpeningLocationOptionsFixture[1],
  storyOpeningLocationOptionsFixture[1],
]);

assert.equal(
  built.mode,
  STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
);
assert.deepEqual(built.allowedLocationIds, [
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
]);

const toggled = toggleOpeningLocationReference(
  built.allowedLocations,
  storyOpeningLocationOptionsFixture[1]
);
assert.deepEqual(
  toggled.map((location) => location.id),
  ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"]
);

const toggledBack = toggleOpeningLocationReference(
  toggled,
  storyOpeningLocationOptionsFixture[1]
);
assert.deepEqual(
  toggledBack.map((location) => location.id),
  [
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  ]
);

const fixedBuilt = buildFixedOpeningLocationConfig(
  storyOpeningLocationOptionsFixture[2]
);
assert.deepEqual(fixedBuilt, {
  version: STORY_OPENING_LOCATION_AUTHORING_VERSION,
  mode: STORY_OPENING_LOCATION_MODES.FIXED,
  fixedLocationId:
    "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
});

const storedFallback =
  projectStoryOpeningLocationAuthoringPresentation(
    storyOpeningLocationStoredFallbackFixture
  );
assert.equal(storedFallback.allowedLocationCount, 1);
assert.equal(
  storedFallback.allowedLocations[0].title,
  "Stored-Only Ruins"
);
assert.equal(
  storedFallback.allowedLocations[0].contentRating,
  "MATURE"
);

const missingReference =
  projectStoryOpeningLocationAuthoringPresentation(
    storyOpeningLocationMissingReferenceFixture
  );
assert.equal(missingReference.allowedLocationCount, 1);
assert.equal(
  missingReference.allowedLocations[0].title,
  "Location eeeeeeee"
);
assert.equal(
  missingReference.allowedLocations[0].contentRating,
  "SFW"
);

const invalid =
  projectStoryOpeningLocationAuthoringPresentation(
    storyOpeningLocationInvalidEmptyPlayerSelectFixture
  );
assert.equal(invalid.playerSelect, true);
assert.equal(invalid.allowedLocationCount, 0);
assert.equal(invalid.canSaveAuthoring, false);
assert.equal(
  invalid.validationMessage,
  "Add at least one allowed starting Location."
);

const legacy = normalizeStoryOpeningLocationAuthoring({
  locationId:
    "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
});
assert.equal(
  legacy.fixedLocationId,
  "cccccccc-cccc-4ccc-8ccc-cccccccccccc"
);

const normalizedReference =
  normalizeStoryOpeningLocationReference({
    creation_id:
      "ffffffff-ffff-4fff-8fff-ffffffffffff",
    description: "Alias description",
    content_rating: "TEEN",
    thumbnailUrl: "/fixtures/thumb.webp",
  });
assert.equal(
  normalizedReference.id,
  "ffffffff-ffff-4fff-8fff-ffffffffffff"
);
assert.equal(normalizedReference.title, "Location");
assert.equal(normalizedReference.subtitle, "Alias description");
assert.equal(normalizedReference.contentRating, "TEEN");
assert.equal(
  normalizedReference.imageUrl,
  "/fixtures/thumb.webp"
);

assert.deepEqual(STORY_OPENING_LOCATION_CALLBACK_KEYS, [
  "onModeChange",
  "onOpenLocationPicker",
  "onRemoveAllowedLocation",
]);

const source = fs.readFileSync(
  new URL(
    "./StoryOpeningLocationAuthoring.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "startStoryFromCreation",
  "createStoryRoom",
  "crestfallApiRequest",
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
    "story_opening_location_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  authoringVersion:
    STORY_OPENING_LOCATION_AUTHORING_VERSION,
  fixedModeCovered: true,
  playerSelectModeCovered: true,
  allowedSetValidationCovered: true,
  duplicateSuppressionCovered: true,
  storedReferenceFallbackCovered: true,
  legacyFixedLocationCompatibilityCovered: true,
  runtimeRoomCreationExcluded: true,
}, null, 2));
