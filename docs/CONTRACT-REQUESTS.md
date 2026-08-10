# Contract requests

Standing backlog for work the design side cannot do without backend, state,
or ViewModel functionality that does not exist yet. Design never builds the
fix itself here; it stubs the UI honestly or pauses the affected component
and logs the gap below. A contract file created by a branch, inside a
package nothing outside it consumes, is presentation and stays editable
under the normal rules; this backlog is for shared contracts, anything Nick
owns, and anything genuinely blocked on backend work.

Process note (written 8 Aug 2026, rough draft pending Nick's feedback):
when a feature's design is ready but its data is not, design still builds
the real View, ViewModel, and contract against the shape it expects, then
feeds them sample data from one clearly named mock module (header comment
states it is mock, pending the matching CR). The CR entry is the dev
handoff: it names the mock module, states what is faked versus real, and
specifies the data shape the real feed needs. When the real feed lands, the
mock module is a single deletion, not a rewrite. See CR-017 for the current
example.

Restructured 9 Aug 2026 into a single table plus short per-CR details, so
the whole backlog reads in one screenful. Full history for each CR (dates,
migration source, prior investigation) lives in git history for this file;
the details below carry only what is still actionable.

## Backlog

| CR ID | Title | Summary | Status | Owner | Priority note |
|---|---|---|---|---|---|
| CR-001 | movement_style missing from creator form schema | `BehaviorStep.jsx` reads/writes `movement_style`, but it is not a key in the creator form's initial state | open | Nick | schema catch-up, no new UI |
| CR-002 | rendering_style missing from creator form schema | Review step reads `form.rendering_style`, not a key in the creator form's initial state | open | Nick | needs a joint Nick/Brian schema ruling |
| CR-003 | no way to move a saved character into a story | Every creator's finished/saved state has no path into building or continuing a story | open | Nick | gates the story-picker design, not spec'd yet |
| CR-004 | signed-in Supabase user has no row in backend users table | Postgres FK violation on creation write for an unprovisioned account | done | Nick | closed 8 Aug 2026, account provisioned |
| CR-005 | services-api can report success on a failed write | `postgraphileRequest` can pass a GraphQL error through as HTTP 200 | open | Nick | verify with Nick: services-api repo, cannot confirm current state from here |
| CR-006 | seal stop's age field is empty, not pre-filled | Age input showed "18+" as placeholder only, never a real value | done | Nick | implemented, confirmed still true 9 Aug 2026 |
| CR-007 | no reopen path from My Creations into the seven-stop creator | My Creations edit action still routes to the standalone editor, never `CharacterCreatorModal` | open | Brian | design decision needed: one edit surface or two |
| CR-008 | standalone editor carries fields the seven-stop creator does not | Standalone editor exposes Runtime Modules, Mechanics Profile, Publishing, Danger Zone; the seven stops do not | open | Brian | scope question, not a build gap |
| CR-009 | one creation system: wizard and visual picker | Confirm the live Player Character creator adopts the same wizard/picker system as the draft | open | Nick | no shared picker component exists yet |
| CR-010 | top bar composes the economy widget | `StudioTopBar` duplicated `StudioEconomyWidget` | done | Brian | resolved by removal, not composition, 8 Aug 2026 |
| CR-011 | bottom dock label "Rooms" vs "Stories" | Confirm "Rooms" was not a deliberate distinct label | open | Nick | verify with Nick: "Rooms" still present in mobile nav, profile hero, and community hub as of 9 Aug 2026, contradicting this CR's own "now agree on Stories" note |
| CR-012 | search enters on the top bar contract | `searchValue`/`onSearchChange` exist on the top bar contract; no search operation exists to wire to | open | Nick | contract landed, endpoint still undecided |
| CR-013 | duplicate drawer nav tree retirement | `StudioMobileNav` and `StudioSidebar` still render separate nav-tree copies | open | Nick | one-element merge agreed in shape, not landed |
| CR-014 | visibility four-state enum data-model shape | Ruled `private \| internal \| public \| canon` shape not yet in the live data model | open | Nick | migration path and publish-field question still open |
| CR-015 | lore pipeline confirmation | Confirms an already-ruled pipeline (visual builder authoritative, JSON import validate-and-apply, scanning gate before publish) | open | Nick | verify with Nick: a `lore-validation` API route now exists in this repo that did not when this CR was filed |
| CR-016 | chat_palette preference field | Per-character preference resolving to CSS-variable color-role overrides, never touching image generation | open | Nick | verify with Nick: a 13-entry seasonal palette catalog and `character_color_palette_id` field now exist, but only feed a picker modal, not confirmed applied as display-side CSS overrides anywhere |
| CR-017 | notifications feed shape | Bell and panels are real and interactive, fully fixture-driven; no real notification source exists anywhere in this repo | open | Nick | frontend complete, blocked only on data; full dev handoff in Details |
| CR-018 | backend copy alignment for Sessions vs Stories | Old "Storys" session-history naming and the new Story object need to stop sharing a label | open | Nick | backend copy fix |
| CR-019 | chat control intent confirmation | Confirm the real function of two renamed chat controls ("Describe the scene", "Reading face: Serif/Sans") | open | Nick | dedicated chat-surface sitting, excluded from mechanical sweeps |
| CR-020 | the Loom transition sequence | Agreement on the carve order for future Loom bindings beyond ModalShell/StudioShell | open | Nick | sequencing agreement, no code gap |
| CR-021 | tile style sampler run 2 review | Review of a twelve-sample species tile style report and ruling on treatment/production | open | Nick/art | production go-ahead; source material not in this repo, confirm location first |
| CR-022 | proof-layer tokens fold into theme.css at binding | Confirm whether a deepened-modal-surface token is still needed or `--surface-4` supersedes it | open | Nick | verify with Nick: `--veil-screen`/`--scrim-strong` already resolved (Ruling 7), narrowed to this one token question |
| CR-023 | Community vs Adventures structural model | Data-model question under an already-ruled copy-level split | open | Nick | feed/link/flag questions still open |
| CR-024 | rename Room Template to Story | Backend type/table naming catch-up; display layer already reads "Story" | open | Nick | later-pass, non-blocking |
| CR-025 | rename Storyline to Adventure | Backend type/table naming catch-up; display layer still reads "Storyline" | open | Nick | later-pass, non-blocking; copy and rename meant to land together |
| CR-026 | Nick reviews final quick-create mockups, promotes fields from Advanced back to Quick | Nick's pass over the 9 Aug 2026 Character QUICK/ADVANCED allocation before build, to promote any ADVANCED field he wants in quick create | open | Nick | later-pass, non-blocking |

## Details

### CR-001, movement_style missing from creator form schema

`components/studio/create/character/BehaviorStep.jsx` field
`movement_style` is not a key in `constants/form.js`'s `initialForm`
(53 keys, confirmed still missing 9 Aug 2026). Needs a 54th key with a
default value and a signed contract entry. No new UI required once the
schema catches up.

### CR-002, rendering_style missing from creator form schema

`review-step/useCharacterReviewStepViewModel.js` reads
`form.rendering_style`, not a key in `initialForm` (confirmed still
missing 9 Aug 2026). Whether to add it as a 55th field is a joint
Nick/Brian schema decision, not made here.

### CR-003, no way to move a saved character into a story

The payoff stop's "Continue into a story" still opens a panel stating
"Putting a saved character into a story is coming soon." (confirmed
9 Aug 2026, `CharacterCreatorModal.jsx` line 271). Needs an endpoint or
state shape recording which story a character is in, resumable across
devices. Story-picker UI needs its own design once the data model
exists; this CR is the gate on that design starting.

### CR-004, signed-in Supabase user has no row in backend users table

Cleared. Postgres rejected the insert on `owner_id` foreign key for an
account with no `users` row. That account was provisioned; a creation
write returned `error: null` with `owner_id` matching the signed-in
user. No frontend change needed.

### CR-005, services-api can report success on a failed write

`postgraphileRequest` in `services/api/src/clients/postgraphileClient.js`
can set `error.status` to the outer HTTP status (200) even when the
GraphQL body carries an `errors` entry. The frontend's own
`/api/creations` route now guards against this, but the transport
status leaving services-api is still wrong for every other caller.
Out of this repo's reach to re-verify; flagged for Nick to confirm
current state.

### CR-006, seal stop's age field is empty, not pre-filled

Ruled and implemented. `CharacterCreatorModal.jsx`'s
`INITIAL_FORM_STATE.age` defaults to `"18"` (confirmed still true
9 Aug 2026, line 72), a real editable value rather than placeholder
text, since every Crestfall character is an adult.

### CR-007, no reopen path from My Creations into the seven-stop creator

My Creations' edit action still builds an `editHref` of
`/studio/my-creations/[id]/edit` (confirmed 9 Aug 2026,
`useCreationCardViewModel.js`), never into `CharacterCreatorModal`.
Whether the seven-stop creator becomes the one edit surface, or the
standalone editor stays authoritative and the seven-stop creator stays
create-only, is Brian's call, not decided here.

### CR-008, standalone editor carries fields the seven-stop creator does not

Confirmed by this branch's own inventory work
(`docs/APP-FUNCTION-INVENTORY.md`, enrichment pass B): the standalone
editor's body/behavior/advanced sections and Runtime Mechanics Modules
have no equivalent in the seven-stop creator, and several of the
seven-stop creator's own fields (Advanced Prompting, full body/behavior
detail) have no editing surface at all. Scope question, not a build
gap; no split is assumed until Brian rules on it.

