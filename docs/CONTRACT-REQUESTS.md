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
| CR-007 | no reopen path from My Creations into the seven-stop creator | Ruled 10 Aug 2026: the single reopen path is Vault popup to the advanced editor page; the seven-stop creator stays create-only quick path | ruled, build scheduled | Brian (ruled) | design question closed by the Studio spec; the update-in-place proof moves to CR-031 |
| CR-008 | standalone editor carries fields the seven-stop creator does not | Ruled 10 Aug 2026: the advanced editor page is the one full edit surface; create-only fields gain edit sections there | ruled, build scheduled | Brian (ruled) | closed as a question; tracked as build in `docs/STUDIO-SPEC.md` |
| CR-009 | one creation system: wizard and visual picker | Confirm the live Player Character creator adopts the same wizard/picker system as the draft | open | Nick | no shared picker component exists yet |
| CR-010 | top bar composes the economy widget | `StudioTopBar` duplicated `StudioEconomyWidget` | done | Brian | resolved by removal, not composition, 8 Aug 2026 |
| CR-011 | bottom dock label "Rooms" vs "Stories" | Confirm "Rooms" was not a deliberate distinct label | open | Nick | verify with Nick: "Rooms" still present in mobile nav, profile hero, and community hub as of 9 Aug 2026, contradicting this CR's own "now agree on Stories" note |
| CR-012 | search enters on the top bar contract | `searchValue`/`onSearchChange` exist on the top bar contract; no search operation exists to wire to | open | Nick | contract landed, endpoint still undecided |
| CR-013 | duplicate drawer nav tree retirement | `StudioMobileNav` and `StudioSidebar` still render separate nav-tree copies | open | Nick | one-element merge agreed in shape, not landed |
| CR-014 | visibility four-state enum data-model shape | Ruled `private \| internal \| public \| canon` shape not yet in the live data model | open | Nick | migration path and publish-field question still open |
| CR-015 | lore pipeline confirmation | Confirms an already-ruled pipeline (visual builder authoritative, JSON import validate-and-apply, scanning gate before publish) | open | Nick | verify with Nick: a `lore-validation` API route now exists in this repo that did not when this CR was filed |
| CR-016 | chat_palette preference field | Per-character preference resolving to CSS-variable color-role overrides, never touching image generation | open | Nick | updated 13 Aug 2026 (wave C6): the display side now exists in chat, fixture-gated only; see Details |
| CR-017 | notifications feed shape | Bell and panels are real and interactive, fully fixture-driven; no real notification source exists anywhere in this repo | open | Nick | frontend complete, blocked only on data; full dev handoff in Details |
| CR-018 | backend copy alignment for Sessions vs Stories | Old "Storys" session-history naming and the new Story object need to stop sharing a label | open | Nick | backend copy fix |
| CR-019 | chat control intent confirmation | Confirm the real function of two renamed chat controls ("Describe the scene", "Reading face: Serif/Sans") | open | Nick | dedicated chat-surface sitting, excluded from mechanical sweeps |
| CR-020 | the Loom transition sequence | Agreement on the carve order for future Loom bindings beyond ModalShell/StudioShell | open | Nick | sequencing agreement, no code gap |
| CR-021 | tile style sampler run 2 review | Review of a twelve-sample species tile style report and ruling on treatment/production | open | Nick/art | production go-ahead; source material not in this repo, confirm location first |
| CR-022 | proof-layer tokens fold into theme.css at binding | Confirm whether a deepened-modal-surface token is still needed or `--surface-4` supersedes it | open | Nick | verify with Nick: `--veil-screen`/`--scrim-strong` already resolved (Ruling 7), narrowed to this one token question |
| CR-023 | Community vs Adventures structural model | Data-model question under an already-ruled copy-level split | open | Nick | feed/link/flag questions still open |
| CR-024 | rename Room Template to Story | Backend type/table naming catch-up; display layer already reads "Story" | open | Nick | later-pass, non-blocking |
| CR-025 | rename Storyline to Adventure | Backend type/table naming catch-up; v2 surfaces display "Adventure" via the terminology module (ruled 10 Aug 2026) | open | Nick | later-pass, non-blocking; display mapping proceeds frontend-side ahead of the rename |
| CR-026 | Nick reviews final quick-create mockups, promotes fields from Advanced back to Quick | Nick's pass over the 9 Aug 2026 Character QUICK/ADVANCED allocation before build, to promote any ADVANCED field he wants in quick create | open | Nick | later-pass, non-blocking |
| CR-027 | content rating labels, ruled final, gated on a content audit | Labels ruled final 9 Aug 2026 (kit polish 2 pass): one-to-one mapping, SFW=Everyone, MATURE=Teen, EXPLICIT=Adult, no disabled row. Required gate: existing MATURE and EXPLICIT content must be audited and re-tagged against this ladder before live (non-fixture) data reaches users under these labels | open | Nick | blocks live rating data only; fixture-driven previews unaffected; standards doc revision (CRESTFALL-CONTENT-STANDARDS.md, draft) still pending |
| CR-028 | mute a creator | Account-level mute relationship, persisted per account, with mute and unmute paths; excludes the muted creator from every discovery surface (Home rails, Community browse, Creators browse, search); the creator's profile stays reachable by direct link; credit lines and remix chains unaffected; a readable list of an account's muted creators for a future settings surface | open | Nick | the mute control ships on the Creators profile-detail page; no frontend work depends on this until that page is built |
| CR-029 | Home feed data: four rails and the continue surface | Data sources for Home's four curated rails (top rated, recently added, from the community, creators to follow) and the in-progress item feeding the top banner's continue state (10 Aug 2026 Home review: the separate Continue strip merged into the top banner; feed shape unchanged); Home builds fixture-first per the CR-017 mock-module pattern | open | Nick | non-blocking; filed 10 Aug 2026 by the Sprint G planning gate, updated 10 Aug 2026 by the Sprint H planning gate |
| CR-030 | Home creations filter: persisted preference and feed support | Account-level persistence for Home's creations filter (All creations / just mine, plus visibility values) and whatever feed support the three creation rails need to honor it; interim is a client-side filter over fixture data with a localStorage-persisted selection | open | Nick | non-blocking; filed 10 Aug 2026 by the Sprint H planning gate |
| CR-031 | advanced editor full-field read and update path | Opening a saved creation by id must return the complete creator-written field set, and update-in-place on that record must be proven end to end | open | Nick | non-blocking (fixture-first per CR-017 pattern); filed 10 Aug 2026 by the Studio spec gate |
| CR-032 | Vault Worlds card-kind field | The ruled five-option Vault type facet (Characters/Worlds/Looks/Stories/Adventures, h-restore ruling 1) needs a real location/lore/faction card kind; none exists today, so the Worlds option ships with an honest zero count | open | Nick | non-blocking; filed 10 Aug 2026 by the h-restore branch |
| CR-033 | Community updatedAt timestamp | Community's Recently Updated curation row and the Recently Updated sort candidate both need a real updated timestamp; the interim reuses the existing recency field as a stand-in signal | open | Nick | non-blocking; filed 10 Aug 2026 by the h-restore branch |
| CR-034 | Community renderStyle field | The restored Rendering filter (Anime/Realistic/Either/Auto) has no per-item renderStyle field; the interim derives a value deterministically from item id so the facet is honestly non-trivial rather than fabricated per row | open | Nick | non-blocking; filed 10 Aug 2026 by the h-restore branch |
| CR-035 | Per-media type and engagement fields on KitAssetDetailPopup media | The restored popup media library (Images/Videos/Liked/Bookmarked tabs, sort, search) has no fixture field for per-media type or per-media like/bookmark state; Videos and per-media Liked/Bookmarked render their honest empty state until this lands | open | Nick | non-blocking; filed 10 Aug 2026 by the h-restore branch |
| CR-036 | Images moderation eligibility field | The restored eligibility filter and Eligible First/Needs Review First sorts have no real moderation field; the interim derives eligibility deterministically from item id | open | Nick | non-blocking; filed 10 Aug 2026 by the h-restore branch |
| CR-037 | Community creation tags | The restored `KitAssetDetailPopup` tags row (`docs/PARITY-AUDIT.md` section 5, candidate 6) has no tag data on any `/studio/v2/community` fixture creation; the row renders and works but is empty on every real card today | open | Nick | non-blocking; filed 11 Aug 2026 by the design/community-parity branch |
| CR-038 | Community and Vault five-bucket type filter grouping | Community and Vault type filters present a five-bucket display grouping (Characters, Worlds, Looks, Stories, Adventures) over the backend's raw creation types; the frontend owns this mapping today in display code | open | Nick | dev awareness only; presentation-layer mapping, no backend change required unless dev prefers to serve grouped types; ruled by Brian 11 Aug 2026 |
| CR-039 | STORYLINE display name is Adventure platform-wide | Ruled by Brian 11 Aug 2026: the user-facing name for STORYLINE is Adventure everywhere on the platform, implemented as display mapping via the terminology module | open | Nick | non-blocking; does not duplicate CR-025, which already carries the backend rename request; see CR-025 |
| CR-041 | Long-form field character limits | The frontend now enforces two display-layer character-limit classes on every long-form field in the advanced editor: 600 for short long-form (a line or short paragraph), 2,000 for deep long-form (extended writing), per the mapping in `SharedFields.jsx` and its consuming sections. Reach extended Sprint H (CC1 through CC4, SF1) to every advanced-editor package; six fields keep a real contract-validated limit above their tier, flagged for reconciliation | open | Nick | non-blocking; display-layer ruling pending Nick's confirmation against the backend data model, not a backend change request |
| CR-042 | Server-side filter, sort, and search for list pages | Every list page filters/sorts one full in-memory fixture array client-side; needs server-side filter, sort, and search so the client keeps only the current slice resident and load-more requests the next slice by the same params | open | Nick | non-blocking; the true scale ceiling per Scale Review H finding B2, not a regression, the known shape of the pre-parity fixture-driven build |
| CR-043 | Chat API catch-up | The new chat page (`app/studio/v2/stories/[id]`) needs the crestfall-main baseline's 8+ missing routes and 13 missing client functions (message actions, `/summary`, transcript export, temporary/persistent share), plus a decision on the orphaned engine-module bindings | open | Nick | non-blocking; filed 13 Aug 2026 by the Fable design gate wave C6; fixture-first per the CR-017 mock-module pattern, mock module named in its own header comment |
| CR-044 | Streaming transport for chat | SSE or streaming contract for `POST /messages`; the frontend's chat-message and chat-composer contracts are already streaming-ready (`isStreaming`, `generationCursorLabel`, `onStopGenerating`) per ruling O9, so the surface upgrades without a contract change once transport lands | open | Nick | non-blocking; filed 13 Aug 2026 by the Fable design gate wave C6, ruling O9 |
| CR-045 | Story room rename | No rename path exists anywhere in the crestfall-main baseline or this repo's chat surface; a product gap, not a design decision this wave makes | open | Nick/Brian | non-blocking; filed 13 Aug 2026 by the Fable design gate wave C6; needs a product decision on whether rename ships at all before any UI is designed |
| CR-046 | Chat monetization data | Real coin balance, entitlements, and gated-action pricing for the chat header's coin chip and the Library Pass upsell sheet, both fixture-fed today | open | Nick | non-blocking; filed 13 Aug 2026 by the Fable design gate wave C6, ruling O6 |
| CR-047 | Tooltip component | No tooltip component exists anywhere in the shipped editor tree; Gate 1's field grammar requires one for helper-text disclosure | open | Brian | non-blocking; the glass treatment is now ratified 22 Aug 2026 (`--blur-glass` 12px, tooltips only); the tooltip component design itself is still open for Brian |
| CR-048 | Chrome blur tokens | Gate 1 design-time exploration permits blur on nav-adjacent surfaces with no existing token for it | done | Brian | closed 22 Aug 2026; the blur triad (`--blur-chrome`, `--blur-panel`, `--blur-glass`) plus the Gate 2 chrome-blur ruling answer it, both surfaces and radius/opacity ruled |
| CR-049 | Bottom save bar vs. saved-pill | Two competing treatments for the mobile save affordance; ruling explicitly deferred to Gate 2 | done | Brian | closed 22 Aug 2026; the Gate 2 save-surface amendment retired the bottom bar, the rail-bottom unsaved-state pill plus Discard/Save is the ruling |
| CR-050 | The "+1" save bloom | A subtle gamified micro-animation on save, permitted under the design-time-exploration ruling, not yet designed or ruled | open | Brian | non-blocking; the bloom pattern is GO as a reusable "increment bloom" (21 Aug 2026); placement on Save is NO; placement of the pattern elsewhere stays open |
| CR-051 | Saved-state success-hue adjustment | The current green-check-on-brown treatment is the specific case the contrast law's status-on-mid-surface gap already blocks; Gate 1 asked for real specimens to rule it | done | Brian | closed 22 Aug 2026; sage (`oklch(.76 .08 135)`) ruled the success hue everywhere, Gate 2 token law row 6 |
| CR-052 | Sidebar deviations bundle | Six deviations from the shipped sidebar surfaced during Gate 1 ground-truth review: ink lift, top-bar wash, Legacy section hidden, Community Links removed, footer re-order, and the economy widget's fixture treatment | open | Brian | updated 22 Aug 2026: all six deviations RULED KEPT (option B wholesale, 21 Aug 2026); the economy-fixture sub-item stays open pending the StudioEconomyWidget scope decision |
| CR-053 | Token candidates from Gate 1 | Four values ratified in Gate 1's spec list with no existing token match: Inter 300 weight, cf-btn secondary 5% screen fill, control heights 38 (already `--control-filter`, confirm broadened use) and 28 (genuinely new), gradient card surfaces | done | Brian | closed 22 Aug 2026; ratified in full by the Gate 2 twelve-row token law |
| CR-054 | Soft-delete recovery window | Renumbered 22 Aug 2026 from GATE-LOG.md's colliding "CR-052" use (that number already named the sidebar deviations bundle above); window is 7 to 30 days, not yet ruled to a single number | open | Nick | non-blocking; confirm copy carries a "[X] days" placeholder until Nick rules the number |

