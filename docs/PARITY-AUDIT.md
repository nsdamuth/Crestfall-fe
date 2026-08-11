# PARITY-AUDIT v1.0.0, 10 Aug 2026, branch design/parity-audit

Audit of every v2 page built so far (home, stories, adventures, lore,
community, creators, vault, images) against `docs/APP-FUNCTION-MAP.csv`
(the canonical inventory) and the live original components, per
Brian's finding that the new modals, dropdowns, filters, and sort
controls may not carry everything the original app offers. Compared
code against code and against the CSV, never against the v2 pages'
own fixtures. Eight read-only audit agents enumerated the pages; every
finding that led to a fix was re-verified by hand in this session.

Verdict in one paragraph: the composer surfaces are faithful (the
Images creator panel matches the original option-for-option, and the
Adventures builder rehost carries all 27 internal controls), but the
browse-surface controls are thinner than the originals in specific,
enumerable ways. The largest single gap is the Vault type facet (27
original type/status buckets reduced to 5 options). Three gaps were
straightforward missing options on existing controls and are FIXED on
this branch (section 9). Everything else is either DELIBERATELY
EXCLUDED with a citable ruling, or listed in section 10 as a candidate
for Brian's ruling; nothing new was built.

Disposition vocabulary: PRESENT (equivalent exists, deltas noted),
MISSING (absent, no recorded exclusion), DELIBERATELY EXCLUDED (absent
with the ruling cited), GATED (absent, waiting on a named open item),
DEFERRED (absent, recorded as landing at live wiring), FIXED (was
missing, fixed by this pass).

## 1. Home (/studio/v2/home)

Home is a new composition; its originals are the legacy `/studio`
dashboard rows, most of which the CSV itself assigns to the future
Studio destination.

