# Camera Preset presentation semantics

Status: semantic presentation catalog and fixtures only.

This package brings the current Camera / Framing choices into the FE lane
without copying the legacy `CameraPresetPickerModal`.

## Current product shape

The current camera catalog contains:

```text
29 choices including Auto
7 groups
```

Groups:

- Shot Size
- Camera Angle
- Camera Movement
- Lens
- Focus
- Lighting Direction
- Specialized

Because the catalog is already well above the FE lane's approximate twelve-tile
threshold, this semantic package exposes a picker-ready row projection rather
than assuming all presets should render as simultaneous tiles.

Search intentionally matches labels, descriptions, and group ids, so broad
terms such as "focus" can return relevant presets from more than one group.

## Compatibility

The presentation contract preserves normalization for older saved camera values:

```text
FACE_CLOSEUP   -> CLOSE_UP
HEAD_SHOULDERS -> MEDIUM_CLOSE_UP
BUST           -> MEDIUM_CLOSE_UP
WAIST_UP       -> MEDIUM_SHOT
THREE_QUARTER  -> MEDIUM_WIDE_SHOT
FULL_BODY      -> WIDE_SHOT
```

Unknown values fall back to Auto.

## Permanent boundary

Crestfall remains authoritative for image-generation behavior, including any
provider-ready prompt expansion or camera-generation semantics.

Crestfall-fe receives only display semantics:

- ids
- labels
- descriptions
- grouping
- selection
- legacy value normalization
- search projection

The raw camera prompt strings are deliberately absent from this package.

## Visual integration ruling

FE-REVIEW-01 ruled that Camera Presets should use the current Kit image creator
vocabulary. Since there are 29 choices, the likely presentation is the picker
grammar rather than a flat set of option tiles.

This patch does not modify:

- `KitImageCreatorPanel`
- `KitPickerModal`
- the V2 Images page
- the legacy composer/workbench
- generation wiring

The FE lane can consume this semantic catalog when it performs the ruled visual
integration.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
