export const creationStatsRowCompleteFixture = {
  items: [
    { id: "likes", value: 248 },
    { id: "messages", value: 1840 },
    { id: "images", value: 36 },
    { id: "videos", value: 4 },
  ],
  compact: false,
};

export const creationStatsRowCompactFixture = {
  ...creationStatsRowCompleteFixture,
  compact: true,
};

export const creationStatsRowLikesOnlyFixture = {
  items: [{ id: "likes", value: 27 }],
  compact: false,
};

export const creationStatsRowMediaFixture = {
  items: [
    { id: "images", value: 128 },
    { id: "videos", value: 12 },
  ],
  compact: false,
};

export const creationStatsRowLargeNumbersFixture = {
  items: [
    { id: "likes", value: 2500000 },
    { id: "messages", value: 987654 },
    { id: "images", value: 1000 },
    { id: "videos", value: 999 },
  ],
  compact: false,
};

export const creationStatsRowFractionalFixture = {
  items: [
    { id: "likes", value: 12.5 },
    { id: "messages", value: 1000.4 },
  ],
  compact: false,
};

export const creationStatsRowEmptyFixture = {
  items: [],
  compact: false,
};
