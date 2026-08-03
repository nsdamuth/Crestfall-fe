# Story Room Runtime Mechanics Panel LOOM package

## Boundary

`StoryRoomRuntimeMechanicsPanel.jsx` is the thin Crestfall **Binding Shell**. It
owns the application-only `MechanicsModulePickerModal` integration and passes
its rendered content into the portable View.

`useStoryRoomRuntimeMechanicsPanelViewModel.js` is the **ViewModel / Chassis**.
It owns:

- legacy `engine_module_bindings` and `engineModuleBindings` compatibility;
- Mechanics Module binding identification;
- attached Creation ID compatibility aliases;
- `core.trackers.v1` fallback behavior;
- binding payload composition;
- Story Room upsert and delete client calls;
- saving, success, and error state;
- room refresh orchestration after mutation;
- picker visibility and excluded attached-module IDs.

`StoryRoomRuntimeMechanicsPanel.view.jsx` is the portable **Skin**. It receives
one display-ready binding plus semantic callbacks. It does not import the
picker, Story Room clients, room JSONB, or persistence code.

## Production integration

The panel is mounted in both Chronicle State surfaces owned by
`StoryRoomChatShell.jsx`:

- the desktop right rail;
- the mobile Chronicle State drawer.

Both mounts pass `reloadStoryRoom` as `onUpdated`, preserving the current room
refresh after an attach, replace, edit, or remove mutation. The previously
unmounted component is therefore reachable without moving Story Room chat
transport or orchestration into this package.

## Preserved binding payload

Attaching a Mechanics Module continues to store:

- `moduleId`, using the Creation definition or `core.trackers.v1` fallback;
- `moduleSourceType: "MECHANICS_MODULE"`;
- `mechanicsModuleCreationId` and `moduleInstanceId`;
- `moduleInstanceTitle`;
- `role: "MECHANICS_MODULE"`;
- `enabled: true`;
- `inheritanceMode: "LOCAL_ONLY"`;
- `mechanicsScopeMode: "STORY_ROOM"`;
- `ownerType: "STORY_ROOM"`;
- room owner ID/title and `story_room_binding` source markers;
- priority, defaulting to `100`;
- `operationTriggers.chatTurnDefault: "get_tracker_context"`;
- definition ID, contract version, and tags in nested `data`.

Existing attached bindings still support Creation IDs from camelCase,
snake_case, module-instance, and target-Creation aliases. The panel continues
to persist enable, scope, and priority changes immediately through the existing
Story Room client.

## Deliberate non-scope

This patch does not alter Story Room API routes, services-api, PostGraphile,
database functions, or engine middleware. It does not change runtime command
resolution or tracker execution.

Most importantly, it does not abstract or decompose the deferred core
Mechanics Module editor, progression profiles, tracker modal, preset catalogs,
command composition, saved-asset migration, or runtime-module attachment
domains. Those remain for the required final Mechanics assessment.

## Development preview

`/dev/ui-preview/story-room-runtime-mechanics-panel` is protected from
production and renders the View directly with fixtures for empty, attached,
binding-owner, saving, saved, and error states. Its picker and mutations are
local preview adapters only. The route does not fetch Mechanics Module
Creations, mutate a Story Room, or execute engine operations.

## Manual validation

Test the preview and the real Story Room route. In production, verify the panel
in desktop and mobile Chronicle State surfaces, attach or replace a disposable
Mechanics Module, toggle Enabled, change scope and priority, reload the room,
and remove the binding. Confirm all mutations refresh the same room and retain
the stored values.
