# Contract requests

Standing backlog for work the design side cannot do without backend, state,
or ViewModel functionality that does not exist yet. Each entry logs the
feature blocked, the missing functionality Nick would need to build or
expose, and the design intent once it exists. Design never builds the fix
itself here; it stubs the UI honestly or pauses the affected component and
logs the gap below.

Scope note: a contract file created by a branch, inside a package nothing
outside it consumes, is presentation and stays editable under the normal
rules. This backlog is for shared contracts, anything Nick owns, and
anything genuinely blocked on backend work.

## Process (rough draft, pending Nick's feedback on process and brief format)

Written 8 Aug 2026 to name a pattern this backlog had already fallen into
without ever writing it down: design builds a feature ahead of backend,
finishes it as a reviewable, working mockup so it can ship the moment real
data exists, and this file is the handoff, not an afterthought.

Concretely: when a feature's design is ready but its data is not (no
endpoint, no contract, sometimes not even a ruling on the shape), design
still builds the real View, ViewModel, and contract against the shape it
expects, then feeds them sample data from one clearly named module, marked
in its own header comment as mock or demo, pending the matching CR here
(see `components/studio/studio-top-bar/studioTopBarNotifications.mock.js`
and its paired `studioTopBarNotificationsDemoState.js` for the current
example). The CR entry for that feature is the dev handoff: it names the
mock module, states exactly what is faked versus real today, and specifies
the data shape, endpoint behavior, and semantics Nick's side needs to
build. When the real feed lands, the mock module (and any paired demo
state) is a single deletion, not a rewrite.

This is written down as a rough draft because it describes practice that
already happened, not a ruling that was made in advance. Whether this is
the right shape for future features, and whether CR entries should keep
following this brief-and-handoff format, is open for Nick's feedback
before it is treated as settled process.

## Open requests

### CR-001, movement_style missing from creator form schema

Feature blocked: the heart stop's behavior field reads and writes
`movement_style` (`components/studio/create/character/BehaviorStep.jsx`),
but `movement_style` is not a key in the creator form's initial field set
(`components/studio/create/character/constants/form.js`, 53 keys).

Missing functionality: `constants/form.js`'s `initialForm` needs a 54th key,
`movement_style`, with a default value and a signed contract entry
describing its shape and versioned name.

Design intent once it exists: the field continues to render exactly where
it does today; no new UI is required, only the schema catching up to what
is already wired.

### CR-002, rendering_style missing from creator form schema

Feature blocked: the seal stop and the review step read `rendering_style`
(`review-step/useCharacterReviewStepViewModel.js`,
`review-step/CharacterReviewStep.fixtures.js`), but `rendering_style` is
not a key in `constants/form.js`'s initial field set either.

Missing functionality: whether to add `rendering_style` as a 55th field is
a schema decision Nick and Brian need to rule on together; not decided here.

Design intent once it exists: same as CR-001, the field renders where the
review step already expects it once the schema carries the key.

### CR-003, no way to move a saved character into a story

Feature blocked: the final stop of every creator (creator-stops' payoff
stop, and any other creator that reaches a saved end state) has no path
from a finished, saved character into a story. "Continue into a story" on
the payoff stop opens a secondary panel that says this is coming soon; it
does not pick, create, or resume a story.

Missing functionality: Nick would need to expose a way to attach a saved
character (or other playable asset) to a story, an endpoint or state shape
that records which story a character is in, and a way to resume that
placement from a different device than the one the character was made on.

Design intent once it exists: every creator that produces a playable asset
type ends with a path into building or continuing a story with what it
just made, resumable across devices. Non-playable asset types, such as
clothing, may not need this path and are not assumed to get one
automatically. Story selection itself needs its own design once the
underlying data model exists; this request is the gate on that design
starting, not a spec for the picker.

### CR-005, services-api can report success on a failed write

Status: OPEN, with Nick.

