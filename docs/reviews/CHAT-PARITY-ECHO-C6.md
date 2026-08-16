# Chat Parity Echo, Wave C6

Branch `design/c1-chat-core`, worktree `~/dev/Crestfall-fe-lane2`. Walks
research section C ("Chat baseline: crestfall-main inventory") of
`docs/plans/FABLE-GATE-PLAN.md` item by item against the wave C1-C5
build. Every item is marked Present (file:line), Deliberately excluded
(ruling cited), or Flagged for Brian. No product code changed by this
pass; docs and the function map only.

## Summary counts

| Status | Count |
|---|---|
| Present | 40 |
| Deliberately excluded | 20 |
| Flagged for Brian | 8 |

Total items walked: 68, covering every C1 bullet plus the twelve named
baseline defects the plan says not to copy. Counted by table row across
every section below; the "Flagged items, rolled up" list at the end
restates all eight Flagged rows together and is not counted twice.

---

## Layout

| Item | Status | Evidence |
|---|---|---|
| 3-column desktop grid (280px cast rail, transcript, 320px state rail), collapsible rails with reveal buttons | Present | `components/studio/chat/chat-shell/ChatShell.view.jsx`, the `xl:` three-region row (280px/320px rail widths) and the reveal-chevron buttons gated on `leftRailCollapsed`/`rightRailCollapsed`. |
| Mobile drawers for Room-and-Cast and Chronicle State | Present, improved | Baseline used hand-rolled drawers; this build renders `KitModalFrame variant="sheet"` (R4/R7) instead, per `components/studio/chat/chat-cast-panel/ChatCastPanel.view.jsx:263-269` and `components/studio/chat/chat-state-panel/ChatStatePanel.view.jsx:110-116`. Ruling: plan wave C3, "Mobile: KitModalFrame sheets (R4/R7), never a hand-rolled drawer." |
| Desktop-only header (eyebrow, title, scenario+mode subtitle, rating/visibility pills, panel toggles) | Present | `ChatShell.view.jsx`, the `xl:flex` header block: eyebrow/title/subtitle, `StatusPill` row, rail-toggle buttons. |
| Composer help panel (`/help`, `/summary`, `/recap` commands) | Present | `components/studio/chat/chat-composer/chatComposerCommandRegistry.js:6-17`, the `help` and `summary`/`recap` command entries, wired through the composer's `/` autocomplete. |
| Mobile context header (title, scenario, status pills), baseline had none | Present, new | `ChatShell.view.jsx`, the `xl:hidden` mobile header block. This is the wave's own stated improvement over the baseline, not a parity item. |

## Message model

| Item | Status | Evidence |
|---|---|---|
| Six tones: PLAYER/OPENING/SYSTEM/NARRATOR/CHARACTER/MEDIA | Present | `components/studio/chat/chat-message/ChatMessage.contract.js`, `CHAT_MESSAGE_SURFACE_TONES`. |
| Two body modes: SEMANTIC (`chat.responsePresentation.v1` segments, DIALOGUE/NARRATION/TEXT with EMPHASIS/STRONG/WHISPER, trailing statusBlocks) and LEGACY | Present | `ChatMessage.contract.js`, `CHAT_MESSAGE_BODY_MODES`; fixtures pair every tone with both modes (`ChatMessage.fixtures.js`). |
| Auto paragraph spacing | Present | `components/studio/chat/chat-message/chatMessageSpacing.js`, the spacing helper `ChatMessage.view.jsx` calls. |
| Per-character seasonal color palettes (13 palettes x 7 roles), applied to segments, speaker label, avatar ring, card border | Present, gated | `ChatMessage.contract.js`, `enableFixturePaletteDemo`/`paletteRoleOverrides`; per the O7 ruling, product render paths never enable the demo gate until the `--chat-*` token family proposal (below) is ratified. |

## Message actions

