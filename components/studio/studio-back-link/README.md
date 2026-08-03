# StudioBackLink Loom Boundary

`StudioBackLink` is a shared portable Studio navigation primitive.

## Public entry point

```text
components/studio/StudioBackLink.jsx
```

The public file preserves existing imports and acts as the Binding Shell. It
injects the Crestfall navigation primitive into the portable View.

## Portable View

```text
components/studio/studio-back-link/StudioBackLink.view.jsx
```

The View owns the Arrow Left icon, link presentation, responsive label wrapping, hover state, and supplied host classes.

It does not decide destinations, inspect browser history, call the router imperatively, load data, call APIs, or persist application state.

## Contract

```text
STUDIO_BACK_LINK_VIEW_CONTRACT_VERSION = "1.0.0"
```

Inputs are display-ready `href`, `label`, and optional `className` values.

## Preview

```text
/dev/ui-preview/studio-back-link
```

The preview uses local hash destinations and is blocked in production.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
