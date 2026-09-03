# Character Body Section

Portable LOOM boundary for the Character Body edit section used by the V2 Creation editor.

## Responsibility

- `BodySection.jsx` is the shell. It binds existing application-owned controls (Kibbe preset picker, trait modals) into the portable section view.
- `useCharacterBodySectionViewModel.js` owns normalization of incoming Creation data and maps persisted storage fields into portable view props.
- `CharacterBodySection.view.jsx` is presentation only. It must not import application modals, API clients, routing, or persistence helpers.

## Persisted fields

The ViewModel reads and writes the following Character data fields:

- `kibbe_identity`
- `body_type`
- `height`
- `build`
- `proportions`
- `body_notes`
- `fantasy_body_notes`
- `realistic_body_notes`

`body_notes` remains the canonical model-neutral Custom Body Prompt. `fantasy_body_notes` and `realistic_body_notes` are short lane-specific additions for image-generation workflows only.

## Preview

Use the fixture-driven preview at `/dev/ui-preview/character-body-section` to verify portable rendering states without entering the full editor shell.
