# Character Advanced Guidance Section

## Portable LOOM boundary

```text
AdvancedSection.jsx                              Binding Shell
        ↓
useCharacterAdvancedSectionViewModel.js          ViewModel / Chassis
        ↓
CharacterAdvancedSection.view.jsx                Portable View / Skin
```

The portable View owns the Advanced Guidance layout and the seven standard text areas. It receives the existing Advanced Prompting feature as an application-owned slot.

The ViewModel owns:

- reading existing Character creation data;
- normalizing non-string text values;
- mapping semantic callbacks to the existing Character data fields;
- forwarding creator-directive updates through the existing `updateDataField` callback;
- supplying the existing labels, descriptions, and placeholders.

The Binding Shell owns `AdvancedPromptingEditor`. The portable View does not import that application feature and does not know Character JSONB storage field names.

## Stored fields preserved

The conversion preserves:

- `greeting`;
- `scenario`;
- `relationship_to_player`;
- `backstory`;
- `appearance_notes`;
- `personality_notes`;
- `extra_runtime_notes`;
- `creator_directives`.

## Development preview

```text
/dev/ui-preview/character-advanced-section
```

The preview renders the portable View from fixtures and substitutes a local visual block for the application-owned Advanced Prompting editor.