| Item | Status | Evidence |
|---|---|---|
| Copy (clipboard + `execCommand` fallback + feedback) | Present | `components/studio/chat/chat-message/useChatMessageViewModel.js`, the `onCopy`/`copyState` COPIED/FAILED loop. |
| Regenerate and Continue (latest AI message only, mutually disabling, request-id guarded) | Present, contract only | `ChatMessage.contract.js`, `canRegenerate`/`regeneratePending`/`onRegenerate`, `canContinue`/`continuePending`/`onContinue`. Not wired to a live engine on the wave C5 mock page; `docs/APP-FUNCTION-MAP.csv` rows for `chat-message` carry status `stubbed`, unchanged by this wave. |
| Report (5 reason codes + 2,000-char comment dialog) | Present | `components/studio/chat/chat-session-dialogs/ChatSessionDialogs.contract.js`, `CHAT_REPORT_REASON_OPTIONS`, `CHAT_REPORT_COMMENT_MAX_LENGTH`; `ReportDialog` in `ChatSessionDialogs.view.jsx`. |
| NO edit, delete, rewind, or branch exists | Deliberately excluded | Matches the baseline exactly; wave C1-C5 adds none of these. No ruling needed, since not building something the baseline also lacks is not a design decision. |

## Transport

| Item | Status | Evidence |
|---|---|---|
| Single POST returns all response messages; NO streaming anywhere | Deliberately excluded, improved posture | Ruling O9 (ratified): streaming-ready contracts ship now (`isStreaming`, `generationCursorLabel` on `chat-message`; `streamingSupported`/`isStreaming`/`onStopGenerating` on `chat-composer`), transport itself is CR-044, filed below. |
| Optimistic send with failed-state bubble and draft restore | Present | `ChatMessage.contract.js`, `deliveryState` (FAILED/SENDING); the wave C5 mock send loop (`app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js`, `handleSend`) appends an optimistic PLAYER message before the simulated reply. Draft restore on failure is not exercised by the mock (the mock never fails); flagged below. |
| Sending indicator "Crestfall Engine is composing..." | Present, reworded | `components/studio/chat/chat-transcript/ChatTranscript.view.jsx:133-137`, the `sending` `StatusCard`, copy "Crestfall Engine is composing the next response." |
| summary-pending live-region card | Present | `ChatTranscript.view.jsx:139-143` and `components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx`, `SummaryPendingCard`. |

## Transcript

| Item | Status | Evidence |
|---|---|---|
| Client windowing (12 initial, Load Earlier +10, remaining count) | Present | `components/studio/chat/chat-transcript/ChatTranscript.contract.js`, `CHAT_TRANSCRIPT_DEFAULT_VISIBLE_MESSAGES`/`CHAT_TRANSCRIPT_LOAD_EARLIER_BATCH_SIZE`; `ChatTranscript.view.jsx:72-76`. |
| NO server pagination (full snapshot per GET) | Deliberately excluded, matches baseline | The wave C5 mock resolves one full snapshot per page load (`chatV2StoryMock.js`), same shape as the baseline; no server pagination exists on either side. |
| Unconditional auto-scroll (baseline defect) | Deliberately excluded, fixed | Ruling: research section C1 names this an improvement opening. `ChatTranscript.view.jsx:40-58,60-65`, scroll suppressed once `isScrolledUp`, jump-to-latest pill at lines 152-163. |
| Hidden yield-turn records filtered | Flagged | No `PLAYER_YIELD_TO_*` filtering logic exists in `chat-transcript` or the wave C5 mock; the mock never emits yield-turn records to filter. Real filtering needs a real action-type stream, CR-043. |
| Media messages re-slotted before/after their triggering message | Present, caller-owned | `ChatTranscript.contract.js:18-20`, `ChatTranscriptMessageItem`, "media re-slotting stays the caller's job, same as the baseline"; demonstrated in `ChatTranscript.fixtures.js`'s `reslottedConversation`. |
| Opening hero image above first message | Present | `ChatTranscript.contract.js`, `openingHeroImage`; `ChatTranscript.view.jsx:102-115`. |

## Composer

