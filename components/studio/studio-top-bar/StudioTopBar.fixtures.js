const baseFixture = Object.freeze({
  searchValue: "",
  searchPlaceholder: "Search characters, stories, and adventures",
  searchAutoFocus: false,
  notifications: [],
  notificationsLabel: "Notifications",
  notificationsView: null,
  themeMode: "dark",
  themeToggleAriaLabel: "Switch to Eggshell theme",
  accountHref: "/studio/account",
  accountAriaLabel: "creator@example.com",
  accountInitial: "C",
});

export const studioTopBarIdleFixture = baseFixture;

// Same fixture, named for item 10 of the mobile nav restyle brief
// (8 Aug 2026): the header now renders at every breakpoint, so "idle"
// covers mobile too. Rendered width, not fixture content, is what
// changes between the desktop and mobile checks.
export const studioTopBarMobileBarIdleFixture = baseFixture;

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

// Items 3-4 (notification demo interactions, 8 Aug 2026): the compact
// panel after one row has been dismissed, and the all-cleared empty
// state. The live demo (studioTopBarNotificationsDemoState.js) reaches
// both interactively; these fixtures give the preview harness the same
// two states without needing to click through the demo.
export const studioTopBarPanelAfterDismissFixture = Object.freeze({
  ...baseFixture,
  notifications: sampleNotifications.filter((notification) => notification.id !== "n-1"),
  notificationsView: "compact",
});

export const studioTopBarAllClearedFixture = Object.freeze({
  ...baseFixture,
  notifications: [],
  notificationsView: "compact",
});
