// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5): default, empty, loading, error, longest
// content, plus muted (item 36 / CR-028: a fixture state showing a
// muted creator, required by the brief). Built directly from
// useCreatorProfileViewModel's output shape rather than re-deriving
// from creatorProfileContent.mock.js, so these exercise the View in
// isolation (preview route) without mounting the hook.
import { CREATOR_PROFILES, CREATOR_PROFILE_LONGEST } from "./creatorProfileContent.mock";

const noop = () => {};

const VERMILLION = CREATOR_PROFILES.vermillion;
const MOONGLASS = CREATOR_PROFILES.moonglass;

function decorateWork(item) {
  return {
    cardKind: "creation",
    assetKind: "character",
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    imageSrc: item.imageSrc,
    badges: item.badges || [],
    stats: item.stats,
    liked: false,
    bookmarked: false,
    onOpenAssetDetail: noop,
    onLike: noop,
    onBookmark: noop,
  };
}

const BOTTOM_BANNER = {
  eyebrow: "Next stop",
  title: "Read the world this creator is writing into.",
  ctaLabel: "Read the lore",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Lilith.png"),
  onCtaClick: noop,
};

const WORKS_LOAD_MORE = { isLoading: false, hasMore: false, remainingCount: null, onLoadMore: noop };

const DONATE_MODAL_CLOSED = {
  recipientDisplayName: VERMILLION.displayName,
  amount: "",
  onAmountChange: noop,
  amountError: "",
  message: "",
  onMessageChange: noop,
  isAnonymous: false,
  onAnonymousChange: noop,
  onSubmit: noop,
  onClose: noop,
};

function baseFixture(record, { mutePlacement = "engagement" } = {}) {
  return {
    displayName: record.displayName,
    handle: record.handle,
    bio: record.bio,
    avatarSrc: record.avatarSrc,
    stats: record.stats,
    engagement: {
      isFollowing: record.isFollowing,
      onFollow: noop,
      isLiked: record.isLiked,
      onLike: noop,
      isBookmarked: record.isBookmarked,
      onBookmark: noop,
      onShare: noop,
      onOpenDonate: noop,
      isMuted: record.isMuted,
      onToggleMute: noop,
    },
    mutePlacement,
    workItems: record.works.map(decorateWork),
    worksEmptyMessage: record.works.length === 0 ? "Nothing published yet." : null,
    worksLoadMore: WORKS_LOAD_MORE,
    activityItems: record.activity,
    activityEmptyMessage: record.activity.length === 0 ? "No activity yet." : null,
    badgeItems: record.badges,
    badgesEmptyMessage: record.badges.length === 0 ? "No badges yet." : null,
    errorMessage: null,
    isLoading: false,
    isDonateModalOpen: false,
    donateModal: { ...DONATE_MODAL_CLOSED, recipientDisplayName: record.displayName },
    bottomBanner: BOTTOM_BANNER,
    notice: null,
    onCloseNotice: noop,
  };
}

// Default: a populated creator, every section has content.
export const creatorProfileDefaultFixture = baseFixture(VERMILLION);

// Empty: a creator with no works, no activity, no badges. Ruled
// empty-state law (matching Adventures/Lore precedent): a message,
// not a fabricated placeholder card, in every section.
export const creatorProfileEmptyFixture = {
  ...creatorProfileDefaultFixture,
  workItems: [],
  worksEmptyMessage: "Nothing published yet.",
  activityItems: [],
  activityEmptyMessage: "No activity yet.",
  badgeItems: [],
  badgesEmptyMessage: "No badges yet.",
};

// Loading: skeleton state, no content rendered.
export const creatorProfileLoadingFixture = {
  ...creatorProfileDefaultFixture,
  isLoading: true,
};

// Error: profile-level load failure, distinct from a section's own
// empty state (docs/PARITY-ECHO-FULL.md Creators row 808-813 note).
export const creatorProfileErrorFixture = {
  ...creatorProfileDefaultFixture,
  errorMessage: "This creator's profile could not be loaded.",
  workItems: [],
  worksEmptyMessage: null,
  activityItems: [],
  activityEmptyMessage: null,
  badgeItems: [],
  badgesEmptyMessage: null,
};

// Muted: item 36 / CR-028, a fixture state showing a muted creator.
export const creatorProfileMutedFixture = {
  ...baseFixture(MOONGLASS),
  engagement: { ...baseFixture(MOONGLASS).engagement, isMuted: true },
};

// Muted, alternate placement: the same muted state with Mute rendered
// standalone under the bio instead of in the engagement row, the
// competing placement for item 36 (AWAITING BRIAN RENDER REVIEW).
export const creatorProfileMutedStandalonePlacementFixture = {
  ...creatorProfileMutedFixture,
  mutePlacement: "standalone",
};

// Large stat values: seven-digit counts on every tile plus the
// longest label (Following), proving the overflow fix (RULED 11 Aug
// 2026) at the widest realistic value length.
export const creatorProfileLargeStatsFixture = {
  ...creatorProfileDefaultFixture,
  stats: { followers: 2480000, following: 1000000, plays: 9999999, works: 1234567 },
};

// Longest content: every section at its fullest, longest bio and
// title strings, donate modal open with its longest states (filled
// fields, anonymous checked).
export const creatorProfileLongestContentFixture = {
  ...baseFixture(CREATOR_PROFILE_LONGEST),
  isDonateModalOpen: true,
  donateModal: {
    ...DONATE_MODAL_CLOSED,
    recipientDisplayName: CREATOR_PROFILE_LONGEST.displayName,
    amount: "25",
    message: "For the Sundered Choir chapters. Keep writing.",
    isAnonymous: true,
  },
};
