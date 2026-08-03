# Character Template Builder LOOM feature

## Boundary

```text
CharacterTemplateBuilder.jsx                         Binding Shell
  ↓
useCharacterTemplateBuilderViewModel.js              ViewModel / Chassis
  ↓
CharacterTemplateBuilder.view.jsx                    Portable View / Skin
```

`CharacterTemplateBuilderEditor.jsx` remains an application-owned composition
surface for the existing Crestfall modal and selector bindings. The portable
View receives that editor as semantic content and does not import Crestfall
application Shells.

## Responsibilities

The View owns the wizard layout, summary card, progress, step navigation, save
presentation, and semantic callback invocation.

The ViewModel owns form state, completion calculations, step transitions,
payload construction, creation mutation, save state, and navigation.

The Binding Shell preserves the public import and injects the existing
application-specific editor and Next.js browse link.

## Preview

Development only:

```text
/dev/ui-preview/character-template-builder
```

The preview renders the portable View from fixtures and has no API, database,
or creation persistence connection.
