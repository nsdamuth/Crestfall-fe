# StoryRoomTranscript Loom boundary

## Public entry point

```text
components/studio/story-rooms/StoryRoomTranscript.jsx
```

The public component remains a small Binding Shell accepting the existing:

```jsx
<StoryRoomTranscript
  messages={messages}
  loading={loading}
  sending={sending}
  error={error}
/>
```

## Application-owned ViewModel

`useStoryRoomTranscriptViewModel.js` owns:

- raw Story Room message-array normalization;
- stable transcript item keys;
- conversion of raw messages into direct `StoryRoomMessage` View props;
- loading, sending, and error-value normalization.

It does not load messages, send turns, mutate room state, or call APIs.

## Portable View

`StoryRoomTranscript.view.jsx` owns transcript presentation:

- the scrollable transcript surface;
- presentation-local visible-message batching;
- Load Earlier presentation and count;
- automatic scrolling to the newest transcript state;
- loading, empty, sending, and error cards;
- composition of `StoryRoomMessage.view.jsx`.

Visible-message batching and scrolling remain local because they do not change
Story Room application truth.

The View does not inspect raw message metadata, resolve character palettes,
validate engine presentation contracts, call APIs, or persist data.

## Shared message normalization

`getStoryRoomMessageViewProps(message)` is exported from the validated message
ViewModel module so transcript normalization can compose the message boundary
without calling a Hook in a loop or importing the message Binding Shell into a
portable View.

## Preview

```text
/dev/ui-preview/story-room-transcript
```

The preview renders the portable transcript View directly from contract-shaped
fixtures. It does not load a Story Room or send a message.

## W16 auto-event media wiring

The transcript ViewModel now uses the accepted Auto-Event Media binding before
mapping rows to the portable Story Room Message View.

This makes authoritative Location/Character event images visible in transcript
order without changing ordinary text-message presentation.

The transcript also renders the authoritative opening hero at the true beginning
of the loaded Story.

No protected `components/studio/chat/**` surface is touched.

## W17 message actions and Scene Recap

The W16 media binding remains the single transcript ordering/media authority.

Ordinary text rows now expose local bindings for Copy, Regenerate, Continue, and Report. Regenerate/Continue are available only on the latest Character/Narrator response. Report uses the Chassis message-action endpoint through a presentation-only reason/comment dialog.

`/summary` and `/recap` are live remote Story Room commands. While a recap is running, the transcript shows the accessible Scene Recap pending card.

The protected C1-C6 chat package remains untouched.
