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
and the mobile header, neither owned by this package.

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
  `notifications` defaults to `[]`, which keeps the bell honestly idle in
  production. `onDismissNotification` and `onClearAllNotifications` are
  presentation-only with no-op defaults; there is nothing for them to mutate
  without a real feed. Real data needs a services-api contract; see
  `docs/CONTRACT-REQUESTS.md` (CR-017).
- **Missing token.** The proof's `.topbar` uses
  `backdrop-filter: blur(12px)` on the chrome bar itself. `app/theme.css`
  only defines `--blur-panel` (2px), scoped to modal/sheet/picker veils, not
  persistent chrome. No blur is applied to the bar; it renders as an opaque
  `color-mix(in srgb, var(--canvas) 88%, transparent)` wash without the
  blur. Flagged, not invented.

The component remains mounted by `StudioShell.jsx`. Mobile Studio navigation is
outside this package and remains a separate conversion target.

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
