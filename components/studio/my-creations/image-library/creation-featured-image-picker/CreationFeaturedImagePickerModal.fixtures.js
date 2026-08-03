const noop = () => {};

const fixtureImages = [
  {
    id: "fixture-image-1",
    displayImageUrl: "/assets/covers/crestfall-painting-cover.png",
    altText: "Fixture portrait option one",
    metadataLabel: "SFW · CLEAR",
  },
  {
    id: "fixture-image-2",
    displayImageUrl: "/assets/covers/crestfall-statue-cover.png",
    altText: "Fixture portrait option two",
    metadataLabel: "SFW · APPROVED",
  },
  {
    id: "fixture-image-3",
    displayImageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    altText: "Fixture portrait option three",
    metadataLabel: "MATURE · CLEAR",
  },
  {
    id: "fixture-image-4",
    displayImageUrl: "/assets/covers/crestfall-camellia-cover.png",
    altText: "Fixture portrait option four",
    metadataLabel: "SFW · CLEAR",
  },
];

const baseFixture = {
  slotLabel: "Primary",
  images: fixtureImages,
  isLoading: false,
  loadErrorMessage: "",
  saveMessage: "",
  saveMessageTone: "notice",
  activeImageId: null,
  hasMoreImages: true,
  refreshDisabled: false,
  onClose: noop,
  onRefresh: noop,
  onLoadMore: noop,
  onChooseImage: noop,
};

export const creationFeaturedImagePickerPopulatedFixture = {
  ...baseFixture,
};

export const creationFeaturedImagePickerLoadingFixture = {
  ...baseFixture,
  images: [],
  isLoading: true,
  hasMoreImages: false,
  refreshDisabled: true,
};

export const creationFeaturedImagePickerEmptyFixture = {
  ...baseFixture,
  images: [],
  hasMoreImages: false,
};

export const creationFeaturedImagePickerLoadErrorFixture = {
  ...baseFixture,
  images: [],
  loadErrorMessage: "Image library could not be loaded.",
  hasMoreImages: false,
};

export const creationFeaturedImagePickerSavingFixture = {
  ...baseFixture,
  activeImageId: fixtureImages[1].id,
};

export const creationFeaturedImagePickerSaveErrorFixture = {
  ...baseFixture,
  saveMessage: "Featured image slot could not be saved.",
  saveMessageTone: "error",
  hasMoreImages: false,
};
