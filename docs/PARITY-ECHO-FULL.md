# PARITY-ECHO-FULL v1.1.0, 11 Aug 2026, branch design/h-docs-close

**Update, v1.1.0, same day.** Two sections below are re-disposed against
code shipped later on 11 Aug 2026, read live on this branch (cut from
origin/design/sprint-h-final at c2c6d1d): the Creators profile-detail
and connections pages (both now built, superseding the "unbuilt"
finding this document opened with), and the Vault edit tree, preview
tree, and image-library, re-disposed per
`docs/VAULT-EDIT-TREE-CLASSIFICATION.md`'s four-bucket read (72
COVERED, 15 GAP now built in this same pass, 9 DEFERRED, 1 RETIRED).
Every other page section below is unchanged from the same-day v1.0.0
pass and not re-verified in this update.

Read-only, per-page parity echo for every v2 page against
`docs/APP-FUNCTION-MAP.csv` (the canonical inventory), run against
this branch's actual code (cut from `origin/design/h-restore`, plus
this branch's own Stage 1 Community restoration, commit `a67f9fa`).
No code was changed to produce this document. Eight read-only
subagents enumerated the eight pages that exist on this branch; every
disposition below was verified by the agent reading the live file it
cites, not assumed from `docs/PARITY-AUDIT.md` prose alone (that
document, 10 Aug 2026, was the starting context; this pass re-checked
every claim against code as it stands today, one day and several
restorations later).

Disposition vocabulary, three values only, per the brief:

- **Present**: the control exists and works as described (a control
  backed by honestly-interim or deterministic data, with its data gap
  named and cited, is still Present, not Flagged; a control absent
  outright is Flagged or Deliberately excluded, never Present).
- **Flagged**: absent or partial, no ruling covers the gap.
- **Deliberately excluded (ruling cited)**: absent, with the specific
  ruling, CSV note, OPEN item, or CR named.

Rows that share one disposition and one citation across a large CSV
block (a 45-row chat-room surface, a 97-row edit-tree hold) are
grouped into one echo row citing the real CSV line range and row
count, rather than repeated 97 times. No grouping hides a
disposition change within the group; every group was confirmed
uniform by the agent that produced it.

## Home (/studio/v2/home)

| CSV line | control | disposition | note |
|---|---|---|---|
| 983 | Top banner "Start exploring" | Present | Stubbed honestly, opens R4 fixture-action notice. OPEN FOR BRIAN per CSV note (destination not yet ruled), not a parity gap. |
| 984 | Continue strip "Continue card" (display) | Deliberately excluded (ruling 1a) | Stale CSV row: merged into the one top banner. Confirmed in `Home.view.jsx`, no separate strip renders. |
| 985 | Continue strip "Continue CTA" (button) | Deliberately excluded (ruling 1a) | Same as 984; behavior lives on the merged top banner's CTA. |
| 986 | Destination tile "Stories" | Present | Routes to `/studio/v2/stories`, real navigation. |
| 987 | Destination tile "Adventures" | Present | Stubbed (opens R4 notice). |
| 988 | Destination tile "Studio" | Present | Stubbed (opens R4 notice); no live `/studio/v2/studio` route exists on this branch to route to (see "Studio and the editor route" below). |
| 989 | Destination tile "Images" | Present | Routes to `/studio/v2/images`. |
| 990 | Destination tile "Vault" | Present | Routes to `/studio/v2/vault`. |
| 991 | Destination tile "Community" | Present | Routes to `/studio/v2/community`. |
| 992 | Destination tile "Creators" | Present | Routes to `/studio/v2/creators`. |
| 993 | Destination tile "Lore" | Present | Stubbed (opens R4 notice). |
| 994 | Top rated / View all | Present | Stubbed, opens R4 notice. |
| 995 | Top rated / Scroll arrows | Present | Shared KitRail behavior. |
| 996 | Recently added / View all | Present | Stubbed, opens R4 notice. |
| 997 | Recently added / Scroll arrows | Present | Shared KitRail behavior. |
| 998 | From the community / View all | Present | Routes to `/studio/v2/community`. |
| 999 | From the community / Scroll arrows | Present | Shared KitRail behavior. |
| 1000 | Creators to follow / View all | Present | Routes to `/studio/v2/creators`. |
| 1001 | Creators to follow / Scroll arrows | Present | Shared KitRail behavior. |
| 1002 | Top rated / Sort (Recommended / Most played / Newest) | Present | Exact option match. Selection sets state only; no re-sort of the fixture list is implemented (row-note truth-up, not a gap). |
| 1003 | Rail cards, Like (heart) | Present | Local toggle state, shared across all three creation rails. |
| 1004 | Rail cards, Save (bookmark) | Present | Local toggle state. |
| 1005 | Rail cards, Expand (open destination) | Deliberately excluded (CSV row 1005 note) | "Deliberately excluded from the full KitAssetDetailPopup flow at this gate; flagged for Brian if a richer Home interaction is later wanted." |
| 1006 | Rail cards, Follow | Present | Local toggle state on creator cards. |
| 1007 | Rail cards, View profile | Present | FIXED per the 10 Aug audit: renders "View profile", matching row 862. |
| 1008 | Rail cards, Recent-work thumbnail | Present | Opens R4 notice, non-persisting. |
| 1009 | Bottom banner, Browse Stories | Present | Routes to `/studio/v2/stories`. |
| 49 (legacy `/studio`) | Dashboard search row | Deliberately excluded (`Home.contract.js` / README) | "Home carries no filter line and no local search; its one control beyond navigation is the top rail's sort." |
| 52 (legacy `/studio`) | Follow Storylines / View Storylines | Flagged | Missing on Home, no equivalent and no citation. Nearest surface is the stubbed Adventures tile (row 987), a distinct control. |
| 47, 51 (legacy `/studio`) | Community Stories / Browse Community | Present (Home equivalent) | CSV's own `destination_page` names Create > Studio, but Home carries a working equivalent (the community rail and tile, rows 998/991). |
| 56 (legacy `/studio`) | Build Images / Open Image Studio | Present (Home equivalent) | Same basis; Home's Images tile (row 989) is the working equivalent. |
| 48, 53, 54, 55 (legacy `/studio`) | Create Something, View My Stuff, Open Creation Studio, Manage My Creations | Deliberately excluded (`destination_page` column: Create > Studio) | CSV's own routing table assigns these to the future Studio/Vault destinations, not Home. |
| n/a (no CSV row) | Ruled creations filter (All/My creations; Private/Internal/Public/Canon) | Flagged | GATED on OPEN item 42 (the seat). Nothing is built, including the CR-030 localStorage interim. |