### CR-009, one creation system: wizard and visual picker

Needs confirmation that the live Player Character creator adopts the
same wizard/picker system as the draft, plus the picker contract shape
(`items`, `filters`, `selectedId`, `onSelect`). No shared visual-picker
component exists in the repo as of 9 Aug 2026 (searched for
`*VisualPicker*`, none found); the gap is still real.

### CR-010, top bar composes the economy widget

Ruled and implemented 8 Aug 2026. Rather than composing
`StudioEconomyWidget` into the top bar, the coin chip and Buy Coins
button were removed from the top bar entirely; coins live only in the
sidebar coins card and the mobile header. The duplication this CR
flagged no longer exists.

### CR-011, bottom dock label "Rooms" vs "Stories"

This CR's own text claims dock/drawer/sidebar "now agree on Stories,"
but as of 9 Aug 2026 "Rooms" is still the live label in
`useStudioMobileNavViewModel.js`, `usePublicProfileHeroViewModel.js`,
and `useCommunityHubViewModel.js`. Needs Nick's confirmation of whether
"Rooms" is deliberate before this closes either way.

### CR-012, search enters on the top bar contract

`searchValue`/`onSearchChange` exist on `StudioTopBar.contract.js`,
ViewModel-owned as ruled (confirmed 9 Aug 2026). `onSearchChange` is
still a safe no-op; no search operation, endpoint, or index exists to
wire it to. Separately, the `/studio` dashboard's own search input
(row 49, `docs/APP-FUNCTION-MAP.csv`) has no `onChange` at all and is
not part of this contract.

