# Room Registry Attachments ↔ Live Hydration binding

Status: **FUNCTIONALLY WIRED**.

This package originally captured the current Story Registry-attachment
live-hydration semantics without changing the live FE application ViewModel.

W6 closes that functional gap.

The FE deployment mirror now matches the authoritative current `Crestfall`
application ViewModel for this path.

## Live behavior now wired

For attached Registry Creation IDs, the application ViewModel:

1. collects and deduplicates the attached Creation IDs;
2. loads the current owned Registry Creations;
3. settles those fetches independently with `Promise.allSettled`;
4. keeps fulfilled live Creations in a Creation-ID map;
5. overlays live Registry title, type, description, and image onto the existing
   attachment display model;
6. preserves Story-local attachment notes;
7. preserves the stored attachment snapshot when a live Creation does not
   resolve;
8. updates the live map immediately when the user attaches a newly selected
   Registry.

The existing portable `RoomRegistryAttachmentsSection.view.jsx` already consumes
display-ready:

```text
title
typeLabel
description
imageUrl
notes
```

so no View rewrite is required.

## Seven Registry groups remain unchanged

- Event Registry
- Quest Registry
- NPC Registry
- Item Registry
- Location Registry
- Faction Registry
- Organization Registry

## Legacy ID-only attachments

Legacy data containing only:

```text
boundRegistries.<type>RegistryIds
```

continues to synthesize a stable fallback attachment and can still receive live
display metadata once its Creation resolves.

## Remaining optional visual enhancement

The functional hydration path is wired.

The current View still does not visually label whether a card is displaying:

```text
LIVE_CREATION
```

or:

```text
STORED_REFERENCE
```

Those optional source/fallback indicators remain:

```text
WIRED
```

They are not required for the functional behavior.

## Permanent authority boundary

`Crestfall` owns:

- application ViewModel behavior;
- attached Creation-ID collection;
- live Registry fetch semantics;
- parallel request settlement;
- attach/remove/note mutation;
- Story persistence.

The corresponding file under `Crestfall-fe` is a deployment mirror used by the
independently deployed Skin application. It does not establish FE business/data
authority.

`Crestfall-fe` owns:

- attachment-card presentation;
- display-ready hydrated values;
- optional future live/fallback source indicator.

Protected scopes remain untouched.

## W23 hydration provenance presentation

The live Room Registry Attachments Binding Shell now consumes this binding as
the actual display projection.

The Chassis application ViewModel exposes the raw hydration input it already
owns:

```text
boundRegistries
boundRegistryLinks
liveRegistryCreationsById
```

and the FE binding converts that into display-only provenance:

```text
Live Registry
Stored Snapshot
```

A `Stored Snapshot` card additionally displays the authoritative fallback reason
so creators can tell that the linked Registry Creation could not be hydrated.

No fallback state is inferred from title/image text in the View.

`RoomRegistryAttachmentsSection` advances:

```text
1.0.0 -> 1.1.0
```

The Chassis and FE application ViewModels remain exact deployment mirrors.
