# Creation Status Badges

## Purpose

`CreationStatusBadges` displays a compact set of creation type, visibility,
lifecycle, canon, and content-rating badges.

The public import path remains:

```text
components/studio/creations/CreationStatusBadges.jsx
```

That file is the Binding Shell. It converts the existing raw `creation` prop
through the ViewModel and passes only display-ready badge items to the portable
View.

## Current consumers

```text
components/studio/creations/CreationCard.jsx
components/studio/creations/CreationPreviewModal.jsx
components/studio/creations/CreationProfilePage.jsx
```

## Ownership boundary

The View owns:

- badge layout and compact sizing;
- uppercase label presentation;
- underscore-to-space label formatting;
- visual tone mapping for supplied badge values.

The ViewModel owns:

- reading the current creation shape;
- selecting the type label fallback;
- deciding whether an approved status is redundant for public/canon content;
- translating accepted canon state into the visible `CANON` badge;
- ordering the supplied badge items.

The feature does not own creation lifecycle rules, publication changes,
moderation actions, API calls, routing, or persistence.

## Public API

```jsx
<CreationStatusBadges creation={creation} compact />
```

## View contract

```text
CREATION_STATUS_BADGES_VIEW_CONTRACT_VERSION = "1.0.0"
```

The portable View receives:

```text
badges: Array<{ id, value }>
compact: boolean
```

It does not receive the raw creation record.

## Development preview

```text
/dev/ui-preview/creation-status-badges
```

The preview renders direct View-contract fixtures and must return `notFound()`
in production.

## Live regression targets

- Creation cards in collection views
- Creation preview modal
- Creation public/profile page
