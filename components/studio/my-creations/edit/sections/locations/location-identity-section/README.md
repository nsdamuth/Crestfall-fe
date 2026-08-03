# Location Identity Section

Portable LOOM boundary for the Location Identity section used by Creation Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/locations/
  LocationIdentitySection.jsx
```

The Shell preserves the existing public API:

```jsx
<LocationIdentitySection
  form={form}
  creationId={creationId}
  updateDataField={updateDataField}
/>
```

## Responsibilities

### ViewModel / Chassis

- reads `form.data`
- preserves the existing `data.name ?? form.title` name fallback
- preserves current category, space-type, and location-scale fallbacks
- formats and parses comma-separated tags
- normalizes inheritance so missing values default to `true`
- reads current camelCase parent metadata and legacy snake_case parent metadata
- owns parent-picker open state
- maps a selected parent to:
  - `parentLocationId`
  - `parentLocationTitle`
  - `parentLocationDescription`
  - `parentLocationImageUrl`
  - `parentLocationScale`
  - `parentLocationSpaceType`
- clears the same six parent fields together
- writes inheritance changes back to `creation.data.inheritance`

### Binding Shell

- renders the portable View
- owns the application `LocationParentPickerModal`
- injects the current Location ID, selected parent ID, close callback, and
  parent-selection callback

### Portable View / Skin

- renders location identity fields
- renders selected and empty parent states
- renders parent metadata and semantic select/change/clear actions
- renders inheritance controls
- emits semantic edit callbacks only

The View does not inspect Creation JSONB, understand legacy snake_case keys,
open the application picker, persist data, or know about services, PostGraphile,
or database rules.

## Preserved Storage Behavior

The patch keeps the existing canonical write keys while continuing to read the
legacy snake_case hierarchy fields already supported by the old component.
No parent, identity, tags, or inheritance payload shape changes are introduced.

## Preview

Development only:

```text
/dev/ui-preview/location-identity-section
```
