# Scenario Identity Section

Portable LOOM boundary for the Scenario Identity section used by Creation Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/scenarios/
  ScenarioIdentitySection.jsx
```

The Shell preserves the existing public API:

```jsx
<ScenarioIdentitySection
  form={form}
  updateDataField={updateDataField}
/>
```

## Responsibilities

### ViewModel

- reads `form.data`
- preserves the existing empty Tone default
- preserves the existing `FLEXIBLE` Participant Mode default
- supplies the exact current Tone and Participant Mode option values and labels
- formats stored tag arrays for editing
- parses comma-separated tag input into trimmed arrays
- supplies the read-only creation type from `form.type`
- maps semantic View callbacks to the current stored fields

### Portable View

- renders the Scenario Identity heading
- renders Tone and Participant Mode selectors
- renders the Tags field
- renders the read-only Creation Type field
- invokes semantic callbacks defensively

The View does not know Scenario JSON storage fields, save behavior, services,
PostGraphile, database semantics, or creation lifecycle rules.

## Preview

```text
/dev/ui-preview/scenario-identity-section
```

The preview is development-only and returns `notFound()` in production.
