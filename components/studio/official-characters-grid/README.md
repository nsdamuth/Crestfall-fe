# Official Characters Grid

## Purpose

`OfficialCharactersGrid` is the bounded search and catalogue section used by
Crestfall's Official Characters page.

The public import path remains:

```text
components/studio/OfficialCharactersGrid.jsx
```

That file is a small Binding Shell connecting the raw official-character list
to the ViewModel and portable View.

## Current consumer

```text
app/studio/official-characters/page.js
```

## Ownership boundary

The ViewModel owns:

- raw official-character records;
- the current search query;
- which raw fields participate in search;
- case-insensitive search matching;
- result and total counts;
- composition of the validated Studio Character Card View contract.

The portable View owns:

- search-input presentation;
- result-summary presentation;
- responsive card-grid presentation;
- presentation-local incremental pagination;
- direct composition of `StudioCharacterCard.view.jsx`;
- the no-results state.

The View does not own:

- official-character page data loading;
- raw character fields or search-field selection;
- image-path or details-route construction;
- character sessions or the disabled Start placeholder;
- APIs, services, permissions, or persistence.

The ViewModel reuses `getStudioCharacterCardViewProps()` so the grid and the
standalone card share identical card normalization without a portable View
importing the card Binding Shell.

## Contract

```text
OFFICIAL_CHARACTERS_GRID_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/official-characters-grid
```

The preview renders contract-shaped fixtures and local search interactions only.
The route must return `notFound()` in production.

## Live regression target

```text
Studio → Official Characters
```

Search fields, result counts, incremental loading, card details routes, empty
results, and responsive grid behavior must remain unchanged.
