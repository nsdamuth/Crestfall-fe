import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  formatWalletProfileJsonData,
  validateWalletProfileJsonText,
} from "./walletProfileJsonEditor.validation.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const view = readFileSync(
  path.join(directory, "WalletProfileJsonEditorModal.view.jsx"),
  "utf8"
);
const viewModel = readFileSync(
  path.join(directory, "useWalletProfileJsonEditorViewModel.js"),
  "utf8"
);
const guide = readFileSync(
  path.join(directory, "walletProfileJsonAiAuthoringGuide.js"),
  "utf8"
);

const profile = {
  contractVersion: "wallet_profile_contract_v0",
  title: "QA Wallet",
  description: "Wallet JSON diagnostic.",
  enabled: true,
  currencies: [
    {
      definitionVersion: "wallet_currency_definition_v0",
      id: "currency.crowns",
      title: "Crowns",
      symbol: "Cr",
      description: "",
      enabled: true,
      startingBalance: 25,
      minimumBalance: 0,
      maximumBalance: 1000,
      tags: ["coin"],
      metadata: {},
    },
  ],
  metadata: {},
};

const valid = validateWalletProfileJsonText(
  formatWalletProfileJsonData(profile)
);
assert.equal(valid.valid, true, JSON.stringify(valid.errors, null, 2));
assert.equal(valid.data.currencies[0].startingBalance, 25);

const forbidden = validateWalletProfileJsonText(
  JSON.stringify({
    ...profile,
    balances: [{ currencyId: "currency.crowns", balance: 25 }],
  })
);
assert.equal(forbidden.valid, false);
assert.equal(
  forbidden.errors.some(
    (issue) => issue.code === "WALLET_PROFILE_ACTOR_STATE_FORBIDDEN"
  ),
  true
);

assert.match(view, /Validate & Apply/);
assert.match(view, /Wallet Profile JSON/);
assert.match(viewModel, /buildWalletProfileJsonAiAuthoringGuide/);
assert.match(viewModel, /validateWalletProfileJsonText/);
assert.match(guide, /Studio\/account Coins are product currency/);
assert.match(guide, /Do not add live balances/);

console.log(
  JSON.stringify(
    {
      diagnostic: "wallet_profile_json_editor_v0",
      status: "PASSED",
      checks: {
        completeObjectRoundTrip: true,
        actorBalanceStateRejected: true,
        visualApplyBoundaryPreserved: true,
        aiGuideContainsProductCurrencyBoundary: true,
      },
    },
    null,
    2
  )
);
