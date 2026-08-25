# Build plan, 2026-08-23

Planned by Fable 5 on branch `design/ds1-claude-design-sync` at tip
`8bfbf96`, working tree clean, verified at planning time. Executor:
Sonnet, serial passes, one commit per pass. Subagents read-only.
This plan is the execution authority for this build; where it cites a
law doc, the law doc wins on values; where the 23 Aug spec conflicts
with older law, the spec is Brian's ruling and this plan records the
supersession.

## Context

Brian ruled a seven-pass build: mint a container law, reskin the v2
chat surface (party panel, roster, composer bar, state rail, tinted
bubble recipe), conform the seven v2 list pages to the filter-line
law, calm the Studio hub into three zones, conform the four quick
creates and wire advanced-editor entry, fix two walk defects
(creator-card media strip, Generate CTA cost placement), then close
with a session report. FE-owned skin only per FE-REVIEW-01: Views,
Kit, tokens, fixtures, page composition. No chassis logic, no routes
added or removed, no application ViewModels beyond the v2 page
ViewModels this repo already owns.

## Global constraints (verbatim law, apply to every pass)

- Branch: stay on `design/ds1-claude-design-sync`. Never touch the
  git branch `sync/merge_1` (Nick's unmerged work): no checkout, no
  merge, no rebase, no cherry-pick from it.
- `npm run build` exits 0 before EVERY commit. `npm run lint` clean
  for touched files. No render-verification steps in this build
  (ruled in the 23 Aug brief; supersedes SOP section 8 render steps
  for this build only; build-exit-0 and doc checks remain).
- No em dashes anywhere, code or docs. Check before each commit:
  `grep -rn $'\xe2\x80\x94' <touched files>` returns nothing.
- Never sed or awk on markup or CSS.
- Dark theme only. New tokens declare one value; mark light-theme
  value "same, interim (F1)" in DESIGN-TOKENS, matching the existing
  F1 convention.
- Buttons are soft-cornered rectangles (`--radius-md`), never pills.
  `--radius-full` stays legal for tags and icon-only buttons per the
  corners ruling.
- Status colors only ever ship with a word beside them.
- Token-first directive (SOP 17): no new raw hex, rgba, or bare
  Tailwind color utility outside `app/theme.css`. Run the
  DESIGN-TOKENS "Out of contract" greps on touched files per commit.
- Contract law (SOP 13): presentation may change, what a component
  reports may not. Contract version bumps land in the same commit as
  the prop change, semver, version constant on line 1, prose
  changelog note in the contract JSDoc and package README.
- Fixtures: filled variants for every new state, co-located
  `X.fixtures.js`, states at least default, empty, error, loading
  (where async), longest-content. Preview route under
  `app/dev/ui-preview/<name>/` for any NEW package, `notFound()` in
  production.
- `docs/APP-FUNCTION-MAP.csv`: add or update a row for every control
  added, removed, or rewired, same commit as the change.
- Contrast law (DESIGN-TOKENS "Contrast law"): no `--ink-faint`
  normal-size text on `--surface-3`/`--surface-4`; no status color as
  normal-size text on `--surface-2/3/4` (use the `-text` tier tokens
  where running text is needed).
- Copy renames are FE presentation only. `lib/shared/presentation/
  terminology.js` is NOT edited in this build.

Commit message format per pass: `build-0823(N): <summary>` with the
trailer lines the harness requires.

## Chosen values (the two minted laws)

**Container cap: 1200px, via the existing locked token
`--container` (75rem, `app/theme.css:341`).** No new token is
minted. Fluid padding is the existing StudioShell ramp:
`--space-5` under 640, `--space-8` to 1023, `--space-10` at 1024 and
up. Text measure cap: the existing locked `--measure` (68ch, inside
the ruled 45 to 75 character range). This supersedes BUILD-BLUEPRINT
2.16(l) "no max-width cap"; the editor family's existing
`mx-auto w-full max-w-[var(--container)]` pattern
(`app/studio/v2/editor/editor/Editor.view.jsx:311`) is the pattern
being generalized, so the editor is already compliant.

**Gap-6 clamp: relative-color lightness clamp on the speaker
anchor.** Speaker-name ink is derived from the user-picked anchor
color as `oklch(from var(--chat-speaker) clamp(0.70, l, 0.88)
min(c, 0.12) h)`: lightness clamped to the 0.70 to 0.88 band so the
name stays legible on dark surfaces, chroma capped at 0.12 so no
anchor can shout. Declared once in `app/theme.css` as
`--chat-speaker-name`; per-message anchors arrive as an inline
`--chat-speaker` custom property set by the View from contract data,
falling back to `var(--gold-ornament)` when a speaker has no color.

## PASS 1: Container law

Mint the law, apply it at the one width authority so every /studio
page (v2 pages, list views, chat route, story-room surfaces under
/studio/v2) is bounded and centered in a single edit.

Files to modify:
- `components/studio/studio-shell/StudioShell.view.jsx` (line 18):
  the content `<section>` gains `mx-auto w-full
  max-w-[var(--container)]`, keeping its existing padding ramp
  untouched. Do NOT change the padding tokens: the sticky filter
  bar's full-bleed negative margins are token-matched to them and
  will now correctly bleed to the container edge, not the viewport.
- Preview clients that re-create the shell section for auth-free
  preview get the same three classes so the harness mirrors product.
  Find them with `grep -rln 'pt-\[var(--space-20)\]'
  app/dev/ui-preview/` and apply the identical class addition to
  each (expected: the `*-v2-page` preview clients, including
  `chat-v2-page`).
- `docs/DESIGN-TOKENS.md`: add a "Container law, RULED 23 Aug 2026"
  subsection under "Spacing, radius, sizing" stating: every /studio
  page's content column is `max-width: var(--container)` (1200px),
  centered with auto margins, fluid padding on the StudioShell ramp;
  nothing full-bleeds past the container except intentional
  hero/banner art layers, whose content stays in the container; text
  blocks cap at `--measure`; form fields and cards never span wider
  than the container column they sit in; the chat thread column is
  bounded and centered like every other page; supersedes
  BUILD-BLUEPRINT 2.16(l).
- `docs/BUILD-BLUEPRINT.md` section 2.16(l): append one sentence
  marking it SUPERSEDED 23 Aug 2026 by the container law in
  DESIGN-TOKENS. Do not delete the historical text.

No contract bumps (no prop changes). No new fixtures (no new
states). Verify: build exit 0; spot-grep that no other file adds a
competing `max-w` cap on the shell path.

Commit: `build-0823(1): container law, shell content capped at
--container, law docs updated`

## PASS 2: Chat surface (the largest pass)

Scope: the v2 chat family `components/studio/chat/*` and the v2 page
files under `app/studio/v2/stories/[id]/`. The legacy
`components/studio/story-rooms/*` family and the legacy route
`/studio/story-rooms/[id]` are NOT touched (they are the live
production surface; the spec's "story-room-*" names map to the v2
chat-* packages, recorded in ASSUMPTIONS).

### 2a. Tokens minted (one commit with everything else in this pass)

`app/theme.css` additions, plus matching rows in
`docs/DESIGN-TOKENS.md` (role, legal-on, never-on, status locked,
light value "same, interim (F1)"):
- `--radius-bubble: 16px`. Chat message bubbles only. Never any
  other surface (the radius tier table is otherwise untouched).
- `--chat-bubble-fill: color-mix(in srgb, var(--chat-speaker,
  var(--gold-ornament)) 9%, transparent)`. Bubble fill.
- `--chat-bubble-line: color-mix(in srgb, var(--chat-speaker,
  var(--gold-ornament)) 22%, transparent)`. Bubble border.
- `--chat-avatar-fill: color-mix(in srgb, var(--chat-speaker,
  var(--gold-ornament)) 12%, transparent)`. Avatar tile fill.
- `--chat-speaker-name: oklch(from var(--chat-speaker,
  var(--gold-ornament)) clamp(0.70, l, 0.88) min(c, 0.12) h)`.
  Speaker-name ink, the gap-6 law.
Document the gap-6 law as its own short subsection ("Gap-6 law,
RULED 23 Aug 2026") in DESIGN-TOKENS: the clamp recipe above, plus:
body text ink inside a bubble is NEVER speaker-colored, it stays
`--ink`; `--chat-speaker` is a per-message inline custom property
set by ChatMessage from contract data, never declared globally.
Also annotate the existing "Proposed" table row for the
`--chat-msg-*` family: superseded by this ruling for the display
side; the fixture-only palette demo code may remain until removed by
a later pass.

### 2b. Shell: `chat-shell`

`components/studio/chat/chat-shell/ChatShell.view.jsx`:
- DELETE the chat-local desktop header (lines 206-255) and mobile
  header (lines 257-279). The real StudioShell top bar and sidebar
  already wrap the route via `app/studio/layout.js`.
- ADD an in-flow story header block at the top of the thread column:
  story title (h1, `--text-title`) plus one meta line (`--ink-dim`)
  built from the existing subtitle and statusPills data. Rating
  vocabulary in that meta line reads "Young Adult", never "PG-13"
  (and never the current fixture's "Mature"): update
  `ChatShell.fixtures.js` statusPills accordingly and the mock at
  `app/studio/v2/stories/[id]/chatV2StoryMock.js`.
- Keep the rail-collapse affordances by moving the two collapse
  chevrons into the rails' own panel headers (cast/state panels
  already own PanelLeftClose/PanelRightClose controls; drop the
  shell duplicates).
- Remove the shell's duplicate `border-t` wrapper styling around the
  composer (composer keeps its own single top edge).
- De-busy: strip redundant hairlines and the double-boxing where the
  shell's rail already carries a border and background that the
  panel aside repeats. One box per surface: the rail keeps the
  background, the panel content loses its own border wrapper.
- Fix the dead coin chip while in the file: `StoryChatPage.jsx`
  passes `coinBalanceLabel` but the View expects `coinChip`; align
  the page shell to pass `coinChip` (page-file fix, no contract
  change to chat-shell).

### 2c. Party panel: `chat-cast-panel`

`components/studio/chat/chat-cast-panel/` (package name unchanged,
copy renames only):
- Rename Cast to Party in every user-visible string: panel eyebrow,
  headings, trigger button label ("Party" replaces "Room & Cast"),
  aria labels, fixture copy. Also the composer MobileToolsSheet
  label and any chat-family "Cast" copy found by
  `grep -rn 'Cast' components/studio/chat/ app/studio/v2/stories/`.
- Fixed 5 slots, vertical rows: each row 38px avatar tile
  (`h/w-[var(--control-filter)]`, non-interactive tile inside the
  interactive row, `--chat-avatar-fill` when the member has a color,
  `--surface-2` otherwise), full name (`--ink`), role subline
  (`--ink-dim`). Unfilled slots render dashed
  (`border-dashed border-[var(--line-strong)]`) with the exact copy
  "Open slot · 5 max".
- Double-click a member row, or single tap/click an open slot, opens
  the Party roster (new callback `onOpenPartyRoster`, additive).
- REMOVE from this panel: Set Player Character, Random Liked, Delete
  Story (and their props from the contract). Keep the NPC manager
  mount and the Room List anchor. Delete Story moves to the right
  state panel (2e); the DeleteConfirmSheet import moves with it.
- Scene art when unset: icon-only geometric placeholder well per the
  missing-image law (BUILD-BLUEPRINT 2.16(ac)): the `i-59` sprite
  (`/assets/icons/icons-v7.svg#i-59`) dead-centered, NO caption text
  (delete the current emptyEyebrow/emptyMessage rendering). The well
  is a button; click invokes new callback `onOpenSceneImagePicker`.
  The page ViewModel routes it to the existing FixtureActionNotice
  stub until the real selector ships (HIDE/STUB law; logged in the
  session report).
- Contract: MAJOR bump (props removed). Fixtures: full-party (5),
  open-slots (2 filled, 3 dashed), empty (0 filled, 5 dashed),
  loading, error, longest, mobile-sheet-open.

### 2d. Party roster: NEW package `chat-party-roster`

New files:
- `components/studio/chat/ChatPartyRoster.jsx` (thin re-export shell
  matching the family pattern)
- `components/studio/chat/chat-party-roster/ChatPartyRoster.view.jsx`
- `components/studio/chat/chat-party-roster/useChatPartyRosterViewModel.js`
- `components/studio/chat/chat-party-roster/ChatPartyRoster.contract.js`
  (line 1: `export const CHAT_PARTY_ROSTER_CONTRACT_VERSION = "1.0.0";`)
- `components/studio/chat/chat-party-roster/ChatPartyRoster.fixtures.js`
- `components/studio/chat/chat-party-roster/README.md`
- `app/dev/ui-preview/chat-party-roster/page.jsx` plus its preview
  client (fixture-switching, `notFound()` in production)

Recipe:
- Desktop: `KitModalFrame` with `panelClassName="w-full max-w-[560px]"`,
  panel surface on `--grad-panel-lift` per the modal law. Title
  "Party", slot-count subline ("N of 5 slots filled"), search bed
  (`--bed-deep` + `--shadow-bed` field recipe), filter chips All /
  Characters / NPCs / Liked (soft rectangles, `--radius-md`), sort
  control (Recent), rows at 44px (`--control-md`): avatar, name,
  role; row right side shows a quiet "In party" label
  (`--ink-faint` on the row surface where legal, else `--ink-dim`)
  or an Add control as a soft-rectangle ghost button.
- Mobile (under 700): same content as `KitModalFrame
  variant="sheet"` with grabber and the frame's circle-x close;
  every touch target 44px.
- Client-side fixture-driven search/filter/sort inside the
  ViewModel. Selection reports through semantic callbacks
  (`onAddMember`, `onRemoveMember`); the page ViewModel applies them
  to mock state (cap 5 enforced in the ViewModel, over-cap add
  disabled with the word "Party full" beside the disabled control).
- Fixtures: default, empty results, full-party (adds disabled),
  loading, error, longest-content, mobile-sheet.

`components/kit/modal-frame/` gains an optional additive
`sheetGrabber` boolean (renders a small centered grabber bar above
the sheet header row; `--line-strong` fill, decorative,
aria-hidden). Contract 1.2.0 to 1.3.0, additive, fixtures gain a
grabber variant.

### 2e. State panel: `chat-state-panel`

- Top: management icon row, three lucide icons Share2, Download,
  Trash2 in 38px soft rectangles (`h/w-[var(--control-filter)]
  rounded-[var(--radius-md)]` with the standing coarse-pointer
  `min-h/w-[var(--control-md)]` override). Delete carries
  `--status-danger` ink per the quiet-delete law (quiet trigger, no
  fill; visible word "Delete" beside the icon row is required by the
  status-word law: render the three controls with 11px labels under
  the icons, "Share", "Export", "Delete"). Delete opens the existing
  `DeleteConfirmSheet` from `chat-session-dialogs` (moved consumer;
  the confirm button already follows the B5 danger recipe).
- Below: World, Knowledge, Mechanics as quiet key-value rows: no
  boxed StateCards, label left `--ink-dim`, value right `--ink`,
  section labels as fade-line rules (`--line-fade`, the `.fdiv`
  pattern). Sections and rows stay contract-driven; update fixtures
  to ship exactly World, Knowledge, Mechanics (Mechanics content
  drawn from the legacy runtime-mechanics vocabulary as fixture
  data; scenario/memory rows fold into these three or drop, fixture
  decision).
- Contract: MINOR bump (delete action id added to the actions
  vocabulary; sections shape unchanged). Fixtures: complete, empty,
  loading, error, delete-confirm-open, longest, mobile-sheet.

### 2f. Composer: `chat-composer`

- One action-bar grid at BOTH breakpoints, replacing the current
  split anatomy: `[menu icon 40px] [Auto] [Party] [Dialogue +
  disclosure]`, the three chips sharing remaining width equally
  (`grid-cols-[40px_1fr_1fr_1fr]` with the standing gap token), 36px
  tall (desktop; coarse-pointer override to 44). Lucide icons: Menu,
  Sparkle, Users, MessageSquare.
- Menu opens the RIGHT story/state panel (`onOpenStatePanel`). Party
  chip opens the LEFT party panel (`onOpenPartyPanel`). Dialogue
  chip pops the mode picker with the three presented modes Dialogue,
  Action, Suggestion (disclosure caret on the chip). At 390 both
  panels arrive as `KitModalFrame variant="sheet"` bottom sheets
  (already the panels' mobile pattern; the composer callbacks route
  to the same open handlers).
- Mode contract: the picker presents Dialogue / Action / Suggestion.
  Contract gains mode id `SUGGESTION`; `OOC` and `DIRECT` remain
  contract-legal but are not surfaced in the default picker.
  Recorded as a product-behavior note for Nick in the session
  report. MAJOR bump on the composer contract (anatomy and mode
  surface change).
- REMOVE the "Next Speaker" label row (v2 has no enter-to-send hint;
  confirmed absent, nothing to remove there). Speaker selection
  moves inside the Party panel flow; the SpeakerButtons strip is
  removed from the composer surface.
- Input bed and Send share 44px height (`--control-md`). Desktop
  Send: `cf-btn cf-btn--primary` with text "Send". Mobile Send: 44px
  icon-only lucide Send, soft rectangle (`--radius-md`), NOT the
  current `rounded-full` pill.
- Composing indicator: spinner (`Loader2` motion-safe spin) plus the
  exact text "Composing..." only; remove other streaming copy from
  the indicator (the stop control may remain as a control, not as
  part of the indicator).
- Scene-image button: label reads the action only ("Scene Image");
  its cost moves to the quiet note (this overlaps Pass 6 and is done
  here for this file).
- Fixtures: default, composing, party-open, state-open, mode-picker
  open, 390 sheet variants, longest draft, error.

### 2g. Message bubbles: `chat-message` and `chat-transcript`

- Tinted bubble recipe: bubble fill `--chat-bubble-fill`, border
  `--chat-bubble-line`, radius `--radius-bubble`, avatar tile
  `--chat-avatar-fill`, speaker name `--chat-speaker-name`. The View
  sets `style={{ "--chat-speaker": speakerColor }}` when the
  contract supplies a color (additive `speakerColor` prop, MINOR
  bump); no color means the gold-ornament fallback renders.
- Body text ink stays `--ink` always. Narration renders italic
  INSIDE the speaker's bubble (fold narration segments into the
  bubble rather than a separate narrator surface where the speaker
  is known; system messages unchanged).
- Player turns right-aligned, `max-w-[70%]` at desktop and
  `max-w-[86%]` at 390 (replace `max-w-3xl`).
- Transcript column: bounded by the Pass 1 container; message text
  respects `--measure` via the bubble caps above.
- De-busy: remove per-message redundant hairlines; spacing and the
  bubble border do the separating.
- Fixtures: per-speaker-color conversation (3+ distinct anchors),
  no-color fallback, narration-in-bubble, player 390, longest.

### 2h. Page wiring

`app/studio/v2/stories/[id]/StoryChatPage.jsx`,
`useChatV2StoryPageViewModel.js`, `chatV2StoryMock.js`,
`StoryChatPage.contract.js`:
- Wire party roster open/close state, party membership mock state
  (cap 5), scene-image picker stub, panel open handlers for the
  composer chips, coinChip fix, "Young Adult" rating label.
- StoryChatPage contract 1.0.0 to 1.1.0 (additive wiring).
- Update `app/dev/ui-preview/chat-v2-page/` to exercise the new
  states; update each touched package's preview route.

APP-FUNCTION-MAP.csv: rows for every removed cast-panel button
(mark relocated/removed), the new roster controls, the composer
action bar, the state-panel icon row.

Commit: `build-0823(2): chat surface, party panel and roster,
composer action bar, state rail, tinted bubble law`

## PASS 3: List views

Packages/files:
- NEW `lib/shared/presentation/typeBuckets.js`: the five-bucket
  constants (`characters`, `worlds`, `looks`, `stories`,
  `adventures`) and the `ASSET_KIND_TO_TYPE_BUCKET` map, promoted
  from the two identical copies.
- `app/studio/v2/vault/VaultV2Mockup.jsx` and
  `app/studio/v2/community/CommunityV2Mockup.jsx`: consume the
  shared module, delete the local copies. (The 23 Aug spec ratifies
  the five-bucket filter as the standard where a list mixes asset
  kinds, resolving the unratified-extension comment in Community;
  note that resolution in the session report.)
- Five-bucket applicability: Vault and Community only. Stories keeps
  its playable-kinds filter (Character / Story / Adventure); Images,
  Adventures, Lore, Creators keep their domain filters and sorts.
  Recorded in ASSUMPTIONS.
- Verify (and fill any gap found) that client-side fixture-driven
  search, sort, and every declared filter actually filter on all
  seven pages: Stories, Adventures, Images, Vault, Community,
  Creators, Lore. Known wiring already exists everywhere; the deep
  checks are Creators search (`CreatorsV2Mockup.jsx`) and Adventures
  search/sort (`useAdventuresViewModel.js`). Server-side remains
  CR-042 (Nick), unchanged: no fetch, no API surface.
- Filter line: already sticky and docked via `--topbar-h` on all
  seven (KitStudioFilterBar.view.jsx:172). Work here is
  conformance, not construction: confirm each page passes search,
  sort, and its filter groups on the ONE line, no page-local second
  control rows.
- Two-up list density at 1100 and up: already shipped on Images,
  Stories, Community, Vault, CreatorConnections. Adventures and
  Lore have no list mode, so two-up does not lawfully apply there;
  SKIPPED with reason in the session report.
- De-busy pass on list rows and cards: remove doubled hairlines and
  nested bordered boxes inside rows/cards on the seven pages; the
  card law (full-bleed art, BUILD-BLUEPRINT 2.16(a)) stays intact.
- Containers arrive from Pass 1 automatically; verify no page adds
  its own competing cap.

No kit contract bumps expected (KitStudioFilterBar props unchanged).
Fixtures: only where a filter gap is filled (add the state that
proves it filters, e.g. an empty-result search fixture per page that
lacked one).

Commit: `build-0823(3): list views, shared five-bucket filter,
filter-line conformance, de-busy`

## PASS 4: Studio hub

Files: `app/studio/v2/studio/Studio.jsx`,
`app/studio/v2/studio/studio/{Studio.view.jsx, useStudioViewModel.js,
studioContent.mock.js, Studio.contract.js, Studio.fixtures.js,
README.md}`, preview mirror
`app/dev/ui-preview/studio-v2-page/StudioV2PagePreviewClient.jsx`.

- Remove the LevelSelector tablist (Roman numerals, altitude tabs,
  depth meters) and the three mutually exclusive panes. One calm
  scroll, three zones in order, plain zone labels (fade-line section
  labels, no numbering, nothing sequential):
  1. CREATE: the four live quick-create doors (Character, Worlds,
     Looks, Stories) plus the existing Player Character door left
     exactly in its `isLive: false` "Soon" state, plus a quiet line
     "Prefer full control? Start in the advanced editor" routing to
     `/studio/v2/editor`.
  2. BUILD: two doors/rows, "Build a Story" (opens
     StoryCreatorModal, same handler as today) and "Build an
     Adventure" (routes to `/studio/v2/adventures`, where the
     builder CTA lives; no new builder is stubbed).
  3. PUBLISH: one line routing to `/studio/v2/vault`.
