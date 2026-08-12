# Creator Profile LOOM package

**Contract:** `CreatorProfile.contract.js` (v1.1.0)

## Purpose

The Creators profile-detail page, the largest single item on
`docs/PARITY-ECHO-FULL.md`'s Creators section (24 of that page's 26
CSV rows: hero, back button, stat tiles, follow, like/bookmark, share,
donate plus its modal, creations/activity/badges content, and the
profile's own load-error banner). Build address
`/studio/v2/creators/[handle]` (route law, cutover sequence).
Fixture-driven only, pre-parity: no fetch, no services-api, no
product data.

## Boundary

```text
[handle]/page.jsx (route)
  -> resolves the [handle] param, hands it to the Shell
  -> ../CreatorProfile.jsx (Shell)
      -> owns Next.js router (useRouter), passes onNavigate
      -> useCreatorProfileViewModel.js
          -> reads creatorProfileContent.mock.js (stand-in feed,
             keyed by handle, same precedent as Lore's
             loreContent.mock.js)
          -> owns follow/like/bookmark/mute toggles, per-work like/
             bookmark toggles, the works grid's load-more paging, the
             donate modal's fields and validation, the R4 notice
      -> CreatorProfile.view.jsx
          -> KitStudioPageView (bannerSlot = bottom banner, children
             = content)
          -> ProfileBackButton (self-contained, owns its own router;
             composed directly, not threaded through the ViewModel)
          -> StudioPageHeaderView (eyebrow "Creator Profile", the
             creator's display name as title, "@handle" as
             description) as headerSlot
          -> identity block: avatar, bio, tabular stat tiles
             (followers, following, plays, works), engagement action
             row (Follow, Donate, Like, Save, Share, Mute)
          -> Creations section: KitCreationCardView grid (no onPlay/
             onGenerate, expand fallback only) + KitLoadMoreView
          -> Activity section: page-local list (creation/donation
             events)
          -> Badges section: page-local grid
          -> DonateModal (page-local, mounted only while open):
             KitModalFrame -> KitFormFieldView (Amount) -> a
             page-local textarea (Message) -> a page-local checkbox
             (Anonymous) -> Cancel / Send donation
          -> KitPromoBannerView (bottom treatment) routing to Lore,
             Creators' next stop
          -> FixtureActionNotice (shared staging scaffold, honest
             stub)
```

The View is presentation only: every `onX` callback is supplied by
the ViewModel (or, for the back button, by the self-contained
`ProfileBackButton` kit package), which itself never imports
`next/navigation` (the Shell owns that boundary).

## Composition order, exhaustive

Back button -> page header (eyebrow, display name, handle) ->
identity block (avatar, bio, stat tiles, engagement row) -> Creations
(grid, load-more) -> Activity (list) -> Badges (grid) -> bottom banner
routing to Lore. A profile-level `errorMessage` replaces every section
below the header with a `KitAlertStripView` danger banner; this is
distinct from a section's own empty-state message (Creators parity
row 808-813 note: "the page's own top-level error state is a
different control").

## Item 36 / CR-028, mute control, RULED 11 Aug 2026, CLOSED

Placement is ruled: Mute content lives inline in the identity block's
engagement row only, alongside Follow, Donate, Like, Save, and Share,
as a quiet secondary action (icon plus word, never a filled button).
Label is "Mute content" ("Muted" when active); the accessible label
matches the visible label (button text content is the accessible
name), the icon is unchanged. The standalone-under-bio variant this
package once carried as a genuinely competing placement, its fixture
(`creatorProfileMutedStandalonePlacementFixture`), and the harness
toggle switching between them on both the product page and the
preview mirror are all retired. `creatorProfileMutedFixture` stays,
showing the "Muted" state in the engagement row.

## Existing kit packages composed, read-only this pass

`components/studio/profile/ProfileBackButton` (and its
`profile-back-button/` LOOM package) is the one existing profile-kit
package reused directly: a self-contained circular icon button that
owns its own router fallback, matching the icon-button exception to
the "never a pill" button rule (`docs/DESIGN-TOKENS.md` `--radius-full`
row). The rest of `components/studio/profile/**`
(`public-profile-hero`, `public-profile-tabs`,
`public-profile-engagement-actions`, `public-profile-donate-button`,
`public-profile-creation-grid`, `public-profile-activity-feed`,
`public-profile-badges`, `profile-follow-button`,
`profile-share-button`) was read for its contract shape but not
composed: those packages are styled to the pre-restyle legacy system
(raw `bg-black/NN` panel opacity, `text-[10px]` sub-11px type, no
`var(--space-*)`/`var(--radius-*)` tokens), which would visually break
this page's standard v2 composition if imported unmodified, and they
are out of this pass's file set to edit. This page's identity block,
engagement row, and donate modal are built page-local instead, on the
same token family and `RectButton`/`cf-btn` recipe every other v2 page
and `KitCreatorCardView` already use. Flagged for a future kit pass:
promoting this page's identity-block, engagement-row, and donate-modal
markup into shared `components/kit/` packages once a second consumer
exists.

`KitCreationCardView` (`components/kit/creation-card`) is composed for
the Creations grid exactly as Lore and every other v2 page's card
grids compose it, matching the brief's instruction that cards on this
page carry no `onPlay`/`onGenerate` handlers and keep the expand
fallback. `components/kit/creation-card/**` is out of this pass's file
set entirely (owned by the other lane this pass); it is imported by
its already-documented contract shape (as carried by
`Lore.contract.js`'s own typedefs) and neither read nor edited here.

## Data

`creatorProfileContent.mock.js`: a stand-in feed keyed by handle
(`vermillion`, `whiteviolin`, `nightloom`, `moonglass`), a subset of
`CreatorsV2Mockup.jsx`'s `FIXTURE_CREATORS` handles so a hub-to-detail
navigation in the fixture-driven preview resolves to a record that
reads like the same creator. `resolveCreatorProfile(handle)` falls
back to the `vermillion` record for any unresolved handle rather than
a hard failure, an honest stub (no profile-not-found surface is ruled
this pass; flagged for a future pass). `CREATOR_PROFILE_LONGEST` is a
separate, denser record used only by the longest-content fixture and
the ViewModel's `fixtureMode: "longestContent"`.

## Open gaps, flagged for `docs/CONTRACT-REQUESTS.md` (not edited this
pass, off limits; listed here for the designated writer)

- Donation submission has no live pipeline to submit to (same
  standing gap as Lore's CR-015 submission stub); `onSubmit` validates
  the amount, then stubs with the R4 notice.
- Sharing a profile has no live share-sheet integration; `onShare`
  stubs with the R4 notice, matching every other v2 page's Share
  control.
- Opening a work from the Creations grid has no creation-detail
  surface to route to yet; `onOpenAssetDetail` stubs with the R4
  notice, matching Lore's Community-grid cards.
- RESOLVED (design/creators-connections pass): the Followers and
  Following stat tiles now route to
  `/studio/v2/creators/[handle]/connections` (contract bumped 1.1.0 to
  1.2.0, additive: `onOpenFollowers`, `onOpenFollowing`). See
  `../creator-connections/README.md`.
