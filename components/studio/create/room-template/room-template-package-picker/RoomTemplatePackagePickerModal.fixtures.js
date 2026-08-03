const noop = () => {};

const characterItems = [
  {
    id: "fixture-character-aniyya",
    title: "Aniyya",
    subtitle: "A seer whose calm attention conceals impossible depth.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/covers/crestfall-camellia-cover.png",
  },
  {
    id: "fixture-character-dalethia",
    title: "Dalethia",
    subtitle: "An ancient presence moving through modern Crestfall.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/covers/crestfall-cloak-cover.png",
  },
  {
    id: "fixture-character-lux",
    title: "Lux",
    subtitle: "A luminous figure tied to Crestfall's hidden histories.",
    type: "CHARACTER",
    contentRating: "SFW",
    imageUrl: "/assets/covers/crestfall-ballerina-cover.png",
  },
];

const baseFixture = {
  eyebrow: "Story Picker",
  title: "Select Characters",
  description:
    "Choose from your available Crestfall creations. Scenario recommendations are marked when available, but the room package remains editable.",
  iconName: "characters",
  items: characterItems,
  selectedIds: ["fixture-character-aniyya"],
  recommendedIds: ["fixture-character-dalethia"],
  searchPlaceholder: "Search...",
  emptyMessage: "No characters found.",
  onClose: noop,
  onChooseItem: noop,
};

export const roomTemplatePackagePickerCharactersFixture = {
  ...baseFixture,
};

export const roomTemplatePackagePickerPlayersFixture = {
  ...baseFixture,
  title: "Select Players",
  iconName: "players",
  items: [
    {
      id: "fixture-player-mara",
      title: "crestfallen_mara",
      subtitle: "Mutual follower and collaborative storyteller.",
      type: "PLAYER",
      contentRating: "USER",
      imageUrl: "/assets/covers/crestfall-painting-cover.png",
    },
    {
      id: "fixture-player-eli",
      title: "crestfallen_eli",
      subtitle: "Mutual follower",
      type: "PLAYER",
      contentRating: "USER",
      imageUrl: "/assets/covers/crestfall-drawings-cover.png",
    },
  ],
  selectedIds: ["fixture-player-mara"],
  recommendedIds: [],
  emptyMessage: "No mutual players found.",
};

export const roomTemplatePackagePickerScenarioFixture = {
  ...baseFixture,
  title: "Select Scenario",
  iconName: "scenario",
  items: [
    {
      id: "fixture-scenario-wound",
      title: "Whispers Beneath the Wound",
      subtitle:
        "Investigation, uncertain alliances, and an escalating supernatural discovery.",
      type: "SCENARIO",
      contentRating: "SFW",
      imageUrl: "/assets/covers/crestfall-scrolls-cover.png",
    },
    {
      id: "fixture-scenario-gilded",
      title: "The Gilded Cage",
      subtitle: "Secrets, obligation, and social pressure.",
      type: "SCENARIO",
      contentRating: "SFW",
      imageUrl: "/assets/covers/crestfall-book-cover.png",
    },
  ],
  selectedIds: ["fixture-scenario-wound"],
  recommendedIds: ["fixture-scenario-gilded"],
  emptyMessage: "No scenarios found.",
};

export const roomTemplatePackagePickerEmptyFixture = {
  ...baseFixture,
  items: [],
  selectedIds: [],
  recommendedIds: [],
};

export const roomTemplatePackagePickerNoResultsFixture = {
  ...baseFixture,
  items: [
    {
      id: "fixture-only-result",
      title: "Aethelred Tower",
      subtitle: "The only available location reference.",
      type: "LOCATION",
      contentRating: "SFW",
      imageUrl: "/assets/covers/crestfall-statue-cover.png",
    },
  ],
  title: "Select Location / Scene",
  iconName: "location",
  emptyMessage: "No locations found.",
};

export const roomTemplatePackagePickerLongContentFixture = {
  ...baseFixture,
  title:
    "Select the Characters and Participants for This Deliberately Long Room Package",
  description:
    "This fixture verifies that the portable room-package picker remains readable when its heading, explanation, character title, and summary are substantially longer than normal without exposing raw room-template application state to the View.",
  items: [
    {
      id: "fixture-long-character",
      title:
        "The Archivist Who Remembers Every Version of Crestfall Except the One Everyone Else Currently Inhabits",
      subtitle:
        "A deliberately verbose character summary used to stress responsive card layout, wrapping, selection treatment, recommendation badges, and search presentation.",
      type: "CHARACTER",
      contentRating: "SFW",
      imageUrl: "/assets/covers/crestfall-compass-cover.png",
    },
  ],
  selectedIds: [],
  recommendedIds: ["fixture-long-character"],
};
