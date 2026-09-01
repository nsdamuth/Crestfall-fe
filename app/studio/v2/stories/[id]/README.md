# Story Chat route authority

`/studio/v2/stories/[id]` is the canonical Story Chat route.

It intentionally mounts `components/studio/story-rooms/StoryRoomChatShell.jsx`
and the complete `components/studio/story-rooms/**` runtime/presentation tree.
That stack is the established live implementation and contains the current
Story Chat functionality.

Do not create or restore a parallel V2 Story Chat view model, transcript,
composer, message-action loop, or transport adapter under this route.
Changes to Story Chat behavior belong in the shared `story-rooms` stack.

`/studio/story-rooms/[id]` remains as a compatibility route and mounts this same
binding so existing bookmarks and inbound links keep working without a visible
behavior change.
