const spaceTypeOptions = [
  { value: "", label: "Not chosen" },
  { value: "INTERIOR", label: "Interior" },
  { value: "EXTERIOR", label: "Exterior" },
  { value: "CITY", label: "City" },
  { value: "WILDERNESS", label: "Wilderness" },
  { value: "RUIN", label: "Ruin" },
  { value: "DREAMLIKE", label: "Dreamlike" },
];

const locationScaleOptions = [
  { value: "", label: "Not chosen" },
  { value: "REALM", label: "Realm / Plane" },
  { value: "PLANET", label: "Planet" },
  { value: "CONTINENT", label: "Continent" },
  { value: "REGION", label: "Region" },
  { value: "KINGDOM", label: "Kingdom / Nation" },
  { value: "CITY", label: "City" },
  { value: "DISTRICT", label: "District" },
  { value: "NEIGHBORHOOD", label: "Neighborhood" },
  { value: "BUILDING", label: "Building" },
  { value: "ROOM", label: "Room" },
  { value: "LANDMARK", label: "Landmark" },
  { value: "WILDERNESS", label: "Wilderness" },
  { value: "DUNGEON", label: "Dungeon" },
  { value: "POCKET_DIMENSION", label: "Pocket Dimension" },
  { value: "OTHER", label: "Other" },
];

const defaultInheritanceItems = [
  { key: "inheritsWeather", label: "Inherit Weather", checked: true },
  { key: "inheritsTime", label: "Inherit Time / Calendar", checked: true },
  {
    key: "inheritsKnowledgeRules",
    label: "Inherit Knowledge Rules",
    checked: true,
  },
  {
    key: "inheritsTravelRules",
    label: "Inherit Travel Rules",
    checked: true,
  },
];

const baseFixture = {
  sectionEyebrow: "Location Editor",
  sectionTitle: "Location Identity",
  sectionDescription:
    "Define what this visual location asset is, how it sits in the world hierarchy, and how it may inherit runtime rules such as weather, time, knowledge, and travel.",
  locationNameLabel: "Location Name",
  locationNameValue: "The Brasswhisker's Workshop",
  locationCategoryLabel: "Location Type / Category",
  locationCategoryValue: "Aethelgard",
  spaceTypeLabel: "Space Type",
  spaceTypeValue: "INTERIOR",
  spaceTypeOptions,
  locationScaleLabel: "Location Scale",
  locationScaleValue: "BUILDING",
  locationScaleOptions,
  parentLocationLabel: "Parent Location",
  parentLocation: {
    id: "10588a5c-3424-4708-800a-d27becf85633",
    title: "Old Crescent Trade District",
    imageUrl: "/images/placeholder-card.jpg",
    scale: "DISTRICT",
    spaceType: "CITY",
  },
  parentImageFallbackUrl: "/images/placeholder-card.jpg",
  selectedParentFallbackTitle: "Selected Parent Location",
  noParentTitle: "No parent location selected",
  noParentDescription:
    "Choose a broader parent location such as realm, city, district, or building. This controls inherited runtime context.",
  selectParentLabel: "Select Parent",
  changeParentLabel: "Change Parent",
  clearParentLabel: "Clear",
  intendedUseLabel: "Intended Use",
  intendedUseValue: "Workshop, appraisal, and enchanted-object scenes",
  tagsLabel: "Tags",
  tagsValue: "workshop, artificer, trade district",
  creationTypeLabel: "Creation Type",
  creationTypeValue: "LOCATION",
  inheritanceEyebrow: "Inheritance",
  inheritanceDescription:
    "These settings control whether this location inherits runtime context from parent locations. They do not change image generation directly.",
  inheritanceItems: defaultInheritanceItems,
  onChangeLocationName: null,
  onChangeLocationCategory: null,
  onChangeSpaceType: null,
  onChangeLocationScale: null,
  onOpenParentPicker: null,
  onClearParentLocation: null,
  onChangeIntendedUse: null,
  onChangeTags: null,
  onChangeInheritance: null,
};

export const locationIdentitySelectedParentFixture = {
  ...baseFixture,
};

export const locationIdentityNoParentFixture = {
  ...baseFixture,
  locationNameValue: "The Prism-Weave of Aethelgard",
  locationCategoryValue: "Realm",
  spaceTypeValue: "DREAMLIKE",
  locationScaleValue: "REALM",
  parentLocation: {
    id: "",
    title: "",
    imageUrl: "",
    scale: "",
    spaceType: "",
  },
  intendedUseValue: "World-level location and inheritance root",
  tagsValue: "realm, planar, world root",
};

export const locationIdentityInheritanceOverrideFixture = {
  ...baseFixture,
  parentLocation: {
    ...baseFixture.parentLocation,
    imageUrl: "",
  },
  inheritanceItems: [
    { key: "inheritsWeather", label: "Inherit Weather", checked: false },
    { key: "inheritsTime", label: "Inherit Time / Calendar", checked: true },
    {
      key: "inheritsKnowledgeRules",
      label: "Inherit Knowledge Rules",
      checked: false,
    },
    {
      key: "inheritsTravelRules",
      label: "Inherit Travel Rules",
      checked: true,
    },
  ],
};

export const locationIdentityFallbackFixture = {
  ...baseFixture,
  locationNameValue: "",
  locationCategoryValue: "",
  spaceTypeValue: "",
  locationScaleValue: "",
  parentLocation: {
    id: "legacy-parent-id",
    title: "",
    imageUrl: "",
    scale: "",
    spaceType: "",
  },
  intendedUseValue: "",
  tagsValue: "",
  creationTypeValue: "",
};
