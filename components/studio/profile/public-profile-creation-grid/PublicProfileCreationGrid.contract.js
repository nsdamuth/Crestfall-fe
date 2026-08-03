export const PUBLIC_PROFILE_CREATION_GRID_VIEW_CONTRACT_VERSION =
  "publicProfileCreationGrid.view.v1";

export const PUBLIC_PROFILE_CREATION_GRID_VIEW_CONTRACT = Object.freeze({
  feature: "PublicProfileCreationGrid",
  version: PUBLIC_PROFILE_CREATION_GRID_VIEW_CONTRACT_VERSION,
  boundary:
    "Portable View receives display-ready engagement feedback, empty-state copy, and application-owned Creation Card slots.",
  viewInputs: Object.freeze([
    "engagementMessage",
    "hasCreations",
    "creationSlots",
    "emptyTitle",
    "emptyDescription",
  ]),
  applicationOwned: Object.freeze([
    "CreationCard",
    "useCreationEngagementState",
    "public Creation payloads",
    "like and bookmark persistence",
  ]),
  stateOwnedByViewModel: Object.freeze([
    "creation input normalization",
    "Creation Card model projection",
    "like and bookmark state",
    "engagement feedback",
    "empty-state resolution",
  ]),
});
