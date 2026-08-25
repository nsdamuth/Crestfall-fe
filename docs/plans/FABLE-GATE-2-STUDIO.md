# Fable Design Gate 2: Studio Journey, Editor Redesign, Asset Popup, Images Landing

Plan-mode gate, 12 Aug 2026. Repo ~/dev/Crestfall-fe. Nothing here
executes; every wave is a draft for Brian's review. Silence is never
approval. This gate replaces reopened Ruling O3 and supersedes waves
E2-E9 of docs/plans/FABLE-GATE-PLAN.md. Rulings O1, O2, O4-O11 stand
ratified (option A each) and are consumed below as law. The chat plan
(C1-C6) stands untouched. Q1-Q3 (quick-create restyle waves) are not
superseded and keep their file sets; this gate's waves are disjoint
from them.

## Context

Brian's 12 Aug render review ruled the advanced editor reads as the
old product with new colors and reopened its information architecture.
Binding direction: a type-aware redesigned editor entered through Full
Studio via a vault-style picker onto a persistent editor page with an
asset switcher; quick-create modals for every type where quick
creation makes sense; Guided Build renamed and rebuilt as
assemble-a-Story; the asset detail popup reorganized around Edit/Play
primaries and top-line metrics; Images landing empty; WCAG dark-theme
contrast as a binding baseline; everything mobile-complete at 390.

## Branch and integration state (verified this session)

- Working tree clean. Current branch `design/k1-kit-field-system`
  (the manifest names `design/sprint-h-final`; that branch's tip is
  `8e0bcf7`, the ratified gate-plan doc commit).
- K1 (KitFormField 1.1.0, `ddbff1f`) exists only on
  `design/k1-kit-field-system`. E1 (SharedFields rebuild, `08e0a11`,
  verified: SHARED_FIELDS_VERSION 1.0.0, TextField maxLength fix, new
  SelectField/NumberField, O1/O4) exists only on
  `design/e1-sharedfields`. Neither is folded into
  `design/sprint-h-final`, and E1 is absent from the current branch.
- Prerequisite F0 below folds both before any wave runs.

## Binding constraints on every wave

- Tokens only (FRONTEND-SOP s17); token values LOCKED; missing token =
  STOP and report. LOOM five files + README + preview route on every
  package touched. Contract law s13: contract changes only as listed,
  version bump + fixtures in the same commit; ViewModel/data-flow
  surprises stop and escalate. Mobile first at 390 (single column, no
  overflow, 44px floor, R4 full-screen modals, R7 sheet headers, R3
  emulate verification at the sittings). Confirmation on every
  consequential CTA; destructive law (quiet ghost trigger, filled
  danger only inside the confirm step, never window.confirm). No em
  dashes. Never sed/awk on markup or CSS. No render steps inside
  waves; render sittings happen between waves at the checkpoints.
  Done = production build exit 0, zero new out-of-contract grep hits
  for touched files, function-map rows in the closing lane commit,
  report echoes the wave manifest part by part.
- NEW, this gate, binding on every wave: the Contrast Law of wave X1.
  Until X1 lands, its draft rules below apply as the working baseline.

## RESEARCH FINDINGS

### R1. Targeted web research (manifest item 5)

Editor IA for multi-type editors:
- Schema-driven field GROUPS rendered as tabs, with per-type
  conditional visibility, is the industry pattern (Sanity field
  groups + conditional fields; Contentful editor layouts; Payload
  tabs/group/collapsible). A type's editor is declarative registry
  data, not hand-coded dispatch. Tabs suit parallel unrelated groups;
  Baymard warns inline accordion forms obscure what will be saved.
- Save placement: NO mainstream system uses a floating bottom save
  bar. Live patterns: Shopify contextual save bar (TOP-anchored,
  appears only when dirty, Save + Discard); Sanity/Payload autosave
  with a quiet last-saved indicator plus a single loud Publish;
  Primer (one save button per form, never disabled).
  Sources: sanity.io/docs field-groups + conditional-fields +
  document-actions; contentful.com developers docs editor interfaces;
  payloadcms.com docs tabs + autosave; primer.style/ui-patterns/
  saving; polaris-react.shopify.com contextual-save-bar;
  baymard.com/blog/accordion-and-tab-design.

Asset-switcher patterns:
- Primary-detail is the canonical switch-without-leaving pattern:
  persistent selected state; detail titled by the selected item;
  when nothing is selected, show a short actionable "select an X to
  edit" empty state or auto-select the first item (PatternFly
  primary-detail; SAP Fiori list-detail). Carbon: empty states lead
  with what fills the space plus one direct action.
