# Studio Mobile Nav LOOM package

## Portable LOOM boundary

`StudioMobileNav.jsx` is the thin Binding Shell. It reads the current pathname,
injects Next.js `Link`, retains the `StudioEconomyWidget` drawer variant, and
renders the portable View.

`StudioMobileNav.view.jsx` is the portable Skin. It renders the slide-out
drawer, account summary, Community Links disclosure, and five-link bottom
dock. It does not import Next.js routing, read application context, own
React state, or interpret the pathname.

`useStudioMobileNavViewModel.js` is the Chassis. It owns:

- primary, utility, social, and bottom navigation definitions;
- exact `/studio` and prefix-based nested-route matching;
- Community Links disclosure state;
- signed-in public-username and account-label normalization; and
- navigation-dismissal and social-toggle behavior.

The component remains mounted once by `StudioShell.jsx`. The desktop
`StudioSidebar` and `StudioTopBar` remain separate LOOM packages.

## Mobile nav restyle (8 Aug 2026, mobile nav restyle brief)

Two changes from the prior shape, both ruled directly:

**The header row moved out.** This package no longer renders a `<header>`.
The hamburger trigger, global search field, and notifications bell now live
in `StudioTopBar` (which renders at every breakpoint as of the same
ruling); `StudioEconomyWidget variant="mobileHeader"` is retired with it
(see `studio-top-bar/README.md`). This package renders only the drawer
(the former `<aside>`, now triggered from outside) and the bottom dock.

**Drawer open state moved out.** Since `StudioTopBar`'s hamburger and this
package's drawer must agree on one boolean, that boolean is owned by
`StudioShell.jsx`, the Binding Shell that composes both packages; neither
package may own state the other depends on. This package's Shell now
receives `open` and `onCloseMenu` as props instead of creating them with
`useState`. Community Links disclosure stays local state here, since
nothing outside this package needs it.

**Drawer and dock restyled to token law.** The drawer's logo header (brand
mark, close control), nav rows, dividers, and signed-in footer now use the
exact classes shipped in `StudioSidebar.view.jsx` (8 Aug 2026 restyle),
not a second hand-authored recipe: same `.cf-nav-link` row treatment, same
avatar-initial signed-in block. Content and order are unchanged from before
this ruling (Lore Archive's `variant: "return"` position included); only
the per-row visual treatment changed. One addition beyond the sidebar's
avatar block: a logout link, since the sidebar's own avatar block carries
no logout affordance (only its separate, older duplicate footer block
does, which this package intentionally does not port; see the note in the
mobile nav restyle report for that observation). The bottom dock matches
the proof's `.dock` recipe (`docs/_legacy-reference/design-system/proof/shell.css`):
icon over label, color-only active state via the existing `.cf-dock-link`
class, chrome-blur frosted bar, `env(safe-area-inset-bottom)` padding,
tokens throughout. Tiles, targets, and order are unchanged.

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