| Item | Status | Evidence |
|---|---|---|
| Modes DIALOGUE/ACTION/OOC/DIRECT with per-mode placeholders | Present | `components/studio/chat/chat-composer/ChatComposer.contract.js`, `CHAT_COMPOSER_MODES`; `useChatComposerViewModel.js:104-118`, `getPlaceholder`. |
| Shift+Enter newline, Enter send, IME-safe | Present | `components/studio/chat/chat-composer/ChatComposer.view.jsx`, the textarea key handler (IME composition guard on `isComposing`). |
| Three autocompletes: `/` commands, `@` character mentions, `#` location mentions | Present | `chatComposerCommandRegistry.js`, `chatComposerAutocomplete.js`; `useChatComposerViewModel.js:153-158` (query state per trigger). |
| Speaker row (Auto, per-participant 44px portrait buttons, Random) | Present | `ChatComposer.contract.js`, `ChatComposerSpeakerOption`; `--control-md` (44px) portrait buttons in `ChatComposer.view.jsx`. |
| Empty-draft send becomes "Continue Scene" (PLAYER_YIELD_TO_AUTO) | Present | `useChatComposerViewModel.js:429-438`, `submitComposer`, `autoContinuationAvailable` branch sends `{ requestedSpeakerId: "AUTO", actionType: "PLAYER_YIELD_TO_AUTO" }`; wired live in `useChatV2StoryPageViewModel.js`'s `handleSend`. |
| Portrait click with empty text yields to that character | Present, contract level | `ChatComposer.contract.js`, `onChangeSpeaker`; the yield-on-select-with-empty-draft semantics are implemented in `useChatComposerViewModel.js`. Not separately exercised in the wave C5 mock beyond speaker selection; flagged below. |
| No composer maxLength | Deliberately excluded, ruled | Ruling O5 (ratified): no hard cap; a quiet counter appears past a soft threshold (2,000), `CHAT_COMPOSER_DRAFT_SOFT_LIMIT` in `ChatComposer.contract.js:17`. |
| Disabled stubs: Scene Image, Use Current Scene | Deliberately excluded, improved | Ruling O10 (ratified): both flows are designed fixture-first now, not dead buttons. `sceneImageSeat`/`sceneImageConfirmSheet` and `useCurrentSceneSeat` in `ChatComposer.contract.js:60-77`; the wave C5 mock wires `sceneImage: { available: true, costLabel: "40 coins" }` (`useChatV2StoryPageViewModel.js`), honest stub since no real generation exists (CR-043). |
| Disabled stubs: mobile Export/Share | Present, relocated | These live on `chat-state-panel`'s `actions` (Export Chat, Share Snapshot), not the composer, in this build; wired to open `chat-session-dialogs` in `useChatV2StoryPageViewModel.js`. Functionally present, different seat than the baseline's composer-adjacent stub. |

## Cast panel

| Item | Status | Evidence |
|---|---|---|
| Featured last-speaker media tile (deterministic image pick) | Present, caller-owned determinism | `components/studio/chat/chat-cast-panel/ChatCastPanel.contract.js:66`, `featuredMedia`; "determinism is caller-owned" per the contract's own JSDoc. |
| Room id | Present | `ChatCastPanel.contract.js`, `roomIdLabel`; wave C5 mock supplies the route `[id]` as the label (`chatV2StoryMock.js`). |
| Narrator line | Present | `ChatCastPanel.contract.js:69`, `narrator`. |
| Cast cards (avatar, selection chip, role, Arriving/Present/Inactive state, entry notes) | Present | `ChatCastPanel.contract.js`, `ChatCastMemberViewItem`; `CHAT_CAST_MEMBER_STATES`. |
| Set Player Character (gated to turnCount === 0, picker modal) | Present, contract level | `ChatCastPanel.contract.js`, `playerCharacterAction`/`playerCharacterPickerContent`. Wave C5 mock sets `playerCharacterAction: { visible: false }` (`useChatV2StoryPageViewModel.js`) since the mock's turn count is never 0 on load; flagged below. |
| Registry NPC manager (Loaded/Unload, Narrative Targets/Load Now, Available/Load, Previously Loaded/Reload, with notices) | Present | `components/studio/chat/chat-npc-manager/ChatNpcManager.contract.js`, `CHAT_NPC_MANAGER_SECTION_IDS`; composed into cast panel via `npcParticipantManager`. |
| Random Liked loader | Present, honest stub | `ChatCastPanel.contract.js`, `randomLikedAction`/`onLoadRandomLiked`; wave C5 mock's handler sets an honest error string ("no live registry yet," `useChatV2StoryPageViewModel.js`) rather than faking a result. |
| Delete Story (via `window.confirm`, 7-line copy) | Deliberately excluded, fixed | Ruling: destructive law (`docs/DESIGN-TOKENS.md`). `useChatCastPanelViewModel.js`, real `deleteConfirm` sheet replacing `window.confirm`; copy ported unchanged as `CHAT_CAST_PANEL_DELETE_CONFIRMATION`. |

