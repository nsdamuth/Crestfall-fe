# SPRINT-H-PLAN v1.0.0, written 10 Aug 2026, branch design/sprint-h-plan, planning gate only

One plan covering the Home fix wave (Brian's 10 Aug 2026 Home review,
ruled) and the remaining Sprint G build re-planned as parallel Sonnet
sessions on separate branches with non-overlapping file sets. Plan
only; this gate builds nothing. Every claim about repo state below was
verified against a file read or a rendered page in this session. The
standing Nick rule applies throughout: display names only, no CR
escalated to him, nothing described as blocked on him, every wave
planned to the furthest fixture-driven point.

Two rulings from Brian's 10 Aug Home review govern how this sprint
runs, recorded here because this file is the active sprint plan and
therefore law:

- **No render-verification steps in any wave brief.** Every brief ends
  at: production build exit 0, commit, push, report. Brian reviews
  rendered pages himself. For Sprint H wave sessions this supersedes
  the per-session rendered-check requirement of
  `docs/FRONTEND-SOP.md` section 8; every other part of section 8
  (build exit 0, em-dash zero, manifest echo) stands.
- **Shared docs are written by one closing pass only.**
  `docs/APP-FUNCTION-MAP.csv`, its markdown rollup,
  `docs/BUILD-BLUEPRINT.md`, and `docs/CRESTFALL-DESIGN-CONTEXT.md`
  are edited only by wave H6. Every other session lists its rows and
  amendments in its report instead.

## MANIFEST

1. Standing facts this plan builds on (section 0).
2. Wave H1, the Home fix wave: the six ruled review items, including
   the located artwork and the diagnosed 390 defect (section 1).
3. OPEN FOR BRIAN: items 39, 40, 41 restated for ruling; new items
   42, 43, 44 (section 2).
4. The waves: branches, file sets, what runs in parallel, what is
   gated (section 3).
5. Shared-doc law for this sprint (section 4).
6. Paste-ready Sonnet briefs, one per wave (section 5).
7. Session totals and the critical path (section 6).
8. Carried items, placed, none started (section 7).
9. Verification law for this gate (section 8).

## 0. Standing facts settled at this gate

- **Sprint G items 37 and 38 were ruled and executed.** The
  `destination-tile` package shipped (option A) and Home shipped as
  Sprint G wave 1 on branch design/home: full LOOM set at
  `app/studio/v2/home/`, contract 1.0.0, the CR-029 mock module, 27
  function-map rows keyed to `/studio/v2/home`, the auth-free mirror
  at `/dev/ui-preview/home-v2-page`. All verified this session.
- **Brian's Home review, ruled 10 Aug 2026,** is folded into wave H1
  as section 1 of this plan. Item 38's continue-card treatment is
  superseded by review ruling (a): the card-treatment Continue strip
  is removed and the top banner becomes the continue surface.
- **Branch topology.** main is behind the design lineage; the tip is
  design/home. This plan cuts design/sprint-h-plan from design/home;
  every Sprint H wave branch cuts from design/sprint-h-plan after GO.
- **Engines.** All Sprint H execution waves run on Sonnet, per this
  gate's manifest. This supersedes Sprint G's Fable lane for the
  Studio compositions; the Studio brief compensates with a tighter
  spec, and any composition judgment the spec does not settle stops
  and escalates rather than being improvised.
- **Kit state.** Eighteen packages shipped (Sprint G's
  seventeen plus `destination-tile`). Still unbuilt: `global-search`
  (not consumed by any Sprint H wave), `form-field`, `picker-modal`,
  `menu-popover` (not scheduled), `alert-strip`.
- **Unruled Sprint G items 39, 40, 41** stand open and are restated
  in section 2 for ruling at this gate. Wave gating in section 3
  names which waves wait on which.

## 1. Wave H1, the Home fix wave

Brian's 10 Aug 2026 Home review, six items, all ruled, none
re-litigated here. This section records what each ruling means in
build terms; the paste-ready brief is section 5.1.

### 1a. One top banner, and it is the continue surface

The two top surfaces (the promo-banner `top` treatment hero and the
promo-banner `card` treatment Continue strip beneath it) merge into
ONE top banner. Ruled behavior:

- The single top banner keeps the `top` treatment with the galaxy
  layer on, at the head of the page, in both states.
- **Something in progress:** the banner shows the most recent
  in-progress item: eyebrow "Continue", the item's title as the
  banner title, a supporting line ("Last played 2 hours ago, Story"
  grammar as built), CTA "Continue" wired to the item's resume
  callback, and the item's artwork as the banner art where it has
  one (falling back to the hero art when it does not).