## Details

### CR-001, movement_style missing from creator form schema

`components/studio/create/character/BehaviorStep.jsx` field
`movement_style` is not a key in `constants/form.js`'s `initialForm`
(53 keys, confirmed still missing 9 Aug 2026). Needs a 54th key with a
default value and a signed contract entry. No new UI required once the
schema catches up. Update 10 Aug 2026 (Studio spec gate): the
seven-stop creator adds Movement Style frontend-side per the QUICK
allocation (`docs/STUDIO-SPEC.md` section 2.2, build brief S2); the
backend schema catch-up stays this CR and stays Nick's.

### CR-002, rendering_style missing from creator form schema

`review-step/useCharacterReviewStepViewModel.js` reads
`form.rendering_style`, not a key in `initialForm` (confirmed still
missing 9 Aug 2026). Whether to add it as a 55th field is a joint
Nick/Brian schema decision, not made here. Update 10 Aug 2026
(Studio spec gate): the seven-stop creator adds Default Rendering
Style frontend-side per the QUICK allocation (`docs/STUDIO-SPEC.md`
section 2.2, build brief S2); the backend schema decision stays this
CR.

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

Ruled 10 Aug 2026 (Brian, recorded in `docs/STUDIO-SPEC.md` section
1): the single reopen path is the Vault popup's Edit action routing
straight to the advanced editor page; the seven-stop creator stays
the create-only quick path, ending with a post-save CTA into that
same editor. No fork, no choice dialog. The design question this CR
carried is closed. What remains open, the end-to-end update-in-place
proof (the old check (c)), moves to CR-031 with Nick as owner. Build
is scheduled as briefs S3 and S5 in `docs/STUDIO-SPEC.md`.

