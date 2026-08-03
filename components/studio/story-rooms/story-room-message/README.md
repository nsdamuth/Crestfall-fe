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
