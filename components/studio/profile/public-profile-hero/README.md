# Public Profile Hero

## Portable LOOM boundary

`PublicProfileHero.jsx` is the thin Binding Shell. It owns the Next.js profile-connection links and injects the application-owned avatar, engagement, donation, and sharing controls as semantic slots.

`PublicProfileHero.view.jsx` renders only normalized creator copy, media URLs, statistics, and those semantic slots. It does not import Next.js routing, profile clients, engagement hooks, account state, or persistence behavior.

`usePublicProfileHeroViewModel.js` owns:

- username and display-name fallback behavior;
- avatar and banner field aliases;
- the existing default banner;
- tuple and object stat normalization;
- follower/following count fallbacks;
- encoded connection-route construction;
- the public bio fallback.

The public profile page remains responsible for loading the profile, statistics, and follow state.

## Preview

Development-only preview:

`/dev/ui-preview/public-profile-hero`

The route renders complete, alternate-creator, and fallback fixture states. It is blocked in production.

## Diagnostics

Run:

`npm run diagnostics:loom:public-profile-hero`
