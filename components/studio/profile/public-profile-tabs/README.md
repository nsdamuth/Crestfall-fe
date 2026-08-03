# Public Profile Tabs

## Portable LOOM boundary

`PublicProfileTabs.jsx` is the thin Binding Shell. It owns the three application profile surfaces and injects the selected surface through a semantic `contentSlot`:

- `PublicProfileCreationGrid`
- `PublicProfileActivityFeed`
- `PublicProfileBadges`

`PublicProfileTabs.view.jsx` renders only the profile-section heading, display-ready tab controls, and the selected content slot. It does not import profile features, engagement hooks, routing, clients, or persistence behavior.

`usePublicProfileTabsViewModel.js` owns the active tab, legal tab normalization, heading resolution, and tab projection.

## Preview

Development-only preview:

`/dev/ui-preview/public-profile-tabs`

The primary preview is interactive and also shows the Activity and Badges fixture states. The route is blocked in production.

## Diagnostics

Run:

`npm run diagnostics:loom:public-profile-tabs`
