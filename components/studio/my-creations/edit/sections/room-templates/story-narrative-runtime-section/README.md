# Story Narrative Runtime Section LOOM Boundary

## Public Entry Point

```text
components/studio/my-creations/edit/sections/room-templates/
  StoryNarrativeRuntimeSection.jsx
```

The public component remains the Binding Shell and preserves the existing API:

```jsx
<StoryNarrativeRuntimeSection
  form={form}
  updateDataField={updateDataField}
/>
```

## ViewModel / Chassis

`useStoryNarrativeRuntimeSectionViewModel.js` owns:

- reading `form.data.story_runtime_authoring`
- `normalizeStoryAuthoring(...)`
- policy-option normalization
- Story Circle phase labels and ordering supplied by normalized authoring data
- joining guidance arrays for textarea display
- policy and phase mutation orchestration
- committing only through `updateDataField("story_runtime_authoring", ...)`
- renormalizing every committed authoring object

## Portable View / Skin

`StoryNarrativeRuntimeSection.view.jsx` owns:

- the Story Runtime heading and explanatory copy
- policy selectors
- completion-guidance presentation
- Story Circle phase disclosures
- objective and line-guidance textarea presentation
- responsive layout and visual open/close labels
- defensive invocation of semantic callbacks

The View does not know the creation-form shape, the
`story_runtime_authoring` storage field, normalization rules, guidance-array
storage, Story Circle defaults, saving, services, PostGraphile, database
semantics, or creation lifecycle rules.

## Preserved Behavior

- the first normalized Story Circle phase is initially open
- all later phases are initially closed
- policy labels preserve the existing underscore-to-space display behavior
- objective edits update only the matching phase
- pressures, consequences, reentry hooks, and beat suggestions still pass raw
  textarea text into the existing authoring normalizer
- every mutation rewrites only `story_runtime_authoring`

## Preview

```text
/dev/ui-preview/story-narrative-runtime-section
```

The preview renders the portable View directly from contract-shaped fixtures.
It is development-only and returns `notFound()` in production.
