# Timeline Builder LOOM boundary

```text
TimelineBuilderShell.jsx                 Binding Shell
        ↓
useTimelineBuilderViewModel.js           ViewModel / Chassis
        ↓
TimelineBuilder.view.jsx                 Portable View / Skin
```

The View owns only Timeline authoring presentation. It does not fetch creations,
call APIs, interpret persistence records, or navigate.

The ViewModel owns Timeline draft state, Lore loading, Timeline loading, automatic
chronology ordering, manual order overrides, create/update mutation, save state,
and navigation semantics.

The Binding Shell owns composition of the existing Creation Picker portable View.
The Timeline View receives that picker as an application-owned slot and does not
import or fetch Crestfall creation data directly.

Timeline membership stores Lore creation ids only. Lore title, prose, dates,
images, and publication authority remain owned by the Lore assets.
