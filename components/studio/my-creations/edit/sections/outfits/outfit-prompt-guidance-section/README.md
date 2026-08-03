# Outfit Prompt Guidance Section

## Portable LOOM boundary

```text
OutfitPromptGuidanceSection.jsx                  Binding Shell
  → useOutfitPromptGuidanceSectionViewModel      ViewModel / Chassis
  → OutfitPromptGuidanceSectionView              Portable View / Skin
```

The portable View owns only the clothing-mode controls, prompt fields, advanced
section layout, and presentation states. It does not inspect a creation form,
know Outfit JSONB keys, coordinate compatibility fields, or enforce persistence
limits.

The ViewModel owns:

- `form.data.clothing_mode` normalization;
- legacy normal-prompt fallback resolution;
- coordinated writes to `normal_clothing_prompt` and `prompt_guidance`;
- immutable `clothing_sections` updates;
- the 2,000-character standalone and negative prompt limits;
- mapping usage and compatibility notes to existing Outfit storage fields.

## Preserved storage fields

- `clothing_mode`
- `normal_clothing_prompt`
- `prompt_guidance`
- `signature_clothing`
- `clothing_sections`
- `image_prompt`
- `negative_prompt`
- `usage_notes`
- `compatibility_notes`

## Preview

Development-only route:

```text
/dev/ui-preview/outfit-prompt-guidance-section
```