- Top-bar entity switcher as a breadcrumb-dropdown (sibling list,
  search when large, current item marked selected) is the
  Figma/GitLab pattern (Setproduct breadcrumbs); Sanity encodes the
  selected document in the URL so switches are deep-linkable and
  back-safe.

WCAG dark-theme contrast (the numbers the Contrast Law binds):
- 1.4.3 AA: 4.5:1 normal text, 3:1 large (>=24px / >=18.66px bold).
  Placeholder text is NOT exempt; disabled/inactive is.
  w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- 1.4.11 AA: 3:1 for UI component boundaries and states against
  adjacent colors; no rounding (2.999 fails); a boundary owes 3:1
  only when it is the SOLE identifier of the control; focus
  indicators owe 3:1; disabled exempt.
  w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- 1.4.6 AAA 7:1 is the stretch reference, not the baseline.
- Dark practice: elevation = lighter surface steps, shadows are
  near-invisible on dark; keep the brand hue, step the lightness
  (Material M3 tone-based surfaces); desaturate accents;
  practitioner ramp step ~5-8% luminance between adjacent surfaces
  (m2/m3.material.io dark theme + color system; design.google).

### R2. Studio + Images current state (crawl)

- Studio hub `/studio/v2/studio` is full LOOM, contract
  `STUDIO_VIEW_CONTRACT_VERSION "1.3.0"`
  (`app/studio/v2/studio/studio/Studio.contract.js:28`). Three tiers
  exist by name (studioContent.mock.js:9-31): I Quick Start, II
  Guided Build, III Full Studio, chosen by a page-local
  LevelSelector (tablist; stacks vertically at 390).
- Quick Start: five doors, four live (Character, Worlds->LOCATION,
  Looks->OUTFIT, Stories->ROOM_TEMPLATE), Player Character marked
  Soon. Door->opener wiring is a data table
  (useStudioViewModel.js:32-37).
- Guided Build opens NOTHING: one alert strip, "Guided Build is not
  open yet" (Studio.view.jsx:153-155).
- Full Studio: 11 tool cards, exactly ONE live, and it reopens the
  Quick Start Character modal (useStudioViewModel.js:86). Nothing on
  the hub reaches `/studio/v2/editor`; the editor's only entries are
  the Vault popup Edit CTA and the four quick creates' post-save
  "Keep editing" (all push `/studio/v2/editor/[id]?origin=`).
- The product knows 25 creation types
  (`lib/server/creations/constants.js:1-48`; display names in
  `lib/shared/presentation/terminology.js`). 4 have quick creates;
  all 25 have editor section sets. There is no WORLD type: the World
  quick create saves LOCATION.
- Images `/studio/v2/images` is a 759-line non-LOOM mockup with NO
  contract, VM, fixtures file, or README. It PREFILLS a character
  ("Vesper Ash") and a prompt on load (ImagesV2Mockup.jsx:266-269),
  so Generate starts enabled. Availability logic already exists
  (computeAvailability:219-247: renderable source + coins gate).
  Empty state exists but doubles as the over-filtered state; NO
  delete exists on the v2 page (delete lives only in the legacy
  library behind window.confirm,
  useCreationImageLibraryPageViewModel.js:329). Coins: cost 5,
  balance hardcoded 40; quick creates use a second currency
  ("tokens", cost 40). Mobile: 2-col grid at 390, creator rail
  hidden below 1100px, replaced by a fixed Create button opening an
  R4 modal.

### R3. Editor, asset popup, kit and field system (crawl)

- Editor contract `EDITOR_VIEW_CONTRACT_VERSION "1.2.0"`
  (`app/studio/v2/editor/editor/Editor.contract.js:1`); route
  `/studio/v2/editor/[id]?origin=`; type never in the URL, derived
  from the loaded form. Section registry: a 20-arm nested ternary
  (`creation-edit-shell/useCreationEditShellViewModel.js:79-121`)
  over 23 type flags; section arrays in
  `edit/creationEditConstants.js`; dispatch is 42 hand-written
  guards in a 714-line file (`CreationEditSectionContent.jsx`), all
  ~50 sections eagerly imported. The editor is type-aware in DATA
  (each type has its own section list) but not in PRESENTATION
  (every type renders the same flat pill nav + stacked panels).
  Defects: ITEM_REGISTRY `media` section has no dispatch arm
  (renders empty); `VISUAL_ASSET_EDIT_SECTIONS` + 3 section
  components are orphans; contract carries dead
  `isLoreDocumentSection`.
- Save bar: `creation-edit-sticky-action-bar` 1.0.0, a sticky
  bottom-4 floating card conflating visibility options, an inert
  emerald-literal Public toggle, review actions, Save, and status.
