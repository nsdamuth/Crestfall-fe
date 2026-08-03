# Storyline Fields Section LOOM Package

## Portable LOOM boundary

`StorylineFieldsSection.view.jsx` renders only normalized section copy and a
semantic editor slot. It does not read a Creation form, normalize Storyline
JSONB, fetch Story or Scenario references, or import the application editors.

`useStorylineFieldsSectionViewModel.js` owns:

- Storyline payload normalization
- section selection and display copy
- sequence versus transition editor mode
- Story and Scenario reference-option orchestration
- immutable normalized payload replacement through `updateDataField`

The Binding Shell retains:

- `StorylineNodeListEditor`
- `StorylineOpenWorldSettings`

Those controls remain application-owned because they contain the full Storyline
node authoring, reference-picker, transition-trigger, and open-world editing
workflows.

## Preserved storage behavior

Every normalized key returned by `normalizeStorylineData` is written back to
its matching `creation.data` field through `updateDataField`. Existing node,
transition, trigger, open-world, continuity, and version fields therefore keep
the same payload shape and save path.

## Preview

Development only:

```text
/dev/ui-preview/storyline-fields-section
```
