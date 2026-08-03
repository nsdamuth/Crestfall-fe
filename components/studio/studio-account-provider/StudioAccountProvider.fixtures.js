export const studioAccountLoadedFixture = Object.freeze({
  user: Object.freeze({
    id: "user-preview-001",
    email: "creator@example.com",
  }),
  profile: Object.freeze({
    id: "user-preview-001",
    username: "preview_creator",
    display_name: "Preview Creator",
    coin_balance: 12500,
  }),
  coinBalance: 12500,
});

export const studioAccountMergeFixture = Object.freeze({
  profile: Object.freeze({
    display_name: "Updated Preview Creator",
    announcement: "Fixture-driven account merge.",
  }),
  coin_balance: 18750,
});

export const studioAccountErrorFixture = Object.freeze({
  message: "Fixture account request failed.",
});
