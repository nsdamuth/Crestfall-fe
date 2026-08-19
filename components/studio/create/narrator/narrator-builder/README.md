# Narrator Builder LOOM Surface

## Public binding

```text
components/studio/create/narrator/NarratorBuilderShell.jsx
```

The public Shell preserves the existing import path used by the Create Narrator
page. It binds the Narrator Builder ViewModel to the portable View.

## LOOM boundary

```text
NarratorBuilderShell.jsx
  → useNarratorBuilderViewModel.js
  → NarratorBuilder.view.jsx
```

In the independently deployed `Crestfall-fe` application,
`useNarratorBuilderViewModel.js` is a deployment mirror of the authoritative
`Crestfall` application ViewModel. Application state, payload semantics, save
orchestration, and routing remain Chassis authority.

The application ViewModel owns:

- authoring state;
- narrator creation-payload construction;
- Story Presentation module persistence;
- Narrator Module Selector View props;
- save status and error handling;
- client-layer creation calls;
- redirecting to Creation Edit after successful creation.

The portable View owns only JSX, layout, form presentation, save-state display,
and safe semantic callback invocation. It composes the portable
`NarratorModuleSelectorView` directly rather than importing that feature's
application Shell.

## Persistence path

```text
Portable View
→ Narrator Builder ViewModel
→ narratorClient.js
→ creationClient.js
→ /api/creations
→ services-api
→ PostGraphile
→ public.creations
```

## Stored contract preserved

The create payload remains `type: NARRATOR` and preserves:

- `selected_modules` as canonical;
- no duplicated pacing/detail fields; `selected_modules` is canonical;
- `response_direction` defaults and creator selections;
- `builder: NARRATOR_BUILDER`;
- `builder_version: 1.0`;
- `creation_kind: NARRATOR`;
- `image_gen_ingredient: false`;
- `playable_directly: false`;
- `chat_enabled: true`.

## Preview

```text
/dev/ui-preview/narrator-builder
```

The preview is development-only and renders the portable View from fixtures.

## W4 presentation-scope wiring

The live Narrator selector now exposes exactly four Story Presentation groups:

```text
Prose Style
Detail Level
Pacing
Atmosphere
```

`Dialogue Style` is not Narrator authority; named Character dialogue remains
governed by Character voice and Character Voice Modules.

`Knowledge Behavior` is not Narrator presentation authority; knowledge remains
governed by registry/runtime knowledge boundaries.

The live create payload persists `selected_modules` as the canonical Story
Presentation map and no longer emits duplicated top-level `pacing` or
`detail_level` mirrors.
