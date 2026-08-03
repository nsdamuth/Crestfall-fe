const previewCardSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#100d0a" />
        <stop offset="0.5" stop-color="#5b4321" />
        <stop offset="1" stop-color="#15100a" />
      </linearGradient>
    </defs>
    <rect width="720" height="960" fill="url(#g)" />
    <circle cx="360" cy="305" r="150" fill="#d9bd82" opacity="0.82" />
    <path d="M115 960c20-255 125-390 245-390s225 135 245 390" fill="#21170f" />
    <path d="M130 755c85-75 160-112 230-112 92 0 170 42 230 125" fill="none" stroke="#b68c43" stroke-width="20" opacity="0.6" />
  </svg>
`);

const defaultStatusBadges = {
  compact: true,
  badges: [
    { id: "type", value: "CHARACTER" },
    { id: "visibility", value: "PUBLIC" },
    { id: "content-rating", value: "SFW" },
  ],
};

const defaultStatsRow = {
  compact: true,
  items: [
    { id: "likes", value: 128 },
    { id: "messages", value: 42 },
    { id: "images", value: 8 },
  ],
};

export const creationCardOwnerFixture = {
  title: "Kessa Cindervell",
  fallbackInitial: "K",
  imageUrl: `data:image/svg+xml,${previewCardSvg}`,
  priority: false,
  mobileCompact: false,
  isPreviewLoading: false,
  statusBadges: defaultStatusBadges,
  statsRow: defaultStatsRow,
  showLikeAction: true,
  liked: false,
  onToggleLike: null,
  showBookmarkAction: true,
  bookmarked: true,
  onToggleBookmark: null,
  showDefaultPlayerCharacterAction: false,
  isSettingDefaultPlayerCharacter: false,
  onSetDefaultPlayerCharacter: null,
  showStartChatAction: true,
  isStartingChat: false,
  onStartChat: null,
  imageHref: "/studio/image-studio?creation=fixture-character",
  showEditAction: true,
  editHref: "/studio/my-creations/fixture-character/edit",
  showCreatorAttribution: false,
  creatorHandle: "@crestfall",
  creatorHref: "/studio/profile/crestfall",
  subtitle: "The Brasswhisker",
  description:
    "A Bastet artificer whose workshop is equal parts storefront, den, vault, and dangerous argument with enchanted machinery.",
  errorMessage: "",
  statusMessage: "",
  onOpenPreview: null,
};

export const creationCardCommunityFixture = {
  ...creationCardOwnerFixture,
  title: "Mirror Drift",
  showEditAction: false,
  editHref: null,
  showCreatorAttribution: true,
  creatorHandle: "@glasswright",
  creatorHref: "/studio/profile/glasswright",
  subtitle: "Old Crescent Incident",
  description:
    "Reflective glass across several artisan stalls has begun showing movements a few seconds before they occur.",
};

export const creationCardPlayerCharacterFixture = {
  ...creationCardOwnerFixture,
  title: "Mara Vale",
  showDefaultPlayerCharacterAction: true,
  subtitle: "Player Character",
};

export const creationCardMobileFallbackFixture = {
  ...creationCardOwnerFixture,
  title: "Untitled Realm",
  fallbackInitial: "U",
  imageUrl: null,
  mobileCompact: true,
  showLikeAction: false,
  showBookmarkAction: false,
  showStartChatAction: false,
  showEditAction: false,
  editHref: null,
  subtitle: "",
  description: "",
  statsRow: {
    compact: true,
    items: [],
  },
};

export const creationCardBusyFixture = {
  ...creationCardOwnerFixture,
  isPreviewLoading: true,
  isStartingChat: true,
  statusMessage: "Default Player Character set.",
};

export const creationCardErrorFixture = {
  ...creationCardCommunityFixture,
  errorMessage: "Creation preview could not be loaded.",
};
