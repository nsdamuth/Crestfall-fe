# Creation Credits

## Purpose

`CreationCredits` is a portable attribution panel used by the creation preview
modal to display resolved source credits.

The public import path remains:

```text
components/studio/creations/CreationCredits.jsx
```

That file remains the Binding Shell so the current caller does not change. It
injects the Crestfall navigation primitive into the portable View.

## Current consumer

```text
components/studio/creations/CreationPreviewModal.jsx
```

## Ownership boundary

The View owns:

- the Credits heading and panel presentation;
- linked and unlinked creator-handle presentation;
- optional credited-asset titles;
- responsive attribution-row layout;
- accessible creator-profile links through an injected `LinkComponent`.

The View does not own:

- reading the raw creation or preview graph;
- resolving creator attribution;
- deciding which source assets require credit;
- constructing creator-profile routes;
- ownership, visibility, moderation, or publication rules;
- APIs, persistence, or engagement behavior.

No ViewModel is required because `getCreationCredits(creation)` already returns
complete display-ready credit rows before the component is rendered.

## Contract

```text
CREATION_CREDITS_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/creation-credits
```

The preview renders contract-shaped fixtures only and must return `notFound()`
in production.

## Live regression target

```text
Creation preview modal
```

Linked creator handles, plain creator handles, optional asset titles, spacing,
and the surrounding creation-preview layout must remain unchanged.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