## State panel

| Item | Status | Evidence |
|---|---|---|
| Scenario Phase card (Current/Objective/Scenario) | Present | `components/studio/chat/chat-state-panel/ChatStatePanel.contract.js`, `CHAT_STATE_PANEL_SECTION_ICON_KEYS.SCENARIO`. |
| World State card (Location, Time + source, Weather + source, engine-module aware) | Present | Same contract, `.WORLD`; fixture rows include `time-source`/`weather-source`. |
| Knowledge Boundaries card (static) | Present | Same contract, `.KNOWLEDGE`; rows are honest static placeholders per `ChatStatePanelRow`'s own JSDoc. |
| Memory card (static placeholders) | Present | Same contract, `.MEMORY`. |
| Export Chat dialog (range: beat/scene/recent 25/50/custom start-end, format TXT/MARKDOWN, blob download) | Present, contract level | `components/studio/chat/chat-session-dialogs/ChatSessionDialogs.contract.js`, `CHAT_EXPORT_RANGE_PRESETS`/`CHAT_EXPORT_FORMAT_OPTIONS`. The real blob download does not exist on the wave C5 mock page (`onSubmit` just closes the dialog); flagged below. |
| Share Snapshot dialog (temporary vs persistent-reviewed, ACTIVE/REJECTED/FAILED/REVOKED states, copy and revoke) | Present, contract level | `ChatSessionDialogs.contract.js`, `CHAT_SHARE_MODES`/`CHAT_SHARE_LINK_STATES`; `RevokeConfirmSheet` in `ChatSessionDialogs.view.jsx:266-290`. No real link creation on the mock page; flagged below. |
| Share route `/share/chat/[token]` (noindex, no-store) | Flagged | No such route exists in `Crestfall-fe-lane2` yet; the baseline route is legacy-tree-adjacent infrastructure, not a chat-shell View concern. Needs its own build once CR-043 lands a real share token. |

## Session mechanics

| Item | Status | Evidence |
|---|---|---|
| Start from template/creation (CHARACTER starts a room with defaultCharacterId; other types throw) | Flagged | The wave C5 page resolves any `[id]` through the mock unconditionally; the baseline's type-gate (CHARACTER only) is a creation-flow concern this wave's Stories-hub wiring does not reach. Needs CR-043's real start endpoint to reproduce faithfully. |
| Resume via full snapshot GET | Present, mocked | `chatV2StoryMock.js`, `resolveChatV2StoryMock(id)` returns one full snapshot per call, same shape as the baseline's resume GET; marked pending CR-043 in the module's header comment. |
| Per-turn server-side persistence | Flagged | No backend exists; every send in the wave C5 mock is client-only state (`useChatV2StoryPageViewModel.js`). CR-043. |
| NO rename anywhere | Deliberately excluded, product gap logged | Matches the baseline; CR-045 filed below to track this as a product gap, not a design decision this wave makes. |
| Bulk delete from hub | Flagged | Out of this wave's scope (`app/studio/v2/stories/[id]/**`, `chat-shell`, the hub's single wiring touch); bulk delete is a Stories-hub-level control, unaffected by wave C5. Not a gap this wave introduces. |
| `/summary` boundary recap (single-flight) | Present, UI only | `chat-session-dialogs`'s `SummaryPendingCard` and `chat-transcript`'s `summaryPending` prop render the state; no real single-flight endpoint exists (CR-043). |
| Runtime Mechanics Panel UNMOUNTED from chat; mechanics reach the player only as statusBlocks | Deliberately excluded, matches baseline's own removal | crestfall-main itself unmounted this in `dc8e89d` ("updating chat menu + various fixes"); wave C1-C5 never mounts it either. `statusBlocks` present on `chat-message` (`ChatMessage.contract.js`). |

