# Studio Top Bar LOOM package

## Portable LOOM boundary

`StudioTopBar.jsx` is the thin Binding Shell. It preserves Next.js account
navigation as a semantic slot and renders the portable View.

`StudioTopBar.view.jsx` is the portable Skin. It renders the desktop Studio
global search field, the notifications bell and its popup panel, and account
navigation. It does not fetch data, own account context, or fake application
state; local `useState` is limited to the notifications popup's open/close
visibility, which is presentation-only per the Phase 2 ruling.

`useStudioTopBarViewModel.js` is the Chassis. It owns:

- search field value state (presentation-only local state, not yet wired to
  a real search operation, see Contract gaps below);
- user-email account labelling; and
- passthrough of `notifications`, which defaults to an empty array until a
  real data source exists.

Coin balance and Buy Coins were removed from this package 8 Aug 2026 (Phase
2 top bar restyle). Coins remain in the sidebar `StudioEconomyWidget` card
and the mobile header, neither owned by this package.

## Contract gaps (Phase 2, 8 Aug 2026)

- **Search.** No search callback existed in the prior contract. `onSearchChange`
  is exposed with a safe no-op default. Wiring live search is a CR against
  services-api; see `docs/CONTRACT-REQUESTS.md`.
- **Notifications.** No notification data source exists anywhere in the app.
  `notifications` defaults to `[]`, which keeps the bell honestly idle in
  production. The popup's row layout (title + relative time) was built by
  reusing this file's own prior typographic pairing since no proof or live
  precedent for a notification row exists; it is unruled and needs a render
  review. Real data needs a services-api contract; see
  `docs/CONTRACT-REQUESTS.md`.

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
