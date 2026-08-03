# Studio Top Bar LOOM package

## Portable LOOM boundary

`StudioTopBar.jsx` is the thin Binding Shell. It connects the application-owned
Studio Account context to the ViewModel, preserves Next.js account navigation as a semantic slot, and renders the portable View.

`StudioTopBar.view.jsx` is the portable Skin. It renders the desktop Studio
utility bar, coin balance, account navigation, and the two informational utility
modals. It does not import the Studio Account provider, own React state, or
normalize account values.

`useStudioTopBarViewModel.js` is the Chassis. It owns:

- Studio Account context consumption;
- loading and invalid-balance display normalization;
- user-email account labelling;
- Buy Coins and Notifications modal state; and
- the existing placeholder utility copy.

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
