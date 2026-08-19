import assert from "node:assert/strict";

import {
  WALLET_CURRENCY_DEFINITION_VERSION,
  WALLET_PROFILE_CONTRACT_VERSION,
  validateWalletProfileEditorValue,
} from "./WalletProfileEditor.contract.js";
import {
  walletProfileEditorFilledFixture,
  walletProfileEditorFixture,
} from "./WalletProfileEditor.fixtures.js";

for (const fixture of [
  walletProfileEditorFixture,
  walletProfileEditorFilledFixture,
]) {
  const result = validateWalletProfileEditorValue(fixture.value);
  assert.equal(result.valid, true, JSON.stringify(result.issues, null, 2));
  assert.equal(result.normalized.contractVersion, WALLET_PROFILE_CONTRACT_VERSION);
}

const result = validateWalletProfileEditorValue(
  walletProfileEditorFilledFixture.value
);
const filled = result.normalized;

assert.equal(filled.currencies.length, 3);
assert.equal(result.metrics.currencyDefinitionCount, 3);
assert.equal(result.metrics.enabledCurrencyDefinitionCount, 3);

for (const currency of filled.currencies) {
  assert.equal(currency.definitionVersion, WALLET_CURRENCY_DEFINITION_VERSION);
  assert.equal(Object.hasOwn(currency, "currentBalance"), false);
  assert.equal(Object.hasOwn(currency, "spentBalance"), false);
  assert.equal(Object.hasOwn(currency, "accountCoinBalance"), false);
}

const crowns = filled.currencies.find(
  (currency) => currency.id === "currency.crowns"
);
assert.ok(crowns);
assert.equal(crowns.startingBalance, 250);
assert.equal(crowns.minimumBalance, 0);
assert.equal(crowns.maximumBalance, 999999);

const guildFavor = filled.currencies.find(
  (currency) => currency.id === "currency.guild_favor"
);
assert.ok(guildFavor);
assert.equal(guildFavor.maximumBalance, 100);

const oathDebt = filled.currencies.find(
  (currency) => currency.id === "currency.oath_debt"
);
assert.ok(oathDebt);
assert.equal(oathDebt.startingBalance, -25);
assert.equal(oathDebt.minimumBalance, -10000);
assert.equal(oathDebt.maximumBalance, 0);

const invalidBounds = validateWalletProfileEditorValue({
  ...filled,
  currencies: [
    {
      ...crowns,
      minimumBalance: 10,
      startingBalance: 5,
      maximumBalance: 2,
    },
  ],
});
assert.equal(invalidBounds.valid, false);
assert.equal(
  invalidBounds.errors.some(
    (issue) => issue.code === "WALLET_CURRENCY_BALANCE_BOUNDS_INVALID"
  ),
  true
);

assert.equal(
  filled.metadata.productCurrencyExcluded,
  true
);

console.log(JSON.stringify({
  diagnostic: "wallet_profile_fe_semantic_contract_v1",
  status: "PASSED",
  profileContractVersion: WALLET_PROFILE_CONTRACT_VERSION,
  filledCurrencyCount: filled.currencies.length,
  authoredDebtFloorCovered: true,
  boundedGameplayValueCovered: true,
  studioCoinsSeparated: true,
  runtimeBalancesExcluded: true,
}, null, 2));
