# Pose Prompt Guidance Section

## Purpose

This LOOM feature separates the Pose prompt-guidance presentation from the
Creation Edit form and Pose storage fields.

## Files

```text
PosePromptGuidanceSection.jsx                         # Binding Shell
pose-prompt-guidance-section/
  PosePromptGuidanceSection.view.jsx                  # Portable View
  usePosePromptGuidanceSectionViewModel.js            # Application mapping
  PosePromptGuidanceSection.contract.js               # Versioned View contract
  PosePromptGuidanceSection.fixtures.js               # Isolated View states
  README.md                                            # Feature handoff
```

Development preview:

```text
app/dev/ui-preview/pose-prompt-guidance-section/
```

## Public application API

```jsx
<PosePromptGuidanceSection
  form={form}
  updateDataField={updateDataField}
/>
```

The public component path and caller API remain unchanged.

## Application-owned behavior

The ViewModel owns:

- reading `form.data`;
- current `prompt_guidance` storage;
- legacy `prompt` fallback compatibility;
- `usage_notes` storage;
- `compatibility_notes` storage;
- mapping semantic callbacks back to `updateDataField`.

## UI-owned behavior

The portable View owns:

- section heading and supporting copy;
- Prompt Guidance, Usage Notes, and Compatibility Notes fields;
- responsive spacing and text-area presentation;
- safe semantic callback invocation.

The View does not know creation JSON field names, saving behavior, APIs,
services, PostGraphile, or database semantics.

## Validation

Validate both:

1. `/dev/ui-preview/pose-prompt-guidance-section`
2. Pose Creation Edit → Prompt Guidance → save → refresh
