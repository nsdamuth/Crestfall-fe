# Studio Action Card

## Purpose

`StudioActionCard` is a portable Studio navigation/action card used for a
single bounded destination or unavailable future action.

The public import path remains:

```text
components/studio/StudioActionCard.jsx
```

That file remains the Binding Shell so existing callers do not change. It
injects the Crestfall navigation primitive into the portable View.

## Current consumer

```text
app/studio/play/page.js
```

The Play Canon page currently renders three disabled cards.

## Ownership boundary

The View owns:

- card, eyebrow, title, supporting-copy, and action-label presentation;
- enabled-link versus non-link rendering;
- the existing disabled `Coming Soon` label;
- responsive wrapping and hover styling.

The View does not own:

- destination selection;
- feature availability;
- permissions or authentication;
- page composition;
- API calls or persistence;
- starting a Canon session or Chronicle workflow.

No ViewModel is required because the component receives a complete visual
contract and owns no application state or application-data transformation.

## Contract

```text
STUDIO_ACTION_CARD_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/studio-action-card
```

The preview renders contract-shaped fixtures. Enabled fixture destinations use
preview hashes only. The route must return `notFound()` in production.

## Live regression target

```text
Studio → Play Canon
```

The three current cards must remain disabled and continue to display `Coming
Soon` without starting a session or navigating.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
