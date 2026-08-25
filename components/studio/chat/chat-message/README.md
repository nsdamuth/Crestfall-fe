# Chat Message LOOM Package

**Contract:** `ChatMessage.contract.js` (v1.0.0)

Wave C1, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-message` tree is a stale
pre-upgrade fork of this repo and is read-only reference, never edited
or imported from here. The behavioral baseline this package is a
designed superset of is `crestfall-main/Crestfall`'s
`story-room-message` package, contract 1.4.0.

## Boundary

```text
ChatMessage.jsx
  -> useChatMessageViewModel.js
  -> ChatMessage.view.jsx
```

This package receives already contract-shaped message props from its
caller (today, `chat-transcript`; once wave C5 lands, the chat page
shell). It does not map a raw story-room domain record itself; that
mapping is application-owned work for the page that eventually wires a
live room. The ViewModel here is a defensive pass-through plus one
self-contained browser behavior: copy-to-clipboard with an
`execCommand` fallback and local COPIED/FAILED feedback, matching the
crestfall-main inventory's "Copy (with clipboard fallback + feedback)"
requirement with no Crestfall data dependency.

## Six tones, mapped onto tokens

`docs/plans/FABLE-GATE-PLAN.md` wave C1: PLAYER gold-wash fill
(`--fill`, no line-family border paired per the token's own "never on"
rule), CHARACTER `--surface-2`, NARRATOR `font-display` on a quiet
`--surface-1` bed, SYSTEM a neutral ink strip (`--ink-dim`, no sky; the
info color does not exist in this system), MEDIA chromeless (no
article border or fill around the image), OPENING a ceremonial
`--surface-1` bed with the `font-display` body treatment. The
story-room-message gold literals named in the DESIGN-TOKENS debt map
resolve through this design; this is their dedicated sitting.

## Body modes and spacing

`SEMANTIC` (`chat.responsePresentation.v1` segments typed
DIALOGUE/NARRATION/TEXT with EMPHASIS/STRONG/WHISPER, plus trailing
`statusBlocks`) and `LEGACY` (markdown-ish `**bold**`/`*action*`/`>
quote`). `chatMessageSpacing.js` is ported unchanged from the
crestfall-main baseline (pure, no styling dependency): CHARACTER and
NARRATOR responses with no authored line break receive display-only
paragraph spacing by alternating dialogue/narration runs; existing
line breaks and persisted text are never altered.

## Streaming-ready contract, O9

`isStreaming` and `generationCursorLabel` are new relative to the
1.4.0 baseline. While `isStreaming` is true, a `motion-safe:animate-pulse`
cursor glyph renders at the end of the last paragraph (reduced-motion
safe; no custom keyframe rule needed) and `generationCursorLabel`
populates a visually-hidden live region. Transport is CR-044 for Nick;
this surface upgrades without a further contract change once it lands.

## Palette role overrides, O7 (fixture-only until ratified)

`paletteRoleOverrides` and `enableFixturePaletteDemo` exist so the
per-character seasonal palette mechanism can be proven out, but
`enableFixturePaletteDemo` is fixture-only: it must never be set `true`
by a Shell, ViewModel, or product page. The role names
(`--chat-msg-dialogue` etc.) are logged as a proposed chat-scoped
token family in `docs/DESIGN-TOKENS.md` "Proposed", not written as
locked tokens; the demo fixtures' hex values are illustrative only
(fixtures are excluded from the raw-hex out-of-contract count) and are
never read by the neutral product render path. See
`chatMessagePaletteDemoOnFixture` / `chatMessagePaletteDemoOffFixture`.

## Media

`contentType: AUTO_EVENT_MEDIA` with a `media` object (subtype
CHARACTER_EVENT_IMAGE or LOCATION_EVENT_IMAGE) short-circuits to the
chromeless media render, matching the crestfall-main inventory's
auto-event media messages.

## Message actions

Copy, Regenerate, Continue, Report ship in the contract as a designed
superset of the 1.4.0 baseline. Copy is self-contained (see Boundary
above); Regenerate/Continue/Report are caller-driven (`canX`/`xPending`/
`xError`/`onX`), since they require a real message and session id that
does not exist until the chat page shell (wave C5) wires a live room.

## Fixtures

`ChatMessage.fixtures.js`: all six tones x both body modes, both media
subtypes, sending, failed, streaming, palette-demo on/off, the action
row at rest/pending/error, a minimal/empty-fields case, and a
longest-content case (long speaker name, long segments, all four
actions, three status blocks).

## Package assets

- `ChatMessage.contract.js`
- `ChatMessage.fixtures.js`
- `chatMessageSpacing.js`
- `useChatMessageViewModel.js`
- `/dev/ui-preview/chat-message`
