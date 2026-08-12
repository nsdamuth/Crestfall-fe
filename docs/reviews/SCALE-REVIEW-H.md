# Scale Review H

Read-only research pass, branch `design/h-docs-close`, worktree
`~/dev/Crestfall-fe-lane2`. No files edited except this one. No
render or browser verification performed; this is static code and
fixture analysis only.

## Scope note

The manifest names `art-placeholder` among the kit packages to
review. That package does not exist on `design/h-docs-close` (it
ships on `design/h-render-fixes`, a sibling branch not merged into
this one). Reviewed in its place: the existing no-art fallback
pattern each surface uses today (a generic icon-plus-caption block,
`components/kit/creation-card/KitCreationCard.view.jsx` and
`components/kit/destination-tile/KitDestinationTile.view.jsx`), since
that is the functional equivalent on this branch.

## Method

Every v2 page's Binding Shell, ViewModel, and View was read directly
(no dev server, no render). Item counts and volume behavior were
traced from fixture arrays through `useMemo` filter/sort chains into
the View's list, grid, and rail rendering. Kit packages were read for
their own internal caps, virtualization, and empty-state handling
independent of any one page's fixture size.

## Summary of findings

| Severity | Count |
|---|---|
| BREAKS | 3 |
| DEGRADES | 4 |
| COSMETIC | 0 |

Zero COSMETIC findings: truncation (`truncate`, `line-clamp-2`) and
flex `min-w-0` are applied consistently everywhere text can overflow
(creation-card titles, connections rows, activity list, profile
header, credits). Every list, rail, grid, and group across all
thirteen pages has a designed empty state (a message, an
`EmptyState`/`EmptySection` component, or the rail's own
renders-nothing law); no undesigned blank surface was found.

---

## BREAKS

### B1. Home's four rails render every item with no cap and no virtualization

**Files:** `app/studio/v2/home/home/useHomeViewModel.js`,
`components/kit/rail/KitRail.view.jsx`

**Scenario:** `topRatedRail`, `recentlyAddedRail`,
`fromTheCommunityRail`, and `creatorsToFollowRail` each build their
`items` array as `(railItemSource ?? HOME_X_ITEMS).map(decorate)`,
the full source array, unsliced. `KitRailView` then maps every child
into the DOM unconditionally (`Children.map(children, ...)`, no
windowing, no virtualization); the horizontal scroll is native-only.
If a rail's backend source returns hundreds of items, Home mounts
hundreds of full `KitCreationCardView`/`KitCreatorCardView` subtrees
on first load, four times over, before a user scrolls a single rail.

**Smallest fix:** cap each rail's `items` array at a fixed length
(the existing v2 rails elsewhere in the app, per
`docs/BUILD-BLUEPRINT.md` 2.16(o), read 12-ish per rail) inside the
ViewModel before it reaches `KitRailView`, and rely on the
already-present "View all" control as the sanctioned overflow path
to a full paginated page. No new component needed; `KitRailView`
itself needs no change, only its caller's input.

### B2. Every list page filters and sorts the complete in-memory dataset client-side

**Files:** `app/studio/v2/stories/StoriesV2Mockup.jsx`,
`app/studio/v2/vault/VaultV2Mockup.jsx`,
`app/studio/v2/community/CommunityV2Mockup.jsx`,
`app/studio/v2/images/ImagesV2Mockup.jsx`,
`app/studio/v2/creators/CreatorsV2Mockup.jsx`,
`app/studio/v2/lore/lore/useLoreViewModel.js`,
`app/studio/v2/adventures/adventures/useAdventuresViewModel.js`,
`components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel.js`

**Scenario:** Every one of these pages holds one full array
(`FIXTURE_X` today, presumably a full fetched collection once live)
and runs `.filter()`/`.sort()` over it inside a `useMemo`, re-executed
on every search keystroke, filter toggle, and sort change. This
architecture requires the entire catalog to already be resident in
the browser before any filter, sort, or search can apply. At
thousands of items this is the first thing to break: initial payload
size, memory, and per-keystroke recompute cost all scale with total
catalog size rather than with what's on screen.

**Smallest fix:** none available at the component layer; this is an
architectural constraint, not a rendering bug. It needs server-side
filter, sort, and search (a backend contract change), with the
client keeping only the current page's slice resident, load-more
requesting the next slice by the same filter/sort/search params
rather than re-deriving from a full local array. Flagged BREAKS
because it is the true ceiling on every other finding in this report,
not because it is a regression introduced by any recent change; it
is the known shape of the pre-parity, fixture-driven build.

### B3. Stories' Continue group has no cap on its expanded state

**Files:** `app/studio/v2/stories/StoriesV2Mockup.jsx`

