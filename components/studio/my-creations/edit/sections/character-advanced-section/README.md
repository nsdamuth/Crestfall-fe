# Character Advanced Guidance Section

## Portable LOOM boundary

```text
AdvancedSection.jsx                              Binding Shell
        ↓
useCharacterAdvancedSectionViewModel.js          ViewModel / Chassis
        ↓
CharacterAdvancedSection.view.jsx                Portable View / Skin
```

The portable View owns the Advanced Guidance layout for optional creator guidance that remains part of Character authoring. It receives the existing Advanced Prompting feature as an application-owned slot.

The ViewModel owns:

- reading existing Character creation data;
- normalizing non-string text values;
- mapping semantic callbacks to the existing Character data fields;
- forwarding creator-directive updates through the existing `updateDataField` callback;
- supplying the existing labels, descriptions, and placeholders.

The Binding Shell owns `AdvancedPromptingEditor`. The portable View does not import that application feature and does not know Character JSONB storage field names.

## Stored fields preserved

The visible editor preserves:

- `greeting`;
- `relationship_to_player`;
- `appearance_notes`;
- `personality_notes`;
- `extra_runtime_notes`;
- `creator_directives`.

Historical `scenario` and `backstory` values remain untouched in stored Character data, but they are no longer exposed as Character authoring controls. Those concepts belong to Story/Scenario authoring rather than Character definition.

## Development preview

```text
/dev/ui-preview/character-advanced-section
```

The preview renders the portable View from fixtures and substitutes a local visual block for the application-owned Advanced Prompting editor.