### CR-008, standalone editor carries fields the seven-stop creator does not

Confirmed by this branch's own inventory work
(`docs/APP-FUNCTION-INVENTORY.md`, enrichment pass B): the standalone
editor's body/behavior/advanced sections and Runtime Mechanics Modules
have no equivalent in the seven-stop creator, and several of the
seven-stop creator's own fields (Advanced Prompting, full body/behavior
detail) have no editing surface at all.

Ruled 10 Aug 2026 (Brian, recorded in `docs/STUDIO-SPEC.md` section
1): the advanced editor page is the one full edit surface, carrying
ALL fields. The create-only fields this CR flagged gain their first
edit sections there (body detail, behavior detail, Advanced
Prompting; brief S4 in `docs/STUDIO-SPEC.md`). The field split
between quick create and the editor follows the Character allocation
in `docs/APP-FUNCTION-INVENTORY.md` as written. Closed as a
question; tracked as build.

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

Update, 13 Aug 2026 (Fable design gate wave C1, ruling O7). The
missing display-side half this CR flagged now exists, gated: the new
`chat-message` LOOM package (`components/studio/chat/chat-message/`)
carries `enableFixturePaletteDemo`/`paletteRoleOverrides` on its View
contract (`ChatMessage.contract.js`), applying a palette as scoped
CSS-variable role overrides to segments, the speaker label, the
avatar ring, and the card border. The ratified `--chat-*` token
family this display path resolves through is proposed, not yet
locked, in `docs/DESIGN-TOKENS.md`; per the O7 ruling, every product
render path keeps the gate off until that family is ratified. Two
fixtures demonstrate both states
(`chatMessagePaletteDemoOnFixture`/`chatMessagePaletteDemoOffFixture`,
`ChatMessage.fixtures.js`). What remains open for Nick: whether the
live `character_color_palette_id` field and the 13-entry catalog in
`constants/characterColorPalettes.js` (crestfall-main) feed this
display path once the token family locks, or whether this repo grows
its own equivalent field.

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

