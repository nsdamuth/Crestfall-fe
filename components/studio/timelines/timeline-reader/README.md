# Timeline Reader

## LOOM boundary

```text
TimelineReaderShell.jsx                    Binding Shell
        ↓
useTimelineReaderViewModel.js              ViewModel / Chassis
        ↓
TimelineReader.view.jsx                    Portable View / Skin
```

The portable View owns only Timeline reading presentation: title/description,
public/internal display state, era sections, the central chronology spine,
Lore cards, responsive stacking, and semantic Back/Edit callback invocation.

The ViewModel owns the authenticated owner read through `timelineClient`,
projection normalization, era grouping, loading/error state, and application
navigation.

The View never calls APIs, interprets persistence fields, or decides which Lore
is authorized for a reader. TL1B remains the owner/public Timeline read
authority.

## Saved Timeline editing

`/studio/v2/editor/[id]` dispatches `TIMELINE` creations to the existing
Timeline Builder/Editor rather than allowing the generic V2 editor to fall back
to Character sections.

## Routes

Owner reader:

```text
/studio/v2/lore/timelines/<timeline-id>
```

Owner edit:

```text
/studio/v2/editor/<timeline-id>?origin=timeline
```

The same portable View can later host the public Timeline projection with
`showEditAction=false`.