### CR-013, duplicate drawer nav tree retirement

`StudioMobileNav` and `StudioSidebar` still exist as separate
components with separate nav-tree definitions (confirmed 9 Aug 2026).
Agreed shape: the rail doubles as the drawer, one element, off-canvas
below the desktop breakpoint, ViewModel only toggling visibility, at
contract v0.2.0, timed with the shell binding. Not yet landed.

### CR-014, visibility four-state enum data-model shape

Ruled shape is `private | internal | public | canon`. The live create
flows still expose only `PRIVATE`/`UNLISTED` to the owner (confirmed
9 Aug 2026 across every create-flow `visibilityOptions` constant); the
`CREATION_VISIBILITIES` list in `lib/server/creations/constants.js` is
unreachable dead code (see `docs/APP-FUNCTION-INVENTORY.md`'s sourcing
note) and does not count as the live shape. Migration path and whether
publish rides the same field are both still open.

### CR-015, lore pipeline confirmation

Confirms an already-ruled pipeline: visual builder authoritative, JSON
import is Validate and Apply on the complete
`lore_document_contract_v4` document, references reuse existing
Characters/Locations only, page-level Save persists the Asset, and a
named scanning gate runs before publish. As of 9 Aug 2026 this repo now
has `app/api/creations/[id]/lore-validation/route.js`, which did not
exist when this CR was filed; worth Nick confirming whether that route
already answers this CR before it stays open indefinitely.

### CR-016, chat_palette preference field

Ruled shape: a per-character preference choosing Crestfall Default or
one of twelve seasonal palettes, resolving display-side to color-role
CSS variable overrides, never touching image generation. As of 9 Aug
2026, `constants/characterColorPalettes.js` ships exactly that catalog
(13 entries, 7 color roles each) bound to the existing
`character_color_palette_id` field, but it is only consumed by the
picker modal (`useCharacterColorPaletteModalViewModel.js`) to render
swatches; no code applies it as CSS variable overrides anywhere a
character is actually displayed or chatted with. Substantial partial
build; worth Nick confirming whether the remaining display-side wiring
is still wanted before this CR is rewritten to scope just that gap.

### CR-017, notifications feed shape

Frontend complete, blocked only on data. `StudioTopBar`'s notifications
control is a real open/close panel pair (compact panel + full center,
grouped TODAY/EARLIER), backed by
`components/studio/studio-top-bar/studioTopBarNotifications.mock.js`
(mock, header-commented) and a session-only demo-state hook,
`studioTopBarNotificationsDemoState.js`, for dismiss/clear-all. Ruled
shape not yet fully matched: the bell should carry a boolean "something
is new" that clears on open (today it derives from
`notifications.length > 0` and opening does not clear it), and rows
should be deep links (today plain text). No real notification source
exists anywhere in the repo (`app/api/`, `lib/server/`,
`lib/client/studio/`, `docs/contracts/` all searched, confirmed empty).

