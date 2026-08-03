const noop = () => {};

export const mediaLightboxFixtureItems = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    imageOutputId: "11111111-1111-4111-8111-111111111111",
    title: "Moonlit Archive",
    imageUrl: "/assets/covers/crestfall-book-cover.png",
    thumbnailUrl: "/assets/covers/crestfall-book-cover.png",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    image_output_id: "22222222-2222-4222-8222-222222222222",
    label: "Compass Chamber",
    displayUrl: "/assets/covers/crestfall-compass-cover.png",
    thumbnail_url: "/assets/covers/crestfall-compass-cover.png",
  },
  {
    id: "local-preview-without-output",
    title: "Preview unavailable",
    imageUrl: null,
  },
];

export const mediaLightboxViewFixture = {
  mediaItems: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      title: "Moonlit Archive",
      imageUrl: "/assets/covers/crestfall-book-cover.png",
      thumbnailUrl: "/assets/covers/crestfall-book-cover.png",
    },
  ],
  activeMedia: {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Moonlit Archive",
    imageUrl: "/assets/covers/crestfall-book-cover.png",
    thumbnailUrl: "/assets/covers/crestfall-book-cover.png",
  },
  activeId: "11111111-1111-4111-8111-111111111111",
  modeLabel: "Preview Fixture",
  imageStudioHref: "/studio/image-studio",
  allowDownload: true,
  showStudioActions: true,
  showDeleteAction: true,
  isLiked: true,
  isBookmarked: false,
  shareMessage: "",
  reportReasonOptions: [
    { value: "sexual_content", label: "Sexual content" },
    { value: "other", label: "Other" },
  ],
  detailsDialog: { open: false },
  reportDialog: { open: false },
  onSelectMedia: noop,
  onClose: noop,
  onLike: noop,
  onBookmark: noop,
  onShare: noop,
  onDelete: noop,
  onOpenDetails: noop,
  onOpenReport: noop,
};
