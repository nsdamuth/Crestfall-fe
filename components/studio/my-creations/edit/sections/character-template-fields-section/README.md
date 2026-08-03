# Character Template Fields Section

## Portable LOOM boundary

```text
CharacterTemplateFieldsSection.jsx                Binding Shell
        ↓
useCharacterTemplateFieldsSectionViewModel.js      ViewModel / Chassis
        ↓
CharacterTemplateFieldsSection.view.jsx            Portable View / Skin
```

The portable View owns the visual layouts for the Template Info, Identity Defaults, Appearance Defaults, Body Defaults, and Behavior Defaults tabs. It receives Crestfall-specific pickers and guided controls as application-owned slots.

The ViewModel owns:

- reading `creation.data.fields`;
- normalizing legacy scalar and `hips_waist_shoulders` proportion values;
- mapping top-level template metadata to `title`, `description`, `template_category`, and `template_tags`;
- mapping reusable character defaults into the nested `fields` object;
- clearing the legacy `hips_waist_shoulders` value when modern proportions are written;
- tag formatting and parsing;
- semantic labels, options, values, and callbacks supplied to the View.

The Binding Shell owns the existing Crestfall role, appearance, body, personality, and trait modals. The portable View does not import those application controls and does not know Character Template JSONB storage keys.

## Stored fields preserved

The conversion preserves all existing Character Template edit fields, including:

- top-level `title` and `description`;
- `data.template_category` and `data.template_tags`;
- every reusable default under `data.fields`;
- legacy proportion compatibility through `hips_waist_shoulders`.

## Development preview

```text
/dev/ui-preview/character-template-fields-section
```

The preview renders each portable tab from fixtures and supplies local visual placeholders for Crestfall application controls.