Dev handoff for the real feed: row shape
`{ id, title, supportingLine, group: "today" | "earlier", href? }`
(matches what the View already renders, `href` is new); a single
`hasNew` boolean, or an empty array standing in for "nothing new";
`onClearAllNotifications` and `onDismissNotification(id)` need real
endpoints to replace the in-memory demo hook's array mutations; opening
the panel is a separate call from clear-all/dismiss and is what clears
the badge per the ruled model.

### CR-018, backend copy alignment for Sessions vs Stories

The live page's old "Storys" naming and the new Story object are
different things; backend copy needs to align to the ratified model so
session history and Story buckets never share a label. Not verifiable
from this repo; needs Nick.

### CR-019, chat control intent confirmation

Draft renames "Use current scene" to "Describe the scene" and "Prose"
to "Reading face: Serif/Sans," both best guesses at the live controls'
real function. Chat surfaces are excluded from mechanical sweeps per
the sweep-scope ruling and get dedicated sitting; draft copy corrects
if either guess is wrong.

### CR-020, the Loom transition sequence

Agreement needed on the carve sequence for future Loom bindings beyond
ModalShell and StudioShell: mapping audit into a gap report, gap report
reviewed together, bind order (proposed: shell/nav, browse surfaces,
modal creators, chat last), each binding on its own contract sheet with
`CONTRACT_VERSION` bumps as the change signal.

### CR-021, tile style sampler run 2 review

Review of a twelve-sample species tile style report (Elf and Werewolf
in six render treatments, two transparent PNGs for backdrop test) and
a ruling on treatment, backdrop, prompt edits, alignment rules, and
production models. Source material lived in the legacy design-system
repo's `review/tiles-run-2/` tree; confirm its current location before
acting, it is not present in this repo.

### CR-022, proof-layer tokens fold into theme.css at binding

Partially superseded: `--scrim-strong` is already the live token for
the banner screen veil (Ruling 7, confirmed still true 9 Aug 2026 in
`app/theme.css`), and `--veil-screen` is already retired to it. Open
question narrowed to one thing: whether the deepened modal surface
once proposed for the proof layer needs its own token, or whether the
live `--surface-4` (also confirmed locked) supersedes it outright.

### CR-023, Community vs Adventures structural model

Ruled at the copy level (Adventures is playable published stories,
every CTA plays; Community is the makers' wall). Open: does Community
query the same published-object store as Adventures with a different
facet, or its own feed? Where does a playable item in Community link?
Does Featured need a backend flag or stay curatorial?

### CR-024, rename Room Template to Story

Later-pass, non-blocking. `docs/CRESTFALL-PRODUCT-MODEL.md`'s "Naming
gaps owed by Nick" section already names this gap. Display layer
already reads "Story" (`creationTypePolicy.js`); no UI changes once the
backend name catches up, or a confirmed decision to rely on the
presentation terminology module instead.

### CR-025, rename Storyline to Adventure

Later-pass, non-blocking. Unlike Room Template, the display layer has
not been updated yet: `creationTypePolicy.js`'s `STORYLINE.label` still
reads "Storyline." The product model rules that "Storyline is retired
from copy the moment the Adventure rename lands in code," so the copy
change and backend rename are meant to land together. The Scenario
category value "Adventure" needs no rename of its own: it displays as
"Scenario," no alias, mapped in
`lib/shared/presentation/terminology.js` rather than in its own
`label`, so it does not collide with the Adventure unit name.

### CR-026, Nick reviews final quick-create mockups, promotes fields from Advanced back to Quick

Later-pass, non-blocking. `docs/APP-FUNCTION-INVENTORY.md`'s "Character
allocation" section sorts every Character field into QUICK (quick
create and the editor) or ADVANCED (editor only), following the 9 Aug
2026 ruled pattern. Two placements were kept in QUICK against the
pattern's literal wording under the item 4 guardrail (appearance-step
fields, Default Rendering Style) and are separately flagged there for
Brian, not Nick, to rule on. This CR is the later step once quick-create
mockups exist: Nick reviews them and selects any field currently
allocated ADVANCED that he wants promoted into QUICK before build.

## Closed

None this pass. Every previously open CR re-checked against current
repo state 9 Aug 2026 is either still accurately open or was already
marked done/cleared before this pass (CR-004, CR-006, CR-010, all kept
in the table above with `status: done` for traceability, not moved
here). Uncertain-relevance items are flagged "verify with Nick" in the
table rather than removed; see CR-005, CR-011, CR-015, CR-016, CR-022.
