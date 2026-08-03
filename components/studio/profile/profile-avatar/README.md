# Profile Avatar

## Purpose

`ProfileAvatar` is a shared portable identity primitive used wherever Crestfall
needs to display a creator avatar or a fallback initial.

The public import path remains:

```text
components/studio/profile/ProfileAvatar.jsx
```

That file re-exports the portable View so existing callers do not change.

## Current consumers

```text
components/studio/profile/PublicProfileHero.jsx
components/studio/profile/ProfileMediaManager.jsx
app/studio/profile/[username]/connections/page.js
```

## Ownership boundary

The View owns:

- circular avatar presentation;
- small, medium, and large visual sizes;
- rendering a supplied avatar image;
- accessible image alternative text;
- fallback-initial presentation when no image is supplied.

The View does not own:

- profile loading or identity resolution;
- avatar upload or deletion;
- media storage or persistence;
- profile editing;
- permissions or moderation;
- API calls or navigation.

No ViewModel is required because the component receives a complete visual
contract and owns only presentation calculations.

## Contract

```text
PROFILE_AVATAR_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/profile-avatar
```

The preview renders contract-shaped fixtures only. Its sample image is an
inline fixture asset, and the route must return `notFound()` in production.

## Live regression targets

```text
Public creator profile hero
Profile connections page
Profile media manager
```

Avatar images, fallback initials, accessible labels, and all three supported
sizes must remain unchanged.
