import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
} from "./ActorMechanicsProfileEditor.contract.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const viewModelSource = readFileSync(
  path.join(currentDirectory, "useActorMechanicsProfileEditorViewModel.js"),
  "utf8"
);
const viewSource = readFileSync(
  path.join(currentDirectory, "ActorMechanicsProfileEditor.view.jsx"),
  "utf8"
);

assert.equal(ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION, "1.2.0");
assert.equal(
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
  "PROGRESSION_PROFILE"
);
assert.equal(
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
  "progression_profile_contract_v0"
);
assert.match(viewModelSource, /definitionReferenceMode:[\s\S]*PROGRESSION_PROFILE/);
assert.match(viewModelSource, /createProgressionProfileReference/);
assert.match(viewModelSource, /allowedTypes:[\s\S]*ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE/);
assert.match(viewModelSource, /Actor experience and level state are not copied or initialized/);
assert.match(viewSource, /Select Progression Profile/);
assert.match(viewSource, /Replace Progression Profile/);
assert.match(viewSource, /onOpenProgressionProfilePicker/);
assert.match(viewSource, /progression_profile_contract_v0/);

console.log(
  JSON.stringify(
    {
      diagnostic: "actor_mechanics_profile_progression_reference_ui_v0",
      status: "PASSED",
      viewContractVersion:
        ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
      creationType: ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
      profileContractVersion:
        ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
      pickerAvailable: true,
      definitionOnly: true,
      actorStateCreated: false,
    },
    null,
    2
  )
);
