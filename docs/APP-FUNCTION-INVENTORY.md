# App function inventory

What `docs/APP-FUNCTION-MAP.csv` is, how it is kept current, and the
findings from the 9 Aug 2026 enrichment pass. This document is a
companion to the CSV, not a replacement for it; the CSV is the row
level ledger, this file holds the analysis that does not fit in a
cell.

## What the CSV is

One row per control on a page: what it does, what component and
ViewModel/hook wire it, what it reads or writes, and its current
status. It is the map referenced by `docs/FRONTEND-SOP.md` section 13
(contract law) and section 14 (definition of done). Every feature
closes by updating the CSV. `docs/APP-FUNCTION-MAP.md`, a stale
duplicate rollup that claimed a generator script that never existed,
was deleted per Brian's 11 Aug 2026 ruling; the CSV is the live,
authoritative map.

## How it is maintained

- The map is regenerated at the start of every sprint (`FRONTEND-SOP.md`
  section 15), and any agent that adds or rewires a control updates its
  row in the same change.
- `status` is one of `working`, `stubbed`, `broken`, `gated`,
  `planned`. A row is only moved off `broken`/`gated` after the fix is
  verified against the code, the same way this pass verified the 15
  flagged rows below. `planned` (R5 improvement 4, ruled 29 Aug 2026)
  marks a control a ruling or CR names before any build exists, so
  parity echoes can see it; the row is created the moment the ruling
  lands and moves to `working` or `stubbed` in the build commit.
- Columns added in this pass (`max_length`, `required`, `default_value`,
  `destination_page`) follow the same rule as every other column: never
  guessed. See the value conventions below.

## Value conventions for the constraint columns

Added 9 Aug 2026, enrichment pass A. Apply only to rows whose
`page_route` is under `/studio/create/*` or
`/studio/my-creations/[id]/edit` (the create and edit flows named in the
brief):

- A real value (a number, an enum list, a literal) means it was found
  and confirmed in the cited source file(s).
- `none` means the code was read and confirmed to define no such
  constraint (including structural controls like buttons and links,
  which have no field constraint to report).
- `unknown` means the row is an actual form field but the constraint
  could not be verified from the reachable code in the time available.
  Exactly one row carries this: row 121 (`/studio/create/scenario`,
  middleware module toggle tiles), because the toggles proxy default
  Boolean state, not a length-bound field, and no schema file for them
  was found.
- Rows outside the create/edit scope carry
  `n/a (not a create or edit flow row)` in all three columns, so that
  "no constraint" and "out of scope" are never conflated.

Sourcing note: `lib/server/creations/constants.js` defines
`CREATION_TITLE_MAX` (140) and `CREATION_DESCRIPTION_MAX` (2000), and
`lib/server/creations/validateCreationPayload.js` enforces them. That
validator is only called from
`lib/server/services/creations/createOwnedCreationDraft.js` and
`updateOwnedCreationDraft.js`, and neither of those services is
imported by any `app/api` route in this repo; `app/api/creations/route.js`
proxies straight to an external backend instead. So this constraint
exists in the frontend repo but is not confirmed to be the live,
reachable schema for any create/edit flow, and enrichment pass A does
not cite it as a verified constraint for any row.

## Destination-page mapping (pass C)

`destination_page` assigns each route to its home in the ruled
nine-page model (`docs/CRESTFALL-PRODUCT-MODEL.md`): Play (Home,
Stories, Adventures), Create (Studio, Images, Vault), Explore
(Community, Creators, Lore). A route is only assigned when its
`page_purpose` maps cleanly to one destination; everything else is
`unassigned` for ruling.

Assigned:

