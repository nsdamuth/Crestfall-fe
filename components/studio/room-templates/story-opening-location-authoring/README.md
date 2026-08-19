# Story Opening Location authoring semantics

Status: semantic authoring contract and realistic fixtures only.

This package brings the current Story/Room Template opening-location authoring
model into the FE lane without copying the legacy panel or Story start logic.

## Current authored contract

```text
story_opening_location_v0
```

Modes:

```text
FIXED
PLAYER_SELECT
```

### Fixed

The authored fixed opening Location is resolved from the current
`opening_location` object, with compatibility for older Story fields such as
`location_id`, `locationId`, and `selected_location.id`.

The existing Location / Scene selection remains the authoritative fixed opening
Location.

### Player Select

The creator authors a bounded allowed set of Locations before the Story starts.

The presentation contract carries both:

```text
allowedLocationIds
allowedLocations
```

Stored references are preserved as display fallbacks when the current Location
picker no longer contains a referenced Location.

Duplicate Locations are removed by ID.

A `PLAYER_SELECT` configuration with zero allowed Locations is invalid for
authoring and surfaces:

```text
Add at least one allowed starting Location.
```

## Runtime guarantee

Crestfall remains authoritative for Story start.

At runtime, player-select mode requires the player to choose one of the authored
allowed Location IDs before the Story room is created. Invalid or missing
choices are rejected before the room-creation request.

That validation and network request do **not** move into this FE package.

## Permanent boundary

Crestfall owns:

- Story creation/start orchestration
- allowed-ID enforcement at room creation
- API/client calls
- opening Location hard-state commit
- persistence

Crestfall-fe owns:

- mode presentation
- allowed Location chips/list
- picker presentation
- authoring validation copy
- local add/remove interaction contract

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
