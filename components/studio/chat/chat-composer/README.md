# Chat Composer LOOM Package

**Contract:** `ChatComposer.contract.js` (v2.0.0)

Wave C2, `docs/plans/FABLE-GATE-PLAN.md`. RESHAPED 23 Aug 2026
(build-0823 pass 2, RULED): one action-bar grid at both breakpoints,
`[menu 40px][Auto][Party][Dialogue with disclosure]`, replacing the
"Next Speaker" speaker-selection strip and the mode-segmented-control
column. New build; the legacy `components/studio/story-rooms/story-room-composer`
tree is a stale pre-upgrade fork of this repo and is read-only
reference, never edited or imported from here.

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
`sceneImage.onConfirm` / `useCurrentScene.onUse` are caller-provided.

## The action bar: Menu, Auto, Party, Dialogue

One `grid-cols-[40px_1fr_1fr_1fr]` row at every width. Menu opens the
right story/state panel; Auto routes `onChangeSpeaker("AUTO")`,
priming the next Send for automatic continuation; Party opens the
left party panel; Dialogue pops an anchored picker (`ModeChip`)
presenting Dialogue / Action / Suggestion. `OOC` and `DIRECT` stay
contract-legal (`CHAT_COMPOSER_MODES`) but are not offered by this
chip. `speakerOptions` and the full per-participant speaker row are
REMOVED; speaker/party membership now lives in `chat-party-roster`.

## Three autocompletes, unchanged

`chatComposerAutocomplete.js` and `chatComposerCommandRegistry.js` are
untouched by this pass. `/` commands take precedence, then `#`
locations, then `@` mentions, mutually exclusive per keystroke.
Keyboard precedence inside `ParticipantMentionTextarea` matches
(unchanged): command menu first, then location, then mention, then
plain Enter-to-send. IME composition is checked before every Enter
handler; Shift+Enter always inserts a newline.

## Length treatment, O5

No hard cap. `showLengthCounter` (ViewModel: `draftLength >
CHAT_COMPOSER_DRAFT_SOFT_LIMIT`, 2,000) surfaces a quiet counter past
the soft threshold.

## Streaming-ready stop-generation seat, O9

`streamingSupported` gates the seat's existence entirely: when false,
Send is the only submit control regardless of `isStreaming`.

## Scene Image / Use Current Scene seats, O10

Both render only when `available` is true. The button label reads the
action only ("Scene Image"); its cost renders as a quiet note beside
the scene-tool row instead of inside the label (build-0823 pass 6
CTA-cost law, applied here in pass 2). Scene Image opens a confirm
sheet (`KitModalFrame` `variant="sheet"`).

## Composing indicator

Moved to `chat-transcript`'s sending `StatusCard`: spinner plus the
exact text "Composing..." (this package renders no composing
indicator of its own).

## One layout, both breakpoints

`ComposerBar` renders once; Tailwind `xl:` classes govern sizing and
text visibility (Send's label, the mode chip's compact height) rather
than two separate Desktop/Mobile components. The prior mobile "Room
Tools" sheet is REMOVED: the action bar's Menu/Party/Dialogue chips
cover its Mode/Cast/State affordances; its disabled Export/Share stubs
are dropped (their real dialogs remain reachable from
`chat-state-panel`'s management row).

## Fixtures

`ChatComposer.fixtures.js`: all five modes (Dialogue/Action/Suggestion/
OOC/Direct), each of the three menus open, yield-to-character and
yield-to-random speaker states, pending, disabled, streaming, the
length counter past threshold, the Scene Image confirm sheet at
rest/pending/error, both scene seats unavailable, and a longest-draft
case.

## Package assets

- `ChatComposer.contract.js`
- `ChatComposer.fixtures.js`
- `chatComposerAutocomplete.js`
- `chatComposerCommandRegistry.js`
- `useChatComposerViewModel.js`
- `/dev/ui-preview/chat-composer`
