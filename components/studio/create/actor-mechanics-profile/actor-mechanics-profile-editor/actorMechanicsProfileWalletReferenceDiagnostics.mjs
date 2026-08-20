import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_WALLET_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE,
} from "./ActorMechanicsProfileEditor.contract.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const viewModel = readFileSync(
  path.join(directory, "useActorMechanicsProfileEditorViewModel.js"),
  "utf8"
);
const view = readFileSync(
  path.join(directory, "ActorMechanicsProfileEditor.view.jsx"),
  "utf8"
);

assert.equal(ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION, "1.5.0");
assert.equal(ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE, "WALLET_PROFILE");
assert.equal(
  ACTOR_MECHANICS_PROFILE_WALLET_CONTRACT_VERSION,
  "wallet_profile_contract_v0"
);
assert.match(viewModel, /createWalletProfileReference/);
assert.match(viewModel, /binding\.domain === "WALLET"/);
assert.match(viewModel, /definitionReferenceMode:[\s\S]*WALLET_PROFILE/);
assert.match(
  viewModel,
  /allowedTypes:[\s\S]*ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE/
);
assert.match(
  viewModel,
  /Live actor balances, revisions, and transaction history are not copied or initialized/
);
assert.match(view, /Select Wallet Profile/);
assert.match(view, /Replace Wallet Profile/);
assert.match(view, /onOpenWalletProfilePicker/);
assert.match(view, /wallet_profile_contract_v0/);
assert.match(
  view,
  /Live balances, revisions, and transaction history remain owner-scoped/
);

console.log(
  JSON.stringify(
    {
      diagnostic: "actor_mechanics_profile_wallet_reference_ui_v0",
      status: "PASSED",
      viewContractVersion: ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
      creationType: ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE,
      profileContractVersion:
        ACTOR_MECHANICS_PROFILE_WALLET_CONTRACT_VERSION,
      domain: "WALLET",
      pickerAvailable: true,
      definitionOnly: true,
      actorStateCreated: false,
    },
    null,
    2
  )
);
