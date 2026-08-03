const creationSeeds = [
  {
    type: "CHARACTER",
    title: "Kessa Cindervell",
    description: "A Bastet artificer and public community character.",
    creatorHandle: "@crestfall",
    tags: ["Aethelred", "Mystery"],
    contentRating: "SFW",
    renderingStyle: "ANIME",
    canonStatus: "ACCEPTED",
    featured: true,
    recentlyUpdated: true,
    stats: { likes: 48, messages: 122 },
  },
  {
    type: "LOCATION",
    title: "The Brasswhisker's Workshop",
    description: "A warm, guarded workshop in the trade district.",
    creatorHandle: "@crestfall",
    tags: ["Aethelred", "Sandbox"],
    contentRating: "SFW",
    renderingStyle: "EITHER",
    canonStatus: "OFFICIAL",
    featured: false,
    recentlyUpdated: true,
    stats: { likes: 31, messages: 80 },
  },
  {
    type: "SCENARIO",
    title: "The Ticking Charm",
    description: "A mystery involving a silver charm and a difficult appraisal.",
    creatorHandle: "@community-author",
    tags: ["Mystery", "Dark Fantasy"],
    contentRating: "SFW",
    renderingStyle: "REALISTIC",
    canonStatus: "NONE",
    featured: false,
    recentlyUpdated: false,
    stats: { likes: 19, messages: 63 },
  },
];

export const communityHubFixture = Object.freeze({
  creations: Array.from({ length: 15 }, (_, index) => ({
    id: `community-creation-${index + 1}`,
    ...creationSeeds[index % creationSeeds.length],
    title:
      index < creationSeeds.length
        ? creationSeeds[index].title
        : `${creationSeeds[index % creationSeeds.length].title} ${index + 1}`,
    createdAt: `2026-07-${String((index % 20) + 1).padStart(2, "0")}T12:00:00Z`,
    updatedAt: `2026-07-${String((index % 20) + 2).padStart(2, "0")}T12:00:00Z`,
  })),
  creators: Array.from({ length: 14 }, (_, index) => ({
    id: `community-creator-${index + 1}`,
    displayName: index % 2 ? `Creator ${index + 1}` : `Canon Author ${index + 1}`,
    handle: `@creator${index + 1}`,
    tagline: index % 2 ? "World builder" : "Canon contributor",
    description: "Creates public characters, locations, and story experiences.",
    featured: index === 0 || index === 3,
    recentlyActive: index % 3 === 0,
    canonContributor: index % 2 === 0,
  })),
});

export const communityHubEmptyFixture = Object.freeze({
  creations: [],
  creators: [],
});
