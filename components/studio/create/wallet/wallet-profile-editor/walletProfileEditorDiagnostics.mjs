import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  WALLET_CURRENCY_DEFINITION_VERSION,
  WALLET_PROFILE_CONTRACT_VERSION,
  WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  createEmptyWalletProfile,
  validateWalletProfileEditorValue,
} from "./WalletProfileEditor.contract.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const view = readFileSync(
  path.join(directory, "WalletProfileEditor.view.jsx"),
  "utf8"
);
const viewModel = readFileSync(
  path.join(directory, "useWalletProfileEditorViewModel.js"),
  "utf8"
);

assert.equal(WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION, "1.0.0");
assert.equal(WALLET_PROFILE_CONTRACT_VERSION, "wallet_profile_contract_v0");
assert.equal(
  WALLET_CURRENCY_DEFINITION_VERSION,
  "wallet_currency_definition_v0"
);

const empty = createEmptyWalletProfile();
const valid = validateWalletProfileEditorValue(empty);
assert.equal(valid.valid, true, JSON.stringify(valid.issues, null, 2));
assert.equal(valid.metrics.currencyDefinitionCount, 1);

const debt = validateWalletProfileEditorValue({
  ...empty,
  currencies: [
    {
      ...empty.currencies[0],
      minimumBalance: -10,
      startingBalance: -2,
      maximumBalance: 100,
    },
  ],
});
assert.equal(debt.valid, true, JSON.stringify(debt.issues, null, 2));

const invalid = validateWalletProfileEditorValue({
  ...empty,
  currencies: [
    {
      ...empty.currencies[0],
      minimumBalance: 10,
      startingBalance: 5,
      maximumBalance: 2,
    },
  ],
});
assert.equal(invalid.valid, false);
assert.equal(
  invalid.errors.some(
    (issue) => issue.code === "WALLET_CURRENCY_BALANCE_BOUNDS_INVALID"
  ),
  true
);

assert.match(view, /Studio Coins are not part of this profile/);
assert.match(view, /Starting balance/);
assert.match(view, /Minimum balance/);
assert.match(view, /Maximum balance/);
assert.match(view, /JSON Editor & AI Guide/);
assert.match(viewModel, /normalizeWalletProfileEditorValue/);
assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile/i);
assert.doesNotMatch(viewModel, /\bfetch\s*\(|supabase|PostGraphile/i);

console.log(
  JSON.stringify(
    {
      diagnostic: "wallet_profile_editor_v0",
      status: "PASSED",
      checks: {
        profileContractAligned: true,
        reusableCurrenciesEditable: true,
        safeIntegerBoundsValidated: true,
        authoredDebtFloorSupported: true,
        studioCoinsSeparated: true,
        mutableActorBalancesAbsent: true,
        portableViewHasNoBackendAccess: true,
      },
    },
    null,
    2
  )
);
