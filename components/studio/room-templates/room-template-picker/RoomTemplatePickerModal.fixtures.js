const noop = () => {};

const characterItems = [
  {
    id: "fixture-character-aniyya",
    title: "Aniyya",
    subtitle: "A seer whose calm attention conceals impossible depth.",
    description: "A recurring Crestfall character.",
    type: "CHARACTER",
    imageUrl: "/assets/covers/crestfall-camellia-cover.png",
    contentRating: "SFW",
  },
  {
    id: "fixture-character-dalethia",
    title: "Dalethia",
    subtitle: "An ancient presence moving through the modern city.",
    description: "A recurring Crestfall character.",
    type: "CHARACTER",
    imageUrl: "/assets/covers/crestfall-cloak-cover.png",
    contentRating: "SFW",
  },
  {
    id: "fixture-character-lux",
    title: "Lux",
    subtitle: "A luminous figure with ties to Crestfall's hidden histories.",
    description: "A recurring Crestfall character.",
    type: "CHARACTER",
    imageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    contentRating: "SFW",
  },
];

const baseFixture = {
  eyebrow: "Character Picker",
  title: "Select Characters",
  description:
    "Choose the characters that will actually be included in this Story package.",
  iconName: "characters",
  items: characterItems,
  selectedIds: ["fixture-character-aniyya"],
  recommendedIds: ["fixture-character-dalethia"],
  searchPlaceholder: "Search characters...",
  emptyMessage: "No characters found.",
  onClose: noop,
  onChooseItem: noop,
};

export const roomTemplatePickerCharactersFixture = {
  ...baseFixture,
};

export const roomTemplatePickerScenarioFixture = {
  ...baseFixture,
  eyebrow: "Scenario Picker",
  title: "Select Scenario",
  description:
    "Choose the script/recommendation layer that this Story can use as guidance.",
  iconName: "scenario",
  items: [
    {
      id: "fixture-scenario-wound",
      title: "Whispers Beneath the Wound",
      subtitle:
        "A scenario built around investigation, uncertain alliances, and an escalating supernatural discovery.",
      description: "A reusable Story scenario.",
      type: "SCENARIO",
      imageUrl: "/assets/covers/crestfall-scrolls-cover.png",
      contentRating: "SFW",
    },
    {
      id: "fixture-scenario-gilded",
      title: "The Gilded Cage",
      subtitle:
        "A social-pressure scenario centered on secrets, obligation, and reputation.",
      description: "A reusable Story scenario.",
      type: "SCENARIO",
      imageUrl: "/assets/covers/crestfall-book-cover.png",
      contentRating: "SFW",
    },
  ],
  selectedIds: ["fixture-scenario-wound"],
  recommendedIds: [],
  searchPlaceholder: "Search scenarios...",
  emptyMessage: "No scenarios found.",
};

export const roomTemplatePickerNarratorFixture = {
  ...baseFixture,
  eyebrow: "Narrator Picker",
  title: "Select Narrator",
  description:
    "Choose the reusable prose, pacing, and runtime voice object for this Story.",
  iconName: "narrator",
  items: [
    {
      id: "fixture-narrator-noir",
      title: "Crestfall Noir",
      subtitle:
        "Measured cinematic prose with restrained tension and sensory detail.",
      description: "A reusable narrator profile.",
      type: "NARRATOR",
      imageUrl: "/assets/covers/crestfall-painting-cover.png",
      contentRating: "SFW",
    },
  ],
  selectedIds: [],
  recommendedIds: ["fixture-narrator-noir"],
  searchPlaceholder: "Search narrators...",
  emptyMessage: "No narrators found.",
};

export const roomTemplatePickerLocationFixture = {
  ...baseFixture,
  eyebrow: "Location Picker",
  title: "Select Location",
  description:
    "Choose the optional location or scene anchor for this Story.",
  iconName: "location",
  items: [
    {
      id: "fixture-location-aethelred",
      title: "Aethelred Tower",
      subtitle:
        "A vertical district of old wealth, hidden machinery, and guarded histories.",
      description: "A Crestfall location.",
      type: "LOCATION",
      imageUrl: "/assets/covers/crestfall-statue-cover.png",
      contentRating: "SFW",
    },
    {
      id: "fixture-location-glimmer",
      title: "The Glimmer District",
      subtitle:
        "Neon streets, layered nightlife, and businesses that never quite close.",
      description: "A Crestfall location.",
      type: "LOCATION",
      imageUrl: "/assets/covers/crestfall-compass-cover.png",
      contentRating: "SFW",
    },
  ],
  selectedIds: ["fixture-location-aethelred"],
  recommendedIds: ["fixture-location-glimmer"],
  searchPlaceholder: "Search locations...",
  emptyMessage: "No locations found.",
};

export const roomTemplatePickerEmptyFixture = {
  ...baseFixture,
  items: [],
  selectedIds: [],
  recommendedIds: [],
};

export const roomTemplatePickerLongContentFixture = {
  ...baseFixture,
  eyebrow: "Story Package Character Reference Picker",
  title:
    "Select the Characters Who Will Participate in This Deliberately Long Story Package",
  description:
    "This fixture verifies that the portable modal remains readable when headings, explanations, titles, and summaries are substantially longer than normal without exposing room-template application state to the View.",
  items: [
    {
      id: "fixture-character-long",
      title:
        "The Archivist Who Remembers Every Version of Crestfall Except the One Everyone Else Currently Inhabits",
      subtitle:
        "A deliberately verbose character summary used to stress responsive card layout, wrapping, selection treatment, and search presentation.",
      description: "Long-content fixture character.",
      type: "CHARACTER",
      imageUrl: "/assets/covers/crestfall-drawings-cover.png",
      contentRating: "SFW",
    },
  ],
  selectedIds: [],
  recommendedIds: ["fixture-character-long"],
};

export const roomTemplatePickerFixtureItems = characterItems;
