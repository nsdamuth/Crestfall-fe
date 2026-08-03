export const PUBLIC_PROFILE_TABS_VIEW_CONTRACT_VERSION =
  "publicProfileTabs.view.v1";

export const PUBLIC_PROFILE_TABS_VIEW_CONTRACT = Object.freeze({
  feature: "PublicProfileTabs",
  version: PUBLIC_PROFILE_TABS_VIEW_CONTRACT_VERSION,
  boundary:
    "Portable View receives display-ready tab metadata, a semantic selection callback, and an application-owned content slot.",
  viewInputs: Object.freeze([
    "eyebrow",
    "title",
    "tabs",
    "contentSlot",
    "onSelectTab",
  ]),
  applicationOwned: Object.freeze([
    "PublicProfileCreationGrid",
    "PublicProfileActivityFeed",
    "PublicProfileBadges",
    "profile, creation, donation, badge, and engagement data",
  ]),
  stateOwnedByViewModel: Object.freeze([
    "active tab",
    "legal tab normalization",
    "active heading resolution",
    "display-ready tab projection",
  ]),
});
