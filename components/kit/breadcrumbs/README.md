# Kit Breadcrumbs LOOM Package

**Contract:** `KitBreadcrumbs.contract.js`

## Purpose

The breadcrumb row RULED 12 Sep 2026 (eight-fix package, FIX 4). It
renders on every v2 page deeper than a primary sidebar page: the
section name linking to the section page, then the current page
title. It replaces the floating circular back button
(`components/studio/profile/ProfileBackButton`), which ends the same
package with zero consumers.

## Boundary

```text
KitBreadcrumbs.jsx
  -> useKitBreadcrumbsViewModel.js
  -> KitBreadcrumbs.view.jsx
```

- The ViewModel defends every prop: items with a blank label are
  dropped, and a missing `href` renders that crumb as text.
- The portable View owns the row recipe only. It never reads the
  router or the pathname; the caller supplies display-ready items.
  The last item is always the current page and never links.
- The shell injects `next/link` as `LinkComponent`; the portable View
  defaults to a plain anchor.

## Placement

- Pages built on `StudioPageHeaderView` pass `breadcrumbs` to the
  header (1.3.0), which renders this row between the description
  line and the header divider.
- Pages with their own header recipe (creation detail, the editor,
  the timeline reader and builder) render the row directly above
  that header.

## Recipe

- Every crumb is at least `--control-md` (44px) tall at every width.
- One line always: link crumbs are `flex-none` up to `12rem` and
  truncate past it; the current crumb is `flex-1 min-w-0` and
  truncates with an ellipsis. The row never wraps and never causes
  horizontal scroll.
- Ink: link crumbs `--ink-dim`, `--gold-bright` on hover; the current
  crumb `--ink`; separators `--ink-faint` chevrons.

## States

- default: section plus current title.
- threeDeep: section, parent detail, current title (creator
  connections).
- longest: a title long enough to truncate at 390.
- empty: no items, renders nothing.
