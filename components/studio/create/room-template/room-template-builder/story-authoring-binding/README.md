# Room Template Story Authoring binding

Status: **WIRED**.

W21 closes the live Room Template authoring seam for opening Location selection
and typed Story Character lifecycle.

Application authority is mirrored exactly from current Chassis for the Room
Template Builder, Room Template picker, and Selected Characters ViewModels.

The FE Builder now exposes:
- Fixed Starting Location;
- Player Selects Starting Location;
- creator-authored allowed starting Location set;
- empty Player-select validation;
- Persistent Story Cast vs Opening Only Character lifecycle.

The existing fixed Location card is hidden in Player-select mode.

Lifecycle state is persisted by the Chassis-owned creation payload. FE does not
decide release timing.

`SelectedCharactersPanel` advances `1.0.0 -> 1.1.0`.

The accepted `room_template_story_authoring_binding_v1` now reports the opening
Location and Character lifecycle controls as `WIRED`.

FE visual styling remains authoritative.