- The Full Studio tool-card grid (11 cards, 10 "Soon") does not fit
  the ruled three-zone model and is dropped from the page; its one
  live path (character editor) is covered by the advanced-editor
  line. Dropped cards listed in the session report. No new doors are
  built or stubbed for never-built features.
- While in the file: dead doors currently keep `onClick` and tab
  focus with only `aria-disabled`; render Soon doors as
  non-interactive (real `disabled` on the button), a defect fix
  inside this task's scope.
- Keep the fixture-mode harness and modal open/close wiring in
  `Studio.jsx` as is.
- Studio contract 1.3.0 to 2.0.0 (structure props change). Fixtures:
  default, empty, longest re-authored for the zone model.
- Sidebar refinement (v2 preview sidebar, ruled by Brian 23 Aug from
  the walk). Files:
  `components/studio/studio-sidebar/{StudioSidebar.view.jsx,
  useStudioSidebarViewModel.js, StudioSidebar.contract.js,
  StudioSidebar.fixtures.js, README.md}`,
  `components/studio/studio-economy-widget/{StudioEconomyWidget.view.jsx,
  StudioEconomyWidget.contract.js, StudioEconomyWidget.fixtures.js,
  README.md}`, preview mirrors
  `app/dev/ui-preview/studio-sidebar/` and
  `app/dev/ui-preview/studio-economy-widget/`:
  1. Remove the Notifications CTA from the sidebar entirely: the
     economy widget's `expanded` and `collapsed` layout modes lose
     their Notifications buttons (the large secondary CTA and the
     collapsed bell). Notifications live in the top bar bell only.
     The `mobileHeader` layout mode keeps its bell for its own
     consumers; the notifications props stay in the contract for
     that mode.
  2. Coins area streamlined to the compact pattern in the
     `expanded` mode: ONE row, coin glyph plus coin count
     (`--ink`, `--text-ui`) left, a small "Buy Coins" chip right
     (soft rectangle, `--radius-md`, ghost recipe, `--control-sm`
     height with the coarse-pointer `--control-md` override). No
     boxed section, no stacked large buttons. This also retires the
     mode's out-of-contract literals (`rounded-xl`, `bg-black/40`,
     `text-[10px]`, `text-xs`, gold slash-alpha borders), replacing
     them with tokens per the token-first directive. `collapsed`
     mode keeps a single icon-only coins control.
  3. Signed-in area streamlined, at the very bottom of the sidebar:
     one signed-in row (avatar initial, name/email truncated) with
     the Discord and Settings icons inline on that same row,
     right-aligned; directly under it, Log out as a quiet row
     (existing quiet recipe, word beside the icon). No oversized
     blocks; the current stacked block-plus-icon-row anatomy
     collapses into these two rows.
  4. Preview mode DROPS the collapsed Legacy group entirely; the
     nine-page model groups plus lawful supporting entries (the
     rows above) are all that render. Flag-off (production)
     rendering untouched, cutover state untouched. Update the flag
     description in `docs/FRONTEND-SOP.md` section 18 in the same
     commit (the 23 Aug ruling supersedes the "legacy links
     collapse into a Legacy group" sentence for preview mode).
  5. Vault icon: add `archive: Archive` (lucide) to the sidebar
     ICONS map and set the Vault entry's iconKey to `archive`, the
     repo's standing archive/vault glyph (witness:
     `components/kit/creation-card/KitCreationCard.view.jsx`
     Archive action). The `castle` key remains for the Account
     utility link.
  6. Nav density, minted from existing tokens (recorded here as the
     ruled recipe): nav rows `min-h-[var(--control-sm)]` (32px,
     desktop-dense is legal, the sidebar is lg-and-up chrome) with
     the standing `[@media(pointer:coarse)]:min-h-[var(--control-md)]`
     override; row vertical padding `--space-1`; nav item type
     `--text-label` with `--lh-label` and `--track-normal` (the
     one scale step below `--text-ui`; no off-scale 12px is
     invented); icons stay 16; group headers keep their existing
     `--text-label` treatment; group-to-group gap tightens
     `--space-3` to `--space-2`; divider margins `--space-4` to
     `--space-3`. Goal: the whole sidebar fits common desktop
     viewport heights with NO internal scroll; keep
     `lg:overflow-y-auto` as a safety only.
  7. Sidebar and economy-widget fixtures re-authored to the new
     anatomy; both preview mirrors updated.
