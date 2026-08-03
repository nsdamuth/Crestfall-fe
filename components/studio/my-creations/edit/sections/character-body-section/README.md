# Character Body Section

## Portable LOOM boundary

```text
BodySection.jsx                              Binding Shell
        ↓
useCharacterBodySectionViewModel.js          ViewModel / Chassis
        ↓
CharacterBodySection.view.jsx                Portable View / Skin
```

The portable View owns the Body section layout and the Custom Body Notes field. It receives Kibbe, Body Type, Height, Build, and Proportions controls as application-owned slots.

The ViewModel owns:

- reading existing Character creation data;
- normalizing the `proportions` array;
- mapping guided controls to the existing Character data fields;
- forwarding body-note updates through the existing `updateDataField` callback;
- supplying semantic labels, descriptions, and option lists to the Binding Shell.

The Binding Shell owns the existing Crestfall `KibbePresetModal`, `TraitModal`, and `MultiTraitModal` components. The portable View does not import those application controls and does not know Character JSONB storage field names.

## Stored fields preserved

The conversion preserves:

- `body_type`;
- `height`;
- `build`;
- `proportions`;
- `body_notes`;
- all fields written by the existing Kibbe preset control.

## Development preview

```text
/dev/ui-preview/character-body-section
```

The preview renders the portable View from fixtures and substitutes local visual controls for Crestfall application modals.
