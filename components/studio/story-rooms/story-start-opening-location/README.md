# Story Start Opening Location presentation

Status: pure FE presentation contract and realistic fixtures only.

This package migrates the **play-time** Story opening-location picker semantics
into the FE lane.

It complements the already accepted authoring package:

```text
story_opening_location_v0
```

## Runtime Chassis authority

Crestfall remains authoritative for:

```text
getStoryOpeningLocationStartConfig()
startStoryFromCreation()
```

The Chassis resolves whether player selection is required and supplies the
allowed, display-ready Location options.

The FE does not parse the Story creation to determine those rules.

## Fixed mode

For ordinary fixed-location Stories:

```text
selectionRequired: false
```

the picker is suppressed even if a caller accidentally requests it open.

The Story starts through the normal Chassis path.

## Player-select mode

When the Chassis supplies:

```text
selectionRequired: true
```

the picker may be shown.

Current copy is preserved:

```text
Choose Starting Location

This Story lets the player choose where the opening hard state begins.
Only the creator-authored Locations below are valid.
```

The current action labels remain:

```text
Cancel
Start Here
Starting...
```

## Selection state

The presentation contract receives display-ready options:

```text
id
title
subtitle
imageUrl
```

Only an option present in the supplied option list is rendered as selected.

That is a presentation guard only.

The Chassis remains authoritative for validating the selected ID against the
creator-authored allowed ID set before Story creation.

Current Chassis errors such as:

```text
Choose an allowed starting Location before starting this Story.
The selected starting Location is not allowed by this Story.
```

are passed through as `errorMessage`.

## Pending state

While the Chassis is starting the Story:

- option cards are disabled;
- Cancel is disabled;
- confirmation is disabled;
- `Start Here` becomes `Starting...`.

## Corrupt / unusable authored data

If a Story requires player selection but the Chassis supplies zero valid
options, the FE degrades safely instead of presenting an empty unexplained
control:

```text
No starting Locations available
```

This is presentation recovery only. It does not invent or repair an allowed
Location.

## Permanent boundary

Crestfall owns:

- Story creation parsing
- opening-location mode authority
- allowed Location ID resolution
- stored-reference fallback resolution
- selected ID validation
- `STORY_OPENING_LOCATION_SELECTION_REQUIRED`
- `STORY_OPENING_LOCATION_NOT_ALLOWED`
- room creation
- opening Location hard-state commit
- navigation after successful room creation

Crestfall-fe owns:

- picker visual composition
- option-card selection presentation
- pending/error/empty states
- select/cancel/confirm callbacks

## Existing source View

The source snapshot currently has:

```text
StoryStartOpeningLocationPicker.view.jsx
```

directly imported by Chassis Creation Profile and Preview surfaces.

This patch does not copy that JSX. It captures the presentation contract so the
FE lane can rebuild the picker in its ruled visual vocabulary and the Chassis
Binding Shell can supply the runtime state.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
