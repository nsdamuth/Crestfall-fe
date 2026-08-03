# PublicProfileActivityFeed Loom feature

## Public Shell

```text
components/studio/profile/PublicProfileActivityFeed.jsx
```

The Shell preserves the existing public API:

```jsx
<PublicProfileActivityFeed
  profile={profile}
  creations={creations}
  donationEvents={donationEvents}
/>
```

## Ownership

### ViewModel

`usePublicProfileActivityFeedViewModel.js` owns:

- public username fallback;
- creation-event construction;
- release-versus-update classification;
- creation image and description fallbacks;
- creation type-label normalization;
- donation-event normalization;
- chronological merging and sorting;
- relative-time formatting;
- creation detail-route construction.

### Portable View

`PublicProfileActivityFeed.view.jsx` owns:

- empty-state presentation;
- creation and donation activity-row presentation;
- image and fallback-icon presentation;
- linked creation cards;
- responsive wrapping and text clamping.

The View receives display-ready events and does not inspect raw profile,
creation, donation, database, or service-response shapes.

## Preview

```text
/dev/ui-preview/public-profile-activity-feed
```

The preview is development-only and renders contract-shaped fixtures. It does
not load a public profile, call an API, resolve donation history, or persist
anything.

## Live validation

Validate through a public creator profile's Activity tab. Confirm creation
release/update rows, donation rows, chronological order, linked creation cards,
empty state, relative timestamps, and narrow-screen wrapping.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
