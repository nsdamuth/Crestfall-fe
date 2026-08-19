import assert from "node:assert/strict";
import fs from "node:fs";

import {
  LOCATION_ONLY_SCENERY_CALLBACK_KEYS,
  LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,
  isLocationOnlySceneryComposition,
  projectLocationOnlySceneryPresentation,
} from "./LocationOnlySceneryPresentation.contract.js";
import {
  locationOnlySceneryCharacterFixture,
  locationOnlySceneryDisabledFixture,
  locationOnlySceneryEmptyFixture,
  locationOnlySceneryLocationFixture,
  locationOnlySceneryPlayerCharacterFixture,
  locationOnlySceneryVideoFixture,
} from "./LocationOnlySceneryPresentation.fixtures.js";

assert.equal(
  isLocationOnlySceneryComposition(
    locationOnlySceneryLocationFixture.selectedIngredients
  ),
  true
);
assert.equal(
  isLocationOnlySceneryComposition(
    locationOnlySceneryCharacterFixture.selectedIngredients
  ),
  false
);
assert.equal(
  isLocationOnlySceneryComposition(
    locationOnlySceneryPlayerCharacterFixture.selectedIngredients
  ),
  false
);
assert.equal(
  isLocationOnlySceneryComposition(
    locationOnlySceneryEmptyFixture.selectedIngredients
  ),
  false
);

const locationOnly = projectLocationOnlySceneryPresentation(
  locationOnlySceneryLocationFixture
);
assert.equal(
  locationOnly.contractVersion,
  LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION
);
assert.equal(locationOnly.visible, true);
assert.equal(locationOnly.eligible, true);
assert.equal(locationOnly.enabled, true);
assert.equal(locationOnly.disabled, false);
assert.equal(locationOnly.mode, "IMAGE");
assert.equal(
  locationOnly.locationLabel,
  "The Brasswhisker's Workshop"
);
assert.equal(locationOnly.title, "Optimize for scenery-only image");
assert.match(locationOnly.description, /suppresses people/i);

const disabled = projectLocationOnlySceneryPresentation(
  locationOnlySceneryDisabledFixture
);
assert.equal(disabled.visible, true);
assert.equal(disabled.enabled, false);
assert.equal(disabled.helperStateLabel, "Off");

const withCharacter = projectLocationOnlySceneryPresentation(
  locationOnlySceneryCharacterFixture
);
assert.equal(withCharacter.visible, false);
assert.equal(withCharacter.eligible, false);
assert.equal(withCharacter.disabled, true);

const withPlayerCharacter = projectLocationOnlySceneryPresentation(
  locationOnlySceneryPlayerCharacterFixture
);
assert.equal(withPlayerCharacter.visible, false);
assert.equal(withPlayerCharacter.eligible, false);

const video = projectLocationOnlySceneryPresentation(
  locationOnlySceneryVideoFixture
);
assert.equal(video.eligible, true);
assert.equal(video.visible, false);
assert.equal(video.mode, "VIDEO");
assert.equal(video.disabled, true);

const empty = projectLocationOnlySceneryPresentation(
  locationOnlySceneryEmptyFixture
);
assert.equal(empty.visible, false);
assert.equal(empty.eligible, false);

assert.deepEqual(LOCATION_ONLY_SCENERY_CALLBACK_KEYS, [
  "onChangeEnabled",
]);

const source = fs.readFileSync(
  new URL("./LocationOnlySceneryPresentation.contract.js", import.meta.url),
  "utf8"
);

for (const forbidden of [
  "LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT",
  "no_humans",
  "scenery_porn",
  "appendPromptFragment",
  "fetch(",
  "@/lib/client",
  "provider",
  "generationPayload",
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
  diagnostic: "location_only_scenery_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    LOCATION_ONLY_SCENERY_PRESENTATION_CONTRACT_VERSION,
  locationOnlyEligibilityCovered: true,
  characterSuppressionGuardCovered: true,
  playerCharacterSuppressionGuardCovered: true,
  imageModeVisibilityCovered: true,
  optOutStateCovered: true,
  promptFragmentExcluded: true,
  generationBehaviorExcluded: true,
}, null, 2));
