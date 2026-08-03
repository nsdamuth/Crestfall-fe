# Creation Tag Filter Row

## Purpose

`CreationTagFilterRow` is a shared portable UI primitive for rendering a label
and a wrapping row of selectable creation-tag pills.

The public import path remains:

```text
components/studio/creations/CreationTagFilterRow.jsx
```

That file re-exports the portable View so existing consumers do not change.

## Current consumers

```text
components/studio/community/CommunityHub.jsx
components/studio/my-creations/MyCreationsHub.jsx
```

## Ownership boundary

The View owns:

- the label and pill markup;
- active and inactive visual states;
- responsive wrapping;
- case-insensitive active-value comparison;
- safe semantic `onTagChange(tagValue)` intent.

The View does not own:

- creation filtering;
- community or owner visibility rules;
- URL or route state;
- API calls;
- persistence;
- creation lifecycle behavior.

No ViewModel is required because the component has no application state or
application-data transformation. The supplied tags and selected value are
already the complete portable View contract.

## Contract

```text
CREATION_TAG_FILTER_ROW_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/creation-tag-filter-row
```

The preview uses contract-shaped fixtures and local active-tag state only. It
must return `notFound()` in production.

## Live regression targets

- Community Hub tag filtering
- My Creations tag filtering

The row intentionally renders nothing when `tags` is empty.
