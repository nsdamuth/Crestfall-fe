import {
  WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  WALLET_PROFILE_CONTRACT_VERSION,
  WALLET_CURRENCY_DEFINITION_VERSION,
  WALLET_PROFILE_LIMITS,
} from "../WalletProfileEditor.contract.js";

import {
  WALLET_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  WALLET_PROFILE_CREATION_TYPE,
} from "../../wallet-profile-builder/WalletProfileBuilder.contract.js";

export const WALLET_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION =
  "wallet_profile_authoring_presentation_binding_v1";

export const WALLET_PROFILE_AUTHORING_CALLBACK_KEYS = Object.freeze([
  "onUpdateProfileField",
  "onAddCurrency",
  "onRemoveCurrency",
  "onUpdateCurrencyField",
  "onOpenJsonEditor",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : fallback;
}

function issueProjection(issue = {}) {
  const source = object(issue);

  return {
    code: text(source.code),
    path: text(source.path),
    message: text(source.message),
    severity:
      text(source.severity).toUpperCase() || "ERROR",
  };
}

function currencyProjection(currency = {}, index = 0) {
  const source = object(currency);

  const minimumBalance = integer(
    source.minimumBalance,
    0
  );
  const maximumBalance = integer(
    source.maximumBalance,
    WALLET_PROFILE_LIMITS.maxBalance
  );
  const startingBalance = integer(
    source.startingBalance,
    0
  );

  const debtLike = minimumBalance < 0;

  return {
    index,
    key:
      text(source.id) ||
      `currency-${index + 1}`,

    definitionVersion:
      text(source.definitionVersion) ||
      WALLET_CURRENCY_DEFINITION_VERSION,

    identity: {
      id: text(source.id),
      title:
        text(source.title) ||
        text(source.id) ||
        `Currency ${index + 1}`,
      symbol: text(source.symbol),
      description:
        text(source.description),
      enabled:
        source.enabled !== false,
      tags:
        array(source.tags)
          .map(text)
          .filter(Boolean),
    },

    balances: {
      startingBalance,
      minimumBalance,
      maximumBalance,
      debtLike,
      bounded:
        minimumBalance !==
          WALLET_PROFILE_LIMITS.minBalance ||
        maximumBalance !==
          WALLET_PROFILE_LIMITS.maxBalance,
      startingBalanceWithinBounds:
        startingBalance >= minimumBalance &&
        startingBalance <= maximumBalance,
    },

    debtPresentation: {
      visible: debtLike,
      label:
        debtLike
          ? "Debt-like balance allowed"
          : "",
      helper:
        debtLike
          ? "This creator-authored gameplay currency permits negative balances down to its authored minimum."
          : "",
    },

    removeLabel: "Remove",
  };
}

export function projectWalletProfileAuthoringPresentationBinding({
  profile = {},
  errors = [],
  warnings = [],
  metrics = {},
  jsonEditorOpen = false,
  callbacks = {},
} = {}) {
  const safeProfile = object(profile);
  const safeMetrics = object(metrics);
  const callbackSource = object(callbacks);

  const currencies =
    array(safeProfile.currencies)
      .map(currencyProjection);

  const projectedErrors =
    array(errors).map(issueProjection);

  const projectedWarnings =
    array(warnings).map(issueProjection);

  const validationState =
    projectedErrors.length > 0
      ? "ERROR"
      : projectedWarnings.length > 0
        ? "WARNING"
        : "VALID";

  const debtLikeCurrencyCount =
    currencies.filter(
      (currency) =>
        currency.balances.debtLike
    ).length;

  return {
    bindingContractVersion:
      WALLET_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,

    editorViewContractVersion:
      WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,

    builderViewContractVersion:
      WALLET_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,

    profileContractVersion:
      text(safeProfile.contractVersion) ||
      WALLET_PROFILE_CONTRACT_VERSION,

    currencyDefinitionVersion:
      WALLET_CURRENCY_DEFINITION_VERSION,

    creationType:
      WALLET_PROFILE_CREATION_TYPE,

    header: {
      eyebrow:
        "Gameplay Wallet Definition",
      title: "Wallet Profile",
      description:
        "Author reusable currencies and their starting and allowed balance bounds. Live balances remain isolated actor-owned Story state. Crestfall Studio Coins are not part of this profile.",
    },

    profile: {
      title: text(safeProfile.title),
      description:
        text(safeProfile.description),
      enabled:
        safeProfile.enabled !== false,
    },

    validation: {
      state: validationState,
      valid:
        projectedErrors.length === 0,
      errors: projectedErrors,
      warnings: projectedWarnings,
      validMessage:
        "Wallet Profile definitions are valid.",
    },

    currencies: {
      title: "Currency Definitions",

      summary: {
        currencyDefinitionCount:
          integer(
            safeMetrics.currencyDefinitionCount,
            currencies.length
          ),
        enabledCurrencyDefinitionCount:
          integer(
            safeMetrics.enabledCurrencyDefinitionCount,
            currencies.filter(
              (currency) =>
                currency.identity.enabled
            ).length
          ),
        debtLikeCurrencyCount,
      },

      items: currencies,

      maxCount:
        WALLET_PROFILE_LIMITS.maxCurrencies,

      canAdd:
        currencies.length <
        WALLET_PROFILE_LIMITS.maxCurrencies,

      addLabel:
        "Add Currency",

      emptyState:
        "No currencies are defined. Add a currency or use the JSON editor.",
    },

    limits: {
      maxCurrencies:
        WALLET_PROFILE_LIMITS.maxCurrencies,
      maxIdentifierLength:
        WALLET_PROFILE_LIMITS.maxIdentifierLength,
      maxTitleLength:
        WALLET_PROFILE_LIMITS.maxTitleLength,
      maxDescriptionLength:
        WALLET_PROFILE_LIMITS.maxDescriptionLength,
      maxSymbolLength:
        WALLET_PROFILE_LIMITS.maxSymbolLength,
      minimumSafeBalance:
        WALLET_PROFILE_LIMITS.minBalance,
      maximumSafeBalance:
        WALLET_PROFILE_LIMITS.maxBalance,
    },

    economyBoundary: {
      studioCoinsExcluded: true,
      runtimeBalancesExcluded: true,
      helper:
        "A negative minimum balance is allowed when the creator intends a debt-like wallet. Purchases, prices, exchange rates, escrow, reserved funds, and Crestfall Studio Coins are separate economy layers and are not authored here.",
    },

    jsonEditor: {
      open:
        jsonEditorOpen === true,
      actionLabel:
        "JSON Editor & AI Guide",
      visualStatus:
        "WIRED_LEGACY_PRESENTATION",
      helper:
        "The live legacy JSON Editor & AI Guide is wired in FE. Chassis remains authoritative for JSON validation/application behavior.",
    },

    visualExtensionStatus: {
      profileEditor:
        "WIRED_LEGACY_PRESENTATION",
      jsonEditor:
        "WIRED_LEGACY_PRESENTATION",
    },

    callbacks: {
      onUpdateProfileField:
        callbackSource.onUpdateProfileField || null,
      onAddCurrency:
        callbackSource.onAddCurrency || null,
      onRemoveCurrency:
        callbackSource.onRemoveCurrency || null,
      onUpdateCurrencyField:
        callbackSource.onUpdateCurrencyField || null,
      onOpenJsonEditor:
        callbackSource.onOpenJsonEditor || null,
    },

    architecture: {
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
    },
  };
}
