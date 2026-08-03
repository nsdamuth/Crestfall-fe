# Visual Asset Builder LOOM Surface

## Public binding

```text
components/studio/create/assets/AssetBuilderShell.jsx
```

The public Shell preserves the existing import used by the Create Outfit,
Create Pose, and Create Image Preset pages. It also preserves the dormant
location compatibility path without making the portable View import Crestfall
location Binding Shells.

## LOOM boundary

```text
AssetBuilderShell.jsx
  → useAssetBuilderViewModel.js
  → AssetBuilder.view.jsx
```

The ViewModel owns:

- asset-type resolution from the supplied builder configuration;
- form, extra-field, cover-selection, and parent-picker state;
- prompt-length enforcement and tag normalization;
- creation-payload construction;
- location parent selection and inherited runtime data;
- save status and error handling;
- client-layer creation calls;
- redirecting to Creation Edit after successful creation.

The portable View owns JSX, visual hierarchy, fields, option rendering,
candidate presentation, save-state presentation, and semantic callback
invocation. It does not call APIs, build database payloads, navigate, or import
application Binding Shells.

## Application-owned location composition

The existing location runtime modules, registry attachments, and parent picker
remain application-owned. `AssetBuilderShell.jsx` injects them into semantic
presentation slots only when the supplied configuration resolves to
`LOCATION`.

This preserves the historical compatibility behavior while the dedicated
`LocationBuilderShell` remains the current Create Location entry point.

## Persistence path

```text
Portable View
→ Asset Builder ViewModel
→ assetClient.js
→ creationClient.js
→ /api/creations
→ services-api
→ PostGraphile
→ public.creations
```

## Stored contracts preserved

The create payload continues to support:

- `OUTFIT` with normal clothing prompt defaults;
- `POSE`;
- `IMAGE_PRESET`;
- the historical `LOCATION` compatibility payload;
- `builder: VISUAL_ASSET_BUILDER`;
- `builder_version: 1.0`;
- prompt guidance, image prompt, negative prompt, tags, rendering style,
  candidate count, selected cover, visibility, and content rating;
- reusable image-generation ingredient flags.

## Preview

```text
/dev/ui-preview/asset-builder
```

The development-only preview renders Outfit, Pose, Image Preset, Location,
empty, saving, saved, and error fixtures without persistence or application
queries.