**Home summary:** 26 Present, 2 Flagged, 7 Deliberately excluded. No
drift found between code and the 10 Aug audit. Most impactful gap:
the creations filter, ruled but unbuilt, gated on OPEN item 42.

## Stories (/studio/v2/stories)

| CSV line | control | disposition | note |
|---|---|---|---|
| 29 | Room Controls toggle (mobile filter drawer) | Present | Replaced by the one-line sticky filter bar (filter-line law, 9 Aug 2026); presentation change. |
| 30 | Search rooms... (mobile) | Present | Merged into one filter-bar search input. |
| 31 | Active / Templates / Private / Archived filter pills | Present | Templates and Archived RESTORED as Status options by h-restore ruling 5. |
| 32 | View (grid/list) toggle, localStorage-persisted | Present | Persists to `cf.stories.viewMode`, folded into CR-030 by h-restore ruling 3. |
| 33 | Start Room Soon (disabled placeholder) | Flagged | No v2 equivalent found anywhere. Not named in any restoration commit; no ruling covers the absence. |
| 34, 35 | New Template (mobile + desktop toolbar) | Present | Restored by h-restore ruling 5. Opens an R4 fixture-action notice, consistent with the whole page's fixture-driven status. |
| 36 | Open Latest Room / No Rooms Yet | Flagged | No single "open latest room" toolbar CTA exists. No citation covers this gap. |
| 37 | Manage / Cancel Manage | Present | Restored by h-restore ruling 5. |
| 38 | Delete Selected (n), window.confirm | Present | Restores the original confirm wording verbatim, per h-restore ruling 5. |
| 39, 40, 41 | Search / filter pills / view toggle (desktop copy) | Present | v2 unifies the mobile/desktop duplicate into one control each; same restorations as 30/31/32. |
| 42 | Load error banner | Present | `KitAlertStripView` danger banner under `fixtureMode "error"`. Reachable only via the dev Fixture Mode harness, not a live-fetch failure, consistent with the page's fixture-driven nature. |
| 43 | Delete error banner | Flagged | `deleteSelected()` is local-state only and cannot fail; no distinct delete-failure banner exists separate from the load-error banner. No ruling covers this specific gap. |
| 44 | Room grid / list (display) | Present | |
| 45 | No rooms found (empty state) | Present | |
| 536-580 (45 rows) | Story chat room [id] surface, full block | Deliberately excluded (BUILD-BLUEPRINT 3.1 row 4) | Standing sweep-scope ruling, recorded in the page's own file header. |
| 889 | Search your stories | Flagged | Search now covers title, kind, status, visibility, rating, description, last-played (closing part of candidate 9). 5 of the original's 11 fields (scenario, narrator, location, last message, cast) have no equivalent because the v2 fixture model structurally carries none of those fields. No ruling closes this remaining model gap. |
| 890-903 (14 rows) | Type/Status/Visibility/Rating filters, Sort, Grid/List toggle, Continue card + CTA, Show all in progress, Like, Save, Expand, Show more, Browse Adventures CTA | Present | All confirmed live and wired. |
| 931-942 (12 rows) | Asset detail popup: Play, Like, Share, Save, carousel prev/next, dots, catalogue CTA, description toggle, view-all-credits, credit handle link, close | Present | All confirmed live, wired the same as the shared `KitAssetDetailPopup` package. |

