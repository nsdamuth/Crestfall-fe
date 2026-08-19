# Story Room Cast ↔ Character Lifecycle binding

Status: **WIRED**.

W14 closes the typed Story Character lifecycle presentation seam in the live
Story Room Cast panel.

The Story Room shell passes the authoritative raw Story snapshot into the Cast
panel ViewModel.

The ViewModel then applies:

```text
story_character_lifecycle_runtime.presentation.v1
```

followed by:

```text
story_room_cast_lifecycle_binding_v1
```

to the existing display-ready Cast members.

## What appears in existing Cast cards

Lifecycle presentation composes into the current `state` / `note` fields:

```text
STORY_PINNED       -> Persistent Story Cast
OPENING_TEMPORARY  -> Opening Only
TEMPORARY          -> Temporary Story Cast
```

Authoritative released metadata can additionally show:

```text
Released
release reason
Released on turn N
```

No Cast View rewrite is required.

## Chassis authority remains unchanged

The FE must not decide:

- responder eligibility;
- selected responder;
- participant active state;
- whether a lifecycle participant should release;
- phase transition state;
- explicit release signal state;
- participant mutation.

The lifecycle binding preserves the exact responder/selectability fields already
supplied by Chassis.

## Release-ready behavior

The accepted runtime presentation supports a Chassis-supplied release evaluation.

W14 does **not** synthesize one in the browser.

If the authoritative Story snapshot contains lifecycle metadata but no explicit
release evaluation, FE projects only the authoritative active/released metadata
that exists.

## Registry NPCs remain separate

Registry-managed NPC load/unload lifecycle remains owned by:

```text
StoryRoomNpcParticipantManager
```

and is not converted into typed Story Character lifecycle.

## Presentation ownership

`StoryRoomCastPanel.view.jsx` remains unchanged and FE-owned.

W14 only binds accepted lifecycle state onto fields that the current View
already renders.