| Route(s) | Destination |
|---|---|
| `/studio`, `/studio/create`, `/studio/create/*` (all 26 asset builders), `/studio/templates/characters` | Create > Studio |
| `/studio/image-studio`, `/studio/my-creations/[id]/image-library` | Create > Images |
| `/studio/my-creations`, `/studio/my-creations/[id]/edit`, `/studio/my-creations/[id]/preview` | Create > Vault |
| `/studio/community`, `/studio/creations/[id]` | Explore > Community |
| `/studio/profile`, `/studio/profile/[username]`, `/studio/profile/[username]/connections` | Explore > Creators |
| `/studio/story-rooms`, `/studio/story-rooms/[id]` | Play > Stories |
| `/studio/storylines` | Play > Adventures |

Unassigned, 117 rows across these routes, flagged for ruling because
`page_purpose` did not map cleanly to one destination:

- `/`, `/ (site shell)`: the public marketing/lore site root and its
  shared chrome. Not the same surface as the studio app's Play > Home;
  no ruling found that folds it in.
- `/characters`: public lore-archive character browsing. Could read as
  Explore > Community or Explore > Lore; the product model does not
  say which.
- `/login`, `/terms`, `/terms/[slug]`: auth and legal pages, outside
  the nine-page model entirely.
- `/stories`, `/stories/[...slug]`: described in the CSV as an
  "inserted-fiction archive," i.e. static narrative content, not the
  playable Stories surface. `/stories/[...slug]` is also the empty,
  broken file tracked at row 22.
- `/studio/* (studio shell)`: shared chrome, not a destination itself.
- `/studio/account` and its five subpages: account settings, outside
  the nine-page model.
- `/studio/feedback`, `/studio/submit-canon`: standalone workflow/CTA
  pages, not destinations in the model.
- `/studio/games`: "start official games, resume active sessions,
  browse curated playable rooms" overlaps with Play > Stories but the
  product model never uses the word "Games"; ruling needed on whether
  this is a duplicate surface or something else.
- `/studio/official-characters`: canon character roster browsing.
  Could read as Explore > Community or Explore > Lore.
- `/studio/play`: "Official canon-aware story session entry point
  (currently a placeholder)" per its own `page_purpose`; too
  undefined to place with confidence.

## Enrichment pass B: create-vs-edit field delta

Scope note before the findings: the CSV enumerates
`/studio/my-creations/[id]/edit` rows only for the shell chrome, the
universal sections (Overview, Publishing, Danger, Media panel), the
Mechanics Module quick-nav, and the sections marked "(Character-like
types)". It does not carry separate rows for Location-, Registry-,
Room Template-, Scenario-, or Storyline-specific edit sections. For at
least Location, this is because the create flow imports the exact same
section components the edit flow uses directly (see
`components/studio/create/location/location-builder/LocationBuilder.view.jsx`
using `components/studio/my-creations/edit/sections/locations/*`
view-models), so the two flows share the same UI and there is no
delta to report for that type from the CSV as it stands. A full
per-type delta for the other asset types would require enumerating
edit-flow rows the CSV does not currently have; that is a gap in the
inventory itself, not a product finding, and it is left open here
rather than guessed at.

The one type with enough rows on both sides to compare is Character
(and the "Character-like types" edit sections, which Character,
Player Character, and Narrator share).

### Present in edit, absent from create (Character)

- **Creation Type** (identity section): a read display of the fixed
  creation type; there is nothing to choose at creation time.
- **Visual references section**: Refresh Library / Choose / Clear, per
  reference card (Anime Reference / Realistic Reference). No
  equivalent exists in the create flow.
- **Actor Mechanics Profile attachment**: Attach/Replace Profile,
  Remove, Actor Attachment Notes. Not offered during creation.
- **Runtime mechanics modules**: Attach Mechanics Module, Remove,
  Enabled, Priority, Inheritance Mode, Mechanics Scope, per attached
  binding. Not offered during creation.
- **Set Default PC** (shell chrome, Player Character context): no
  equivalent in the create flow (also tracked as broken at row 717,
  since the status text this control depends on is computed but never
  rendered).

### Present in create, absent from edit (Character)

- **Body step detail**: Kibbe-Inspired Body Identity, Body Type,
  Height, Build, Proportions. The edit flow's body section carries
  only Custom Body Notes; these five fields have no editing surface
  once the character is created.
