# SPRINT-G-PLAN v1.0.0, written 10 Aug 2026, branch design/rail, planning gate only

One plan covering the four unbuilt pages together: Home, Studio,
Adventures, Lore. Plan only; this gate builds nothing. Every claim
about repo state below was verified against a file read in this
session. The standing Nick rule applies throughout: the front end
changes display names only, Nick's backend naming stays as built, no
contract request is escalated to him, and nothing is described as
blocked on him. Every page is planned to the furthest point reachable
without him, which for all four pages is a complete fixture-driven
build.

## MANIFEST

1. Standing facts and settled rulings this plan builds on, none
   re-litigated (section 0).
2. Per-page plans for Home, Studio, Adventures, and Lore: what is
   ruled and where, kit composition, net-new work, prerequisites
   (sections 1 through 4).
3. Kit packages that must be built before these pages proceed, with
   consumers (section 5).
4. The four waves, engine per wave, real cost per wave (section 6).
5. Resolution of Sprint F step 6, the KitRail function-map rows
   (section 7).
6. Carried filed items placed at their waves, none started (section
   8).
7. Contract requests filed at this gate, none escalated (section 9).
8. Verification law for this gate and for the waves (section 10).
9. OPEN FOR BRIAN, items 37 through 41 (section 11).

## 0. Standing facts settled at this gate

Settled, honored as written, not re-litigated here:

- **Home's composition, ruled 10 Aug 2026.** Top to bottom: medium
  top banner on the promo-banner top treatment with the galaxy layer
  on; a Continue strip that renders nothing when nothing is in
  progress; a block of eight destination tiles covering every other
  section; four curated rails (top rated, recently added, from the
  community, creators to follow); medium bottom banner routing to
  Stories. View all sits at each rail's head beside the label. One
  sort control, on the top rail only. Home consumes KitRail four
  times. Recorded in `docs/CRESTFALL-DESIGN-CONTEXT.md`.
- **Lore, ruled.** Ships as an index page on the shared v2
  composition the five built pages use, keeping its centered
  editorial labels. Existing reading routes stay untouched.
- **Studio, ruled composition.** Quick-create modals for phone and
  the advanced full editor for desktop (`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`
  section 4.4 carries the two-speed model; the 10 Aug ruling settles
  the phone/desktop split).
- **Adventures, ruled approach.** Display-name mapping only, through
  the terminology module. `lib/shared/presentation/terminology.js`
  already maps STORYLINE to "Adventure"; no component wires it in
  yet (verified this session). CR-025's backend rename stays later
  and non-blocking.
- **The cutover sequence, ruled 10 Aug 2026.** All nine pages build
  and stay at `/studio/v2/<page>`; old pages untouched until 100
  percent live-feature coverage against `docs/APP-FUNCTION-MAP.csv`;
  Nick review and sign-off; freeze and merge; stage and test; one
  go-live. No page cuts over individually. The `/studio` address
  collision is an open cutover question and blocks nothing in this
  plan.
- **Kit state at Sprint F close** (verified against
  `components/kit/` this session): seventeen packages shipped,
  including `rail` (KitRail, contract 1.0.0, items 31 through 35
  ruled and closed, law in `docs/BUILD-BLUEPRINT.md` 2.18). Not yet
  built: global search, form-field, picker-modal, menu-popover,
  alert-strip.

## 1. Home

**Ruled, and where the rulings live.** Composition: the 10 Aug 2026
strategy-chat ruling recorded in `docs/CRESTFALL-DESIGN-CONTEXT.md`.
Rail anatomy and behavior: `docs/BUILD-BLUEPRINT.md` 2.18. Banner
treatments and hierarchy: 2.3 with 2.16(f), (m), (t). Sort dropdown:
2.17. Build address `/studio/v2/home`: route law 3.3(a). The ruled
order is exhaustive: Home carries no filter line and no local search;
its one control beyond navigation is the top rail's sort.

**Composition from the existing kit.** `studio-page` shell (1.0.0);
`promo-banner` (1.1.0) top treatment with `showGalaxy` at the head
and bottom treatment routing to Stories at the foot; `rail` (1.0.0)
four times, the top rail seating a single-select `dropdown` (1.1.0)
in its head control slot; `creation-card` (3.1.0) children in the
three creation rails; `creator-card` (1.0.0) children in the
creators rail. All verified present in `components/kit/` this
session.

