# Crestfall design context

Regenerated 16 Aug 2026 (branch `design/ed1e-editor-design`, tip
`eb000bd`, cut from `design/sprint-h-final` at `ad8e586`), the DC1
docs-only handoff close. Supersedes the 12 Aug 2026 version. Not law
itself; CLAUDE.md names the four law documents (`docs/DESIGN-TOKENS.md`,
`docs/FRONTEND-SOP.md`, `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`, the
active sprint plan). This file orients a new session fast; when it and
a law document disagree, the law document wins and this file is stale
and should be regenerated.

## What Crestfall is

Crestfall is a storytelling and character-creation platform by
Anthology Interactive. This repository, Crestfall-fe, is its front
end, independent from the Crestfall services API (Chassis) and from
the original Crestfall FE. Ports: this repo 3001, services-api 4000,
original Crestfall FE 3000.

## CM1: chat and editor consolidation, 15-16 Aug 2026

`design/sprint-h-final` absorbed two long-running feature branches
before this document was regenerated:

- **Chat core (C1 through C6)**, merged at `3a2d167`: chat-message and
  chat-transcript, chat-composer, chat-cast-panel/chat-npc-manager/
  chat-state-panel, chat-session-dialogs, the chat-shell package and
  the chat v2 page route, then the C6 parity echo and CR filings.
- **Editor (ED1b through ED1d)**, merged at `7f131c8`: the ED1b
  single-surface rebuild, the ED1c revision to the hero-plus-
  accordion-plus-ToC-rail architecture (superseding ED1b's layout in
  full per Brian's 13 Aug ruling), and the ED1d defect pass (`44c5a72`,
  folding fields, focus ring, modal sizing).

`design/community-parity` (`05e7eae`) was already an ancestor of
`sprint-h-final` before either merge; CM1 did not touch it.

`ad8e586` is a docs-only commit on top of both merges: it prepends
SUPERSEDED annotations to the stale Story summary/export/share
absorption passages (`CLOSING-REPORT.md`, `NICK-SWEEP-NOTES.md`, and
the three CF_ST contracts files), adds the FE-REVIEW-01 standing rule
to CLAUDE.md, and records the FE-REVIEW-01 review itself. This
document's tip, `eb000bd`, cuts from `ad8e586` for the ED1e design-
standard pass (design-only, no contract bump, no feature added; see
"The editor's current state" below).

## FE-REVIEW-01, closed 15 Aug 2026

`docs/reviews/FE-REVIEW-01.md`. Disposition: APPROVE AFTER REVISIONS.

**The Chassis/Skin boundary**, the review's central ruling: Crestfall
(Chassis) owns routes and application logic; Crestfall-fe owns Views,
Kit, tokens, fixtures, and page composition only. Presentation-only
ViewModels are FE-owned; application ViewModels and authoritative
Binding Shells are Chassis-owned. Crestfall-fe page entrypoints under
`app/` are presentation composition and stay. This is now the standing
rule FE-REVIEW-01 in CLAUDE.md.

**Accepted revisions**, in full:

1. Camera presets are 29 in 7 groups, so the picker uses grammar, not
   tiles.
2. The Location Registry split rewrites the source registry, so the
   final commit uses destructive confirmation.
3. Crestfall-fe page entrypoints under `app/` are presentation
   composition and stay.
4. Presentation-only ViewModels are FE-owned; application ViewModels
   and authoritative Binding Shells are Chassis-owned.
5. Seeded email/password dev login is approved only in a dev-scoped
   auth environment.
6. The Ability/Spell, Skills, and Wallet placement stays OPEN until
   after ED1e.

**The agreed order**, eleven steps, expected, verify no step has moved
since 15 Aug 2026:

0. FE branch consolidation (CM1, this section).
1. Re-audit consolidated FE plus CR log.
2. Freeze Chassis and FE SHAs.
3. Realistic payload pack from Chassis.
4. WP-C Chassis contracts and fixtures for the three profiles.
5. FE builds those Views after ED1e.
6. Library Pass and Images semantics first, FE treatment second.
7. Story export and share retargeted to C1 and C4 after the chat
   render sitting.
