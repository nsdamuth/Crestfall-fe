"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import useStoryRoomChat from "@/components/studio/story-rooms/hooks/useStoryRoomChat";
import { deleteStoryRoom } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { useChatComposerViewModel } from "@/components/studio/chat/chat-composer/useChatComposerViewModel";
import { CHAT_COMPOSER_MODES } from "@/components/studio/chat/chat-composer/ChatComposer.contract";
import { useChatTranscriptViewModel } from "@/components/studio/chat/chat-transcript/useChatTranscriptViewModel";
import { useChatCastPanelViewModel } from "@/components/studio/chat/chat-cast-panel/useChatCastPanelViewModel";
import { useChatStatePanelViewModel } from "@/components/studio/chat/chat-state-panel/useChatStatePanelViewModel";
import { useChatSessionDialogsViewModel } from "@/components/studio/chat/chat-session-dialogs/useChatSessionDialogsViewModel";
import { useStoryRoomV2MessageActions } from "./useStoryRoomV2MessageActions";
import {
  projectStoryRoomCastToV2,
  projectStoryRoomFeaturedMediaToV2,
  projectStoryRoomMentionOptionsToV2,
  projectStoryRoomMessagesToV2,
  projectStoryRoomOpeningHero,
  projectStoryRoomStateSectionsToV2,
} from "./storyRoomV2LiveAdapter";

function normalizeComposerModeForRuntime(mode) {
  if (mode === CHAT_COMPOSER_MODES.SUGGESTION) return "DIRECT";
  return mode || "DIALOGUE";
}

function formatCoinBalance(value, loading) {
  if (loading) return "...";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : "0";
}

function getErrorMessage(value) {
  if (typeof value === "string") return value;
  return value?.message ? String(value.message) : "";
}

/**
 * V2 Story Chat binding ViewModel.
 *
 * The live Story Room hook owns network/persistence/runtime behavior. This
 * adapter only projects that application state into the portable V2 Chat
 * packages. No V1 Story Room View is mounted or navigated to from here.
 */
