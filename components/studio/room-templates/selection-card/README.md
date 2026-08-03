# Room Template Selection Card

## Purpose

`SelectionCard` is the portable create-flow card used to open the Scenario,
Narrator, and Location pickers while building a Story.

The public import path remains:

```text
components/studio/room-templates/SelectionCard.jsx
```

That file re-exports the portable View so the current caller does not change.

## Current consumer

```text
components/studio/create/room-template/RoomTemplateBuilderShell.jsx
```

A separate same-named component remains at:

```text
components/studio/create/room-template/SelectionCard.jsx
```

That edit-flow component is intentionally not merged, deleted, or modified by
this conversion.

## Ownership boundary

The View owns:

- card and hover presentation;
- the supplied icon;
- label, selected title, and optional subtitle presentation;
- placeholder presentation when no value is selected;
- safe invocation of the semantic picker-open action.

The View does not own:

- which picker is open;
- Scenario, Narrator, or Location loading;
- creation-reference records beyond the display-ready title and subtitle;
- scenario recommendation application;
- selection persistence or Story package updates;
- API calls, permissions, or creation lifecycle behavior.

No ViewModel is required because the caller already supplies a complete visual
contract and owns all application state.

## Contract

```text
SELECTION_CARD_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/selection-card
```

The preview renders contract-shaped fixtures and local click feedback only. It
must return `notFound()` in production.

## Live regression target

```text
Create Story → Characters, Scenario, Narrator
```

Scenario, Narrator, and Location cards must continue opening their existing
pickers and showing the selected title and subtitle.