8. Location split against post-CC3 state.
9. Mechanics and editor work after the ED1e unlock.
10. High-drift reconciliation.
11. Final parity echo.

**The editor family is frozen from outside edits** until the two ED1e
gates close (section 9 of the design standard). `eb000bd`, this
branch's tip, is the integration base pending those gates; no other
branch should fork editor-family files ahead of the unlock at step 9
above.

**Standing rule from this review:** FE fixtures ship a filled,
value-carrying variant, not an empty or placeholder one.

## The product model

Canonical product truth lives in `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`,
reissued 9 Aug 2026, which supersedes the earlier
`docs/CRESTFALL-PRODUCT-MODEL.md` for page architecture. Three
sections, nine pages, one global navigation, sidebar in journey
order:

- **Play:** Home, Stories, Adventures
- **Create:** Studio, Images, Vault
- **Explore:** Community, Creators, Lore

The journey loop: Home to Stories to Adventures to Studio to Images
to Vault to Community to Creators to Lore, back to Home; every page's
bottom promo banner sells the next stop and its CTA routes there.

All nine pages built (per the 12 Aug 2026 Sprint H close), plus the
Creators profile-detail page and its connections sub-page, and the
advanced editor. Chat (C1-C6) and the editor's ED1c/ED1d passes are
new since that close; see "CM1" above and "The editor's current
state" below. See "Where the build stands" for the full inventory.

## The cutover sequence, standing process, RULED 10 Aug 2026