## Monetization

| Item | Status | Evidence |
|---|---|---|
| ZERO inside chat (baseline, grep-verified) | Deliberately excluded, improved per ruling | Ruling O6 (ratified): wave C5 adds a coin chip and gated-action upsell sheets deliberately, past baseline parity. `components/studio/chat/chat-shell/ChatShell.contract.js`, `coinChip`/`libraryPassUpsell`. |
| Library Passes gate auto-event media pools (purchase happens on the image-library page) | Present, fixture-fed | `ChatShell.contract.js`, `ChatShellLibraryPassUpsell`; `ChatShell.fixtures.js`, `chatShellInsufficientCoinsFixture`. Real balance/entitlement data is CR-046. |

## API surface

| Item | Status | Evidence |
|---|---|---|
| 20 client functions in `storyRoomClient.js` | Flagged | None of these exist in `Crestfall-fe-lane2`; the wave C5 mock module (`chatV2StoryMock.js`) stands in for all of them. Full catch-up is CR-043. |
| Action types (MESSAGE, PLAYER_YIELD_TO_CHARACTER, PLAYER_YIELD_TO_AUTO, REGENERATE_RESPONSE, CONTINUE_RESPONSE, REPORT_MESSAGE, SUMMARIZE_CURRENT_BOUNDARY) | Present, contract level only | `PLAYER_YIELD_TO_AUTO` is the one action type the wave C5 mock actually emits (`useChatV2StoryPageViewModel.js`, `handleSend`); the other six exist only as the shape `chat-composer`/`chat-message`/`chat-session-dialogs` contracts anticipate, not as a real dispatched action set. CR-043. |

## Known baseline defects (improvement openings, not copied)

| Defect | Status | Evidence |
|---|---|---|
| Unconditional auto-scroll | Deliberately excluded, fixed | See Transcript section above. |
| Desktop-only header (no mobile title/context) | Deliberately excluded, fixed | See Layout section above. |
| Mobile persistent-share silently no-ops | Flagged | The wave C5 mock's Share dialog never reaches a real persistent-link call to silently drop; real behavior (correct or not) is CR-043's to prove. |
| `room.phase` never set (empty state card) | Flagged | The wave C5 mock always supplies a populated `statePanel.sections`; the baseline's empty-phase defect has no equivalent to reproduce or fix without a real backend field. CR-043. |
| `window.confirm` delete | Deliberately excluded, fixed | See Cast panel section above. |
| Dead `previewStoryRoomTranscriptRange` (`requestJson` undefined) | Deliberately excluded, not carried over | No equivalent function exists anywhere in the wave C1-C5 build; dead code was never ported. |
| Dead `StoryRoomMobileToolbar` | Deliberately excluded, not carried over | Same as above; the wave C3 mobile pattern (`KitModalFrame` sheets) replaces it structurally. |
| Duplicated object keys in shell VM | Deliberately excluded, not carried over | `useChatShellViewModel.js` and `useChatV2StoryPageViewModel.js` were built fresh, not ported from the baseline's shell ViewModel. |
| No streaming | Deliberately excluded, improved posture | See Transport section above; O9, CR-044. |
| No jump-to-latest | Deliberately excluded, fixed | See Transcript section above. |
| No composer limit | Deliberately excluded, ruled | See Composer section above; O5. |
| NARRATOR sky and black/30 fills off-token | Deliberately excluded, fixed | `chat-message`'s tone-to-token mapping (`docs/plans/FABLE-GATE-PLAN.md` wave C1 section: "SYSTEM ink-family neutral strip, NO sky: the info color does not exist here"); no sky token, no `bg-black/NN`, anywhere in `ChatMessage.view.jsx`. |