- Media panel `creation-edit-media-panel` 1.0.0 renders for EVERY
  type unconditionally; live bug: the chat-media branch renders a
  literal `...` (CreationEditMediaPanel.view.jsx:97); bg-black/45
  aside. E2-E9 never landed: the edit tree still carries 349
  bg-black/NN + 360 border-white/NN across 51 files.
- Asset detail popup: `components/kit/asset-detail-popup/` 2.3.0 on
  KitModalFrame modal (R4 full-screen at 390). Current order:
  carousel (media hard-capped at 4), badges (visibility), title,
  subtitle, creator, description, stat row MID-BODY, tags, credits,
  MediaLibrary block, then a footer grid of EQUAL buttons Like /
  Save / Share / [Edit] / Play. Opened from Vault (only caller with
  Edit), Stories, Community.
- Kit: 22 packages. modal-frame 1.1.0 (modal/sheet/viewer, R4+R7
  compliant, portal, circular 44px close), picker-modal 1.0.0
  (search + filter chips + rows/grid + load-more + sticky footer;
  single-select confirms on first tap; used by Story quick-create
  pickers), dropdown 1.1.0, form-field 1.1.0 (K1 landed: variants
  text/textarea/select/number, O1 resting preview, O4 counter).
  KitJsonEditor (old wave K2) was never built. NO asset switcher or
  vault picker exists anywhere; 18 single-purpose picker modals.
- E1 verified on `design/e1-sharedfields`: SharedFields on tokens,
  TextField maxLength fixed, SelectField + NumberField added, O1/O4
  mirrored. 62 files import SharedFields.

## CONTRAST LAW (draft to be ratified and landed by wave X1)

Computed against locked values (approximate; X1 ships the exact
matrix as a generated artifact):