**Stories summary:** 40 Present, 4 Flagged, 1 Deliberately excluded
(the 45-row chat-room block). Most impactful gap: the structural
fixture-model gap behind row 889, no scenario/narrator/location/
last-message/cast fields exist on `FIXTURE_STORIES` at all, so no
search or card-metadata fix is possible without a data-model change.

## Adventures (/studio/v2/adventures)

| CSV line | control | disposition | note |
|---|---|---|---|
| 431 | `/studio/storylines` page head | Deliberately excluded (product model 4.3) | Old-route chrome superseded by the ruled modal shape. |
| 432 | "Create Storyline" link | Present | Superseded 1:1 by the v2 "Build an Adventure" CTA opening the rehosted builder modal. |
| 433 | "Loading Storylines..." | Flagged | `loadMore.isLoading` is wired but hardcoded `false`; no fixture exercises a real loading state. |
| 434 | Error banner | Present | DRIFT from the audit text as originally written: a real `KitAlertStripView` danger banner now exists (added under this same "10 Aug 2026 parity audit" lineage), so this row reads Present, not the audit's older blanket fixture-scope note. |
| 435 | "No Storylines Yet" empty state | Present | |
| 436 | Storyline card grid, each a link to its own edit page | Flagged | Semantically replaced by a public catalog with no owner list and no edit entry. Candidate 6 overlaps; Vault and the Studio editor are the ruled homes for own-work editing. |
| 138 | Builder page head "Back to Create" | Deliberately excluded (product model 4.3) | Rehost is modal-shaped, not route-shaped; standalone chrome dropped. |
| 139-141, 143-158 (20 rows) | Builder sidebar (Title, Description, Visibility, Tags, Save Draft) and the full Narrative Sequence / Node Transitions / Triggers / Open-World Interludes tree | Present | `StorylineBuilderShell` consumed unmodified, zero contract change. Save Draft's known seam: success still `router.push`es to the old-system edit tree (Contract-frozen, H4 brief, report-only). |
| 142 | Content Rating (select) | Flagged | Pre-existing single-option stub predating the rehost; belongs to the builder itself, not the v2 wrapper. |
| n/a | Search + Sort (Top rated / Recently added / Most played) | Flagged | Net-new, no original counterpart; ruled acceptable in principle, but "Recently added" merely reverses array order with no backing date field. Listed for the live-wiring pass. |
| n/a | Fixture gap: `isBuilderOpen: true` unexercised | Flagged | None of the four fixtures exercise the open-modal state at the View layer. |
| n/a (CSV inventory) | CSV coverage for `/studio/v2/adventures` itself | Flagged | Confirmed by direct grep: zero CSV rows exist keyed to this route. Inventory gap, not a build gap; this document is wave H4's owed parity echo. |

**Adventures summary:** 22 Present, 6 Flagged, 2 Deliberately
excluded. Most impactful gap: the CSV inventory gap itself, the
page's whole contract surface has been un-auditable from the ledger
until this document, plus the un-replaced owner-drafts/edit-entry
list (row 436), which depends on the same Vault/Studio-editor work as
several other pages' largest gaps below.

## Lore (/studio/v2/lore)

| CSV line | control | disposition | note |
|---|---|---|---|
| 486 | Save Draft (real builder) | Present | Reached via the "Open the advanced lore editor" CTA and via Your Lore card click, both routing to the real `/studio/create/lore`. |
| 487-503 (17 rows) | Builder's errors/warnings, Title/Description/visibility/rating, mode switch, document metadata, JSON editor, chapter/section/block tree, tag attachment, image picker, preview mode, copy-link | Present | All reached via the working CTA/card path into the real builder, per h-restore ruling 4, confirmed live (not a stub route). |
| 488 | Title field specifically | Present | Also directly present in the v2 modal itself (KitFormField Title), in addition to being reachable via the CTA. |
| 785-792 (8 rows) | `/studio/official-characters` archive controls | Deliberately excluded (BUILD-BLUEPRINT 3.1 row 9, fold-at-go-live) | |
| 826-837 (12 rows) | `/characters` archive controls | Deliberately excluded (BUILD-BLUEPRINT 3.1 row 9, fold-at-go-live) | |
| n/a | v2 filters (Approval state, World or faction, Recency) | Present | Three ruled facets, fixture-defined option values. |
| n/a (CSV inventory) | `/lore` route (LoreArcAccordion page) | Flagged | Confirmed by grep: zero CSV rows exist. Covered only by the generic "lore-site pages" phrase in the fold ruling; inventory gap, not a page-disposition gap. |

**Lore summary:** 17 Present (all 18 builder rows reachable, one also
directly in the modal), 1 Flagged, 20 Deliberately excluded. The
h-restore CTA is verified live and real, not a dead link. Most
impactful gap: the `/lore` route's total absence from the CSV
inventory, the one Lore-adjacent surface this audit still cannot
characterize row by row.

## Community (/studio/v2/community)

