export const creationCreditsMixedFixture = {
  credits: [
    {
      id: "credit-template",
      kindLabel: "Character Template",
      creatorHandle: "@crestfallen_archivist",
      creatorHref: "#creator-archivist",
      assetTitle: "Courtly Intrigue Character Foundation",
    },
    {
      id: "credit-outfit",
      kindLabel: "Outfit",
      creatorHandle: "@golden_thread",
      creatorHref: "#creator-golden-thread",
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

export const creationCreditsLinkedCreatorFixture = {
  credits: [
    {
      id: "credit-linked",
      kindLabel: "Scenario",
      creatorHandle: "@crestfallen_wayfinder",
      creatorHref: "#creator-wayfinder",
      assetTitle: "The Last Lantern at Greywater Crossing",
    },
  ],
};

export const creationCreditsPlainCreatorFixture = {
  credits: [
    {
      id: "credit-plain",
      kindLabel: "Narrator",
      creatorHandle: "@unlisted_narrator",
      creatorHref: null,
      assetTitle: "Measured Gothic Storyteller",
    },
  ],
};

export const creationCreditsNoAssetTitleFixture = {
  credits: [
    {
      id: "credit-no-title",
      kindLabel: "Location Reference",
      creatorHandle: "@map_room",
      creatorHref: "#creator-map-room",
      assetTitle: null,
    },
  ],
};

export const creationCreditsLongContentFixture = {
  credits: [
    {
      id: "credit-long",
      kindLabel:
        "Imported Character Template and Associated Visual Reference Package",
      creatorHandle:
        "@crestfallen_creator_with_an_intentionally_long_public_handle",
      creatorHref: "#creator-long-handle",
      assetTitle:
        "A Deliberately Long Credited Asset Title Used to Stress Responsive Wrapping Inside the Creation Preview Attribution Panel",
    },
  ],
};

export const creationCreditsEmptyFixture = {
  credits: [],
};
