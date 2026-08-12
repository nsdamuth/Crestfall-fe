# Chat Composer LOOM Package

**Contract:** `ChatComposer.contract.js` (v1.0.0)

Wave C2, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-composer` tree is a stale
pre-upgrade fork of this repo and is read-only reference, never edited
or imported from here. The behavioral baseline this package is a
designed superset of is `crestfall-main/Crestfall`'s
`story-room-composer` package, contract 1.5.0. Depends on `chat-message`
/ `chat-transcript` (wave C1) only for shared fixture grammar (avatar
data URLs, speaker naming); no runtime dependency.

## Boundary

```text
ChatComposer.jsx
  -> useChatComposerViewModel.js
  -> ChatComposer.view.jsx
```

The ViewModel owns the autocomplete interaction set (query parsing and
precedence, highlight movement, selection, cursor restoration), the
Continue Scene / portrait-yield submit semantics, and the Scene Image
confirm sheet's open/closed local state. It does not call an API or
own room persistence; `onSend` / `onOpenCast` / `onOpenState` /
`sceneImage.onConfirm` / `useCurrentScene.onUse` are caller-provided
and wired for real once wave C5's chat page shell binds a live room.

## Modes and placeholders

DIALOGUE / ACTION / OOC / DIRECT, each with its own placeholder
(`useChatComposerViewModel.js` `getPlaceholder`), rendered as a
segmented pill control (`ModeSegmentedControl`) rather than a dropdown:
four fixed options need no search or overlay, and the pill treatment
matches the tone/mode-pill language already established in
`chat-message`.

## Three autocompletes, same precedence as the baseline

`chatComposerAutocomplete.js` ports the crestfall-main query finders
unchanged (pure text parsing, no styling dependency):
`/` commands take precedence, then `#` locations, then `@` mentions,
mutually exclusive per keystroke
(`updateChatComposerSuggestionQueries`). `chatComposerCommandRegistry.js`
ports the three commands (help, summary/recap, commands). Keyboard
precedence inside `ParticipantMentionTextarea` matches: command menu
first, then location, then mention, then plain Enter-to-send.
IME composition (`event.isComposing`) is checked before every Enter
handler; Shift+Enter always inserts a newline.

## Speaker row

Auto, Random, and per-participant portrait buttons, all resolving to
`--control-md` (44px). Selecting a participant with a non-empty draft
sends to that speaker; selecting one with an empty draft yields the
next turn (`PLAYER_YIELD_TO_CHARACTER`), same as the baseline's
portrait-yield semantics. An empty draft with Auto selected turns the
submit action into "Continue Scene" (`PLAYER_YIELD_TO_AUTO`).

## Length treatment, O5

No hard cap. `showLengthCounter` (ViewModel: `draftLength >
CHAT_COMPOSER_DRAFT_SOFT_LIMIT`, 2,000) surfaces a quiet counter past
the soft threshold; the real ceiling arrives with Nick's backend truth
via CR-043.

## Streaming-ready stop-generation seat, O9

`streamingSupported` gates the seat's existence entirely: when false
(honest absence until CR-044 lands transport), Send is the only
submit control regardless of `isStreaming`. When `streamingSupported`
is true and `isStreaming` is true, Send is replaced by a Stop
generating control.

## Scene Image / Use Current Scene seats, O10

Fixture-first, not disabled stubs. Scene Image opens a confirm sheet
(`KitModalFrame` `variant="sheet"`) stating the cost and requiring
Confirm; Use Current Scene is a direct scene-describe action. Both
seats render only when `available` is true (honest absence, not a
dead disabled button) and the actual generation/description behavior
is caller-owned (`sceneImage.onConfirm`, `useCurrentScene.onUse`), an
honest stub until wave C5 wires a live backend.

## Docked layout, mobile tools sheet

Desktop docks under the transcript (`xl:block`); mobile is a
bottom-docked bar (`xl:hidden`) with a "Room Tools" sheet
(`KitModalFrame` `variant="sheet"`, R7 structural close header row,
R4-safe) carrying mode, speaker row, Cast/State seats, and honest
disabled Export/Share stubs (their real dialogs are wave C4's
`chat-session-dialogs`).

## Fixtures

`ChatComposer.fixtures.js`: all four modes, each of the three menus
open, yield-to-character and yield-to-random speaker states, pending,
disabled, streaming (stop-generation seat), the length counter past
threshold, the Scene Image confirm sheet at rest/pending/error, both
scene seats unavailable, the mobile tools sheet open
(`initialToolsOpen`, a fixture-only View seed for the sheet's local
disclosure state), and a longest-draft case.

## Package assets

- `ChatComposer.contract.js`
- `ChatComposer.fixtures.js`
- `chatComposerAutocomplete.js`
- `chatComposerCommandRegistry.js`
- `useChatComposerViewModel.js`
- `/dev/ui-preview/chat-composer`
