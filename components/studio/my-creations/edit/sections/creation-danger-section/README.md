# Creation Danger Section

## Portable LOOM boundary

```text
DangerSection.jsx                         Binding Shell
  ↓
useCreationDangerSectionViewModel.js     ViewModel / Chassis
  ↓
CreationDangerSection.view.jsx           Portable View / Skin
```

The public `DangerSection.jsx` import remains stable for Creation Edit.

## ViewModel ownership

The ViewModel owns:

- normalization of `form.status` and `form.reviewStatus`;
- canon-lock interpretation from `form.canonStatus`;
- draft/archived delete eligibility;
- archive and delete disabled decisions;
- action labels for saving, archived, canon-locked, and ineligible states;
- message-tone mapping;
- safe semantic archive and delete callbacks.

## Portable View ownership

The View owns only the visual danger-zone layout, notices, action buttons,
messages, disabled presentation, and safe callback invocation. It does not know
Crestfall lifecycle values such as `DRAFT`, `ARCHIVED`, `CANON`, or `OFFICIAL`.

## Preview

Development-only preview:

```text
/dev/ui-preview/creation-danger-section
```
