# Studio LOOM package

**Contract:** `Studio.contract.js` (v1.0.0)

## Purpose

The Studio hub (`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.4): the
fixture-driven create hub on the ruled ladder layout, built per
`docs/STUDIO-SPEC.md` sections 1, 2, 3, 6, and Brief S1 (section 8.1).
Journey: make an asset, gather assets into a Story, play it, publish
it and it becomes an Adventure. Build address `/studio/v2/studio`
(route law, cutover sequence). Fixture-driven only, pre-parity: no
fetch, no services-api, no product data, except
`CharacterCreatorModal`'s own existing live save wiring, which this
page consumes read-only and does not modify.

## Boundary

```text
Studio.jsx (Shell, ../Studio.jsx)
  -> owns Next.js router (useRouter), passes onNavigate
  -> owns CharacterCreatorModal's open/close boolean directly (real
     integration, not fixture-shaped ViewModel state) and mounts it
     with fieldScope="quick"
  -> useStudioViewModel.js
      -> reads studioContent.mock.js (levels, doors, tool groups,
         the hub explainer, the Story bridge, the Guided Build Soon
         copy, the bottom banner)
      -> owns the active ladder level and the R4 notice
  -> Studio.view.jsx
      -> KitStudioPageView (bannerSlot = bottom banner, children =
         everything between the header and the banner)
      -> StudioPageHeaderView (eyebrow "Craft", title "Studio",
         description) as headerSlot
      -> KitAlertStripView (neutral) x2: the hub explainer strip
         (submission-hub presentation) and the Story bridge strip
         (Quick Start pane only)
      -> the level selector (page-local, three levels)
      -> the active level's pane:
         - Quick Start: Door x4 (page-local) plus the Story bridge
           strip
         - Guided Build: KitAlertStripView neutral, the quiet Soon
           pane
         - Full Studio: ToolCard xN (page-local) grouped under three
           section headings
      -> KitPromoBannerView (bottom treatment) routing to
         /studio/v2/images
      -> FixtureActionNotice (shared staging scaffold, honest stub)
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel, which itself never imports `next/navigation` (the
Shell owns that boundary). `CharacterCreatorModal` is mounted by the
Shell, not passed through the View, because it is live-wired
integration, not a fixture-shaped prop.

## Composition order, ruled and exhaustive

Page header -> the hub explainer strip (`KitAlertStrip` neutral, the
sanctioned `.stripinfo` lineage, carrying the submission-hub
presentation: Public and Canon submissions begin here) -> the
ladder's level selector (Quick Start, Guided Build, Full Studio) ->
the active level's pane -> bottom promo banner (`bottom` treatment)
routing to `/studio/v2/images`.

## Why the level/door/tool-card recipes are page-local

`docs/STUDIO-SPEC.md` section 8.1's file set for this brief is
`app/studio/v2/studio/**` only; no `components/kit/door/` or
`components/kit/tool-card/` package exists, and this page is their
only consumer. Per LOOM law (a pattern promotes to `components/kit`
only once a second consumer asks for it), they stay page-local rather
than being minted as new kit packages by this brief.

## The Character door, the one live door

Per the ruling (`docs/STUDIO-SPEC.md` section 1, item 3; section 3.2):
the Character door opens the existing `CharacterCreatorModal`
(`components/studio/create/character/creator-stops/`), imported
read-only, passing `fieldScope="quick"`. S2
(`components/studio/create/character/creator-stops/**`, a parallel
brief) adds that prop to the modal's signature; at this brief's build
time S2 had not landed, so the modal's function signature is
`CharacterCreatorModal({ onClose })` and silently ignores the extra
prop, rendering its full (not quick) field set. This is the ruled
integration behavior, not a bug: once S2 lands, the same call site
renders the QUICK field set with no further change here.

Every other door (Player Character, Location, Outfit / Clothing) and
every Full Studio tool card except Character render the standing Soon
treatment: quiet styling, `aria-disabled`, and, on press, the shared
R4 fixture-action notice (nothing feels dead, nothing routes to an
old-system page, per section 3, item 3).

## Guided Build, a judgment call (not a guess)

`docs/STUDIO-SPEC.md` Brief S1's manifest item 1 asks for "levels,
doors, tool cards, story bridge strip"; it does not separately name
Guided Build content (the Story-bucket cards the legacy proof shows).
Section 9, item 2 of the spec is explicit that Story assembly (Guided
Build's whole subject) has no field allocation yet and that hub doors
render Soon until an allocation exists. Rather than fabricate Story
bucket fixtures for a flow with no allocation and no backing builder,
Guided Build's pane renders the same quiet Soon treatment used
elsewhere on this hub (`KitAlertStripView` neutral, no fabricated
data), consistent with the section 9 ruling extended to the one other
place Story assembly would otherwise need inventing. The level
selector itself (all three levels, visible and switchable) is built in
full, since manifest item 1 does name "levels" as a required element.
Flagged here for Brian as a judgment call, not silently assumed.

## Fixture states

`docs/STUDIO-SPEC.md` section 8.1 names three fixture states:
default, empty, longest content. This hub carries no user-owned data
list whose count would naturally vary, so the three states are mapped
onto the ladder's own three altitudes, the only content variety the
page has:

- **default**: Quick Start, the primary surface, doors visible.
- **empty**: Guided Build, the quietest pane (no doors, no cards, one
  placeholder message).
- **longestContent**: Full Studio, the densest pane (every tool group
  and card at once), with the R4 notice open showing the longest copy
  the page carries.

## Data

`studioContent.mock.js`: static hub copy (levels, doors, tool groups,
the two neutral-tone strips' copy, the bottom banner), the same
stand-in-module precedent as Home's `homeContent.mock.js` (CR-029),
Adventures' `adventuresContent.mock.js` (CR-023), and Lore's
`loreContent.mock.js`. No CR filed this wave: this hub's copy is
static chrome, not a fetched feed. Art reused from the existing
`public/tmp-mockup-images` sample set; no new art acquired by this
brief.

## Submission-hub presentation

`docs/STUDIO-SPEC.md` section 3.1: "Public and Canon submissions
begin here." Carried by the hub explainer strip's copy ("Publish
finished work to the community as Public, or submit your best into
Canon for review"), honest fixtures only. No submission UI exists on
this hub (there is nothing to submit from a create hub with no
finished-work list); CR-014 (visibility enum data-model landing) and
CR-027 stay non-blocking, per the standing rule.
