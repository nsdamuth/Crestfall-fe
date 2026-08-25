# Chat Transcript LOOM Package

**Contract:** `ChatTranscript.contract.js` (v1.0.0)

Wave C1, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-transcript` tree is a stale
pre-upgrade fork of this repo and is read-only reference, never edited
or imported from here. The behavioral baseline this package is a
designed superset of is `crestfall-main/Crestfall`'s
`story-room-transcript` package, contract 1.1.0.

## Boundary

```text
ChatTranscript.jsx
  -> useChatTranscriptViewModel.js
  -> ChatTranscript.view.jsx
```

Each `messageItems[].message` is a direct `chat-message` View-contract
object; this package renders them in the order it receives them. Media
re-slotting (a media message ordered before or after the message that
triggered it) is the caller's responsibility, same boundary as the
crestfall-main baseline. Windowing and scroll state (visible count,
whether the reader has scrolled up) are presentation-only local state
inside `ChatTranscript.view.jsx` per the LOOM view hard rules; the
ViewModel here only normalizes what the caller hands down.

## Windowing

12 messages visible by default
(`CHAT_TRANSCRIPT_DEFAULT_VISIBLE_MESSAGES`), a Load Earlier control
reveals 10 more per press
(`CHAT_TRANSCRIPT_LOAD_EARLIER_BATCH_SIZE`) with the hidden count
shown on the control, matching the crestfall-main baseline's client
windowing (no server pagination in this package's contract).

## Scroll law, improved over the baseline

The crestfall-main baseline auto-scrolls unconditionally, a logged
defect (`docs/plans/FABLE-GATE-PLAN.md` research section C). This
package suppresses auto-scroll once the reader has scrolled more than
96px from the bottom, and surfaces a "Jump to latest" pill (bottom
padding equal to the composer's own height, `composerHeightPx`,
instead of a fixed guess) so an in-progress read is never yanked to
the newest message. Reading column is capped at `--measure` (68ch).

## States

`loading`, empty (no messages, no error), `sending` ("Crestfall Engine
is composing"), `summaryPending` ("preparing the current scene
recap"), and `errorMessage`. The opening hero image renders above the
first message only once no earlier messages are hidden
(`hiddenCount === 0`), matching the baseline's placement rule.

## Fixtures

`ChatTranscript.fixtures.js`: default (hero image plus a re-slotted
media conversation), an 18-message windowed case (Load Earlier
visible), empty, loading, sending, summary-pending, error, and a
longest-content case (the chat-message longest fixture appended to the
default conversation).

## Package assets

- `ChatTranscript.contract.js`
- `ChatTranscript.fixtures.js`
- `useChatTranscriptViewModel.js`
- `/dev/ui-preview/chat-transcript`