Feature blocked: none directly, but this masked the CR-004 failure as a
silent no-op instead of a visible error, and would do the same for any
other write that hits a masked GraphQL error. In
`services/api/src/clients/postgraphileClient.js`, `postgraphileRequest`
sets `error.status = response.status` whenever the GraphQL response
contains an `errors` entry, even though GraphQL servers return transport
status 200 for application-level errors. `creationsRoute.js`'s
`failFromError` then uses that status verbatim
(`Number.isInteger(error?.status) ? error.status : 500`), so a real write
failure is answered with HTTP 200 and an error body. The frontend's
`/api/creations` route now guards against this (see this branch's commit),
but the transport status leaving services-api is still wrong for every
caller, not just this one.

Missing functionality: `postgraphileRequest` needs to treat a GraphQL
`errors` entry as a failure status (for example 500, or a mapped status
from the GraphQL error's extensions) rather than trusting the outer HTTP
status when the body contains an error.

Design intent once it exists: no design change, this is a transport
correctness fix so "the request answered 200" reliably means "the write
succeeded" everywhere in the app, not just where the frontend has learned
to double-check.

### CR-007, no reopen path from My Creations into the seven-stop creator

Status: OPEN, design decision needed.

Feature blocked: none directly, but update-in-place for a saved character is
untested and unproven. My Creations opens a preview modal for a saved
creation, and its edit action routes to the older standalone editor
(`studio/my-creations/[id]/edit`). Nothing loads an existing creation back
into `CharacterCreatorModal`, the seven-stop creator built this branch.

Missing functionality: a path from a saved creation into the seven-stop
creator, pre-loaded with that creation's saved `formState` and `creationId`
so a save from that session updates the existing row instead of creating a
new one.

Design intent once it exists: not decided here. Whether the seven-stop
creator becomes the one edit surface for a saved character, or the
standalone editor stays authoritative and the seven-stop creator is
create-only, is the open question this request gates.

### CR-008, standalone editor carries fields the seven-stop creator does not

Status: OPEN, design decision needed.

Feature blocked: none directly. The standalone edit page
(`studio/my-creations/[id]/edit`) exposes Runtime Modules, Mechanics
Profile, Publishing, Danger Zone, and more; the seven-stop creator's seven
stops do not cover this ground.

Missing functionality: none, this is a scope question, not a build gap.

Design intent once it exists: not ruled. No split between "seven-stop
creator" and "standalone editor" scope is assumed from this gap alone, and
none should be built toward until Brian rules on it.

### CR-009, one creation system: wizard and visual picker

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N1
(`docs/_legacy-reference/design-system/DECISIONS-FOR-NICK.md`), Sprint 3
Phase 1 item 1.6.

Feature blocked: none directly. The draft uses one reusable visual picker
(search, filter chips, image tile grid, gold-ring selection, bottom sheet
on mobile) across the wizard, Image Studio slots, and the account
default-PC chooser.

Missing functionality: confirmation that the live Player Character
creator adopts the same wizard and picker system (one system, two
flavors), and the picker contract shape (`items`, `filters`, `selectedId`,
`onSelect`).

Design intent once it exists: one picker component serves every
selection surface named above under a single contract.

### CR-011, bottom dock label "Rooms" vs "Stories"

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N3.

Feature blocked: none directly. Dock, drawer, and sidebar now agree on
"Stories" for `/studio/story-rooms` (the drawer's "Storys" typo is also
fixed).

Missing functionality: confirmation from Nick that "Rooms" was not a
deliberate distinct label; otherwise this stands as already-landed copy.

Design intent once it exists: none further, this closes once confirmed.

### CR-012, search enters on the top bar contract

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N4. Contract
shape landed 8 Aug 2026 (Phase 2 top bar restyle brief); live wiring
still open.

Feature blocked: the draft top bar carries search; the live product top
bar had none.

Progress: `searchValue` / `onSearchChange` now exist on the top bar View
contract (`studio-top-bar.view.v2`), ViewModel-owned exactly as this CR
asked, presentation only. `onSearchChange` is still a safe no-op; no
search operation or endpoint exists to wire it to.

Missing functionality: the actual search operation. What it searches
(tools and builders, per the proof copy, or something broader), the
endpoint or client-side index it hits, and result presentation are all
still undecided.

Design intent once it exists: search state is ViewModel-owned like every
other top bar behavior. (Landed.)

### CR-013, duplicate drawer nav tree retirement

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N5.

Feature blocked: none directly. `StudioMobileNav` and `StudioSidebar`
render separate copies of the nav tree.

Missing functionality: agreement to land the rail doubling as the
drawer, one element, off-canvas below the desktop breakpoint, with the
ViewModel only toggling visibility, at contract v0.2.0, timed with the
shell binding (see the Ruling 6 ModalShell/StudioShell carve, Sprint 3
Phase 1 item 1.7).

Design intent once it exists: one nav-tree element, not two.

### CR-014, visibility four-state enum data-model shape

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N6. Cross-
referenced in `docs/SPRINT-3-PLAN.md` queue item T12 (proof-vs-live
divergences: the live PRIVATE/UNLISTED pair vs this ratified enum).

Feature blocked: the live visibility field does not yet carry the ruled
four-state shape.

Missing functionality: ruled design law is `private | internal | public |
canon`, spanning assets and lore (internal = share link, logged-in
viewers, no remix; public = SEO-visible outside login, remixable; canon
= public and official). The data-model shape, the migration path from
the live two-state field, and whether publish (Story to Adventure) rides
the same field are all still open.

Design intent once it exists: the live visibility control reads and
writes the four-state enum directly, no PRIVATE/UNLISTED shim.

### CR-015, lore pipeline confirmation

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N7.

Feature blocked: none directly, this confirms an already-ruled pipeline.

Missing functionality: confirmation of the ruled pipeline (visual
builder authoritative; JSON import is Validate and Apply on the complete
`lore_document_contract_v4` document, ids preserved, references only
reuse existing Characters/Locations; page-level Save persists the Asset;
the exact revision passes certification and security scanning before
production publication) and the name of the scanning gate.

Design intent once it exists: none further, this closes once confirmed.

### CR-016, chat_palette preference field

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N8.

Feature blocked: none directly, no UI depends on this yet.

Missing functionality: a per-character (later per-user) preference field
choosing Crestfall Default or one of twelve seasonal palettes, resolving
display-side to six colour roles as CSS variable overrides. Never
affects image generation; must arrive display-ready. Field shape and
storage location need confirmation.

Design intent once it exists: a display-ready preference the View
applies as CSS variable overrides, no palette logic in the View.

### CR-017, notifications feed shape

Status: OPEN, with Nick, frontend complete and blocked only on data.
Migrated 7 Aug 2026 from legacy N9. Popup shell landed 8 Aug 2026
(Phase 2 top bar restyle brief); ported to the proof's compact + full
panel recipe 8 Aug 2026 (Phase 2.1 top bar chrome correction brief);
finished as a reviewable mockup 8 Aug 2026 (account icon / notification
mockup data / scanner guard brief): the bell now carries its gold
has-new state, the compact panel shows a three-row quick view, and the
full center groups the complete list under TODAY/EARLIER, all sourced
from one sample data module,
`components/studio/studio-top-bar/studioTopBarNotifications.mock.js`
(header comment states it is mock data pending this CR). That file and
its one import in `components/studio/StudioTopBar.jsx` are the entire
footprint; deleting both returns the bell to its honest empty-list
default. No View, ViewModel, or contract change was needed to wire it
in, since the shape already matched what the View renders (see the dev
handoff below).

Interactions made real for review 8 Aug 2026 (Review Mode port /
mobile nav restyle / notification demo brief, items 2-4): the compact
panel's "Open the notification center" button is now the primary
filled-gold action, relabelled exactly "Notification Center"; "Clear
all" stays the ghost button, same height and padding, side by side.
Per-row dismiss and clear-all are no longer no-ops in the running app;
`components/studio/studio-top-bar/studioTopBarNotificationsDemoState.js`,
a hook living beside the mock module, owns an in-memory (session-only,
resets on reload) copy of the mock list and exposes
`onDismissNotification(id)` and `onClearAllNotifications()`, which the
Shell (`StudioTopBar.jsx`) wires directly onto the View, bypassing
`useStudioTopBarViewModel` so the production Chassis's own contract
(accepts a `notifications` array, owns no mutation logic) stays
untouched. Dismissing every row in a TODAY or EARLIER group makes that
group disappear (the View already filters empty groups); clearing the
list drops the bell to idle and shows the empty state, both already
derived from `notifications.length`. This is demo scaffolding, not a
real mutation: delete `studioTopBarNotificationsDemoState.js` together
with the mock module when the real feed lands (see the dev handoff
below for what a real dismiss/clear-all endpoint needs to do instead).
Feed is otherwise still stubbed pending real data.

Feature blocked: none directly. `StudioTopBar`'s notifications control
is a real open/close panel pair built on the shared `ModalShell`
primitive: a compact panel (title, subtitle, close, gold-dot two-line
rows, per-row dismiss, Clear all / Notification Center footer) and a
full notification center (same row recipe, grouped under TODAY /
EARLIER labels), both closing on the close control, outside click, and
Escape, with focus returned to the bell. It renders from a
`notifications` prop that defaults to `[]` (honest stub, no backend);
`onDismissNotification` and `onClearAllNotifications` are wired to
session-only in-memory demo state (see above), not a real mutation.

Missing functionality: confirmation of the ruled shape from this CR
(the bell carries a boolean "something is new", never a count; opening
the panel clears it; rows are deep links: render finished, creator
published, daily bonus ready) against what actually shipped (the bell
today derives its glow from `notifications.length > 0`, functionally a
boolean but not sourced from a real feed; opening the panel does not
clear the has-new signal, only dismiss/clear-all remove rows; rows are
plain text, not deep links) and the ViewModel feed shape plus clear
semantics.

Design intent once it exists: the top bar ViewModel consumes a boolean
plus a deep-link row list, nothing else.

Data check (8 Aug 2026, Phase 2.2 top bar layout brief): confirmed no
real notification source exists anywhere in this repo. Searched
`app/api/`, `lib/server/`, `lib/client/studio/` (including
`engagement`, which covers reactions/likes, not notifications), and
`docs/contracts/` for any notification endpoint, proxy route, or
contract field; none found. The only other "Notifications" surface in
the app, `app/studio/account/notifications/page.js`, is a fully static
`AccountStubPage` with hardcoded preference-category copy (Email, Room
Activity, Creator Alerts, Review & Safety); it fetches nothing and
shares no data model with the top bar bell. **Finding: no, real
notification data does not exist.** The panels stay fixture-driven
until this CR is answered.

**Dev handoff: what the frontend needs to go live.**

- Data shape per row (matches what the View already renders, so no
  View change would be needed, only the data source):
  `{ id: string, title: string, supportingLine: string, group: "today" | "earlier", href?: string }`.
  `title` is the row's bold headline (`h3`), `supportingLine` is the
  quiet line beneath it (currently used for relative time, e.g. "12m
  ago"), `group` sorts the row into the full panel's TODAY or EARLIER
  section. `href` is new: the ruled design intent is that every row is
  a deep link (see below); today's rows render as plain text with no
  navigation.
- Has-new signal: a single boolean, never a count, matching the ruled
  language in this CR ("something is new"). The bell's gold-glow state
  already derives from `notifications.length > 0` in
  `StudioTopBar.view.jsx`; a real boolean field (e.g. `hasNew`) would
  replace that derivation, or the feed endpoint could simply return an
  empty array when there is nothing new and the existing derivation
  keeps working unchanged.
- Clear-all behavior: as of 8 Aug 2026, `onClearAllNotifications` empties
  an in-memory demo list (`studioTopBarNotificationsDemoState.js`),
  session-only, gone on reload, no network call. Going live means
  replacing that hook's `setNotifications([])` with a real mutation (a
  clear-all endpoint or a client-side "mark all read" call) that the
  ViewModel calls, then either re-fetches or optimistically empties the
  list. Per this CR's ruled intent, opening the panel is what clears
  the "something is new" signal, which is a separate call from
  clear-all (dismissing individual rows does not clear the badge by
  itself in the ruled model, only viewing does); the demo does not
  implement that opening-clears-the-badge behavior, only the list
  mutations.
- Per-row dismiss behavior: as of 8 Aug 2026, `onDismissNotification(id)`
  filters that id out of the same in-memory demo list, session-only, no
  network call. Going live means a real per-row dismiss/delete endpoint
  the ViewModel calls, then removes that row from the list
  (optimistically or via re-fetch), replacing the demo hook's
  `setNotifications((current) => current.filter(...))`.
- Deep-link targets: per the ruled shape, each row should navigate
  somewhere on click ("render finished, creator published, daily bonus
  ready" are the three examples named in this CR). The `href` field
  above is the minimal addition; whether rows also carry a distinct
  "kind" for icon/category treatment is undecided and would need its
  own ruling before building.

### CR-018, backend copy alignment for Sessions vs Stories

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N10.

Feature blocked: none directly. The Sessions page keeps its locked name;
its bucket chip reads Stories.

Missing functionality: the live page's old "Storys" naming and the new
Story object are different things; backend copy needs to align to the
ratified model so session history and Story buckets never share a
label.

Design intent once it exists: none further, this closes once confirmed.

### CR-019, chat control intent confirmation

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N11. Chat
surfaces are excluded from mechanical sweeps per the sweep-scope ruling
(`docs/SPRINT-3-PLAN.md` Phase 3 "chat/story-room raw golds" row);
dedicated sitting.

Feature blocked: none directly. The draft renames "Use current scene" to
"Describe the scene" (inserts a scene-setting beat) and "Prose" to
"Reading face: Serif/Sans" (a reading-typeface toggle); both are best
guesses at the live controls' real function.

Missing functionality: confirmation of the real functions; draft copy is
corrected if either guess is wrong.

Design intent once it exists: none further, this closes once confirmed.

### CR-020, the Loom transition sequence

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N12.

Feature blocked: none directly, this is a sequencing agreement for
future Loom carves beyond ModalShell and StudioShell (Ruling 6, Sprint 3
Phase 1 item 1.7).

Missing functionality: agreement on the proposed sequence: mapping audit
per the LOOM pattern doc into a gap report, gap report reviewed
together, bind order agreed (proposed: shell/nav, browse surfaces on one
control-bar contract, modal creators on one recipe-chassis contract,
chat last), each binding negotiates on its own contract sheet, with
`CONTRACT_VERSION` bumps as the change signal.

Design intent once it exists: every future carve follows this same
sequence and negotiation shape.

### CR-021, tile style sampler run 2 review

Status: OPEN, with Nick/art. Migrated 7 Aug 2026 from legacy N13.

Feature blocked: production art generation for the species tile set.

Missing functionality: review of the twelve-sample style report (Elf and
Werewolf in six render treatments, plus two transparent PNGs for the
backdrop test) and the modal mockup, then a ruling on treatment or
blend, backdrop, prompt edits, alignment rules, and production models,
plus who runs production per the runbook. Source material lived in the
legacy design-system repo's `review/tiles-run-2/` tree
(`style-report.html`, `modal-mockup.html`, `tile-checklist.md`, 40
production rows); confirm its current location before acting, it is not
present in this repo.

Design intent once it exists: none further, this is a production
go-ahead, not a UI change.

### CR-022, proof-layer tokens fold into theme.css at binding

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N14. Partially
superseded: `--scrim-strong` is already the live token for the banner
screen veil in this repo's `app/theme.css`/`docs/DESIGN-TOKENS.md`
(Ruling 7), so the `--veil-screen` alias question is narrowed to naming
only, not value.

Feature blocked: none directly.

Missing functionality: confirmation of whether the deepened modal
surface once proposed for the proof layer (`color-mix(in srgb,
var(--surface-2) 88%, var(--canvas))`) needs a first-class token, or
whether the live `--surface-4` (already locked, see
`docs/DESIGN-TOKENS.md`) supersedes it outright. `--veil-screen` itself
is already retired to `--scrim-strong` per the Retired names table.

Design intent once it exists: no new token is minted unless this
confirms `--surface-4` cannot do the job.

### CR-023, Community vs Adventures structural model

Status: OPEN, with Nick. Migrated 7 Aug 2026 from legacy N15.

Feature blocked: the Community and Adventures surfaces cannot be built
past their copy-level ruling.

Missing functionality: ruled at the copy level (Adventures is playable
published stories, every CTA plays; Community is the makers' wall,
individual creations, the people behind them, Featured as spotlight).
Open: does Community query the same published-object store as
Adventures with a different facet, or its own feed? Where does a
playable item in Community link, its Adventure detail or straight into
chat? Does Featured need a backend flag or stay curatorial?

Design intent once it exists: Community and Adventures share a data
model where the copy-level ruling implies they should, and diverge only
where confirmed necessary.

## Ruled

### CR-010, top bar composes the economy widget

Status: RULED, implemented. Migrated 7 Aug 2026 from legacy N2; resolved
8 Aug 2026 (Phase 2 top bar restyle brief).

Feature blocked: none directly. `StudioTopBar` re-implemented the coins
chip, Buy Coins, and Notifications, modals included, duplicating
`StudioEconomyWidget`.

Ruling: rather than composing `StudioEconomyWidget` into the top bar
under a `"topBar"` layout mode, Brian ruled the coin chip and Buy Coins
button removed from the top bar entirely (8 Aug 2026 brief, manifest
item 4); coins now live only in the sidebar coins card
(`StudioEconomyWidget`, untouched) and the mobile header. The
duplication this CR flagged no longer exists, resolved by removal
rather than composition.

### CR-006, seal stop's age field is empty, not pre-filled

Status: RULED, implemented.

Feature blocked: none, the field works and does not cause the save failure
investigated for CR-004, confirmed by reading the actual Postgres error,
which was solely the owner_id foreign key. But the seal stop's age input
(`seal-stop/SealStop.view.jsx`) shows "18+" only as placeholder ghost
text; `formState.age` defaults to `""` and stays empty until the user
types, even though every Crestfall character is an adult.

Ruling: the age field pre-fills 18 by default. Every Crestfall character is
an adult and the field is required, so a real value belongs there instead
of ghost text a user could mistake for an entered value. Implemented;
`CharacterCreatorModal.jsx`'s `INITIAL_FORM_STATE.age` now defaults to
`"18"`, confirmed rendered as a real editable value (not placeholder text)
at 390 and 1440 width.

## Cleared

### CR-004, signed-in Supabase user has no row in the backend's users table

Status: CLEARED. The frontend correctly authenticated and posted to
`/v1/studio/creations` with a real user id, but the write failed: Postgres
rejected the insert with `insert or update on table "creations" violates
foreign key constraint "creations_owner_id_fkey"`, `Key (owner_id)=(<the
signed-in user's id>) is not present in table "users"`. This account now
has a `users` row: a creation write for the signed-in account
(`8bfe3176-bd2e-4e2c-98f8-f6c1a852608e`) returned row id
`cecab068-7801-48a1-839a-20dac2eef73c`, `error: null`, `owner_id` matching
the signed-in user. The creator's save path needed no changes once the
account was provisioned.