Later-pass, non-blocking. Updated 10 Aug 2026 (Sprint G planning
gate): the standing ruling is now that the front end proceeds with
display-name mapping only, through
`lib/shared/presentation/terminology.js`, which already maps
STORYLINE to "Adventure" (no component wires it in yet; the
Adventures v2 page build wires it on v2 surfaces). This supersedes
the earlier reading that the copy change and backend rename land
together: v2 surfaces display "Adventure" ahead of the rename, and
Nick's backend naming stays as built until his own later pass. Legacy
surfaces reading `creationTypePolicy.js`'s `STORYLINE.label`
("Storyline") are untouched until cutover. When the backend rename
lands, the mapping row becomes an identity and can be retired in one
file. The Scenario
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

### CR-027, content rating labels, ruled final, gated on a content audit

Filed 9 Aug 2026 by the kit revision pass, updated 9 Aug 2026 by the
kit polish pass, corrected 9 Aug 2026 by the demo prep pass, ruled
final 9 Aug 2026 by the kit polish 2 pass. Labels are no longer open:
the backend's three content rating values
(`lib/server/creations/constants.js`: `SFW`, `MATURE`, `EXPLICIT`) map
one to one onto three live display tiers, display-mapped in
`lib/shared/presentation/terminology.js` (`CONTENT_RATING_TIERS`):
SFW displays as Everyone (tooltip "Comparable to a G or PG film.");
MATURE displays as Teen (tooltip "Comparable to a PG-13 film.");
EXPLICIT displays as Adult (tooltip "Comparable to an R film."). No
disabled row, no interim note, no NC-17 anywhere. Film anchors ride
the row tooltip, never a visible description line.

REQUIRED GATE before this mapping reaches live data: every existing
`MATURE` and `EXPLICIT` tagged creation must be audited and re-tagged
against this ladder before real (non-fixture) content is shown under
these labels to users. `MATURE` content now surfaces as Teen; any
`MATURE`-tagged item that is not actually teen-appropriate under this
ladder must be re-tagged `EXPLICIT` (Adult) as part of the audit, not
left mislabeled. This gate is Nick's to run and blocks turning on live
data for the rating filter and rating badge; fixture-driven previews
are unaffected and may ship ahead of the audit.

Open question for Nick, deferred rather than answered here: whether
the backend should carry a fourth content-rating value distinct from
today's three, once the audit above is complete and the standards doc
below is final.

Caveat that gates final naming: the referenced standards doc
(CRESTFALL-CONTENT-STANDARDS.md) is a draft and is not in this repo
yet. Nothing blocks frontend work; the display mapping is live against
the three real values today, gated only on the audit above before
live (non-fixture) data reaches users under these labels.

### CR-028, mute a creator

Needs a mute relationship between an account and a creator, persisted
per account, with mute and unmute paths. Muted creators are excluded
from every discovery surface: Home rails, Community browse, Creators
browse, and search results. The muted creator's own profile stays
reachable by direct link, since muting hides a creator from discovery
rather than blocking a direct visit. Credit lines and remix chains are
unaffected: a muted creator's name still renders where it is part of a
credit on someone else's work. Also needs a readable list of an
account's muted creators, for a future settings surface.

No frontend work depends on this until the Creators profile-detail
page is built; the mute control ships on that profile.

### CR-029, Home feed data: four rails and the Continue strip

Filed 10 Aug 2026 by the Sprint G planning gate. Home's ruled
composition consumes four curated rails (top rated, recently added,
from the community, creators to follow) and a Continue strip that
renders nothing when nothing is in progress. No endpoint exists for
any of the five feeds. Home builds fixture-first per the CR-017
mock-module pattern: real View, ViewModel, and contract against the
expected shape, fed from one named mock module whose header states it
is mock pending this CR.

Expected shapes, for the later real feed: the three creation rails
deliver ordered lists of display-ready creation summaries matching
the `KitCreationCard` contract fields (title, subtitle, imageSrc,
badges, stats, assetKind); the creators rail delivers display-ready
creator summaries matching the `KitCreatorCard` contract fields
(handle, avatarSrc, stats, thumbnails 0 to 3, isFollowing); the
Continue strip delivers the account's in-progress Stories and
Adventures, newest activity first, with a resume route per item. An
empty list is the legal "render nothing" state for any rail and for
the strip. Sort on the top rail is client-side over the delivered
list until ruled otherwise. Muted creators (CR-028) are excluded from
every one of these feeds server-side once both CRs are live.

