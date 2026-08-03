# Creator Engagement Actions

## Purpose

`CreatorEngagementActions` displays the creator Like, Save, and Follow controls
used by creator cards, creator list rows, and public profile pages.

The public import path remains:

```text
components/studio/community/CreatorEngagementActions.jsx
```

That file is the Binding Shell. It preserves the existing raw `creator` and
callback API, while the ViewModel converts those callbacks into no-argument
semantic actions for the portable View.

## Current consumers

```text
components/studio/community/CreatorCard.jsx
components/studio/community/CreatorListRow.jsx
components/studio/profile/PublicProfileEngagementActions.jsx
```

## Ownership boundary

The View owns:

- Like, Save, and Follow button presentation;
- active and inactive visual states;
- compact sizing and responsive label visibility;
- accessible action labels;
- preventing action clicks from activating a surrounding card or link;
- safe semantic callback invocation.

The ViewModel owns:

- retaining the original creator record outside the View;
- determining which actions are available from supplied handlers;
- mapping no-argument View intent back to callbacks that receive the original
  creator record;
- normalizing engagement and compact-state booleans.

The feature does not own authentication, profile reaction requests, optimistic
state, error messages, router refreshes, counts, or persistence.

## Public API

```jsx
<CreatorEngagementActions
  creator={creator}
  liked={liked}
  bookmarked={bookmarked}
  followed={followed}
  onToggleLike={toggleProfileLike}
  onToggleBookmark={toggleProfileBookmark}
  onToggleFollow={toggleProfileFollow}
  compact={false}
/>
```

## View contract

```text
CREATOR_ENGAGEMENT_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0"
```

The portable View receives only engagement display state, action availability,
compact presentation state, and semantic no-argument callbacks. It does not
receive the raw creator object.

## Development preview

```text
/dev/ui-preview/creator-engagement-actions
```

The preview renders direct View-contract fixtures and must return `notFound()`
in production. Preview interactions update local state only.

## Live regression targets

- Community creator cards
- Community creator list rows
- Public creator profile engagement controls