| CSV line | control | disposition | note |
|---|---|---|---|
| 593 | Search creations, creators, tags... | Present | Covers title, subtitle/handle, description. Tags cannot match because no fixture creation carries a `tags` field (CR-037, same gap as the popup's tags row). |
| 594, 602, 603, 611-616 (9 rows) | Creations/Creators mode toggle and every Creators-mode-only control (pills, grid, like, bookmark, follow, view profile, load more) | Deliberately excluded (IA ruling) | "Creators mode... displaced by the separate Creators destination in the nine-page model." |
| 595 | Mobile grid density toggle | Present | Equivalent control (`ViewModeToggleView`), visible at all breakpoints rather than mobile-only. |
| 596 | Popular Tags pills | Deliberately excluded (chip-retirement law) | No tag facet replaces it. |
| 597 | Creation type pills (9 original values) | Flagged | Replaced by a 5-bucket Type dropdown; h-restore's own commit marks this "flagged for veto." Candidate 1, shared with Vault. |
| 598 | Creation filter pills (Featured/Canon/Recently Updated) | Present | Restored as Type-dropdown option rows per h-restore ruling 2. |
| 599 | Sort (Recommended/Newest/Recently Updated/Most Liked/Most Used) | Flagged | Most hearted restores Most Liked. Recently Updated still missing (CR-033, data-dependent). Most Used still missing, no CR filed. |
| 600 | Rating select | Present | CR-027, ruled final. |
| 601 | Rendering select | Present | Restored "as-is"; per-item value is deterministic, not real data (CR-034), control itself functional. |
| 604-610 (7 rows) | Creation card grid, Like, Save, Expand, Load N More | Present | |
| 607, 608 | Start Chat / Generate image on the card | Present | **Re-disposed 11 Aug 2026 (v1.1.0):** Creation-card contract 3.2.0 resolves candidate 7 for the card face. Story/Adventure-kind creations wire `onPlay` ("Start Chat"), `CommunityV2Mockup.jsx:486-490`. Row 522's popup-internal Generate link (below) is a separate, still-open control. |
| 617 | Load-error banner | Present | |
| 520 | Route resolution (creation vs lore) | Flagged | Popup handles one asset shape only, no branch for lore-type creations. |
| 521, 523 | Chat (renamed Play), Share | Present | |
| 522 | Generate link | Flagged | Same candidate 7 gap. |
| 524 | Creator handle link | Present | **Restored this session** (commit `a67f9fa`): real derived link from the existing `@handle`, not a stub. |
| 525-530 (6 rows) | Description toggle, status badges/stats, media tabs, media sort, media search, media tile grid | Present | Media tabs restored per h-restore ruling 5; tags row (a separate control from this list, see below) **restored this session**, control real, honestly data-empty pending CR-037. Videos/Liked/Bookmarked tabs render honest empty states pending CR-035. |
| 531 | Media tile Like/Bookmark quick actions | Flagged | No per-media control exists at all (not just data-empty); CR-035 covers the data, not the missing UI. |
| 532 | Load More (media) | Flagged | No pagination on the restored media grid; no citation covers the omission. |
| 533 | Media lightbox from a tile | Deliberately excluded (OPEN item 28) | Reconciled (ED1G review, 22 Aug 2026): ranked item 10 above previously listed this same control as an open FE fix; Deliberately excluded governs both references. |
| 534 | Per-asset load-error banner | Flagged | Popup has no independent fetch/error state; the page-level banner (617) is a coarser, different control. |
| 535 | Lore publication branch in the popup | Flagged | Acknowledged, carried-forward gap; no lore-type rendering path exists in the shared popup. |

**Community summary:** 22 Present, 8 Flagged, 11 Deliberately
excluded. **Re-disposed 11 Aug 2026 (v1.1.0):** the card face's Start
Chat / Generate image row flips to Present per Creation-card contract
3.2.0; the popup-internal Generate link (row 522) stays a separate,
still-open Flagged control. Both of this session's Stage 1 restorations verified real
in the live code. Most impactful gap: the media library restoration
gave back browsing chrome (tabs, sort, search) with none of its
interactivity, no per-media like/bookmark, no pagination, no
lightbox from a tile.

## Creators (/studio/v2/creators)

| CSV line | control | disposition | note |
|---|---|---|---|
| 23-25 (3 rows) | `/studio/profile` (own-profile) shell: Edit Soon, tab bar, featured grid | Flagged | Entire route is a disabled, non-live placeholder in the original; no equivalent self-profile view exists on Creators (a browse grid, not a detail page). |
| 796-801 (6 rows) | Profile-detail hero, back button, stat tiles, follower/following links, like/bookmark creator | Present | **Re-disposed 11 Aug 2026 (v1.1.0):** the profile-detail page is now built at `/studio/v2/creators/[handle]` (contract 1.2.0). Back button (`CreatorProfile.view.jsx:272`); avatar/bio identity block (309-323); Followers/Following stat tiles are clickable links to the connections page (327-338); Like/Save toggles on the profile itself (358-369). |
| 802 | Follow creator button | Present | Matches `KitCreatorCardView`'s Follow/Following toggle; also present again on the profile-detail page's own engagement row. |
| 803-807 (5 rows) | Donate button + modal (amount, message, anonymous) + Share | Present | **Re-disposed 11 Aug 2026 (v1.1.0):** Donate opens a modal with Amount (number input, error slot), Message (optional textarea), a Donate anonymously checkbox, Send donation, and Cancel (`CreatorProfile.view.jsx:162-229,352-357`). Share renders icon plus the word "Share" per Ruling 6 (`CreatorProfile.view.jsx:370`). |
| 808-813 (6 rows) | Creations/Activity/Badges tabs, public creation grid, activity feed, badge grid, profile load-error banner | Present | **Re-disposed 11 Aug 2026 (v1.1.0):** the creation grid (376-389), activity feed (392-407), and badge grid (409-412) are all present, each with its own load-more; a page-level load-error banner replaces the content area on `errorMessage` (`KitAlertStripView`, 293-294). One drift from the original CSV wording: the three sections render as stacked blocks, not a tab switcher; a presentation change, not a missing control. |
| 814-817 (4 rows) | Connections sub-page (back link, tabs, connection list, per-connection profile link) | Present | **Re-disposed 11 Aug 2026 (v1.1.0):** built at `/studio/v2/creators/[handle]/connections` (contract 1.0.0). Back (158); Followers/Following `TabSwitcher` tabs, rendered "{count} {label}" (189-194, labels 40/47); connection rows link to that connection's own profile (110-121). |
| 818 | Follow / Following (per connection) | Present | Same disposition as row 802; per-row `FollowButton` (`CreatorConnections.view.jsx:91`). |

**Creators summary:** 23 Present, 3 Flagged, 0 Deliberately excluded.
**Re-disposed 11 Aug 2026 (v1.1.0):** the profile-detail page and its
connections sub-page shipped this same day, flipping 21 of the 24
previously Flagged rows to Present. Only the 3-row `/studio/profile`
own-profile placeholder (rows 23-25, a different, unbuilt route) stays
Flagged; no equivalent surface is ruled for it. This closes item 22 on
the ranked remaining-parity list below and the single largest Flagged
block in this document's original headline numbers.

## Vault (/studio/v2/vault)

| CSV line | control | disposition | note |
|---|---|---|---|
| 702 | Search your creations... | Present | Restores title, subtitle, description, visibility-label coverage. Narrower than the original's six-field match (candidate 9), disposed Present as a functioning search. |
| 704 | Status/type tabs | Present | **Confirmed shipped**: five ruled buckets (Characters/Worlds/Looks/Stories/Adventures) per h-restore ruling 1, replacing the 27 legacy buckets. Worlds renders an honest zero count pending CR-032 (no location/lore/faction card kind yet); this is a genuine, non-fabricated zero. Status buckets (Drafts, In Review) remain absent. |
| 708-710, 714-716 (6 rows) | Card grid, Like, Bookmark, Edit-as-popup-open, open-preview, Load More | Present | |
| 703 | Your Tags (tag filter pills) | Flagged | No per-tag facet exists. |
| 705 | Mobile density toggle | Flagged | Only the desktop grid/list toggle exists. |
| 706 | Create New (link) | Flagged | No control inside the filter bar; the promo-banner/empty-state action opens only a fixture notice. |
| 707 | Load-error banner | Flagged | Renders, but as static copy with no interpolated live error message. |
| 712, 713 (2 rows) | Start chat, Generate image (card overlay) | Present | **Re-disposed 11 Aug 2026 (v1.1.0):** Creation-card contract 3.2.0 resolves candidate 7. Story/Adventure-kind cards wire `onPlay` ("Start Chat"), `VaultV2Mockup.jsx:428-432`; Vault's grid is not image-kind, so Generate is not reached here, matching Images' own page-scoped wiring. |
| 711 | Set default PC (card overlay) | Flagged | Not wired on the card overlay itself; distinct from the Editor's own "Set Default PC" control (COVERED per `docs/VAULT-EDIT-TREE-CLASSIFICATION.md` row 717), which is a different surface. |
| 717-784 (68 rows) | The full edit tree (shell chrome, media panel, featured-image picker, mechanics quick nav, overview, publishing, sticky action bar, danger, identity, appearance, body, behavior, advanced, visual references, actor mechanics profile, runtime mechanics modules, mechanics module picker) | Present | **Re-disposed 11 Aug 2026 (v1.1.0), citing `docs/VAULT-EDIT-TREE-CLASSIFICATION.md` Group A.** CR-007/CR-008 resolved: all 68 rows COVERED, reached at `/studio/v2/editor/[id]` (Editor contract 1.2.0), which composes the exact same unmodified legacy edit-tree components (`CreationEditSectionContent.jsx` and kin). |
| 838, 840, 842-844 (5 rows) | Preview tree: Lore document renderer, copy-link, character/location chips, dev preview banner | Present | Re-disposed, classification doc Group B: 4 COVERED. |
| 839 | Preview tree: owner-only draft preview badge | Present | Re-disposed, classification doc Group B GAP, built this pass: "Owner-only draft preview" badge, `Editor.view.jsx:168-170`, driven by `isLoreDraftPreview` (`Editor.jsx:64,82`). |
| 838 | Preview tree: "Back to Lore editor" link | Deliberately excluded (classification doc Group B, RETIRED) | Superseded by the tab-based navigation model; the Public Preview is a section tab inside the editor itself, so a dedicated "back to editor" link has nothing to return from. |
| 841 | Preview tree: Contents (table of contents) | Deliberately excluded (classification doc Group B, DEFERRED) | Suppressed by the hardcoded `compact` prop inside the forbidden-to-edit `CreationEditSectionContent.jsx`; a one-line fix outside this brief's file boundary. |
| 409-421, 430 (14 rows) | Image-library: refresh, back-to-editor, featured slots, eligibility filter, sort, image grid, slot assignment, hide/show/delete, like/bookmark quick actions, expand-to-lightbox, share | Present | **Re-disposed 11 Aug 2026 (v1.1.0), classification doc Group C.** Built at `/studio/v2/editor/[id]/image-library` (contract 1.0.0), composing the unmodified legacy `CreationImageLibraryPage` package. |
| 422-429 except 430 (8 rows) | Image-library lightbox management set (Generate Variant, Download, Details, Report + subfields, Remix/Reference/More Soon, Delete) | Deliberately excluded (OPEN item 28, viewer reconciliation) | Same standing hold as Community's and Images' own lightbox, per classification doc Group C; not lifted for Vault alone. |

**Vault summary:** 97 Present, 5 Flagged, 10 Deliberately excluded
(112 rows total: 10 Present / 5 Flagged hub rows, up from 8/7 in the
v1.0.0 pass now that Start chat and Generate image are wired via
Creation-card contract 3.2.0, plus the 97-row CR-007/CR-008 hold now
re-disposed 87 Present / 0 Flagged / 10 Deliberately excluded per
`docs/VAULT-EDIT-TREE-CLASSIFICATION.md`, all 15 of its GAP rows,
including row 839's badge, confirmed built this pass). **Re-disposed
11 Aug 2026 (v1.1.0):** CR-007/CR-008 is resolved; the edit tree, the
preview tree (bar one retired and one deferred row), and the
image-library are all built and reachable from `/studio/v2/vault` via
the new `/studio/v2/editor/[id]` route. The remaining excluded rows
sit under the separate, standing OPEN item 28 (viewer reconciliation,
unchanged by this ruling) plus the one RETIRED preview-page link. The
5 remaining Flagged hub rows (Your Tags, mobile density toggle, Create
New, load-error banner interpolation, Set default PC) are unrelated to
CR-007/CR-008 and untouched by this pass. This closes item 23 and item
18's Vault half on the ranked remaining-parity list below, the
second-largest structural item in this document's original headline
numbers.

## Images (/studio/v2/images)

| CSV line | control | disposition | note |
|---|---|---|---|
| 163-185, 947-951 (23 rows) | Composer: mode toggle, all six ingredient slots, picker, custom guidance, save-preset modal, prompt/negative prompt, five option selects, Generate, coins readout, video selects, Generate Video Soon, mobile bottom sheet | Present | Full parity, verified verbatim against the original source; every option value and default matches. |
| 186 | Image Library grid (display) | Present | Browse-hub grid renders the fixture set (a distinct surface from the excluded image-library-editing rows below). |
| 187-193, 952 (8 rows) | Media-type pills, filters toggle, density toggle, selection mode, select all/clear, bulk delete | Deliberately excluded (Sprint E 1.1 library-disposition ruling) | Recorded as landing at live wiring, not invented into the fixture page. |
| 194-197 (4 rows) | Card open, Like, Bookmark, Expand | Present | |
| 198 | Load More (cursor pagination) | Deliberately excluded (Sprint E 1.1 ruling) | v2's Load More reveals more of a static array, not cursor-backed pagination; named explicitly by the audit as part of the deferred bucket. |
| 199, 202-209, 953-956 (14 rows) | Lightbox: thumbnail rail, Download, Generate Variant, Details (+Close), Report (+reason, note, submit), Remix/Reference/More Soon, Delete | Deliberately excluded (OPEN item 28, viewer reconciliation) | |
| 200, 201, 210 (3 rows) | Lightbox Like/Bookmark, Share, Close | Present | |
| 412, 413 | Eligibility filter, Eligible First/Needs Review First sorts | Present | **Confirmed shipped** by h-restore; backed by CR-036, deterministic per-id derivation pending a real moderation field. Same interim-data pattern as Community's Rendering filter. |
| 409-411, 414-430 (19 rows) | Image-library editing surface (refresh, back-to-editor, featured slots, slot assignment, hide/show/delete, lightbox management set) | Deliberately excluded (CR-007/CR-008 hold) | Same hold as Vault's twin block; not implemented at all on this page. |

**Images summary:** 38 Present, 0 Flagged, 42 Deliberately excluded.
Every remaining gap traces to an existing ruling, none is
unresolved-and-uncited. Most impactful gap: the lightbox's excluded
management set under OPEN item 28, a creator can browse, filter,
sort, generate, and react, but cannot inspect, report, or delete an
image from inside the viewer.

## Studio and the editor route

**Update, v1.1.0, 11 Aug 2026:** both surfaces named in this section's
original heading now exist on this branch (`design/h-docs-close`, cut
from `origin/design/sprint-h-final` at c2c6d1d). `/studio/v2/editor/[id]`
exists: `app/studio/v2/editor/` composes the unmodified legacy edit
tree behind Editor contract 1.2.0, with
`app/studio/v2/editor/[id]/image-library/` (contract 1.0.0) alongside
it; its disposition is folded into the Vault section above, since the
editor is the Vault-reached destination the CR-007/CR-008 hold was
blocking on, not a page with its own CSV-assigned destination in the
nine-page model. **Correction:** `/studio/v2/studio` (the Studio hub
page itself, distinct from the editor) also already exists on this
branch, contrary to this document's original v1.0.0 finding:
`app/studio/v2/studio/page.jsx`, `Studio.jsx`, contract 1.0.0, shipped
by commit `fb75b60` ("Brief S1, ladder layout with Character quick
create"), an ancestor of this branch's own HEAD, so it was not merged
today, it was simply misread as absent by the earlier same-day pass.
This document has never run a parity echo against the Studio hub's own
code; that pass, plus a correction of the "Studio" destination tile
row above (Home row 988, still described as stubbed pending this
route), is still owed and not performed in this update.

## Headline numbers

Across the 8 pages that exist on this branch (Home, Stories,
Adventures, Lore, Community, Creators, Vault, Images), 407 echo rows
disposed (some rows represent grouped CSV-line ranges sharing one
disposition and citation, cited by their real line count above, not
one physical CSV row each). **Updated 11 Aug 2026 (v1.1.0)** for the
Creators and Vault re-dispositions above; every other page's count is
unchanged from the same-day v1.0.0 pass.

| Disposition | Count |
|---|---|
| Present | 285 |
| Flagged | 29 |
| Deliberately excluded (ruling cited) | 93 |

By page (Present / Flagged / Deliberately excluded):

| Page | Present | Flagged | Deliberately excluded |
|---|---|---|---|
| Home | 26 | 2 | 7 |
| Stories | 40 | 4 | 1 (45 rows) |
| Adventures | 22 | 6 | 2 |
| Lore | 17 | 1 | 20 |
| Community | 22 | 8 | 11 |
| Creators | 23 | 3 | 0 |
| Vault | 97 | 5 | 10 (2 groups) |
| Images | 38 | 0 | 42 |
| Studio / editor | editor folded into Vault above; Studio hub exists on this branch (correction, see that section) but has never had its own parity echo pass, not counted | | |

The two pages that carried this document's entire structural weight
are both mostly closed by this update: Creators (was 24 of 26 rows
Flagged because the profile-detail page did not exist; now 3, the
unrelated own-profile placeholder only) and Vault (was 97 of 112 rows
excluded under the CR-007/CR-008 hold; now 87 of those 97 are Present,
9 remain excluded under the separate, unrelated OPEN item 28 viewer-
reconciliation hold plus 1 RETIRED, and 2 more hub rows flip Present
via the same-day card-law ruling). Community's card face also gains 2
Present rows under the same ruling. Every remaining page's Flagged
count is a handful of specific, individually fixable controls.

## Ranked remaining-parity list, shortest path first

Ordered by how much work stands between today and each item closing,
not by how much it matters. Items that need only a wiring change or
an honest fixture addition come first; items that need new data,
then a new page, then a cross-branch merge come last.

1. **Adventures: fixture gap, `isBuilderOpen: true` unexercised at
   the View layer.** Add one fixture entry. No code change beyond
   the fixture file.
2. **Adventures: "Loading Storylines..." hardcoded false.** Wire
   `loadMore.isLoading` to the existing fixture-mode pattern already
   used elsewhere on the page (the error state proves the pattern
   exists).
3. **Stories: "Start Room Soon" placeholder missing.** Add one
   disabled control matching the Soon-treatment convention already
   used on Home and Studio's other doors.
4. **Vault: load-error banner is static copy, not an interpolated
   live message.** Same fixture-mode pattern as items 1 to 2; the
   banner exists, only its content is static.
5. **Community: per-asset (popup) load-error banner missing.** The
   page-level banner already exists as a template to copy from.
6. **Stories: delete-confirmation error banner missing.** `deleteSelected()`
   is local-state only today; add the banner alongside the
   already-restored confirm-wording flow.
7. **Vault: mobile density toggle and "Create New" link missing from
   the filter bar.** Two small, independent control additions to an
   already-built filter bar.
8. **Community: media tile Load More (pagination) missing.** The
   restored media grid renders everything at once; add a slice/reveal
   control matching the pattern already used for the main creation
   grid's own Load More.
9. **Stories: "Open Latest Room" toolbar CTA missing.** One button;
   its destination (the excluded chat surface) is already ruled, so
   this is presentation only, not a new destination.
10. **Community: media tile lightbox, reconciled to Deliberately
    excluded (ED1G review, 22 Aug 2026).** Previously listed here as
    an open FE fix while row 533 (OPEN item 28) marked the same
    control Deliberately excluded; the two dispositions conflicted.
    Deliberately excluded now governs both references as the more
    specific, more recently reasoned entry; this list item is kept
    only for the reconciliation record, not as an open fix.
11. **Community: media tile Like/Bookmark quick actions missing.**
    Needs the CR-035 per-media data shape decided first (a small
    schema addition), then a UI control matching the main card's
    existing Like/Bookmark pattern.
12. **Vault: "Your Tags" filter pills missing.** Needs a tag data
    source decided (may ride the same CR-037 line Community's tags
    row is waiting on) before the control can be built honestly.
13. **Adventures: CSV inventory gap for `/studio/v2/adventures`
    itself.** Zero rows exist; this document's own tables above are
    the fix in substance, but the canonical CSV still needs the rows
    added by whoever next has write access to it (out of this
    branch's scope, `docs/APP-FUNCTION-MAP.csv` is a forbidden write
    here).
14. **Lore: CSV inventory gap for the `/lore` route.** Same shape as
    item 13, a standing-doc write this branch cannot make.
15. **Creators: "Most hearted" sorts by works, not hearts, because the
    creator-card contract carries no hearts stat.** Contract-gated;
    needs a `hearts` field added to `KitCreatorCard`'s stat shape
    (CSV row 859, OPEN item 9), a scoped, single-package contract
    change.
16. **Images: eligibility and Community: Rendering filter both run on
    deterministic, per-id-derived interim data (CR-036, CR-034).**
    Not broken, but both are waiting on a real moderation/render-style
    field from the backend to stop being interim. Same shape as the
    tags-row wait (CR-037) and the Rendering filter's own wait.
17. **Community: two sort options (Recently Updated, Most Used) and
    the exact Type-facet value set (candidate 1, shared with Vault,
    "flagged for veto" by h-restore itself) need a product ruling,
    not more engineering.** Blocked on Brian, not on build time.
18. **CLOSED 11 Aug 2026 (v1.1.0).** ~~Community and Vault: card-face
    Start Chat / Generate image actions (candidate 7).~~ Creation-card
    contract 3.2.0 resolves both: the third overlay icon is contextual
    (Play on Story/Adventure-kind cards, Generate on Image-kind cards,
    Expand as the universal fallback).
19. **Community: the popup has no lore-type rendering branch**, so a
    Lore creation opened from Community's grid has nowhere honest to
    land inside the shared `KitAssetDetailPopup`. Needs either a
    lore-specific popup layout or a ruled redirect to the Lore page's
    own detail surface.
20. **Images: the Sprint E 1.1-deferred library-management surface**
    (selection mode, bulk delete, cursor pagination) is recorded as
    landing at live wiring, needing real backend endpoints before it
    can be honestly built. **Narrowed 11 Aug 2026 (v1.1.0):** Vault's
    own image-library is now built (`/studio/v2/editor/[id]/image-
    library`, contract 1.0.0), and its control set per
    `docs/VAULT-EDIT-TREE-CLASSIFICATION.md` Group C does not include
    selection mode, bulk delete, or cursor pagination either, so this
    item's scope was correctly wider than "Vault's page does not exist
    yet"; both pages carry the same specific gap now.
21. **Images, Vault: OPEN item 28 (viewer reconciliation)** holds back
    9 of the image lightbox's 13 original controls (Download, Details,
    Report and its sub-fields, Generate Variant, Delete, thumbnail
    rail, three Soon stubs) on both pages identically, now including
    Vault's own newly built image-library lightbox (same shared
    `MediaLightbox`, same standing hold). A single viewer-
    reconciliation pass would close this everywhere it appears at
    once, the single highest-leverage fix remaining on this list.
22. **CLOSED 11 Aug 2026 (v1.1.0).** ~~Creators: the entire
    profile-detail page does not exist.~~ Built at
    `/studio/v2/creators/[handle]` (contract 1.2.0) with its
    connections sub-page (contract 1.0.0); 21 of the 24 previously
    Flagged rows flip Present, see the Creators section above.
23. **Images: the CR-007/CR-008 hold's remaining 19 rows (image-
    library editing surface) are excluded on the Images page itself.**
    **Narrowed 11 Aug 2026 (v1.1.0):** Vault's own 97-row share of this
    hold is resolved (see the Vault section above); the Images page
    does not compose the new editor's image-library route and still
    has no in-page path to featured-slot management, so its own 19
    rows stay excluded under the same citation. Not a missing control,
    a missing composition on this one page.
24. **CLOSED as a merge blocker, still open as an audit gap.** The
    advanced editor (`/studio/v2/editor/[id]`, contract 1.2.0) and the
    Studio hub page (`/studio/v2/studio`, contract 1.0.0, Brief S1) are
    both present on this branch, resolving CR-007/CR-008 for Vault per
    item 22's closure above and the Vault section. **Still open:**
    neither surface has ever had its own read-only parity echo pass in
    this document; that pass is owed. Adventures' and Stories' own "no
    edit entry from the catalog" gaps (rows flagged in those sections
    above) are unaffected by the editor's arrival, since neither page's
    card grid routes to it yet.
