# Fable Design Gate: Creator Design Language + Chat Surface

Plan-mode research and planning gate, 12 Aug 2026. Repo
~/dev/Crestfall-fe, branch `design/sprint-h-final` at `0469c81`,
working tree confirmed clean. Nothing here executes; every wave below
is a draft for Brian's review. Silence is never approval.

## Context

Two surfaces carry the product's future LTV and neither is finished to
the current design system's standard:

- **A. The long-form creator design language.** Four quick creates
  (Character, World, Look, Story) and the advanced-editor package
  family exist and work, but predate or only partially adopted the
  locked token system: grey-on-gold border soup, dark-on-dark panels,
  always-expanded textarea walls, inconsistent counters. Quick creates
  are phone-first (couch usage at 390); the advanced editor is
  desktop-optimized but must stay fully comfortable at 390.
- **B. The chat surface**, the core play surface, is UNBUILT in the v2
  nine-page model (Stories row 4 explicitly excludes the chat room
  `[id]` surface; the standing sweep-scope ruling excludes chat from
  every mechanical pass because it was always owed a dedicated
  sitting). Baseline inspiration is the chat improvements in
  ~/dev/crestfall-main (crawled read-only this session); the plan must
  improve beyond that baseline. Chat is the highest-mobile-usage
  surface; 390 is the design width, desktop the check.

This gate produces the sequenced execution waves for both, sized for
Sonnet propagation sessions, with every human judgment call isolated
in OPEN FOR BRIAN.

## Law read this session (manifest item 5)

`docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md`,
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`, `docs/BUILD-BLUEPRINT.md`,
`docs/CONTRACT-REQUESTS.md`, `docs/CRESTFALL-DESIGN-CONTEXT.md`. All
current as of `0469c81`. Constraints that bind every wave:

- Tokens only (FRONTEND-SOP s17 token-first directive); no raw hex,
  no bg-black/NN panel fills, no type below 11px, no Tailwind default
  shadows/radii on governed surfaces; missing token = stop and report,
  never invent.
- LOOM shape on every package (Binding Shell, ViewModel, portable
  View, versioned contract, fixtures for every visible state, README,
  preview route) per FRONTEND-SOP s1.
- Contract law (s13): presentation may change, what a component
  reports may not; contract changes ride the same commit with a
  version bump and updated fixtures, and anything that forces a
  ViewModel/data-flow change stops and escalates.
- Mobile first at 390 (single column, no overflow, popovers inside
  viewport, 44px touch floor); R3 emulate-method verification; R4
  full-screen mobile modals; R7 sheet close-header.
- Chat surfaces were excluded from mechanical sweeps precisely so this
  dedicated sitting could design them; the story-room-message gold
  literals in the debt map are logged for THIS sitting to resolve.
- Confirmation on every consequential CTA; destructive law (quiet
  ghost trigger, filled danger only inside the confirm step, never
  `window.confirm`).
- No em dashes anywhere. Never sed/awk on markup or CSS.
- Chapter-1 ladder/state primitives exist (`--state-*`, elevation and
  blur ladders, mobile type pairs) and are locked where filled; kit
  packages consume them.

## Web research borrowed (manifest item 8)

Patterns adopted into the waves below, each chosen because it fits
Crestfall's existing law rather than fighting it:

1. **Docked composer, never floating; stream bottom padding equals
   composer height** (Setproduct, bricxlabs chat-UI patterns). Fits:
   the sticky-chrome law already gives us `--surface-3` docked chrome
   and `--topbar-h`-style derived constants.
2. **Streaming with a visible generation cursor is the baseline
   expectation; static all-at-once replies read as broken**
   (thefrontkit, patterns.dev AI UI patterns). Fits: motion tokens
   (`--dur-*`, `--ease`) and reduced-motion law already exist.
3. **Hybrid input: chat plus structured chips/cards for high-frequency
   actions** (UXPin, aiuxdesign.guide conversational-UI patterns).
   Fits: `KitDropdown`/chip recipes already exist; suggestion chips
   compose them rather than minting new controls.
4. **65 to 72ch reading measure and generous leading for long-form AI
   replies** (WCAG 2.2 via Setproduct). Fits: `--measure` 68ch is
   already a locked token; chat prose adopts it.
5. **Progressive disclosure for long forms, with the Baymard caveat:
   collapsed sections must never leave the user unsure what will be
   submitted** (Baymard accordion pitfalls; UXPin progressive
   disclosure; USWDS complex-form pattern). Adopted as: collapse
   long-form inputs to a summary-preview state until focus, but the
   collapsed state SHOWS its current value as a preview line, never
   hides whether it is filled. Filled state visible at a glance.
6. **Character counters appear when they inform, not always-on**
   (USWDS character-count component; Carbon counter spec). Adopted
   as: counter renders on focus and whenever above ~80% of limit;
   silent otherwise; at limit it takes `--status-danger` plus the
   word, matching the ruled form-field anatomy (BUILD-BLUEPRINT 2.8).
7. **Cast presence and who-answers-next as a first-class surface in
   multi-character chat; expression/portrait presence beside the
   stream** (SillyTavern group-chat and expression patterns via 2026
   roundups; the proof's own `chat.html` Cast panel witness). Fits:
   the legacy proof already sketched a Cast panel; we design it on
   the kit modal/sheet frames.
8. **Guided creation with archetype starters and real-time hints
   out-performs blank-page forms in companion-app onboarding** (Nomi
   onboarding pattern, MiniTavern card-builder pattern). Adopted
   narrowly: quick creates keep their stop rail but each stop leads
   with pick-one starter chips before free text, which the Character
   quick create's kind/face stops already do; extend that grammar,
   invent no new control.

Sources: UXPin chat-UI 2026, Setproduct AI-chat anatomy, bricxlabs 16
chat patterns, thefrontkit AI-chat best practices, patterns.dev AI UI
patterns, aiuxdesign.guide conversational UI, Baymard accordion
pitfalls, USWDS character count + complex forms, UXPin/LogRocket
progressive disclosure, CometChat chat-app practices, GetStream chat
UX, DreamJourney/SeaArt/Questie SillyTavern-landscape roundups,
MiniTavern card-builder blog, Hakko companion-app roundup.

## Figma note (manifest item 9)

Figma MCP tools are connected and available in this session, but no
Crestfall Figma file is referenced anywhere in the law docs, the
sprint plans, or the repo; there is no file key to pull. Noted and
continued per the manifest. If Brian has a Figma source he wants
mirrored into a future gate, that is a one-line addition to a later
brief.

## RESEARCH FINDINGS

### A. Quick creates: current state (manifest item 6, crawl 1)

Four quick creates live: Character (7 stops, shell contract
`creator-stops.view.v6`), World (5 stops, 1.1.0), Look (5 stops,
1.0.0), Story (5 stops, 1.0.0). World/Look/Story reuse Character's
shared `CreatorStopsView` shell unmodified. All are fixture-honest and
report clean semantic callbacks (`onSelectStop`, `onBack/onNext`,
`onSave`, `onFinishAndSave`, `onSaveAndOpenEditor`,
`onContinueInEditor`, `onDone`, `onClose`, discard pair, secondary
panel pair), so a restyle can hold contract law.

**Finding A1, the modal shell is hand-rolled and fails R4 at 390.**
`CreatorStops.view.jsx:119-136` renders a centered floating card inset
12px on all sides at 390, exactly the "small floating card" R4
forbids; the compliant recipe exists in
`components/kit/modal-frame/useKitModalFrameViewModel.js:32`. It also
uses the `sm:` 640px breakpoint while the whole kit uses
`min-[700px]:`; has no `role="dialog"`/`aria-modal`, no portal (the
containing-block bug KitModalFrame documents and avoids), no body
scroll lock; backdrop and close `aria-label`s are hardcoded "character
creator" on all four surfaces (wrong on three); the discard "dialog"
is an in-place body swap at `text-2xl`/`max-w-sm`; and Story stacks a
real KitModalFrame picker on top of the hand-rolled shell at the same
z-50, two modal systems visible at once. `.cf-modal-frame/.cf-modal-
veil/.cf-modal-close` in `app/design-system.css:123-158` are consumed
by zero components app-wide.

**Finding A2, dark-on-dark panels and border soup are real and
localized.** The four preview panels
(`CharacterPreview.view.jsx:23-27`, `WorldPreview.view.jsx:24-28`,
`LookPreview.view.jsx:27-31`, `CoverPreview.view.jsx:28-32`, near
identical copies) are the canonical case: `bg-black/45` +
`border-[var(--gold-ornament)]/20` wrapping `border-white/10` plus a
literal-black gradient, inside the modal's own `--line` border: three
border colors, two non-token, on a non-flipping dark fill.
`CustomValueField` adds `bg-black/20` + gold/25
(`character/shared/Controls.jsx:384`). Border soup peaks at 5 distinct
border treatments per file (`Controls.jsx`, `TemplatePanelBody.jsx`,
`CreatorStops.view.jsx`); selected states stack an inset gold
shadow ring ON TOP of a gold border (2px effective) at
`Controls.jsx:73,110,167,214` and kin, exactly what selection-state
law 2.16(i) retired on kit surfaces (gold mark + `--fill` wash, no
heavy outline).

**Finding A3, two input laws are live in one product.** Character's
`TextAreaField` is always-expanded auto-grow (no collapse);
World/Look/Story's `FoldingTextField` already implements
collapse-until-focus (collapsed at `--control-md`, expands on focus
or when filled) but is triplicated byte-for-byte. Counters: everywhere
on World/Look/Story; inconsistent on Character (Clothing style raw
input no limit, Chest/bust `TextField` has no maxLength param at all,
Age raw number input). No at-limit danger state anywhere in quick
creates, though `KitFormField.view.jsx:16-27` already ships one.

**Finding A4, violations inventory (counts).** Raw hex: 33 hits, all
Character, nearly all swatch DATA in `FaceStop.contract.js:6-47` and
`SealStop.fixtures.js` (semantic swatch values, a token-policy
question, not a styling bug). `bg-black/NN`: 4 product hits + the
Character preview sibling. `border-white/10`: 4. Tailwind default
text sizes: 88 hits (Character 44, World 16, Look 16, Story 22),
dominant pattern `text-3xl` stop headings + `text-sm` ledes.
`text-[10px]`: 8 hits, all the `FIELD_LABEL_CLASS` constant
copy-pasted four times plus swatch captions (queue item T10
territory). Zero: rounded-xl/2xl, Tailwind shadows, bridge vars,
sky/emerald/amber/red, pill text buttons.

**Finding A5, LOOM gaps.** No README anywhere in the four trees; no
ViewModel for the shell or any Character stop (state lives in the
modal files); five of seven Character stop contracts have no version
constant; version conventions are split (dotted v6 vs semver), the
open T14 question; World/Look/Story put the version constant at line
44-55, not line 1; stop views in World/Look/Story are named
`*StopView.jsx` breaking the `*.view.jsx` convention. Preview stops
hold `hasGenerated` useState inside `.view` files (state in a view,
against LOOM view rules).

**Finding A6, hand-rolled kit duplicates.** `InlineDropdown` (92
lines) duplicates KitDropdown minus its sheet-at-phone behavior;
`ChipRow`/`MultiChipRow` duplicate KitFilterChip; the four
`Controls.jsx` field primitives duplicate KitFormField (which already
has the folding disclosure, counter, and at-limit state); the
template-panel search duplicates the kit search input; cast/setting
rows duplicate kit row recipes; `InfoTip` (106 lines) has no kit
equivalent and is a promotion candidate. Correct reuse already in
place: KitArtPlaceholder, KitPickerModal (Story), Eyebrow, cf-btn
family, cf-field.

### B. Advanced editor: current state (crawl 2)

**B1, the split.** The v2 editor page itself
(`app/studio/v2/editor/**`, contract 1.2.0) is token-clean on every
violation pattern. 100% of the violations live downstream of its one
`sectionContent` slot, in the legacy tree it composes read-only
(`components/studio/my-creations/edit/**` plus the five standalone
creator editors reached through it).

**B2, violation scale (editor-reachable tree).** `bg-black/NN` 528,
`border-white/NN` 604, `text-xs` 391 + `text-sm` 422, `rounded-xl`
489, status-color Tailwind utilities ~340, `text-[10px]` 75 +
`text-[9px]` 5, raw hex 42 sites over 11 values. Hex hotspots: all 6
JSON editor modals share `bg-[#080706]` + `shadow-2xl`;
`LoreDocumentRenderer.view.jsx` hard-codes a 14-site parchment
palette including the T4 lore greens. Border soup: 22 files mix
`border-[var(--gold-ornament)]/NN` with `border-white/NN` (worst:
lore-editor 39 white + 11 gold); canonical 4-to-5-deep nested-border
stack witnessed in `LocationRuntimeModulesSection.view.jsx`.
Dark-on-dark: every `bg-black/NN` fill sits inside the editor's
`--surface-3` content panel; `CreationEditMediaPanel` stacks five
dark literals in one aside. Worst monoliths: mechanics-module family
22 packages / 8,456 view lines (12 of 22 use no SharedFields, ~50
hand-rolled selects, 14 contracts with no version constant);
TrackersModuleConfigModal 1,909 lines unpackaged; LoreEditor 2,025;
StatsPoolsEditor 1,741; LocationRegistryBuilder 1,692 (shared
between the create and edit trees).

**B3, SharedFields is the fulcrum.** One file
(`edit/sections/SharedFields.jsx`, 148 lines, unversioned) feeds 47
files and 82 TextAreaField sites, but its own internals are
off-token (`text-xs`, `rounded-xl`, `border-white/10`, `bg-black/35`,
`text-4xl` SectionTitle). Real defect: `TextField` accepts no
`maxLength`, and `CharacterIdentitySection.view.jsx:85,135` pass one
that is silently dropped (no DOM limit, no counter, while contract
and fixtures declare it). No select/number/checkbox primitive exists
(66 raw inputs, every select hand-rolled). TextAreaField already
folds (3 rows resting, 8 on focus) with an always-on counter; CR-041
coverage is complete on TAF sites, absent on every TextField and raw
input; limits are imported into Views rather than flowing through
contracts everywhere except location-prompt-guidance (the one
correct precedent).

**B4, organization problems.** Section registry is code, not data: a
21-arm ternary (`useCreationEditShellViewModel.js:79-121`) plus a
~90-guard flat dispatch (`CreationEditSectionContent.jsx:116-711`),
both marked read-only by the editor shell. Clone families: the
prompt-guidance quintet duplicated across 5 packages; three
identity sections identical except strings; the "6 TF + notes TAF"
grid cloned 5 times; six near-byte-identical 250-line JSON editor
modals (~1,532 lines of copy-paste); scenario story-circle renders 8
UNLABELLED textareas (label in a sibling `text-3xl` h3). Textarea
walls: up to 7 stacked long-form fields per section plus the 9-part
Advanced Prompting editor beneath.

**B5, mobile at 390.** Good bones: horizontally scrolling pill
section nav, single-column body, `overflow-x-auto` guard on the
content panel. Broken: `mobileNavOpen`/`onToggleMobileNav` are dead
props (computed, passed, never rendered); `creationType` and
`loadError` are declared but never supplied (header reads bare
"Editing"; the honest-stub error notice can never render);
`isLoreDocumentSection` declared, never used; sticky media rail only
at >=1280; `min-w-[560px]` table and `grid-cols-4` thumbnails at
390; JSON modals are `max-w-7xl`/`94vh` with a 58vh mono `text-xs`
textarea; field beds land ~42px, under the 44px floor; zero use of
the locked mobile type pairs anywhere in the section tree.

**B6, kit adoption is effectively zero.** 3 kit imports total in the
entire editor-reachable tree (all KitArtPlaceholder). 10 hand-rolled
`fixed inset-0` modal shells, 6 bespoke picker modals, ~20
hand-rolled badge copies, ~15 inline alert strips, one bespoke
216-line quick-nav rail, and 6 hand-rolled sticky-bar buttons beside
153 correct `cf-btn` uses. Clean already-restyled reference
packages exist (poses, image-presets, narrators, character-body,
character-advanced, creation-overview, both registry wrappers,
character-templates): the sweep pattern is proven, the mechanics and
lore trees just never received it.

**B7, contract-law blockers a redesign must route through (each an
explicit, versioned change in the waves below, never silent):**
supplying `creationType` and `loadError` (ViewModel change); wiring
or removing the dead mobile-nav props (contract change either way);
new editor seats need a contract bump; making limits contract-driven
touches ~35 section contracts (deferred, logged); the section
registry lives in two read-only-marked files; registry sections
restyle the create tree's builders by shared file.

### C. Chat baseline: crestfall-main inventory (manifest item 7, crawl 3)

Crawled end to end, read-only. The baseline is
`crestfall-main/Crestfall`'s `/studio/story-rooms/[id]` surface after
the Jul-Aug 2026 chat upgrades (commits `708664d` chat QoL, `1f9f2fc`
images in chat, `9bf17b2` chat upgrade, `a25329a` summary/export,
`dc8e89d` menu update, `c15352d` persistent share). Full LOOM shape
throughout (contract versions: chat-shell `story-room-chat-shell.
view.v2`, composer 1.5.0, message 1.4.0, transcript/cast/state/
drawer/NPC-manager 1.0.0).

**C1. The 100% functional inventory a new chat surface must account
for** (every item verified with file:line by the crawl):

- Layout: 3-column desktop grid (280px cast rail, transcript, 320px
  state rail), collapsible rails with reveal buttons; mobile drawers
  for Room-and-Cast and Chronicle State; desktop-only header
  (eyebrow, title, scenario+mode subtitle, rating and visibility
  pills, panel toggles); composer help panel.
- Message model: tones PLAYER / OPENING / SYSTEM / NARRATOR /
  CHARACTER / MEDIA; two body modes (SEMANTIC via
  `chat.responsePresentation.v1` segments typed DIALOGUE/NARRATION/
  TEXT with EMPHASIS/STRONG/WHISPER, plus trailing statusBlocks;
  LEGACY markdown-ish bold/action/quote); auto paragraph spacing;
  per-character seasonal color palettes (13 palettes x 7 roles,
  applied to segments, speaker label, avatar ring, card border).
- Message actions: Copy (with clipboard fallback + feedback),
  Regenerate and Continue (latest AI message only, mutually
  disabling, request-id guarded), Report (5 reason codes + 2000-char
  comment dialog). NO edit, delete, rewind, or branch exists.
- Transport: single POST returns all response messages; NO streaming
  anywhere. Optimistic send with failed-state bubble and draft
  restore; sending indicator "Crestfall Engine is composing...";
  summary-pending live-region card.
- Transcript: client windowing (12 initial, Load Earlier +10 with
  remaining count); NO server pagination (full snapshot per GET);
  unconditional auto-scroll (no scrolled-up suppression, no
  jump-to-latest button); hidden yield-turn records filtered; media
  messages re-slotted before/after their triggering message; opening
  hero image above first message.
- Composer: modes DIALOGUE/ACTION/OOC/DIRECT with per-mode
  placeholders; Shift+Enter newline, Enter send, IME-safe; three
  autocompletes (`/` commands: help, summary/recap, commands; `@`
  character mentions, structured; `#` location mentions, ranked
  current-adjacent-sibling, structured registry ids); speaker row
  (Auto, per-participant 44px portrait buttons, Random); empty-draft
  send becomes "Continue Scene" (PLAYER_YIELD_TO_AUTO); portrait
  click with empty text yields to that character; no composer
  maxLength; disabled stubs: Scene Image, Use Current Scene, mobile
  Export/Share.
- Cast panel: featured last-speaker media tile (deterministic image
  pick), room id, narrator line, cast cards (avatar, selection chip,
  role, Arriving/Present/Inactive state, entry notes), Set Player
  Character (gated to turnCount === 0, picker modal), Random Liked
  loader, Registry NPC manager (Loaded/Unload, Narrative Targets/
  Load Now, Available/Load, Previously Loaded/Reload, with notices),
  Delete Story (via `window.confirm`, 7-line copy).
- State panel: Scenario Phase (Current/Objective/Scenario), World
  State (Location, Time + source, Weather + source, engine-module
  aware), Knowledge Boundaries (static), Memory (static
  placeholders); Export Chat dialog (range: beat/scene/recent
  25/50/custom start-end, format TXT/MARKDOWN, blob download); Share
  Snapshot dialog (temporary 1-hour vs persistent Llama
  Guard-reviewed link, ACTIVE/REJECTED/FAILED/REVOKED states, copy
  and revoke); share route `/share/chat/[token]` (noindex,
  no-store).
- Session mechanics: start from template/creation (CHARACTER starts
  a room with defaultCharacterId; other types throw "not
  chat-enabled yet"); resume via full snapshot GET; per-turn
  server-side persistence; NO rename anywhere; bulk delete from hub;
  `/summary` boundary recap (single-flight). Runtime Mechanics Panel
  UNMOUNTED from chat in `dc8e89d` (client ops orphaned); mechanics
  reach the player only as statusBlocks.
- Monetization: ZERO inside chat (grep-verified); coins live in
  surrounding chrome; Library Passes gate auto-event media pools but
  purchase happens on the image-library page.
- API surface: 20 client functions in `storyRoomClient.js`
  (create/fetch/delete room, from-template, messages, message
  actions, summary, player-character, registry NPCs x3,
  random-liked, transcript-export, temporary/persistent share
  create+revoke, engine-module bindings x3); action types MESSAGE,
  PLAYER_YIELD_TO_CHARACTER, PLAYER_YIELD_TO_AUTO,
  REGENERATE_RESPONSE, CONTINUE_RESPONSE, REPORT_MESSAGE,
  SUMMARIZE_CURRENT_BOUNDARY.
- Known baseline defects (improvement openings, not to be copied):
  unconditional auto-scroll; desktop-only header (no mobile
  title/context); mobile persistent-share silently no-ops (callbacks
  omitted from mobile props); `room.phase` never set (empty state
  card); `window.confirm` delete (violates our destructive law);
  dead `previewStoryRoomTranscriptRange` (`requestJson` undefined);
  dead StoryRoomMobileToolbar; duplicated object keys in shell VM;
  no streaming; no jump-to-latest; no composer limit; NARRATOR sky
  and black/30 fills are off-token for this repo.

**C2. Crestfall-fe's own chat tree is a stale pre-upgrade fork.**
The full legacy story-rooms package family exists here (restyled by
the Aug sweeps, no feature commits) but is missing: message actions
(message contract stuck at 1.1.0 vs main's 1.4.0), `/summary`,
auto-event media + transcript ordering, opening hero image,
export/share dialogs and their 8 API routes, and it still mounts the
Runtime Mechanics Panel that main removed. `useStoryRoomChat.js` is
851 lines vs main's 1223; `storyRoomClient.js` 254 vs 423. The v2
Stories page is hub-only by explicit ruling. There is NO v2 chat
component anywhere.

**C3. The function map is stale for chat.** 62 CSV rows cover the
two story-room routes but record the pre-upgrade surface: no rows
for copy/regenerate/continue/report, summary, export, share,
auto-media, or hero image, and the mechanics panel is still recorded
live. The chat build must regenerate these rows (map refresh law,
FRONTEND-SOP s15).

## THE DESIGN, in one paragraph per surface

**Creator language.** One field system everywhere: KitFormField
(extended) on the quick creates, a tokenized SharedFields (API-kept,
internals rebuilt) on the editor tree, both expressing the same
grammar: label at `--text-label`, `--surface-1` input bed,
`--line-whisper` border, `--ink` value / `--ink-faint` placeholder,
long-form fields resting collapsed with a value-preview line (O1),
counters that appear on focus and past 80% of limit (O4), at-limit
`--status-danger` with the word. Panels flatten: one border per
nesting level, selection reads as gold mark + `--fill` wash per
2.16(i), every `bg-black/NN` and `border-white/NN` resolves onto the
opaque surface ramp and line family, dark glass dies. Quick creates
rehost onto KitModalFrame (R4 full-screen at 390, thumb scrolling);
the editor gains a real mobile section-nav sheet, a supplied
`creationType`/`loadError`, confirm steps on every consequential CTA,
and family-by-family sweeps that convert the 8,400-line mechanics
tree and its kin onto the shared primitives. JSON editing
consolidates onto one KitJsonEditor consumed by six thin wrappers.

**Chat.** A new v2 chat surface, built fixture-first as new LOOM
packages (nothing in the stale legacy tree is edited in place),
staged at `/studio/v2/stories/[id]`. It accounts for 100% of the
crestfall-main inventory in section C1 via the parity echo in wave
C6, and improves past it: streaming-ready message contracts with a
generation-cursor state (O9), scroll intelligence (auto-scroll
suppressed once the reader scrolls up, jump-to-latest pill), a
mobile context header (baseline has none), R4/R7 sheets for cast and
state panels, the destructive law replacing `window.confirm`,
per-character palettes applied as scoped CSS-variable role overrides
(O7, closing CR-016's display side), a 68ch reading measure with
`--font-display` narrator voice through tokens, and deliberate
engagement/monetization seats (O6). Composer keeps modes, the three
autocompletes, portrait speaker row, and Continue Scene, docked per
the research baseline with stream bottom padding.

## EXECUTION WAVES

Rules binding every wave: tokens only, missing token = STOP and
report; LOOM five files + README + preview route on every package
touched; fixtures for every visible state including longest-content;
contract changes only as listed, version bump + fixtures in the same
commit; no render-verification steps inside a wave; done = production
build exit 0, zero new out-of-contract grep hits for touched files,
function-map rows in the same commit, zero em dashes; report echoes
the wave manifest part by part. Brian render sittings happen BETWEEN
waves, at the checkpoints marked; waves carry the recommended OPEN
option pre-applied and swap cleanly if Brian picks another.

Lanes: Q (quick creates), E (editor), C (chat), K (kit foundation).
Lanes are disjoint by file set and can run in parallel; order inside
a lane is strict.

### K1. Kit field system upgrade
- Files: `components/kit/form-field/**`,
  `app/dev/ui-preview/kit-form-field/**`.
- Contract: KitFormField 1.0.0 -> 1.1.0, additive: `variant`
  (`text | textarea | select | number`), collapsed-preview resting
  state for long-form (O1), counter visibility rule (O4), `mono`,
  `disabled`, select options + `onSelect` passthrough composing the
  KitDropdown grammar (sheet under 700 per (d)).
- New fixtures: collapsed-empty, collapsed-filled-preview, expanded,
  select open/closed/sheet, number, at-limit, disabled, mono,
  longest.
- Deps: none. Sessions: 1. Risk: low, additive only.

### K2. KitJsonEditor
- Files: `components/kit/json-editor/**` (new package),
  `app/dev/ui-preview/kit-json-editor/**`.
- Contract: new, 1.0.0. Full-screen R4 modal on KitModalFrame, mono
  editor area (unlimited, CR-041-exempt), validate/apply action row,
  result-panel slots, error/success states with words.
- Deps: none. Sessions: 1. Risk: low, no consumer yet.

### Q1. Quick-create shell rehost (all four creators inherit)
- Files: `components/studio/create/character/creator-stops/
  {CreatorStops.view.jsx, CreatorStops.contract.js,
  CreatorStops.fixtures.js}`, `app/dev/ui-preview/creator-stops/**`.
- Contract: `creator-stops.view.v6` -> `v7` (additive
  `surfaceLabel` input to fix the hardcoded "character creator" aria
  strings; all callbacks unchanged). The four modals pass it in Q2;
  until then the default keeps today's string.
- Work: rehost the shell onto KitModalFrame (R4 full-screen at 390
  with internal thumb scrolling, portal, body scroll lock, Escape,
  `role="dialog"`/`aria-modal`/labelledby, 700px breakpoint aligned
  with the kit); discard confirm becomes a real layered confirm on
  the frame (destructive law); stepper, header, footer re-set on the
  type scale (`--text-title-m` and kin, no `text-3xl`/`text-2xl`);
  back/close controls adopt the frame's circular-control recipe.
- Deps: none. Sessions: 1-2.
- Risk: HIGH LEVERAGE, one file changes all four creators at once.
  CHECKPOINT: Brian render sitting on Character before Q2 lanes run.

### Q2a-Q2d. Quick-create field conversion, four parallel lanes
- Q2a Character: `components/studio/create/character/creator-stops/
  {shared/**, name-stop/**, kind-stop/**, face-stop/**,
  silhouette-stop/**, heart-stop/**, seal-stop/**, payoff-stop/**,
  CharacterCreatorModal.jsx}`,
  `components/studio/create/character/character-preview/**`, its
  preview routes.
- Q2b World / Q2c Look / Q2d Story: each package's own
  `creator-stops/**` tree + preview routes. Disjoint by
  construction (each carries its own Controls.jsx copy).
- Work, identical grammar per lane: field primitives convert to
  KitFormField 1.1.0 (kills the four Controls.jsx copies'
  hand-rolled TextField/TextAreaField/CustomValueField/
  FoldingTextField and the four `FIELD_LABEL_CLASS` `text-[10px]`
  copies); `InlineDropdown` -> KitFormField select /KitDropdown;
  ChipRow/MultiChipRow -> KitFilterChip toggle variant; selected
  states drop the stacked gold border + inset ring for 2.16(i) gold
  mark + `--fill` wash; counters on every text field including the
  three missing (Clothing style and Chest/bust adopt the package's
  160 custom-value precedent, logged in CR-041 reconciliation; Age
  stays a number field); preview panels rebuild per O2 (recommended:
  full-bleed art with `--canvas`-to-transparent scrim, no
  `bg-black/45`, no `border-white/10`, no literal-black gradient);
  `hasGenerated` state moves out of the `.view` files into each
  preview stop's ViewModel; Story's cast/setting rows adopt kit row
  + CircularClose recipes; READMEs written for every package; the
  five unversioned Character stop contracts gain version constants
  (dotted family per T14 live-majority rule); swatch hex in
  `FaceStop.contract.js`/`SealStop.fixtures.js` stays (semantic
  swatch DATA, logged with a pointer in the wave report, not
  converted blind).
- Contracts: World 1.1.0 / Look 1.0.0 / Story 1.0.0 bump ONLY if a
  prop is added (none expected; presentation-only conversion).
- Deps: K1, Q1, Brian's Q1 checkpoint. Sessions: 2 + 1 + 1 + 1.
- Risk: largest quick-create surface (Q2a); contract-law stop rule
  applies to any control that cannot map without a handler change.

### Q3. Quick-create close
- Files: `docs/APP-FUNCTION-MAP.csv` (rows for changed controls),
  `docs/CONTRACT-REQUESTS.md` (CR-041 ledger lines for the two new
  limits), wave grep ledger.
- Deps: Q2a-d. Sessions: 1. Risk: none.

### E1. SharedFields rebuilt in place (47 consumers, one file)
- Files: `components/studio/my-creations/edit/sections/
  SharedFields.jsx` (+ a README beside it).
- Work: internals move onto tokens (label `--text-label` +
  `--track-label`, bed `--surface-1`, border `--line-whisper`,
  radius `--radius-md`, type `--text-body`/`--text-ui`, SectionTitle
  onto `--text-heading`/`-m`, 44px min field height); TextField
  gains `maxLength` + counter + `placeholder` + `helperText` +
  `disabled` (fixes the silently-dropped-limit defect at
  `CharacterIdentitySection.view.jsx:85,135`); new `SelectField` and
  `NumberField` primitives (same grammar) for the later sweeps;
  long-form resting state per O1 and counter rule per O4 mirrored
  from K1 so both trees read identically.
- Contracts: none exist on this module today; a version header is
  added and noted, the module stays a plain shared primitive.
- Deps: none (parallel with K1). Sessions: 1.
- Risk: 47-file visual blast radius from one file; that is the
  point. CHECKPOINT: Brian render sitting on 3 representative
  sections before E3+ fan out.

### E2. Editor v2 shell hardening
- Files: `app/studio/v2/editor/**`,
  `components/studio/my-creations/creation-edit-shell/**`,
  `components/studio/my-creations/edit/
  creation-edit-sticky-action-bar/**`,
  `components/studio/my-creations/creation-edit-media-panel/**`,
  editor preview mirrors.
- Contracts: Editor 1.2.0 -> 1.3.0 (supply `creationType` and
  `loadError` from the ViewModel; wire the dead
  `mobileNavOpen`/`onToggleMobileNav` into a real mobile section-nav
  sheet per O11 recommended, KitModalFrame sheet with R7 header;
  wire `isLoreDocumentSection`); sticky action bar 1.0.0 -> 1.1.0
  (confirm steps for Submit for Public/Canon review and Unlist for
  Editing, hand-rolled buttons -> `cf-btn` family, save feedback
  tones on the status triad); CreationEditShell contract gains its
  missing version constant (1.0.0). ESCALATION NOTE, explicit: the
  shell and dispatch files are marked read-only by the editor's own
  comments; this plan is the escalation, Brian's GO authorizes
  exactly the listed changes and nothing else in them.
- Also: media panel retokenizes its five dark literals onto the
  surface ramp + scrim family, thumbnails grid responsive at 390.
- Deps: E1. Sessions: 2. Risk: the read-only boundary; the two
  ViewModel supplies are behavior-visible (header gains its type
  word, error notice becomes reachable) and get fixtures.

### E3. Character-family sections + Advanced Prompting
- Files: `components/studio/my-creations/edit/sections/
  {character-*, creation-overview-section,
  creation-publishing-section, creation-danger-section,
  character-templates, visual-references-section}/**`,
  `components/studio/characters/advanced-prompting/**`.
- Work: residual violations out (these are the cleanest families);
  danger zone archive/delete adopt kit confirm steps (destructive
  law); publishing selects onto SelectField; Advanced Prompting's
  six-deep dark stack and `text-[9px]` labels onto tokens, its
  per-section counters and 32,000 budget line onto the 2.8 counter
  anatomy.
- Deps: E1, E2. Sessions: 1-2. Risk: low.

### E4. Locations family
- Files: `components/studio/my-creations/edit/sections/locations/**`
  (incl. weather-module-config-modal, TrackersModuleConfigModal,
  location-parent-picker, sensory/attachments subs).
- Work: the canonical 4-deep border nest flattens (one border per
  level, beds by surface ramp); both config modals rehost onto
  KitModalFrame (R4); TrackersModuleConfigModal is tokenized in
  place and FLAGGED for later packaging (1,909-line monolith; a
  structural split is not smuggled into a restyle); raw inputs onto
  TextField/NumberField/SelectField.
- Deps: E1, E2. Sessions: 2. Risk: monolith churn; contract-law
  stops on any handler ambiguity.

### E5a-E5b. Mechanics-module family (largest sweep, split)
- E5a: `mechanics-composition-builder/**`,
  `mechanics-command-resolution/**` (2,375 view lines between
  them). E5b: the remaining 20 packages under
  `edit/sections/mechanics-modules/**` +
  `RuntimeMechanicsModulesSection.jsx` +
  `CreationEditMechanicsRuntimeQuickNav.jsx`.
- Work: tokens throughout (246 text-size hits, 236 dark fills, 244
  white hairlines); ~50 hand-rolled selects onto SelectField; badge
  copies onto KitBadge; alert copies onto the neutral/danger strip
  recipes; picker modals onto KitPickerModal; the quick-nav rail
  restyles on tokens (KitRail adoption deliberately NOT forced, it
  is a nav rail not a card rail; logged); the 14 unversioned
  contracts gain version constants (1.0.0, no shape change).
- Deps: E1, E2. Sessions: 2 + 2. Risk: highest raw volume; the
  clean-package sweep pattern from B6 is the template; every unit
  that cannot map mechanically STOPS per the escalation law.

### E6a. Lore family / E6b. Profile editors
- E6a: `components/studio/create/lore/**` (lore-editor 2,025 lines,
  lore-document-renderer, lore-publication-readiness,
  lore-engine-use, lore-json-editor). Applies O8's ruling for the
  parchment/green palette; until O8 is ruled the renderer's 14 hex
  sites are logged, not guessed (T4 law).
- E6b: `components/studio/create/{rules-codex, stats-pools,
  progression, actor-mechanics-profile}/**`.
- Work: same sweep grammar; hand-rolled overlay shells onto
  KitModalFrame; the six JSON modals are NOT touched here (E8).
- Deps: E1, E2; E6a additionally O8. Sessions: 2 + 2. Risk: lore
  editor size; shared-with-create-tree files (these ARE the create
  tree; the editor reaches them by import, both consumers verified
  by build).

### E7. Registries, room templates, scenarios, outfit/pose/preset residuals
- Files: `edit/sections/{item-registries, npc-registries,
  location-registries, structured-registries, wardrobes, storylines,
  room-templates, scenarios, outfits, poses, image-presets}/**` plus
  the shared builders they delegate to
  (`components/studio/create/**` registry builders, LocationRegistry
  1,692 lines, StructuredRegistry 812).
- Work: sweep grammar; scenario story-circle's 8 unlabelled
  textareas gain real field labels (presentation-only, the h3 copy
  moves into the label slot); multiplayer section's inline modal
  onto KitModalFrame; raw textareas onto TextAreaField.
- Deps: E1, E2. Sessions: 2. Risk: shared builders serve both the
  create flow and the editor; both routes must build; any apparent
  contract fork STOPS.

### E8. JSON editor consolidation
- Files: the six JSON modal packages (lore, rules-codex,
  stats-pools, progression, actor-mechanics-profile,
  mechanics-json-editor), each becoming a thin wrapper over
  KitJsonEditor; wrappers keep their own contracts and validators.
- Deps: K2, E6a/E6b/E5b (their trees). Sessions: 1. Risk: low;
  ~1,500 duplicated lines collapse.

### E9. Editor close
- Function-map rows for every control changed across E-waves; grep
  ledger before/after counts per FRONTEND-SOP s4 cadence; CR-041
  ledger reconciliation update; READMEs and version-constant audit.
- Deps: E3-E8. Sessions: 1. Risk: none.

### C1. Chat message + transcript packages (new build)
- Files: `components/studio/chat/{chat-message/**,
  chat-transcript/**}` (new LOOM packages, shells one level up),
  `app/dev/ui-preview/{chat-message, chat-transcript}/**`. The
  legacy `story-rooms/**` tree is NOT edited.
- Contracts: chat-message 1.0.0, a designed superset of
  crestfall-main's 1.4.0: six tones; SEMANTIC
  (`chat.responsePresentation.v1` segments + statusBlocks) and
  LEGACY body modes; auto paragraph spacing; palette role overrides
  per O7 (scoped CSS variables, `--chat-*` role names proposed to
  DESIGN-TOKENS as a chat-scoped family, STOP if the token proposal
  is rejected); media subtype; optimistic/failed states; and the
  streaming-ready additions per O9 (an `isStreaming` message state
  with generation cursor, contract-stable when transport lands).
  chat-transcript 1.0.0: windowing + Load Earlier with count, media
  re-slotting, opening hero image, sending/summary-pending/empty/
  loading/error states, and the improved scroll law: auto-scroll
  suppressed once the reader scrolls up, jump-to-latest pill,
  68ch measure (`--measure`), stream bottom padding equal to
  composer height.
- Fixtures: every tone x both body modes, palette on/off, streaming,
  failed, media before/after slotting, hero, windowed, empty,
  loading, error, longest.
- Message tones map onto tokens: PLAYER gold-wash bed (`--fill`),
  CHARACTER `--surface-2`, NARRATOR `--font-display` via token with
  a quiet bed, SYSTEM ink-family neutral strip (NO sky: the info
  color does not exist here), MEDIA chromeless per the viewer law.
  The story-room-message gold literals in the debt map resolve
  through this design (the dedicated sitting the debt map promised).
- Deps: none (kit exists). Sessions: 2-3. Risk: the palette token
  family needs a DESIGN-TOKENS proposal ruling at the checkpoint.

### C2. Chat composer package
- Files: `components/studio/chat/chat-composer/**`, preview route.
- Contract: chat-composer 1.0.0, superset of main's 1.5.0: modes
  DIALOGUE/ACTION/OOC/DIRECT with per-mode placeholders; `/` `@`
  `#` autocompletes with the same precedence and structured
  payloads; speaker row (Auto, portrait buttons at `--control-md`,
  Random); empty-draft Continue Scene and portrait-yield semantics;
  IME-safe key handling; docked layout, R4-safe, mobile tools sheet
  with R7 header; stop-generation seat (renders only when streaming
  transport exists, honest absence until then); composer length
  treatment per O5; Scene Image / Use Current Scene seats per O10.
- Fixtures: each mode, each menu open, yield states, pending,
  disabled, sheet open, longest draft.
- Deps: C1 (shares chat fixture grammar). Sessions: 2. Risk: the
  autocomplete interaction set is the densest logic in the plan;
  ported behavior-identical from the C1 inventory.

### C3. Cast panel, NPC manager, state panel
- Files: `components/studio/chat/{chat-cast-panel/**,
  chat-npc-manager/**, chat-state-panel/**}`, preview routes.
- Contracts: three new 1.0.0 contracts carrying the full C1
  inventory: featured last-speaker media tile, cast cards with
  selection/role/state/notes, Set Player Character (turnCount 0
  gate), Random Liked, registry NPC four-section lifecycle with
  notices; state panel's four cards (honest static placeholders
  KEPT honest), export/share/delete entry points. Desktop: the two
  rails, collapsible. Mobile: KitModalFrame sheets (R4/R7), not the
  baseline's drawer clones.
- Deps: C1. Sessions: 2. Risk: moderate; behavior parity is
  enumerated per control in the C6 echo.

### C4. Chat session dialogs
- Files: `components/studio/chat/chat-session-dialogs/**` (report,
  export, share, delete-confirm, summary-pending composition),
  preview route.
- Contract: 1.0.0. Report (5 reason codes + 2,000-char comment with
  counter), Export (range beat/scene/25/50/custom + TXT/MARKDOWN),
  Share (temporary vs persistent-reviewed with
  ACTIVE/REJECTED/FAILED/REVOKED states, copy + revoke with
  confirm), Delete Story on the kit confirm (the baseline's
  `window.confirm` and its 7-line copy carried into a real dialog).
  All on ModalShell/KitModalFrame. Confirmation on every
  consequential CTA is satisfied here and in E2/E3/Q1.
- Deps: C1. Sessions: 1-2. Risk: low.

### C5. Chat page shell + hub wiring + monetization seats
- Files: `app/studio/v2/stories/[id]/**` (new route),
  `components/studio/chat/chat-shell/**`,
  `app/dev/ui-preview/chat-v2-page/**`, plus the single touch on
  `app/studio/v2/stories/StoriesV2Mockup.jsx` routing continue rows
  and startable-shelf Play actions to the new route.
- Contract: chat-shell 1.0.0 (3-region desktop grid, collapsible
  rails, mobile context header with title/scenario/status pills,
  the improvement over main's desktop-only header) and a page
  contract 1.0.0. Fixture-first: one named mock module resolves
  `[id]` (header comment: mock, pending CR-043), carrying full
  snapshot fixtures; the send loop runs against the mock with
  optimistic states, honest about what is not live. Monetization
  seats per O6 recommended: coin chip in the chat header
  composing the existing economy widget data, and gated-action
  upsell sheets seated on Scene Image and Library-Pass moments
  (fixture-fed, CR-046 for real data).
- Deps: C1-C4. Sessions: 2. Risk: route seat is an engineering
  address, renamed at cutover like every v2 address.

### C6. Chat close: parity echo + function map + CR filings
- Files: `docs/APP-FUNCTION-MAP.csv` (regenerate the 62 stale chat
  rows into the new surface's row set),
  `docs/CONTRACT-REQUESTS.md` (filings below), the parity echo
  document in `docs/reviews/`.
- The parity echo walks section C1 of this plan item by item, each
  marked Present (file:line) / Deliberately excluded (ruling cited)
  / Flagged for Brian. Expected deliberate exclusions, each citing
  this gate: the Runtime Mechanics Panel (main itself unmounted it,
  `dc8e89d`); `window.confirm` (replaced by the ruled confirm);
  desktop-only header (replaced by the mobile header). Baseline
  drift against crestfall-main is re-checked at this wave and new
  upstream chat commits are listed, not silently absorbed.
- CR filings: CR-043 chat API catch-up (this repo's missing 8+
  routes and 13 client functions: message actions, summary,
  transcript-export, temporary/persistent share, plus the
  engine-binding orphans decision); CR-044 streaming transport
  (SSE/stream contract for `POST /messages`, the frontend is
  contract-ready per O9); CR-045 room rename (absent in baseline,
  product gap); CR-046 chat monetization data (balance,
  entitlements, gated-action pricing per O6); CR-016 updated (chat
  applies palettes display-side per O7).
- Deps: C1-C5. Sessions: 1. Risk: none.

## OPEN FOR BRIAN

Eleven rulings. Each is three options, the recommendation marked and
pre-carried into the waves above; a different pick swaps cleanly at
the named wave. Nothing here is resolved by this plan.

**O1. Long-form input resting state** (quick creates + editor, K1/E1)
- A (recommended): collapsed to one control-height line showing a
  preview of the entered value, expands on focus/tap; filled state
  is always visible at a glance. Why: the manifest's collapsed-until
  -focus with the Baymard never-hide-what-is-filled caveat; W/L/S
  already prove the interaction.
- B: today's 3-row resting fold (editor behavior). Why not: walls of
  3-row boxes are the current complaint; 7-field sections stay tall.
- C: label-only collapse (field hides its value until opened). Why
  not: hides whether a field is filled, the exact Baymard failure.

**O2. Preview-panel treatment** (the `bg-black/45` quartet, Q2)
- A (recommended): full-bleed art with `--canvas`-to-transparent
  scrim and over-art ink, the creation-card grammar. Why: matches
  the ruled card law, kills dark glass with zero new tokens.
- B: `--surface-1` well with framed art inside. Why not: keeps a
  panel-in-panel look, another border level.
- C: keep the dark-glass look, minted as a real token. Why not:
  requires a new token for a treatment the system retired.

**O3. Editor information architecture** (E2 onward)
- A (recommended): keep the tabbed section nav; regroup INSIDE
  sections (subgroup headers, O1 folding, clone-family
  consolidation); add a compact editor header summary. Why: full
  function preserved, no contract rewrites of the read-only
  registry, ships inside this gate.
- B: merge into fewer mega-sections with in-page anchors. Why not:
  forces the section-registry rewrite (two read-only files, 23
  arrays), heavy churn for navigation taste.
- C: progressive-disclosure dashboard rebuild (summary cards open
  focused editors). Why not: a new product surface, not an
  elevation; belongs to a later gate if wanted.

**O4. Counter behavior** (K1/E1)
- A (recommended): counter appears on focus and whenever past 80%
  of limit; at-limit turns `--status-danger` with the word. Why:
  USWDS/Carbon pattern, kills always-on noise, keeps the guardrail.
- B: always visible (today's editor behavior). Why not: 82 fields'
  worth of permanent noise.
- C: only at/near limit. Why not: no feedback while writing toward
  a budget on deep fields.

**O5. Chat composer length treatment** (C2)
- A (recommended): no hard cap; a quiet counter appears past a soft
  threshold (proposed 2,000) and the real ceiling arrives with
  Nick's backend truth via CR-043. Why: baseline has no cap, honest
  until the backend states one.
- B: hard cap now (pick a number). Why not: invents a limit no
  backend enforces.
- C: nothing (baseline). Why not: silent truncation risk when the
  backend does cap.

**O6. Chat monetization seats** (C5)
- A (recommended): coin chip in the chat header + upsell sheets
  seated on gated actions (Scene Image, Library Pass moments),
  fixture-fed, CR-046 for data. Why: engagement/LTV surfaces where
  intent is highest, zero dark patterns, honest stubs.
- B: chrome-only (baseline: coins in sidebar only). Why not: the
  manifest requires flows to support upsell and LTV; chat is the
  highest-usage surface.
- C: full paywall moments including message-quota UI. Why not: no
  backend quota exists; inventing one is fake state.

**O7. Character palettes in chat** (C1)
- A (recommended): port seasonal palettes as scoped CSS-variable
  role overrides per message (closes CR-016's display side); the
  role names enter DESIGN-TOKENS as a proposed chat-scoped family
  first. Why: the data and picker exist, the display side is the
  missing half, and tokens-first keeps it legal.
- B: tokens-only neutral launch, palettes later. Why not: loses a
  shipped-in-data differentiator the creator already selects.
- C: palette limited to speaker label + avatar ring. Why not: half
  a feature, the body is where reading happens.

**O8. Lore parchment + green palette** (E6a)
- A (recommended): mint the lore family properly (T4 lineage) at a
  render sitting, then convert the renderer onto it. Why: lore is a
  deliberate editorial voice; the greens are already named in
  DESIGN-TOKENS proposed.
- B: convert to existing gold/neutral tokens. Why not: erases a
  distinct voice without a ruling.
- C: exclude the renderer from the sweep, log only. Why not: leaves
  14 hex sites in the flagship reading surface.

**O9. Streaming posture** (C1/C2)
- A (recommended): streaming-ready contracts and cursor fixtures
  now; transport is CR-044 for Nick; the surface upgrades without a
  contract change. Why: research baseline says non-streaming reads
  as broken; contract-stability is cheap now, expensive later.
- B: request/response only, like baseline. Why not: bakes the
  weaker model into new contracts.
- C: build SSE transport frontend-side against a mock stream now.
  Why not: transport belongs to Nick's API; a mock protocol invents
  a contract he has not signed.

**O10. Scene Image / Use Current Scene composer seats** (C2/C5)
- A (recommended): design both flows fixture-first now (generation
  sheet with cost + confirmation, scene-describe action), honest
  stubs behind them. Why: they are the chat surface's engagement
  and monetization hooks and the baseline left them dead buttons.
- B: keep disabled stubs (baseline). Why not: dead controls on the
  core surface.
- C: remove from composer, move to the cast/state panel. Why not:
  buries the highest-intent action a tap away from the message.

**O11. Editor mobile section navigation** (E2)
- A (recommended): keep the scrolling pill row AND add a
  bottom-sheet section picker on a "Sections" control (R4/R7),
  wiring the dead mobile-nav props. Why: pill row preserves
  one-thumb adjacency, the sheet gives the 11-section overview 390
  lacks.
- B: pill row only (today). Why not: no overview; distant sections
  are many swipes away.
- C: sticky dropdown select. Why not: a select is the weakest
  pattern for 11 named destinations and adds a fourth sticky layer
  against the A2 sticky-budget ruling.

## CONTRACT AND CR LEDGER

Version bumps: KitFormField 1.0.0 -> 1.1.0 (K1); CreatorStops view
v6 -> v7 (Q1); Editor 1.2.0 -> 1.3.0 (E2); sticky action bar 1.0.0
-> 1.1.0 (E2). New contracts at 1.0.0: KitJsonEditor, chat-message,
chat-transcript, chat-composer, chat-cast-panel, chat-npc-manager,
chat-state-panel, chat-session-dialogs, chat-shell, chat page (10).
Version constants added with no shape change: CreationEditShell, 14
mechanics contracts, 5 Character stop contracts (20). W/L/S creator
contracts expected unchanged.

CR filings at execution: CR-043 chat API catch-up, CR-044 streaming
transport, CR-045 room rename, CR-046 chat monetization data;
updates to CR-016 (palette display side) and CR-041 (two new
quick-create limits + editor TextField enforcement now real).
Standing and untouched: CR-026 (Nick's quick/advanced promotion
pass), CR-031, CR-042. Per the standing Nick-engagement rule,
nothing is escalated to him mid-build; all CRs level-set at cutover
step 3.

## REPORT (one screen)

- **Waves:** 25 (K1-K2, Q1, Q2a-d, Q3, E1-E2, E3, E4, E5a-b,
  E6a-b, E7, E8, E9, C1-C6), ~33-38 Sonnet sessions, 4 lanes
  (K/Q/E/C) with disjoint file sets; wall-clock roughly 12-14 slots
  on three parallel lanes.
- **Packages touched:** ~100 (4 quick-create trees ~30 packages, 3
  kit packages incl. 1 new, ~55 editor-reachable packages, 10 new
  chat packages, 2 page shells).
- **Contract bumps:** 4 bumps, 10 new 1.0.0 contracts, 20 missing
  version constants added, 6 CR filings/updates.
- **Open rulings:** 11 (O1-O11 above), plus 3 standing checkpoints
  (Q1 shell render, E1 SharedFields render, C1 palette-token
  proposal).
- **Biggest risks:** (1) E2 edits files marked read-only, authorized
  only by GO on this plan; (2) the ~530 dark-fill + ~600 hairline
  conversions ride T2/T5/T8-shaped mappings ruled at the inter-wave
  render sittings, a wrong mapping is a mass visual change; (3)
  Q1's one shared file restyles all four creators at once (pilot
  checkpoint guards it); (4) chat is a fresh build against a moving
  crestfall-main baseline, drift re-checked at C6; (5) shared
  create/edit builder files serve two routes, both must keep
  building.
- **Recommended order:** K1 + E1 + C1 start in parallel; Q1 after
  K1; checkpoints after Q1 and E1; then Q2a-d, E2, C2 onward per
  lane; E8 last in E; C6 closes chat; Q3/E9 close their lanes.
  Nothing merges to the integration line without its wave report.

