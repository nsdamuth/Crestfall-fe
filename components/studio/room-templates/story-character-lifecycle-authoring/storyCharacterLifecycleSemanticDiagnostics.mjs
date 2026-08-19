import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS,
  STORY_CHARACTER_LIFECYCLE_CALLBACK_KEYS,
  STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION,
  getStoryCharacterLifecycleAuthoringOption,
  normalizeStoryCharacterLifecycleAuthoringKind,
  patchStoryCharacterLifecycleSelection,
  projectStoryCharacterLifecyclePresentation,
} from "./StoryCharacterLifecycleAuthoring.contract.js";
import {
  storyCharacterLifecycleAliasFixture,
  storyCharacterLifecycleFilledFixture,
  storyCharacterLifecycleLegacyFixture,
} from "./StoryCharacterLifecycleAuthoring.fixtures.js";

const legacy = projectStoryCharacterLifecyclePresentation(
  storyCharacterLifecycleLegacyFixture
);
assert.equal(
  legacy.contractVersion,
  STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  legacy.authoringContractVersion,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION
);
assert.equal(legacy.fieldLabel, "Story lifecycle");
assert.equal(legacy.characters.length, 1);
assert.equal(
  legacy.characters[0].lifecycleKind,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED
);
assert.equal(
  legacy.characters[0].lifecycleLabel,
  "Persistent Story Cast"
);
assert.equal(legacy.characters[0].releasePolicy, "NEVER");
assert.equal(legacy.summary.persistentCount, 1);
assert.equal(legacy.summary.openingOnlyCount, 0);

const filled = projectStoryCharacterLifecyclePresentation(
  storyCharacterLifecycleFilledFixture
);
assert.equal(filled.characters.length, 3);
assert.equal(filled.summary.characterCount, 3);
assert.equal(filled.summary.persistentCount, 1);
assert.equal(filled.summary.openingOnlyCount, 2);
assert.equal(
  filled.characters[1].lifecycleLabel,
  "Opening Only"
);
assert.equal(
  filled.characters[1].releasePolicy,
  "INITIAL_PHASE_EXIT"
);
assert.equal(filled.characters[2].title, "Archive Guide");
assert.equal(
  filled.characters[2].lifecycleKind,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY
);

for (const alias of storyCharacterLifecycleAliasFixture) {
  assert.equal(
    normalizeStoryCharacterLifecycleAuthoringKind(alias),
    STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY
  );
}

assert.equal(
  normalizeStoryCharacterLifecycleAuthoringKind({
    lifecycle: { kind: "NOT_REAL" },
  }),
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED
);

const opening = patchStoryCharacterLifecycleSelection(
  {
    id: "55555555-5555-4555-8555-555555555555",
    title: "Opening Witness",
    customReferenceField: "preserve-me",
  },
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY
);
assert.equal(opening.lifecycle.kind, "OPENING_TEMPORARY");
assert.equal(
  opening.lifecycle.releasePolicy,
  "INITIAL_PHASE_EXIT"
);
assert.equal(
  opening.lifecycle.contractVersion,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION
);
assert.equal(opening.customReferenceField, "preserve-me");

const persistent = patchStoryCharacterLifecycleSelection(
  opening,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED
);
assert.equal(persistent.lifecycle.kind, "STORY_PINNED");
assert.equal(persistent.lifecycle.releasePolicy, "NEVER");
assert.equal(persistent.customReferenceField, "preserve-me");

const openingOption = getStoryCharacterLifecycleAuthoringOption(
  opening
);
assert.equal(openingOption.label, "Opening Only");
assert.match(openingOption.description, /initial Story phase exits/i);

assert.deepEqual(STORY_CHARACTER_LIFECYCLE_CALLBACK_KEYS, [
  "onChangeCharacterLifecycle",
]);

const source = fs.readFileSync(
  new URL(
    "./StoryCharacterLifecycleAuthoring.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "createStoryRoom",
  "startStoryFromCreation",
  "participant",
  "releaseParticipant",
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
    "story_character_lifecycle_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION,
  authoringContractVersion:
    STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
  persistentDefaultCovered: true,
  openingTemporaryCovered: true,
  legacyAliasNormalizationCovered: true,
  releasePoliciesCovered: true,
  selectionFieldPreservationCovered: true,
  runtimePresenceMutationExcluded: true,
}, null, 2));
