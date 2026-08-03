# Creation Overview Section

## Portable LOOM boundary

```text
OverviewSection.jsx                         Binding Shell
  ↓
useCreationOverviewSectionViewModel.js     ViewModel / Chassis
  ↓
CreationOverviewSection.view.jsx           Portable View / Skin
```

The public `OverviewSection.jsx` import remains stable for Creation Edit.

## ViewModel ownership

The ViewModel owns:

- normalization of the current top-level creation title and description;
- mapping semantic title changes to `updateField("title", value)`;
- mapping semantic description changes to `updateField("description", value)`;
- the disabled preview state and optional future preview callback;
- safe callback invocation when Creation Edit handlers are unavailable.

## Portable View ownership

The View owns only the Overview layout, title and public-description controls,
preview-button presentation, and safe invocation of semantic callbacks. It does
not receive the raw `form`, know top-level creation storage keys, or call
persistence helpers.

## Preview

Development-only preview:

```text
/dev/ui-preview/creation-overview-section
```
