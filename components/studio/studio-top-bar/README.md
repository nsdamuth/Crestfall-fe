# Studio Top Bar LOOM package

## Portable LOOM boundary

`StudioTopBar.jsx` is the thin Binding Shell. It preserves Next.js account
navigation as a semantic slot and renders the portable View.

`StudioTopBar.view.jsx` is the portable Skin. It renders the top bar chrome
(no card, no border box, no radius, flush to the content area per the Phase
2.1 ruling), the search field, the notifications bell, its two floating
panels (compact and full notification center, both composed from the shared
`components/ui/ModalShell` primitive), and account navigation. It does not
fetch data, own account context, or fake application state, and carries no
local `useState`: panel open/closed state, which panel is showing, and the
bell's focus-return ref all live in the ViewModel.

`useStudioTopBarViewModel.js` is the Chassis. It owns:

- search field value state (presentation-only local state, not yet wired to
  a real search operation, see Contract gaps below);
- `notificationsView` (`null | "compact" | "full"`), the single state that
  decides which of the two panels renders, or neither;
- `bellRef`, so closing either panel can return focus to the bell button;
- user-email account labelling; and
- passthrough of `notifications`, which defaults to an empty array until a
  real data source exists.

Coin balance and Buy Coins were removed from this package 8 Aug 2026 (Phase
2 top bar restyle). Coins remain in the sidebar `StudioEconomyWidget` card
and the mobile drawer (`studio-mobile-nav`), neither owned by this package.
The mobile header coin badge (`StudioEconomyWidget variant="mobileHeader"`)
was retired 8 Aug 2026 when the mobile header row merged into this package
(see "Mobile nav restyle" below); that variant is now unused anywhere in the
app and was left in place in its own package rather than deleted here, one
package per commit.

## Mobile nav restyle (8 Aug 2026, item 7)

This header now renders at every breakpoint, not only `lg:` and above. A
hamburger trigger (`onOpenMenu`, `Menu` icon, `lg:hidden`) renders first in
the row, matching the proof's mobile studio-home topbar (hamburger, search,
bell, no theme toggle); the account avatar link renders `hidden lg:flex`
instead, since mobile account access moved to the `studio-mobile-nav`
drawer's signed-in footer, matching the proof (its mobile topbar carries no
account icon either).

`onOpenMenu` is a ViewModel-owned passthrough only. The actual drawer
open/closed boolean is owned by `StudioShell.jsx`, the Binding Shell that
composes both this package and `studio-mobile-nav`; neither package may own
the other's state, so it lives one level up, threaded in as `onOpenMenu`
here and as `open` / `onCloseMenu` into `StudioMobileNav`. The bell and its
two panels are unchanged by this and open the same centered `ModalShell`
panels at every breakpoint.

## Notification demo interactions (8 Aug 2026, items 2-4)

The compact panel's "Open the notification center" button is now the
primary filled-gold action (`cf-btn--primary`), relabelled exactly
"Notification Center"; "Clear all" stays the ghost `cf-btn--secondary`
button, same height and padding, side by side, unchanged position.

Per-row dismiss and clear-all are now real, interactive, session-only demo
state, not no-ops: `components/studio/studio-top-bar/studioTopBarNotificationsDemoState.js`
is a small hook, paired with and living beside `studioTopBarNotifications.mock.js`,
that owns a `useState` copy of the mock list and exposes `onDismissNotification`
/ `onClearAllNotifications` that mutate it. The Shell (`StudioTopBar.jsx`)
wires this hook's `notifications` into the ViewModel and its two callbacks
directly onto the View, bypassing `useStudioTopBarViewModel` entirely so the
production Chassis's own data contract (accepts a `notifications` array,
owns no mutation logic) is untouched. Dismissing every row in a TODAY or
EARLIER group makes that group disappear (the View already filtered empty
groups); clearing the list drops the bell to idle and shows the empty
state, both already derived from `notifications.length`. This state is
in-memory only, resets on reload, and is demo scaffolding: delete
`studioTopBarNotificationsDemoState.js` together with the mock module and
their imports in `StudioTopBar.jsx` when the real feed lands.

## Overlay primitive (Phase 2.1, 8 Aug 2026)

Both notification panels are the shared `components/ui/ModalShell` (12
callers per its contract doc), used unmodified: no edits to
`ModalShell.view.jsx` or `useModalShellViewModel.js`. Its `panelClassName`
prop carries the proof's `.sheet` recipe (surface-4, `--line` border,
`--radius-lg`, `--shadow-modal`) and its own `onClose` wiring already
provides Escape-key close, outside-click close (`onBackdropMouseDown`), and
body-scroll locking, all shared with every other modal in the app. This
package adds only: the close button in each panel's header, the
focus-return-to-bell behavior (not something `ModalShell` owns for any
caller today), and the panel content.

ModalShell centers on every breakpoint; it has no bottom-sheet-at-mobile
behavior. The Phase 2.1 brief calls the proof panels "centered floating
panels" without mentioning a bottom sheet, so this was built centered-always,
matching what the shared primitive already does for its other callers,
rather than forking or extending it for a one-off responsive variant.

