const baseItems = Object.freeze([
  {
    id: "room-lantern",
    roomId: "room-lantern",
    title: "The Lantern Below",
    lastLine: "The lock is warm. Something on the other side already knows we are here.",
    relativeDay: "Just now",
    imageSrc: null,
    isCurrent: true,
    href: "/studio/v2/stories/room-lantern",
  },
  {
    id: "room-harbor",
    roomId: "room-harbor",
    title: "Harbor of Glass",
    lastLine: "Turn 12 · Dusk over the quay",
    relativeDay: "3h ago",
    imageSrc: null,
    isCurrent: false,
    href: "/studio/v2/stories/room-harbor",
  },
  {
    id: "room-orchard",
    roomId: "room-orchard",
    title: "Orchard Vigil",
    lastLine: "Opening scene ready.",
    relativeDay: "2d ago",
    imageSrc: null,
    isCurrent: false,
    href: "/studio/v2/stories/room-orchard",
  },
]);

const baseNewChat = Object.freeze({
  label: "New chat",
  pendingLabel: "Starting",
  pending: false,
  disabled: false,
  title: "New chat from The Lantern Below",
  errorMessage: "",
  onPress: () => {},
});

function makeFixture(overrides = {}) {
  return {
    items: baseItems,
    query: "",
    newStoryHref: "/studio/v2/stories",
    newChat: baseNewChat,
    isLoading: false,
    errorMessage: "",
    ...overrides,
  };
}

export const storyRoomStoryListDefaultFixture = makeFixture();

export const storyRoomStoryListEmptyFixture = makeFixture({ items: [] });

export const storyRoomStoryListLoadingFixture = makeFixture({
  items: [],
  isLoading: true,
});

export const storyRoomStoryListErrorFixture = makeFixture({
  items: [],
  errorMessage: "Stories could not be loaded.",
});

export const storyRoomStoryListLongestFixture = makeFixture({
  items: [
    {
      id: "room-longest",
      roomId: "room-longest",
      title:
        "The Extraordinarily Long Chronicle of the Seven Lanterns and the Archivist Who Would Not Sleep",
      lastLine:
        "She pressed both palms to the seal and the corridor answered with a sound like every door in the city closing at once, one after another, far below.",
      relativeDay: "Aug 1, 2026",
      imageSrc: null,
      isCurrent: false,
      href: "/studio/v2/stories/room-longest",
    },
    ...baseItems,
  ],
});

export const storyRoomStoryListNewChatUnavailableFixture = makeFixture({
  newChat: { ...baseNewChat, disabled: true, title: "New chat, not available yet" },
});

export const storyRoomStoryListNewChatErrorFixture = makeFixture({
  newChat: { ...baseNewChat, errorMessage: "Story could not be started." },
});

export const storyRoomStoryListFilteredFixture = makeFixture({
  query: "harbor",
  items: baseItems.filter((item) => item.roomId === "room-harbor"),
});
