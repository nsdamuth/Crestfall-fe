function createCard({
  id,
  title,
  eyebrow = "",
  description = "Official Crestfall character.",
  imageSrc = "",
  detailsHref,
} = {}) {
  return {
    id,
    imageSrc,
    imageAlt: title,
    title,
    eyebrow,
    description,
    detailsHref: detailsHref || `#${id}`,
  };
}

const defaultCards = [
  createCard({
    id: "aurelia-vale",
    title: "Aurelia Vale",
    eyebrow: "The Gilded Court",
    description:
      "A courtly diplomat balancing loyalty, forbidden knowledge, and a realm on the edge of war.",
  }),
  createCard({
    id: "kael-dorn",
    title: "Kael Dorn",
    eyebrow: "Ashen Vanguard",
    description:
      "A veteran commander whose discipline conceals unresolved debts to an old rebellion.",
  }),
  createCard({
    id: "mira-thorne",
    title: "Mira Thorne",
    eyebrow: "Moonfall Archive",
    description:
      "An archivist who can read memories hidden inside damaged relics and forbidden texts.",
  }),
  createCard({
    id: "vesper-rain",
    title: "Vesper Rain",
    eyebrow: "The Night Roads",
    description:
      "A quick-witted courier navigating rival factions, hidden gates, and dangerous promises.",
  }),
];

export const officialCharactersGridDefaultFixture = {
  query: "",
  resultCount: defaultCards.length,
  totalCount: defaultCards.length,
  cards: defaultCards,
  searchEyebrow: "Character Search",
  searchPlaceholder: "Search name, faction, tag, realm...",
  emptyTitle: "No characters found",
  emptyMessage:
    "Try searching by character name, faction, realm, tag, or theme.",
};

export const officialCharactersGridNoResultsFixture = {
  ...officialCharactersGridDefaultFixture,
  query: "unmatched search",
  resultCount: 0,
  cards: [],
};

export const officialCharactersGridEmptyLibraryFixture = {
  ...officialCharactersGridDefaultFixture,
  resultCount: 0,
  totalCount: 0,
  cards: [],
  emptyTitle: "No official characters available",
  emptyMessage: "Official Crestfall characters will appear here.",
};

export const officialCharactersGridLongContentFixture = {
  ...officialCharactersGridDefaultFixture,
  resultCount: 2,
  totalCount: 2,
  cards: [
    createCard({
      id: "long-character",
      title:
        "A Deliberately Long Official Character Name That Must Wrap Across Multiple Lines",
      eyebrow:
        "An Extremely Long Faction and Realm Classification for Responsive Stress Testing",
      description:
        "This extended character description verifies line clamping, card-height behavior, details-link alignment, and responsive wrapping without changing the underlying official-character card contract.",
    }),
    createCard({
      id: "second-long-character",
      title: "The Last Cartographer of the Shattered Meridian",
      eyebrow: "The Impossible Atlas",
      description:
        "A second long card verifies that neighboring entries remain stable across tablet and desktop grid widths.",
    }),
  ],
};

export const officialCharactersGridPaginationFixture = {
  ...officialCharactersGridDefaultFixture,
  resultCount: 30,
  totalCount: 30,
  cards: Array.from({ length: 30 }, (_, index) =>
    createCard({
      id: `pagination-character-${index + 1}`,
      title: `Official Character ${index + 1}`,
      eyebrow: index % 2 === 0 ? "Golden Realm" : "Moonfall Archive",
      description:
        "Pagination fixture character used to verify the initial twenty-four cards and the Load more behavior.",
    })
  ),
};
