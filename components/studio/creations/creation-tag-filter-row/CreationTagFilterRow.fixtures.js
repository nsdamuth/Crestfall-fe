export const creationTagFilterRowDefaultFixture = {
  tags: ["Fantasy", "Adventure", "Mystery", "Romance"],
  activeTag: "ALL",
  label: "Tags",
  allValue: "ALL",
  onTagChange: null,
};

export const creationTagFilterRowActiveFixture = {
  ...creationTagFilterRowDefaultFixture,
  activeTag: "Mystery",
};

export const creationTagFilterRowSingleTagFixture = {
  ...creationTagFilterRowDefaultFixture,
  tags: ["Fantasy"],
  activeTag: "Fantasy",
};

export const creationTagFilterRowCustomLabelsFixture = {
  ...creationTagFilterRowDefaultFixture,
  tags: ["Characters", "Locations", "Stories"],
  activeTag: "EVERYTHING",
  label: "Creation Groups",
  allValue: "EVERYTHING",
};

export const creationTagFilterRowCaseInsensitiveFixture = {
  ...creationTagFilterRowDefaultFixture,
  activeTag: "fantasy",
};

export const creationTagFilterRowLongContentFixture = {
  ...creationTagFilterRowDefaultFixture,
  tags: [
    "Political Intrigue",
    "Ancient Forbidden Knowledge",
    "Character-Driven Slow Burn",
    "Interdimensional Exploration",
    "A Deliberately Long Tag Used to Stress Responsive Wrapping",
  ],
  activeTag: "Character-Driven Slow Burn",
  label: "Long and Descriptive Tags",
};

export const creationTagFilterRowEmptyFixture = {
  ...creationTagFilterRowDefaultFixture,
  tags: [],
  activeTag: "ALL",
};