- APP-FUNCTION-MAP.csv rows for removed/relocated hub controls,
  sidebar entries, the removed Notifications CTA, and the reshaped
  coins/signed-in controls.

Commit: `build-0823(4): studio hub three-zone scroll, sidebar
refinement to the ruled nine-page model`

## PASS 5: Quick creates and editor entry

Files: `components/studio/create/character/creator-stops/
CreatorStops.view.jsx` (the shared shell for all four),
`CharacterCreatorModal.jsx`, `world/creator-stops/WorldCreatorModal.jsx`,
`look/creator-stops/LookCreatorModal.jsx`,
`story/creator-stops/StoryCreatorModal.jsx`, their
`*CreatorStops.contract.js` and `*CreatorStops.fixtures.js`, the four
`shared/Controls.jsx` files only if divider recipes move.

- Conform the shared shell to current law:
  - Panel surface: `--grad-panel-lift` (B3) replacing the color-mix
    plus fill-whisper gradient background.
  - Fade dividers: header and footer hairline pseudo-elements become
    `--line-fade` rules; no boxed sections anywhere in stop content
    (stops are already flat; sweep the secondaryPanel takeover for
    boxed sections and convert to fade-divider separation).
  - Circle close: keep the existing circular control; fix the
    hardcoded `aria-label="Close character creator"` to a
    per-creator label prop (additive contract prop, correct value
    passed by each of the four modals).
  - Stop rail with icons: already present (STOP_ICONS); keep.
  - Status word always visible: remove the `hidden sm:inline` on
    "Unsaved changes" so the status span renders at every width.
  - Footer, max two actions: [circular Back arrow, navigation] +
    status word + spacer + secondary + primary only. The "Save and
    open the advanced editor" footer button is REMOVED from the
    last-stop footer; advanced-editor entry lives in the saved
    state, whose existing actions already route to
    `/studio/v2/editor/{id}?origin=studio`. Saved-state actions:
    "Open in advanced editor" (secondary, the lawful exit) and
    "Done" (primary).
  - Container-bounded: the panel width cap (46rem) already complies;
    at 390 the panel becomes a full-height sheet (R4 law:
    full-bleed vertically and horizontally with internal thumb
    scrolling), replacing the current inset-floating panel at phone
    width.
