# Creator Connections LOOM package

**Contract:** `CreatorConnections.contract.js` (v1.0.0)

## Purpose

The Creators connections sub-page, `docs/PARITY-ECHO-FULL.md` Creators
rows 814-818 (back link, tabs, connection list, per-connection profile
link, per-connection follow/following control). Build address
`/studio/v2/creators/[handle]/connections` (route law, cutover
sequence). Fixture-driven only, pre-parity: no fetch, no
services-api, no product data.

## Boundary

```text
[handle]/connections/page.jsx (route)
  -> resolves the [handle] param and ?tab= search param, hands both to
     the Shell
  -> ../CreatorConnections.jsx (Shell)
      -> owns Next.js router (useRouter), passes onNavigate
      -> useCreatorConnectionsViewModel.js
          -> reads creatorConnectionsContent.mock.js (stand-in feed,
             keyed by handle, same precedent as
             ../creator-profile/creatorProfileContent.mock.js)
          -> owns the active tab, each tab's load-more batch size, and
             per-connection follow toggles
      -> CreatorConnections.view.jsx
          -> KitStudioPageView (bannerSlot = bottom banner, children =
             content)
          -> ProfileBackButton (self-contained, owns its own router;
             composed directly, not threaded through the ViewModel;
             `fallbackHref` points back at the owning creator's
             profile page)
          -> StudioPageHeaderView (eyebrow "Creator Profile", the
             owning creator's display name as title, "@handle" as
             description)
          -> tab switcher (Followers count / Following count)
          -> capped connection list (avatar, display name, handle,
             follow/following control) + KitLoadMoreView
          -> KitPromoBannerView (bottom treatment) routing to Lore,
             Creators' next stop
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel (or, for the back button, by the self-contained
`ProfileBackButton` kit package), which itself never imports
`next/navigation` (the Shell owns that boundary).

## Composition order, exhaustive

Back button -> page header (eyebrow, display name, handle) -> tab
switcher -> connection list (load-more) -> bottom banner routing to
Lore. A page-level `errorMessage` replaces the tab switcher and list
with a `KitAlertStripView` danger banner; this is distinct from a
tab's own empty-state message.

## Sections versus switcher, RULED this pass

The brief left the choice open between stacked sections and a
switcher. Built as a switcher (tabs): the legacy connections page this
sub-page replaces (`app/studio/profile/[username]/connections/page.js`)
already renders Followers and Following as a two-way tab switch, and
the parity ledger itself names the control "tabs" (row 814-817:
"Connections sub-page (back link, tabs, connection list, per-connection
profile link)"). A switcher also keeps the initial render to one
capped list instead of two, matching the high-volume law's intent of
bounding what renders by default.

## Existing kit packages composed, read-only this pass

`components/studio/profile/ProfileBackButton` is reused directly, same
as the creator-profile package. `components/studio/community/
creator-list-row/**` was read for precedent (an existing
avatar/handle/follow-control list row) but not composed: it is styled
to the pre-restyle legacy system (raw `rounded-full` badge pills,
sub-11px type, no `var(--space-*)`/`var(--radius-*)` tokens) and sits
outside `app/studio/v2/creators/**`. This page's connection row is
built page-local instead, on the same token family and `RectButton`
recipe every other v2 page and `KitCreatorCardView` already use.
Flagged for a future kit pass: promoting this row into a shared
`components/kit/` package once a second consumer exists.

## Data

`creatorConnectionsContent.mock.js`: a stand-in feed keyed by handle
(`vermillion`, `whiteviolin`, `nightloom`, `moonglass`), the same
subset `creatorProfileContent.mock.js` uses, so a profile-to-connections
navigation in the fixture-driven preview resolves to a record that
reads like the same creator. `resolveCreatorConnections(handle)`
returns `null` for any unresolved handle; the ViewModel falls back to
empty lists rather than a hard failure, an honest stub matching the
profile package's precedent.

## High-volume law

Applies from birth: each tab's list renders a capped batch (six
entries) then a "Show more" following the load-more pattern the
profile page's Creations and Activity sections already use. Each
tab's visible count is tracked independently, so switching tabs does
not reset a tab's own progress.
`CreatorConnections.fixtures.js` carries a 32-entry followers state
(`creatorConnectionsCapFixture`) plus a second-batch-revealed state
(`creatorConnectionsCapAppendedFixture`) proving both the cap and the
append behavior.

## Open gaps, flagged for `docs/CONTRACT-REQUESTS.md` (not edited this
pass, off limits; listed here for the designated writer)

- Follow/unfollow on this page is local-state only, same as the
  profile page's own Follow control (row 802 precedent): no live
  follow API exists yet.
