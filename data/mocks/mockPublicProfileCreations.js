const mockPublicProfileCreations = [
  {
    id: "profile-character-1",
    type: "CHARACTER",
    typeLabel: "Character",
    title: "Lux, the First Light",
    subtitle: "Primordial Record",
    description:
      "Before kingdoms, before angels, before humanity, there was Light.",
    imageUrl: null,
    visibility: "PUBLIC",
    status: "APPROVED",
    canonStatus: "ACCEPTED",
    contentRating: "SFW",
    creatorHandle: "Crestfall",
    stats: {
      likes: 64,
      messages: 2200,
      images: 12,
      videos: 0,
    },
    tags: ["canon", "primordial", "light"],
  },
  {
    id: "profile-character-2",
    type: "CHARACTER",
    typeLabel: "Character",
    title: "Lilith of Nod",
    subtitle: "Avatar of Darkness",
    description:
      "A primordial figure tied to Nod, Darkness, exile, and the oldest emotional forces in Crestfall.",
    imageUrl: null,
    visibility: "PUBLIC",
    status: "APPROVED",
    canonStatus: "ACCEPTED",
    contentRating: "MATURE",
    creatorHandle: "Crestfall",
    stats: {
      likes: 48,
      messages: 1800,
      images: 8,
      videos: 0,
    },
    tags: ["canon", "darkness", "nod"],
  },
  {
    id: "profile-scenario-1",
    type: "SCENARIO",
    typeLabel: "Scenario",
    title: "The Systems Are Already Inside You",
    subtitle: "Canon Storyline",
    description:
      "A canon-aware story entry point built around transformation, hidden systems, and Crestfall’s corporate mythology.",
    imageUrl: null,
    visibility: "PUBLIC",
    status: "APPROVED",
    canonStatus: "ACCEPTED",
    contentRating: "SFW",
    creatorHandle: "Crestfall",
    stats: {
      likes: 22,
      messages: 640,
      images: 0,
      videos: 0,
    },
    tags: ["storyline", "canon", "aethelred"],
  },{
  id: "lux-first-light",
  type: "character",
  title: "Lux, The First Light",
  subtitle: "Primordial Record",
  creatorHandle: "Crestfall",
  description:
    "Before kingdoms, before angels, before humanity, there was Light.",
  imageUrl: "/assets/characters/lux/preview-1.png",

  featuredMedia: [
    {
      id: "lux-primary",
      title: "Primary",
      url: "/assets/characters/lux/preview-1.png",
    },
    {
      id: "lux-alt-1",
      title: "Alt 1",
      url: "/assets/characters/lux/preview-2.png",
    },
    {
      id: "lux-alt-2",
      title: "Alt 2",
      url: "/assets/characters/lux/preview-3.png",
    },
    {
      id: "lux-alt-3",
      title: "Alt 3",
      url: "/assets/characters/lux/preview-4.png",
    },
  ],

  tags: ["Canon", "Primordial", "Light"],
  stats: {
    likes: 64,
    comments: "2.2k",
    images: 12,
  },
}
];

export default mockPublicProfileCreations