The proof (`design-system/proof/shell.css`) fully specifies the compact and
full panel recipes (`.sheethead`, `.notifrow`, `.dot`, `.notiflist`,
`.nclear`, `.nempty`, `.notiffoot`, `.ngroup`, `.sheet--tall`) but no proof
HTML anywhere instantiates them or wires the bell to open them; the
compact-to-full transition trigger ("Open the notification center") is
named directly in the Phase 2.1 brief and was reproduced as stated. No other
behavior for the transition (e.g. whether the compact panel stays mounted
underneath) is demonstrated anywhere, so it was built as the more
conservative reading: one `notificationsView` mode swap, not two stacked
dialogs.

## Contract gaps (Phase 2 / 2.1, 8 Aug 2026)

- **Search.** No search callback existed in the prior contract. `onSearchChange`
  is exposed with a safe no-op default. Wiring live search is a CR against
  services-api; see `docs/CONTRACT-REQUESTS.md` (CR-012).
- **Notifications.** No notification data source exists anywhere in the app.
  `notifications` still defaults to `[]` in the ViewModel; `onDismissNotification`
  and `onClearAllNotifications` remain presentation-only no-ops with nothing
  to mutate without a real feed. As of 8 Aug 2026, the Shell
  (`StudioTopBar.jsx`) feeds a fixed mock list to the ViewModel so the bell
  has-new state and both panels can be reviewed as a finished design; the
  content lives in ONE file,
  `components/studio/studio-top-bar/studioTopBarNotifications.mock.js`
  (header comment marks it mock data pending CR-017). Delete that file and
  its one import in `StudioTopBar.jsx` to return to the honest empty
  default. Real data needs a services-api contract; see
  `docs/CONTRACT-REQUESTS.md` (CR-017), which also records the dev handoff
  shape.
- **Resolved: chrome frost token.** The proof's `.topbar` uses
  `backdrop-filter: blur(12px)` on the chrome bar itself, a strength
  `--blur-panel` (2px, floating-panel-only) does not cover. Minted
  `--blur-chrome` (12px, persistent-chrome-only) in `app/theme.css` 8 Aug
  2026 and applied here as `backdrop-blur-[var(--blur-chrome)]`. See
  `docs/DESIGN-TOKENS.md`'s Lines/fills/scrims table.

## Layout fixes (Phase 2.2, 8 Aug 2026)

**Root cause, item 1.** Two separate bugs, one each in the shell and this
package, both traced before any fix landed:

- The bar not reaching the content area's right edge: `StudioShell.view.jsx`
  rendered `topBarSlot` as a child of the same padded `<section>` as page
  content (`px-5/8/10`), so the bar's `w-full` filled the padded box, not
  the true column width. Fixed in the shell package: `topBarSlot` (and
  `mobileNavSlot`, unaffected either way since it is `fixed`) now render in
  an unpadded wrapper above the padded section. See
  `components/studio/studio-shell/README.md`.
- The notification panel pinning to the top of the viewport instead of
  centering: the two `ModalShell` panels were rendered as JSX children
  inside the same `<header>` that carries `backdrop-blur-[var(--blur-chrome)]`.
  A non-none `backdrop-filter` on an element establishes a new containing
  block for that element's `position: fixed` descendants (same rule as
  `filter`/`transform`), so `ModalShell`'s `fixed inset-0` was resolving
  against the header's small bounding box, not the viewport. Fixed inside
  this package alone: the View now returns a Fragment with `<header>` and
  the two panels as siblings, not descendants, so nothing here needed to
  change in the shell or in `ModalShell` itself.

**Item 3, sticky.** `sticky top-0 z-40` added to the header, matching the
proof's `.topbar{position:sticky;top:0;z-index:40}`.

**Item 6, breathing room.** No new spacing was added. Moving `topBarSlot`
out of the padded section (the item 1 shell fix) means the section's
existing `lg:py-[var(--space-8)]` top padding, previously spent before the
bar as its first child, now reads as the gap between the sticky bar and
page content, on every page in the shell, unchanged in value.

**Item 7, search placeholder.** `placeholder:text-[length:var(--text-label)]
placeholder:font-[var(--weight-regular)]` added; field height/width
untouched. While verifying this, found and fixed a real defect this file
already had: every bare `text-[var(--text-ui)]`-shaped font-size utility
in this file was being interpreted by Tailwind as a color arbitrary value
(ambiguous `text-[var(--x)]` defaults to color, per the `text-[length:...]` /
`text-[color:...]` convention already established in
`StudioSidebar.view.jsx`), so no font-size in this file was actually
applying; text sat at browser/UA default size everywhere. Fixed throughout
this file, not only on the placeholder, since the placeholder fix could not
be verified without it.


The component remains mounted by `StudioShell.jsx`. As of 8 Aug 2026 this
package's header renders at every breakpoint, including mobile; the mobile
drawer and bottom dock remain the separate `studio-mobile-nav` package.

## Diagnostics

```bash
npm run diagnostics:loom:studio-top-bar
```

## Development preview

```text
/dev/ui-preview/studio-top-bar
```

The preview is fixture-driven and unavailable in production.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
