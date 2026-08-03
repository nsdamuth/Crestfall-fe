import {
  storyRoomNpcParticipantClosedFixture,
  storyRoomNpcParticipantCompleteFixture,
  storyRoomNpcParticipantErrorFixture,
} from "@/components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.fixtures";

function castMember({
  id,
  name,
  avatarUrl = "",
  role = "Character",
  state = "Active",
  note = "",
  isActive = true,
  selectable = true,
  selected = false,
  selectionLabel = selected ? "Next responder" : "Select responder",
} = {}) {
  const safeName = name || "Unnamed Participant";

  return {
    id,
    name: safeName,
    avatarUrl,
    fallbackInitial: safeName.slice(0, 1).toUpperCase(),
    role,
    state,
    note,
    isActive,
    selectable,
    selected,
    selectionLabel,
    selectionAriaLabel: selectable
      ? `Choose ${safeName} as the next responder`
      : "",
  };
}

const BASE_FIXTURE = {
  eyebrow: "Room & Cast",
  canClose: true,
  featuredMedia: {
    imageUrl: "/assets/covers/profile.png",
    imageAltText: "Mara Venn",
    speakerName: "Mara Venn",
    emptyEyebrow: "Room Media",
    emptyMessage: "Featured room image will appear here.",
    imageEyebrow: "Last Speaker Media",
  },
  roomTitle: "The Lantern District Ledger",
  roomIdLabel: "room-preview-014",
  narrator: {
    label: "Narrator",
    value: "The Chronicler",
  },
  castHeading: "Cast",
  castDescription:
    "Select an active Character or Narrator to choose the next responder.",
  castMembers: [
    castMember({
      id: "narrator",
      name: "The Chronicler",
      role: "Narrator",
      selected: true,
      note: "Frames the scene and manages transitions.",
    }),
    castMember({
      id: "mara",
      name: "Mara Venn",
      avatarUrl: "/assets/covers/profile.png",
      role: "Night Clerk",
      note: "Knows who altered the district ledger.",
    }),
    castMember({
      id: "player",
      name: "Rowan Vale",
      role: "Player Character",
      state: "Player controlled",
      selectable: false,
      selectionLabel: "Player-controlled",
    }),
  ],
  playerCharacterAction: {
    visible: true,
    disabled: false,
    busy: false,
    label: "Set Player Character",
    busyLabel: "Setting...",
  },
  setPlayerCharacterError: "",
  npcParticipantManager: storyRoomNpcParticipantClosedFixture,
  randomLikedAction: {
    visible: true,
    label: "Random Liked",
    busyLabel: "Loading...",
    disabled: false,
    busy: false,
  },
  randomLikedError: "",
  deleteAction: {
    visible: true,
    disabled: false,
    busy: false,
    label: "Delete Story",
    busyLabel: "Deleting...",
  },
  deleteError: "",
  roomListHref: "#room-list-preview",
  roomListLabel: "← Room List",
  playerCharacterPickerContent: null,
  onClosePanel: null,
  onSelectCastMember: null,
  onOpenPlayerCharacterPicker: null,
  onLoadRandomLiked: null,
  onDeleteRoom: null,
};

export const storyRoomCastPanelCompleteFixture = BASE_FIXTURE;

export const storyRoomCastPanelNoMediaFixture = {
  ...BASE_FIXTURE,
  featuredMedia: {
    ...BASE_FIXTURE.featuredMedia,
    imageUrl: "",
  },
  npcParticipantManager: storyRoomNpcParticipantCompleteFixture,
};

export const storyRoomCastPanelMobileFixture = {
  ...BASE_FIXTURE,
  canClose: false,
  deleteAction: {
    ...BASE_FIXTURE.deleteAction,
    visible: true,
  },
};

export const storyRoomCastPanelSettingFixture = {
  ...BASE_FIXTURE,
  playerCharacterAction: {
    ...BASE_FIXTURE.playerCharacterAction,
    disabled: true,
    busy: true,
  },
};

export const storyRoomCastPanelErrorFixture = {
  ...BASE_FIXTURE,
  setPlayerCharacterError:
    "The selected Player Character could not be attached to this Story.",
  deleteError: "This Story could not be deleted.",
  randomLikedError:
    "No eligible SFW Character remains in your liked Characters for this Story.",
  npcParticipantManager: storyRoomNpcParticipantErrorFixture,
};

export const storyRoomCastPanelLockedFixture = {
  ...BASE_FIXTURE,
  playerCharacterAction: {
    ...BASE_FIXTURE.playerCharacterAction,
    visible: false,
  },
  deleteAction: {
    ...BASE_FIXTURE.deleteAction,
    visible: false,
  },
  castMembers: BASE_FIXTURE.castMembers.map((member) => ({
    ...member,
    selectable: false,
    selected: false,
    selectionLabel:
      member.role === "Player Character" ? "Player-controlled" : "Not selectable",
    selectionAriaLabel: "",
  })),
};

export const storyRoomCastPanelLongContentFixture = {
  ...BASE_FIXTURE,
  roomTitle:
    "The Lantern District Ledger and the Observatory Correspondence Archive",
  roomIdLabel:
    "room-preview-with-an-intentionally-long-identifier-for-responsive-stress",
  narrator: {
    label: "Narrator",
    value:
      "The Chronicler of the Western Observatory and Keeper of Uncatalogued Testimony",
  },
  castMembers: BASE_FIXTURE.castMembers.map((member) => ({
    ...member,
    name: `${member.name} of the Lower Lantern District and Western Archive`,
    role:
      "Senior Participant in the Observatory Ledger Investigation and Restricted Correspondence Review",
    note:
      "This intentionally long note verifies wrapping, clamping, card height, and narrow-panel behavior without changing any Story Room application state.",
  })),
};
