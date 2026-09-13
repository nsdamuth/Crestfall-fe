const baseRoom = Object.freeze({
  title: "The Lantern Below",
  scenario: "A sealed archive opens beneath the city",
  narrator: "The Archivist",
  location: "Lower Reliquary",
  roomMode: "Group Story",
  contentRating: "SFW",
  visibility: "PRIVATE",
  weather: "Rain above the vault",
  timeLabel: "22:15",
  turnCount: 18,
  worldDay: 4,
  objective: "Turn 18 · Day 4 · 22:15",
  featuredSpeakerImageUrl: "",
  featuredSpeakerName: "Mara Vale",
});

const baseCast = Object.freeze([
  {
    id: "participant-mara",
    name: "Mara Vale",
    role: "Default Speaker",
    state: "Present",
    participantType: "CHARACTER",
    isActive: true,
    isSelectableResponder: true,
  },
  {
    id: "participant-archivist",
    name: "The Archivist",
    role: "Narrator",
    state: "Present",
    participantType: "NARRATOR",
    isActive: true,
    isSelectableResponder: true,
  },
]);

const baseMessages = Object.freeze([
  {
    id: "message-1",
    speaker: "Mara Vale",
    type: "character",
    mode: "DIALOGUE",
    body: "The lock is warm. Something on the other side already knows we are here.",
    createdAt: "2026-08-01T19:12:00.000Z",
  },
  {
    id: "message-2",
    speaker: "You",
    type: "player",
    mode: "ACTION",
    body: "I place the brass key against the center seal.",
    createdAt: "2026-08-01T19:13:00.000Z",
  },
]);

const baseSpeakerOptions = Object.freeze([
  {
    id: "participant-mara",
    label: "Mara Vale",
    participantType: "CHARACTER",
  },
  {
    id: "participant-archivist",
    label: "The Archivist",
    participantType: "NARRATOR",
  },
]);

const baseLocationMentionOptions = Object.freeze([
  {
    runtimeEntryId: "location-reliquary",
    registryCreationId: "registry-locations",
    registryEntryId: "entry-reliquary",
    linkedLocationCreationId: "creation-reliquary",
    label: "Lower Reliquary",
    aliases: ["reliquary", "vault"],
    locationScale: "ROOM",
    registryTitle: "Archive Locations",
    isCurrent: true,
  },
]);

function makeFixture(overrides = {}) {
  return {
    room: baseRoom,
    cast: baseCast,
    messages: baseMessages,
    speakerOptions: baseSpeakerOptions,
    locationMentionOptions: baseLocationMentionOptions,
    loading: false,
    sending: false,
    error: null,
    deletingRoom: false,
    deleteError: "",
    leftOpen: false,
    rightOpen: true,
    railsState: "right",
    swipeEnabled: false,
    primaryCharacter: { label: "Mara Vale", avatarUrl: "" },
    backHref: "/studio/v2/stories",
    storyListProps: { currentRoomId: "room-lantern", refetchKey: 2 },
    mobilePanel: null,
    composerHelpPanel: null,
    ...overrides,
  };
}

export const storyRoomChatShellReadyFixture = makeFixture();

export const storyRoomChatShellLoadingFixture = makeFixture({
  loading: true,
  messages: [],
});

export const storyRoomChatShellSendingFixture = makeFixture({
  sending: true,
});

export const storyRoomChatShellErrorFixture = makeFixture({
  error: "Story could not be loaded.",
  messages: [],
});

export const storyRoomChatShellDeleteErrorFixture = makeFixture({
  deleteError: "Story could not be deleted.",
});

export const storyRoomChatShellCollapsedFixture = makeFixture({
  leftOpen: false,
  rightOpen: false,
  railsState: "none",
});

export const storyRoomChatShellStoryListFixture = makeFixture({
  leftOpen: true,
  rightOpen: false,
  railsState: "left",
});

export const storyRoomChatShellBothRailsFixture = makeFixture({
  leftOpen: true,
  rightOpen: true,
  railsState: "both",
});

export const storyRoomChatShellPhoneFixture = makeFixture({
  swipeEnabled: true,
});

export const storyRoomChatShellCommandsFixture = makeFixture({
  composerHelpPanel: "COMMANDS",
});

export const storyRoomChatShellHelpFixture = makeFixture({
  composerHelpPanel: "HELP",
});

// The story list as a left sheet below md (brief 2 item 11); the
// gallery panel retired with the mobile bar's media button.
export const storyRoomChatShellMobileStoryListFixture = makeFixture({
  swipeEnabled: true,
  mobilePanel: "stories",
});

// The preview harness (app/dev/ui-preview, never edited) imports this
// name; the cast drawer retired in item 6, so it now names the story
// list sheet.
export const storyRoomChatShellMobileCastFixture = storyRoomChatShellMobileStoryListFixture;

// The right sheet below md (item 6); the name predates the rail.
export const storyRoomChatShellMobileStateFixture = makeFixture({
  swipeEnabled: true,
  mobilePanel: "details",
});
