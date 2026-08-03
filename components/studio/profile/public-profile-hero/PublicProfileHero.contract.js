export const PUBLIC_PROFILE_HERO_VIEW_CONTRACT_VERSION =
  "publicProfileHero.view.v1";

export const PUBLIC_PROFILE_HERO_VIEW_CONTRACT = Object.freeze({
  feature: "PublicProfileHero",
  version: PUBLIC_PROFILE_HERO_VIEW_CONTRACT_VERSION,
  boundary:
    "Portable View receives normalized creator copy, media URLs, stats, and semantic application slots only.",
  viewInputs: Object.freeze([
    "creatorEyebrow",
    "bannerPlaceholderEyebrow",
    "bannerPlaceholderDescription",
    "username",
    "displayName",
    "bannerUrl",
    "bio",
    "stats",
    "avatarSlot",
    "followersLinkSlot",
    "followingLinkSlot",
    "engagementActionsSlot",
  ]),
  applicationOwned: Object.freeze([
    "Next.js profile connection links",
    "ProfileAvatar",
    "follow and bookmark engagement controls",
    "donation workflow",
    "profile sharing workflow",
    "public profile route hydration",
  ]),
  normalizationOwnedByViewModel: Object.freeze([
    "username and display-name fallbacks",
    "avatar and banner field aliases",
    "default banner selection",
    "stat tuple projection",
    "follow-count normalization",
    "connection route construction",
    "public bio fallback",
  ]),
});
