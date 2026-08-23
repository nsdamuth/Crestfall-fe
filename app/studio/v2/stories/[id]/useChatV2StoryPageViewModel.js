"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useChatComposerViewModel } from "@/components/studio/chat/chat-composer/useChatComposerViewModel";
import { CHAT_COMPOSER_MODES } from "@/components/studio/chat/chat-composer/ChatComposer.contract";
import { useChatTranscriptViewModel } from "@/components/studio/chat/chat-transcript/useChatTranscriptViewModel";
import { useChatCastPanelViewModel } from "@/components/studio/chat/chat-cast-panel/useChatCastPanelViewModel";
import { useChatStatePanelViewModel } from "@/components/studio/chat/chat-state-panel/useChatStatePanelViewModel";
import { useChatSessionDialogsViewModel } from "@/components/studio/chat/chat-session-dialogs/useChatSessionDialogsViewModel";
import { useChatPartyRosterViewModel } from "@/components/studio/chat/chat-party-roster/useChatPartyRosterViewModel";
import {
  CHAT_EXPORT_FORMAT_OPTIONS,
  CHAT_EXPORT_RANGE_PRESETS,
  CHAT_REPORT_REASON_OPTIONS,
  CHAT_SESSION_DELETE_STORY_CONFIRMATION,
} from "@/components/studio/chat/chat-session-dialogs/ChatSessionDialogs.contract";
import { resolveChatV2StoryMock } from "./chatV2StoryMock";

let mockMessageSequence = 0;
function nextMockMessageId() {
  mockMessageSequence += 1;
  return `mock-msg-${mockMessageSequence}`;
}

function playerMessage(text) {
  return {
    surfaceTone: "PLAYER",
    speakerLabel: "You",
    speakerAvatarUrl: null,
    bodyMode: "LEGACY",
    legacyBody: text,
    semanticSegments: [],
    statusBlocks: [],
    deliveryState: null,
  };
}

function characterMockReply(text) {
  return {
    surfaceTone: "CHARACTER",
    speakerLabel: "Lady Verena Ashcroft",
    speakerAvatarUrl: null,
    bodyMode: "LEGACY",
    legacyBody: text,
    semanticSegments: [],
    statusBlocks: [],
    deliveryState: null,
  };
}

/**
 * Binding-Shell-level ViewModel for app/studio/v2/stories/[id]. Resolves
 * the mock snapshot (chatV2StoryMock.js, pending CR-043), and wires the
 * real chat-composer/chat-transcript/chat-cast-panel/chat-state-panel/
 * chat-session-dialogs ViewModels against local page state so their
 * already-shipped interaction logic (autocomplete, delivery confirm
 * steps, mobile disclosure) is reused rather than re-implemented here.
 *
 * The send loop is honestly a mock: it appends an optimistic PLAYER
 * message, holds a brief simulated delay with the transcript's sending
 * state visible, then appends one canned CHARACTER reply. No engine call
 * exists yet; that is CR-043 and CR-044 (streaming transport).
 */
