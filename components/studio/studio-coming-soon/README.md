# Studio Coming Soon

## Purpose

`StudioComingSoon` is a portable placeholder section for bounded Studio areas
whose product workflows are intentionally not connected yet.

The public import path remains:

```text
components/studio/StudioComingSoon.jsx
```

That file re-exports the portable View so existing callers do not change.

## Current consumers

```text
app/studio/storylines/page.js
app/studio/submit-canon/page.js
```

## Ownership boundary

The View owns:

- eyebrow, title, supporting-copy, and roadmap-item presentation;
- optional body and optional item-grid rendering;
- responsive item wrapping and existing placeholder styling;
- defensive handling of a non-array `items` value.

The View does not own:

- which future features are planned;
- roadmap wording or availability decisions;
- page headers or route composition;
- feature activation;
- API calls, service behavior, or persistence;
- Storyline or canon-submission workflows.

No ViewModel is required because the component receives a complete visual
contract and owns no application state or application-data transformation.

## Contract

```text
STUDIO_COMING_SOON_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/studio-coming-soon
```

The preview renders contract-shaped fixtures only. The route must return
`notFound()` in production.

## Live regression targets

```text
Studio → Storylines
Studio → Submit to Canon
```

Both pages must retain their current placeholder content and remain disconnected
from backend behavior.
