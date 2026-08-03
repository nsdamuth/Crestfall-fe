export const RULES_CODEX_BUILDER_FIXTURES = Object.freeze({
  empty: {
    title: "",
    description: "",
    visibility: "PRIVATE",
    contentRating: "SFW",
    rulesCodex: {
      contractVersion: "rules_codex_contract_v0",
      enabled: true,
      summary: "",
      selectionPolicy: {
        maxSelectedSections: 8,
        maxContextCharacters: 12000,
      },
      sections: [],
    },
  },
  economy: {
    title: "Crestfall Economy Rules",
    description: "Interprets pricing, barter, and local market conditions.",
    visibility: "PRIVATE",
    contentRating: "SFW",
    rulesCodex: {
      contractVersion: "rules_codex_contract_v0",
      enabled: true,
      summary:
        "Explains local prices and discounts after deterministic economy systems resolve the transaction.",
      selectionPolicy: {
        maxSelectedSections: 6,
        maxContextCharacters: 8000,
      },
      sections: [
        {
          id: "economy.local-market",
          title: "Local Market Interpretation",
          body:
            "Use the active Location market profile as the local authority for availability, scarcity, taxes, and merchant tone. The wallet and transaction operation remain authoritative for balances and final cost.",
          authority: "INTERPRETATION_ONLY",
          enabled: true,
          priority: 70,
          order: 0,
          activation: {
            mode: "CONTEXTUAL",
            matchMode: "ANY",
            domains: ["ECONOMY", "INVENTORY", "LOCATION"],
            commandIds: ["BUY_ITEM", "SELL_ITEM"],
            trackerIds: [],
            guardIds: [],
            registryRefs: [],
            tags: ["PRICING", "MARKET"],
            actorTypes: [],
            scopeTypes: ["STORY", "LOCATION", "ORGANIZATION"],
          },
        },
      ],
    },
  },
});