---

## Flagged items, rolled up

Eight items above are Flagged rather than Present or Excluded, because
they need either a real backend or are out of this wave's stated scope.
Restated together for Brian:

1. Hidden yield-turn record filtering, no real action-type stream to filter yet.
2. `/share/chat/[token]` route, does not exist yet in this repo.
3. Start-from-template's CHARACTER-only type gate, not reachable from this wave's Stories-hub wiring.
4. Per-turn server-side persistence, every send in the mock is client-only state.
5. Bulk delete from hub, a Stories-hub-level control this wave's file scope does not touch.
6. The 20-function `storyRoomClient.js` API surface, none of it exists in this repo.
7. Mobile persistent-share's silent no-op, unprovable without a real persistent-link call.
8. `room.phase` never set (empty state card), the mock always supplies a populated state panel.

None of these are design decisions; all eight wait on CR-043 (chat API
catch-up, filed below) except item 5, which waits on a future hub-level
brief outside this wave's scope.

---

## Upstream drift, crestfall-main since the C1 crawl

The C1 crawl (research section C) was current as of commit `c15352d`
("latest updates, amechv3 + sharing + mem", 2026-08-04), the newest of
the six commits it named. `crestfall-main/Crestfall`'s local `main`
branch is still checked out at `c15352d`; `origin/main` has moved to
`735c681` ("2/3 memory updates and some chat improvements",
2026-08-11), ten commits ahead. Re-checked this wave, read-only, no
files changed in `crestfall-main`, nothing absorbed into this build.

**Frontend chat UI tree** (`components/studio/story-rooms/**`,
`app/studio/story-rooms/**`, `lib/client/studio/storyRoomClient.js`):
three commits touched it, all small.

| Commit | Date | Title | Files touched |
|---|---|---|---|
| `8c7b0f9` | 2026-08-10 | storywheel logic completed | `story-room-message/StoryRoomMessage.view.jsx` (spacing, 12 lines), its diagnostics file |
| `201ee67` | 2026-08-09 | finished NLR and Memory P13 | new `hooks/storyRoomWorldStateProjection.js`, `hooks/useStoryRoomChat.js` trimmed, `story-room-state-panel/README.md` note, new diagnostics file |
| `89cec66` | 2026-08-07 | various fixes to registries | `StoryRoomNpcParticipantManager` contract/view/viewmodel/fixtures, new diagnostics file (registry graph authority) |

None of these change the C1 inventory's shape (tones, dialog kinds,
panel structure); they read as internal refinements (message spacing,
a new world-state projection hook, NPC registry graph-authority
fixes). Not absorbed into `chat-message`, `chat-state-panel`, or
`chat-npc-manager` this wave; noted for a future crawl if Brian wants
them chased.

**Backend chat engine** (`services/api/src/services/chat/**`, not
frontend-reachable, no file-scope overlap with this build): the other
seven commits since `c15352d` are substantial, unrelated to the UI
inventory above. `createChatTurn.js` gained 617 changed lines
(`03b4947`, "improved chat flow"); new services
`adHocSceneActorLifecycle.js` and `manualSpeakerCutaway.js` landed;
`activeSceneRangeCapsuleService.js`, `chatSpeakerService.js`, and
`chatPromptCompiler.js` were reworked across `286a449` ("Chat
efficiency") and `735c681` ("2/3 memory updates and some chat
improvements"). This is dev-side signal that the chat backend is
under active, fast-moving development; CR-043 and CR-044 below note
it as context so a future implementer checks current shape before
building against the API surface this wave's mock module stands in
for, rather than against the C1 crawl's now-nine-day-old snapshot.

No commit in either group was read beyond `git show --stat`; nothing
here is a functional claim about what the new code does, only what
files moved.