Updated 10 Aug 2026 (Sprint H planning gate, Brian's Home review
ruling): the separate Continue strip surface merged into the top
banner; the top banner IS the continue surface, showing the most
recent in-progress item and falling back to the general hero when
nothing is in progress. The feed shape above is unchanged: the same
in-progress list, newest activity first, now feeds the banner's
continue state instead of a strip. Additionally, each creation-rail
item gains two fields for the CR-030 filter: `ownership`
(`"mine" | "community"`) and `visibility` (the ruled four-state
enum, whose data-model landing remains CR-014). Fixture data carries
both fields ahead of the real feed.

### CR-030, Home creations filter: persisted preference and feed support

Filed 10 Aug 2026 by the Sprint H planning gate
(`docs/SPRINT-H-PLAN.md` section 1e). Brian's 10 Aug Home review
ruled a new Home control: a creations filter over the three creation
rails, options All creations / just mine plus the ruled visibility
values (private, internal, public, canon), whose selection persists
across sessions.

Needed from the backend, in two parts:

1. **Preference persistence.** An account-level preference storing
   the selection (shape: `{ scope: "all" | "mine", visibility?:
   "private" | "internal" | "public" | "canon" }`), readable at page
   load and written on change, so the selection follows the account
   across devices and sessions.
2. **Feed support.** Either the three creation-rail feeds (CR-029)
   accept the filter server-side (ownership plus visibility
   parameters), or each delivered item carries `ownership` and
   `visibility` fields so the client filters the delivered list.
   Whichever way, the fields ride the CR-029 item shape (see the
   CR-029 update above). Visibility values depend on CR-014's
   four-state enum landing; until then only the states the data
   model actually has can be filtered live.

What is faked versus real until this lands: the control, the
filtering, and the fixtures are real frontend; the data is the
CR-029 mock module; persistence is a single namespaced localStorage
key (`cf.home.creationsFilter`) written by the Home Binding Shell,
which persists per browser rather than per account. When this CR
lands, the localStorage interim is one deletion in the Shell plus
one read/write against the real preference, and the mock module
follows CR-029's own deletion path. No component outside
`app/studio/v2/home/` is involved.

**Amended 10 Aug 2026 (h-restore, ruling 3).** View-mode (grid/list)
persistence, section 10 candidate 11 of `docs/PARITY-AUDIT.md`
(the original Stories hub persisted grid/list per device with a
mobile list default; v2 reset to grid every load), rides this same
CR rather than a separate mechanism. Interim: a second namespaced
localStorage key, `cf.stories.viewMode`, written by
`app/studio/v2/stories/StoriesV2Mockup.jsx` on every layout change and
read on mount, falling back to a coarse-pointer (mobile) check for
the default when nothing is stored yet. When CR-030 lands its real
preference, this key folds into the same account-level object rather
than shipping its own field.

### CR-031, advanced editor full-field read and update path

Filed 10 Aug 2026 by the Studio spec gate (`docs/STUDIO-SPEC.md`
section 7). The ruled advanced editor page (`/studio/v2/editor/[id]`)
opens saved creations for editing across the complete field set.
Needed from the backend, in two parts:

1. **Full-field read.** Opening a saved creation by id must return
   the complete creator-written field set: the creation `data` blob
   as the seven-stop creator writes it (including body and behavior
   detail, typing frameworks, and Advanced Prompting content), plus
   the record-level fields (title, description, visibility,
   content_rating). Today no path reads a saved creation back into a
   creator-shaped form (the old CR-007 gap).
2. **Update-in-place, proven.** Saving from the editor must update
   the same record end to end. This inherits the old CR-007 check
   (c), never proven, and the CR-005 transport caveat (services-api
   can report HTTP 200 on a failed GraphQL write); the proof is a
   real edit observed persisted, not a 200 response.

What is faked versus real until this lands: the editor page, its
sections, and the fixtures are real frontend; `[id]` resolves through
one named mock module in `app/studio/v2/editor/` (header comment:
mock, pending CR-031) returning saved-creation fixtures with the
full field set. When this CR lands, the mock module is a single
deletion and the page reads through the existing creation client.

### CR-038, Community and Vault five-bucket type filter grouping

Ruled 11 Aug 2026 (Brian). Community and Vault type filters both
present the same five-bucket display grouping (Characters, Worlds,
Looks, Stories, Adventures, `ASSET_KIND_TO_TYPE_BUCKET` in
`CommunityV2Mockup.jsx` and `VaultV2Mockup.jsx`) over the backend's
raw creation types. This grouping is owned entirely by frontend
display code today. Request is dev awareness only: the grouping is
presentation-layer, no backend change is required unless Nick would
prefer to serve the grouped types directly.

### CR-039, STORYLINE display name is Adventure platform-wide

Ruled 11 Aug 2026 (Brian). The user-facing name for STORYLINE is
Adventure everywhere on the platform, implemented as a display
mapping via `lib/shared/presentation/terminology.js`. The backend
rename itself, STORYLINE and related identifiers to Adventure
naming, remains Nick's later pass at his discretion. This entry does
not duplicate CR-025, which already carries that backend-rename
request and its detail; see CR-025 for the standing display-mapping
detail and the rename request itself.

### CR-040, creator Plays stat: aggregate play count by creator

Filed 11 Aug 2026 (Sprint H render review, item 6). The creator
profile page (`/studio/v2/creators/[handle]`) shows a Plays stat tile
alongside Followers, Following, and Works. Followers and Following
route to the connections page; Works scrolls to the same page's
Creations grid. Plays has no honest destination to route to: there is
no backend aggregate that sums play counts across every work a given
creator has published. Needed from the backend: a query returning
total plays across a creator's published works, by creator id or
handle. Until this lands, the Plays tile opens an honest stub notice
on tap (`useCreatorProfileViewModel.js`, `onOpenPlays`) rather than
routing anywhere fake.

### CR-041, Long-form field character limits

