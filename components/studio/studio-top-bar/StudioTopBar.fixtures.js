const baseFixture = Object.freeze({
  searchValue: "",
  searchPlaceholder: "Search tools and builders",
  searchAutoFocus: false,
  notifications: [],
  notificationsLabel: "Notifications",
  initialNotificationsOpen: false,
  accountHref: "/studio/account",
  accountAriaLabel: "creator@example.com",
});

export const studioTopBarIdleFixture = baseFixture;

export const studioTopBarSearchFocusedFixture = Object.freeze({
  ...baseFixture,
  searchValue: "image studio",
  searchAutoFocus: true,
});

const sampleNotifications = Object.freeze([
  Object.freeze({
    id: "n-1",
    title: "Your character \"Lysandra\" passed review and is now public.",
    timeAgo: "12m ago",
  }),
  Object.freeze({
    id: "n-2",
    title: "New comment on your Story \"The Hollow Court\".",
    timeAgo: "1h ago",
  }),
  Object.freeze({
    id: "n-3",
    title: "Image Studio finished generating 4 portraits.",
    timeAgo: "3h ago",
  }),
  Object.freeze({
    id: "n-4",
    title: "Weekly creator digest is ready.",
    timeAgo: "1d ago",
  }),
  Object.freeze({
    id: "n-5",
    title: "\"Morning Star\" reached 100 sessions played.",
    timeAgo: "2d ago",
  }),
  Object.freeze({
    id: "n-6",
    title: "A room you follow, \"Ashfall Tavern\", went live.",
    timeAgo: "3d ago",
  }),
]);

export const studioTopBarNotificationsOpenFixture = Object.freeze({
  ...baseFixture,
  notifications: sampleNotifications,
  initialNotificationsOpen: true,
});

export const studioTopBarNotificationsEmptyOpenFixture = Object.freeze({
  ...baseFixture,
  initialNotificationsOpen: true,
});
