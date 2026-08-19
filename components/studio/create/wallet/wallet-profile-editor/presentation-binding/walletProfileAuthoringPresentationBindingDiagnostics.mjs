import assert from "node:assert/strict";
import fs from "node:fs";

import {
  WALLET_PROFILE_CONTRACT_VERSION,
  WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  WALLET_CURRENCY_DEFINITION_VERSION,
  WALLET_PROFILE_LIMITS,
} from "../WalletProfileEditor.contract.js";

import {
  WALLET_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  WALLET_PROFILE_CREATION_TYPE,
} from "../../wallet-profile-builder/WalletProfileBuilder.contract.js";

import {
  WALLET_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  WALLET_PROFILE_AUTHORING_CALLBACK_KEYS,
  projectWalletProfileAuthoringPresentationBinding,
} from "./WalletProfileAuthoringPresentationBinding.contract.js";

import {
  walletProfileAuthoringEmptyFixture,
  walletProfileAuthoringErrorFixture,
  walletProfileAuthoringJsonOpenFixture,
  walletProfileAuthoringValidFixture,
  walletProfileAuthoringWarningFixture,
} from "./WalletProfileAuthoringPresentationBinding.fixtures.js";

assert.equal(
  WALLET_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  "wallet_profile_authoring_presentation_binding_v1"
);

const valid =
  projectWalletProfileAuthoringPresentationBinding(
    walletProfileAuthoringValidFixture
  );

assert.equal(
  valid.bindingContractVersion,
  WALLET_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION
);

assert.equal(
  valid.editorViewContractVersion,
  WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION
);

assert.equal(
  valid.builderViewContractVersion,
  WALLET_PROFILE_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  valid.profileContractVersion,
  WALLET_PROFILE_CONTRACT_VERSION
);

assert.equal(
  valid.currencyDefinitionVersion,
  WALLET_CURRENCY_DEFINITION_VERSION
);

assert.equal(
  valid.creationType,
  WALLET_PROFILE_CREATION_TYPE
);

assert.equal(
  valid.creationType,
  "WALLET_PROFILE"
);

assert.deepEqual(valid.header, {
  eyebrow:
    "Gameplay Wallet Definition",
  title: "Wallet Profile",
  description:
    "Author reusable currencies and their starting and allowed balance bounds. Live balances remain isolated actor-owned Story state. Crestfall Studio Coins are not part of this profile.",
});

assert.deepEqual(valid.profile, {
  title:
    "Aethelgard Expedition Wallet",
  description:
    "Reusable in-world values for expedition play.",
  enabled: true,
});

assert.equal(
  valid.validation.state,
  "VALID"
);

assert.equal(
  valid.validation.valid,
  true
);

assert.equal(
  valid.validation.validMessage,
  "Wallet Profile definitions are valid."
);

assert.deepEqual(
  valid.currencies.summary,
  {
    currencyDefinitionCount: 4,
    enabledCurrencyDefinitionCount: 3,
    debtLikeCurrencyCount: 1,
  }
);

assert.equal(
  valid.currencies.maxCount,
  WALLET_PROFILE_LIMITS.maxCurrencies
);

assert.equal(
  valid.currencies.maxCount,
  32
);

assert.equal(
  valid.currencies.canAdd,
  true
);

assert.equal(
  valid.currencies.addLabel,
  "Add Currency"
);

assert.equal(
  valid.currencies.items.length,
  4
);

const crowns =
  valid.currencies.items[0];

assert.equal(
  crowns.definitionVersion,
  "wallet_currency_definition_v0"
);

assert.deepEqual(
  crowns.identity,
  {
    id: "currency.crowns",
    title: "Crowns",
    symbol: "Cr",
    description:
      "Common in-world tender used for ordinary purchases and rewards.",
    enabled: true,
    tags: [
      "currency",
      "trade",
    ],
  }
);

assert.deepEqual(
  crowns.balances,
  {
    startingBalance: 250,
    minimumBalance: 0,
    maximumBalance: 999999,
    debtLike: false,
    bounded: true,
    startingBalanceWithinBounds: true,
  }
);

assert.equal(
  crowns.debtPresentation.visible,
  false
);

const favor =
  valid.currencies.items[1];

assert.equal(
  favor.balances.maximumBalance,
  100
);

assert.equal(
  favor.balances.startingBalanceWithinBounds,
  true
);

const debt =
  valid.currencies.items[2];

assert.equal(
  debt.balances.startingBalance,
  -25
);

assert.equal(
  debt.balances.minimumBalance,
  -10000
);

assert.equal(
  debt.balances.maximumBalance,
  0
);

assert.equal(
  debt.balances.debtLike,
  true
);

assert.equal(
  debt.debtPresentation.visible,
  true
);

assert.equal(
  debt.debtPresentation.label,
  "Debt-like balance allowed"
);

assert.match(
  debt.debtPresentation.helper,
  /permits negative balances down to its authored minimum/i
);

