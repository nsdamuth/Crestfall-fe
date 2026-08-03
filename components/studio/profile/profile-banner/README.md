# Profile Banner

## Purpose

`ProfileBanner` is a shared portable media primitive used to display a creator
profile banner or Crestfall's existing empty banner-slot state.

The public import path remains:

```text
components/studio/profile/ProfileBanner.jsx
```

That file re-exports the portable View so existing callers do not change.

## Current consumer

```text
components/studio/profile/ProfileMediaManager.jsx
```

## Ownership boundary

The View owns:

- compact and regular banner heights;
- rendering a supplied landscape image;
- accessible image alternative text;
- the existing empty banner-slot presentation;
- border, gradient, and responsive presentation.

The View does not own:

- profile loading;
- banner generation, upload, selection, or deletion;
- media-library access;
- profile persistence;
- permissions or moderation;
- API calls or profile editing.

No ViewModel is required because the component receives a complete visual
contract and owns only presentation.

## Contract

```text
PROFILE_BANNER_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/profile-banner
```

The preview renders contract-shaped fixtures only. Its sample banner is an
inline fixture asset, and the route must return `notFound()` in production.

## Live regression target

```text
Profile media manager
```

The compact placeholder, supplied-image presentation, accessible title, and
surrounding profile-media layout must remain unchanged.
