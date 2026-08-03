# Opening Message Card Loom Feature

## Public component

```text
components/studio/room-templates/OpeningMessageCard.jsx
```

The public component remains the Binding Shell and preserves the existing API:

```jsx
<OpeningMessageCard
  message={message}
  index={index}
  selectedCharacters={selectedCharacters}
  onChange={updateOpeningMessage}
  onRemove={removeOpeningMessage}
/>
```

## Ownership boundary

### ViewModel / application-owned

- reads the opening-message ID and current stored values
- converts the zero-based message index into the display label
- converts selected character records into speaker options
- maps semantic speaker/body changes back to the existing
  `onChange(messageId, fieldName, value)` callback
- enforces the existing rule that the first opening message cannot be removed
- maps semantic removal intent back to `onRemove(messageId)`

### View / UI-owned

- card layout and typography
- speaker selection rendering
- message textarea rendering
- remove-button styling and disabled presentation
- safe invocation of semantic callbacks

The View does not receive message IDs, selected character records, Story package
fields, storage field names, or persistence behavior.

## Preview

```text
/dev/ui-preview/opening-message-card
```

The preview renders contract-shaped fixtures and keeps all speaker, body, and
remove interactions in local preview state. It does not load or save a Story.

The preview route returns `notFound()` in production.

## Same-named component

A second file currently exists at:

```text
components/studio/create/room-template/OpeningMessageCard.jsx
```

It is not imported by the active Story creation workflow in the supplied FE
archive. This Loom conversion does not modify, merge, relocate, or delete it.
