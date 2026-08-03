# Narrator Modules Section

## Purpose

Portable Narrator edit section for response-direction and official starter-module selection.

## Public Shell

```text
components/studio/my-creations/edit/sections/narrators/NarratorModulesSection.jsx
```

The Shell preserves the existing public API:

```jsx
<NarratorModulesSection
  form={form}
  updateDataField={updateDataField}
/>
```

## Ownership

### ViewModel owns

- reading `form.data`
- current and legacy selected-module field compatibility
- current and legacy response-direction field compatibility
- official default module selections
- official response-direction defaults
- mapping semantic module actions to `selected_modules`
- mapping semantic response actions to `response_direction`
- composition of the validated Narrator Module Selector ViewModel

### View owns

- Narrator Editor section heading
- spacing around the module selector
- direct composition of `NarratorModuleSelector.view.jsx`

### View must not own

- creation saving
- raw JSON field names
- default merging
- APIs, services, PostGraphile, or database behavior

## Isolated preview

```text
/dev/ui-preview/narrator-modules-section
```

The preview is blocked in production and updates fixture-local state only.
