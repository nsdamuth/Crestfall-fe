export const creationProfileFixture = {
  id: "creation-profile-preview-1",
  type: "CHARACTER",
  title: "Kessa Cindervell",
  subtitle: "The Brasswhisker",
  description:
    "A Bastet artificer whose workshop is equal parts appraisal counter, den, vault, and dangerous mechanical argument. This deliberately long description demonstrates the existing 420-character catalogue preview behavior without requiring live data. ".repeat(
      3
    ),
  imageUrl: "/assets/covers/crestfall-camellia-cover.png",
  creatorHandle: "@Crestfall",
  creatorProfileHref: "/studio/profile/crestfall",
  visibility: "PUBLIC",
  status: "APPROVED",
  contentRating: "SFW",
  canonStatus: "CANON",
  tags: ["Artificer", "Bastet", "Aethelgard"],
  stats: {
    likes: 148,
    bookmarks: 36,
    messages: 921,
  },
};

export const creationProfileMediaFixture = Array.from(
  { length: 15 },
  (_, index) => ({
    id: `profile-media-${index + 1}`,
    imageOutputId: `output-${index + 1}`,
    title: index === 4 ? "Workshop Motion Study" : `Workshop Study ${index + 1}`,
    type: index === 4 ? "VIDEO" : "IMAGE",
    imageUrl:
      index === 2
        ? null
        : index % 2
          ? "/assets/covers/crestfall-compass-cover.png"
          : "/assets/covers/crestfall-camellia-cover.png",
    contentRating: "SFW",
    createdAt: new Date(Date.UTC(2026, 6, 20 - index)).toISOString(),
    liked: index === 0 || index === 3,
    bookmarked: index === 1,
  })
);

export const creationProfileEmptyMediaFixture = [];

export const creationProfileLoadErrorFixture =
  "Public media request failed in the preview fixture.";
