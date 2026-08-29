# Character Appearance Section

## Portable LOOM boundary

```text
AppearanceSection.jsx                         Binding Shell
        ↓
useCharacterAppearanceSectionViewModel.js     ViewModel / Chassis
        ↓
CharacterAppearanceSection.view.jsx           Portable View / Skin
```

The portable View owns the Appearance section layout, the semantic clothing-source card, and the adjacent default Image Preset card. It receives the Skin Tone, Eye Color, Hair, and Visual Heritage controls as application-owned slots.

The ViewModel owns:

- reading the existing Character creation data;
- normalizing linked Outfit and Wardrobe selections;
- loading owned Image Preset creations for selected-preset presentation;
- normalizing and clearing the Character default Image Preset binding;
- preserving the current `clothing_source` structure and legacy compatibility fields;
- clearing all Outfit and Wardrobe fields together;
- picker state and semantic clothing/image-preset card labels;
- forwarding field changes through the existing `updateDataField` callback.

The Binding Shell owns the existing Crestfall modals and linked-creation picker. The portable View does not import those application components and does not know database or JSONB field names.

## Stored fields preserved

The conversion preserves the current visual fields and both clothing representations:

- Skin Tone, Eye Color, Hair, and `visual_heritage_reference`;
- `clothing_source`;
- `default_clothing_mode` and `clothing_style`;
- current default Outfit fields;
- current default Wardrobe fields;
- `default_image_preset_id` and `default_image_preset_title`.

## Development preview

```text
/dev/ui-preview/character-appearance-section
```

The preview renders the portable View from fixtures and never opens Crestfall application pickers.
