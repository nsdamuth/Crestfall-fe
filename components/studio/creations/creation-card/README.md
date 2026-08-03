# Creation Card

## Public Shell

```text
components/studio/creations/CreationCard.jsx
```

The Shell preserves the existing public props:

```text
creation
context
mobileCompact
priority
liked
bookmarked
onToggleLike
onToggleBookmark
```

It remains the public import used by Community, My Creations, and public creator
profile grids.

The Shell is also the application binding point for the existing
`CreationPreviewModal`. The portable card View does not import or operate that
application-owned modal.

## ViewModel / Chassis

```text
creation-card/useCreationCardViewModel.js
```

The ViewModel owns:

- raw creation normalization;
- owner, community, and public context interpretation;
- edit, image-studio, catalogue, and chat destinations;
- creator attribution normalization;
- preview loading, fallback, error, and open state;
- Story Room creation and navigation;
- default Player Character persistence;
- parent engagement callback adaptation;
- display-ready child ViewModel props for status badges and stats;
- preview-modal application props.

Community preview failures remain visible on the card. Owner and other
non-community contexts retain the prior fallback to the local creation object
for private or draft creations.

## Portable View / Skin

```text
creation-card/CreationCard.view.jsx
```

The View owns:

- the existing card markup and responsive classes;
- image and fallback-initial presentation;
- action icons and busy presentation;
- creator attribution presentation;
- description truncation and compact-mobile visibility;
- status and error overlays;
- semantic callback invocation;
- composition of the portable `CreationStatusBadgesView` and
  `CreationStatsRowView` children.

The View does not receive a raw creation record, call APIs, create Story Rooms,
set profile defaults, interpret lifecycle policy, load preview graphs, or import
the application `CreationPreviewModal` Shell.

## Client Boundary

The existing creation client now exposes:

```text
fetchCreationPreview(creationId)
```

It owns the same-origin request to:

```text
/api/creations/[creationId]/preview
```

The existing Story Room and default Player Character clients remain unchanged.
The prior card called `setDefaultPlayerCharacter` without importing its existing
client; the LOOM ViewModel now binds that already-established client explicitly
so the visible card action can execute.

## Contract and Fixtures

```text
CreationCard.contract.js
CreationCard.fixtures.js
```

Contract version:

```text
CREATION_CARD_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures cover owner, community, Player Character, compact fallback, busy, and
error presentation.

## Isolated Preview

```text
/dev/ui-preview/creation-card
```

The preview renders the portable card View directly. All interactions update
preview-local text only; no preview request, reaction, profile mutation, or
Story Room creation is performed.

## Diagnostics

```bash
npm run diagnostics:loom:creation-card
```

The diagnostic checks the thin Shell, portable View, ViewModel ownership,
client boundary, pure nested View composition, fixtures, production preview
guard, and a live public caller.

## Live Validation

Validate all existing card contexts:

1. Open a card preview from My Creations.
2. Open a public card preview from Community.
3. Like and bookmark a card where those actions are supplied.
4. Start a Story from a chat-capable Character or Room Template.
5. Set an owner Player Character as the default.
6. Open Image Studio from the image action.
7. Open Edit from an owner card.
8. Confirm mobile compact cards retain their current action visibility and text
   suppression.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
