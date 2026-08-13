// MOCK DATA MODULE, pending CR-043 (chat API catch-up: message actions,
// summary, transcript-export, temporary/persistent share, and the
// engine-binding orphans decision). Resolves the [id] route param to a
// full snapshot of chat-shell view-contract prop groups. No network
// call, no persistence; every value here is fixture-shaped, matching
// wave C5's fixture-first requirement (docs/plans/FABLE-GATE-PLAN.md).
// Swap this module for a real client once CR-043 lands.

import { chatShellActiveSessionFixture } from "@/components/studio/chat/chat-shell/ChatShell.fixtures";

const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E";

export const CHAT_V2_STORY_MOCK_SPEAKER_OPTIONS = [
  { id: "AUTO", label: "Auto", participantType: "AUTO", avatarUrl: "" },
  { id: "narrator-1", label: "The Chronicler", participantType: "NARRATOR", avatarUrl: "" },
  { id: "char-verena", label: "Lady Verena Ashcroft", participantType: "CHARACTER", avatarUrl: AVATAR_DATA_URL },
  { id: "char-thane", label: "Thane Corvid", participantType: "CHARACTER", avatarUrl: "" },
  { id: "RANDOM", label: "Random", participantType: "RANDOM", avatarUrl: "" },
];

export const CHAT_V2_STORY_MOCK_MENTION_OPTIONS = [
  { id: "char-verena", label: "Lady Verena Ashcroft", avatarUrl: AVATAR_DATA_URL },
  { id: "char-thane", label: "Thane Corvid", avatarUrl: "" },
];

export const CHAT_V2_STORY_MOCK_LOCATION_OPTIONS = [
  {
    runtimeEntryId: "loc-brass-finch",
    label: "The Brass Finch",
    aliases: ["Brass Finch", "Finch"],
    locationScale: "Building",
    registryTitle: "The Lantern District Ledger",
    isCurrent: true,
  },
  {
    runtimeEntryId: "loc-lantern-below",
    label: "The Lantern Below",
    aliases: ["Below"],
    locationScale: "District",
    registryTitle: "The Lantern District Ledger",
    isCurrent: false,
  },
];

export function resolveChatV2StoryMock(id) {
  const safeId = String(id || "").trim() || "unknown";
  const base = chatShellActiveSessionFixture;

  return {
    id: safeId,
    backHref: "/studio/v2/stories",
    backLabel: "Stories",
    eyebrow: base.eyebrow,
    title: base.title,
    scenarioLabel: base.scenarioLabel,
    modeLabel: base.modeLabel,
    statusPills: base.statusPills,
    coinBalanceLabel: base.coinChip.balanceLabel,
    roomIdLabel: safeId,
    openingHeroImage: base.transcript.openingHeroImage,
    messageItems: base.transcript.messageItems,
    castMembers: base.castPanel.castMembers,
    castPanel: base.castPanel,
    statePanel: base.statePanel,
    speakerOptions: CHAT_V2_STORY_MOCK_SPEAKER_OPTIONS,
    participantMentionOptions: CHAT_V2_STORY_MOCK_MENTION_OPTIONS,
    locationMentionOptions: CHAT_V2_STORY_MOCK_LOCATION_OPTIONS,
  };
}
