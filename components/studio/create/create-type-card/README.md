# CreateTypeCard Loom Boundary

## Public entry point

```text
components/studio/create/CreateTypeCard.jsx
```

The public file preserves the existing import path and acts as the Binding Shell.
It injects the Crestfall navigation primitive into the portable View.

## Portable View

```text
components/studio/create/create-type-card/CreateTypeCard.view.jsx
```

The View owns only:

- the creation-type card layout;
- optional eyebrow and background image presentation;
- enabled and disabled styling;
- the supplied creation destination through an injected `LinkComponent`;
- the existing `Begin Creation →` and `Coming Soon` labels.

The View does not own:

- which creation types exist;
- section grouping or ordering;
- route selection;
- permissions or feature availability;
- builder startup;
- API calls or persistence.

No ViewModel is required because the component already receives a complete,
presentation-ready contract and owns no application state or transformation.

## Contract and fixtures

```text
CreateTypeCard.contract.js
CreateTypeCard.fixtures.js
```

The contract version is `1.0.0`. Fixtures cover an image-backed card, a registry
card, disabled behavior, no image, no eyebrow, and long responsive content.

## Development preview

```text
/dev/ui-preview/create-type-card
```

The route returns `notFound()` in production. Enabled fixtures use preview hash
destinations and do not open a real Crestfall builder.

## Live integration

The current caller remains:

```text
app/studio/create/page.js
```

That page continues to own creation sections and the data sources used to render
each card.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
