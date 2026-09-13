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
} = {}) {
  const safeName = name || "Unnamed Participant";

  return {
    id,
    name: safeName,
    avatarUrl,
    fallbackInitial: safeName.slice(0, 1).toUpperCase(),
    role,
    typeLabel:
      role === "Narrator"
        ? "Narrator"
        : role === "Player Character"
          ? "Player"
          : "Character",
    state,
    displayState: /^(present|active|player controlled)$/i.test(state) ? "" : state,
    note,
    isActive,
    selectable,
    selected,
    selectionAriaLabel: selectable
      ? `Choose ${safeName} as the next responder`
      : "",
  };
}

// 2.0.0 (fe/chat-studio item 6): the roster and its actions only; the
// story's media, title, narrator, delete, and the way back live in the
// details rail fixtures.
const BASE_FIXTURE = {
  castHeading: "Cast",
  castDescription: "",
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
    label: "Random liked",
    busyLabel: "Loading...",
    disabled: false,
    busy: false,
  },
  randomLikedError: "",
  playerCharacterPickerContent: null,
  onSelectCastMember: null,
  onOpenPlayerCharacterPicker: null,
  onLoadRandomLiked: null,
};

export const storyRoomCastPanelCompleteFixture = BASE_FIXTURE;

export const storyRoomCastPanelNoMediaFixture = {
  ...BASE_FIXTURE,
  npcParticipantManager: storyRoomNpcParticipantCompleteFixture,
};

export const storyRoomCastPanelMobileFixture = {
  ...BASE_FIXTURE,
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
  castMembers: BASE_FIXTURE.castMembers.map((member) => ({
    ...member,
    selectable: false,
    selected: false,
    selectionAriaLabel: "",
  })),
};

export const storyRoomCastPanelLongContentFixture = {
  ...BASE_FIXTURE,
  castMembers: BASE_FIXTURE.castMembers.map((member) => ({
    ...member,
    name: `${member.name} of the Lower Lantern District and Western Archive`,
    role:
      "Senior Participant in the Observatory Ledger Investigation and Restricted Correspondence Review",
    note:
      "This intentionally long note verifies wrapping, clamping, card height, and narrow-panel behavior without changing any Story Room application state.",
  })),
};