- Modals: only the R4 fixture-action notice and the dropdown phone
  sheet. The asset detail popup is DELIBERATELY EXCLUDED on Home (CSV
  row 1005 note: "Deliberately excluded from the full
  KitAssetDetailPopup flow at this gate; flagged for Brian if a richer
  Home interaction is later wanted").
- Sort (top rail): PRESENT and exact. Recommended / Most played /
  Newest, default Recommended, matching CSV row 1002 verbatim. Note:
  the selection sets state only; no re-sort of the fixture list is
  implemented. Listed for H6 as a row-note truth-up.
- The ruled creations filter (All creations; My creations; Private,
  Internal, Public, Canon): GATED, not missing. Wave H1b waits on OPEN
  item 42 (the seat); nothing of it is built, including the CR-030
  localStorage interim.
- Legacy `/studio` dashboard rows: Community Stories, Browse Community,
  and Build Images have working Home equivalents (tiles and rail
  routes); the create-shaped rows (Create Something, Open Creation
  Studio, View My Stuff, Manage My Creations) belong to the Studio and
  Vault destinations per the CSV's own destination_page column; the
  dashboard search row is DELIBERATELY EXCLUDED ("Home carries no
  filter line and no local search", Home.contract.js, README).
  Follow Storylines / View Storylines: MISSING on Home, no equivalent
  and no citation; nearest surface is the stubbed Adventures tile.
- Stale CSV rows for H6: rows 984 and 985 still describe the removed
  card-treatment Continue strip; ruling 1a merged it into the top
  banner (already listed by wave H1's report).
- FIXED here (shared kit): the creator card's action label renders
  "View profile" again, matching CSV rows 1007 and 862 and the
  creator-card README, which all name the control "View profile"
  while the shipped view rendered "Profile".

## 2. Stories (/studio/v2/stories)

Original: the `/studio/story-rooms` hub. The chat room [id] surface
(45 rows) is DELIBERATELY EXCLUDED by the standing sweep-scope ruling
(BUILD-BLUEPRINT 3.1 row 4), recorded in the page header.

Modals:

- v2 adds the asset detail popup and stacked credits modal (no
  original counterpart; original card click navigated straight to the
  chat room, which is the excluded surface).
- Bulk-delete confirmation (window.confirm with the full ruled
  wording) and the whole manage mode behind it: MISSING, no citation.
- Mobile Room Controls drawer: replaced by the one-line sticky filter
  bar (filter-line law, 9 Aug 2026); PRESENT as a presentation change.

Filters and sorts, option sets verbatim:

- Original bucket pills: Active / Templates / Private / Archived
  (single-select, default Active). v2 replaces them with four
  multi-select dropdowns: Type (Character, Story, Adventure), Status
  (In progress, Startable), Visibility (Private, Internal, Public,
  Canon), Rating (Everyone, Teen, Adult). PRESENT as a model change
  for Active and Private; **Templates and Archived have no v2
  equivalent at all**: MISSING, no citation. Candidate 2.
- Sort (Latest activity, Title A to Z): net-new, original had no sort.
  Already logged as OPEN item 17 (Sprint D).
- Status facet's self-nullifying "In progress" option (filters apply
  to the startable shelf only): recorded as a built default, not
  re-flagged here.
- Search: original matched 11 fields (title, subtitle, type, status,
  visibility, rating, scenario, narrator, location, last message,
  cast); v2 matches title only. Part of the cross-page search-scope
  pattern, candidate 9.

Also MISSING, no citation: New Template (both toolbar rows, routes to
the room-template builder), Open Latest Room (destination is the
excluded chat surface, so partially covered), load and delete error
banners (blanket fixture-driven scope), view-mode persistence
(original persisted grid/list in localStorage with a mobile list
default; v2 is plain state, desktop-grid always), and the card
metadata fields (scenario, narrator, location, cast, last message,
message count, status and rating badges). Candidates 2, 10, 11.

## 3. Adventures (/studio/v2/adventures)

Original: `/studio/storylines` (6 rows) plus the Storyline builder.

- Builder modal: PRESENT and whole. All 27 internal fields, pickers,
  and actions of the original builder render in the rehost with zero
  contract change; the only drops are the old route page's own chrome
  (back link, page head), superseded by the ruled modal shape (product
  model 4.3). The builder's one stub (Content Rating single option)
  predates the rehost and is recorded in CSV row 142.
- Known seam, recorded in the package README, restated here: save
  success still runs the builder's own router.push to
  `/studio/my-creations/[id]/edit`, navigating out from under the
  modal into the old-system edit tree. Contract-frozen (H4 brief);
  resolution belongs to the Studio advanced-editor work (CR-007/008
  lineage). Report-only.
- Fixture gap: no fixture exercises `isBuilderOpen: true`; the modal
  state is unexercised at the View layer. Listed, not fixed (fixture
  shape belongs to the H4 package owner).
- Filters: none in v2 and none in the original; ruled ("search plus
  sort only; the catalog is Adventures-only, so no type facet").
- Sort (Top rated, Recently added, Most played): net-new, original had
  none. "Recently added" reverses array order; no date field exists.
  Truthful over fixtures; listed for the live-wiring pass.
- Original page rows: the Create Storyline link is superseded by the
  ruled modal CTA; loading and error banners fall under the blanket
  fixture-driven scope (no per-row citation); the owner-drafts card
  list linking each storyline to its edit page is semantically
  replaced by a public catalog with no owner list and no edit entry:
  MISSING, no citation. Candidate 6 overlaps; the Vault and the
  Studio editor are the ruled homes for own-work editing.
- Inventory gap for H6: the CSV carries **zero rows for
  /studio/v2/adventures**; wave H4's required "Rows and amendments for
  H6" parity echo never landed in any doc in the repo.

## 4. Lore (/studio/v2/lore)

Originals: the `/studio/create/lore` builder (18 rows), the public
archive routes `/characters` and `/studio/official-characters`, and
the unmapped `/lore` route.

- Creation modal ("Write lore"): built per item 39's ruling as a light
  modal (KitFormField Title, World or faction, page-local Lore
  textarea, KitAlertStrip approval notice, Cancel, Submit for review
  stubbed to R4 pending CR-015). Against the original builder it
  carries Title only. MISSING from any v2 surface, no citation:
  Description, Draft visibility (Private Draft / Unlisted Draft),
  Content rating (SFW / Mature / Explicit), Save Draft persistence,
  validation counters, Edit/Preview switch, document metadata
  (subtitle, eyebrow, era, display date, realm, summary), the entire
  chapters/sections editor with its 13 content block types, the JSON
  editor modal, character/location tag attachment, and the image
  picker. The original builder route itself stands untouched (the
  reading-routes ruling covers reading, not the builder). Whether the
  v2 Lore modal is the couch-capture quick path with the full builder
  arriving later (the Studio two-speed pattern), or must absorb more
  of the builder now, is not written anywhere: candidate 8, the
  audit's second-largest structural gap.
- Filters: the three ruled facets are PRESENT (Approval state, World
  or faction, Recency); option values are fixture-defined, which no
  ruling forbids. Two design notes, listed not fixed: Recency renders
  as multi-select over mutually exclusive tiers, and the Approval
  state values (pending, approved, canon) match neither the builder's
  draft-visibility enum nor the ruled four-state visibility enum;
  both belong to the CR-015 pipeline conversation.
- Sort: none, by the package's recorded reading of product model 3.1
  (facet line lists no sort for Lore). The 3.1 component definition
  names a sort control for all list pages; the conflict is recorded
  here for H6 rather than resolved.
- Archive routes: every `/characters` and `/studio/official-characters`
  control (multi-field search, Realm/Gender/Race/Era dropdowns, tag
  rail, clear control, result count, detail links) is DELIBERATELY
  EXCLUDED by the fold-at-go-live ruling (BUILD-BLUEPRINT 3.1 row 9,
  amended: folding recorded at build time, executed at go-live).
- Inventory gap for H6: the `/lore` route (LoreArcAccordion page) has
  zero CSV rows; it is covered only by the generic "lore-site pages"
  phrase in the fold ruling.

## 5. Community (/studio/v2/community)

Originals: `/studio/community` (25 rows) and `/studio/creations/[id]`
(16 rows).

Modals and popups:

- Asset detail popup vs the original preview modal and detail page:
  PRESENT with ruled renames (Chat becomes Play per R9; Bookmark
  becomes Save; credits collapse per R1). MISSING on the popup, no
  citation: the tags row, the creator-handle "by @handle" link, and
  the detail page's media browsing (Images/Videos/Liked/Bookmarked
  tabs, Newest/Oldest/Top/Liked First sort, media search, the full
  tile grid; the popup's carousel caps at four items with the
  catalogue slide wired to a no-op pending the recorded later-wiring
  note). Candidate 6.
- Image overlay vs the original media lightbox: carries Love, Save,
  Share, Close plus new zoom/pan; Download, Details, Report (with its
  seven reason options), Generate variant, the three Soon stubs,
  Delete, and thumbnail navigation are held under OPEN item 28
  (viewer reconciliation, Sprint E), DELIBERATELY EXCLUDED with that
  citation.

Filters and sorts, option sets verbatim:

- Type: v2 Characters / Stories / Adventures / Images plus folded-in
  Remix (R10 fold-in, recorded). Original pills: All, Characters,
  Scenarios, Rooms, Locations, Outfits, Poses, Narrators, Image
  Presets. The dropped seven content types are partially a ruled
  model change (the product model's catalog is assets, Stories,
  Adventures), but no ruling names which original type values the
  Community catalog carries: candidate 1 covers the shared question
  with Vault.
- Rating: Everyone / Teen / Adult per CR-027, one-to-one against
  SFW/MATURE/EXPLICIT: PRESENT and ruled ("All Ratings" is subsumed
  by multi-select).
- Sort: original Recommended, Newest, Recently Updated, Most Liked,
  Most Used. v2 shipped Recommended, Most played, Newest, Most saved.
  FIXED here: Most hearted added (restores the original Most Liked
  capability under the v2 hearts vocabulary already used by Images
  and Creators; hearts data exists on every fixture item). Still
  MISSING, data-dependent: Recently Updated (no updated timestamp
  exists) and Most Used (no uses metric exists). Candidate 3.
- Rendering select (All Styles / Anime / Realistic / Either / Auto):
  whole control MISSING, no citation, even though the sibling Images
  page ships a Style facet (Anime, Realistic). Candidate 4.
- Curation pills (All / Featured / Canon / Recently Updated): MISSING,
  no citation beyond the generic chip-retirement law, which retires
  the chip form, not the facet. Candidate 5.
- Popular Tags pills: retired with the chip law (cited); no tag facet
  replaced them. Folded into candidate 5.
- Creators mode (its pills, toggle, cards, follow actions): displaced
  by the separate Creators destination in the nine-page model;
  implicit but coherent; the v2 banner CTA points there. Recorded
  here as covered by the IA ruling rather than flagged.
- Search: original matched title, description, creator handle, tags;
  v2 matches title and subtitle. Candidate 9.
- Card face: Start Chat and Generate image quick actions are absent;
  the card law (exactly three overlay actions) cites share, download,
  and delete as living inside the open destination but never names
  chat or generate. Play exists inside the popup; Generate exists
  nowhere on the page. Candidate 7.
- Load-error and engagement-error banners: absent, blanket
  fixture-driven scope. Candidate 10.

## 6. Creators (/studio/v2/creators)

Originals: `/studio/profile`, `/studio/profile/[username]`, and its
connections page (26 rows).

- The recorded parity echo (HANDOFF-NEXT-CHAT, Sprint A) already
  disposes all 26 rows: 2 PRESENT (the Follow toggle, cited twice), 24
  Flagged as belonging to the unbuilt profile-detail page (hero,
  tabs, donation modal and its four fields, like/bookmark, share,
  activity, badges, connections). This audit confirms that echo is
  still accurate; nothing has drifted. The donation modal is the one
  original modal in scope and is absent with the detail page.
- Filters: none in either (ruled: the product model names only metric
  sorts and recency for Creators; no facet invented).
- Sort: Most followed / Most played / Most hearted / Recently active,
  matching the ruled leaderboard set one-to-one. Known recorded
  defect, unchanged: Most hearted orders by works as a proxy because
  the creator-card contract carries no hearts stat (CSV row 859, OPEN
  item 9). Contract-gated, not fixed here.
- FIXED here: the View profile label (section 1, shared kit fix).

## 7. Vault (/studio/v2/vault)

Original: the `/studio/my-creations` hub (15 rows), preview tree (7),
edit tree (68), image-library (22).

- The recorded echo already disposes 112 rows: 8 PRESENT, 7 Flagged
  (Your Tags, mobile density toggle, Create New, load-error banner,
  Set default PC, Start chat, Generate image), 97 DELIBERATELY
  EXCLUDED citing CR-007/CR-008 and the build-order hold. Confirmed
  still accurate.
- The audit's headline: the original hub's type/status tab set is 27
  buckets (All, Characters, Player Characters, Scenarios, Locations,
  Outfits, Wardrobes, Poses, Narrators, Image Presets, Stories, Item
  Registries, Character Templates, NPC/Location/Event/Quest
  Registries, Storylines, Drafts, In Review, Mechanics Modules, Rules
  Codices, Lore Assets, Actor Mechanics Profiles, Stats and Pools
  Profiles, Progression Profiles, Skills Profiles). The v2 Type
  dropdown carries four kind options plus Remix. The echo recorded
  this as a presentation change; the option-set reading says 23 type
  values and both status buckets (Drafts, In Review) are unfilterable
  in v2. This is not fixable as an option add: the v2 card contract
  models four asset kinds, and honest options need data behind them.
  Candidate 1, the audit's largest gap.
- Popup vs the original preview modal: v2 drops Set Default PC, Edit
  (both recorded: the flag list and the CR-007/008 exclusion
  respectively), Chat, Image Library, tags row, Preview Pending
  state, and the picker context's Select Soon (Flagged in the echo as
  a set). The popup's universal "Play" primary label would misapply
  to image items if one ever reached it (today images route to the
  overlay); noted for the kit backlog.
- Sort (Newest / Most played / Most saved): net-new; the original hub
  had no sort control.
- Search: original matched six fields; v2 matches title and subtitle.
  Candidate 9.
- Empty state: v2 drops the original's Start Creating action and
  tab/tag echo. Candidate 12.
- Remix option fold-in on Type: recorded (R10) and noted as
  contradicting the earlier Sprint A "no Remix here" line; R10 is the
  later ruling and the CSV row records the shipped state. No action.

## 8. Images (/studio/v2/images)

Originals: `/studio/image-studio` (58 units) and
`/studio/my-creations/[id]/image-library` (22 rows).

- Composer (creator panel): full parity, verified verbatim. All six
  ingredient slots (labels identical), mode toggle, custom guidance,
  prompt and negative prompt, the five option selects (Render Style
  6, Camera/Framing 7, Wardrobe Theme 12, Aspect Ratio 5, Output
  Count 3) and the three video selects plus Duration: every option
  value and label matches the original source exactly, same defaults.
  The two original Options toggles collapse to one expander
  (recorded presentation change). Generate and video-soon are honest
  stubs per 2.16(u). The ingredient picker matches control-for-control
  (only the per-slot header icon dropped); the save-preset modal
  matches except the saveMessage result strip, which has nothing real
  to report while saving is an R4 stub.
- Lightbox: the overlay carries 4 of the original's 13 controls plus
  new zoom/pan; the other nine (Download, Details, Report, Generate
  variant, Delete, three Soon stubs, thumbnail rail) are DELIBERATELY
  EXCLUDED under OPEN item 28 (viewer reconciliation), the details
  and report dialogs with them.
- Library grid machinery (media-type pills All/Images/Videos/Liked/
  Bookmarked, selection mode, Select All/Clear, bulk Delete Selected,
  cursor pagination): DEFERRED, recorded in Sprint E 1.1 as the
  library disposition landing at live wiring; not invented into the
  fixture page.
- Filters: Linked asset and Style facets are ruled v2 additions; the
  date facet is recorded OPEN (Sprint B item 1: built as the Newest
  sort pending a date-facet ruling).
- Sort: FIXED here: Oldest added (original image-library option,
  recency data supports it directly). Still MISSING, data-dependent:
  Eligible First and Needs Review First (no moderation eligibility
  field exists in v2 fixtures), together with the eligibility filter
  (All/Eligible/Blocked). Candidate 13.
- Image-library editing rows (slot assignment, Hide/Show, Delete,
  Refresh, Back to Editor): the featured-slot workflow rows ride the
  CR-007/CR-008 hold where inseparable from editing; Hide/Show/Delete
  and Refresh carry no citation and fold into the same editor-scope
  candidate (my Studio-spec CR-031 lineage).

## 9. Fixes applied by this pass

Three fixes, all straightforward missing options or drift on existing
controls, none a new feature, none a contract change:

1. `app/studio/v2/images/ImagesV2Mockup.jsx`: sort gains
   `{ value: "oldest", label: "Oldest" }` with ascending-recency
   sorting. Restores the original image-library sort option.
2. `app/studio/v2/community/CommunityV2Mockup.jsx`: sort gains
   `{ value: "hearts", label: "Most hearted" }` with hearts-descending
   sorting. Restores the original "Most Liked" capability under the
   hearts vocabulary the sibling pages already use.
3. `components/kit/creator-card/KitCreatorCard.view.jsx`: the action
   label returns to "View profile", matching the control's name in
   the CSV (rows 862, 1007), the package README, and the 4 Aug ruled
   "Follow / View profile" pair. Affects the Creators and Home pages,
   which both consume the shared card.

Not fixed, deliberately: everything in section 10. No option was added
where the fixture data cannot honestly back it, and no absent control
was rebuilt.

## 10. Candidates for Brian's ruling

Each is one decision. None is decided here.

1. **Vault (and Community) type-facet coverage.** The original hub
   filters 27 type/status buckets; v2 filters four kinds plus Remix.
   Which asset types does each catalog carry as filter options, and
   does the Vault get a status facet (Drafts, In Review)? Needs the
   card model's kind enum extended or a ruled reduction.
2. **Stories: Templates and Archived buckets, manage mode, and bulk
   delete.** The original hub's template and archive management has no
   v2 home and no exclusion ruling; New Template routing rides the
   same decision.
3. **Community sort restorations needing data:** Recently Updated (no
   updated timestamp in the model) and Most Used (no uses metric).
   Rule in with the CR-023 feed shape or rule out.
4. **Community Rendering filter** (All Styles / Anime / Realistic /
   Either): dropped whole; the sibling Images page has a Style facet.
   One ruling makes the facet consistent or excludes it.
5. **Community curation facet** (Featured / Canon / Recently Updated)
   and whether any tag facet replaces the retired Popular Tags chips.
6. **Detail-surface media browsing.** The original creation detail
   page's media tabs, sort, search, and full grid have no popup
   equivalent (carousel caps at four). Rule whether the popup's
   catalogue destination (recorded later-wiring) absorbs this or a
   detail surface returns.
7. **Card-face quick actions Start Chat and Generate image.** The
   exactly-three card law cites share/download/delete as living in
   the open destination but never places chat or generate; Play made
   it into the popup, Generate exists nowhere.
8. **Lore creation scope.** The v2 Write-lore modal carries one of the
   original builder's 18 rows; visibility, rating, description, Save
   Draft, and the whole document editor have no v2 surface and no
   exclusion ruling. Rule the two-speed split for Lore (quick modal
   now, builder at the editor tier later) or an expanded modal.
9. **Search match scope standard.** Every v2 page searches title (or
   title plus subtitle/handle) while every original searched 4 to 11
   fields. One ruling on the standard scope ends the per-page drift.
10. **Error and load-failure states.** No v2 page has an error state
    or fixture; originals carried load-error and action-error
    banners. Rule the standard error presentation for live wiring
    (KitAlertStrip danger is the natural shape).
11. **Stories view-mode persistence.** The original persisted
    grid/list per device with a mobile list default; v2 resets to
    grid every load. Rule whether v2 pages persist layout (and
    where: Shell localStorage, like CR-030's interim).
12. **Empty-state actions.** Originals offered a next step (Start
    Creating); v2 empty states are copy-only. One ruling for the set.
13. **Images eligibility machinery** (eligibility filter, Eligible
    First / Needs Review First sorts): moderation-data dependent;
    rule in with live wiring or assign to the editor-tier surface.

Standing open items this audit touched but did not reopen: item 28
(viewer reconciliation), item 42 (Home filter seat), item 9 (creators
hearts proxy), Sprint B item 1 (date facet), Sprint D items 16/17
(Stories continue group, sort set).

## 11. Rows and amendments for H6 (per the shared-doc rule)

This branch edits no shared doc. Listed for wave H6, verbatim intent:

1. `/studio/v2/community` sort-control row: option list becomes
   Recommended / Most played / Newest / Most hearted / Most saved
   (this pass's fix); note "Most hearted restores the original Most
   Liked capability, 10 Aug 2026 parity audit."
2. `/studio/v2/images` sort-control row: option list gains Oldest
   (this pass's fix), same note lineage.
3. Creator-card label rows (862, 1007): no row text change needed;
   the code now matches the recorded "View profile" label. Note the
   drift closure.
4. `/studio/v2/adventures`: the H4 wave's control rows and parity
   echo never landed; H6 must source them from the H4 report or
   re-enumerate (this audit's section 3 lists the page's controls).
5. `/lore` route: zero CSV rows exist for the public lore accordion
   page; add rows or record the fold ruling against the route name.
6. Home rows 984/985 (continue strip): already listed by H1's report;
   restated so the merge is not lost.
7. Home top-rail sort row 1002: add the note that the control sets
   state only and does not yet re-sort the fixture list.
8. Cross-reference: the missing Sprint D session report (Stories and
   Images parity echoes cite it; it is not in the repo). H6 should
   either recover it from the session archive or mark the echoes as
   re-run here (sections 2 and 8 of this audit are current).

## 12. Verification

- Production build: exit 0 on this branch after the three fixes.
- Em dashes: zero in this file and in the three touched code files.
- No shared doc edited (`APP-FUNCTION-MAP.csv`, its rollup,
  `BUILD-BLUEPRINT.md`, `CRESTFALL-DESIGN-CONTEXT.md` untouched).
- The other session's folder (`~/dev/Crestfall-fe`) untouched; the
  crestfall-main sibling checkout was read-only.
