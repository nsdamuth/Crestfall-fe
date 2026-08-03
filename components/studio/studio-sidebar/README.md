# Studio Sidebar LOOM package

## Portable LOOM boundary

`StudioSidebar.jsx` is the thin Binding Shell. It reads the current pathname,
injects Next.js `Link`, retains the application-owned `StudioEconomyWidget`, and
renders the portable View.

`StudioSidebar.view.jsx` is the portable Skin. It renders the desktop Studio
navigation, collapse state, active styling, community links, signed-in account
summary, and logout link. It does not import Next.js routing, read application
context, own React state, or interpret the current pathname.

`useStudioSidebarViewModel.js` is the Chassis. It owns:

- the primary, utility, and social navigation definitions;
- exact `/studio` and prefix-based nested-route matching;
- collapsed and Community Links state;
- signed-in email normalization; and
- existing brand, logout, and accessibility copy.

The component remains mounted once by `StudioShell.jsx`. `StudioMobileNav` is a
separate application surface and remains a later conversion target.

## Diagnostics

```bash
npm run diagnostics:loom:studio-sidebar
```

## Development preview

```text
/dev/ui-preview/studio-sidebar
```

The preview is fixture-driven and unavailable in production.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
