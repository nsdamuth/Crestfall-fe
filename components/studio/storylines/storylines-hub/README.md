# Storylines Hub LOOM package

## Boundary

`StorylinesHub.jsx` is the thin application Binding Shell. It owns the Next.js
`Link` dependency and injects it into the portable View.

`useStorylinesHubViewModel.js` is the Chassis. It owns the existing
`fetchOwnedStorylines` client call, loading/error orchestration, raw Storyline
normalization, `data.nodes` / legacy `data.ordered_nodes` interpretation,
creation-edit route construction, and node-count labels.

`StorylinesHub.view.jsx` is the Portable Skin. It renders only display-ready
copy, state flags, and normalized cards. It does not import the Storyline client,
Next.js navigation, application shells, or creation data contracts.

## Preserved behavior

- Loads the current creator's Storylines through the existing client boundary.
- Preserves loading, error, empty, and populated states.
- Preserves the Create Storyline route.
- Preserves edit links for each Storyline.
- Preserves title and description fallbacks.
- Preserves current `data.nodes` counting and legacy `data.ordered_nodes`
  compatibility.
- Preserves singular/plural node labels.

## Preview

Development only:

`/dev/ui-preview/storylines-hub`

## Deferred work

Mechanics Module field decomposition remains deferred until the final cumulative
LOOM reassessment.
