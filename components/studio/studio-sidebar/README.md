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
- signed-in public-username normalization; and
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
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 2). All nine
destinations are built, RULED 11 Aug 2026, and route normally to
their live `/studio/v2/<page>` page; the quiet, non-interactive,
no-href "Soon" treatment stays in the view for any future destination
that ships unbuilt.

Legacy group REMOVED from preview mode, RULED 23 Aug 2026 (build-0823
pass 4, sidebar refinement): preview renders only the nine-page model
plus lawful supporting entries (utility links, social, the economy
slot); today's existing primary/utility links no longer collapse
beneath it in preview mode. When off, the sidebar renders exactly as
it did before the flag existed, Legacy group included: this ruling is
gated entirely on `previewEnabled` in `StudioSidebar.view.jsx`, the
same as the rest of preview mode.

Nav density, RULED 23 Aug 2026 (same pass): preview-mode rows resolve
to `--control-sm` (32px) with the standing
`[@media(pointer:coarse)]:min-h-[var(--control-md)]` touch-floor
override, `--text-label`/`--lh-label` type, and a tightened
`--space-2` group-to-group gap, so the sidebar fits common desktop
viewport heights without internal scroll. Flag-off (production)
density is untouched. Vault's iconKey reverted `castle` to `archive`
in the same pass (the repo's standing archive/vault glyph).

The signed-in area's Discord and Settings icons now sit inline on the
signed-in row itself (avatar, label, public username, then the two icons); Log
out is a quiet row directly beneath. No separate icon row remains.

The economy slot's `expanded` and `collapsed` layout modes lost their
Notifications control in the same pass (notifications live in the top
bar bell only); `expanded` is now one compact row (coin count plus a
small "Buy Coins" chip). See
`components/studio/studio-economy-widget/StudioEconomyWidget.contract.js`
1.1.0.

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
