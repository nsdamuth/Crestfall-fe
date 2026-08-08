const baseFixture = Object.freeze({
  searchValue: "",
  searchPlaceholder: "Search characters, stories, and adventures",
  searchAutoFocus: false,
  notifications: [],
  notificationsLabel: "Notifications",
  notificationsView: null,
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
    supportingLine: "12m ago",
    group: "today",
  }),
  Object.freeze({
    id: "n-2",
    title: "New comment on your Story \"The Hollow Court\".",
    supportingLine: "1h ago",
    group: "today",
  }),
  Object.freeze({
    id: "n-3",
    title: "Image Studio finished generating 4 portraits.",
    supportingLine: "3h ago",
    group: "today",
  }),
  Object.freeze({
    id: "n-4",
    title: "Weekly creator digest is ready.",
    supportingLine: "1d ago",
    group: "earlier",
  }),
  Object.freeze({
    id: "n-5",
    title: "\"Morning Star\" reached 100 sessions played.",
    supportingLine: "2d ago",
    group: "earlier",
  }),
  Object.freeze({
    id: "n-6",
    title: "A room you follow, \"Ashfall Tavern\", went live.",
    supportingLine: "3d ago",
    group: "earlier",
  }),
]);

export const studioTopBarBellIdleFixture = baseFixture;

export const studioTopBarBellWithNotificationsFixture = Object.freeze({
  ...baseFixture,
  notifications: sampleNotifications,
});

export const studioTopBarCompactPanelOpenFixture = Object.freeze({
  ...baseFixture,
  notifications: sampleNotifications,
  notificationsView: "compact",
});

export const studioTopBarFullCenterOpenFixture = Object.freeze({
  ...baseFixture,
  notifications: sampleNotifications,
  notificationsView: "full",
});

export const studioTopBarEmptyPanelOpenFixture = Object.freeze({
  ...baseFixture,
  notificationsView: "compact",
});
