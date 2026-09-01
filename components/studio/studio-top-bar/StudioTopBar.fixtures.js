const baseFixture = Object.freeze({
  searchValue: "",
  searchPlaceholder: "Search characters, stories, and adventures",
  searchAutoFocus: false,
  notifications: [],
  notificationsStatus: "idle",
  notificationsLoadError: "",
  notificationsLabel: "Notifications",
  notificationsView: null,
  themeMode: "dark",
  themeToggleAriaLabel: "Switch to Eggshell theme",
  accountHref: "/studio/account",
  accountAriaLabel: "creator@example.com",
  accountInitial: "C",
});

export const studioTopBarIdleFixture = baseFixture;
export const studioTopBarMobileBarIdleFixture = baseFixture;

export const studioTopBarSearchFocusedFixture = Object.freeze({
  ...baseFixture,
  searchValue: "image studio",
  searchAutoFocus: true,
});

const sampleNotifications = Object.freeze([
  Object.freeze({
    id: "release-1",
    type: "FOLLOWED_CREATOR_PUBLISHED",
    title: "@lyra published “The Hollow Court”.",
    body: "Storyline is now public.",
    supportingLine: "12m ago",
    href: "/studio/creations/11111111-1111-4111-8111-111111111111",
  }),
  Object.freeze({
    id: "coins-1",
    type: "COINS_RECEIVED",
    title: "You received 500 Coins from @patron.",
    body: "For the next chapter.",
    supportingLine: "1h ago",
    href: null,
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
  notificationsStatus: "loaded",
  notificationsView: "compact",
});

export const studioTopBarLoadingPanelOpenFixture = Object.freeze({
  ...baseFixture,
  notificationsStatus: "loading",
  notificationsView: "compact",
});

export const studioTopBarErrorPanelOpenFixture = Object.freeze({
  ...baseFixture,
  notificationsStatus: "error",
  notificationsLoadError: "Notifications could not be loaded.",
  notificationsView: "compact",
});

export const studioTopBarEmptyPanelOpenFixture = Object.freeze({
  ...baseFixture,
  notificationsStatus: "loaded",
  notificationsView: "compact",
});
