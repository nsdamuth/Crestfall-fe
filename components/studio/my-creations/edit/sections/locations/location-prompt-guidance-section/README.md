# Location Prompt Guidance Section

## Portable LOOM boundary

`LocationPromptGuidanceSection.jsx` is the thin Binding Shell. It invokes the ViewModel and renders the portable View without interpreting Creation JSONB or owning persistence behavior.

`LocationPromptGuidanceSection.view.jsx` renders only display-ready copy, text values, prompt limits, and semantic callbacks. It does not receive `form`, `updateDataField`, Creation records, lifecycle state, or persistence clients.

`useLocationPromptGuidanceSectionViewModel.js` owns:

- normalization of the Location `data` payload;
- the legacy `prompt` fallback for `prompt_guidance`;
- canonical storage mapping for `prompt_guidance`, `image_prompt`, `negative_prompt`, `usage_notes`, `compatibility_notes`, and `registry_notes`;
- the existing 2,000-character limits for standalone and negative prompts.

Creation Edit remains responsible for hydration, save orchestration, authorization, and persistence.

## Preview

Development-only preview:

`/dev/ui-preview/location-prompt-guidance-section`

The route renders complete, legacy-fallback, sparse, and empty fixture states. It is blocked in production.

## Diagnostics

Run:

`npm run diagnostics:loom:location-prompt-guidance-section`