**Genuinely net-new.** The destination tile block (eight tiles, one
per other section): no kit package or ruled treatment exists for it;
packaging and treatment are OPEN item 37. The Continue strip's
composition (what renders when something IS in progress): OPEN item
38. The page file set itself (`app/studio/v2/home/` server page plus
mockup client, fixtures, and the `/dev/ui-preview/home-v2-page`
mirror, per the standing two-file convention). The CR-029 mock
module feeding all five fixture feeds. The function-map rows for
every Home control, including the KitRail rows (section 7).

**Before it can start.** OPEN items 37 and 38 ruled at this gate.
Nothing else: no kit build, nothing from Nick. Furthest point without
Nick: the complete fixture-driven page.

## 2. Studio

**Ruled, and where the rulings live.** Two-speed model:
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.4 (quick create
phone-first, advanced mode as the full editor, Studio as the public
release submission hub). Phone/desktop split: the 10 Aug ruling in
section 0. Modal behavior: 2.16(p) R4 (phone modals maximize full
screen). Field anatomy: 2.8. Picker anatomy: 2.9. The QUICK/ADVANCED
field allocation: `docs/APP-FUNCTION-INVENTORY.md`, Character
allocation section. CR-026 (Nick promotes ADVANCED fields into QUICK
after reviewing mockups) is a later pass by its own definition, not a
build gate. The create-hub chrome: 3.1 row 6 (ladder layout per the
proof).

**Composition from the existing kit.** `studio-page` shell,
`modal-frame` (1.1.0, quick-create modals and the advanced-mode
picker ride it), `dropdown`, `creation-card` (picker grids and the
hub's tool/door surfaces where cards fit), `badge` (visibility in
own-work context), `promo-banner` bottom treatment (journey to
Images).

**Genuinely net-new.** The largest net-new surface of the four:
quick-create modal compositions per asset type (Character first,
against the standing QUICK allocation; Story assembly second);
the advanced-mode full editor composition (gated on OPEN item 40,
the CR-007/CR-008 edit-surface question, which is Brian's, not
Nick's); the create-hub ladder layout; submission-state presentation
(honest fixtures only; the visibility enum's data-model landing is
CR-014, later, non-blocking).

**Before it can start.** Wave 2's kit fill (form-field, picker-modal,
alert-strip). OPEN items 40 and 41 ruled. Nothing from Nick: CR-026
and CR-014 are both later passes. Furthest point without Nick: the
full fixture-driven hub, quick-create modals against the current
allocation, and the advanced editor per the item 40 ruling, with
generation/persistence as honest stubs.

## 3. Adventures

**Ruled, and where the rulings live.** Page shape:
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.3 (top banner with the
build CTA; the build action opens the Adventure builder as a modal
carrying the existing builder functionality whole; the public
catalog below). Display naming: the 10 Aug ruling in section 0
(terminology module only; the mapping already exists in
`lib/shared/presentation/terminology.js`, unwired). The 3.1 row 7
wait condition is superseded by the dated amendment folded into
`docs/BUILD-BLUEPRINT.md` this gate. Smallest surface of the nine
(six CSV rows per 3.1).

**Composition from the existing kit.** `studio-page` shell,
`studio-filter-bar` (2.0.0), `dropdown`, `creation-card` grid,
`load-more`, `promo-banner` top treatment (build CTA) and bottom
treatment (journey to Studio), `modal-frame` for the builder rehost.

**Genuinely net-new.** Wiring the terminology display mapping on v2
surfaces (display names only, one module, already written); the
builder-as-modal rehost, which is existing functionality re-hosted
inside `modal-frame` and is the wave's one contract-law risk: the
builder's contracts must not change, and any apparent need to change
one stops that unit and escalates, per `docs/FRONTEND-SOP.md`
section 13; catalog fixtures.

**Before it can start.** Nothing. Every consumed package is built,
no open pick gates it, nothing from Nick (CR-023's feed question and
CR-025's rename are both data-layer, both non-blocking for a
fixture-driven build). Furthest point without Nick: the complete
fixture-driven page including the rehosted builder against fixtures.

## 4. Lore

