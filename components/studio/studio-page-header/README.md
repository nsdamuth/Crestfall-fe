# StudioPageHeader Loom Boundary

`StudioPageHeader` is a shared portable Studio presentation primitive.

## Public entry point

```text
components/studio/StudioPageHeader.jsx
```

The public file preserves existing imports and re-exports the portable View.

## Portable View

```text
components/studio/studio-page-header/StudioPageHeader.view.jsx
```

The View owns the header hierarchy, typography, spacing, responsive layout, and optional action placement.

It does not own routes, page actions, data loading, API calls, permissions, lifecycle behavior, or persistence.

## Contract

```text
STUDIO_PAGE_HEADER_VIEW_CONTRACT_VERSION = "1.3.0"
```

Inputs are display-ready `eyebrow`, `title`, `description`, optional `children`, and, since 1.3.0 (12 Sep 2026, eight-fix package FIX 4), optional `breadcrumbs`: the shared `KitBreadcrumbs` row rendered between the description line and the divider on every page deeper than a primary sidebar page.

## Preview

```text
/dev/ui-preview/studio-page-header
```

The preview renders representative visual states only and is blocked in production.
