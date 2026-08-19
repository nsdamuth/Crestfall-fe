export const walletProfileAuthoringFilledProfileFixture =
  Object.freeze({
    contractVersion:
      "wallet_profile_contract_v0",
    title: "Aethelgard Expedition Wallet",
    description:
      "Reusable in-world values for expedition play.",
    enabled: true,
    currencies: [
      {
        definitionVersion:
          "wallet_currency_definition_v0",
        id: "currency.crowns",
        title: "Crowns",
        symbol: "Cr",
        description:
          "Common in-world tender used for ordinary purchases and rewards.",
        enabled: true,
        startingBalance: 250,
        minimumBalance: 0,
        maximumBalance: 999999,
        tags: [
          "currency",
          "trade",
        ],
      },
      {
        definitionVersion:
          "wallet_currency_definition_v0",
        id: "currency.guild_favor",
        title: "Guild Favor",
        symbol: "GF",
        description:
          "A bounded in-world standing value awarded by the Artificers Guild.",
        enabled: true,
        startingBalance: 10,
        minimumBalance: 0,
        maximumBalance: 100,
        tags: [
          "reputation",
          "guild",
        ],
      },
      {
        definitionVersion:
          "wallet_currency_definition_v0",
        id: "currency.oath_debt",
        title: "Oath Debt",
        symbol: "OD",
        description:
          "A creator-authored negative balance representing obligations still owed.",
        enabled: true,
        startingBalance: -25,
        minimumBalance: -10000,
        maximumBalance: 0,
        tags: [
          "debt",
          "obligation",
        ],
      },
      {
        definitionVersion:
          "wallet_currency_definition_v0",
        id: "currency.dormant_token",
        title: "Dormant Token",
        symbol: "DT",
        description:
          "Disabled fixture currency.",
        enabled: false,
        startingBalance: 0,
        minimumBalance: 0,
        maximumBalance: 10,
        tags: [
          "disabled",
        ],
      },
    ],
  });

export const walletProfileAuthoringValidFixture =
  Object.freeze({
    profile:
      walletProfileAuthoringFilledProfileFixture,
    errors: [],
    warnings: [],
    metrics: {
      currencyDefinitionCount: 4,
      enabledCurrencyDefinitionCount: 3,
    },
    jsonEditorOpen: false,
  });

export const walletProfileAuthoringWarningFixture =
  Object.freeze({
    profile:
      walletProfileAuthoringFilledProfileFixture,
    errors: [],
    warnings: [
      {
        code:
          "WALLET_PROFILE_FIXTURE_WARNING",
        path: "currencies[3]",
        message:
          "Dormant Token is currently disabled.",
        severity: "WARNING",
      },
    ],
    metrics: {
      currencyDefinitionCount: 4,
      enabledCurrencyDefinitionCount: 3,
    },
    jsonEditorOpen: false,
  });

export const walletProfileAuthoringErrorFixture =
  Object.freeze({
    profile:
      walletProfileAuthoringFilledProfileFixture,
    errors: [
      {
        code:
          "WALLET_CURRENCY_BALANCE_BOUNDS_INVALID",
        path: "currencies[0]",
        message:
          "minimumBalance must not exceed maximumBalance.",
        severity: "ERROR",
      },
    ],
    warnings: [],
    metrics: {
      currencyDefinitionCount: 4,
      enabledCurrencyDefinitionCount: 3,
    },
    jsonEditorOpen: false,
  });

export const walletProfileAuthoringJsonOpenFixture =
  Object.freeze({
    ...walletProfileAuthoringValidFixture,
    jsonEditorOpen: true,
  });

export const walletProfileAuthoringEmptyFixture =
  Object.freeze({
    profile: {
      contractVersion:
        "wallet_profile_contract_v0",
      title: "New Wallet Profile",
      description:
        "Reusable gameplay currency definitions for actor-owned Wallet state.",
      enabled: true,
      currencies: [],
    },
    errors: [],
    warnings: [
      {
        code:
          "WALLET_PROFILE_EMPTY",
        path: "currencies",
        message:
          "An enabled Wallet Profile has no enabled currencies.",
        severity: "WARNING",
      },
    ],
    metrics: {
      currencyDefinitionCount: 0,
      enabledCurrencyDefinitionCount: 0,
    },
    jsonEditorOpen: false,
  });
