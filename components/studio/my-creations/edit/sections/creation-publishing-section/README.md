# Creation Publishing Section

**Contract:** `CreationPublishingSection.contract.js`, 1.1.0 (ED1,
docs/plans/FABLE-GATE-2-STUDIO.md: Unlist for Editing and Cancel
Review moved in from the retired sticky action bar, both behind a
local Confirm/Cancel arm step, same formula as the sticky bar's own
`canUnlistForEditing`. Public and canon review submission now arm the
same confirm step. Additive only.)

## Portable LOOM boundary

```text
PublishingSection.jsx                         Binding Shell
  ↓
useCreationPublishingSectionViewModel.js     ViewModel / Chassis
  ↓
CreationPublishingSection.view.jsx           Portable View / Skin
```

The public `PublishingSection.jsx` import remains stable for Creation Edit.

## ViewModel ownership

The ViewModel owns:

- lifecycle status normalization;
- public and canon review eligibility;
- internal approved-state handling;
- official-canon, in-review, archived, and saving disabled decisions;
- public and canon action labels;
- template-management copy and disabled placeholder actions;
- visibility and content-rating storage-key mapping;
- review message tone;
- safe semantic callbacks for field changes and review submission.

## Portable View ownership

The View owns only the publishing layout, display-ready selects, template panel,
review action panels, messages, disabled presentation, and safe callback
invocation. It does not know Crestfall lifecycle values, canon values, review
submission rules, or creation storage keys.

## Preview

Development-only preview:

```text
/dev/ui-preview/creation-publishing-section
```
