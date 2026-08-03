# Room Template Identity Section

Portable LOOM boundary for the Story Identity section used by Creation Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/room-templates/
  RoomTemplateIdentitySection.jsx
```

The Shell preserves the existing public API:

```jsx
<RoomTemplateIdentitySection
  form={form}
  updateDataField={updateDataField}
/>
```

## Responsibilities

### ViewModel

- reads `form.data`
- preserves the existing `GROUP` Story-mode default
- preserves the existing `OPTIONAL` Player Character default
- supplies the exact current option values and labels
- formats stored tag arrays for editing
- parses comma-separated tag input into trimmed arrays
- maps semantic View callbacks to the current stored fields

### Portable View

- renders the Story Identity heading
- renders Story Mode and Player Character selectors
- renders the Tags field
- invokes semantic callbacks defensively

The View does not know Story JSON storage fields, save behavior, services,
PostGraphile, database semantics, or creation lifecycle rules.

## Preview

```text
/dev/ui-preview/room-template-identity-section
```

The preview is development-only and returns `notFound()` in production.
