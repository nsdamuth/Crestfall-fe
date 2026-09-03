import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CHARACTER_DECISION_PRIORITY_OPTIONS,
  NARRATOR_PRESENTATION_PRIORITY_OPTIONS,
  getDefaultPriorityOrder,
  isCompletePriorityPermutation,
  movePriorityItem,
  normalizePriorityOrder,
} from "./priorityTriadEditorContract.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../../");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

function permutations(values) {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) =>
    permutations(values.filter((_, i) => i !== index)).map((rest) => [
      value,
      ...rest,
    ])
  );
}

const characterValues = getDefaultPriorityOrder(
  CHARACTER_DECISION_PRIORITY_OPTIONS
);
const narratorValues = getDefaultPriorityOrder(
  NARRATOR_PRESENTATION_PRIORITY_OPTIONS
);

assert.deepEqual(characterValues, ["LOGOS", "PATHOS", "ETHOS"]);
assert.deepEqual(narratorValues, ["KAIROS", "TOPOS", "MYTHOS"]);

const characterPermutations = permutations(characterValues);
const narratorPermutations = permutations(narratorValues);
assert.equal(characterPermutations.length, 6);
assert.equal(narratorPermutations.length, 6);

for (const order of characterPermutations) {
  assert.equal(
    isCompletePriorityPermutation(order, CHARACTER_DECISION_PRIORITY_OPTIONS),
    true
  );
  assert.deepEqual(
    normalizePriorityOrder(order, CHARACTER_DECISION_PRIORITY_OPTIONS),
    order
  );
}

for (const order of narratorPermutations) {
  assert.equal(
    isCompletePriorityPermutation(
      order,
      NARRATOR_PRESENTATION_PRIORITY_OPTIONS
    ),
    true
  );
  assert.deepEqual(
    normalizePriorityOrder(order, NARRATOR_PRESENTATION_PRIORITY_OPTIONS),
    order
  );
}

assert.equal(
  normalizePriorityOrder(undefined, CHARACTER_DECISION_PRIORITY_OPTIONS),
  null
);
assert.equal(
  normalizePriorityOrder(null, NARRATOR_PRESENTATION_PRIORITY_OPTIONS),
  null
);
assert.equal(
  normalizePriorityOrder(["LOGOS", "LOGOS", "ETHOS"], CHARACTER_DECISION_PRIORITY_OPTIONS),
  null
);
assert.equal(
  normalizePriorityOrder(["KAIROS", "TOPOS"], NARRATOR_PRESENTATION_PRIORITY_OPTIONS),
  null
);
assert.equal(
  normalizePriorityOrder(["KAIROS", "TOPOS", "UNKNOWN"], NARRATOR_PRESENTATION_PRIORITY_OPTIONS),
  null
);

assert.deepEqual(
  movePriorityItem(["LOGOS", "PATHOS", "ETHOS"], 0, 1),
  ["PATHOS", "LOGOS", "ETHOS"]
);
assert.deepEqual(
  movePriorityItem(["KAIROS", "TOPOS", "MYTHOS"], 2, -1),
  ["KAIROS", "MYTHOS", "TOPOS"]
);

const characterVm = read(
  "components/studio/my-creations/edit/sections/character-behavior-section/useCharacterBehaviorSectionViewModel.js"
);
const characterShell = read(
  "components/studio/my-creations/edit/sections/BehaviorSection.jsx"
);
const narratorVm = read(
  "components/studio/my-creations/edit/sections/narrators/narrator-guidance-section/useNarratorGuidanceSectionViewModel.js"
);
const narratorShell = read(
  "components/studio/my-creations/edit/sections/narrators/NarratorGuidanceSection.jsx"
);
const editor = read(
  "components/studio/my-creations/edit/priority-triads/PriorityTriadEditor.jsx"
);

assert.match(characterVm, /data\.decisionPriorities/);
assert.match(characterVm, /updateDataField\?\.\("decisionPriorities", value\)/);
assert.match(characterVm, /PLAYER_CHARACTER/);
assert.match(characterVm, /showDecisionPriorities: !isPlayerCharacter/);
assert.match(characterShell, /viewProps\.showDecisionPriorities/);
assert.match(characterShell, /PriorityTriadEditor/);

assert.match(narratorVm, /data\.presentationPriorities/);
assert.match(
  narratorVm,
  /updateDataField\?\.\("presentationPriorities", value\)/
);
assert.match(narratorVm, /story-pressure reasoning/i);
assert.match(narratorShell, /PriorityTriadEditor/);
assert.match(narratorShell, /presentationPrioritiesControl/);

assert.match(editor, /No priority ordering is set/);
assert.match(editor, /Current runtime behavior remains unchanged/);
assert.match(editor, /onChange\?\.\(null\)/);
assert.match(editor, /Move \$\{priority\} up/);
assert.match(editor, /Move \$\{priority\} down/);

const characterCreateSources = [
  "components/studio/create/character/characterCreationMode.js",
  "components/studio/create/character/character-creator/useCharacterCreatorViewModel.js",
  "components/studio/create/character/creator-stops/CharacterCreatorModal.jsx",
].map(read).join("\n");
const narratorCreateSources = [
  "components/studio/create/narrator/narrator-builder/useNarratorBuilderViewModel.js",
  "components/studio/create/narrator/NarratorBuilderEditor.jsx",
].filter((relativePath) => fs.existsSync(path.join(repoRoot, relativePath))).map(read).join("\n");

assert.doesNotMatch(characterCreateSources, /decisionPriorities/);
assert.doesNotMatch(narratorCreateSources, /presentationPriorities/);

console.log(
  JSON.stringify(
    {
      diagnostic: "character_narrator_priority_triads_editor_v1",
      status: "PASSED",
      characterPermutationsRoundTrip: 6,
      narratorPermutationsRoundTrip: 6,
      unsetPreservesCurrentBehavior: true,
      clearReturnsToUnset: true,
      invalidValuesDoNotBecomeAuthoredOrder: true,
      playerCharacterControlExcluded: true,
      characterCreateSurfaceUnchanged: true,
      narratorCreateSurfaceUnchanged: true,
      characterEditorStorageMappingPresent: true,
      narratorEditorStorageMappingPresent: true,
      narratorPressureSemanticsVisible: true,
    },
    null,
    2
  )
);
