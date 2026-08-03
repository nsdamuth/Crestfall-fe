# Player Character Creator LOOM Surface

## Public binding

```text
components/studio/create/player-character/PlayerCharacterCreator.jsx
```

The public Shell preserves the existing import used by the Create Player
Character page.

## LOOM boundary

```text
PlayerCharacterCreator.jsx
  → usePlayerCharacterCreatorViewModel.js
  → PlayerCharacterCreator.view.jsx
```

The ViewModel owns:

- active-step and controlled player-character form state;
- progress calculation and adult-age normalization;
- semantic field, step, back, and next callbacks;
- creation-payload construction and compatibility fields;
- save status and error handling;
- client-layer creation calls;
- redirecting to Creation Edit after a successful create.

The portable View owns JSX, step navigation presentation, preview presentation,
controlled text/select fields, review summaries, save-state presentation, and
semantic callback invocation. It does not call APIs, build persistence
payloads, navigate, or import another Crestfall Binding Shell.

## Application-owned field composition

The established character field surfaces remain independently bound LOOM
features:

- Skin Tone;
- Hair and Eyes;
- Trait Modal;
- Default Clothing Selector;
- Character Color Palette.

`PlayerCharacterCreator.jsx` composes those application Shells and injects them
into semantic View slots. This preserves their existing behavior and keeps the
portable parent View independent from application bindings and clothing
queries.

## Persistence path

```text
Portable View
→ Player Character Creator ViewModel
→ playerCharacterClient.js
→ creationClient.js
→ /api/creations
→ services-api
→ PostGraphile
→ public.creations
```

## Stored contract preserved

The create payload continues to use:

```text
type: PLAYER_CHARACTER
builder: PLAYER_CHARACTER_CREATOR
builder_version: 1.0
persona_type: PLAYER_CHARACTER
```

It preserves the private visibility boundary, SFW/Mature/Explicit selection,
rendering style, appearance and body fields, default Outfit/Wardrobe fields,
shared Creation Edit compatibility aliases, player-control markers, and
redirect to the new creation's edit page.

## Preview

```text
/dev/ui-preview/player-character-creator
```

The development-only preview renders identity, appearance, body, profile,
review, empty, saving, saved, and error fixtures without persistence,
navigation, clothing queries, or application field modals.