assert.equal(
  valid.currencies.items[3].identity.enabled,
  false
);

assert.equal(
  valid.limits.maxCurrencies,
  32
);

assert.equal(
  valid.limits.maxIdentifierLength,
  96
);

assert.equal(
  valid.limits.maxTitleLength,
  160
);

assert.equal(
  valid.limits.maxDescriptionLength,
  2400
);

assert.equal(
  valid.limits.maxSymbolLength,
  16
);

assert.equal(
  Number.isSafeInteger(
    valid.limits.minimumSafeBalance
  ),
  true
);

assert.equal(
  Number.isSafeInteger(
    valid.limits.maximumSafeBalance
  ),
  true
);

assert.equal(
  valid.economyBoundary.studioCoinsExcluded,
  true
);

assert.equal(
  valid.economyBoundary.runtimeBalancesExcluded,
  true
);

assert.match(
  valid.economyBoundary.helper,
  /negative minimum balance is allowed/i
);

assert.match(
  valid.economyBoundary.helper,
  /Purchases, prices, exchange rates, escrow, reserved funds, and Crestfall Studio Coins are separate economy layers/i
);

const warning =
  projectWalletProfileAuthoringPresentationBinding(
    walletProfileAuthoringWarningFixture
  );

assert.equal(
  warning.validation.state,
  "WARNING"
);

assert.equal(
  warning.validation.valid,
  true
);

assert.equal(
  warning.validation.warnings.length,
  1
);

const error =
  projectWalletProfileAuthoringPresentationBinding(
    walletProfileAuthoringErrorFixture
  );

assert.equal(
  error.validation.state,
  "ERROR"
);

assert.equal(
  error.validation.valid,
  false
);

assert.equal(
  error.validation.errors[0].code,
  "WALLET_CURRENCY_BALANCE_BOUNDS_INVALID"
);

const jsonOpen =
  projectWalletProfileAuthoringPresentationBinding(
    walletProfileAuthoringJsonOpenFixture
  );

assert.equal(
  jsonOpen.jsonEditor.open,
  true
);

assert.equal(
  jsonOpen.jsonEditor.actionLabel,
  "JSON Editor & AI Guide"
);

assert.equal(
  jsonOpen.jsonEditor.visualStatus,
  "PENDING_FE_VISUAL_EXTENSION"
);

const empty =
  projectWalletProfileAuthoringPresentationBinding(
    walletProfileAuthoringEmptyFixture
  );

assert.equal(
  empty.currencies.items.length,
  0
);

assert.equal(
  empty.validation.state,
  "WARNING"
);

assert.equal(
  empty.currencies.emptyState,
  "No currencies are defined. Add a currency or use the JSON editor."
);

assert.deepEqual(
  valid.visualExtensionStatus,
  {
    profileEditor:
      "PENDING_FE_VISUAL_BUILD",
    jsonEditor:
      "PENDING_FE_VISUAL_EXTENSION",
  }
);

assert.deepEqual(
  WALLET_PROFILE_AUTHORING_CALLBACK_KEYS,
  [
    "onUpdateProfileField",
    "onAddCurrency",
    "onRemoveCurrency",
    "onUpdateCurrencyField",
    "onOpenJsonEditor",
  ]
);

assert.deepEqual(
  valid.architecture,
  {
    profileNormalizationOwnedByChassis: true,
    profileValidationOwnedByChassis: true,
    editorMutationOwnedByChassis: true,
    jsonValidationOwnedByChassis: true,
    creationPayloadOwnedByChassis: true,
    persistenceOwnedByChassis: true,
    actorRuntimeBalancesExcluded: true,
    studioCoinEconomyExcluded: true,
    runtimeWalletMutationOwnedByChassis: true,
    editorVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./WalletProfileAuthoringPresentationBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "normalizeWalletProfileEditorValue",
  "validateWalletProfileEditorValue",
  "normalizeWalletCurrencyDefinition",
  "commit(",
  "setJsonEditorOpen",
  "applyJsonProfile",
  "updateProfileField(",
  "updateCurrencyField(",
  "spendProfileCoins",
  "useStudioAccount",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useMemo(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "wallet_profile_authoring_presentation_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    WALLET_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  editorViewContractVersion:
    WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  builderViewContractVersion:
    WALLET_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  profileContractVersion:
    WALLET_PROFILE_CONTRACT_VERSION,
  currencyDefinitionVersion:
    WALLET_CURRENCY_DEFINITION_VERSION,
  creationType:
    WALLET_PROFILE_CREATION_TYPE,
  currencyDefinitionAndBalanceBoundsCovered: true,
  positiveBoundedAndDebtLikeValuesCovered: true,
  validationStatesCovered: true,
  studioCoinsAndRuntimeBalancesExcluded: true,
  jsonEditorPendingVisualExtensionExplicit: true,
  profileEditorPendingVisualBuildExplicit: true,
  chassisNormalizationValidationMutationPersistenceExcluded: true,
}, null, 2));
