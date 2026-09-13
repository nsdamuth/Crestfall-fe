# StoryRoomMessage Loom boundary

## Public entry point

```text
components/studio/story-rooms/StoryRoomMessage.jsx
```

The public component remains a small Binding Shell accepting the existing:

```jsx
<StoryRoomMessage message={message} />
```

## Application-owned ViewModel

`useStoryRoomMessageViewModel.js` owns interpretation of the raw Story Room
message record, including:

- player, narrator, system, opening-scene, and character classification;
- raw metadata and delivery-state fields;
- semantic-presentation contract validation;
- character color-palette resolution;
- semantic segment and status-block normalization;
- speaker, avatar, mode, body, failed, and optimistic fields.

## Portable View

`StoryRoomMessage.view.jsx` owns only message-bubble presentation:

- surface styling for each display tone;
- the type steps (brief 3 item 6, RULED by Brian, replacing brief 2
  item 8's body step): the body at `--text-chat` and `--lh-chat`, the
  transcript body tier (14 over 22) minted in `app/theme.css` and legal
  only in this package; the opening label, mode pill, and delivery
  lines at `--text-label`; the speaker name (brief 4 item 10, review
  rounds 4 and 5 item 1, RULED) in the display font at `--text-lead`,
  `--weight-medium`, `--ink`, no uppercase, no tracking, so it reads
  larger than the eyebrow above it and never matches it;
  system notices stay at the ui step;
- speaker identity, mode pill, and opening-scene label;
- legacy inline bold/action/quote rendering;
- display-ready semantic segments and status blocks;
- palette colors already supplied by the ViewModel;
- failed and sending status copy;
- responsive and accessible markup.

It does not inspect raw Story Room metadata, validate engine presentation
contracts, resolve character palettes, call APIs, send messages, mutate room
state, or persist data.

## Preview

```text
/dev/ui-preview/story-room-message
```

The preview renders the portable View directly from contract-shaped fixtures.
It does not load a Story Room or send a message.
