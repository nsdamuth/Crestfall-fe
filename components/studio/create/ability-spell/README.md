# Ability and Spell Profile semantic package

Status: semantic contract and filled fixtures only.

This package is the first bounded Crestfall to Crestfall-fe functional
absorption slice for `ABILITY_SPELL_PROFILE`.

It intentionally does not add a production View, page entrypoint, application
ViewModel, API call, persistence path, or editor-family integration.

The current frontend design review keeps presentation work blocked until the
frontend lane names the accepted visual integration base. This package gives
that lane the current functional data shape before the View is built.

## Authority

Crestfall remains authoritative for:

- creation routing and persistence
- application ViewModels and Binding Shells
- product validation at save and commit boundaries
- Ability and Spell runtime behavior
- typed operation execution
- actor-owned cooldown, charge, and mastery state

Crestfall-fe owns the eventual portable presentation contract and fixtures.

## Included in this slice

- current definition and profile semantic contract
- current builder identity options
- empty fixture
- filled value-carrying fixture
- filled builder wrapper fixture
- diagnostic coverage for typed operations and definition-only state

The filled fixture covers prerequisites, skill requirements, pool costs,
single-target line-of-sight targeting, typed executable operation references,
source-actor and authorized-target bindings, cooldowns, fixed charges, mastery
policies, passive definitions, tags, and metadata.

Mutable actor runtime state is intentionally absent from profile definitions.

## Deliberately not included yet

- `AbilitySpellProfileEditor.view.jsx`
- builder View
- presentation ViewModel
- JSON editor presentation
- `/app/studio/v2/**` changes
- `components/studio/my-creations/edit/**` changes
- Kit or design-system changes

Those remain a later frontend-lane presentation wave.