Unchanged by this pass. This sequence supersedes the per-page cutover
previously described in the migration strategy
(`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 6 and
`docs/BUILD-BLUEPRINT.md` section 3.3 both carry the dated
amendment). The order:

1. All nine new pages build and stay at `/studio/v2/<page>`.
2. Old pages and old addresses are untouched until the new set covers
   100 percent of live features, measured against
   `docs/APP-FUNCTION-MAP.csv`. The per-page parity echo
   (`docs/BUILD-BLUEPRINT.md` section 3.4) is the instrument for that
   measure.
3. Nick reviews and signs off on the completed front end.
4. Nick freezes new code; his outstanding work merges in.
5. The full site stages; final tests run.
6. The new site goes live, fully Loom compatible, so backend and
   frontend proceed independently from there.

No page cuts over individually ahead of this sequence. No new page
enters the live sidebar before the go-live step; the preview-flag
navigation remains the only pre-cutover navigation surface. Old page
code is deleted only in the single full-inventory sweep after go-live,
unchanged from route law 3.3(d).

The FE-REVIEW-01 agreed order (above) sequences the work between now
and that go-live in more detail than this six-step cutover sequence
did on its own; the two are compatible, not competing.

## The editor's current state

The advanced editor lives at `/studio/v2/editor` and
`/studio/v2/editor/[id]`, contract 4.0.0. Architecture is hero plus
accordion plus ToC rail, ruled by ED1C on 13 Aug 2026 (superseding
ED1B's side-thumb layout in full) and built at `0c4f453`. The ED1d
defect pass (`44c5a72`) folded fields, fixed the focus ring, and
corrected modal sizing on top of that architecture.

**ED1E, the design standard**, `docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md`,
written 16 Aug 2026 on this branch. A design-only pass: no production
component changed, no contract bumped, no feature added; a later
Sonnet propagation pass applies it (section 11 of that document). It
catalogues 22 defects (D1 through D22) found across the editor family
at 390 and 1440, covering field-grammar inconsistency, nested
bordered boxes, the Danger Zone's raw red classes, folding-field clip
bugs, hero dead space and ragged actions, rail scroll and label
defects, the trait-modal's off-system panel, a live fetch in fixture
mode, disabled controls that read as enabled, off-token values, and
30 illegal native selects in the mechanics-modules subtree.

**Two open gates for Brian**, sequenced, one at a time (section 9):

- **Gate 1, field grammar.** Three renders of the same section:
  Quiet (labels stay small and muted, gold only at section level and
  active states; recommended), Gilded (every field label gold), or
  Blended (only the focused field's label turns gold).
- **Gate 2, hero architecture**, rendered in the Gate 1 recommendation:
  Side art cleaned (art left, filmstrip beneath it, identity and one
  action row beside it; recommended), Full-width banner, or Backdrop
  hero.

**Four law-gap escalations** (section 10, need Brian rulings, not
blocking the two gates): status color at normal text size has no
legal use on `--surface-2/3/4`; field-level error treatment has no
law; the composed disabled-control recipe has no law; helper text has
no assigned size token.

**Evidence:** the contact sheet at
`docs/review-artifacts/ed1e/ed1e-contact-sheet.html`, diagnosis
screenshots (`ed1e-diag-*.png`) and exemplar renders
(`ed1e-render-*.png`) in the same folder, and the live dev-only route
`/dev/ui-preview/ed1e-editor-design`.

Until both gates close, the editor family is frozen from outside
edits (FE-REVIEW-01, above); the propagation checklist (section 11)
runs after.

## Rulings from the 11 Aug 2026 session

All ruled by Brian, all already implemented in code before the 12 Aug
2026 document regeneration.

- **Card law amendment, closed.** The creation card's third overlay
  icon (previously a fixed Expand) is now contextual: Play ("Start
  Chat") on Story and Adventure cards, Generate on Image cards where a
  real destination exists, Expand as the universal fallback. Like and
  Save unchanged; artwork tap still opens the card. Creation-card
  contract 3.2.0. Full record: `docs/BUILD-BLUEPRINT.md` 2.16(v).
- **Five-bucket type filter, closed (CR-038).** Community and Vault
  share one presentation-layer type grouping: Characters, Worlds,
  Looks, Stories, Adventures, replacing the earlier four-kind-plus-
  Remix set on both pages. Full record: `docs/BUILD-BLUEPRINT.md`
  2.16(y).
- **Adventure display naming, extended platform-wide.** The
  terminology-module display mapping (STORYLINE reads "Adventure")
  now covers the shared builder components too, not only the browse
  page. Backend naming is unaffected; CR-025/CR-039 remain the later,
  non-blocking backend rename pass.
- **Item 36 / CR-028 CLOSED.** The mute control on the Creators
  profile-detail page's engagement row, exact label "Mute content"
  ("Muted" when active).
- **Editor back control, closed.** The editor's back control returns
  to the page it was opened from, falling back to Vault when no origin
  is known; label is exactly "Back" (rendered "← Back"), never "Back
  to X". Editor contract 1.2.0 at the time of this ruling, since
  raised to 4.0.0 by the ED1c architecture rebuild.
- **Home cold-start banner, closed.** Eden confrontation art, galaxy
  layer on, headline "Start something worth finishing.", primary CTA
  "Browse stories", ghost CTA "See what others made". Home contract
  2.2.0.
- **Stories: hero continue banner RETIRED, closed.** Compact continue
  rows only (capped three, "Show all in progress (N)" reveals the
  rest). Home is the only page in the nine-page set that carries a
  continue banner.
- **Sidebar v2 preview routes all nine pages, closed.**
- **`docs/APP-FUNCTION-MAP.md` rollup deleted.** The CSV
  (`docs/APP-FUNCTION-MAP.csv`) is the sole live map.
- **CR-007/CR-008 hold RESOLVED.** Settled via
  `docs/VAULT-EDIT-TREE-CLASSIFICATION.md`. The edit tree, most of the
  preview tree, and the image-library are reachable from Vault via
  `/studio/v2/editor/[id]` and its `/studio/v2/editor/[id]/image-library`
  child.

## Rulings from the 12 Aug 2026 sitting (Sprint H creator-completion: CC1-CC7, SF1, LD1)

Eight parallel and sequenced passes, merged into `design/sprint-h-final`
before the 12 Aug 2026 document regeneration. Full merge history: the
branch's own log; this section is the consolidated summary.

- **Advanced-editor conformance (CC1, CC2, CC3, SF1), closed.** Every
  advanced-editor package uses `SharedFields`' `SectionTitle` (or the
  `StudioPageHeader` inline eyebrow token recipe) instead of
  hand-rolled gold eyebrows, and every raw textarea folds into
  `SharedFields`' `TextAreaField` under CR-041's two-class limit
  system (SHORT 600, DEEP 2,000), or keeps a real, higher,
  contract-validated limit where one already existed. Six fields keep
  a real limit above their CR-041 tier, flagged for Nick's
  reconciliation. Full record: `docs/CONTRACT-REQUESTS.md` CR-041.
- **Scale Review H fix pass (CC4), closed.** Home's four rails cap at
  12 items before `KitRailView`; `KitStudioFilterBar`'s `SearchField`
  gained a debounce; `KitAssetDetailPopup`'s carousel replaces dots
  with a "1 of N" readout past eight slides. CR-042 filed: server-side
  filter/sort/search for the eight list pages named in the scale
  review, the true scale ceiling underneath the fixture-driven build.
- **Banner-anchor ruling (CC5), closed.** Banner art pins toward the
  top of its frame with roughly a 10% downward bias by default
  (`imageAnchor`, promo-banner contract v1.3.0), superseding the fixed
  `center 35%` crop. All 14 v2 banner slots reassigned to remove
  duplicate images across pages one click apart.
- **Quick-create polish sweep (CC6), closed, comment-only.**
- **Connections list density (LD1), closed.** Creator Connections'
  list adopts the same two-up-at-1100px grid Community uses.

**The four quick creates, all live doors on Studio.** Character
(the original template), World (v1.1.0), Look (v1.0.0), Story
(v1.0.0). World, Look, and Story each reuse the Character quick
create's shared shell (`CreatorStopsView`) unmodified. Player
Character is the one Studio door still `isLive: false`.

## Rulings from the 10 Aug 2026 strategy chat

- **Home page, ruled.** A guidepost that routes, not a dashboard.
  Order, top to bottom: medium top banner (galaxy layer on), Continue
  strip, eight destination tiles, four curated rails, medium bottom
  banner routing to Stories.
- **Rails, ruled and BUILT.** `KitRail`, contract 1.0.0, shipped in
  Sprint F. Full law: `docs/BUILD-BLUEPRINT.md` section 2.18.
- **Lore, ruled.** Index page on the same composition the built v2
  pages share; left-aligned editorial labels (10 Aug 2026 LORE HEADER
  ruling).
- **Studio, ruled composition, BUILT.** Quick-create modals for
  phone and the advanced full editor for desktop.
- **Adventures, ruled approach, BUILT and extended.** Display-name
  mapping only, through the terminology module.
- **Nick engagement, standing.** The front end changes display names
  only; Nick's backend naming stays as built. FE-REVIEW-01's agreed
  order (above) is now the live instrument for leveling contract
  requests with him, superseding the earlier single-pass description.

## Typography and design language

Two type families carry the whole system. Body and UI copy is set in
Inter (the sans token). Titles, page heads, and display moments are
set in Cormorant Garamond (the display token), reserved for that
role.

Gold is expressed through several tokens by role (ornament, bright,
action), not one flat value. Three status colors exist for state
only: success (warm sage), warning (burnt amber), danger (brick red).
Never for decoration, charts, or hover effects; every use ships with
a word beside it. No fourth "info" color.

Every value is a token defined once and reused. `docs/DESIGN-TOKENS.md`
is the canonical source for what each token is, its role, and its
legal-on/never-on scope; `docs/RESTYLE-RULES.md` is history only,
cited never followed.

Corners, two tiers: LARGE for every full-content-width surface and
every floating surface (modals, pickers, sheets, drawers, popovers,
hero, bottom promo banner, empty states); STANDARD for grid siblings,
in-flow cards, and controls. PILL is reserved for tags and icon
buttons only; every clickable button, everywhere, is a soft-cornered
rectangle, never a pill.

Destructive actions never get a different size or shape from an
ordinary button. An in-page delete trigger is quiet (danger-red word
next to a plain icon, no fill); filled danger-red appears only inside
the confirming button of an "are you sure" step. The ED1e defect
catalogue (D3, D19) found the editor's Danger Zone and disabled
controls violating this and the disabled-recipe gap respectively;
both are queued for the Gate close and law-gap rulings above.

## The kit revision rulings, amending chapter 2 of `docs/BUILD-BLUEPRINT.md`

- **Card law.** Full-bleed art in BOTH grid and list layouts; list is
  a wide full-bleed art row, left-anchored legibility fade, no bottom
  action bar anywhere. Face actions are exactly three small overlay
  icons: like, save, and a contextual third action (Play/Generate/
  Expand). Overlay-action placement: `overlay-top` everywhere.
- **Filter line law.** Search, sort, and every filter share one
  sticky line, docking flush beneath the sticky top bar via
  `--topbar-h`. Community and Vault's Type dropdown shares one
  five-bucket option set (CR-038).
- **Tag economy.** A card badge appears only when it informs.
- **Mobile law at 390.** Every component fully functional and
  comfortable at 390. Popup modals maximize full screen under 700px
  with internal thumb scrolling; sheets keep the bottom dock.
- **Focus law.** Keyboard focus (`:focus-visible`) keeps one subtle
  indicator: a slight border brightening (`--line-strong`), never a
  gold box. Pointer interaction shows no focus ring at all. Note:
  `docs/DESIGN-TOKENS.md` "Motion and focus" still names the global
  gold `--focus-ring`; the kit focus law supersedes it on kit
  surfaces, and the tokens-doc alignment edit is a carried item, not
  yet made.
- **Banner hierarchy law.** One primary CTA per banner. An optional
  quiet secondary action (`cf-btn--secondary`, border only) may sit
  beside the one primary. An optional `imageAnchor` prop (default
  `"center 10%"`) positions the art layer's crop per instance.
- **Compact continue row.** `KitContinueRow`, a package sibling to
  `promo-banner`. Stories was its only consumer; Stories has since
  migrated to `KitCreationCard`'s `onContinue` prop (ED1G review, 22
  Aug 2026), so `KitContinueRow` is now an orphaned view with zero
  consumers.
- **List density.** Two-up list rows permitted at desktop widths
  where whitespace allows; Community and Creator Connections both
  render list two-up at 1100px and up.
- **Ratings presentation.** SFW displays as Everyone, MATURE as Young
  Adult (word superseded 23 Aug 2026, was Teen; FE display layer
  only), EXPLICIT as Adult, one to one, no disabled row. A required
  content audit (CR-027) gates live, non-fixture data under these
  labels; fixture-driven previews are unaffected.
- **Selection-state law.** Selected and active states read as a gold
  icon or text plus a light gold wash (`--fill`); no bold borders.
- **Image viewer law (R2/R5).** The viewer is its own surface, never a
  panel with an image inside it: gold hairline snapped to the image's
  own rendered edges, no `--surface-4` panel chrome.
- **Credits collapse law (R1).** The asset detail popup shows only the
  first credit plus a "View all credits" control opening
  `KitCreditsModal`.
- **Mobile verification method (R3), SOP law.** All mobile
  verification uses the Chrome DevTools MCP `emulate` command at
  390x844, deviceScaleFactor 2, mobile true, touch enabled. The
  `resize` command is banned for mobile checks; see
  `docs/FRONTEND-SOP.md` section 8.

## The rail rulings, now law in `docs/BUILD-BLUEPRINT.md` section 2.18

Sprint F's OPEN items 31 through 35 are RULED and CLOSED; the built
defaults stand: head layout, edge alignment, arrow seat, fade,
creator-rail fit, empty-rail law. Item 36 (mute control placement on
the creator profile, CR-028) CLOSED 11 Aug 2026. Full detail:
`docs/SPRINT-F-PLAN.md`.

## Sidebar v2 preview flag

`NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, read by
`lib/shared/flags/sidebarV2Preview.js`, documented in full in
`docs/FRONTEND-SOP.md` section 18. On by default for dev and staging,
off in production. Gates a preview-only nine-destination journey-order
nav on the live `StudioSidebar`, grouped Play/Create/Explore. All nine
destinations route to a live `/studio/v2/<page>`. This preview surface
is distinct from the real cutover: under the 10 Aug 2026 cutover
sequence above, no page enters the live sidebar until the whole new
site goes live at step 6.

## The LOOM file shape

Most converted UI packages follow one shape, responsibilities kept
deliberately separate:

- **Binding Shell** (e.g. `StudioSidebar.jsx`): Chassis-owned per
  FE-REVIEW-01: Next.js navigation, application state, host adapters,
  route behavior, authoritative ViewModel wiring.
- **ViewModel** (e.g. `useStudioSidebarViewModel.js`): presentation-
  only normalization and prop preparation is FE-owned; application
  ViewModels are Chassis-owned.
- **Portable View** (e.g. `StudioSidebar.view.jsx`): presentation
  only. No database access, no Supabase product data, no services-api
  calls, no persistence, no router behavior, no business rules.
  Receives data and callbacks through props.
- **Contract**: documents the expected shape of props and behavior,
  versioned on line 1.
- **Fixtures**: local, deterministic states for previews and isolated
  testing, without depending on live APIs. Ship a filled,
  value-carrying variant (FE-REVIEW-01 standing rule).

Full detail and the ten-point new-module checklist: `docs/FRONTEND-SOP.md`
section 1.

## Kit inventory

The `components/kit/` packages, the shared vocabulary every new v2
page composes from (`docs/BUILD-BLUEPRINT.md` chapter 2). Unchanged
by this pass; see the 12 Aug 2026 table for the full package-by-
package contract list, expected, verify current versions against
each package's own README before propagating ED1e.

Not yet built as kit packages: global search, picker-modal/menu-popover
beyond the ingredient picker, alert-strip. Form field previously ran on
ad hoc `cf-field` recipes; those are RETIRED (22 Aug 2026, A3) and the
`form-field` kit package now covers this, focused through the global
`--focus-ring`.

## Where the build stands

Built under `/studio/v2/<page>`, all fixture-driven, pre-parity, out
of the sidebar until the go-live step of the cutover sequence, each
with an auth-free mirror at `/dev/ui-preview/<page>-v2-page` for
verification without signing in. All nine pages of the ruled model are
built, plus the Creators profile-detail and connections pages, the
advanced editor, and now chat (C1-C6, this pass).

1. **Home** (`/studio/v2/home`, contract 2.2.0).
2. **Stories** (`/studio/v2/stories`): hub, compact continue rows,
   chat room `[id]` surface excluded by standing sweep-scope ruling
   until the chat render sitting.
3. **Adventures** (`/studio/v2/adventures`).
4. **Studio** (`/studio/v2/studio`, contract 1.0.0).
5. **Images** (`/studio/v2/images`).
6. **Vault** (`/studio/v2/vault`), reachable through the editor route.
7. **Community** (`/studio/v2/community`).
8. **Creators** (`/studio/v2/creators`), plus profile-detail and
   connections sub-pages.
9. **Lore** (`/studio/v2/lore`).

Supporting surfaces, not their own destination in the nine-page model:

- **The advanced editor** (`/studio/v2/editor/[id]`, contract 4.0.0):
  see "The editor's current state" above for current status. Its
  image-library page (`/studio/v2/editor/[id]/image-library`,
  contract 1.0.0) composes the unmodified legacy
  `CreationImageLibraryPage` package.
- **Chat** (new this pass, C1-C6): chat-message, chat-transcript,
  chat-composer, chat-cast-panel, chat-npc-manager, chat-state-panel,
  chat-session-dialogs, chat-shell, and the chat v2 page route. A
  render sitting has not yet happened; expected, verify current status
  against `docs/ROADMAP.md` Phase 2 before treating chat as sitting-
  reviewed.
- **Account** (`/studio/v2/account`): a fixture-driven restyle draft
  of the live account page. Explicitly OUTSIDE the nine-page model.

Every kit package has its own `/dev/ui-preview/<package>` route,
fixture-driven, unavailable in production. Agents never sign in to
verify any surface; every verification route above is the auth-free
path for that reason.

## The new standing rules

Three rules now govern every session on this repo, expected, verify
each against its own source document if this file and that document
ever disagree:

- **Filled fixtures required.** FE fixtures ship a filled,
  value-carrying variant, not an empty or placeholder one
  (FE-REVIEW-01 standing rule, above).
- **Agents never sign in.** Verification uses the auth-free
  `/dev/ui-preview/*` mirrors and fixture-driven routes; an agent
  never authenticates against a live or seeded login to check a
  render. Seeded email/password dev login (FE-REVIEW-01 accepted
  revision 5) is approved for dev-scoped human use, not for agents.
- **Chassis logic never moves into Crestfall-fe.** The FE-REVIEW-01
  boundary: Crestfall (Chassis) owns routes and application logic;
  Crestfall-fe is Views, Kit, tokens, fixtures, and page composition
  only (CLAUDE.md, standing rule FE-REVIEW-01).

## Named future workstreams

Not scheduled inside the nine-page build; recorded here so they are
not lost between sessions.

- **Marketing site with a CMS.**
- **Admin dashboard.**
- **Sidebar rebuild.** Fixed positioning and an account-area cleanup.
- **The Fable design gate, for creator surfaces and chat.** Covers the
  creation-type quick/advanced allocation, the four quick creates'
  eventual design review, high-volume creator behavior, and the
  chat/story-room surface, using G Stack read-only tools.
- **Recommendation and sorting logic**, on Nick's agenda.
- **Private-content nudity policy decision**, on Nick's agenda.

## The roadmap, in plain language

Full detail and the checkbox ledger: `docs/ROADMAP.md`. In order:

1. **Foundations** (done): the shared field kit, the token contrast
   rules, the creation picker.
2. **Chat** (built, not yet reviewed): the message thread, the
   composer, the side panels, the session dialogs, and the shell that
   holds them all together, now merged to trunk. Still to happen: a
   render sitting where Brian looks at it running, and a first
   ultrareview pass.
3. **Advanced editor** (in progress, this branch): the editor was
   rebuilt around a hero, an accordion of sections, and a table-of-
   contents rail. This pass is finding and cataloguing everything that
   still looks inconsistent across that rebuild, so it can be fixed
   once, by rule, everywhere it appears, instead of page by page.
   Waiting on two decisions from Brian (how field labels should look,
   and how the hero should be laid out), then four smaller open
   questions, then the fix rolls out across the whole editor family.
   After that, a second ultrareview pass, then a media rail, then the
   rest of the editor family sweeps.
4. **Studio journey**: re-tiering Studio itself, a "Build a Story"
   flow, and the Player Character quick create, the one creation type
   that still has no quick-create door.
5. **Remaining surfaces**: restyling the three simpler quick creates,
   the asset popup, and the Images landing page.
6. **Cleanup and polish**: a repo hygiene pass, finishing the sidebar,
   a pass on banner art, spacing fixes, copywriting, and small
   delight animations.
7. **Cutover**: the six-step sequence above, culminating in the new
   site going live and the old one being deleted in one sweep.

## The quality floor

A View is presentation-only and stays that way: no direct product-data
access, no bypassing the frontend API and services-api boundaries, no
business logic pulled into page components.

Changes are the smallest edit that satisfies the task. Existing props
and behavior are preserved unless the task requires a contract
change; when the prop surface changes, the contract updates with it;
when a new visible state is needed, a fixture is added for it.

Every change is checked by the agent on a rendered page, not assumed
from a file read, at 390 width then 1440 width (the R3 emulate
method, never `resize`). A production build should finish with exit
code 0.

## Process lives separately

How work gets done, branch and commit rules, what may be edited,
verification, escalation, model lanes, and the session rule are
`docs/PROJECT-INSTRUCTIONS.md` and `CLAUDE.md`'s job, not this
document's. This file and `docs/DESIGN-TOKENS.md` cover the product
and the design language; the other two cover craft and process.
