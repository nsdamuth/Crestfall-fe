const noop = () => {};

const fixtureImages = [
  {
    id: "fixture-reference-1",
    displayImageUrl: "/assets/covers/crestfall-painting-cover.png",
    altText: "Fixture anime visual reference",
    metadataLabel: "SFW · CLEAR",
  },
  {
    id: "fixture-reference-2",
    displayImageUrl: "/assets/covers/crestfall-statue-cover.png",
    altText: "Fixture realistic visual reference",
    metadataLabel: "SFW · APPROVED",
  },
  {
    id: "fixture-reference-3",
    displayImageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    altText: "Fixture portrait visual reference",
    metadataLabel: "MATURE · CLEAR",
  },
  {
    id: "fixture-reference-4",
    displayImageUrl: "/assets/covers/crestfall-camellia-cover.png",
    altText: "Fixture fantasy visual reference",
    metadataLabel: "SFW · CLEAR",
  },
];

const baseFixture = {
  referenceLabel: "Anime Reference Image",
  images: fixtureImages,
  isLoading: false,
  loadErrorMessage: "",
  hasMoreImages: true,
  refreshDisabled: false,
  onClose: noop,
  onRefresh: noop,
  onLoadMore: noop,
  onChooseImage: noop,
};

export const creationReferenceImagePickerPopulatedFixture = {
  ...baseFixture,
};

export const creationReferenceImagePickerLoadingFixture = {
  ...baseFixture,
  images: [],
  isLoading: true,
  hasMoreImages: false,
  refreshDisabled: true,
};

export const creationReferenceImagePickerEmptyFixture = {
  ...baseFixture,
  images: [],
  hasMoreImages: false,
};

export const creationReferenceImagePickerLoadErrorFixture = {
  ...baseFixture,
  images: [],
  loadErrorMessage: "Image library could not be loaded.",
  hasMoreImages: false,
};

export const creationReferenceImagePickerUnavailablePreviewFixture = {
  ...baseFixture,
  images: [
    {
      id: "fixture-reference-unavailable",
      displayImageUrl: "",
      altText: "Reference preview unavailable",
      metadataLabel: "SFW · CLEAR",
    },
    ...fixtureImages.slice(0, 2),
  ],
  hasMoreImages: false,
};

export const creationReferenceImagePickerLongLabelFixture = {
  ...baseFixture,
  referenceLabel:
    "Alternate Realistic-Fantasy Continuity Reference Portrait",
  hasMoreImages: false,
};
