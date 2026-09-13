"use client";

import { ManageCastModal } from "./story-room-cast-panel/StoryRoomCastPanel.view";
import { useStoryRoomNpcParticipantManagerViewModel } from "./story-room-npc-participant-manager/useStoryRoomNpcParticipantManagerViewModel";

// Binding Shell for the Manage cast dialog opened from the composer's
// add character circle (fe/chat-studio brief 4 item 5). The chat shell
// owns the open state so the same dialog opens whether the rail's Cast
// drill-in is mounted or not; the dialog itself is the cast panel's
// ManageCastModal on the shared StoryChatDialog recipe, fed by the same
// registry NPC lifecycle and Random liked action the cast panel binds.
export default function StoryRoomManageCastDialog({
  registryNpcs,
  registryNpcsLoading = false,
  registryNpcActionKey = "",
  registryNpcError = "",
  onLoadRegistryNpc,
  onUnloadRegistryNpc,
  randomLikedLoading = false,
  randomLikedError = "",
  onLoadRandomLiked,
  onClose,
}) {
  const npcParticipantManager = useStoryRoomNpcParticipantManagerViewModel({
    registryNpcs,
    loading: registryNpcsLoading,
    actionKey: registryNpcActionKey,
    error: registryNpcError,
    onLoad: onLoadRegistryNpc,
    onUnload: onUnloadRegistryNpc,
    initialOpen: true,
  });

  const canLoadRandomLiked = typeof onLoadRandomLiked === "function";
  const randomLikedAction = {
    visible: canLoadRandomLiked,
    disabled: !canLoadRandomLiked || Boolean(randomLikedLoading),
    busy: Boolean(randomLikedLoading),
    label: "Random liked",
    busyLabel: "Loading",
  };

  return (
    <ManageCastModal
      npcParticipantManager={npcParticipantManager}
      randomLikedAction={randomLikedAction}
      randomLikedError={String(randomLikedError || "")}
      onLoadRandomLiked={onLoadRandomLiked}
      onClose={onClose}
    />
  );
}
