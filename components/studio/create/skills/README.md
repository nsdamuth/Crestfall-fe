# Skills Profile semantic package

Status: semantic contract and filled fixtures only.

This package is the second bounded Crestfall to Crestfall-fe functional
absorption slice for `SKILLS_PROFILE`.

It intentionally does not add a production View, page entrypoint, application
ViewModel, API call, persistence path, JSON-editor presentation, or
editor-family integration.

## Authority

Crestfall remains authoritative for:

- creation routing and persistence
- application ViewModels and Binding Shells
- authoritative validation at save and commit boundaries
- actor-owned live skill ranks and spent progression state
- mechanics execution and prerequisite evaluation

Crestfall-fe owns the eventual portable presentation contract, presentation
ViewModel, fixtures, and ruled V2 visual treatment.

## Included in this slice

- current Skills Profile semantic contract
- builder identity/options contract
- empty fixture
- filled value-carrying fixture
- filled builder wrapper fixture
- semantic diagnostic

The filled fixture covers:

- multiple skill categories
- starting and maximum ranks
- one definition per rank
- point costs
- level and tier prerequisites
- cross-skill prerequisites
- typed unlock prerequisites
- rank grants
- command grants
- tags and metadata

Mutable actor runtime state is intentionally absent from profile definitions.

## Deliberately not included yet

- `SkillsProfileEditor.view.jsx`
- builder View
- presentation ViewModel
- JSON editor presentation
- `/app/studio/v2/**` changes
- `components/studio/my-creations/edit/**` changes
- Kit or design-system changes

Those remain a later frontend-lane presentation wave after the accepted visual
integration base is named.
