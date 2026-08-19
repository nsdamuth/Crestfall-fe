export const creationImageLibraryLibraryPassOwnerStandardFixture =
  Object.freeze({
    libraryPassState: {
      offerExists: true,
      salesEnabled: true,
      creationIsPublicLive: true,
      isOwner: true,
      currentTier: "STANDARD",
      currentPriceCoins: 250,
      creatorRewardCoins: 25,
      eligibleImageCount: 12,
      publicPreviewCount: 4,
      expandedThreshold: 100,
      includesFutureAdditions: true,
    },
    loadStatus: "ready",
    message: "",
    messageTone: "info",
    actionBusy: false,
  });

export const creationImageLibraryLibraryPassOwnerExpandedFixture =
  Object.freeze({
    libraryPassState: {
      offerExists: true,
      salesEnabled: true,
      creationIsPublicLive: true,
      isOwner: true,
      currentTier: "EXPANDED",
      currentPriceCoins: 1000,
      creatorRewardCoins: 100,
      eligibleImageCount: 127,
      publicPreviewCount: 4,
      expandedThreshold: 100,
      includesFutureAdditions: true,
    },
    loadStatus: "ready",
    message: "",
    messageTone: "info",
    actionBusy: false,
  });

export const creationImageLibraryLibraryPassOwnerPausedFixture =
  Object.freeze({
    ...creationImageLibraryLibraryPassOwnerStandardFixture,
    libraryPassState: {
      ...creationImageLibraryLibraryPassOwnerStandardFixture.libraryPassState,
      salesEnabled: false,
    },
  });

export const creationImageLibraryLibraryPassOwnerNotPublicFixture =
  Object.freeze({
    ...creationImageLibraryLibraryPassOwnerStandardFixture,
    libraryPassState: {
      ...creationImageLibraryLibraryPassOwnerStandardFixture.libraryPassState,
      salesEnabled: false,
      creationIsPublicLive: false,
    },
  });

export const creationImageLibraryLibraryPassOwnerLoadingFixture =
  Object.freeze({
    libraryPassState: null,
    loadStatus: "loading",
    message: "",
    messageTone: "info",
    actionBusy: false,
  });

export const creationImageLibraryLibraryPassOwnerSavingFixture =
  Object.freeze({
    ...creationImageLibraryLibraryPassOwnerStandardFixture,
    actionBusy: true,
  });

export const creationImageLibraryLibraryPassOwnerPausedSuccessFixture =
  Object.freeze({
    ...creationImageLibraryLibraryPassOwnerPausedFixture,
    message:
      "New Library Pass sales paused. Existing purchasers keep access.",
    messageTone: "success",
  });

export const creationImageLibraryLibraryPassOwnerErrorFixture =
  Object.freeze({
    libraryPassState: null,
    loadStatus: "error",
    message:
      "Library Pass settings could not be loaded.",
    messageTone: "error",
    actionBusy: false,
  });

export const creationImageLibraryLibraryPassOwnerNoOfferFixture =
  Object.freeze({
    libraryPassState: {
      offerExists: false,
      salesEnabled: false,
      creationIsPublicLive: true,
      isOwner: true,
      currentTier: "STANDARD",
      currentPriceCoins: 250,
      creatorRewardCoins: 25,
      eligibleImageCount: 4,
      publicPreviewCount: 4,
      expandedThreshold: 100,
      includesFutureAdditions: true,
    },
    loadStatus: "ready",
    message: "",
    messageTone: "info",
    actionBusy: false,
  });