**Scenario:** On this branch, the Continue section caps at three
compact rows behind a `continueExpanded` boolean and a "Show all in
progress" control. Once tapped, `continueExpanded ? continueItems :
continueItems.slice(0, CONTINUE_VISIBLE_CAP)` renders **all**
`continueItems` in one shot, with no further batching. Dozens of
in-progress items become dozens of full rows mounted at once, the
same all-at-once pattern as B1's rails.

**Smallest fix:** replace the cap-then-reveal-all toggle with the
ruled load-more pattern (`KitLoadMoreView`, `PAGE_SIZE` batches);
this is already implemented on the sibling `design/h-render-fixes`
branch (not yet in this branch's history). No new pattern is needed
here, only pulling that already-built fix forward when branches
converge.

---

## DEGRADES

### D1. Search input has no debounce or deferred value

**File:** `components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx`

**Scenario:** `SearchField`'s `onChange` fires synchronously on every
keystroke straight into each page's `searchValue` state, which is a
dependency of the full-dataset `useMemo` filter chain (B2). At small
fixture sizes this is free; at thousands of items, every keystroke
re-scans the full array on the main thread, producing visible input
lag.

**Smallest fix:** wrap the search-driven filtered result in React's
built-in `useDeferredValue` inside each page's ViewModel (no new
dependency), or add a short debounce inside `SearchField` itself so
one keystroke buffer serves every consuming page at once.

### D2. Filter-group option counts run one full-array pass per option, per render

**Files:** `app/studio/v2/vault/VaultV2Mockup.jsx`,
`app/studio/v2/community/CommunityV2Mockup.jsx`,
`app/studio/v2/images/ImagesV2Mockup.jsx`, and siblings with the same
`filterGroups` shape

**Scenario:** Each `filterGroups` `useMemo` computes a badge count
per filter option by calling `pool.filter(...).length` once per
option (Type has 3, Status has 2-4, Visibility has 4, Rating has 3+).
That is a fresh O(n) pass over the pool for every option on every
render where the pool changes, compounding with D1's per-keystroke
re-render at scale.

**Smallest fix:** not needed at current or near-term scale; flagged
as a watch-item. If real data volume grows, a single grouped tally
(one pass building a `Map` of counts, keyed by the field being
counted) replaces the N separate `.filter()` calls.

### D3. Asset-detail popup's carousel dot row has no cap and no overflow handling

**File:** `components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx`
(`CarouselDots`, called from `Carousel`)

**Scenario:** `CarouselDots` renders `Array.from({ length: count })`,
one button per media item plus one for the catalogue slide, inside
a fixed-width pill with no `overflow-x-auto` and no wrap. The
in-repo comment on `MediaLibrary` notes fixtures are "capped at four
items per fixture," but nothing in the component itself caps a real
asset's media count. A creation with twenty or more photos produces a
dot row that either overflows the pill's bounds or crowds unreadably;
this is well short of "thousands" but realistic for a popular
character's accumulated media over time.

**Smallest fix:** past a small threshold (roughly eight, matching the
credits package's own one-item-then-"View all (N)" collapse
instinct, `KitCreditsView`/`KitAssetDetailPopup`'s `R1 credits
collapse`), replace the dot row with a numeric "1 of N" readout
instead of one dot per item.

### D4. KitDropdown has no safeguard against an unbounded option source

**File:** `components/kit/dropdown/KitDropdown.view.jsx`

**Scenario:** Today every dropdown across these thirteen pages binds
to a small fixed enum (Type: 3 values, Status: 2-4, Visibility: 4,
Rating: 3-4, Home's sort: a handful), not an active defect. But the
component itself renders every option unconditionally into a
`max-h-[19rem] overflow-y-auto` panel with no virtualization and no
in-panel search-to-narrow. If a future filter is added on top of
this same component bound to an unbounded source (a creator picker,
a tag filter), hundreds of options would render into the DOM at once,
scrollable but with no way to search within the list.

**Smallest fix:** not needed today, since no current consumer is
unbounded. If/when a creator- or tag-scale filter is built, add a
search field inside the popover (the same list-narrowing pattern
`KitStudioFilterBar`'s own search field already establishes) before
binding `KitDropdown` to that source.

---

## Confirmed good (not findings, noted for completeness)

- **Image loading:** every grid/list card image
  (`KitCreationCard.view.jsx`) sets `loading="lazy"`; the image
  library page (`CreationImageLibraryPage.view.jsx`) eager-loads only
  its first `EAGER_IMAGE_COUNT` (4) images and lazy-loads the rest,
  paginated at 12 per batch (`VISIBLE_IMAGE_PAGE_SIZE`,
  `useCreationImageLibraryViewModel.js`) via the ruled load-more
  pattern.
- **Connections page:** `useCreatorConnectionsViewModel.js` properly
  paginates both tabs independently (`PAGE_SIZE = 6`,
  `KitLoadMoreView`), with a correct empty message per tab and
  `min-w-0`/`truncate` on every row for long handles and display
  names.
- **Credits collapse:** `KitAssetDetailPopup`'s `CollapsedCreditsBlock`
  shows one credit plus a "View all credits (N)" control opening
  `KitCreditsModal`, which is itself height-bounded
  (`max-h-[80dvh]`/`h-full` + `overflow-y-auto`) regardless of credit
  count; a real many-credits scenario stays scrollable and bounded,
  not a blank-canvas overflow.
- **Empty states:** every page's grid/list/group (Stories startable
  shelf, Vault, Community, Images, Creators, Lore community/mine,
  Adventures, Creator Profile works/activity/badges, Connections
  followers/following) has a designed non-blank empty state; Home's
  rails follow the documented renders-nothing law for an empty rail
  instead, which is the ruled precedent, not a gap.

---

## Top five findings (for the session summary)

1. **BREAKS:** Home's four rails render every source item with no
   cap, no virtualization (`useHomeViewModel.js`, `KitRail.view.jsx`).
2. **BREAKS:** every list page filters/sorts the full in-memory
   dataset client-side; this is the true scale ceiling across the
   whole app (Stories, Vault, Community, Images, Creators, Lore,
   Adventures, image library).
3. **BREAKS:** Stories' Continue group renders all items unbounded
   once expanded on this branch (already fixed on the sibling
   `design/h-render-fixes` branch, not yet in this branch's history).
4. **DEGRADES:** filter-bar search has no debounce/deferred value,
   compounding the full-dataset re-filter cost on every keystroke.
5. **DEGRADES:** asset-detail popup's carousel dot row has no cap
   and no overflow handling past a handful of media items.