**Ruled, and where the rulings live.** The 10 Aug ruling in section
0: an index page on the shared v2 composition, centered editorial
labels, existing reading routes untouched. Page purpose and filter
facets: `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.9 and 3.1
(approval state, world or faction, recency). Route folding: 3.1 row
9's 9 Aug ruling (the public archive routes and
`/studio/official-characters` fold into the Lore destination when
built; under the cutover sequence that folding is now recorded at
build time and executed at go-live, not per page). CR-015 (pipeline
confirmation) stays open with Nick, non-blocking.

**Composition from the existing kit.** `studio-page` shell,
`studio-filter-bar`, `dropdown`, `creation-card` grid (the no-art
fallback will carry real weight here, since lore entries are often
textual), `badge` (approval state where the tag economy permits),
`load-more`, `promo-banner` bottom treatment (journey to Home, the
loop's closing banner), `modal-frame` plus `form-field` for the
creation modal.

**Genuinely net-new.** The centered editorial label variant (a
View-level seat on the shared composition's section labels, the one
page in the set that centers them); the creation entry point (which
control opens the creation modal is OPEN item 39); index fixtures
covering approval states.

**Before it can start.** Wave 2's form-field and alert-strip (the
creation modal's fields; approval-state notices per 3.1 row 9). OPEN
item 39 ruled. Nothing from Nick. Furthest point without Nick: the
complete fixture-driven index page with a fixture-fed creation
modal; live pipeline wiring waits on CR-015 at the cutover level-set,
not during the build.

## 5. Kit packages to build before these pages

| Package | Blueprint spec | Consumed by | Wave |
|---|---|---|---|
| `form-field` | 2.8 | Studio (quick-create modals, advanced editor), Lore (creation modal) | 2 |
| `picker-modal` | 2.9 | Studio (advanced-mode asset picker, Story assembly pickers) | 2 |
| `alert-strip` | 2.11 | Studio (submission states), Lore (approval notices) | 2 |
| `destination-tile` (name pending) | none; OPEN item 37 | Home (eight tiles) | 1, only if item 37 rules a package |
| Continue strip treatment | none; OPEN item 38 | Home | 1, package only if item 38 rules one |

Not required by these four pages: `global-search` (2.2). Home's
ruled composition carries no search; the global piece is topbar
chrome riding CR-012 and is buildable any time under the mock-module
note, but nothing in Sprint G waits on it. `menu-popover` (2.9's
smaller sibling) is likewise not consumed by any of the four ruled
compositions and is not scheduled.

## 6. The waves

Engines per the model lanes in `docs/PROJECT-INSTRUCTIONS.md`: Opus
authors each wave's brief; the engines named below execute; Fable
appears only where a composition has no established pattern.

**Wave 1: Home.** Engine: Sonnet (every consumed pattern is ruled
and built; items 37 and 38 arrive ruled from this gate, and whichever
package they mint is specced in the ruling itself). Delivers the
page set, the CR-029 mock module, the KitRail function-map rows
(section 7), and the render pass at 390 and 1440. Real cost: 2 to 3
sessions; 3 to 5 packages touched (page set, up to two new kit
packages per the rulings, CSV plus rollup).

**Wave 2: kit fill.** Engine: Sonnet (2.8, 2.9, and 2.11 are full
specs; this is propagation of ruled anatomy into new LOOM packages).
Delivers `form-field`, `picker-modal`, `alert-strip`, each with the
full LOOM file set, preview route, and CSV rows. Real cost: 3
sessions, one per package; 3 packages touched.

**Wave 3: Lore and Adventures.** Engine: Sonnet (both pages are the
shared composition applied again; the builder rehost is existing
functionality re-hosted under contract law, with escalation expected
rather than improvisation). Delivers both page sets, the terminology
wiring on v2 surfaces, the centered-label variant, and both render
passes. Real cost: 3 to 4 sessions; about 5 packages touched (two
page sets, the label variant seat, the builder rehost shell, CSV
plus rollup).

**Wave 4: Studio.** Engine: Fable for the advanced editor and
quick-create compositions (novel, no established pattern), then
Sonnet to propagate the quick-create modal pattern across asset
types and finish the hub. Delivers the Studio page set, the
quick-create modals, the advanced editor per item 40, and the render
passes. Real cost: the largest of the plan, 6 to 9 sessions; 6 to 10
packages touched; the highest rework risk of the four waves, which
is why it runs last, after items 40 and 41 are ruled and the kit
fill has landed.

Dependency note: Wave 1 needs items 37 and 38 ruled; Wave 3 needs
item 39 ruled and Wave 2 landed (Lore only; Adventures has no
dependency and moves up if a ruling is still open); Wave 4 needs
items 40 and 41 ruled and Wave 2 landed.

## 7. Sprint F step 6, resolved

Sprint F's build sequence step 6 required one function-map row per
rail control. It was not executed: `docs/APP-FUNCTION-MAP.csv` read
this session contains no KitRail rows (the only "rail" rows belong
to the games hub, the chat panel rails, the `/characters` tag rail,
and the Images creator rail). The blocker was structural: the CSV is
keyed by page route, a kit package with no live-page consumer has no
route to key a row to, and the preview harness is never product
(`docs/FRONTEND-SOP.md` section 2).

RESOLVED by this plan: now that Home consumes KitRail four times,
the rows land in Wave 1, keyed to `/studio/v2/home` (precedent: the
`/studio/v2/images` creator-surface rows already in the CSV), one
row per rail control per rail instance (four View all links, the
arrow pairs, the top rail's sort control), in the same commit as the
Home build, per the definition of done in `docs/FRONTEND-SOP.md`
section 14. Until Wave 1 lands, the gap stays recorded here, not
silently closed.

## 8. Carried filed items, placed, not started

1. **Video tab stubs with a coming-soon state.** Rides the next
   Images pass. Sprint G schedules no Images wave, so this stays
   filed here for the next Images brief to pick up. Not started.
2. **Stories cards ten percent shorter and two-up.** Needs a variant
   sitting, not an argument: side-by-side renders of the current
   card and the shorter two-up variant are prepared at the Wave 1
   render gate (the first gate of this sprint where cards render),
   and Brian rules at that sitting. No variant is built into any
   page until ruled. Not started.
3. **CR-028, mute a creator.** The mute control needs the Creators
   profile-detail page, which does not exist and is not in Sprint
   G's scope. Stays deferred; OPEN item 36 (mute placement) stands
   open with it. Not started.
4. **The design-tokens focus note.** `docs/DESIGN-TOKENS.md` "Motion
   and focus" still names the global gold `--focus-ring` as the only
   focus treatment; the kit focus law (2.16(e)) supersedes it on kit
   surfaces (border brightening only, no gold box, nothing on
   pointer). The alignment edit to the tokens doc is scheduled as
   Wave 1's opening doc commit, recording the already-ruled law. Not
   made at this gate.

## 9. Contract requests filed at this gate

- **CR-029 filed** (Home feed data: the four rails and the Continue
  strip), with the expected shapes and the CR-017 mock-module
  pattern named. Open, owner Nick, non-blocking; Home builds
  fixture-first.
- **CR-025 updated** to record the 10 Aug ruling: v2 surfaces
  display "Adventure" via the terminology module ahead of the
  backend rename; the rename stays Nick's later pass.
- Escalated to Nick: none. Every CR touching these pages (CR-014,
  CR-015, CR-023, CR-025, CR-026, CR-028, CR-029) is a later pass or
  a data-layer question; all seven are level-set with him in one
  pass at cutover sequence step 3. No page in this plan is blocked
  on him.

## 10. Verification law

This planning gate changes documents only: this file,
`docs/CRESTFALL-DESIGN-CONTEXT.md` (regenerated),
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` (cutover amendment),
`docs/BUILD-BLUEPRINT.md` (cutover and 3.1 amendments),
`docs/CONTRACT-REQUESTS.md` (CR-029, CR-025). Nothing under
`components/`, `app/`, or `lib/` changes. Production build exit 0 at
gate close; zero em dashes in every touched file.

