# Image Studio Workbench LOOM package

## Boundary

`ImageStudioWorkbench.jsx` is the thin Binding Shell. It binds the Crestfall
`StudioAccountProvider` context and the four application-owned child controls:
Media History Grid, Image Studio Composer, Ingredient Picker Modal, and Save
Ingredient Preset Modal.

`ImageStudioWorkbench.view.jsx` is the portable Skin. It owns only the desktop
and mobile layout, the responsive composer drawer, keyboard activation, the
quick-generate button, and placement of injected child controls.

`useImageStudioWorkbenchViewModel.js` is the Chassis. It owns:

- Image Studio composer state
- selected and custom ingredient state
- Character / Player Character mutual exclusion
- ingredient picker and save-preset orchestration
- image-generation availability and coin gating
- the exact image-generation request packet
- generation history optimistic placeholders and resolution
- account coin refresh after generation
- custom preset draft construction and `createCreationDraft`

## Preserved generation behavior

The LOOM conversion preserves `mode: image`, `operation: create_image`, all six
ingredient slots, custom-versus-asset ingredient modes, prompt mode selection,
camera and wardrobe composition, empty reference/control inputs, legacy
rendering-style mapping, render profile key, aspect-ratio mapping, output count,
standard quality, null seed, and anime/realistic model-profile selection.

Image generation still costs 5 coins. It still requires a Character, Player
Character, Outfit, custom Outfit, Location, or custom Location source. The
existing default-clothing and custom-character guidance messages are unchanged.

## Preserved preset storage

Saved custom presets still use the existing Creation draft client and remain
`PRIVATE` and `SFW`. The payload retains:

- `builder: VISUAL_ASSET_BUILDER`
- `builder_version: 1.0`
- `asset_type` and `ingredient_type`
- `visual_asset` and `image_gen_ingredient`
- Outfit clothing defaults
- Location inheritance, registry bindings, and runtime module bindings
- Image Preset prompt fields
- Pose energy and orientation fields
- `created_from_image_studio_custom_preset: true`

No SQL, API route, service, PostGraphile, database, R2, or generation-provider
change is included.

## Development preview

`/dev/ui-preview/image-studio-workbench` is blocked in production. It uses local
fixtures and injected preview controls. It does not spend coins, fetch history,
create a preset, or submit an image-generation job.

## Production browser validation

Use `/studio/image-studio` and verify desktop and mobile composer behavior,
asset and custom ingredient selection, Character / Player Character mutual
exclusion, generation gating, image generation, optimistic history entries,
coin balance updates, Load More, and custom Pose / Outfit / Location / Image
Preset creation.

This package does not alter Story Room runtime behavior and does not abstract
the deferred Mechanics Module.
