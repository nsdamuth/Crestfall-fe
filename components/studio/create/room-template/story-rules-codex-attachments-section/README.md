# Story Rules Codex Attachments LOOM Feature

## Public Binding Shell

```text
components/studio/create/room-template/
  StoryRulesCodexAttachmentsSection.jsx
```

The Shell binds the Story attachment ViewModel to the portable View and mounts
an existing linked-creation picker Binding Shell only while the Rules Codex
picker is active.

## Portable View / Skin

```text
components/studio/create/room-template/
  story-rules-codex-attachments-section/
    StoryRulesCodexAttachmentsSection.view.jsx
```

The View owns only:

- attachment heading and explanation;
- attachment cards;
- optional relationship notes;
- empty and populated presentation;
- semantic attach, remove, and note-change intent.

The View does not know creation types, API calls, owned-creation loading,
relationship storage fields, legacy normalization, Story saving, runtime
selection, prompt composition, PostGraphile, or the database.

## ViewModel / Chassis

```text
components/studio/create/room-template/
  story-rules-codex-attachments-section/
    useStoryRulesCodexAttachmentsSectionViewModel.js
```

The ViewModel owns:

- `rulesCodexIds` and `rulesCodexLinks` compatibility;
- legacy ID-only attachment normalization;
- deduplication;
- linked-creation relationship snapshots;
- picker open/close state;
- the `RULES_CODEX` picker filter;
- semantic updates through the caller-supplied `updateDataField` callback.

## Persistence boundary

The feature does not save directly. Its live callers update the current Story
form, and the existing Story create/edit pipeline persists the complete Story
creation through the established client, FE API, services-api, PostGraphile,
and database boundary.

## Runtime boundary

This feature saves Story scope only. It does not retrieve Rules Codex sections,
execute mechanics, compile prompts, or call an AI provider.

## Preview

```text
/dev/ui-preview/story-rules-codex-attachments-section
```

The preview renders the portable View from direct contract fixtures and keeps
all changes local.