Filed 11 Aug 2026 (Sprint H, the a2 field-limits brief). The frontend
now enforces two display-layer character-limit classes on every
long-form field in the advanced editor
(`components/studio/my-creations/edit/sections/**`), wired through
`SharedFields.jsx`'s existing `TextAreaField` `maxLength` prop (no
new counter mechanism built): SHORT long-form at 600 characters
(fields that describe in a line or a short paragraph: appearance,
tone, premise, summary, and their kin) and DEEP long-form at 2,000
characters (fields that hold extended writing: personality,
backstory, history, lore body, scenario detail, and their kin). The
full field-to-class mapping lives in the a2 branch's commit and PR
description.

This is a display-layer ruling pending Nick's confirmation against
the backend data model, not a backend change request and not
blocking. Needed from Nick: confirm these two ceilings are compatible
with each field's stored column, and flag any field whose column
cannot hold 2,000 characters or whose real backend limit is lower
than what the frontend now allows.

**Reach extended, Sprint H creator-completion sitting (CC1 through
CC4, SF1).** The two-class mapping now covers every advanced-editor
package touched this sitting: CC2's 9 unified mechanics-modal call
sites plus 8 mechanics textareas, all SHORT (600); CC3's
location-registry (27 textarea sites) and structured-registry (14
textarea sites) builders, mapped 600/2000 by field kin, neither
package carrying a pre-existing contract limit to reconcile against;
CC1's rules-codex, lore, actor-mechanics-profile, and progression
packages; and SF1's five stats-pools-editor fields, converted once
`TextAreaField` gained the `disabled` prop the editor's lock state
needed. The five `JsonEditorModal` views across these packages stay
JSON-exempt (raw JSON, unlimited, not display-layer prose).

**Reconciliation items.** Six fields keep a real, contract-validated
limit above their CR-041 tier rather than being forced down to it:
rules-codex's Codex Summary (2,000, matches the DEEP tier exactly)
and Interpretive Guidance (8,000, well above DEEP); actor-mechanics-
profile's Profile Summary (2,400), Capability Notes (4,000), and
Binding Notes (4,000); and stats-pools' own real-limit fields per SF1
(2,400/2,400/4,000). Needed from Nick: confirm whether these six
should stay at their real limit (this sitting's assumption, since a
real validated limit outranks a display-layer default) or fold down
to the nearest CR-041 tier once the backend column sizes are known.

### CR-042, Server-side filter, sort, and search for list pages

Filed 12 Aug 2026 (Sprint H, the cc4 scale-fixes pass, per
`docs/reviews/SCALE-REVIEW-H.md` finding B2). Every list page below
holds one full array (a fixture today, presumably a full fetched
collection once live) and runs `.filter()`/`.sort()` over it inside a
`useMemo`, re-executed on every search keystroke, filter toggle, and
sort change:

- `app/studio/v2/stories/StoriesV2Mockup.jsx`
- `app/studio/v2/vault/VaultV2Mockup.jsx`
- `app/studio/v2/community/CommunityV2Mockup.jsx`
- `app/studio/v2/images/ImagesV2Mockup.jsx`
- `app/studio/v2/creators/CreatorsV2Mockup.jsx`
- `app/studio/v2/lore/lore/useLoreViewModel.js`
- `app/studio/v2/adventures/adventures/useAdventuresViewModel.js`
- `components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel.js`

This architecture requires the entire catalog to already be resident
in the browser before any filter, sort, or search can apply. At
thousands of items this is the first thing to break: initial payload
size, memory, and per-keystroke recompute cost all scale with total
catalog size rather than with what is on screen. No fix is available
at the component layer; this is an architectural constraint, not a
rendering bug.

Needed from the backend: server-side filter, sort, and search
endpoints for each page above, so the client keeps only the current
page's slice resident and its existing load-more control requests the
next slice by the same filter/sort/search params, rather than
re-deriving from a full local array. Non-blocking; flagged as the
true scale ceiling underneath every other Scale Review H finding, not
a regression introduced by any recent change.

### CR-043, Chat API catch-up

Filed 13 Aug 2026 by the Fable design gate wave C6
(`docs/plans/FABLE-GATE-PLAN.md`), after the wave C1-C5 chat build and
the wave C6 parity echo (`docs/reviews/CHAT-PARITY-ECHO-C6.md`) walked
the crestfall-main baseline item by item. The new chat page
(`app/studio/v2/stories/[id]`) is built fixture-first against a mock
snapshot (`app/studio/v2/stories/[id]/chatV2StoryMock.js`, header
comment: mock, pending this CR) standing in for the baseline's full
API surface: 20 client functions in `storyRoomClient.js` (create/
fetch/delete room, from-template, messages, message actions, summary,
player-character, registry NPCs x3, random-liked, transcript-export,
temporary/persistent share create+revoke, engine-module bindings x3)
and 8+ backend routes behind them (message actions, `/summary`,
transcript export, temporary/persistent share, at minimum).

Also needed as part of this catch-up, not a separate decision: what
happens to the orphaned Runtime Mechanics Panel engine-module
bindings crestfall-main itself unmounted from chat in `dc8e89d`
("updating chat menu + various fixes") but never removed from the
client. Whether those bindings get a new home, get removed, or stay
orphaned pending a later mechanics-surface decision is Nick's call.

What is faked versus real until this lands: the chat-shell package,
its composed C1-C4 packages, and every fixture are real frontend; the
send loop in `useChatV2StoryPageViewModel.js` optimistically appends
messages and returns one canned reply after a simulated delay, honest
about not calling a real engine. When this CR lands, the mock module
is a single deletion and the page reads through a real chat client.

### CR-044, Streaming transport for chat

