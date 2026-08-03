# Character Behavior Section

## Portable LOOM boundary

```text
BehaviorSection.jsx                         Binding Shell
        ↓
useCharacterBehaviorSectionViewModel.js     ViewModel / Chassis
        ↓
CharacterBehaviorSection.view.jsx           Portable View / Skin
```

The portable View owns the Behavior section layout, optional-framework explanation, verbosity presentation, and philosophy field. It receives personality, trait, voice-module, and interest controls as application-owned slots.

The ViewModel owns:

- reading the existing Character creation data;
- preserving the current scalar fallback for legacy array-shaped `interests` values;
- normalizing `voice_module_ids` into a clean string array;
- supplying the current option catalogues and copy;
- mapping semantic callbacks to the existing `updateDataField` storage keys.

The Binding Shell owns the existing Crestfall personality, trait, and voice-module picker components. The portable View does not import those application controls and does not know Character JSONB field names.

## Stored fields preserved

The conversion preserves:

- `outward_personality` and `internal_personality`;
- optional MBTI and zodiac fields;
- `speech_style` and `movement_style`;
- `voice_module_ids`;
- `verbosity_level`;
- `interests`;
- `philosophy`.

## Development preview

```text
/dev/ui-preview/character-behavior-section
```

The preview renders the portable View from fixtures and substitutes local visual controls for Crestfall application modals.
