# Location-only scenery presentation semantics

Status: semantic presentation contract and realistic fixtures only.

This package brings the current Location-only scenery helper into the FE lane
without copying image-generation prompt compilation or the legacy composer UI.

## Current product behavior represented

The helper is eligible when:

```text
Location selected
AND no Character selected
AND no Player Character selected
```

It is shown for Image generation and hidden for Video mode.

When shown, the current user-facing semantics are:

```text
Optimize for scenery-only image
Adds scenic composition guidance and suppresses people.
```

The helper defaults enabled in the current product, but the creator can opt out.

## Permanent boundary

Crestfall remains authoritative for what the enabled helper does to the actual
image-generation request. That includes the scenery prompt fragment and prompt
composition order.

Crestfall-fe receives only presentation semantics:

- eligibility
- visibility
- enabled/disabled state
- display copy
- selected Location label
- callback shape for changing the local choice

The raw prompt fragment is deliberately absent from this package.

## Visual integration ruling

The current V2 Images page uses the Kit image creator rather than the legacy
ImageStudioComposer/Workbench. The FE lane will decide where this helper belongs
inside the Kit creator options. This patch does not modify that surface.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
