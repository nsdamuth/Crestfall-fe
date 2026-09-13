"use client";

import Link from "next/link";

import StoryRoomCastPanel from "@/components/studio/story-rooms/StoryRoomCastPanel";
import StoryRoomRuntimeMechanicsPanel from "@/components/studio/story-rooms/StoryRoomRuntimeMechanicsPanel";
import StoryRoomStatePanel from "@/components/studio/story-rooms/StoryRoomStatePanel";

import StoryRoomDetailsRailView, {
  ChatColorPreferences,
} from "./story-room-details-rail/StoryRoomDetailsRail.view";
import { useStoryRoomDetailsRailViewModel } from "./story-room-details-rail/useStoryRoomDetailsRailViewModel";

// Binding Shell for the right rail (fe/chat-studio item 6): composes the
// application-owned panels into the rail's slots. Export and Share are
// the state panel's live actions; World state is its sections; Cast is
// the cast panel (roster and Manage Cast); Mechanics is the runtime
// mechanics panel under its existing gate; Preferences is the chat
// color list the shell view model owns.
export default function StoryRoomDetailsRail({
  room,
  cast,
  messages,
  castPanelProps = {},
  statePanelProps = {},
  runtimeMechanicsPanelProps = null,
  chatColorProps = null,
  onDeleteRoom = null,
  isDeletingRoom = false,
  deleteError = "",
  autoOpenViewer = false,
}) {
  const viewProps = useStoryRoomDetailsRailViewModel({
    room,
    cast,
    messages,
    chatColorProps,
    onDeleteRoom,
    isDeletingRoom,
    deleteError,
    autoOpenViewer,
  });

  const detailPanels = {
    cast: <StoryRoomCastPanel {...castPanelProps} />,
    narrator: (
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
        {viewProps.narratorLabel}
      </p>
    ),
    world: <StoryRoomStatePanel {...statePanelProps} layout="sections" />,
    mechanics: runtimeMechanicsPanelProps ? (
      <StoryRoomRuntimeMechanicsPanel {...runtimeMechanicsPanelProps} />
    ) : (
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        A mechanics module is attached to this story.
      </p>
    ),
    preferences: viewProps.chatColor ? <ChatColorPreferences {...viewProps.chatColor} /> : null,
  };

  return (
    <StoryRoomDetailsRailView
      {...viewProps}
      actionsSlot={<StoryRoomStatePanel {...statePanelProps} layout="actions" />}
      detailPanels={detailPanels}
      LinkComponent={Link}
    />
  );
}