Every wave obeys `docs/FRONTEND-SOP.md` section 8 in full: rendered
checks at emulated 390x844 (deviceScaleFactor 2, mobile true, touch
enabled) then 1440, resize banned, production build exit 0 at
session start and end, function-map rows in the same commit as the
controls they describe, zero em dashes in any touched doc, and every
finished-task report echoes its brief's manifest part by part as
DONE or STOPPED. Anything unverified is reported as unverified,
never as done. Each page build brief ends with the parity echo
(3.4) against its assigned CSV rows.

## 11. OPEN FOR BRIAN

Items 1 through 30 stand in `docs/SPRINT-D-PLAN.md` and
`docs/SPRINT-E-PLAN.md`; 31 through 35 are ruled and closed
(`docs/SPRINT-F-PLAN.md`); 36 (mute placement) stays open. Sprint G
opens five:

37. **What is a destination tile?** Home's block of eight tiles has
    no ruled treatment or packaging.
    - **A, recommended: a new kit package, built once.** A compact
      art tile carrying the section name and one short line, using
      the ruled over-art text grammar, eight per Home. Why: a
      repeated composition becomes a kit package (the rail set that
      precedent), and tiles stay reusable if any other surface later
      wants section links. Cost: one new package (full LOOM set plus
      preview), about one session inside Wave 1, low rework risk.
    - **B: Home-local markup, no package.** Why not: repeats the
      pre-kit pattern the kit exists to end; a second consumer would
      force the extraction later at double cost. Cost: half a
      session now, an extraction pass later.
    - **C: reuse the promo-banner card treatment eight times.** Why
      not: the banner taxonomy fixes three treatments with fixed
      anatomy; a grid of eight card banners reads as banners, not
      tiles, and stretches a ruled taxonomy sideways. Cost: no new
      package, half a session, high risk of a redo at render.

