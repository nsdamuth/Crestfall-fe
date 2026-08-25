# Studio Shell LOOM package

**Status:** Loom-separated, 7 Aug 2026 (Ruling 6)

**View contract:** `1.0.0`

## Purpose

The studio canvas frame wrapping all 54 studio routes
(`docs/SHELL-INVENTORY.md`): canvas background, sidebar/content flex
layout, page padding. Carved second, after ModalShell, per Ruling 6's
expansion of queue item T9 beyond its starred recommendation.

## Structure

```text
StudioShell.jsx
  Binding Shell
  ├─ StudioAccountProvider (application context)
  └─ composes StudioSidebar / StudioMobileNav / StudioTopBar into slots

studio-shell/
  StudioShell.view.jsx
    Portable Skin
  useStudioShellViewModel.js
    Chassis (currently a defensive pass-through; grows if canvas-level
    behavior is added later)
  StudioShell.contract.js
  StudioShell.fixtures.js
  README.md
```

## Chassis responsibilities

The ViewModel normalizes the four slots (`sidebarSlot`, `mobileNavSlot`,
`topBarSlot`, `children`) with defensive defaults. Account context,
auth, and the data behind the sidebar/nav/top-bar chrome stay owned by
`StudioAccountProvider` and the chrome components themselves; the View
never imports them directly.

## Portable Skin responsibilities

The View renders only the canvas background and the sidebar/content
layout with page padding. It receives its chrome as slots and knows
nothing about studio account state.

Restructured 8 Aug 2026 (Phase 2.2 top bar layout brief). Before this,
`mobileNavSlot` and `topBarSlot` rendered as the first two children
inside the same padded `<section>` as page `children`. That padding
(`px-5/8/10`, `lg:py-8`) constrained the top bar to less than the full
content-column width and left no gap between the bar and page content.
`mobileNavSlot` and `topBarSlot` now render in an unpadded wrapper
above the padded `<section>`; `mobileNavSlot` is unaffected since it is
`fixed` (removed from flow regardless of DOM position), but
`topBarSlot` can now span the full content-column width and sit
sticky. The `<section>`'s own className is unchanged, so no page's
padding or spacing moved: the same `lg:py-8` top padding that
previously sat before the bar (as its first child) now reads as the
gap after the bar, since the bar moved above the section entirely.

## Public contract

Unchanged from the pre-carve component: `user`, `children`. Carving
this package changed no caller-visible prop; `app/studio/layout.js`
still imports `StudioShell` the same way.

## Preview

Development only:

```text
/dev/ui-preview/studio-shell
```
