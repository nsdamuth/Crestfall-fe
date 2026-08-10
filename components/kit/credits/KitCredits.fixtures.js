export const kitCreditsMixedFixture = {
  credits: [
    {
      id: "credit-template",
      kindLabel: "Character Template",
      creatorHandle: "@crestfallen_archivist",
      creatorHref: "/studio/profile/crestfallen_archivist",
      assetTitle: "Courtly Intrigue Character Foundation",
    },
    {
      id: "credit-outfit",
      kindLabel: "Outfit",
      creatorHandle: "@golden_thread",
      creatorHref: "/studio/profile/golden_thread",
      assetTitle: "Midnight Diplomat Formalwear",
    },
    {
      id: "credit-pose",
      kindLabel: "Pose",
      creatorHandle: "@anonymous_contributor",
      creatorHref: null,
      assetTitle: null,
    },
  ],
};

export const kitCreditsAllLinkedFixture = {
  credits: [
    {
      id: "credit-linked-1",
      kindLabel: "Scenario",
      creatorHandle: "@crestfallen_wayfinder",
      creatorHref: "/studio/profile/crestfallen_wayfinder",
      assetTitle: "The Last Lantern at Greywater Crossing",
    },
    {
      id: "credit-linked-2",
      kindLabel: "Location",
      creatorHandle: "@map_room",
      creatorHref: "/studio/profile/map_room",
      assetTitle: null,
    },
  ],
};

export const kitCreditsUnlinkedHandleFixture = {
  credits: [
    {
      id: "credit-unlinked",
      kindLabel: "Narrator",
      creatorHandle: "@unlisted_narrator",
      creatorHref: null,
      assetTitle: "Measured Gothic Storyteller",
    },
  ],
};

export const kitCreditsNoAssetTitleFixture = {
  credits: [
    {
      id: "credit-no-title",
      kindLabel: "Location Reference",
      creatorHandle: "@map_room",
      creatorHref: "/studio/profile/map_room",
      assetTitle: null,
    },
  ],
};

export const kitCreditsLongestContentFixture = {
  credits: [
    {
      id: "credit-long",
      kindLabel:
        "Imported Character Template and Associated Visual Reference Package",
      creatorHandle:
        "@crestfallen_creator_with_an_intentionally_long_public_handle",
      creatorHref: "/studio/profile/crestfallen_creator_with_an_intentionally_long_public_handle",
      assetTitle:
        "A Deliberately Long Credited Asset Title Used to Stress Responsive Wrapping Inside the Attribution Panel",
    },
  ],
};

export const kitCreditsEmptyFixture = {
  credits: [],
};
