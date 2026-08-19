import {
  createEmptyWalletProfile,
  normalizeWalletProfileEditorValue,
} from "./WalletProfileEditor.contract.js";

export const walletProfileEditorFixture = Object.freeze({
  value: createEmptyWalletProfile(),
});

export const walletProfileEditorFilledFixture = Object.freeze({
  value: normalizeWalletProfileEditorValue({
    title: "Aethelgard Expedition Wallet",
    description:
      "A filled gameplay Wallet Profile with ordinary currency, bounded reputation-style value, and an authored debt floor.",
    enabled: true,
    currencies: [
      {
        id: "currency.crowns",
        title: "Crowns",
        symbol: "Cr",
        description:
          "Common in-world tender used for ordinary purchases and rewards.",
        enabled: true,
        startingBalance: 250,
        minimumBalance: 0,
        maximumBalance: 999999,
        tags: ["currency", "trade"],
        metadata: {
          fixturePurpose: "ordinary_positive_currency",
        },
      },
      {
        id: "currency.guild_favor",
        title: "Guild Favor",
        symbol: "GF",
        description:
          "A tightly bounded in-world standing value awarded by the Artificers Guild.",
        enabled: true,
        startingBalance: 10,
        minimumBalance: 0,
        maximumBalance: 100,
        tags: ["reputation", "guild"],
        metadata: {
          fixturePurpose: "bounded_non_cash_value",
        },
      },
      {
        id: "currency.oath_debt",
        title: "Oath Debt",
        symbol: "OD",
        description:
          "An authored negative-balance gameplay value used to represent obligations still owed.",
        enabled: true,
        startingBalance: -25,
        minimumBalance: -10000,
        maximumBalance: 0,
        tags: ["debt", "obligation"],
        metadata: {
          fixturePurpose: "authored_negative_floor",
        },
      },
    ],
    metadata: {
      fixtureVersion: "wallet_profile_filled_v1",
      productCurrencyExcluded: true,
    },
  }),
});