export function useChatV2StoryPageViewModel(id) {
  const router = useRouter();
  const account = useStudioAccount();
  const chat = useStoryRoomChat(id);

  const [mode, setMode] = useState(CHAT_COMPOSER_MODES.DIALOGUE);
  const [speakerId, setSpeakerId] = useState("AUTO");
  const [draft, setDraft] = useState("");
  const [participantMentions, setParticipantMentions] = useState([]);
  const [locationMentions, setLocationMentions] = useState([]);
  const [deletePending, setDeletePending] = useState(false);
  const [formatHelpOpen, setFormatHelpOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const projectedMessageItems = useMemo(
    () => projectStoryRoomMessagesToV2(chat.messages),
    [chat.messages]
  );
  const messageActions = useStoryRoomV2MessageActions({
    messages: chat.messages,
    projectedMessageItems,
    regenerateMessage: chat.regenerateMessage,
    continueMessage: chat.continueMessage,
    reportMessage: chat.reportMessage,
    messageActionState: chat.messageActionState,
  });
  const openingHeroImage = useMemo(
    () => projectStoryRoomOpeningHero(chat.room),
    [chat.room]
  );
  const partyMembers = useMemo(
    () => projectStoryRoomCastToV2(chat.cast),
    [chat.cast]
  );
  const participantMentionOptions = useMemo(
    () => projectStoryRoomMentionOptionsToV2(chat.cast),
    [chat.cast]
  );

  async function handleSend(options = {}) {
    const body = String(draft || "").trim();
    const actionType = String(options?.actionType || "MESSAGE");
    const isYield = ["PLAYER_YIELD_TO_CHARACTER", "PLAYER_YIELD_TO_AUTO"].includes(actionType);
    if ((!body && !isYield) || chat.sending) return;

    const mentionsForSend = isYield ? [] : participantMentions;
    const locationsForSend = isYield ? [] : locationMentions;

    const result = await chat.sendMessage({
      message: body,
      inputMode: normalizeComposerModeForRuntime(mode),
      requestedSpeakerId: speakerId || "AUTO",
      participantMentions: mentionsForSend,
      locationMentions: locationsForSend,
      actionType,
    });

    if (result || isYield) {
      setDraft("");
      setParticipantMentions([]);
      setLocationMentions([]);
    }
  }

  const composer = useChatComposerViewModel({
    mode,
    setMode,
    speakerId,
    setSpeakerId,
    speakerOptions: chat.speakerOptions,
    draft,
    setDraft,
    participantMentions,
    setParticipantMentions,
    participantMentionOptions,
    locationMentions,
    setLocationMentions,
    locationMentionOptions: chat.locationMentionOptions,
    onSend: handleSend,
    onLocalCommand: (commandInput) => {
      if (commandInput?.command?.panel !== "FORMAT") return false;
      setFormatHelpOpen(true);
      return true;
    },
    isSending: chat.sending,
    disabled: chat.loading || Boolean(chat.error),
    streamingSupported: false,
    isStreaming: false,
    sceneImage: { available: false, costLabel: "", pending: false },
    useCurrentScene: { available: false },
  });

  const transcript = useChatTranscriptViewModel({
    openingHeroImage,
    messageItems: messageActions.messageItems,
    loading: chat.loading,
    sending: chat.sending,
    summaryPending: false,
    errorMessage: getErrorMessage(chat.error),
  });

  const castPanel = useChatCastPanelViewModel({
    eyebrow: "Party",
    featuredMedia: projectStoryRoomFeaturedMediaToV2(chat.room),
    roomTitle: chat.room.title,
    roomIdLabel: String(id || ""),
    narrator: { label: "Narrator", value: chat.room.narrator || "Default Crestfall Narrator" },
    partyHeading: "Party",
    partyDescription: "Characters currently present in this Story.",
    partyMembers,
    npcParticipantManager: null,
    roomListHref: "/studio/v2/stories",
    roomListLabel: "Stories",
    onOpenPartyRoster: null,
    onOpenSceneImagePicker: null,
  });

  async function handleDeleteRoom() {
    if (!id || deletePending) return;
    setDeletePending(true);
    setDeleteError("");

    try {
      await deleteStoryRoom(id);
      router.push("/studio/v2/stories");
    } catch (error) {
      setDeleteError(error?.message || "Story could not be deleted.");
    } finally {
      setDeletePending(false);
    }
  }

  const statePanel = useChatStatePanelViewModel({
    eyebrow: "Chronicle State",
    title: chat.room.title || "Story Data",
    sections: projectStoryRoomStateSectionsToV2(chat.room),
    deletePending,
    onDeleteRoom: handleDeleteRoom,
    actions: [
      {
        id: "share-snapshot",
        iconKey: "share",
        label: "Share",
        disabled: true,
        onPress: null,
      },
      {
        id: "export-chat",
        iconKey: "download",
        label: "Export",
        disabled: true,
        onPress: null,
      },
      {
        id: "delete-story",
        iconKey: "delete",
        label: "Delete",
        disabled: false,
        onPress: null,
      },
    ],
  });

  const sessionDialogs = useChatSessionDialogsViewModel({
    activeDialog: messageActions.reportDialog,
    summaryPending: null,
  });

  const errorMessage = getErrorMessage(chat.error) || deleteError || "";

  return {
    id,
    backHref: "/studio/v2/stories",
    backLabel: "Stories",
    eyebrow: "Story",
    title: chat.room.title || "Story",
    scenarioLabel: chat.room.scenario || "",
    modeLabel: chat.room.roomMode || "",
    statusPills: [],
    coinBalanceLabel: formatCoinBalance(account?.coinBalance, account?.accountStatus === "loading"),
    loading: chat.loading,
    errorMessage,
    transcript,
    composer,
    castPanel,
    statePanel,
    sessionDialogs,
    libraryPassUpsell: null,
    formatHelp: {
      open: formatHelpOpen,
      onClose: () => setFormatHelpOpen(false),
    },
  };
}
