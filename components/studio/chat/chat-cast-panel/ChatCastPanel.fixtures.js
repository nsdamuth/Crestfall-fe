import {
  chatNpcManagerClosedFixture,
  chatNpcManagerCompleteFixture,
  chatNpcManagerErrorFixture,
} from "../chat-npc-manager/ChatNpcManager.fixtures";

function noop() {}

const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E";

function partyMember({ id, name, avatarUrl = "", role = "Character", color = "" } = {}) {
  const safeName = name || "Unnamed Participant";

  return {
    id,
    name: safeName,
    avatarUrl,
    fallbackInitial: safeName.slice(0, 1).toUpperCase(),
    role,
    color,
  };
}

const BASE_FIXTURE = {
  eyebrow: "Party",
  canClose: true,
  featuredMedia: {
    imageUrl: AVATAR_DATA_URL,
    imageAltText: "Mara Venn",
    speakerName: "Mara Venn",
    imageEyebrow: "Last Speaker Media",
  },
  roomTitle: "The Lantern District Ledger",
  roomIdLabel: "room-preview-014",
  narrator: { label: "Narrator", value: "The Chronicler" },
  partyHeading: "Party",
  partyDescription: "Up to 5 members can join this Story.",
  partyMembers: [
    partyMember({ id: "narrator", name: "The Chronicler", role: "Narrator", color: "#e0ab5e" }),
    partyMember({ id: "mara", name: "Mara Venn", avatarUrl: AVATAR_DATA_URL, role: "Night Clerk", color: "#3ba6a0" }),
    partyMember({ id: "player", name: "Rowan Vale", role: "Player Character", color: "#c25a8f" }),
  ],
  npcParticipantManager: chatNpcManagerClosedFixture,
  roomListHref: "#room-list-preview",
  roomListLabel: "Room List",
  initialMobileOpen: false,
  onClosePanel: noop,
  onOpenPartyRoster: noop,
  onOpenSceneImagePicker: noop,
};

export const chatCastPanelCompleteFixture = BASE_FIXTURE;

export const chatCastPanelEmptyCastFixture = {
  ...BASE_FIXTURE,
  partyMembers: [],
  partyDescription: "",
};

export const chatCastPanelManyCastFixture = {
  ...BASE_FIXTURE,
  npcParticipantManager: chatNpcManagerCompleteFixture,
  partyMembers: [
    ...BASE_FIXTURE.partyMembers,
    partyMember({ id: "thane", name: "Thane Corvid", role: "Investigator", color: "#7a8cc4" }),
    partyMember({ id: "sable", name: "Sable Orr", role: "Dock Watcher", color: "#a1a15c" }),
  ],
};

export const chatCastPanelLoadingFixture = {
  ...BASE_FIXTURE,
  featuredMedia: { ...BASE_FIXTURE.featuredMedia, imageUrl: "" },
  partyMembers: [],
  partyDescription: "Loading the party for this Story.",
};

export const chatCastPanelErrorFixture = {
  ...BASE_FIXTURE,
  featuredMedia: { ...BASE_FIXTURE.featuredMedia, imageUrl: "" },
  npcParticipantManager: chatNpcManagerErrorFixture,
};

export const chatCastPanelSettingFixture = BASE_FIXTURE;

export const chatCastPanelLockedFixture = {
  ...BASE_FIXTURE,
  partyMembers: BASE_FIXTURE.partyMembers.map((member) => ({ ...member })),
};

export const chatCastPanelDeleteConfirmFixture = BASE_FIXTURE;

export const chatCastPanelDeleteConfirmPendingFixture = BASE_FIXTURE;

export const chatCastPanelMobileOpenFixture = {
  ...BASE_FIXTURE,
  initialMobileOpen: true,
};

export const chatCastPanelLongestFixture = {
  ...BASE_FIXTURE,
  roomTitle: "The Lantern District Ledger and the Observatory Correspondence Archive",
  roomIdLabel: "room-preview-with-an-intentionally-long-identifier-for-responsive-stress",
  narrator: { label: "Narrator", value: "The Chronicler of the Western Observatory and Keeper of Uncatalogued Testimony" },
  npcParticipantManager: chatNpcManagerCompleteFixture,
  partyMembers: BASE_FIXTURE.partyMembers.map((member) => ({
    ...member,
    name: `${member.name} of the Lower Lantern District and Western Archive`,
    role: "Senior Participant in the Observatory Ledger Investigation and Restricted Correspondence Review",
  })),
};

export const chatCastPanelFixtures = [
  { id: "complete", label: "Complete, open slots remain", props: chatCastPanelCompleteFixture },
  { id: "empty-cast", label: "Empty party, 5 open slots", props: chatCastPanelEmptyCastFixture },
  { id: "many-cast", label: "Full party, NPC manager open", props: chatCastPanelManyCastFixture },
  { id: "loading", label: "Loading", props: chatCastPanelLoadingFixture },
  { id: "error", label: "Error, NPC manager", props: chatCastPanelErrorFixture },
  { id: "locked", label: "Locked view", props: chatCastPanelLockedFixture },
  { id: "mobile-open", label: "Mobile sheet open", props: chatCastPanelMobileOpenFixture },
  { id: "longest", label: "Longest content", props: chatCastPanelLongestFixture },
];