export function useChatV2StoryPageViewModel(id) {
  const router = useRouter();
  const snapshot = useMemo(() => resolveChatV2StoryMock(id), [id]);

  const [messageItems, setMessageItems] = useState(snapshot.messageItems);
  const [sending, setSending] = useState(false);

  const [mode, setMode] = useState(CHAT_COMPOSER_MODES.DIALOGUE);
  const [speakerId, setSpeakerId] = useState("AUTO");
  const [draft, setDraft] = useState("");
  const [participantMentions, setParticipantMentions] = useState([]);
  const [locationMentions, setLocationMentions] = useState([]);

  const [partyMembers, setPartyMembers] = useState(snapshot.partyMembers);
  const [deletePending, setDeletePending] = useState(false);
  const [partyRosterOpen, setPartyRosterOpen] = useState(false);
  const [sceneImagePickerNotice, setSceneImagePickerNotice] = useState(null);

  const [activeDialog, setActiveDialog] = useState(null);

  function appendMessage(message) {
    setMessageItems((current) => [...current, { id: nextMockMessageId(), message }]);
  }

  function handleSend(options = {}) {
    const trimmed = draft.trim();
    setDraft("");
    setSending(true);

    if (trimmed) {
      appendMessage(playerMessage(trimmed));
    } else if (options?.actionType === "PLAYER_YIELD_TO_AUTO") {
      appendMessage(playerMessage("(continues the scene)"));
    }

    window.setTimeout(() => {
      appendMessage(
        characterMockReply(
          "The mock engine has no live response yet, this reply is a fixture placeholder pending CR-043."
        )
      );
      setSending(false);
    }, 900);
  }

  const composer = useChatComposerViewModel({
    mode,
    setMode,
    speakerId,
    setSpeakerId,
    speakerOptions: snapshot.speakerOptions,
    draft,
    setDraft,
    participantMentions,
    setParticipantMentions,
    participantMentionOptions: snapshot.participantMentionOptions,
    locationMentions,
    setLocationMentions,
    locationMentionOptions: snapshot.locationMentionOptions,
    onSend: handleSend,
    isSending: sending,
    streamingSupported: false,
    isStreaming: false,
    sceneImage: { available: true, costLabel: "40 coins", pending: false },
    useCurrentScene: { available: false },
  });

  const transcript = useChatTranscriptViewModel({
    openingHeroImage: snapshot.openingHeroImage,
    messageItems,
    loading: false,
    sending,
    summaryPending: false,
    errorMessage: "",
  });

  const rosterCandidates = useMemo(() => {
    const partyIds = new Set(partyMembers.map((member) => member.id));

    return (snapshot.rosterCandidates || []).map((candidate) => ({
      ...candidate,
      inParty: partyIds.has(candidate.id),
    }));
  }, [snapshot.rosterCandidates, partyMembers]);

  function addPartyMember(memberId) {
    if (partyMembers.length >= 5) return;

    const candidate = (snapshot.rosterCandidates || []).find((item) => item.id === memberId);
    if (!candidate || partyMembers.some((member) => member.id === memberId)) return;

    setPartyMembers((current) => [
      ...current,
      {
        id: candidate.id,
        name: candidate.name,
        avatarUrl: candidate.avatarUrl,
        fallbackInitial: candidate.name.slice(0, 1).toUpperCase(),
        role: candidate.role,
        color: candidate.color,
      },
    ]);
  }

  function removePartyMember(memberId) {
    setPartyMembers((current) => current.filter((member) => member.id !== memberId));
  }

  const partyRoster = useChatPartyRosterViewModel({
    title: "Party",
    candidates: rosterCandidates,
    partySize: partyMembers.length,
    onClose: () => setPartyRosterOpen(false),
    onAddMember: addPartyMember,
    onRemoveMember: removePartyMember,
  });

  function handleDeleteRoom() {
    setDeletePending(true);
    window.setTimeout(() => {
      router.push("/studio/v2/stories");
    }, 600);
  }

  const castPanel = useChatCastPanelViewModel({
    eyebrow: "Party",
    featuredMedia: snapshot.castPanel.featuredMedia,
    roomTitle: snapshot.title,
    roomIdLabel: snapshot.roomIdLabel,
    narrator: snapshot.castPanel.narrator,
    partyHeading: "Party",
    partyDescription: snapshot.castPanel.partyDescription,
    partyMembers,
    npcParticipantManager: snapshot.castPanel.npcParticipantManager,
    roomListHref: "/studio/v2/stories",
    roomListLabel: "Room List",
    onOpenPartyRoster: () => setPartyRosterOpen(true),
    onOpenSceneImagePicker: () =>
      setSceneImagePickerNotice({
        label: "Scene Image",
        message: "The image selector is wired when this page goes live; nothing happens in this preview.",
      }),
  });

  const statePanel = useChatStatePanelViewModel({
    eyebrow: "Chronicle State",
    title: snapshot.title,
    sections: snapshot.statePanel.sections,
    deletePending,
    onDeleteRoom: handleDeleteRoom,
    actions: [
      {
        id: "share-snapshot",
        iconKey: "share",
        label: "Share",
        disabled: false,
        onPress: () =>
          setActiveDialog({
            kind: "SHARE",
            open: true,
            mode: "TEMPORARY",
            presets: CHAT_EXPORT_RANGE_PRESETS,
            preset: "RECENT_50",
            customRange: false,
            messageOptions: [],
            result: null,
            copied: false,
            pending: false,
            error: "",
            revokeConfirmOpen: false,
            onClose: () => setActiveDialog(null),
          }),
      },
      {
        id: "export-chat",
        iconKey: "download",
        label: "Export",
        disabled: false,
        onPress: () =>
          setActiveDialog({
            kind: "EXPORT",
            open: true,
            presets: CHAT_EXPORT_RANGE_PRESETS,
            preset: "RECENT_50",
            formats: CHAT_EXPORT_FORMAT_OPTIONS,
            format: "TXT",
            customRange: false,
            messageOptions: [],
            startMessageId: "",
            endMessageId: "",
            pending: false,
            error: "",
            onClose: () => setActiveDialog(null),
            onSubmit: () => setActiveDialog(null),
          }),
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
    activeDialog,
    summaryPending: null,
  });

  return {
    id: snapshot.id,
    backHref: snapshot.backHref,
    backLabel: snapshot.backLabel,
    eyebrow: snapshot.eyebrow,
    title: snapshot.title,
    scenarioLabel: snapshot.scenarioLabel,
    modeLabel: snapshot.modeLabel,
    statusPills: snapshot.statusPills,
    coinBalanceLabel: snapshot.coinBalanceLabel,
    loading: false,
    errorMessage: "",
    transcript,
    composer,
    castPanel,
    statePanel,
    sessionDialogs,
    libraryPassUpsell: null,
    partyRoster: { ...partyRoster, open: partyRosterOpen },
    sceneImagePickerNotice,
    onCloseSceneImagePicker: () => setSceneImagePickerNotice(null),
  };
}

export { CHAT_REPORT_REASON_OPTIONS, CHAT_SESSION_DELETE_STORY_CONFIRMATION };
