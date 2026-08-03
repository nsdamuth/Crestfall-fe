# Pose Motion / Staging Section Loom Boundary

## Public Shell

```text
components/studio/my-creations/edit/sections/poses/PoseMotionStagingSection.jsx
```

The public Shell preserves the existing `form` and `updateDataField` API used by
Creation Edit.

## Portable View

```text
PoseMotionStagingSection.view.jsx
```

The View owns only the Pose motion/staging form presentation. It receives
presentation-ready strings and semantic callbacks. It does not inspect the raw
creation form, know JSON storage fields, or save a creation.

## ViewModel

```text
usePoseMotionStagingSectionViewModel.js
```

The ViewModel owns:

- `form.data` access;
- `action_motion` mapping;
- `energy_level` mapping;
- `viewer_relation` mapping;
- `prop_interaction` mapping;
- `scene_fit` mapping;
- `mood_attitude` mapping;
- `staging_notes` mapping;
- mapping semantic changes back to the exact stored field names.

## Contract and Fixtures

The contract version is `1.0.0`. Fixtures are direct View-contract objects and
cover populated, empty, quiet, action, long-content, alternate-copy, and
missing-callback states.

## Preview

```text
/dev/ui-preview/pose-motion-staging-section
```

The preview is blocked in production and updates local fixture state only.