38. **What does the Continue strip render when something IS in
    progress?** The empty state is ruled (renders nothing); the
    filled state is not.
    - **A, recommended: one continue card on the promo-banner card
      treatment,** showing the single most recent in-progress item,
      one tap resumes, with Stories holding the full Continue group.
      Why: the card treatment is the ruled continue-card witness
      (3.1 row 4), zero new packages, and Home stays a guidepost
      rather than a second Stories. Cost: none beyond the Home
      session.
    - **B: up to three compact continue rows,** a short vertical
      stack of list-layout creation cards. Why not: pulls the
      Stories page's job onto Home and adds a capped-list rule
      nothing else uses. Cost: about one extra session, a
      list-variant sitting.
    - **C: a horizontal strip of continue cards.** Why not: reads as
      a fifth rail against the ruled four, whatever component
      renders it. Cost: one extra session, highest redo risk.

39. **Where does Lore's creation entry live on the index page?**
    - **A, recommended: a page-head action button** ("Write lore")
      in the heading block, opening the creation modal. Why: the
      index page keeps the shared composition its five siblings
      share, and the journey banner keeps the page's one banner
      budget. Cost: none beyond the Lore session.
    - **B: a top banner with the create CTA.** Why not: adds a top
      banner none of the five shared-composition siblings carry,
      splitting the shared shape Lore was ruled onto. Cost: part of
      the Lore session, render-gate risk.
    - **C: an in-flow banner card above the grid.** Why not: pushes
      the index content down and spends the mid-page on a second
      sell when the page's job is reading. Cost: small, but likely
      re-ruled at render.

40. **The Studio advanced editor's edit-surface question**
    (CR-007/CR-008, Brian-owned, restated here because Wave 4 cannot
    spec the editor without it).
    - **A, recommended: the advanced editor is the one full edit
      surface.** It absorbs the standalone editor's full field set
      (Runtime Modules, Mechanics Profile, Publishing, Danger Zone),
      and the seven-stop creator stays the create-only quick path.
      Why: matches the product model's "every available field"
      advanced mode, and one edit surface is the only shape that
      reaches 100 percent coverage without keeping the old editor
      alive past go-live. Cost: the largest Wave 4 scope, 3 to 5 of
      its sessions, high build cost, low rework risk.
    - **B: the standalone editor stays authoritative; advanced mode
      is a picker that routes to it.** Why not: keeps two edit
      surfaces into cutover and drags an old-system page through the
      go-live boundary. Cost: cheapest now, contradicts the coverage
      measure later.
    - **C: defer the editor; Wave 4 ships quick-create and the hub
      only.** Why not: Studio lands incomplete against its ruled
      composition and the coverage measure stalls on the editor
      rows. Cost: shortest Wave 4, an unscheduled editor sprint
      after.

41. **The two QUICK-allocation flags** (`docs/APP-FUNCTION-INVENTORY.md`
    holds appearance-step fields and Default Rendering Style in
    QUICK against the pattern's literal wording, flagged for Brian).
    - **A, recommended: keep both in QUICK** as the inventory's
      guardrail chose. Why: preserves phone capture of a character's
      look, the reason the guardrail held them, and CR-026 already
      gives Nick a later pass to adjust the allocation. Cost: none.
    - **B: move both to ADVANCED** per the pattern's literal
      wording. Why not: strips appearance from quick create and
      weakens the couch-capture case the two-speed model exists
      for. Cost: an allocation edit, small.
    - **C: split them** (appearance stays QUICK, rendering style to
      ADVANCED). Why not: half-applies a guardrail argued as a
      pair and re-asks the same question at Nick's CR-026 pass.
      Cost: small, plus a repeat decision later.

Nothing above is executed before GO. Wave 1 starts on rulings for 37
and 38; Wave 3's Lore build starts on 39; Wave 4 starts on 40 and
41.
