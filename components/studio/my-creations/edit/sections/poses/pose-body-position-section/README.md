# Pose Body Position Section Loom Boundary

## Public Shell

```text
components/studio/my-creations/edit/sections/poses/PoseBodyPositionSection.jsx
```

The public Shell preserves the existing `form` and `updateDataField` API used by
Creation Edit.

## Portable View

```text
PoseBodyPositionSection.view.jsx
```

The View owns only the Pose body-position form presentation. It receives
presentation-ready strings and semantic callbacks. It does not inspect the raw
creation form, know JSON storage fields, or save a creation.

## ViewModel

```text
usePoseBodyPositionSectionViewModel.js
```

The ViewModel owns:

- `form.data` access;
- `posture` mapping;
- `body_orientation` mapping;
- `arm_hand_position` mapping;
- `leg_foot_position` mapping;
- `facial_expression` mapping;
- `balance_weight` mapping;
- `body_position_notes` mapping;
- mapping semantic changes back to the exact stored field names.

## Contract and Fixtures

The contract version is `1.0.0`. Fixtures are direct View-contract objects and
cover populated, empty, upper-body, dynamic, long-content, alternate-copy, and
missing-callback states.

## Preview

```text
/dev/ui-preview/pose-body-position-section
```

The preview is blocked in production and updates local fixture state only.
