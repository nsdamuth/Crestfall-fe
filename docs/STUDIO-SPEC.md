# STUDIO-SPEC v1.0.0, written 10 Aug 2026, branch design/studio-spec, planning gate only

The build spec for the Studio destination: the create hub with quick
create, the advanced editor page, and the Vault path into it. Planning
gate only; this gate writes this file plus `docs/CONTRACT-REQUESTS.md`
entries and no product code. Every claim about repo state below was
verified against a file read in this session, on this branch (cut from
origin/design/kit-fill, so the three new kit packages are readable).

Relationship to standing documents:

- This spec executes Sprint H wave H5's slot under new rulings from
  Brian (section 1) that settle Sprint H OPEN item 40 with a specific
  shape and close CR-007 and CR-008 as design questions. Where this
  spec and `docs/SPRINT-H-PLAN.md` section 5.8 differ, this spec
  governs.
- `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 4.4 described advanced mode
  as "a picker modal selects any asset ... the page then becomes its
  full editor". The ruling in section 1 supersedes that wording: the
  advanced editor is its own page, not a state of the Studio page.
  The product model's next reissue should fold this in.
- The Sprint H standing header (`docs/SPRINT-H-PLAN.md` section 5)
  binds every brief in section 8: no render-verification steps, no
  edits to the four shared docs, tokens only, LOOM shape, contract
  law, no em dashes, build exit 0, manifest echo, "Rows and
  amendments for H6" block.

## MANIFEST of this spec

1. The rulings this spec builds on (section 1).
2. The field-split source, named and applied stop by stop (section 2).
3. Surface one: quick create on the Studio page (section 3).
4. Surface two: the advanced editor page (section 4).
5. The Vault path (section 5).
6. Kit consumption (section 6).
7. Contract requests filed and updated at this gate (section 7).
8. The build briefs, parallelism, and session estimate (section 8).
9. Unresolved items, listed not guessed (section 9).

## 1. The rulings (Brian, 10 Aug 2026, do not reopen)

1. **Studio ships TWO surfaces.** Quick create lives on the Studio
   page with the main fields and ends with a CTA into the advanced
   editor. The advanced editor is its own optimized page carrying ALL
   fields, built for editing saved work as much as creating new, and
   fully mobile optimized at 390, not desktop only.
2. **Single path from the Vault.** Opening a saved asset from the
   Vault popup goes straight to the advanced editor. No fork, no
   choice dialog.
3. **The seven-stop creator is the quick-create foundation.** The
   existing seven-stop creator modal launched from /studio/create
   (`components/studio/create/character/creator-stops/`, stops: name,
   kind, face, silhouette, heart, seal, payoff) is reused and
   extended, never rebuilt.
4. **The field split is already defined.** The quick vs advanced
   split comes from the repo's existing allocation document
   (section 2). No split is invented here.

What these rulings settle elsewhere: Sprint H OPEN item 40 resolves
in the direction of its option A (one full edit surface) with the
added shape that the editor is its own page; CR-007 and CR-008 close
as design questions (section 7). Sprint H OPEN item 41 is not
reopened: the allocation is applied as written, including its two
flagged QUICK placements (section 9, item 4).

## 2. The field split: source and application

### 2.1 The source document

The split is the **Character allocation (ruled 9 Aug 2026)** section
of `docs/APP-FUNCTION-INVENTORY.md`. It is the only document in this
repo that breaks fields out into a pared-down set and an advanced
set explicitly: **QUICK** ("appears in quick create and in the
editor") and **ADVANCED** ("editor only"), row by row, tracing all
105 source rows of `docs/APP-FUNCTION-MAP.csv` for the Character
create and edit flows. `docs/SPRINT-G-PLAN.md` section 2 and
`docs/SPRINT-H-PLAN.md` section 5.8 both cite it as the standing
allocation, and CR-026 names it as the allocation Nick later reviews.
No file named "feature matrix" exists in the repo; this allocation is
the unique document matching that description, and this spec plans
from it.

Scope limit carried from the source: the allocation covers Character
(and the Character-like types that share its edit sections). Other
asset types have no allocation yet because their edit-flow rows are
not inventoried (the source's own "Template pattern note"). This spec
therefore plans Character quick create only; other types are
section 9 items, not guessed here.

### 2.2 Applying the allocation to the seven stops

The allocation was written against the five-step CharacterCreator
rows plus the standalone editor rows. The seven-stop creator carries
the same underlying fields under its own stop grouping (verified
field by field this session against `CharacterCreatorModal.jsx` and
each stop View). Disposition of every field the seven stops render
today, plus the two QUICK fields they are missing:

**name stop.** Name (QUICK), Title (QUICK), Use Template secondary
panel (QUICK). Unchanged.

**kind stop.** Species and Custom Species (QUICK) stay. Leave for
the editor: Gender Presentation and Custom Gender Presentation
(ADVANCED), Role archetype and its custom field (`shortConcept`,
rendered with the label "Role archetype", the allocation's ADVANCED
row), the Typing and zodiac fold (MBTI, Western zodiac, East Asian
zodiac; ADVANCED).

**face stop.** Skin Tone, Eye Color, Hair including the more-hair
fold (length, texture, style), Ethnic Appearance: all QUICK
(appearance group). Unchanged.

**silhouette stop.** Kibbe-Inspired Body Identity, Body Type,
Height, Build, Proportions, Custom Body Notes, Clothing Style and
Default Clothing (mode, outfit, wardrobe): QUICK, stay. Leaves for
the editor: Appearance Notes (ADVANCED, the allocation's named
Advanced list). Chest/bust stays in place unallocated: it has no
allocation row (section 9, item 1).

**heart stop.** Outward Personality, Internal Personality, Speech
Style, Verbosity, Interests, Philosophy: QUICK, stay. Movement Style
is QUICK in the allocation but missing from the seven-stop form
state; quick create ADDS it beside Speech Style (frontend field now,
schema catch-up rides CR-001). Leave for the editor: the heart
advanced fold's contents (Greeting, Scenario, Backstory,
Relationship to Player, Personality Notes; all in the allocation's
named Advanced list) and Voice Modules (ADVANCED).

**seal stop.** Age (QUICK) stays. Default Rendering Style is QUICK
in the allocation but missing from the seven-stop form; the seal
stop ADDS it (frontend field now, schema catch-up rides CR-002).
Leave for the editor: Visibility, Content Rating, Character Color
Palette (all ADVANCED). Removed fields keep their form-state keys
and defaults (PRIVATE, SFW, CRESTFALL_DEFAULT) so the save payload
shape does not change.

**payoff stop.** The character preview panel and draft summary
(QUICK, the image payoff) and the Continue-into-a-story panel stay.
Leave for the editor: the "Advanced directives" section (Creator
directives, Extra runtime notes). Extra Runtime Notes is a literal
row in the allocation's named Advanced list; Creator directives sits
under the same section Nick himself labeled "Advanced", which is the
allocation's own "Named Advanced by Nick's own UI" rule. The payoff
stop gains the ruled CTA into the advanced editor (section 3.3).

**Form-state law for every removal.** A field leaving quick create
leaves the UI only. Its key stays in `INITIAL_FORM_STATE` with its
default, so `buildSaveCreationPayload` emits the same shape and the
save path contract does not change. The editor is where the field
gets its surface.

## 3. Surface one: quick create on the Studio page

### 3.1 The Studio hub (/studio/v2/studio)

The fixture-driven create hub on the ruled ladder layout
(`docs/BUILD-BLUEPRINT.md` 3.1 row 6: levels, doors, tool cards,
story bridge strip per the proof), composed per `docs/SPRINT-G-PLAN.md`
section 2: `studio-page` shell, `modal-frame` where modals open,
`creation-card` where cards fit, `badge` for own-work visibility,
`promo-banner` bottom treatment routing to /studio/v2/images.
KitAlertStrip neutral tone carries the hub's explainer strip (the
sanctioned `.stripinfo` lineage) and the submission-hub presentation
(Public and Canon submissions begin here; honest fixtures only,
CR-014 and CR-027 stay non-blocking).

Doors: the Character door opens quick create (3.2). Every other
type's door renders quiet with the standing Soon treatment until its
type gets an allocation pass (section 9, item 2). No door routes to
an old-system page from a v2 surface.

### 3.2 Quick create: the extended seven-stop creator

The hub's Character door opens `CharacterCreatorModal` as today's
modal, R4-conformant at 390 (the creator's own shell already
maximizes on phone; it is kept, not rehosted into KitModalFrame,
because the ruling forbids a rebuild and the shell predates the kit
frame; conformance is judged against 2.16(p), not re-plumbed).

The extension, all inside `creator-stops/`:

- **A `fieldScope` input on the shell**, `"full" | "quick"`, default
  `"full"`. Default renders exactly today's field set, so the legacy
  /studio/create hub, which imports this same modal, is pixel-stable
  under the strangler law. The v2 hub passes `"quick"`, which renders
  the section 2.2 QUICK set. Additive prop, no removal, no rename.
- **Field recipes convert to the kit.** Text and textarea fields to
  KitFormField (label, helper, error, counter slots per 2.8); the
  template panel, outfit and wardrobe pickers, and any select-shaped
  chooser that is picker-shaped to KitPickerModal per 2.9; the save
  error strip to KitAlertStrip danger tone with words. Conversion is
  presentation only: every control keeps reporting the same value to
  the same handler (`updateField` keys unchanged), per contract law.
  A control that cannot map without a handler change stops that unit
  and escalates.
- **Two QUICK fields added**: Movement Style (heart stop) and
  Default Rendering Style (seal stop), per section 2.2, both as
  KitFormField selects, both new keys in `INITIAL_FORM_STATE` riding
  the existing `data` blob; CR-001 and CR-002 carry the backend
  schema catch-up and stay Nick's.

### 3.3 The CTA into the advanced editor

The payoff stop ends quick create with the ruled CTA: **"Save and
open the advanced editor"**, rendered in both field scopes. It runs
the existing `persistCreation` guard (first save creates, later
saves update the same `creationId`), and on a confirmed save routes
to `/studio/v2/editor/[id]` with the saved creation id. On save
failure the KitAlertStrip error renders and no navigation happens.
Finish and Save, Save, and the discard guard all keep their current
behavior.

## 4. Surface two: the advanced editor page

### 4.1 Address and shape

`/studio/v2/editor/[id]`, its own page, with the auth-free preview
mirror at `/dev/ui-preview/editor-v2-page`. It is not one of the
nine destinations; it is the edit surface Studio and Vault both
route into, which is why it sits beside the nine rather than under
`/studio/v2/studio/**` (disjoint file sets are what let the hub and
the editor build in parallel). Cutover renames addresses in one
sweep, so this address is an engineering seat, not a user promise.

### 4.2 Composition: rehost, then absorb

The one full edit surface, per the ruling and the closed CR-008
gap, built in two moves:

1. **Rehost.** The page carries the standalone editor's full
   function by consuming the existing edit-section components and
   ViewModels (`components/studio/my-creations/edit/sections/**`,
   `creation-edit-shell` lineage) read-only, inside a new
   v2-optimized shell: section navigation, media panel, and the
   sticky action bar (save, cancel, publish states) carried whole.
   The sections' contracts must not change; an apparent need to
   change one stops that unit and escalates, the Adventure-builder
   rehost precedent exactly. Section order is Nick's real order
   (`CHARACTER_EDIT_SECTIONS`): Overview, Identity, Appearance,
   Visual References, Body, Behavior, Mechanics Profile, Runtime
   Modules, Advanced, Publishing, Danger Zone, with media panel and
   action bar as persistent chrome.
2. **Absorb.** The create-only fields gain their first edit
   surfaces, closing the CR-008 gap: a Body detail section (Kibbe
   identity, Body Type, Height, Build, Proportions), a Behavior
   detail section (Outward and Internal Personality, Speech and
   Movement Style, Interests, the typing and zodiac frameworks,
   Voice Modules), and the Advanced Prompting section (enable
   toggle plus the nine guidance sections with per-section counters
   and the 32,000-character combined budget, per 2.8's fold and
   counter anatomy). These are new packages, built on KitFormField
   and KitPickerModal from the start, seated in the editor page
   tree, feeding the same `data` keys the creator writes.

Mobile at 390 is a first-class requirement of the new shell: single
column, section navigation reachable by thumb, no horizontal
overflow, the sticky action bar inside the R4 grammar. The existing
sections render inside that shell as they are; their own field-level
kit conversion is a later sweep, listed in section 9 item 5, not
smuggled into this build.

### 4.3 Data honesty

Fixture-first per the CR-017 mock-module pattern: one named mock
module resolves `[id]` to a saved-creation fixture carrying the full
field set (quick and advanced), pending CR-031 (section 7), which
specifies the real read path and the update-in-place write. Live
persistence through the existing creation client stays wired where
it already works; nothing is simulated. Generation stays an honest
stub.

## 5. The Vault path

The Vault v2 page's asset detail popup gains the ruled single edit
path: own-work items show an Edit action that routes straight to
`/studio/v2/editor/[id]`. No fork, no choice dialog.

Two touches, one brief:

- **KitAssetDetailPopup** gains an optional `onEdit` callback (and
  nothing else), rendered as an action only when provided, so
  Community and every non-owner context is pixel-stable. Additive
  optional prop, contract 2.1.0 to 2.2.0 in the same commit with
  fixtures (own-work fixture passes it, others omit it). This is the
  compatible-addition mechanism `docs/FRONTEND-SOP.md` section 5
  sanctions, executing a ruled behavior, not a redesign deciding a
  contract.
- **The Vault v2 page** passes `onEdit` for `isOwn` items, routing
  to the editor with the item's id. The CR-007/CR-008 partial hold
  noted in `app/studio/v2/vault/` lifts: those CRs are now ruled
  (section 7).

## 6. Kit consumption

Verified on this branch this session, all consumed unmodified except
the one ruled addition in section 5:

| Package | Contract | Used for |
|---|---|---|
| KitFormField | 1.0.0 | every quick-create field conversion, the two added QUICK fields, all absorption-section fields |
| KitPickerModal | 1.0.0 | template panel, outfit and wardrobe pickers, voice-module picker (editor side), any picker-shaped chooser |
| KitAlertStrip | 1.0.0 | save errors (danger), submission states (per tone, with words), hub explainer strip (neutral) |
| KitModalFrame, KitStudioPage, KitPromoBanner, KitCreationCard, KitBadge, KitDropdown, KitLoadMore | as shipped | hub composition per Sprint G section 2 |
| KitAssetDetailPopup | 2.1.0 to 2.2.0 | the Vault edit path (section 5), the spec's only contract change |

## 7. Contract requests at this gate

Filed or updated in `docs/CONTRACT-REQUESTS.md` in this gate's
commit:

- **CR-031, filed (new).** The advanced editor's full-field read and
  update path: opening a saved creation by id must return the
  complete creator-written field set (the `data` blob including
  body and behavior detail and Advanced Prompting), and
  update-in-place on that same record must be provable end to end
  (today it is unproven, the old CR-007 check (c) and CR-005
  transport caveat). Names the interim mock module and its single
  deletion.
- **CR-007, updated.** The design question is ruled: the single
  reopen path is Vault popup to the advanced editor page; the
  seven-stop creator stays the create-only quick path with a
  post-save CTA into the editor. What remains open is the
  update-in-place proof, which moves to CR-031; owner moves from
  Brian to Nick accordingly.
- **CR-008, updated.** Ruled: the advanced editor page is the one
  full edit surface; the missing edit surfaces are built by the
  absorption sections (section 4.2). Closes as a question, tracked
  as build.
- **CR-001 and CR-002, noted.** Quick create adds Movement Style
  and Default Rendering Style frontend-side per the QUICK
  allocation; the schema catch-up each CR describes stays Nick's
  and stays non-blocking.

Not escalated to Nick, per the standing rule: CR-026 (his promotion
pass over the allocation) and CR-014 and CR-027 (visibility and
rating data) remain later passes; everything here builds
fixture-first to the furthest point without him.

## 8. The build briefs

Five briefs, S1 to S5. Two lanes, at most two sessions at once.
Every brief binds to the Sprint H standing header
(`docs/SPRINT-H-PLAN.md` section 5): no render-verification steps,
no shared-doc edits, "Rows and amendments for H6" block in every
report. All branches cut from the integration line Brian designates
(default: this branch's lineage, which carries the kit fill).

**Parallel and serial:**

- Slot 1: S1 and S3 run in parallel (disjoint file sets).
- Slot 2: S2 and S4 run in parallel (disjoint file sets; S4 requires
  S3 finished because they share the editor tree).
- Slot 3: S5 runs alone after S3 (it routes into the editor page).
- Serial inside lanes: S1 then S2 (lane A); S3 then S4 (lane B).

**Session estimate:** S1: 1. S2: 2. S3: 2 to 3. S4: 1 to 2. S5: 1.
Total **7 to 9 sessions**, wall-clock roughly **4 to 5 slots** on
two lanes.

### 8.1 Brief S1: the Studio hub

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
STUDIO BUILD S1: the Studio hub. Branch design/studio-hub off the
designated integration line. Read docs/STUDIO-SPEC.md sections 1, 2,
3, 6, 8 first; docs/SPRINT-H-PLAN.md section 5's standing header
binds this brief. Also read docs/SPRINT-G-PLAN.md section 2 and
docs/BUILD-BLUEPRINT.md 3.1 row 6, 2.11, 2.16(p). File set:
app/studio/v2/studio/**, app/dev/ui-preview/studio-v2-page/. Do NOT
touch components/studio/create/character/creator-stops/** (that is
S2's file set, running in parallel).

MANIFEST
1. Build /studio/v2/studio as the fixture-driven create hub on the
   ruled ladder layout (levels, doors, tool cards, story bridge
   strip), studio-page shell, bottom promo banner routing to
   /studio/v2/images.
2. The Character door opens the existing CharacterCreatorModal
   (import it read-only from
   components/studio/create/character/creator-stops/) passing
   fieldScope="quick". S2 adds that prop in parallel; until it
   lands the modal ignores it and renders its full set, which is
   correct integration behavior, not a bug to fix here.
3. Every other type's door renders quiet with the standing Soon
   treatment; no door routes to an old-system page.
4. Submission-hub presentation (Public and Canon begin here) with
   KitAlertStrip, honest fixtures only; the hub explainer strip is
   KitAlertStrip neutral tone.
5. Full LOOM page set: contract, fixtures (default, empty, longest
   content), README, and the auth-free mirror at
   /dev/ui-preview/studio-v2-page.
6. Any composition question the spec and the read documents do not
   settle: STOP that unit and report it. Never improvise.
7. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, each item DONE or STOPPED with the reason.
- Rows and amendments for H6: one row per control, keyed to
  /studio/v2/studio; the parity echo against Studio's assigned CSV
  rows (Present, Deliberately excluded with the ruling cited, or
  Flagged for Brian).
- Files created.
```

### 8.2 Brief S2: quick-create alignment

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
STUDIO BUILD S2: quick-create alignment of the seven-stop creator.
Branch design/studio-quick off the designated integration line. Read
docs/STUDIO-SPEC.md sections 1, 2, 3 first; docs/SPRINT-H-PLAN.md
section 5's standing header binds this brief. Read every file in
components/studio/create/character/creator-stops/ before editing
any. File set: components/studio/create/character/creator-stops/**
and app/dev/ui-preview/creator-stops/. Do NOT touch
app/studio/v2/** (S1's and S3's file sets, running in parallel).

MANIFEST
1. Add a fieldScope input to CharacterCreatorModal:
   "full" | "quick", default "full". Default renders exactly
   today's field set (the legacy /studio/create hub must be
   pixel-stable). "quick" renders the QUICK set per
   docs/STUDIO-SPEC.md section 2.2, stop by stop. Removed fields
   keep their INITIAL_FORM_STATE keys and defaults so the save
   payload shape is unchanged.
2. Add the two missing QUICK fields: Movement Style (heart stop)
   and Default Rendering Style (seal stop), new form keys riding
   the existing data blob, in both scopes. Note CR-001/CR-002 in
   the README, do not touch backend schema.
3. Convert field recipes to the kit, presentation only: text and
   textarea fields to KitFormField; the template panel and the
   outfit and wardrobe pickers to KitPickerModal; the save error to
   KitAlertStrip danger tone. Every control keeps reporting the
   same value to the same handler. A control that cannot map
   without a handler change: STOP that unit and report it.
4. Add the payoff-stop CTA "Save and open the advanced editor",
   both scopes: persistCreation first, navigate to
   /studio/v2/editor/[id] only on a confirmed save; on failure the
   error strip renders and nothing navigates. (S3 builds that
   route in parallel; a dead link in the interim is expected and
   is not worked around.)
5. Update CreatorStops fixtures and the creator-stops preview
   route to cover both scopes and the CTA states; README updated
   in the same commit.
6. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, each item DONE or STOPPED with the reason.
- Rows and amendments for H6: the create-flow row deltas (fields
  now quick-scope-only vs both, the two added fields, the CTA
  row), listed against the /studio/create/character rows.
- Files touched, one-line reason each.
```

### 8.3 Brief S3: the advanced editor shell

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
STUDIO BUILD S3: the advanced editor page, rehost move. Branch
design/studio-editor off the designated integration line. Read
docs/STUDIO-SPEC.md sections 1, 4, 6 first; docs/SPRINT-H-PLAN.md
section 5's standing header binds this brief. Read
components/studio/my-creations/edit/creationEditConstants.js and the
creation-edit-shell package before composing. File set:
app/studio/v2/editor/**, app/dev/ui-preview/editor-v2-page/. Do NOT
touch components/studio/my-creations/** (consumed read-only) or
app/studio/v2/studio/** (S1's file set, running in parallel).

MANIFEST
1. Build /studio/v2/editor/[id] as the one full edit surface:
   a new v2 shell carrying section navigation in Nick's real order
   (CHARACTER_EDIT_SECTIONS), the media panel, and the sticky
   action bar as persistent chrome, consuming the existing edit
   section components and ViewModels read-only. Their contracts
   must not change; an apparent need to change one STOPS that unit
   and escalates.
2. Mobile first at 390: single column, thumb-reachable section
   navigation, no horizontal overflow, action bar inside the R4
   grammar; fully functional at 1440.
3. Resolve [id] fixture-first: one named mock module (header
   comment: mock, pending CR-031) returning saved-creation
   fixtures with the full field set; live persistence through the
   existing creation client where it already works; generation and
   anything unproven stays an honest stub.
4. Full LOOM page set: contract, fixtures (character default,
   non-character type, empty sections, longest content), README,
   and the auth-free mirror at /dev/ui-preview/editor-v2-page.
5. Leave clear seats (named slots, no placeholder UI) where S4's
   absorption sections will mount; document each seat in the
   README.
6. Any composition question the spec does not settle: STOP that
   unit and report it.
7. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, each item DONE or STOPPED with the reason.
- Rows and amendments for H6: one row per control, keyed to
  /studio/v2/editor; the parity echo against the standalone
  editor's CSV rows (each Present via rehost, Deliberately
  excluded with the ruling cited, or Flagged).
- Files created.
```

### 8.4 Brief S4: the absorption sections

1. Engine: Sonnet.
2. Effort: high.
3. Permission mode: acceptEdits.

```text
STUDIO BUILD S4: the absorption sections. Runs only after S3 has
landed on its branch (same file tree). Branch: continue on
design/studio-editor, or design/studio-editor-absorb stacked on it.
Read docs/STUDIO-SPEC.md sections 2, 4.2, 6 first;
docs/SPRINT-H-PLAN.md section 5's standing header binds this brief.
File set: app/studio/v2/editor/** only. Do NOT touch
components/studio/my-creations/** or the creator-stops package.

MANIFEST
1. Build three new editor sections in S3's named seats, on
   KitFormField and KitPickerModal, feeding the same data keys the
   seven-stop creator writes:
   a. Body detail: Kibbe-Inspired Body Identity, Body Type, Height,
      Build, Proportions.
   b. Behavior detail: Outward Personality, Internal Personality,
      Speech Style, Movement Style, Interests, MBTI, Western
      zodiac, East Asian zodiac, Voice Modules (picker).
   c. Advanced Prompting: enable toggle plus the nine guidance
      sections with per-section counters and the 32,000-character
      combined budget, per BUILD-BLUEPRINT 2.8 fold and counter
      anatomy.
2. Each section is a full LOOM package (View, ViewModel, contract
   v1.0.0, fixtures including empty and at-limit, README) inside
   the editor tree.
3. Update the editor page fixtures and preview mirror to render
   all three sections; README updated in the same commit.
4. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, each item DONE or STOPPED with the reason.
- Rows and amendments for H6: one row per new control, keyed to
  /studio/v2/editor; note that these rows close the CR-008
  create-only gaps, citing the fields.
- Files created and touched.
```

### 8.5 Brief S5: the Vault path

1. Engine: Sonnet.
2. Effort: medium.
3. Permission mode: acceptEdits.

```text
STUDIO BUILD S5: the Vault edit path. Runs after S3 has landed.
Branch design/studio-vault-edit off the designated integration
line. Read docs/STUDIO-SPEC.md sections 1, 5 first;
docs/SPRINT-H-PLAN.md section 5's standing header binds this brief.
File set: app/studio/v2/vault/**,
components/kit/asset-detail-popup/**. Nothing else.

MANIFEST
1. KitAssetDetailPopup: add optional onEdit callback, rendered as
   an Edit action only when provided; contract 2.1.0 to 2.2.0 in
   the same commit; fixtures updated (own-work fixture passes it,
   every other fixture omits it and is pixel-stable); README
   documents the addition and the ruling behind it.
2. Vault v2 page: pass onEdit for isOwn items, routing to
   /studio/v2/editor/[id] with the item's id. Non-own items get no
   edit affordance. Remove the CR-007/CR-008 hold comments, citing
   the ruling in docs/STUDIO-SPEC.md section 1.
3. Update Vault fixtures so at least one own and one non-own item
   exercise both popup states.
4. Production build exit 0. Commit, push.

REPORT
- MANIFEST echo, each item DONE or STOPPED with the reason.
- Rows and amendments for H6: the popup contract bump note, the
  Vault edit-action row, the CR-007/CR-008 status lines.
- Files touched, one-line reason each.
```

## 9. Unresolved, listed not guessed

1. **Chest/bust (silhouette fine-tune fold)** has no row in the
   Character allocation (the allocation's source flow did not carry
   it). It stays where it is, in both scopes, until an allocation
   ruling places it. Flag, not a guess.
2. **Quick create for other asset types** (Story assembly first
   among them) has no field allocation; the inventory's own template
   pattern requires each type's edit rows inventoried before its
   split exists. Hub doors render Soon until then. Sequencing those
   passes is the next planning gate after this build.
3. **The Studio page's quick-create surface for non-Character
   types** therefore also ships as Soon doors; the ruled two-speed
   model is complete for Character only at the end of S1 to S5.
4. **Sprint H OPEN item 41** (the two flagged QUICK placements:
   appearance-step fields and Default Rendering Style) is applied as
   the allocation wrote it (both stay QUICK) per ruling 4's "the
   split is already defined". The flag itself stays recorded in
   `docs/APP-FUNCTION-INVENTORY.md` for Brian; nothing here
   re-argues it either way.
5. **Field-level kit conversion of the existing edit sections**
   (the rehosted my-creations sections still carry their own field
   recipes) is deliberately out of scope; it is a mechanical sweep
   candidate after S3/S4 land, roughly 2 to 3 sessions, and touches
   files this build consumes read-only.
6. **The editor's address at cutover** (whether /studio/v2/editor
   keeps its seat or folds under the Studio destination's final
   address) is a cutover-sequence question, ruled during cutover
   like every other address, blocking nothing now.
