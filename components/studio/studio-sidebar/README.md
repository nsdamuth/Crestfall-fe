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
- collapsed, Community Links, and Legacy group state;
- the flagged nine-destination preview nav (below);
- signed-in email normalization; and
- existing brand, logout, and accessibility copy.

The component remains mounted once by `StudioShell.jsx`. `StudioMobileNav` is a
separate application surface and remains a later conversion target.

## Sidebar v2 preview flag

Flag: `NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, read by
`lib/shared/flags/sidebarV2Preview.js`. On by default for dev and
staging (any `NODE_ENV` other than `production`), off in production;
the env var forces either direction explicitly (`"true"` or
`"false"`).

When on, the sidebar renders the nine-destination journey-order nav
(Play: Home, Stories, Adventures; Create: Studio, Images, Vault;
Explore: Community, Creators, Lore, per
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 2) above a collapsible
Legacy group holding today's existing primary and utility links
unchanged. All nine destinations are built, RULED 11 Aug 2026, and
route normally to their live `/studio/v2/<page>` page; the quiet,
non-interactive, no-href "Soon" treatment stays in the view for any
future destination that ships unbuilt. When off, the sidebar renders
exactly as it did before the flag existed: this is a smallest-edit,
fully reversible change gated entirely on `previewEnabled` in
`StudioSidebar.view.jsx`.

Preview group headers (Play, Create, Explore) follow
`docs/BUILD-BLUEPRINT.md` 2.16(o) scope 2, RULED 10 Aug 2026 (kit
polish 3 pass, R7): the label carries no ornament rule beside it (that
mark is scope 1's page-head eyebrow treatment, and was wrong here); a
plain full-width divider (the Legacy divider recipe,
`border-t border-[var(--line-strong)]`) renders beneath the label row
instead, in both collapsed and expanded states. The label itself
stays gold uppercase and expanded-only, unchanged.

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
