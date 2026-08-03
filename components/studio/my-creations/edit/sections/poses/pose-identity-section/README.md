# Pose Identity Section Loom Boundary

## Public Shell

```text
components/studio/my-creations/edit/sections/poses/PoseIdentitySection.jsx
```

The public Shell preserves the existing `form` and `updateDataField` API used by
Creation Edit.

## Portable View

```text
PoseIdentitySection.view.jsx
```

The View owns only the Pose identity form presentation. It receives
presentation-ready strings and semantic callbacks. It does not inspect the raw
creation form, know JSON storage fields, resolve legacy values, parse tags, or
save a creation.

## ViewModel

```text
usePoseIdentitySectionViewModel.js
```

The ViewModel owns:

- `form.data` access;
- the existing Pose-name `data.name ?? form.title` behavior;
- current `category` and legacy `pose_type` compatibility;
- `intended_use` mapping;
- comma-separated tag formatting and parsing;
- mapping semantic changes back to exact stored field names.

## Contract and Fixtures

The contract version is `1.0.0`. Fixtures are direct View-contract objects and
cover populated, empty, title-fallback, legacy-category, long-content,
alternate-copy, and missing-callback states.

## Preview

```text
/dev/ui-preview/pose-identity-section
```

The preview is blocked in production and updates local fixture state only.