- Editor entry wiring: Pass 4's hub line routes to
  `/studio/v2/editor` (the index picker page becomes reachable
  in-app for the first time; its stale header comment about the
  Full Studio door is corrected to name the hub line). Editor
  internals are ED1E/ED1F law and are NOT redesigned; entry only.
- Contract bumps: each `*CreatorStops.contract.js` MINOR (additive
  close-label prop, footer action removal is presentation of
  existing saved-state routing, but if a footer-action prop is
  deleted from a contract, that file takes a MAJOR instead; follow
  the file's actual shape).
- Fixtures: per creator, last-stop, saved-state, discard-confirm,
  390 full-height sheet, longest.
- APP-FUNCTION-MAP.csv rows for the removed footer control and the
  hub editor line.

Commit: `build-0823(5): quick-create shell conformance, advanced
editor entry wired`

## PASS 6: Walk defects

- Creators cards, three-slot media strip law:
  `components/kit/creator-card/KitCreatorCard.view.jsx` mirrors the
  16dac8b KitAssetDetailPopup treatment exactly: `IMAGE_SLOT_COUNT
  = 3`, a `MediaSlotTile` that renders a real thumbnail
  (`aspect-square rounded-[var(--radius-md)] object-cover`) or the
  lawful placeholder well (`bg-[var(--surface-2)]
  text-[var(--ink-faint)]` with the `i-59` sprite), grid
  `grid-cols-3 gap-[var(--space-2)]`, strip ALWAYS renders (delete
  the `thumbnails.length > 0 &&` guard). Radius moves `--radius-sm`
  to `--radius-md` and gap `--space-1` to `--space-2` to match the
  ruled popup treatment. Contract MINOR bump (behavior note; props
  unchanged). Fixtures: zero-thumbnail, one-thumbnail,
  three-thumbnail variants in `KitCreatorCard.fixtures.js`.
- Generate CTA cost placement, applied at every occurrence of
  cost-in-label:
  - `components/studio/create/character/character-preview/CharacterPreview.view.jsx:46`
  - `components/studio/create/world/creator-stops/look-stop/WorldPreview.view.jsx:47`
  - `components/studio/create/look/creator-stops/look-stop/LookPreview.view.jsx:50`
  - `components/studio/create/story/creator-stops/cover-stop/CoverPreview.view.jsx:51`
  - `components/studio/chat/chat-composer/ChatComposer.view.jsx:323`
    (done in Pass 2; verify here)
  Button label reads the action only ("Generate preview",
  "Generate"). The cost moves to a quiet note directly below the
  button, `--ink-dim` at `--text-label`, matching the already
  conforming pattern in
  `components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx:290`
  ("Image generation costs N coins."). Keep each surface's existing
  unit word (tokens vs coins); the split is logged in the session
  report, not unified here.
  Aria-labels may keep the cost (screen-reader context is not a
  label).
- Fixtures: cost-note variants where the preview fixtures pin the
  label string.

Commit: `build-0823(6): creator-card three-slot strip, generate CTA
cost note`

## PASS 7: Close

1. Full `npm run build`, exit 0. Full lint. Run the DESIGN-TOKENS
   "Out of contract" greps and the em-dash grep across every file
   touched in the build; zero new hits.
1b. Editor-family conformance check (ruled by Brian 23 Aug): audit
   the advanced editor family on this branch
   (`app/studio/v2/editor/**`) against the WRITTEN ED1E/ED1F
   standard (`docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md`,
   `docs/plans/ED1F-DESIGN-DELTAS.md`), explicitly including the
   hero with its identity block and action row. Code-level
   conformance read, no redesign: any editor-family surface that
   diverges from the written standard is LISTED in the session
   report as a divergence with file:line, and is NOT changed in
   this build.
2. Write `docs/handoffs/SESSION-REPORT-2026-08-23-BUILD.md`
   (all-caps section labels per the handoff house style): passes
   completed; files touched per pass; new laws minted (container
   law, gap-6 clamp, --radius-bubble and the chat recipe tokens,
   modal-frame grabber); the three product-behavior items for Nick:
   (a) Cast renamed Party with cap 5, (b) Set Player Character
   moves to the narrator-chat flow, (c) Random Liked removed and
   Delete relocated to the right rail; plus the composer mode
   surface note (Suggestion presented; OOC/DIRECT contract-legal,
   unsurfaced); the editor-family conformance result from step 1b
   (divergences with file:line, or a clean pass); the sidebar
   density recipe flagged for Brian's next render sitting; anything
   skipped with reason (expected: Adventures
   and Lore two-up density, no list mode; Full Studio Soon cards
   dropped from the hub; terminology.js untouched while chat meta
   reads "Young Adult"; scene-image selector stubbed via
   FixtureActionNotice pending its CR).
3. Final commit `build-0823(7): close, session report`, push to
   `origin/design/ds1-claude-design-sync`, report the final SHA in
   the finished-task report, echoing this plan's manifest pass by
   pass as DONE or STOPPED.

## Contract version bumps (summary)

| Package | From | To | Kind |
|---|---|---|---|
| chat-cast-panel | current | next MAJOR | buttons/props removed |
| chat-composer | current | next MAJOR | action bar + mode surface |
| chat-state-panel | current | next MINOR | delete action added |
| chat-message | current | next MINOR | speakerColor additive |
| chat-shell | current | next MINOR | header block, additive wiring |
| chat-party-roster | none | 1.0.0 | new package |
| kit modal-frame | 1.2.0 | 1.3.0 | sheetGrabber additive |
| StoryChatPage (page) | 1.0.0 | 1.1.0 | additive wiring |
| Studio (page) | 1.3.0 | 2.0.0 | zone restructure |
| studio-sidebar | studio-sidebar.view.v1 | studio-sidebar.view.v2 | Legacy group removed, account anatomy (keeps its family's dotted-name format per open ruling T14) |
| studio-economy-widget | 1.0.0 | 1.1.0 | sidebar modes lose Notifications, compact coins row (mobileHeader mode unchanged) |
| CreatorStops x4 | current | MINOR (or MAJOR if a prop is deleted) | close-label prop, footer |
| kit creator-card | current | next MINOR | strip behavior |

Read each contract's actual current version from line 1 before
bumping; the table's "current" is not asserted.

## Fixture additions (summary per pass)

- P2: chat-cast-panel full-party/open-slots/empty; chat-party-roster
  full set; chat-state-panel three-section set + delete-confirm;
  chat-composer action-bar states + 390 sheets; chat-message
  speaker-color set; chat-shell young-adult meta + panels
  open/collapsed + 390 sheets; modal-frame grabber.
- P3: empty-result search fixtures where missing.
- P4: Studio zone-model default/empty/longest; sidebar preview
  fixture without Legacy group, with the new signed-in anatomy and
  density; economy-widget compact-coins fixtures (expanded and
  collapsed, no notifications; mobileHeader unchanged).
- P5: quick-create saved-state, 390 full-height sheet, per-creator
  close labels.
- P6: creator-card zero/one/three thumbnails; preview cost-note
  fixtures.

## ASSUMPTIONS (resolved by law plus judgment, none blocking)

1. Spec's "story-room-cast-panel / story-room-composer /
   story-room-state-panel" map to the v2 packages
   `chat-cast-panel` / `chat-composer` / `chat-state-panel` under
   `components/studio/chat/`. Only the v2 route renders inside
   StudioShell as the spec describes. The legacy `story-room-*`
   family (live production route) is untouched.
2. Container cap is the existing locked `--container` (1200px); no
   new token. The 23 Aug spec supersedes BUILD-BLUEPRINT 2.16(l)
   ("no max-width cap", 10 Aug); the supersession is written into
   both law docs in Pass 1.
3. Bubble radius 16 is off the radius tier table, so it is minted as
   the chat-scoped `--radius-bubble`, legal on chat bubbles only;
   the tier table is otherwise untouched.
4. Gap-6 clamp implemented as an OKLCH relative-color recipe with
   L clamped to [0.70, 0.88] and chroma capped at 0.12; declared as
   `--chat-speaker-name` in theme.css.
5. The proposed `--chat-msg-*` family (DESIGN-TOKENS "Proposed") is
   superseded on the display side by this ruling; the fixture-only
   demo code remains until separately removed.
6. "Rename Cast to Party everywhere in FE copy" means user-visible
   strings, not package/file names; directories keep their names to
   avoid import churn.
7. Rating label: chat surface meta reads "Young Adult".
   `terminology.js` (CR-027 ruled vocabulary Everyone/Teen/Adult) is
   not edited; the divergence is flagged in the session report for a
   vocabulary ruling.
8. Composer modes: picker presents Dialogue / Action / Suggestion;
   contract gains SUGGESTION; OOC and DIRECT stay contract-legal but
   unsurfaced. Flagged for Nick.
9. The 38px "soft rectangle" management icons and party avatar tiles
   consume the existing `--control-filter` value (38); DESIGN-TOKENS
   legal-on for that token is extended in the same commit to name
   these chat consumers, with the standing coarse-pointer 44px
   override on interactive controls.
10. Scene-art click opens the image selector via the
    FixtureActionNotice stub (HIDE/STUB law), pending the real
    selector's CR; logged in the session report.
11. Five-bucket filter applies to Vault and Community (mixed-kind
    lists) via the new shared module; Stories keeps its
    playable-kinds filter; the other pages keep domain filters.
12. Two-up density is not extended to Adventures and Lore (no list
    mode exists; "where already lawful" excludes them); skipped with
    reason.
13. Studio hub: the Full Studio tool-card grid is dropped by the
    three-zone ruling; the Player Character door keeps its existing
    isLive false state inside CREATE; "Build an Adventure" routes to
    /studio/v2/adventures rather than stubbing a new builder.
14. Sidebar: the preview-mode Legacy group is removed by the "only
    the nine-page model plus lawful supporting entries" ruling;
    production (flag off) rendering and cutover state untouched; SOP
    section 18 flag text updated in the same commit.
15. Quick-create footer "max two actions" reads as secondary +
    primary, with the circular Back arrow as navigation, not an
    action; the advanced-editor button moves to the saved state as
    the lawful exit.
16. No render-verification steps in this build per the 23 Aug brief;
    build exit 0, lint, and the doc greps are the verification
    surface. SOP render law otherwise remains standing for future
    work.
17. `sync/merge_1` is a git branch, not a path; "do not touch" is
    enforced as no checkout/merge/rebase/cherry-pick of it.
18. Preview-harness clients that re-create the shell are edited only
    to mirror the Pass 1 container classes (parity mirroring, not a
    visual fix), consistent with harness law.
19. Vault sidebar glyph: "the most common archive/vault glyph
    previously used" resolves to lucide `Archive`, the repo's
    standing archive/vault glyph (KitCreationCard's Archive
    action); the sidebar's own Vault entry has carried `castle`
    since birth, so the revert targets the app-wide glyph, not a
    prior sidebar value.
20. Notifications removal scope: the sidebar-rendered economy
    widget modes (`expanded`, `collapsed`) only. The `mobileHeader`
    mode and the top bar bell are untouched; contract props remain
    for the surviving mode.
21. Sidebar nav density recipe is minted entirely from existing
    tokens (`--control-sm` rows with the coarse-pointer 44px
    override, `--text-label`/`--lh-label` type, `--space-1`/
    `--space-2`/`--space-3` rhythm); no 12px step is invented, per
    the token-first directive. The recipe is recorded in Pass 4 and
    flagged in the session report for Brian's next render sitting,
    since no render steps run in this build.
22. The Pass 7 editor-family check is a code-level conformance read
    against the written ED1E/ED1F standard (no render steps in this
    build); divergences are reported, never redesigned here.

## BLOCKING

None.

## EXECUTION ORDER (Sonnet checklist)

- [ ] 0. `git status` clean on design/ds1-claude-design-sync at
       8bfbf96 (or a descendant that is only this plan's commits);
       stop and report otherwise.
- [ ] 1. Pass 1 edits (StudioShell.view.jsx cap; preview mirrors;
       DESIGN-TOKENS container law; BUILD-BLUEPRINT 2.16(l)
       supersession note).
- [ ] 2. `npm run build` exit 0; lint; em-dash grep on touched docs;
       commit `build-0823(1): ...`.
- [ ] 3. Pass 2 tokens (theme.css + DESIGN-TOKENS rows + gap-6 law).
- [ ] 4. Pass 2 components in order: modal-frame grabber; chat-shell
       header swap; chat-message bubbles; chat-cast-panel party
       rows; chat-party-roster new package + preview route;
       chat-state-panel rail; chat-composer action bar; page wiring
       + mock + fixtures; chat-v2-page preview; function-map rows.
- [ ] 5. Build exit 0; lint; greps; commit `build-0823(2): ...`.
- [ ] 6. Pass 3 (typeBuckets.js module; Vault/Community consume;
       search/sort/filter gap fill; de-busy; verify sticky line and
       two-up state; fixtures).
- [ ] 7. Build; lint; greps; commit `build-0823(3): ...`.
- [ ] 8. Pass 4 (Studio three zones; door disable fix; contract
       2.0.0; fixtures; sidebar refinement items 1 to 7:
       notifications CTA out, compact coins row, signed-in rows,
       Legacy group out, Vault archive glyph, nav density recipe,
       fixtures and both preview mirrors; SOP 18 text; function
       map).
- [ ] 9. Build; lint; greps; commit `build-0823(4): ...`.
- [ ] 10. Pass 5 (CreatorStops conformance; four modals; contracts;
       fixtures; editor index comment fix; function map).
- [ ] 11. Build; lint; greps; commit `build-0823(5): ...`.
- [ ] 12. Pass 6 (KitCreatorCard strip; four preview CTAs; fixtures).
- [ ] 13. Build; lint; greps; commit `build-0823(6): ...`.
- [ ] 14. Pass 7: full build + full grep sweep; editor-family
       conformance read against the written ED1E/ED1F standard
       (divergence list, no redesign); write
       docs/handoffs/SESSION-REPORT-2026-08-23-BUILD.md; commit
       `build-0823(7): ...`; push; report final SHA and echo this
       manifest pass by pass as DONE or STOPPED.
