# Scenario Story Circle Section

Portable LOOM boundary for the Scenario Story Circle section used by Creation
Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/scenarios/
  ScenarioStoryCircleSection.jsx
```

The Shell preserves the existing public API:

```jsx
<ScenarioStoryCircleSection
  form={form}
  updateDataField={updateDataField}
/>
```

## Responsibilities

### ViewModel

- reads `form.data.story_circle`
- normalizes missing or invalid Story Circle payloads to an empty object
- owns the canonical eight Dan Harmon Story Circle step definitions
- preserves the existing labels, titles, helper copy, order, and placeholder
- maps every semantic step edit back to `updateDataField("story_circle", nextValue)`
- merges one changed step without discarding the other stored steps

### Portable View

- renders the section heading
- renders the supplied Story Circle cards in order
- displays the supplied label, title, helper, value, and placeholder
- invokes each step's semantic `onChange` callback defensively

The View does not inspect a Creation form, know the `story_circle` JSONB field,
merge stored data, call APIs, or own persistence behavior.

## Preview

```text
/dev/ui-preview/scenario-story-circle-section
```

The preview is development-only and returns `notFound()` in production.