- **Behavior step detail**: Outward/Internal Personality, MBTI /
  Western Zodiac / East Asian Zodiac frameworks, Speech Style /
  Movement Style, Voice Modules, Interests. The edit flow's behavior
  section carries only Verbosity and Philosophy; the rest is
  create-only.
- **Advanced Creator Guidance / Advanced Prompting**: Enable Advanced
  Prompting and its nine sections (Core Identity, Voice & Verbal
  Texture, Relationship, Combat, Romance, Territory, Power Escalation,
  Profession & Domain, Portrayal Boundaries, up to 32,000 characters
  total, see row 283). No editing surface exists anywhere in
  `/studio/my-creations/[id]/edit`'s rows for this at all.
- **Character Template picker** (Use Template): create-flow only, by
  nature of being a starting point rather than an ongoing edit.

### Naming and structure drift worth flagging, not a clean absence

- Create's Appearance step has a field labeled **"Ethnic Appearance"**;
  edit's Appearance section has a field labeled **"Visual Heritage"**.
  Both sit in the same position in their respective flows and likely
  bind to the same underlying field, but the CSV does not confirm that
  and the labels differ. Flagged for verification, not assumed to be a
  rename.
- Create bundles clothing into one **"Default Clothing"** control;
  edit splits the same concern into **"Select Outfit" / "Select
  Wardrobe" / "Clear"**. Functionally overlapping, structured
  differently. Not counted as an absence on either side.

## Character allocation (ruled 9 Aug 2026)

Baseline: every Character row in `docs/APP-FUNCTION-MAP.csv` for
`/studio/create/character` (rows 245-284, 40 rows) and
`/studio/my-creations/[id]/edit` (rows 717-784, 68 rows), read against
the source components, not summarized from memory. Two edit rows are
excluded from the Character baseline because their own block scoping
excludes Character: row 724 ("Image Studio Ingredient / Storyline
Media info card," `for non-chat types` only, and Character is chat
capable) and rows 729-730 ("mechanics quick nav," `Mechanics Module
type, fields section only`). That leaves 40 create rows + 65 edit rows
= 105 source rows, deduplicated below wherever create and edit expose
the same underlying field.