- **Nothing in progress:** the banner falls back to the general hero
  (the current eyebrow/title/CTA content on the new Eden artwork,
  1b). The top banner CTA's destination in this state remains the
  open flag already recorded in the CSV (row: top banner, "Start
  exploring", stubbed); this review did not rule it and this plan
  does not guess it.
- The separate card-treatment Continue strip is REMOVED from the
  composition. The ruled Home order is now seven surfaces: continue
  hero, eight destination tiles, four rails, bottom banner.
- Contract: `Home.contract.js` moves 1.0.0 to 2.0.0 (a rendered
  surface leaves the composition and the top banner's meaning
  changes; that is a meaning change, never a patch). `continueItem`
  stays in the contract as the input that switches the banner's
  state. Fixtures update in the same commit: full page shows the
  continue hero; the empty-Continue fixture shows the general hero.
- Function-map deltas (listed for wave H6, not edited by H1): the
  two continue-strip rows (Continue card display, Continue CTA)
  merge into the top banner block as one row pair (continue-state
  display, Continue CTA); the top banner CTA row's note gains the
  two-state behavior.

### 1b. Hero artwork: located, ruled into wave H1

Found this session, read-only, in the crestfall-main sibling
checkout. The crestfall-main hero mockup is
`Crestfall/out/draft-site/proof/studio-home.html`; its
`<section class="hero">` carries a stars canvas (the galaxy layer's
ancestor) and exactly one image:

- Source: `/Users/briansmith/dev/crestfall-main/crestfall-design-system/assets/lilith-lux-eden-confrontation.png`
  (2103x1629, landscape; identical copy at
  `Crestfall/out/draft-site/assets/lilith-lux-eden-confrontation.png`).
  Alt text in the mockup: "Lilith and Lux face each other beneath a
  black crown sky". This is the Eden image; no ambiguity, no
  candidate list needed.
- Wave H1 copies it into this repo's sample art per the ruled
  sample-art mechanism (`docs/FRONTEND-SOP.md` section 7): resized
  to 1280px wide, compressed, placed in
  `public/tmp-mockup-images/canon-character-images/`, filename added
  to the `.gitignore` allowlist in the same commit. This gate copies
  nothing (planning gate, one file only).
- The top banner's `imageSrc` moves from the current stand-in
  (`Lilith.png`) to the new file in both the ViewModel and the
  fixtures.

### 1c. Bottom banner artwork: located, ruled into wave H1

Same mockup file, its page-end payoff section (`class="vista"`, line
347): `athelgard-ampitheater-profile.png`, alt "The amphitheater of
Aethelgard at dusk".

- Source: `/Users/briansmith/dev/crestfall-main/crestfall-design-system/assets/athelgard-ampitheater-profile.png`
  (1144x912, landscape). Same copy mechanism as 1b, spelling of the
  source filename kept for traceability.
- The bottom banner's `imageSrc` moves from the current stand-in
  (`vermillion-13.png`, a portrait crop) to the amphitheater in the
  ViewModel and fixtures. Landscape orientation satisfied.

### 1d. The 390 defect: diagnosed, plus the full 390 audit

Rendered and measured this session on the live preview
(`/dev/ui-preview/home-v2-page`, emulated 390x844, deviceScaleFactor
2, mobile true, touch true).

**Diagnosis of the creators-rail collapse.** KitRail's phone cell
width is `calc((100% - 2*var(--space-3))/2.4)`, which resolves to
136px at 390. That tier was sized for the portrait creation card. The
creator card's minimum content width is 227 to 256px (measured per
fixture): a nowrap stat row (followers, plays, works) plus two
nowrap soft-rectangle buttons ("Following", "Profile"). A grid cell's
default `min-width: auto` lets the card refuse to shrink, so each
card renders at its natural width inside a 136px cell and overlaps
the next card by about 108px (measured). That is the collapse Brian
saw: handles clipped mid-word, thumbnails interleaved, the Profile
button buried under the neighboring card.

**The same tier also breaks the three creation rails.** At coarse
pointers the card law keeps the three overlay actions fully visible,
and each resolves to the 44px floor; three of them plus gaps exceed a
136px card. Measured spill: overlay action rows overflow the card
face by 25 to 110px on every creation rail at 390.

**Violations found at 390, complete list:**

1. Creators rail: cards overlap their cells by about 108px
   (mobile law: fully functional and comfortable at 390; nothing
   overflows).
2. Creation rails (all three): overlay action row spills 25 to 110px
   past the card edge at coarse pointers.
3. Rail head "View all": renders 47x20px, under the 44px touch
   floor at coarse pointers.

Everything else passes: no document-level horizontal overflow; the
destination tiles render two-up at 169px; the top banner renders
5/3, the bottom banner 1/1 per R6; the sort dropdown seats on the
head's second row and its panel docks as a bottom sheet; the galaxy
layer's oversize render is clipped by the banner frame (benign).

**The ruled fix set (wave H1):**

- KitRail's phone tier moves from 2.4 to 1.4 cards in view: one full
  card plus the ruled 0.4-card peek. 247px cells at 390 fit both
  card species' measured minimums with the peek-depth law (item 32:
  0.4 at every tier) preserved. No smaller change satisfies the law:
  at 2.4 the coarse-pointer overlay actions alone (three at 44px)
  exceed the card, and the peek law permits no width between the two
  tiers. Tablet and desktop tiers are untouched. Package-local CSS,
  no contract change. The `docs/BUILD-BLUEPRINT.md` 2.18 amendment
  recording this is listed in H1's report and written by wave H6.
- The rail head's View all control gains the 44px touch floor at
  coarse pointers (min-height to `--control-md` via the coarse
  pointer query, visual size at fine pointers unchanged).
