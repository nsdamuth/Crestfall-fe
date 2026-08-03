# Games Hub LOOM package

`GamesHub.jsx` is the thin Binding Shell. It injects Crestfall's existing
`ViewModeToggle` application control.

`useGamesHubViewModel.js` is the Chassis. It owns game loading, raw response
normalization, filtering, persistent view mode, continue-room resolution and Story Template play orchestration, errors, and post-start navigation.

`GamesHub.view.jsx` is the Portable Skin. It renders display-ready game cards,
list rows, mobile controls, featured starts, canon guidance, and empty/loading
states without importing application clients or Next.js navigation.

## Preserved behavior

- All, Continue, Official, Canon-Compatible, Community, and Featured filters.
- Search across game, scenario, narrator, badge, rating, canon, and cast data.
- Persistent grid/list presentation.
- Active Chronicle and Featured Starts sections.
- Existing continue-room navigation and Story Template start flow.
- Existing loading, load-error, play-error, and empty states.
- Existing mobile browse drawer and desktop canon legend.

## Preview

Development-only route: `/dev/ui-preview/games-hub`.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
