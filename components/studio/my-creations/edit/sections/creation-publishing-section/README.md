# Creation Publishing Section

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