- KitCreatorCard hardening: the stat row and the action-button row
  each allow wrapping so the card degrades to stacked rows instead
  of overflowing in any future narrow seat. No visual change at
  healthy widths; the widest fixture still measured 256px natural,
  so the wrap also covers the 9px it would otherwise overhang a
  247px cell.

### 1e. The creations filter, Home's new control

Ruled: Home gains a creations filter (All creations, just mine, plus
visibility values) whose selection persists across sessions. Build
plan:

- **Control.** One single-select branded dropdown (`KitDropdown`,
  consumed unmodified) with rows: All creations; My creations; then
  the four ruled visibility values (Private, Internal, Public,
  Canon) as scoping rows under "mine". Gold selected value on the
  trigger per the filter line law. Where it seats is OPEN item 42
  (section 2); wave H1b is gated on that ruling.
- **What it filters.** The three creation rails (the creators rail
  and the continue hero are out of its scope). Client-side over the
  delivered fixture lists, matching CR-029's sort precedent.
- **Data.** The CR-029 mock items gain `ownership`
  (`"mine" | "community"`) and `visibility` (the ruled four-state)
  fields so the filter has something honest to filter. Recorded as a
  CR-029 update in `docs/CONTRACT-REQUESTS.md` this gate. The
  four-state visibility values are the ruled enum whose data-model
  landing is CR-014; fixture-driven until then, like everything else
  on Home.
- **Persistence.** Cross-session persistence is CR-030, filed this
  gate (next free number): an account-level preference plus whatever
  feed support the real rails need. Until CR-030 lands, the Shell
  persists the selection in one namespaced localStorage key
  (`cf.home.creationsFilter`), which honestly survives sessions on
  one device; the CR names this interim and the single deletion that
  retires it. Persistence lives in the Shell, never the View (LOOM
  boundary).
- Function-map rows (filter control, one row) listed in H1b's
  report for wave H6.

### 1f. Composition verification

The ruled Home composition enumerates eight surfaces: top banner,
Continue strip, the destination-tile block of eight, four rails, and
the bottom banner. All eight are present and rendered, verified this
session on the live preview (tiles counted eight, in journey order,
correct labels; all four rails present with heads, the sort control
seated on the top rail only; both banners present).

Read as product sections, all nine pages of the ruled model are
represented on Home: the eight tiles cover every other section and
Home is the ninth. Nothing is missing. This gate could not resolve a
reading under which the composition itself has nine sections; no
ruling read this session enumerates nine, so the count discrepancy
is reported here rather than guessed at. After ruling 1a executes,
the surface count becomes seven.

## 2. OPEN FOR BRIAN

Items 1 through 36 stand where prior plans left them (36 still open,
tied to CR-028). Items 37 and 38 are closed (section 0). Items 39,
40, 41 are restated from Sprint G for ruling at this gate, costs
re-based to the Sprint H waves; items 42, 43, 44 are new from the
Home review. Exactly three options each, the recommendation starred.

39. **Where does Lore's creation entry live on the index page?**
    Gates wave H3.
    - **A, recommended: a page-head action button** ("Write lore")
      in the heading block, opening the creation modal. Why: the
      index page keeps the shared composition its five siblings
      share, and the journey banner keeps the page's one-banner
      budget. Cost: none beyond the H3 session; zero extra packages.
    - **B: a top banner with the create CTA.** Why not: adds a top
      banner none of the shared-composition siblings carry, splitting
      the shared shape Lore was ruled onto. Cost: part of the H3
      session, render-gate risk, likely re-ruled.
    - **C: an in-flow banner card above the grid.** Why not: spends
      the mid-page on a second sell when the page's job is reading.
      Cost: small now, likely re-ruled at render.

40. **The Studio advanced editor's edit-surface question**
    (CR-007/CR-008, Brian-owned). Gates wave H5, the critical path.
    - **A, recommended: the advanced editor is the one full edit
      surface.** It absorbs the standalone editor's full field set
      (Runtime Modules, Mechanics Profile, Publishing, Danger Zone);
      the seven-stop creator stays the create-only quick path. Why:
      matches the product model's "every available field" advanced
      mode, and one edit surface is the only shape that reaches 100
      percent coverage without dragging the old editor past go-live.
      Cost: the largest H5 scope, 3 to 5 of its sessions, high build
      cost, low rework risk.
    - **B: the standalone editor stays authoritative; advanced mode
      is a picker that routes to it.** Why not: keeps two edit
      surfaces into cutover and drags an old-system page through the
      go-live boundary. Cost: cheapest now, contradicts the coverage
      measure later.
    - **C: defer the editor; H5 ships quick-create and the hub
      only.** Why not: Studio lands incomplete against its ruled
      composition and the coverage measure stalls on the editor
      rows. Cost: shortest H5 (3 to 4 sessions), an unscheduled
      editor sprint after.

41. **The two QUICK-allocation flags** (appearance-step fields and
    Default Rendering Style held in QUICK against the pattern's
    literal wording). Gates wave H5 with item 40.
    - **A, recommended: keep both in QUICK** as the inventory's
      guardrail chose. Why: preserves phone capture of a character's
      look, and CR-026 already gives Nick a later pass to adjust.
      Cost: none.
    - **B: move both to ADVANCED** per the pattern's literal
      wording. Why not: strips appearance from quick create and
      weakens the couch-capture case the two-speed model exists for.
      Cost: an allocation edit, small.
    - **C: split them** (appearance stays QUICK, rendering style to
      ADVANCED). Why not: half-applies a guardrail argued as a pair
      and re-asks the question at Nick's CR-026 pass. Cost: small,
      plus a repeat decision later.

