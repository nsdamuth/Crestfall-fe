export const publicProfileCreationGridPopulatedFixture = Object.freeze({
  engagementMessage: "",
  hasCreations: true,
  creationLabels: Object.freeze([
    "The Brasswhisker's Workshop",
    "Kessa Cindervell",
    "Old Crescent Side Threads",
  ]),
  emptyTitle: "No public creations yet",
  emptyDescription:
    "Public approved creations from this creator will appear here.",
});

export const publicProfileCreationGridEmptyFixture = Object.freeze({
  engagementMessage: "",
  hasCreations: false,
  creationLabels: Object.freeze([]),
  emptyTitle: "No public creations yet",
  emptyDescription:
    "Public approved creations from this creator will appear here.",
});

export const publicProfileCreationGridErrorFixture = Object.freeze({
  engagementMessage: "Bookmark could not be saved.",
  hasCreations: true,
  creationLabels: Object.freeze(["Kessa Cindervell"]),
  emptyTitle: "No public creations yet",
  emptyDescription:
    "Public approved creations from this creator will appear here.",
});
