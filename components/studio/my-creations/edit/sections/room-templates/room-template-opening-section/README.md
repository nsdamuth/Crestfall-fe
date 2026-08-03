# Room Template Opening Section

Portable LOOM boundary for the Story Opening section used by Creation Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/room-templates/
  RoomTemplateOpeningSection.jsx
```

The Shell preserves the existing public API:

```jsx
<RoomTemplateOpeningSection
  form={form}
  updateDataField={updateDataField}
/>
```

## Responsibilities

### ViewModel

- reads `form.data`
- preserves the exact fallback opening message:

  ```js
  {
    id: "message-1",
    speaker: "Narrator",
    body: "",
  }
  ```

- preserves the existing non-empty-array rule for `opening_messages`
- derives speaker options from Narrator, `selected_characters`, and Player Prompt
- preserves the existing `message-${openingMessages.length + 1}` ID rule
- preserves update-by-message-ID behavior
- preserves the first-message removal lock
- maps semantic View callbacks to only:
  - `public_opening_context`
  - `opening_messages`

### Portable View

- renders the Story opening heading and public context field
- renders display-ready opening-message cards
- renders the speaker selector and message field
- presents the first-message removal lock
- emits semantic context, speaker, body, add, and remove callbacks
- invokes callbacks defensively

The View does not know creation-form shape, Story JSON storage fields, selected
character storage, default-message rules, message ID generation, save behavior,
services, PostGraphile, database semantics, or creation lifecycle rules.

## Existing Opening Message Components

This conversion does not merge, replace, relocate, or delete either existing
`OpeningMessageCard` implementation. The Creation Edit opening section keeps its
current markup and behavior behind its own LOOM boundary.

## Preview

```text
/dev/ui-preview/room-template-opening-section
```

The preview is development-only and returns `notFound()` in production.
