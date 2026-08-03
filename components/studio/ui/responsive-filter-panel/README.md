# Responsive Filter Panel Loom Feature

**Status:** Loom-separated

**View contract:** `1.0.0`

## Purpose

This feature renders the shared responsive filter container used by the
Community Browser and My Creations library. It keeps separate mobile and
desktop disclosure state while preserving host-owned action and filter content.

## Structure

```text
ResponsiveFilterPanel.jsx
responsive-filter-panel/
  ResponsiveFilterPanel.view.jsx
  useResponsiveFilterPanelViewModel.js
  ResponsiveFilterPanel.contract.js
  ResponsiveFilterPanel.fixtures.js
  README.md
```

## Public interface

`ResponsiveFilterPanel.jsx` preserves the existing import path and caller props:

```jsx
<ResponsiveFilterPanel
  eyebrow="..."
  body="..."
  actions={...}
  mobileDefaultOpen={false}
  desktopDefaultOpen
  showMobileBody={false}
>
  {...filter controls}
</ResponsiveFilterPanel>
```

## ViewModel ownership

The ViewModel owns:

- mobile disclosure state;
- desktop disclosure state;
- translation of default-open props into initial state;
- semantic mobile and desktop toggle callbacks.

## Portable View ownership

The View owns:

- panel markup and visual hierarchy;
- responsive body visibility;
- mobile and desktop toggle presentation;
- rendering host-supplied actions and filter content;
- safe semantic callback invocation.

The View does not know how the host filters creations or creators, does not call
an API, and does not persist any filter state.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/responsive-filter-panel
```

Resize the browser across the `md` breakpoint to test the mobile and desktop
controls. The route renders the portable View directly from fixtures and is
unavailable in production.

## Live validation

1. Open Community and test Show Filters / Hide Filters on mobile.
2. Resize to desktop and test the independent desktop disclosure control.
3. Confirm Community actions and all creation/creator filter controls still work.
4. Open My Creations and repeat mobile and desktop disclosure testing.
5. Confirm Create New, grid-size, search, tag, and status controls are unchanged.
