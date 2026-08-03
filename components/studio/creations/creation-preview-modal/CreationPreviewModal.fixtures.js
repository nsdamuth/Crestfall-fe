const longDescription = Array.from(
  { length: 8 },
  (_, index) =>
    `Paragraph ${index + 1}: A detailed creation description used to validate truncation, expansion, and preserved line breaks in the portable preview surface.`
).join("\n\n");

export const creationPreviewOwnerFixture = Object.freeze({
  creation: {
    id: "preview-player-character-1",
    type: "PLAYER_CHARACTER",
    title: "Static",
    subtitle: "The Signal-Bearer",
    description: longDescription,
    visibility: "PRIVATE",
    status: "DRAFT",
    contentRating: "SFW",
    canonStatus: "NONE",
    editHref: "/studio/my-creations/preview-player-character-1/edit",
    creatorHandle: "@Crestfall",
    creatorProfileHref: "/studio/profile/crestfall",
    tags: ["Player Character", "Science Fantasy", "Formal"],
    featuredMedia: [
      {
        id: "preview-media-1",
        url: "/assets/covers/crestfall-compass-cover.png",
        title: "Primary portrait",
      },
      {
        id: "preview-media-2",
        imageUrl: "/assets/covers/crestfall-book-cover.png",
        label: "Alternate portrait",
      },
    ],
    stats: {
      likes: 18,
      bookmarks: 7,
      images: 4,
      messages: 32,
    },
    credits: [
      {
        label: "Created by",
        value: "Crestfall",
      },
    ],
  },
  context: "owner",
  liked: true,
  bookmarked: false,
});

export const creationPreviewPublicFixture = Object.freeze({
  creation: {
    id: "preview-character-2",
    type: "CHARACTER",
    title: "Kessa Cindervell",
    subtitle: "The Brasswhisker",
    description:
      "A Bastet Artificer whose workshop is equal parts repair shop, den, vault, and dangerous-object argument.",
    visibility: "PUBLIC",
    status: "APPROVED",
    contentRating: "SFW",
    canonStatus: "CANON",
    creatorHandle: "@Crestfall",
    creatorProfileHref: "/studio/profile/crestfall",
    tags: ["Aethelgard", "Artificer"],
    imageUrl: "/assets/covers/crestfall-camellia-cover.png",
    stats: { likes: 42, bookmarks: 16, images: 8, messages: 103 },
  },
  context: "community",
  liked: false,
  bookmarked: true,
});

export const creationPreviewPickerFixture = Object.freeze({
  creation: {
    id: "preview-location-3",
    type: "LOCATION",
    title: "The Brasswhisker's Workshop",
    description: "A warm, guarded artificer workshop in the Old Crescent.",
    visibility: "PUBLIC",
    status: "APPROVED",
    contentRating: "SFW",
    tags: ["Location", "Workshop"],
    featuredMedia: [],
    imageUrl: "/assets/covers/crestfall-compass-cover.png",
    stats: { likes: 5, bookmarks: 3, images: 1, messages: 0 },
  },
  context: "picker",
});

export const creationPreviewMissingMediaFixture = Object.freeze({
  creation: {
    id: "preview-scenario-4",
    type: "SCENARIO",
    title: "No Media Scenario",
    description: "A fixture for the preview-pending fallback.",
    visibility: "PRIVATE",
    status: "DRAFT",
    contentRating: "SFW",
    tags: [],
    stats: {},
  },
  context: "owner",
});
