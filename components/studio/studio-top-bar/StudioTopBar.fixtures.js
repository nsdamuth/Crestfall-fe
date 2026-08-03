const baseFixture = Object.freeze({
  eyebrow: "Studio",
  description: "Manage creations, images, rooms, and account tools.",
  formattedCoins: "99,550",
  buyCoinsLabel: "Buy Coins",
  notificationsLabel: "Notifications",
  accountHref: "/studio/account",
  accountAriaLabel: "creator@example.com",
  utilityModal: null,
});

export const studioTopBarDefaultFixture = baseFixture;

export const studioTopBarLoadingFixture = Object.freeze({
  ...baseFixture,
  formattedCoins: "...",
});

export const studioTopBarBuyCoinsFixture = Object.freeze({
  ...baseFixture,
  utilityModal: Object.freeze({
    title: "Buy Coins",
    body: "Coin purchases are coming later. For private testing, an admin can manually add coins to your account.",
    dismissLabel: "Got it",
  }),
});

export const studioTopBarNotificationsFixture = Object.freeze({
  ...baseFixture,
  utilityModal: Object.freeze({
    title: "Notifications",
    body: "Notifications are coming later. This will eventually show review updates, system messages, and creator activity.",
    dismissLabel: "Got it",
  }),
});
