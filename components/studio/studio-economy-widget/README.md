# Studio Economy Widget Loom Feature

**Status:** Loom-separated

**View contract:** `1.0.0`

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
