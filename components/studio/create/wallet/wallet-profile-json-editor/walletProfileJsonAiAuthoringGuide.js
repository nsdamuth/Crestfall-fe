export const WALLET_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-wallet-profile-json-ai-authoring-guide.md";
export const WALLET_PROFILE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

export function buildWalletProfileJsonAiAuthoringGuide(profile) {
  return `# Crestfall Wallet Profile JSON AI Authoring Guide

Guide contract: wallet_profile_json_ai_authoring_guide_v0
Profile contract: wallet_profile_contract_v0
Currency contract: wallet_currency_definition_v0

## Task
Modify the complete current Wallet Profile JSON at the end of this guide. Return one complete JSON object only. Do not return Markdown fences, commentary, patches, or partial fragments.

## Non-negotiable boundaries
- Preserve existing content outside the requested changes.
- Preserve existing currency IDs unless explicitly asked to rename or remove them.
- Currency IDs use lowercase letters, numbers, dots, colons, underscores, or hyphens.
- Keep contractVersion and definitionVersion values unchanged.
- The Wallet Profile owns reusable currency definitions only.
- Do not add live balances, actor state, owner IDs, participant IDs, namespaces, revisions, transaction ledgers, or mutation history.
- startingBalance, minimumBalance, and maximumBalance must be safe integers.
- minimumBalance must not exceed maximumBalance.
- startingBalance must remain between minimumBalance and maximumBalance.
- Negative minimum balances are allowed when the creator intentionally permits debt-like state.
- Maximum currencies: 32.
- Currency symbols may contain at most 16 characters.
- Studio/account Coins are product currency and are never this gameplay Wallet Profile.
- Pricing, purchases, sales, exchange rates, escrow, reserved funds, and market inheritance are separate economy layers.

## Complete shape
{
  "contractVersion": "wallet_profile_contract_v0",
  "title": "Adventurer Wallet",
  "description": "Reusable gameplay currencies.",
  "enabled": true,
  "currencies": [
    {
      "definitionVersion": "wallet_currency_definition_v0",
      "id": "currency.gold",
      "title": "Gold",
      "symbol": "gp",
      "description": "General-purpose currency.",
      "enabled": true,
      "startingBalance": 25,
      "minimumBalance": 0,
      "maximumBalance": 1000000,
      "tags": ["coin"],
      "metadata": {}
    }
  ],
  "metadata": {}
}

## Current Wallet Profile JSON
${JSON.stringify(profile, null, 2)}
`;
}