Order correction found while reading source: the CSV's row grouping
for the edit flow is not the actual on-screen tab order. The real
order is `CHARACTER_EDIT_SECTIONS` in
`components/studio/my-creations/edit/creationEditConstants.js`:
Overview, Identity, Appearance, Visual References, Body, Behavior,
Mechanics Profile, Runtime Modules, Advanced, Publishing, Danger Zone.
Media panel and shell chrome render outside this tab list, as
persistent chrome (`mediaPanelProps` is built separately from section
content in `useCreationEditShellViewModel.js`); the sticky action bar
is confirmed persistent by its own CSV block name ("persists across
all sections"). The tables below use this real order, not the CSV's
incidental row grouping; that is a correction to reflect Nick's actual
order, not a proposed reorder.

The create flow's order is confirmed by
`CHARACTER_CREATOR_STEPS` in
`components/studio/create/character/character-creator/CharacterCreator.contract.js`:
Identity, Appearance, Body, Behavior, Review. The template picker
lives inside Identity (a trigger at the top of the step); Visibility,
Content Rating, Default Rendering Style, Age, Advanced Creator
Guidance, Advanced Prompting, and Draft Summary all live inside Review
(confirmed in `CharacterReviewStep.view.jsx` and
`ReviewStep.jsx`/`AdvancedPromptingEditor`).

Both flows' step-internal field order were spot-checked directly
against source (`IdentityStep.jsx`, `AppearanceStep.jsx`,
`BodyStep.jsx`, `BehaviorStep.jsx`, `CharacterReviewStep.view.jsx`,
`CharacterIdentitySection.view.jsx`, `CharacterAppearanceSection.view.jsx`,
`CharacterAdvancedSection.view.jsx`) and match the CSV's field order
within each step/section exactly.

One discovery worth flagging on its own: the create flow's "Advanced
Creator Guidance" toggle (row 281) is not just an expand/collapse UI
state, as pass B's row-281 read assumed. It reveals the same seven
fields as the edit flow's dedicated "advanced section" (row 769):
Greeting, Scenario, Relationship to Player, Backstory, Appearance
Notes, Personality Notes, Extra Runtime Notes (confirmed via
`useCharacterReviewStepViewModel.js`'s `advancedFields`, sourced from
`CHARACTER_REVIEW_ADVANCED_FIELDS` and the same `form.greeting` /
`form.scenario` / etc. keys the edit section reads). These fields are
not create-only or edit-only; they exist in both flows, already gated
behind a control Nick labeled "Advanced" in both places.

### QUICK (appears in quick create and in the editor)

**Template picker**

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Use Template | 251 | (none) |
| Built-In / My Templates / Community tabs | 252 | (none) |
| Search templates | 253 | (none) |
| Built-in template grid / Apply Template | 254 | (none) |

**Identity**

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Name / Character Name | 255 | 748 |
| Title / Character Title | 256 | 749 |
| Species (+ Custom Species) | 257 | 750, 751 |
| Age | 280 (Review step) | 753 |

**Appearance** (see needs-Brian-ruling item 1: the ruled pattern's
QUICK list does not name "appearance," this placement is a guardrail
call, not a literal reading of the pattern)

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Skin Tone | 261 | 759 |
| Eye Color | 262 | 760 |
| Hair | 263 | 761 |
| Ethnic Appearance / Visual Heritage | 264 | 762 |
| Default Clothing / Select Outfit / Select Wardrobe / Clear | 265 | 763, 764, 765 |

**Body**

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Kibbe-Inspired Body Identity | 266 | (none, create-only) |
| Body Type | 267 | (none, create-only) |
| Height | 268 | (none, create-only) |
| Build | 269 | (none, create-only) |
| Proportions | 270 | (none, create-only) |
| Custom Body Notes | 271 | 766 |

**Behavior**

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Outward Personality / Internal Personality | 272 | (none, create-only) |
| Speech Style / Movement Style | 274 | (none, create-only) |
| Verbosity | 276 | 767 |
| Interests | 277 | (none, create-only) |
| Philosophy | 278 | 768 |

**Default Rendering Style** (Review step; see needs-Brian-ruling item 2)

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Default Rendering Style | 279 (split, see below) | 752 |

**Image payoff**

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Character preview panel (initial, name, subtitle, species, gender presentation, clothing style) | 250 | (none) |
| Draft Summary | 284 | (none) |

**Create-flow navigation chrome** (present only because a create flow,
quick or full, needs its own controls to move through it; not content
fields)

| Field/control | Create row(s) |
|---|---|
| Back to Create | 245 |
| Save Draft / Finish Draft | 246 |
| Identity / Appearance / Body / Behavior / Review tabs | 247 |
| Back (footer) | 248 |
| Next (footer) | 249 |

QUICK total: 26 content fields/controls + 5 create-flow navigation
chrome = 31.

### ADVANCED (editor only)

**Explicitly named by the ruled pattern** ("optional flavor and
enhancement dropdowns")

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Role Archetype | 259 | 757 |
| Gender Presentation (+ Custom Gender Presentation) | 258 | 754, 755 |
| MBTI / Western Zodiac / East Asian Zodiac | 273 | (none, create-only) |

**Judgment calls: similar in kind to the pattern's named examples, not
required by validation, not referenced by the image/generation step**

| Field/control | Create row(s) | Edit row(s) | Why |
|---|---|---|---|
| Character Color Palette | 260 | 756 | Chat text-color theming (dialogue/narration/emphasis roles), not portrait generation; has a working default (`CRESTFALL_DEFAULT`). |
| Voice Modules (choose/clear) | 275 | (none) | Optional audio-voice enhancement, same "additional options" spirit as typing/zodiac. |
| Visibility | 279 (split) | 734, 739 (sticky pills, same field) | No required-validation found on the live select; always carries a default (`PRIVATE`). |
| Content Rating | 279 (split) | 735 | Same as Visibility: no required-validation, always defaults (`SFW`). |

**Named "Advanced" by Nick's own UI in both flows**

| Field/control | Create row(s) | Edit row(s) |
|---|---|---|
| Advanced Creator Guidance (expand/collapse) | 281 | (n/a, toggle is create-only UI; the fields it reveals are shared, see below) |
| Greeting / Scenario / Relationship to Player / Backstory / Appearance Notes / Personality Notes / Extra Runtime Notes | 281 (revealed by toggle, confirmed via source, no separate CSV row) | 769 |
| Enable Advanced Prompting | 282 | (none, create-only) |
| Core Identity / Voice & Verbal Texture / Relationship / Combat / Romance / Territory / Power Escalation / Profession & Domain / Portrayal Boundaries | 283 | (none, create-only) |

**Everything edit-only today** (per the ruled pattern's default;
publishing/danger/media/mechanics-attachment machinery that manages an
*already-created* character, none of it required to produce a working
one)

| Field/control | Edit row(s) |
|---|---|
| Creation Type (read display) | 758 |
| Overview: Title (creation-level, distinct from Character Name) | 731 |
| Overview: Public Description | 732 |
| Overview: Preview Soon | 733 |
| Publishing: Convert To Template Soon / Duplicate Template Soon / Use Template Soon | 736 |
| Publishing: Submit for Public Review | 737 |
| Publishing: Submit for Canon Review | 738 |
| Sticky action bar: Public toggle | 740 |
| Sticky action bar: Review Actions / In Review Queue / Public Live / Review-Resubmit / Archived / Official Canon Locked | 741 |
| Sticky action bar: Unlist for Editing | 742 |
| Sticky action bar: Save Changes | 743 |
| Sticky action bar: Cancel Review | 744 |
| Danger: Canon Locked notice | 745 |
| Danger: Archive Creation | 746 |
| Danger: Delete Creation | 747 |
| Shell chrome: Set Default PC | 717 |
| Shell chrome: ← My Creations | 718 |
| Shell chrome: Section tabs | 719 |
| Media panel: Featured slot thumbnails | 720 |
| Media panel: Replace Slot | 721 |
| Media panel: Go to Library | 722 |
| Media panel: Chat Media section | 723 |
| Featured image picker modal: Refresh | 725 |
| Featured image picker modal: Close | 726 |
| Featured image picker modal: Use as [Slot] | 727 |
| Featured image picker modal: Load More | 728 |
| Visual References: Refresh Library | 770 |
| Visual References: Choose (per reference card) | 771 |
| Visual References: Clear (per reference card) | 772 |
| Mechanics Profile: Attach Actor Mechanics Profile / Replace Profile | 773 |
| Mechanics Profile: Remove | 774 |
| Mechanics Profile: Actor Attachment Notes | 775 |
| Runtime Modules: Attach Mechanics Module | 776 |
| Runtime Modules: Remove mechanics module (per binding) | 777 |
| Runtime Modules: Enabled (per binding) | 778 |
| Runtime Modules: Priority (per binding) | 779 |
| Runtime Modules: Inheritance Mode (per binding) | 780 |
| Runtime Modules: Mechanics Scope (per binding) | 781 |
| Mechanics module picker modal: My Mechanics / Public Mechanics tabs | 782 |
| Mechanics module picker modal: Search mechanics modules | 783 |
| Mechanics module picker modal: Module result card | 784 |

ADVANCED total: 11 pattern-named/judgment fields + 39 edit-only
administrative rows = 50.

Grand total allocated: 31 + 50 = 81 allocation entries, tracing back to
all 105 source rows (many entries cite one create row and one edit row
for the same field; the count of *rows accounted for*, not allocation
entries, is what the verify step checks).

### Needs Brian ruling

Guardrail per item 4: only fields the ruled pattern would otherwise
send to ADVANCED, kept in QUICK instead because they read as
functionally necessary to produce a working character.

1. **Appearance step (Skin Tone, Eye Color, Hair, Ethnic
   Appearance/Visual Heritage, Default Clothing/Select Outfit/Select
   Wardrobe)** placed in QUICK. Evidence: the ruled pattern's QUICK
   list names identity, body, behavior, template picker, and the image
   payoff, but never names appearance; `AppearanceStep.jsx`'s
   `TraitModal` for Ethnic Appearance is described in its own code as
   "the real-world visual heritage reference the image generator
   should use for this character" (`components/studio/create/character/AppearanceStep.jsx`,
   field `visual_heritage_reference`), and Skin Tone/Eye Color/Hair are
   the same class of portrait-generation input. Moving these to
   Advanced-only would hide inputs that directly shape the payoff
   image from quick create. Brian should confirm appearance belongs in
   quick create, since the pattern's own wording never says so
   explicitly.
2. **Default Rendering Style** placed in QUICK. Evidence:
   `AppearanceStep.jsx`'s step description states "Rendering style will
   remain changeable later; the character identity is not locked to
   one image style," and the Review step's `rendering_style` select
   (`useCharacterReviewStepViewModel.js`, `CHARACTER_REVIEW_RENDERING_STYLE_OPTIONS`)
   is the control that sets which art style (e.g. anime vs realistic)
   the image generator uses. This directly affects the payoff image
   and should not be Advanced-only without Brian's sign-off.

### Reorder proposals

None. Every source read in this pass confirmed the field order the
CSV already implied (once corrected to the real edit-flow tab order,
see above), so there is no UX reorder to propose here; default order
stays Nick's throughout.

### Template pattern note

This allocation is the template pattern for all other asset types.
Other types get allocated the same way (QUICK vs ADVANCED, one pass
per type) only after their edit-flow rows are inventoried in the CSV;
per enrichment pass B above, most other asset types do not yet have
edit-flow rows recorded, which is the known gap this allocation
depends on closing first.

## Flagged-row verification (item 6, 9 Aug 2026)

All 15 rows carrying `status: broken`, `status: gated`, or a note
containing "unverified" were re-checked against the current code.
Every one still reproduces exactly as described; none were stale. See
git history for the row-by-row trace. No CSV `status`/`notes` values
changed as a result of this pass.

## Image creator inventory pass (R6, 10 Aug 2026 review gate)

Preparation for the Images page creator panel (Sprint E): every
user-facing field and function of the live image creator
(`/studio/image-studio`, entry `ImageStudioWorkbench`) was enumerated
against the CSV.

- Counted at the CSV's own grouping granularity (the six ingredient
  slots are one row, the five option selects are one row, matching
  rows already in the ledger): **58 control units** in the live flow.
- **48 were already in the inventory** (the `/studio/image-studio`
  block, all `status: working`).
- **10 were missing and were added**, each carrying the note
  "Newly mapped 10 Aug 2026 (R6 creator-panel inventory pass)":
  the custom-ingredient editor's disabled Use once indicator, the
  composer's Options expander row (duplicate of the sliders icon),
  the ingredient picker's search input and close control, the
  save-preset modal's close control, the media grid's per-card
  select/deselect, the lightbox details dialog close, and the
  lightbox report dialog's reason select, note textarea, and
  submit/close controls.
- Two label drifts noted, not changed: the existing ingredient-slot
  row says "Outfit" where the live label is "Clothing Source", and
  "Location" where the live label is "Location / Scene"
  (`imageStudioData.js`). The rows are otherwise accurate.
- The constraint columns on every `/studio/image-studio` row are
  `n/a (not a create or edit flow row)` by the pass-A convention, so
  the Sprint E creator-panel spec takes field caps and defaults from
  the source files, not the CSV.
- Rollup not regenerated, script not in repo.
