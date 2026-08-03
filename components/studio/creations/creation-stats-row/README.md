# Creation Stats Row

## Purpose

`CreationStatsRow` displays non-zero creation engagement and media totals for
likes, messages, images, and videos.

The public import path remains:

```text
components/studio/creations/CreationStatsRow.jsx
```

That file is the Binding Shell. It converts the existing raw `stats` prop
through the ViewModel and passes ordered, positive numeric items to the
portable View.

## Current consumers

```text
components/studio/creations/CreationCard.jsx
components/studio/creations/CreationPreviewModal.jsx
components/studio/creations/CreationProfilePage.jsx
```

## Ownership boundary

The View owns:

- stat-row layout and compact sizing;
- icon selection for semantic stat IDs;
- abbreviated number presentation;
- rendering nothing when no visible items are supplied.

The ViewModel owns:

- reading the current raw stats object;
- numeric normalization;
- removing zero, negative, missing, and invalid totals;
- preserving the likes, messages, images, and videos display order.

The feature does not own engagement mutations, media loading, chat activity,
API calls, sorting, or persistence.

## Public API

```jsx
<CreationStatsRow stats={creation.stats} compact />
```

## View contract

```text
CREATION_STATS_ROW_VIEW_CONTRACT_VERSION = "1.0.0"
```

The portable View receives:

```text
items: Array<{ id: "likes" | "messages" | "images" | "videos", value: number }>
compact: boolean
```

It does not receive the raw stats object.

## Development preview

```text
/dev/ui-preview/creation-stats-row
```

The preview renders direct View-contract fixtures and must return `notFound()`
in production.

## Live regression targets

- Creation cards in collection views
- Creation preview modal
- Creation public/profile page
