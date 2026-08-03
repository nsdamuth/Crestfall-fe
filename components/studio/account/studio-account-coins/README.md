# Studio Account Coins Loom Feature

**Status:** Loom-separated

**View contract:** `1.0.0`

## Purpose

This feature renders the Studio account coin balance, placeholder account
metrics, and the temporary coin-purchase information dialog.

## Structure

```text
StudioAccountCoins.jsx
studio-account-coins/
  StudioAccountCoins.view.jsx
  useStudioAccountCoinsViewModel.js
  StudioAccountCoins.contract.js
  StudioAccountCoins.fixtures.js
  README.md
```

## Binding Shell

`StudioAccountCoins.jsx` preserves the existing import path. It invokes the
ViewModel and passes the resulting contract to the portable View.

## ViewModel ownership

The ViewModel owns:

- loading the current Studio account through the existing profile client;
- coin-balance normalization and formatting;
- loading and error decisions;
- purchase-information dialog state;
- display-ready placeholder metric objects.

## Portable View ownership

The View owns:

- wallet card and metric markup;
- balance, error, and purchase-information presentation;
- responsive layout and styling;
- safe semantic callback invocation.

The View does not call `/api/profile/me`, parse profile payloads, or know how
coin balances are stored.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/studio-account-coins
```

The route renders the portable View from fixtures and is unavailable in
production.

## Live validation

1. Open the Studio account page.
2. Confirm the current coin balance loads.
3. Select **Buy Coins Soon**.
4. Close the information dialog using both close controls.
5. Refresh and confirm the balance loads again.
