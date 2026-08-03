# Room Template Builder LOOM bundle

## Boundary

```text
RoomTemplateBuilderShell                 Binding Shell
        ↓
useRoomTemplateBuilderViewModel          ViewModel / Chassis
        ↓
RoomTemplateBuilderView                  Portable View / Skin
        ↓
roomTemplateClient                       client API
        ↓
Next.js API proxy → services-api → PostGraphile → DB
```

## Preserved behavior

The conversion preserves the existing Story (`ROOM_TEMPLATE`) create flow:

- Story identity, visibility, content rating, tags, and mode;
- selected Characters, Scenario, Narrator, and Location;
- Scenario recommendations and NPC Registry merging;
- mutual-player invitations and forced turn-based behavior;
- public opening context and normalized opening messages;
- display-media slot selection;
- Story Rules Codex and Registry attachments;
- private runtime guidance;
- draft creation and redirect to Creation Edit.

## Portable View

`RoomTemplateBuilder.view.jsx` owns only layout and semantic callback invocation.
It composes existing portable Room Template child Views directly and receives
application-owned registry attachment content through a slot.

The View does not call APIs, build persistence payloads, import the Story picker
Shell, or interpret service responses.

## Application binding

`RoomTemplateBuilderShell.jsx` remains the public import used by the Create
Story page. It binds the ViewModel, injects the existing Rules Codex and Registry
attachment Shells, and renders the existing picker modal when requested.

## Preview

Development-only preview:

```text
/dev/ui-preview/room-template-builder
```

## Diagnostic

```bash
npm run diagnostics:loom:room-template-builder
```