Filed 13 Aug 2026 by the Fable design gate wave C6. Ruling O9
(ratified): the frontend ships streaming-ready contracts now rather
than waiting on transport. `chat-message`'s `isStreaming`/
`generationCursorLabel` (`ChatMessage.contract.js`) and
`chat-composer`'s `streamingSupported`/`isStreaming`/
`onStopGenerating` (`ChatComposer.contract.js`) exist and have
fixtures (`chatMessageStreamingFixture`, `chatComposerStreamingFixture`)
today, with `streamingSupported: false` everywhere real data flows, so
the stop-generation seat stays honestly absent until this lands. Needed
from the backend: an SSE or streaming contract for `POST /messages`
(or whichever transport Nick prefers) that the frontend can flip
`streamingSupported` on against without a contract change on either
side.

### CR-045, Story room rename

Filed 13 Aug 2026 by the Fable design gate wave C6, surfaced by the
wave C6 parity echo. No rename path exists anywhere: not in the
crestfall-main baseline (confirmed absent in the C1 crawl,
`docs/plans/FABLE-GATE-PLAN.md` research section C1), not in this
repo's legacy story-rooms tree, not in the new wave C5 chat surface.
This is a product gap the parity echo logged rather than a design
decision either build made by omission. Needs Brian's decision on
whether room rename ships at all before any UI is designed for it;
Nick's input needed on what a rename would touch (title field only,
or anything else keyed to the room's original title).

### CR-046, Chat monetization data

