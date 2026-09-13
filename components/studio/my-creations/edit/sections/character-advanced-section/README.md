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
- `scenario`;
- `relationship_to_player`;
- `appearance_notes`;
- `personality_notes`;
- `extra_runtime_notes`;
- `creator_directives`.

`scenario` remains a Character-authored opening premise/environment guidance field. It is distinct from selecting or authoring a first-class `SCENARIO` Creation for a Story. Existing `data.scenario` values are read and written in place so older Characters retain their authored setup text.

Historical `backstory` values remain untouched in stored Character data but are not exposed by this portable section.

## Development preview

```text
/dev/ui-preview/character-advanced-section
```

The preview renders the portable View from fixtures and substitutes a local visual block for the application-owned Advanced Prompting editor.
