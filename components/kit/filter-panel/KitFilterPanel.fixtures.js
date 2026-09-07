import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";

const noop = () => {};

const charactersSection = {
  id: "charactersVisuals",
  label: "Characters & Visual Assets",
  isMultiSelect: true,
  options: [
    { value: "CHARACTER", label: "Character", count: 214 },
    { value: "PLAYER_CHARACTER", label: "Player Character", count: 31 },
    { value: "OUTFIT", label: "Outfit", count: 58 },
    { value: "WARDROBE", label: "Wardrobe", count: 12 },
    { value: "POSE", label: "Pose", count: 40 },
  ],
};

const storiesSection = {
  id: "storiesAdventures",
  label: "Stories & Adventures",
  isMultiSelect: true,
  options: [
    { value: "SCENARIO", label: "Scenario", count: 22 },
    { value: "NARRATOR", label: "Narrator", count: 9 },
    { value: "ROOM_TEMPLATE", label: "Story", count: 88 },
    { value: "STORYLINE", label: "Adventure", count: 12 },
    { value: "LORE", label: "Lore Asset", count: 17 },
  ],
};

const ratingSection = {
  id: "rating",
  label: "Rating",
  isMultiSelect: true,
  options: CONTENT_RATING_TIERS.map((tier) => ({
    value: tier.tier,
    label: tier.label,
    tooltip: tier.tooltip,
    isDisabled: Boolean(tier.isDisabled),
    count: tier.isDisabled ? null : 40,
  })),
};

const tagsSection = {
  id: "tags",
  label: "Tags",
  isMultiSelect: true,
  options: ["romance", "horror", "slow burn", "co-op", "canon-adjacent", "one-shot"].map(
    (tag, index) => ({ value: tag, label: tag, count: (index + 1) * 7 })
  ),
};

const activitySection = {
  id: "activity",
  label: "Activity",
  isMultiSelect: true,
  options: [
    { value: "liked", label: "Liked", count: 9 },
    { value: "saved", label: "Saved", count: 0 },
  ],
};

export const kitFilterPanelDefaultFixture = {
  sections: [activitySection, charactersSection, storiesSection, ratingSection],
  selectedValues: { charactersVisuals: ["CHARACTER"] },
  onToggleOption: noop,
  onClearAll: noop,
  isLoadingCounts: false,
  triggerLabel: "Filter",
  searchPlaceholder: "Search filters",
  ariaLabel: "Filters",
  isDisabled: false,
};

export const kitFilterPanelEmptyFixture = {
  ...kitFilterPanelDefaultFixture,
  sections: [],
  selectedValues: {},
};

export const kitFilterPanelManySectionsFixture = {
  ...kitFilterPanelDefaultFixture,
  sections: [
    activitySection,
    charactersSection,
    storiesSection,
    {
      id: "worldsContinuity",
      label: "Worlds & Continuity",
      isMultiSelect: true,
      options: [
        "Location",
        "NPC Registry",
        "Location Registry",
        "Faction Registry",
        "Organization Registry",
        "Event Registry",
        "Quest Registry",
        "Item Registry",
      ].map((label, index) => ({ value: label.toUpperCase().replace(/ /g, "_"), label, count: index + 2 })),
    },
    {
      id: "rulesMechanics",
      label: "Rules & Mechanics",
      isMultiSelect: true,
      options: ["Stats & Pools Profile", "Progression Profile", "Rulebook"].map((label, index) => ({
        value: label.toUpperCase().replace(/[^A-Z]+/g, "_"),
        label,
        count: index + 1,
      })),
    },
    {
      id: "curation",
      label: "Curation",
      isMultiSelect: true,
      options: [{ value: "canon", label: "Canon", count: 33 }],
    },
    ratingSection,
    {
      id: "visibility",
      label: "Visibility",
      isMultiSelect: true,
      options: [
        { value: "PRIVATE", label: "Private", count: 12 },
        { value: "INTERNAL", label: "Internal", count: 4 },
        { value: "PUBLIC", label: "Public", count: 61 },
        { value: "CANON", label: "Canon", count: 3 },
      ],
    },
    tagsSection,
  ],
  selectedValues: { storiesAdventures: ["ROOM_TEMPLATE", "STORYLINE"], rating: ["EVERYONE"], tags: ["romance"] },
};

export const kitFilterPanelLongestLabelsFixture = {
  ...kitFilterPanelDefaultFixture,
  sections: [
    {
      id: "registry",
      label: "Attached registries and continuity documents",
      isMultiSelect: true,
      options: [
        { value: "faction", label: "Faction Registry Attachments", count: 4 },
        { value: "organization", label: "Organization Registry Attachments", count: 2 },
        { value: "location", label: "Location Registry Attachments", count: 9 },
      ],
    },
  ],
  selectedValues: { registry: ["organization"] },
};

export const kitFilterPanelLoadingCountsFixture = {
  ...kitFilterPanelDefaultFixture,
  isLoadingCounts: true,
};

export const kitFilterPanelDisabledOptionFixture = {
  ...kitFilterPanelDefaultFixture,
  sections: [
    {
      id: "curation",
      label: "Curation",
      isMultiSelect: true,
      options: [
        { value: "canon", label: "Canon", count: 33 },
        { value: "featured", label: "Featured", isDisabled: true },
      ],
    },
  ],
  selectedValues: {},
};

export const kitFilterPanelNoClearAllCallbackFixture = {
  ...kitFilterPanelDefaultFixture,
  onClearAll: null,
};