Filed 13 Aug 2026 by the Fable design gate wave C6. Ruling O6
(ratified): the chat header seats a coin chip and gated-action upsell
sheets are seated on Scene Image (composer, wave C2) and Library Pass
moments (chat-shell, wave C5), all fixture-fed today
(`ChatShell.contract.js`'s `coinChip`/`libraryPassUpsell`,
`ChatComposer.contract.js`'s `sceneImageSeat`). Needed from the
backend: the real coin balance (the chat header composes
`StudioEconomyWidgetView`, which elsewhere reads live balance through
`StudioAccountProvider`, not wired to chat context in this wave),
real Library Pass entitlement state per account, and real gated-action
pricing (Scene Image's "40 coins" is a placeholder cost label today).
When this lands, the mock coin/entitlement data in
`chatV2StoryMock.js` and `ChatShell.fixtures.js`'s
`chatShellInsufficientCoinsFixture` fold into the same account context
the sidebar's coin chip already reads.

### CR-047, Tooltip component

Filed 21 Aug 2026, Gate 1 (Claude Design, Crestfall Editor DS
project). No tooltip pattern exists anywhere in the v2 editor's real
render tree today (`KitDropdown`'s `tooltip` option field renders via
the native `title` attribute as a documented interim, per its own
`.d.ts`, not a designed component). Gate 1's field grammar names a
tap-friendly tooltip icon as the vehicle for helper text under the
progressive-disclosure binding rule. **Updated 22 Aug 2026 (Fable law
review):** the glass treatment is now ratified (`--blur-glass` 12px,
tooltips only, minted in `app/theme.css`; no other surface may
consume it). Still needed from Brian: the ruled visual design of the
tooltip component itself. Needed from Nick: none yet; this is
design-only until a component exists. Until the component lands,
helper text stays in whatever interim form each field grammar variant
used during Gate 1 review, never a fabricated tooltip lookalike.

### CR-048, Chrome blur tokens

Filed 21 Aug 2026. The ruling that opened Gate 1's design-time
exploration explicitly permits "blur on nav-adjacent surfaces" as a
proposal, flagged "new device, law update or CR required." No blur
token existed in `app/theme.css` at filing time. **CLOSED 22 Aug
2026 (Fable law review):** the blur triad is ratified and minted,
`--blur-chrome` (12px, sticky nav and editor chrome, scope extended
to the editor sticky nav and mobile save row), `--blur-panel` (2px,
overlay panels and the image viewer veil), `--blur-glass` (12px NEW,
tooltips only), none cross-borrowing another's scope. Both surfaces
and blur radius/opacity are now ruled.

### CR-049, Bottom save bar vs. saved-pill

Filed 21 Aug 2026. Two candidate treatments for the mobile save
affordance surfaced during Gate 1 review; Brian's own ruling explicitly
deferred the choice to Gate 2 (hero architecture), since the mobile
save surface's shape depends on how the hero and rail collapse on
mobile. **CLOSED 22 Aug 2026:** the Gate 2 save-surface amendment
retired the bottom bar; the unsaved-state pill plus Discard/Save
anchors the bottom of the sections rail instead. This is a layout
ruling, not a token change; the ED1E-era bottom control bar is
superseded.

### CR-050, The "+1" save bloom

Filed 21 Aug 2026. A subtle gamified micro-animation on a successful
save, named directly in the ruling that opened Gate 1's design-time
exploration ("a subtle gamified micro-animation, e.g. a '+1' bloom"),
flagged "new device, law update or CR required." **Updated 21 Aug
2026 (Gate 2 bloom ruling):** the pattern is GO as a reusable
"increment bloom," reserved for genuinely incrementing values (coins
earned, completion counts, progression). Placement on Save is NO
("+1" implies score; save feedback stays the saved-state treatment
only, P1 to P3). Placement of the pattern elsewhere in the product
stays open. Needed from Brian: where else, if anywhere, the bloom
lands; the animation spec itself (duration, easing, trigger) still
needs a ruling before any placement enters a contract.

### CR-051, Saved-state success-hue adjustment

Filed 21 Aug 2026, carried from ED1E law-gap escalation 1
(`docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md` section 10) and Gate 1's
explicit ask to "rethink the current green-check-on-brown treatment."
This is the same root gap the contrast law already flags as BLOCKED,
not ruled (`docs/DESIGN-TOKENS.md`: status colors at normal text size
on `--surface-2/3/4` have no named brighter ladder step). **CLOSED
22 Aug 2026 (Gate 2 token law row 6, closes the ED1E escalation in
the same ruling):** sage, `oklch(.76 .08 135)`, ruled the success hue
everywhere, replacing the prior `#7D9B6A`. `--status-success` in
`app/theme.css` carries the revised value; `docs/DESIGN-TOKENS.md`'s
status colors table and contrast law both note the regeneration
trigger for `docs/review-artifacts/contrast-matrix-x1.md`.

### CR-052, Sidebar deviations bundle

Filed 21 Aug 2026, surfaced during the Gate 1 ground-truth fidelity
pass (comparing Claude Design exploration renders against real
`localhost:3001` captures of the shipped `StudioSidebar`). Six
deviations from the shipped sidebar, none yet ruled as intentional
redesign or accidental drift:
- **Ink lift:** exploration renders show a brighter overall ink value across sidebar text than the shipped `--ink-dim`/`--ink-faint` pairing produces.
- **Top-bar wash:** a background treatment on the top bar not present in the shipped `StudioTopBar.view.jsx`.
- **Legacy section hidden:** a standing shell ruling (recorded in `ground-truth/GROUND-TRUTH.md`) that the sidebar's collapsible "Legacy" disclosure is hidden entirely, not merely collapsed; needs a real contract-level decision on whether `StudioSidebar` gains a prop for this or the Binding Shell simply stops passing legacy data.
- **Community Links removed:** the shipped sidebar's "Community Links" disclosure does not appear in exploration renders; needs confirmation this is a ruled removal, not an omission.
- **Footer re-order:** the signed-in footer's internal ordering differs from the shipped recipe.
- **Economy fixture:** whether the coin-balance widget stays the honest out-of-scope stub (`.design-sync/shims/EconomySlotStub.jsx`) or gets a fixture-fed real `StudioEconomyWidget` (see `ground-truth/GROUND-TRUTH.md`'s coverage-check note).

**Updated 22 Aug 2026 (sidebar batch ruling, 21 Aug 2026, executed at
the Fable law review):** all six deviations RULED KEPT, option B
wholesale (ink lift, top-bar wash, Legacy section hidden, Community
Links removed, footer re-order, economy fixture). This CR stays open
only for the economy-fixture sub-item: whether the coin-balance
widget stays the honest out-of-scope stub or gets a fixture-fed real
`StudioEconomyWidget`, still pending its own scope decision. The
other five items are ruled and propagate; the shipped `StudioSidebar`
behavior is no longer authoritative for those five.

### CR-053, Token candidates from Gate 1

Filed 21 Aug 2026. Four values named directly by Brian as token
candidates from the ratified Gate 1 spec list, cross-checked against
`app/theme.css` in `docs/plans/ED1F-DESIGN-DELTAS.md`:
- **Inter 300 weight:** no token below `--weight-regular` (400) exists today.
- **`cf-btn` secondary, 5% screen fill:** not confirmed against `--state-hover-fill`/`--fill-whisper`'s actual values in this pass; either a match (cite the existing token) or a genuinely new opacity step.
- **Control heights 38 and 28:** 38 already matches `--control-filter` exactly (this Gate broadens its legal use to field-grammar controls generally, not a new token); 28 has no match below `--control-sm` (32) and is genuinely new.
- **Gradient card surfaces:** the hero/section-card/rail gradient (`#1a1610` to `#14110c` per Gate 1's ratified spec) matches no existing surface token; explicitly permitted as a new device under the design-time-exploration ruling.

**CLOSED 22 Aug 2026:** ratified in full by the Gate 2 twelve-row
token law. `--weight-light` (300) minted; the secondary-button fill
resolved to a genuinely new opacity step, `--fill-ghost`
(`rgba(242,209,148,.05)`), distinct from `--fill-whisper`; `--control-
editor-md` aliases `--control-filter` (38, broadened-use note landed
in `docs/DESIGN-TOKENS.md`'s sizing section) and `--control-editor-sm`
mints 28 as genuinely new; the gradient card surfaces minted as
`--grad-card` and `--grad-rail`. All four now write into product code
via `app/theme.css`.

### CR-054, Soft-delete recovery window

Filed 22 Aug 2026 by the G1 propagation pass, per Brian's 22 Aug 2026
law-review ruling. GATE-LOG.md's "MODAL FAMILY, CLOSED" section used
"CR-052" for this item, colliding with the existing CR-052 (sidebar
deviations bundle, filed 21 Aug 2026, above); per Brian's ruling this
item takes the next free number in this ledger, CR-054 (CR-053 is the
Gate 1 token-candidates entry). The delete-confirmation danger recipe
(B5) is ratified and propagates independent of this CR; only the
recovery window's exact day count is blocked here. Needed from Nick:
the number, 7 to 30 days. Until ruled, confirm copy carries a literal
"[X] days" placeholder, never a guessed number.

## Closed

CR-048, CR-049, CR-051, and CR-053 close this pass (22 Aug 2026, ED1F
propagation G1), each kept in the table above with `status: done` for
traceability, not moved here, matching the CR-004/CR-006/CR-010
convention. CR-047 and CR-052 are updated, not closed: CR-047's glass
treatment ratifies while the component design stays open; CR-052's
five sidebar items rule while the economy-fixture sub-item stays
open. CR-054 is a new filing this pass. Every previously open CR
re-checked against current repo state 9 Aug 2026 is either still
accurately open or was already marked done/cleared before that pass.
Uncertain-relevance items are flagged "verify with Nick" in the table
rather than removed; see CR-005, CR-011, CR-015, CR-016, CR-022.
