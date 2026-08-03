export const creationStatusBadgesPrivateDraftFixture = {
  badges: [
    { id: "type", value: "CHARACTER" },
    { id: "visibility", value: "PRIVATE" },
    { id: "status", value: "DRAFT" },
    { id: "content-rating", value: "SFW" },
  ],
  compact: false,
};

export const creationStatusBadgesPublicFixture = {
  badges: [
    { id: "type", value: "LOCATION" },
    { id: "visibility", value: "PUBLIC" },
    { id: "content-rating", value: "SFW" },
  ],
  compact: false,
};

export const creationStatusBadgesCanonFixture = {
  badges: [
    { id: "type", value: "OFFICIAL CHARACTER" },
    { id: "visibility", value: "PUBLIC" },
    { id: "canon-status", value: "CANON" },
    { id: "content-rating", value: "SFW" },
  ],
  compact: false,
};

export const creationStatusBadgesReviewFixture = {
  badges: [
    { id: "type", value: "STORY" },
    { id: "visibility", value: "UNLISTED" },
    { id: "status", value: "IN_REVIEW" },
    { id: "content-rating", value: "MATURE" },
  ],
  compact: false,
};

export const creationStatusBadgesRejectedFixture = {
  badges: [
    { id: "type", value: "IMAGE PRESET" },
    { id: "visibility", value: "PRIVATE" },
    { id: "status", value: "REJECTED" },
    { id: "content-rating", value: "EXPLICIT" },
  ],
  compact: false,
};

export const creationStatusBadgesCustomFixture = {
  badges: [
    { id: "type", value: "CUSTOM MODULE" },
    { id: "visibility", value: "INTERNAL" },
    { id: "status", value: "ARCHIVED" },
    { id: "content-rating", value: "UNRATED" },
  ],
  compact: false,
};

export const creationStatusBadgesCompactFixture = {
  ...creationStatusBadgesReviewFixture,
  compact: true,
};

export const creationStatusBadgesEmptyFixture = {
  badges: [],
  compact: false,
};
