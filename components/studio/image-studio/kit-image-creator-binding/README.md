# Kit Image Creator ↔ Camera Presets / Scenery binding

Status: **LIVE — W39**.

This package connects two already accepted Image Studio semantic packages to the
current protected Kit Image Creator contract:

```text
camera_preset.presentation.v1
location_only_scenery.presentation.v1
```

It deliberately does **not** modify:

```text
components/kit/**
app/studio/v2/**
```

## Camera / Framing

The current Kit Image Creator already owns a standard single-select option field:

```text
Camera / Framing
```

Therefore Camera Presets can bind immediately without a Kit contract change.

This binding replaces the stale/legacy camera option list supplied to that field
with the accepted current catalog:

```text
29 choices including Auto
7 semantic groups in the source catalog
```

The Kit select itself remains a flat option field because that is what the
current protected contract accepts today.

The binding also upgrades older saved values through the accepted compatibility
map, for example:

```text
THREE_QUARTER -> MEDIUM_WIDE_SHOT
FULL_BODY     -> WIDE_SHOT
FACE_CLOSEUP  -> CLOSE_UP
```

Because 29 choices exceed the FE lane's tile-scale threshold, the binding carries:

```text
pickerScaleRecommended: true
```

The FE lane may later replace the flat select with its ruled picker treatment.
That visual change belongs to the protected Kit lane, not this patch.

## Missing Camera field

If a caller's current option list has no Camera / Framing field, the binding
inserts it immediately after the first image option field.

That keeps the binding resilient while the Chassis/FE integration is converging.

## Location-only scenery helper

The current product behavior is already captured by:

```text
location_only_scenery.presentation.v1
```

The helper is eligible when:

```text
Location selected
AND no Character selected
AND no Player Character selected
```

and visible only in Image mode.

Current copy remains:

```text
Optimize for scenery-only image
Adds scenic composition guidance and suppresses people.
```

## W39 Kit closure

W39 uses the explicit protected-lane unlock to extend the Kit Image Creator
contract from `1.0.0` to `1.1.0` with a caller-supplied `sceneryHelper` and
`onChangeSceneryOnlyHelper` callback. The helper is now rendered directly above
the prompt when visible.

The binding now reports:

```text
currentKitContractSupportsControl: true
requiresFeVisualExtension: false
recommendedPlacement: IMAGE_OPTIONS_NEAR_PROMPT
```

Camera / Framing still fits the existing option-field grammar and receives the
full 29-choice catalog. The legacy Image Studio surface additionally uses the
shared Kit picker modal for the larger camera catalog.

## Permanent boundary

Crestfall owns:

- selected ingredient application state
- camera selection application state
- scenery-toggle application state
- camera prompt expansion
- scenery prompt expansion
- image generation payload construction
- provider behavior
- Coin/generation authorization
- image generation submission

Crestfall-fe owns:

- Camera / Framing option presentation
- eventual camera picker visual treatment
- scenery-helper visual composition
- semantic change callbacks

## W39 scope

W39 intentionally touches `components/kit/image-creator-panel/**` to close the
scenery-control contract gap. It does not modify `app/studio/v2/**`, chat, or
saved-edit product behavior.