- --ink on every surface: ~13-15:1. Passes AA and AAA everywhere.
- --ink-dim on surface-1..4: ~6-7:1. Passes AA.
- --ink-faint on surface-1/2: ~5:1 passes; on surface-4 (#2c271e)
  ~4.06:1 FAILS AA for normal text. Placeholders are not exempt.
  Resolution is ruling N6 below.
- Non-text 3:1 (1.4.11): --line-strong over surface-2 lands near
  3:1; --line ~1.9:1 and --line-whisper ~1.1:1 do not meet it.
  Adjacent surface steps are ~1.1:1. Consequence, written as
  checkable law in X1: a control whose ONLY identification is its
  boundary must use --line-strong or a redundant cue (fill delta
  plus label, icon, or state mark); --line-whisper and --line are
  legal only as decorative or redundant edges. Focus ring
  (--gold-ornament on --canvas) passes 3:1. Input beds keep
  --line-whisper edges legally because label + placeholder + focus
  ring identify the field; the law says so explicitly so sweeps do
  not "fix" them wrongly.
- Dark-brown-on-dark-brown separation resolves through the ramp per
  the M3 pattern already inherent in the token system: adjacent
  ramp steps are never load-bearing alone; meaningful separation =
  one-border-per-level plus surface step, per the editor redesign
  grammar below.

## THE DESIGN, one paragraph per surface

**Studio journey.** The hub keeps its three-tier selector and stops
being a dead end. Quick Start holds the quick-create doors (coverage
per ruling N3). Guided Build becomes the assemble-a-Story flow (name
per N4): pick a Character, a World, a Look (optional), a premise,
from existing assets via the creation picker, with inline
quick-create popups for missing pieces, ending at Play now / Keep
refining (the advanced Story editor); quick and advanced paths are
both always visible on the tier. Full Studio becomes the advanced
entry: one primary "Open the Editor" surface plus the tool-card
census regrouped as picker shortcuts; activating it opens the
vault-style creation picker and lands on the persistent editor.

**Advanced editor.** A redesigned, type-aware editor on a persistent
page. `/studio/v2/editor` (new index) renders the empty state
"Select a creation to edit" with the picker CTA; `/studio/v2/editor/
[id]` stays the deep-linkable address; the switcher swaps assets by
client navigation so the page never visibly reloads (Sanity
URL-encoding pattern). Header: asset art thumb, display-name title,
type eyebrow from the terminology map, visibility status chip, the
switcher trigger (breadcrumb-chevron opening the picker), and the
save treatment per ruling N2. Sections regroup per type into at most
five named groups (grammar in ED1; e.g. Story: Story / Cast & World /
Runtime / Publishing; Character: Identity / Body & Behavior /
Systems / Publishing), registry-as-data replacing the ternary and
the 42-guard dispatch; a Story's editor and a Character's editor
share bones but differ visibly in header identity, group names, and
each type's overview summary card. Fields: every input on the E1
SharedFields grammar (O1 resting fold, O4 counters), consistent
`--control-md` field beds, ONE border per nesting level on the
opaque surface ramp, no overlapping elements. The floating bottom
save bar is retired; visibility/review/canon move into the
Publishing group with confirm steps on Submit for Public/Canon
review and Unlist for Editing. Switching assets with unsaved changes
raises a confirm step (keep editing / discard and switch). Mobile at
390: single column, horizontally scrolling group tabs plus the O11
bottom-sheet section picker (ratified), R4-compliant picker.

**Asset detail popup.** Reorganized: metrics move to the top inline
with the visibility tag (one meta line over the art edge of the
body: badges + plays/hearts/saves, engagement-forward); like, save,
share become compact circular icon controls (44px hit targets) in
the header meta row; the footer becomes two pronounced primary CTAs,
Edit and Play (Edit shown only for own items, as today); the media
area becomes a bounded-height module (single-row thumb rail with a
"view all" tail into the image overlay / library) so any media count
never balloons the modal; every image and control fully clickable.
Media on Characters is ruling N5. Contract 2.3.0 -> 2.4.0 additive.

**Images.** The page lands EMPTY: no prefilled character, no
prefilled prompt, Generate dimmed until the existing availability
logic is satisfied by real user input; the library grid renders
placeholder tiles (KitArtPlaceholder grammar) until images exist;
delete exists on the v2 surface (card face + overlay) behind a kit
confirm step per the destructive law and returns the slot to
placeholder; a distinct no-results state separates over-filtering
from true emptiness. The page is LOOM-ified (its first contract).
Coin cost sits on the Generate CTA with a confirm sheet stating the
cost; the insufficient-coins state carries the natural top-up upsell
seat (fixture-fed, CR-048).

## EXECUTION WAVES

Lanes: X (cross-cutting), SW (shared picker), S (Studio journey),
ED (editor), K (kit), P (popup), IM (images), CL (close). Disjoint
file sets; order strict inside a lane. Sessions are Sonnet-sized.

### F0. Integration fold (prerequisite, not a build wave)
Merge `design/k1-kit-field-system` and `design/e1-sharedfields` into
the integration line (`design/sprint-h-final` or its successor
branch, Brian's call at GO), build exit 0. No design work rides F0.

### X1. Contrast law
- Files: `docs/DESIGN-TOKENS.md` (new "Contrast law" section),
  `docs/FRONTEND-SOP.md` (s2 checkable additions), a generated
  contrast matrix artifact in `docs/review-artifacts/`.
- Work: ratify the draft law above as checkable rules (which
  ink/surface pairs are legal for normal text, the sole-identifier
  boundary rule, the focus-ring rule, placeholder non-exemption);
  the matrix lists every locked ink/gold/status token over every
  surface with computed ratios and PASS/FAIL at 4.5 and 3.
- Contracts: none. Deps: none (first, everything cites it).
  Sessions: 1. Risk: low; N6 covers the one failing pair.

### SW1. Creation picker (the mini-vault)
- Files: `components/studio/creation-picker/**` (new LOOM package),
  `app/dev/ui-preview/creation-picker/**`.
- Contract: new 1.0.0. Composes KitPickerModal (grid layout, R4 via
  KitModalFrame): search, type filter chips (five vault buckets +
  More per ruling N7), recency sort, owned-creations list,
  per-item art thumb + title + type + visibility badge,
  single-select confirms on tap. Fixture-first with a named mock
  (pending CR-050 for the live owned-creations list).
- Fixtures: default, empty ("Nothing here yet" + create CTA),
  searching, no-results, error, longest, filtered-per-bucket.
- Deps: none. Sessions: 1. Risk: low; consumed by S1 and ED1.

### S1. Studio hub retier
- Files: `app/studio/v2/studio/**` (Studio.jsx, studio/*, mock),
  preview route.
- Contract: Studio 1.3.0 -> 1.4.0, additive: Full Studio pane gains
  `onOpenEditorPicker`; Guided Build pane gains the flow entry
  callbacks; Quick Start doors updated per N3 (door list is already
  data). Tier II renamed per N4 across level data and pane copy.
- Work: Full Studio pane rebuilt: primary "Open the Editor" door +
  the tool census regrouped as typed shortcuts that open the picker
  pre-filtered; Quick Start doors per N3; Guided Build pane presents
  the flow entry with quick/advanced paths both visible; hub wiring
  to SW1 and `/studio/v2/editor`.
- Fixtures: per tier, empty, longest.
- Deps: SW1, N3/N4/N7 picks. Sessions: 1-2. Risk: low-moderate; the
  hub is fully LOOM and door wiring is data-driven.
  CHECKPOINT after S1+S2: Studio journey render sitting.

### S2. Guided Story Build flow
- Files: `components/studio/create/guided-story/**` (new LOOM
  package), `app/dev/ui-preview/guided-story/**`, single wiring
  touch in `app/studio/v2/studio/Studio.jsx` (mount + open).
- Contract: new 1.0.0. An R4 modal flow on KitModalFrame: stops
  Cast (pick or quick-create Character), World (pick or
  quick-create Location), Look (optional), Premise (KitFormField),
  Assemble (summary + name), Done (Play now seat + "Refine in the
  editor" path). Inline quick-creates reuse the existing four
  creator modals whole (composition, no edits to Q-lane files);
  picker stops reuse SW1 filtered per type. Every stop shows both
  paths (pick existing / create new). Final save creates a
  ROOM_TEMPLATE draft via the same creationClient the Story quick
  create uses.
- Fixtures: each stop, empty-vault variants (nothing to pick),
  assembled summary, saving, error, longest.
- Deps: S1, SW1. Sessions: 2-3. Risk: the largest new surface; scope
  fenced to assembly + handoff (no field editing inside the flow
  beyond premise/name).

### S3. Quick-create coverage per ruling N3
- Files (option A): `components/studio/create/player-character/**`
  (new creator-stops package cloning the Character grammar with
  scope-trimmed stops), preview route, one door flip in
  `studioContent.mock.js`.
- Contract: new creator-stops contract for the added type(s),
  dotted family per T14 live-majority.
- Deps: S1, N3. Sessions: 1-2 per added type. Risk: low; the
  CreatorStops shell is shared and proven.

### ED1. Editor shell redesign (the O3 replacement)
- Files: `app/studio/v2/editor/**` (adds `page.jsx` index route,
  editor package), `components/studio/my-creations/
  creation-edit-shell/**`, NEW `components/studio/my-creations/
  editor-header/**` (asset identity + switcher + status + save
  seat), NEW `components/studio/my-creations/editor-save-bar/**`
  (treatment per N2), retirement of
  `edit/creation-edit-sticky-action-bar/**`, editor preview
  mirrors.
- Contracts: Editor 1.2.0 -> 2.0.0 (breaking: grouped type-aware
  nav model; `creationType` and `loadError` supplied; dead
  `isLoreDocumentSection` removed; mobile nav wired per ratified
  O11; index/empty state added; switcher callbacks). editor-header
  1.0.0 and editor-save-bar 1.0.0 new. Sticky action bar contract
  retired (recorded, not bumped). Section registry becomes DATA:
  per-type `{group, sections[]}` arrays in creationEditConstants
  plus one component map replacing the 42-guard dispatch.
  ESCALATION NOTE, explicit: the shell and dispatch files are
  marked read-only by the editor's own comments; this plan is the
  escalation and Brian's GO authorizes exactly the listed changes.
- Work: header (thumb, title, type eyebrow via terminology map,
  visibility chip, switcher opening SW1, save treatment per N2);
  grouped section nav (grammar: at most 5 groups per type; Story:
  Story / Cast & World / Runtime / Publishing; Character: Identity /
  Body & Behavior / Systems / Publishing; Location: Place / Runtime /
  Publishing; registries: Entries / Rules & Prompt / Publishing;
  default rule for remaining types: Content / Systems / Publishing);
  per-type overview summary card leads the first group;
  unsaved-changes confirm on switch; visibility/review/canon
  controls move into the Publishing group with confirm steps; the
  inert emerald Public toggle is retired (status reads through the
  chip and Publishing group); five existing entry callers keep
  working (`?origin=` preserved).
- Fixtures: empty-index, per-type nav for 5 representative types,
  dirty-switch confirm, loading, loadError, save
  idle/saving/saved/error, mobile sheet open, longest.
- Deps: F0 (needs E1), SW1, N1/N2 picks. Sessions: 2-3. Risk:
  HIGHEST of the gate: read-only files, a 2.0.0 contract, five
  callers. CHECKPOINT: Brian render sitting on the shell with two
  types (Character, Story) before ED2+ fan out.

### ED2. Editor media rail
- Files: `components/studio/my-creations/creation-edit-media-panel/**`,
  preview.
- Contract: 1.0.0 -> 1.1.0 (adds `isVisible` policy input per
  ruling N5's editor mirror; fixes the `...` literal bug by
  wiring ChatMediaSlot or removing it, whichever N5 implies).
- Work: retokenize (bg-black/45 and kin onto the surface ramp),
  responsive thumbs at 390, media rail renders only for visual
  asset types per N5.
- Deps: ED1. Sessions: 1. Risk: low.

### ED3-ED8. Section-family conversion under the new IA
Same sweep grammar in every wave: fields onto E1 SharedFields
primitives (TextField/TextAreaField/SelectField/NumberField,
O1/O4), one border per nesting level, opaque ramp only, hand-rolled
modals onto KitModalFrame, pickers onto KitPickerModal, badges onto
KitBadge, alerts onto KitAlertStrip, X1 contrast law applied,
missing version constants added, READMEs written. Every unit that
cannot map mechanically STOPS per the escalation law.
- ED3 Character family: `edit/sections/{character-*,
  creation-overview-section, creation-publishing-section,
  creation-danger-section, character-templates,
  visual-references-section}/**` +
  `components/studio/characters/advanced-prompting/**`. Danger zone
  onto kit confirms. Sessions: 2.
- ED4 Story family: `edit/sections/{room-templates, scenarios,
  storylines}/**` + narrator sections + the scenario story-circle
  (8 unlabelled textareas gain real labels). Sessions: 2.
- ED5 Locations: `edit/sections/locations/**` including both config
  modals onto KitModalFrame; TrackersModuleConfigModal tokenized in
  place and FLAGGED for later packaging. Sessions: 2.
- ED6a/ED6b Mechanics: composition-builder + command-resolution;
  then the remaining 20 module packages + runtime quick-nav.
  Sessions: 2 + 2.
- ED7a Lore / ED7b Profiles: lore family under standing ruling O8-A
  (mint the lore palette at its render sitting first); rules-codex,
  stats-pools, progression, actor-mechanics-profile. Sessions:
  2 + 2.
- ED8 Registries + wardrobe/outfit/pose/preset residuals + shared
  builders; fixes the ITEM_REGISTRY media dispatch gap and deletes
  the three orphan visual-asset section files +
  `VISUAL_ASSET_EDIT_SECTIONS`. Sessions: 2.
- Deps: ED1 checkpoint. The six waves are mutually disjoint and can
  run in parallel lanes.

### K2. KitJsonEditor (carried unchanged from the prior gate)
- Files: `components/kit/json-editor/**`, preview. Contract new
  1.0.0. Full-screen R4 modal, mono editor (CR-041-exempt),
  validate/apply row, error/success states with words.
- Deps: none. Sessions: 1. Risk: low.

### ED9. JSON editor consolidation
- The six JSON modal packages become thin wrappers over
  KitJsonEditor; wrappers keep contracts and validators.
- Deps: K2, ED5-ED7. Sessions: 1. Risk: low; ~1,500 duplicate lines
  collapse.

### P1. Asset detail popup reorganization
- Files: `components/kit/asset-detail-popup/**`, preview, the three
  call sites (`VaultV2Mockup.jsx`, `StoriesV2Mockup.jsx`,
  `CommunityV2Mockup.jsx`) only if props change.
- Contract: 2.3.0 -> 2.4.0, additive (`assetKind`-driven media
  visibility per N5; no prop removals expected).
- Work: metrics + visibility badges move to one top meta line;
  like/save/share become circular 44px icon controls; footer
  becomes Edit + Play primary pair (Play gold, Edit secondary
  pronounced; Play alone when no Edit); media module becomes a
  bounded single-row thumb rail with view-all tail into
  KitImageOverlay (removes the balloon risk; the slice(0,4) cap is
  replaced by rail + count); MediaLibrary tabs simplify onto the
  rail (Videos/Liked/Bookmarked stay honest per CR-035); every
  surface clickable with generous targets; X1 law applied.
- Fixtures: own-item (Edit+Play), community item (Play only), no
  media, many-media rail, canon, longest, per-N5 variants.
- Deps: N5. Sessions: 1-2. Risk: low-moderate; three consumers.

### IM1. Images landing
- Files: `app/studio/v2/images/**` (LOOM-ified: Images.jsx shell,
  images/ViewModel + View + contract + fixtures + README), preview
  route (exists).
- Contract: NEW images page contract 1.0.0 (the page has none
  today).
- Work: default state prefills NOTHING (no character, no prompt);
  Generate dimmed via the existing availability logic until a
  renderable subject exists; library grid renders placeholder tiles
  when empty; delete on card face + overlay behind a kit confirm
  (destructive law; wiring pending CR-047, honest stub until then)
  returning the slot to placeholder; distinct no-results state
  separate from true-empty; Generate confirm sheet states the coin
  cost; insufficient-coins upsell seat (fixture-fed, CR-048);
  mobile posture kept (2-col grid, R4 creator modal).
- Fixtures: empty-landing (new default), populated, loading, error,
  no-results, insufficient-coins, delete-confirm, longest.
- Deps: X1. Sessions: 1-2. Risk: low; logic mostly exists, the work
  is state design + LOOM-ification.

### CL1. Gate close
- Files: `docs/APP-FUNCTION-MAP.csv` rows for every control changed
  (Studio tiers, editor, popup, Images), `docs/CONTRACT-REQUESTS.md`
  filings (below), grep ledger before/after per s4 cadence, README
  and version-constant audit, em-dash count zero.
- Deps: all waves. Sessions: 1. Risk: none.

## OPEN FOR BRIAN

Seven rulings. Three options each, the starred option is pre-carried
into the waves above and swaps cleanly if another is picked. Nothing
here is resolved by this plan.

**N1. Editor information architecture** (replaces reopened O3; ED1)
RATIFIED 12 Aug 2026, option A.
- A (starred): type-aware grouped tabs: each type's sections regroup
  into at most five named groups (schema-as-data), horizontal group
  tabs with in-group section flow, per-type overview summary card,
  type identity in the header. Why: the industry pattern for
  multi-type editors (Sanity/Contentful/Payload), preserves every
  function, and makes a Story visibly not-a-Character. Cost: ED1's
  2-3 sessions + the family sweeps this gate already owes.
- B: bespoke hand-designed layout per type. Why not: 25 types;
  unbounded design and maintenance surface; the sweeps could never
  close.
- C: keep the flat pill nav and restyle only. Why not: fails the
  binding direction; it is exactly "the old product with new
  colors."

**N2. Save treatment** (replaces the floating bottom bar; ED1)
RATIFIED 12 Aug 2026, option A.
- A (starred): top-docked contextual save bar directly under the
  editor header, appears only when unsaved changes exist, Save +
  Discard + status word; publishing controls leave the bar for the
  Publishing group. Why: the one mainstream sanctioned bar pattern
  (Shopify); separates save from publish; zero backend change.
  Cost: inside ED1.
- B: persistent header Save (document-actions style, always
  visible top-right with status word). Why not: a permanently loud
  control for an action that is usually unavailable; Primer warns
  against disabled save buttons.
- C: autosave with quiet last-saved indicator + loud Publish only.
  Why not: requires autosave transport and debounce semantics that
  do not exist (a Nick CR and a data-flow change); honest cost is a
  wave blocked on backend.

**N3. Quick Start coverage** (S1/S3)
RATIFIED 12 Aug 2026, option A.
- A (starred): five doors: Character, Player Character, World,
  Look, Story. Player Character reuses the Character quick grammar
  (S3, 1-2 sessions). Everything else is Full Studio territory:
  registries, profiles, mechanics, codex, narrator, scenario, pose,
  preset, wardrobe are pro-density tools where a quick modal would
  be a worse editor, not a faster one. Why: matches the door row
  already designed (Player Character exists as Soon), zero new
  grammar.
- B: seven doors: A plus Narrator and Pose as creative-flavored
  quick creates (2 more S3-style waves). Why not: both types are
  parameter-dense with weak couch appeal; cost outruns use.
- C: keep today's four; remove the Player Character door. Why not:
  deletes a promised surface that is cheap to honor.

**N4. Guided Build name** (S1/S2)
RATIFIED 12 Aug 2026, option A.
- A (starred): "Build a Story". Why: says exactly what the flow
  does; the tier's own description already promises it.
- B: "Story Forge". Why not: brand-flavored but opaque to a new
  user; the tier label is a doorway, not a product name.
- C: keep "Guided Build". Why not: names the mechanism, not the
  outcome; Brian already flagged it.

**N5. Media module on Characters** (P1/ED2)
RATIFIED 12 Aug 2026, option A.
- A (starred): media stays on Characters AND Stories/Adventures,
  but as the bounded thumb rail (never the tall block); non-visual
  types (registries, profiles, mechanics, codex) drop it entirely,
  in both the popup and the editor media rail. Why: a Character's
  look is core product value (the Images page exists to keep
  characters on model); the rail removes the ballooning cost.
- B: media only on Stories/Adventures; Characters keep portrait
  only. Why not: hides the reference-image workflow from the type
  it serves most.
- C: remove the media module from the popup everywhere; media lives
  only in the editor and image overlay. Why not: strips the popup's
  richest engagement surface.

**N6. The failing contrast pair** (X1)
RATIFIED 12 Aug 2026, option A.
- A (starred): pairing law with zero token changes: --ink-faint is
  illegal for normal-size meaningful text on --surface-4; counters,
  placeholders, and timestamps inside modals use --ink-dim;
  --ink-faint remains legal on surface-1/2 and for large text.
  Why: passes AA everywhere immediately, no render risk, one grep
  rule.
- B: lighten the faint step by filling proposed ladder step
  --neutral-2 as the modal-legal faint ink at a render sitting.
  Why not: a new token value needs its own sitting and re-verifies
  every consumer; slower for the same outcome.
- C: accept large-text-only usage of --ink-faint on surface-4
  (3:1). Why not: counters and placeholders are 11-13px; the
  exemption would barely apply.

**N7. Creation picker scope** (SW1)
RATIFIED 12 Aug 2026, option A.
- A (starred): the picker lists ALL owned creations, filtered by
  the five vault buckets (Characters / Worlds / Looks / Stories /
  Adventures) plus a "More" bucket carrying the remaining pro
  types. Why: Full Studio must reach all 25 editable types or the
  editor entry is a regression; the bucket row keeps the common
  cases one tap away.
- B: five buckets only, pro types reachable only by search. Why
  not: hides ~20 types behind a typed query with no discovery.
- C: a full 25-type filter row. Why not: a chip row of 25 fails at
  390 and buries the five that matter.

## CONTRACT AND CR LEDGER

Version bumps: Studio 1.3.0 -> 1.4.0 (S1); Editor 1.2.0 -> 2.0.0
(ED1, breaking); creation-edit-media-panel 1.0.0 -> 1.1.0 (ED2);
KitAssetDetailPopup 2.3.0 -> 2.4.0 (P1). Retired:
creation-edit-sticky-action-bar 1.0.0 (ED1, recorded in its README).
New contracts at 1.0.0: creation-picker (SW1), guided-story (S2),
player-character creator-stops (S3, per N3), editor-header (ED1),
editor-save-bar (ED1), images page (IM1), KitJsonEditor (K2): 7.
Version constants added with no shape change: per ED3-ED8 audit
(the 14 mechanics + 5 character-stop constants carried from the
prior gate's count, landed in their family waves).

CR filings at execution: CR-047 v2 image delete (route/client
catch-up onto the legacy deleteImageOutput path, branded confirm
replaces window.confirm); CR-048 image monetization data (live coin
balance, generation pricing, top-up entitlements for the
insufficient-coins seat); CR-049 currency reconciliation (Images
spends "coins", quick-create previews spend "tokens"; one product
answer needed); CR-050 owned-creations list for picker surfaces
(SW1, Vault parity); conditional CR (only if N2-C): editor autosave
transport. Standing and untouched: CR-026, CR-031, CR-035, CR-036,
CR-041, CR-042, and the chat filings CR-043..046. Per the standing
rule nothing escalates to Nick mid-build; all CRs level-set at
cutover step 3.

## VERIFICATION (every wave and the gate)

Per wave: production build exit 0; out-of-contract greps
(DESIGN-TOKENS "Out of contract" + the new X1 checks) return no new
hits for touched files; fixtures exist for every listed state;
preview route loads. Between waves at the named checkpoints: render
sittings at 390 (R3 emulate method) then 1440, screenshots as
deliverables, QA-gate PASS/FLAG judgments. Gate close: CL1 re-runs
the full grep census and echoes every manifest part DONE or STOPPED.

## REPORT (one screen)

- **Waves:** 21 build waves (X1, SW1, S1-S3, ED1-ED2, ED3-ED8 as
  eight family units incl. the 6a/6b and 7a/7b splits, K2, ED9, P1,
  IM1, CL1) plus prerequisite F0; ~28-33 Sonnet sessions across 6
  parallelizable lanes.
- **Packages touched:** ~70 (1 Studio page tree, 2 new S packages,
  ~55 editor-reachable packages, 3 new editor packages, 1 kit new +
  2 kit bumped, Images page tree, popup + 3 call sites).
- **Contract bumps:** 4 bumps (one breaking: Editor 2.0.0), 1
  retirement, 7 new 1.0.0 contracts, 5 CR filings (one
  conditional).
- **Open rulings:** N1-N7 above, one starred each; plus 3 standing
  checkpoints (ED1 shell sitting, S1+S2 journey sitting, O8 lore
  palette sitting) and the F0 integration-branch call.
- **Biggest risks:** (1) ED1 rewrites files marked read-only and
  ships the gate's one breaking contract with five live callers;
  (2) the ~350 dark-fill + ~360 hairline conversions ride
  approximate mappings, a wrong mapping is a mass visual change,
  checkpoints guard; (3) S2 is a wholly new surface with no
  baseline, fenced to assembly-only; (4) the branch state (manifest
  names sprint-h-final, tree sits on k1; E1 unmerged) makes F0 a
  hard prerequisite; (5) picker and Images delete are fixture-first
  pending CR-050/047, honest stubs until Nick lands them.
- **Recommended order:** F0; then X1 + SW1 + P1 + IM1 in parallel;
  ED1 and S1 after SW1; render sittings after ED1 and after S1+S2;
  then S2, S3, and the ED3-ED8 families fan out (K2 anytime); ED9
  after K2 + families; CL1 closes the gate.
