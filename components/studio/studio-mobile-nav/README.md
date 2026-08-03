# Studio Mobile Nav LOOM package

## Portable LOOM boundary

`StudioMobileNav.jsx` is the thin Binding Shell. It reads the current pathname,
injects Next.js `Link`, retains both application-owned `StudioEconomyWidget`
variants, and renders the portable View.

`StudioMobileNav.view.jsx` is the portable Skin. It renders the fixed mobile
header, slide-out drawer, account summary, Community Links disclosure, and
five-link bottom navigation. It does not import Next.js routing, read
application context, own React state, or interpret the pathname.

`useStudioMobileNavViewModel.js` is the Chassis. It owns:

- primary, utility, social, and bottom navigation definitions;
- exact `/studio` and prefix-based nested-route matching;
- drawer and Community Links state;
- signed-in email and account-label normalization; and
- drawer open, close, navigation-dismissal, and social-toggle behavior.

The component remains mounted once by `StudioShell.jsx`. The desktop
`StudioSidebar` and `StudioTopBar` remain separate LOOM packages.

## Diagnostics

```bash
npm run diagnostics:loom:studio-mobile-nav
```

## Development preview

```text
/dev/ui-preview/studio-mobile-nav
```

The preview is fixture-driven and unavailable in production.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