42. **Where does the creations filter seat on Home?** Gates wave
    H1b.
    - **A, recommended: one control row above the three creation
      rails,** directly under the destination tiles, right-aligned,
      the same seat grammar as a rail-head control. Why: the filter
      governs exactly the three rails below it, Home keeps its
      no-filter-line shape, and one control in one place matches the
      one-sort-control precedent. Cost: none beyond the H1b session.
    - **B: seat it in each creation rail's head control seat.** Why
      not: three copies of one control, and the head seat is ruled
      one-control-per-composition (the top rail's sort). Cost: same
      session, triple the surface, near-certain re-rule.
    - **C: a sticky filter line via `studio-filter-bar`.** Why not:
      imports the browse-page chrome Home was explicitly ruled not
      to carry (no filter line, no local search). Cost: cheapest to
      build, contradicts a standing ruling.

43. **Where do "View all" on Top rated and Recently added route?**
    Both are stubbed today (R4 notice). Does not gate a wave; the
    ruling lands as part of H1b or H6, whichever is still open.
    - **A, recommended: both route to `/studio/v2/community` with
      the matching sort preselected** (Top rated arrives sorted by
      rating, Recently added by newest). Why: Community is the built
      browse surface for exactly this content; one initial-sort seam
      is presentation-level. Cost: a small addition to the Community
      page set (initial-sort input plus its fixture), about half a
      session, one extra package touched.
    - **B: dedicated browse-all pages per rail.** Why not: two new
      routes outside the nine-page model for lists Community already
      browses. Cost: 1 to 2 sessions, new page sets, model creep.
    - **C: drop View all from those two rails.** Why not: breaks the
      ruled rail-head anatomy (View all beside the label) and hides
      the path to the full list. Cost: none, visible inconsistency
      across the four rails.

44. **Do rail card face actions open the full destination surfaces,
    or stay teasers?** Expand today opens the R4 notice, recorded in
    the CSV as deliberately excluded pending this exact question.
    Does not gate a wave; lands with H1b or H6.
    - **A, recommended: open the real destinations,** the asset
      detail popup for character/story/adventure cards and the image
      overlay for image cards, exactly as Community wires them,
      fixture-fed. Why: both packages are built and fixture-driven;
      Home stops behaving differently from every other card surface
      for zero new packages. Cost: wiring plus fixtures in the Home
      package, about half a session.
    - **B: stay teasers until live data.** Why not: an interaction
      that works on Community and dead-ends on Home reads as broken,
      and the R4 notice was scaffolding, not a destination. Cost:
      none now, review debt later.
    - **C: face actions route to the destination page** (Community)
      instead of opening a popup. Why not: a tap that promises an
      item detail delivering a browse page loses the item. Cost:
      small, wrong payoff.

Nothing above executes before GO. Ruling order that unblocks the
most, soonest: 40 and 41 first (they gate the critical path), then
39, then 42, then 43 and 44.

## 3. The waves

All branches cut from design/sprint-h-plan. Engine: Sonnet, every
wave. File sets are disjoint by design; the two shared-doc files and
the two regenerated context docs belong to H6 alone.

| Wave | Branch | File set (exclusive) | Gate | Sessions |
|---|---|---|---|---|
| H1 Home fix | design/home-fix | `app/studio/v2/home/**`, `components/kit/rail/**`, `components/kit/creator-card/**`, the two art files plus `.gitignore` allowlist lines | none, starts at GO | 1 to 2 |
| H2a form-field | design/kit-form-field | `components/kit/form-field/**`, `KitFormField.jsx`, its preview route | none, starts at GO | 1 |
| H2b picker-modal | design/kit-picker-modal | `components/kit/picker-modal/**`, `KitPickerModal.jsx`, its preview route | none, starts at GO | 1 |
| H2c alert-strip | design/kit-alert-strip | `components/kit/alert-strip/**`, `KitAlertStrip.jsx`, its preview route | none, starts at GO | 1 |
| H4 Adventures | design/adventures | `app/studio/v2/adventures/**`, its preview mirror | none, starts at GO | 2 |
| H1b Home filter | design/home-filter | `app/studio/v2/home/**` (after H1 merges; H1b stacks on H1's branch if H1 has not merged) | item 42 ruled | 1 |
| H3 Lore | design/lore | `app/studio/v2/lore/**`, its preview mirror, `components/kit/studio-page/**` (the centered-label seat, assigned exclusively here) | item 39 ruled, H2a and H2c landed | 2 |
| H5 Studio | design/studio | `app/studio/v2/studio/**`, its preview mirror | items 40 and 41 ruled, H2a/H2b/H2c landed | 6 to 9 (3 to 4 if item 40 rules C) |
| H6 closing pass | design/sprint-h-close | `docs/APP-FUNCTION-MAP.csv`, `docs/APP-FUNCTION-MAP.md`, `docs/BUILD-BLUEPRINT.md`, `docs/CRESTFALL-DESIGN-CONTEXT.md`, `docs/DESIGN-TOKENS.md` (focus note), `docs/CONTRACT-REQUESTS.md` status lines | every other wave landed | 1 |

**Runs simultaneously from GO:** H1, H2a, H2b, H2c, H4. Five Sonnet
sessions, five branches, zero shared files.

**Gated on a Brian ruling:** H1b (item 42), H3 (item 39, plus H2a
and H2c for the creation modal's fields and approval notices), H5
(items 40 and 41, plus all of H2). H3 and H5 also wait on kit-fill
branches landing; "landed" means merged into the integration line
Brian designates (or stacked, H1b-style, if merges wait).

**Serial:** H6 runs last, alone. It merges the finished branches in
a stated order (H2a, H2b, H2c, H1, H1b, H4, H3, H5; disjoint file
sets make every merge trivial), writes every CSV row and rollup
regeneration from the wave reports, folds the H1 amendments into
`docs/BUILD-BLUEPRINT.md` (rail phone tier; the Home composition
change from ruling 1a) and the regenerated design context, makes the
carried DESIGN-TOKENS focus-note alignment (section 7), and runs the
final build and em-dash counts.

Adventures has no gate and the smallest surface; if any ruling
stalls, H4 is the wave that keeps moving. The builder-rehost
contract-law risk from Sprint G carries unchanged: the builder's
contracts must not change, and any apparent need to change one stops
that unit and escalates.

## 4. Shared-doc law for this sprint

Ruled 10 Aug 2026 (this gate): `docs/APP-FUNCTION-MAP.csv`, its
markdown rollup, `docs/BUILD-BLUEPRINT.md`, and
`docs/CRESTFALL-DESIGN-CONTEXT.md` are written by wave H6 only.
Every other session ends its report with a "Rows and amendments for
H6" block listing, verbatim and paste-ready: every CSV row it would
have added or changed, and every blueprint or context amendment its
work implies. A wave report missing that block is an unfinished
report. This trades the per-commit CSV law of
`docs/FRONTEND-SOP.md` section 14 for collision-free parallelism;
the rows still land, once, at H6, before the sprint closes.

## 5. The briefs

Paste-ready, one per wave. Standing header for every brief, stated
once here and binding on all of them: work only in the file set
named for your wave (section 3); never edit
`docs/APP-FUNCTION-MAP.csv`, `docs/APP-FUNCTION-MAP.md`,
`docs/BUILD-BLUEPRINT.md`, or `docs/CRESTFALL-DESIGN-CONTEXT.md`;
no render-verification steps, Brian reviews rendered pages himself;
tokens only, LOOM shape, contract law (a needed contract change
outside your own package stops the unit and escalates); no em
dashes; finish with production build exit 0, commit, push, and the
REPORT echoing your MANIFEST part by part as DONE or STOPPED, plus
the "Rows and amendments for H6" block.

### 5.1 Wave H1: Home fix

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H1: Home fix. Branch design/home-fix off
design/sprint-h-plan. Read docs/SPRINT-H-PLAN.md sections 1, 3, 4, 5
first; its standing header binds this brief. File set:
app/studio/v2/home/**, components/kit/rail/**,
components/kit/creator-card/**, two new art files, .gitignore.

MANIFEST
1. Copy art from the crestfall-main checkout (read-only source):
   /Users/briansmith/dev/crestfall-main/crestfall-design-system/assets/lilith-lux-eden-confrontation.png
   and
   /Users/briansmith/dev/crestfall-main/crestfall-design-system/assets/athelgard-ampitheater-profile.png.
   Resize each to 1280px wide, compress, place both in
   public/tmp-mockup-images/canon-character-images/ keeping their
   source filenames, and add both names to the .gitignore sample-art
   allowlist in the same commit (FRONTEND-SOP section 7 mechanism).
2. Merge the two top surfaces into ONE top banner per
   SPRINT-H-PLAN.md 1a: promo-banner top treatment, galaxy on,
   always. With an in-progress item: eyebrow "Continue", item title,
   the last-played supporting line, CTA "Continue" wired to the
   item's resume callback, item art (hero art fallback when the item
   has none). With nothing in progress: the general hero content on
   the Eden art with the existing stubbed CTA. Remove the
   card-treatment Continue strip entirely.
3. Point the bottom banner imageSrc at the amphitheater art.
4. Bump Home.contract.js to 2.0.0 with the 1a meaning change
   documented; update Home.fixtures.js (full page = continue hero;
   empty Continue = general hero; empty rails unchanged) and the
   package README in the same commit. Keep the fixture-mode harness
   working for all three modes.
5. KitRail: phone tier cell width moves from 2.4 to 1.4 cards in
   view (one full card plus the ruled 0.4 peek); tablet and desktop
   tiers untouched. Give the head's View all control the 44px touch
   floor at coarse pointers. No contract change; note the tier
   change in the rail README.
6. KitCreatorCard: allow the stat row and the action-button row to
   wrap instead of overflowing when the seat is narrower than their
   content. No contract change.
7. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, each item DONE or STOPPED with the reason.
- Rows and amendments for H6: the CSV row deltas from the banner
  merge (SPRINT-H-PLAN.md 1a names them), the BUILD-BLUEPRINT 2.18
  rail-tier amendment, the Home composition amendment (seven
  surfaces), and any row your work changed beyond these.
- Files touched, with a one-line reason each.
```

### 5.2 Wave H2a: form-field

1. Engine: Sonnet.
2. Effort: medium.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H2a: the form-field kit package. Branch
design/kit-form-field off design/sprint-h-plan. Read
docs/SPRINT-H-PLAN.md sections 3, 4, 5 (standing header) and
docs/BUILD-BLUEPRINT.md 2.8 in full; 2.8 is the complete spec and
this brief adds nothing to it. File set: components/kit/form-field/**,
components/kit/KitFormField.jsx, app/dev/ui-preview/kit-form-field/.

MANIFEST
1. Build KitFormField per 2.8 exactly: the four slots (label, input
   bed, helper line, error line) plus counter, folding disclosure,
   the five control states, the status triads with their words.
2. Full LOOM file set: shell, View, ViewModel, contract v1.0.0 on
   line 1, fixtures (default, filled, error, success, counter at
   limit, folded, disabled, longest label), README.
3. Preview route at app/dev/ui-preview/kit-form-field/ returning
   notFound() in production, rendering every fixture.
4. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item.
- Rows and amendments for H6: none expected (kit rows land with the
  consuming pages, the KitRail precedent); state "none" explicitly
  or list what changed.
- Files created.
```

### 5.3 Wave H2b: picker-modal

1. Engine: Sonnet.
2. Effort: medium.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H2b: the picker-modal kit package. Branch
design/kit-picker-modal off design/sprint-h-plan. Read
docs/SPRINT-H-PLAN.md sections 3, 4, 5 (standing header) and
docs/BUILD-BLUEPRINT.md 2.9 in full. Build the picker modal only;
menu-popover is NOT scheduled this sprint. File set:
components/kit/picker-modal/**, components/kit/KitPickerModal.jsx,
app/dev/ui-preview/kit-picker-modal/.

MANIFEST
1. Build KitPickerModal per 2.9 exactly: composed on the unified
   modal frame, search field, optional filter chip row, rich rows or
   tile grid, single and multi select with the ruled selected
   treatment, sticky footer with count in words plus Confirm and
   Cancel, load-more slot where the source is paged.
2. Full LOOM file set, contract v1.0.0, fixtures (single, multi with
   selections, searching, empty, loading, error, longest rows),
   README.
3. Preview route at app/dev/ui-preview/kit-picker-modal/ returning
   notFound() in production, rendering every fixture.
4. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item.
- Rows and amendments for H6: none expected; state "none" or list.
- Files created.
```

### 5.4 Wave H2c: alert-strip

1. Engine: Sonnet.
2. Effort: medium.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H2c: the alert-strip kit package. Branch
design/kit-alert-strip off design/sprint-h-plan. Read
docs/SPRINT-H-PLAN.md sections 3, 4, 5 (standing header) and
docs/BUILD-BLUEPRINT.md 2.11 in full. File set:
components/kit/alert-strip/**, components/kit/KitAlertStrip.jsx,
app/dev/ui-preview/kit-alert-strip/.

MANIFEST
1. Build KitAlertStrip per 2.11 exactly: the four tones (success,
   warning, danger, neutral on the ruled --fill-whisper bed), every
   tone with its words, optional inline action and dismiss carrying
   the five states.
2. Full LOOM file set, contract v1.0.0, fixtures (all four tones,
   with and without action, longest copy), README.
3. Preview route at app/dev/ui-preview/kit-alert-strip/ returning
   notFound() in production, rendering every fixture.
4. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item.
- Rows and amendments for H6: none expected; state "none" or list.
- Files created.
```

### 5.5 Wave H1b: Home creations filter (gated on item 42)

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H1b: the Home creations filter. Runs only after Brian
rules OPEN item 42; his ruling names the seat. Branch
design/home-filter off design/home-fix (or off design/sprint-h-plan
if H1 has merged). Read docs/SPRINT-H-PLAN.md sections 1e, 2 (item
42), 3, 4, 5 and docs/CONTRACT-REQUESTS.md CR-030. File set:
app/studio/v2/home/**.

MANIFEST
1. Extend homeContent.mock.js: every creation-rail item gains
   ownership ("mine" | "community") and visibility (private |
   internal | public | canon) per the CR-029 update, distributed so
   every filter selection has visible results and at least one
   selection has few.
2. Add the creations filter as one single-select KitDropdown
   (consumed unmodified) seated exactly where item 42's ruling
   says: rows All creations, My creations, then the four visibility
   values scoping "mine". Gold selected value on the trigger.
3. Filter the three creation rails client-side in the ViewModel;
   the creators rail and the top banner are out of scope.
4. Persist the selection in the Shell under the localStorage key
   cf.home.creationsFilter (the CR-030 interim, named in a code
   comment); default All creations when unset or invalid.
5. Contract bump (additive prop, 2.0.0 to 2.1.0), fixtures for the
   filtered states, README update, same commit.
6. If items 43 or 44 are ruled by the time this wave runs, execute
   their rulings in this same session (View all routing per 43,
   face actions per 44) and record the row deltas.
7. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item.
- Rows and amendments for H6: the filter control row, any 43/44 row
  changes, the CR-029/CR-030 status notes.
- Files touched.
```

### 5.6 Wave H4: Adventures

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H4: the Adventures page. Branch design/adventures off
design/sprint-h-plan. Read docs/SPRINT-H-PLAN.md sections 3, 4, 5,
docs/SPRINT-G-PLAN.md section 3 (the ruled page plan, carried
unchanged), docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.3, and the six
Adventures rows in docs/APP-FUNCTION-MAP.csv. File set:
app/studio/v2/adventures/**, app/dev/ui-preview/adventures-v2-page/.

MANIFEST
1. Build /studio/v2/adventures as a fixture-driven page on the
   shared v2 composition: studio-page shell, top banner with the
   build CTA, studio-filter-bar, creation-card grid, load-more,
   bottom banner routing to Studio (stub the route with the R4
   notice until Studio exists).
2. Display names through lib/shared/presentation/terminology.js
   (STORYLINE displays as "Adventure"); consume the module
   read-only, never edit it, never touch backend naming.
3. Rehost the existing Adventure builder inside modal-frame, opened
   by the build CTA, functionality whole, against fixtures. The
   builder's contracts must not change; if the rehost appears to
   need any contract, ViewModel, or data-flow change, STOP that
   unit and report it. Never decide it.
4. Full LOOM page set with contract, fixtures (default, empty
   catalog, longest content), README, and the auth-free mirror at
   /dev/ui-preview/adventures-v2-page.
5. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item; any stopped rehost unit
  with the exact contract it would have needed.
- Rows and amendments for H6: one row per control built, keyed to
  /studio/v2/adventures, plus the parity echo (BUILD-BLUEPRINT 3.4)
  against the six assigned CSV rows: Present, Deliberately excluded
  with the ruling cited, or Flagged for Brian.
- Files created.
```

### 5.7 Wave H3: Lore (gated on item 39, H2a, H2c)

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H3: the Lore index page. Runs only after Brian rules
OPEN item 39 and waves H2a (form-field) and H2c (alert-strip) have
landed on the integration line. Branch design/lore off
design/sprint-h-plan. Read docs/SPRINT-H-PLAN.md sections 3, 4, 5,
docs/SPRINT-G-PLAN.md section 4 (the ruled page plan, carried
unchanged), and docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.9. File set:
app/studio/v2/lore/**, app/dev/ui-preview/lore-v2-page/, and
components/kit/studio-page/** (the centered-label seat, assigned
exclusively to this wave).

MANIFEST
1. Build /studio/v2/lore as a fixture-driven index page on the
   shared v2 composition: studio-page shell, studio-filter-bar
   (approval state, world or faction, recency facets as dropdowns),
   creation-card grid leaning on the no-art fallback, badge for
   approval state where the tag economy permits, load-more, bottom
   banner routing to /studio/v2/home (the loop's closing banner).
2. Centered editorial section labels, the one page in the set that
   centers them: add the seat to the studio-page package as an
   additive prop (contract bump, additive), default unchanged for
   every existing consumer.
3. The creation entry per item 39's ruling, opening a creation
   modal composed on modal-frame with KitFormField fields and
   KitAlertStrip approval notices, fixture-fed.
4. Existing reading routes stay untouched; nothing outside the file
   set is edited.
5. Full LOOM page set with contract, fixtures (default, empty,
   pending-approval, longest content), README, and the auth-free
   mirror at /dev/ui-preview/lore-v2-page.
6. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item.
- Rows and amendments for H6: one row per control, keyed to
  /studio/v2/lore; the studio-page contract bump note; the parity
  echo against Lore's assigned CSV rows.
- Files created and touched.
```

### 5.8 Wave H5: Studio (gated on items 40 and 41, all of H2)

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H5: the Studio page. Runs only after Brian rules OPEN
items 40 and 41 and waves H2a, H2b, H2c have landed on the
integration line. Branch design/studio off design/sprint-h-plan.
Read docs/SPRINT-H-PLAN.md sections 3, 4, 5, docs/SPRINT-G-PLAN.md
section 2 (the ruled page plan, carried unchanged),
docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.4, docs/BUILD-BLUEPRINT.md
2.8, 2.9, 2.16(p), 3.1 row 6, and the Character allocation section
of docs/APP-FUNCTION-INVENTORY.md. File set:
app/studio/v2/studio/**, app/dev/ui-preview/studio-v2-page/.

MANIFEST
1. Build /studio/v2/studio as the fixture-driven create hub on the
   ruled ladder layout (3.1 row 6), studio-page shell, bottom
   banner routing to /studio/v2/images.
2. Quick-create modals, phone-first per R4 (full-screen under
   700px): Character first, against the standing QUICK allocation
   as amended by item 41's ruling; Story assembly second. Compose
   on modal-frame with KitFormField fields and KitPickerModal
   pickers, consumed unmodified.
3. The advanced editor per item 40's ruling. If A: the one full
   edit surface, absorbing the standalone editor's field set
   (Runtime Modules, Mechanics Profile, Publishing, Danger Zone),
   fixture-fed, honest stubs for generation and persistence. If C:
   skip this item and record it as deferred by ruling. Work
   session-by-session: hub first, then Character quick create, then
   the remaining quick creates, then the editor.
4. Submission-state presentation with KitAlertStrip, honest
   fixtures only (visibility enum data-model is CR-014, later,
   non-blocking).
5. Any composition question this brief and the read documents do
   not settle: STOP that unit and report it, never improvise a
   novel composition.
6. Full LOOM page set with contract, fixtures per surface, README,
   and the auth-free mirror at /dev/ui-preview/studio-v2-page.
7. Production build exit 0 at every session end. Commit, push.

REPORT (per session and at wave end)
- MANIFEST echo, DONE or STOPPED per item, stopped compositions
  listed with the exact question each needs ruled.
- Rows and amendments for H6: one row per control, keyed to
  /studio/v2/studio; the parity echo against Studio's assigned CSV
  rows, including the editor rows' disposition under item 40's
  ruling.
- Files created.
```

### 5.9 Wave H6: closing pass (gated on every other wave)

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
SPRINT H WAVE H6: the closing pass, the one session allowed to edit
the shared docs. Runs after every other Sprint H wave has landed.
Branch design/sprint-h-close off the integration line. Read
docs/SPRINT-H-PLAN.md in full and every wave report's "Rows and
amendments for H6" block.

MANIFEST
1. Merge the finished wave branches in this order if any are still
   unmerged: H2a, H2b, H2c, H1, H1b, H4, H3, H5. File sets are
   disjoint; a merge conflict means a wave left its file set, stop
   and report it.
2. Write every CSV row from the wave reports into
   docs/APP-FUNCTION-MAP.csv and regenerate the markdown rollup.
3. Fold the reported amendments into docs/BUILD-BLUEPRINT.md: the
   2.18 rail phone tier change, the Home composition change (one
   continue-surface top banner, seven surfaces), and any wave-
   reported amendment.
4. Align the DESIGN-TOKENS "Motion and focus" section with the kit
   focus law (2.16(e)), the carried item: border brightening on
   focus-visible for kit surfaces, no gold box, nothing on pointer;
   --focus-ring stays the declaring token.
5. Regenerate docs/CRESTFALL-DESIGN-CONTEXT.md at sprint close.
6. Update docs/CONTRACT-REQUESTS.md status lines per the wave
   reports (CR-029, CR-030 interim notes); file nothing new without
   a wave report naming it.
7. Zero em dashes in every touched doc; production build exit 0.
   Commit, push.

REPORT
- MANIFEST echo, DONE or STOPPED per item.
- The final CSV row count per /studio/v2/* page and the remaining
  Flagged-for-Brian parity items, listed.
- Any wave report block that could not be applied verbatim, quoted,
  with the reason.
```

## 6. Sessions and the critical path

| Wave | Sessions |
|---|---|
| H1 Home fix | 1 to 2 |
| H1b Home filter (plus 43/44 if ruled) | 1 |
| H2a, H2b, H2c kit fill | 3 (1 each, parallel) |
| H4 Adventures | 2 |
| H3 Lore | 2 |
| H5 Studio | 6 to 9 (3 to 4 if item 40 rules C) |
| H6 closing pass | 1 |
| **Total** | **16 to 20** |

**Critical path:** rule items 40 and 41 at GO, then H2 (one
parallel slot), then H5 (6 to 9 serial sessions, the dominant
term), then H6. Wall-clock is roughly 8 to 11 session slots; every
other wave (H1, H1b, H4, H3) absorbs into the parallel capacity
beside that path. If item 40 is not ruled at GO, H5 slips one slot
per day it waits and nothing else compensates; the whole sprint's
finish date is item 40's ruling date plus H2 plus H5 plus H6.

## 7. Carried items, placed, not started

1. **The DESIGN-TOKENS focus-note alignment.** Verified this
   session as still unmade (the "Motion and focus" section still
   names the gold ring as the only treatment). Assigned to H6 item
   4. Not made at this gate.
2. **Stories cards ten percent shorter and two-up.** Still needs a
   variant sitting with side-by-side renders; cards render on Home
   and Community today, so the sitting can happen at any Brian
   review, independent of the waves. Carried, not scheduled inside
   a wave.
3. **Video tab stubs with a coming-soon state.** Rides the next
   Images pass; Sprint H schedules none. Carried.
4. **CR-028 mute a creator, with OPEN item 36.** Waits on the
   Creators profile-detail page, out of Sprint H scope. Carried.
5. **The top banner CTA's fallback-state destination.** Flagged in
   the CSV since the Home build; ruling 1a keeps the fallback hero
   and does not name its destination. Stays an open flag, listed
   here so it is not silently closed.

## 8. Verification law for this gate

This planning gate changes documents only: this file and
`docs/CONTRACT-REQUESTS.md` (CR-030 filed, CR-029 updated), on
branch design/sprint-h-plan. Nothing under `components/`, `app/`,
`lib/`, or `public/` changes; the two located art files are copied
by wave H1, not by this gate. Production build exit 0 at gate close;
zero em dashes in both touched files; the gate report echoes its
manifest part by part.

Wave verification is section 5's standing header: build exit 0,
commit, push, report with the H6 block; no render steps, Brian
reviews rendered pages himself. Rendered evidence gathered during
this gate's diagnosis (section 1d) came from the live preview at
emulated 390x844, deviceScaleFactor 2, mobile true, touch true, per
the R3 method.
