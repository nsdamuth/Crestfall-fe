# Studio Economy Widget Loom Feature

**Status:** Loom-separated

**View contract:** `1.3.0`

Upgrade CTA, RULED 6 Sep 2026 (sidebar batch 2, GO corrections): the
expanded button is the rail's one gold filled primary, full block
width, labelled "Upgrade" in every state and opening the existing
purchase flow for now. The balance row centers over it. Below the
cost of one standard generation (read from
`IMAGE_GENERATION_COIN_COST`, 5 today; a value for the Chassis to
serve later) the ViewModel sets `lowBalance`, and the balance row
switches to `--status-warning-text` while the button stays gold.
Collapsed renders the balance as a small badge above a gold Upgrade
button; low balance turns the badge number `--status-warning`.

Coin display law, RULED 6 Sep 2026 (sidebar batch 1, item 6): the
balance label shows full numbers with thousands separators below
100,000 (99,999) and the compact form from 100,000 (100k, 1.2M,
999.9M), never longer than six characters. The `expanded` mode stacks
that count above a full-width Buy Coins button, because the one-row
form wrapped the button label beside a six-character count at the
sidebar width. The mobile drawer shares the same block.

## Purpose

This feature renders the Studio navigation coin balance, Buy Coins action, and
Notifications action across the desktop sidebar, collapsed sidebar, mobile
header, and mobile drawer.

## Structure

```text
StudioEconomyWidget.jsx
studio-economy-widget/
  StudioEconomyWidget.view.jsx
  useStudioEconomyWidgetViewModel.js
  StudioEconomyWidget.contract.js
  StudioEconomyWidget.fixtures.js
  README.md
```

## Binding Shell

`StudioEconomyWidget.jsx` preserves the existing import path. It invokes the
ViewModel and passes the resulting contract to the portable View.

## ViewModel ownership

The ViewModel owns:

- reading the shared Studio account context;
- formatting the coin balance;
- translating host props into expanded, collapsed, or mobile-header layout;
- Buy Coins information-dialog state;
- Notifications information-dialog state.

## Portable View ownership

The View owns:

- sidebar, collapsed, and mobile-header markup;
- wallet and notification action styling;
- temporary information-dialog presentation;
- safe semantic callback invocation.

The View does not import the Studio account provider, read account status, or
parse coin values.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/studio-economy-widget
```

The route renders the portable View from fixtures and is unavailable in
production.

## Live validation

1. Confirm the expanded desktop sidebar shows the current coin balance.
2. Open and close Buy Coins and Notifications.
3. Collapse the sidebar and test both icon actions.
4. Test the mobile header balance and notification actions.
5. Open the mobile drawer and confirm the expanded wallet card still works.
