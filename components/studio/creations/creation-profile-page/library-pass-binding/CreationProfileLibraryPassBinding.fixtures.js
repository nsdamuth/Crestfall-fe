export const creationProfileLibraryPassMediaFixture = Object.freeze(
  Array.from({ length: 8 }, (_, index) => ({
    id: `profile-media-${index + 1}`,
    imageOutputId: `output-${index + 1}`,
    title: `Workshop Study ${index + 1}`,
    type: "IMAGE",
    imageUrl:
      index % 2 === 0
        ? "/assets/covers/crestfall-camellia-cover.png"
        : "/assets/covers/crestfall-compass-cover.png",
    contentRating: "SFW",
  }))
);

export const creationProfileLibraryPassLockedStateFixture =
  Object.freeze({
    creationIsPublicLive: true,
    offerExists: true,
    salesEnabled: true,
    passRequired: true,
    currentTier: "STANDARD",
    currentPriceCoins: 250,
    eligibleImageCount: 8,
    publicPreviewCount: 4,
    includesFutureAdditions: true,
    isOwner: false,
    hasActiveEntitlement: false,
    canViewFullLibrary: false,
    canUseProtectedMedia: false,
    canPurchase: true,
  });

export const creationProfileLibraryPassEntitledStateFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedStateFixture,
    hasActiveEntitlement: true,
    canViewFullLibrary: true,
    canUseProtectedMedia: true,
    canPurchase: false,
  });

export const creationProfileLibraryPassOwnerStateFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedStateFixture,
    isOwner: true,
    canViewFullLibrary: true,
    canUseProtectedMedia: true,
    canPurchase: false,
  });

export const creationProfileLibraryPassSalesPausedStateFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedStateFixture,
    salesEnabled: false,
    canPurchase: false,
  });

export const creationProfileLibraryPassLockedFixture =
  Object.freeze({
    filteredMedia:
      creationProfileLibraryPassMediaFixture,
    visibleCount: 8,
    libraryPassState:
      creationProfileLibraryPassLockedStateFixture,
    libraryPassLoadStatus: "loaded",
    libraryPassLoadError: "",
    viewerSignedIn: true,
    accountStatus: "loaded",
    coinBalance: 997310,
    purchaseOpen: false,
    purchaseStatus: "idle",
    purchaseMessage: "",
    purchaseMessageTone: "",
    activePreviewId: "profile-media-2",
  });

export const creationProfileLibraryPassPurchaseOpenFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedFixture,
    purchaseOpen: true,
  });

export const creationProfileLibraryPassEntitledFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedFixture,
    libraryPassState:
      creationProfileLibraryPassEntitledStateFixture,
    activePreviewId: "profile-media-8",
  });

export const creationProfileLibraryPassOwnerFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedFixture,
    libraryPassState:
      creationProfileLibraryPassOwnerStateFixture,
  });

export const creationProfileLibraryPassSalesPausedFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedFixture,
    libraryPassState:
      creationProfileLibraryPassSalesPausedStateFixture,
  });

export const creationProfileLibraryPassUnresolvedFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedFixture,
    libraryPassState: null,
    libraryPassLoadStatus: "loading",
    activePreviewId: "",
  });

export const creationProfileLibraryPassLoadErrorFixture =
  Object.freeze({
    ...creationProfileLibraryPassLockedFixture,
    libraryPassState: null,
    libraryPassLoadStatus: "error",
    libraryPassLoadError:
      "Library Pass status request failed.",
    activePreviewId: "",
  });

export const creationProfileLibraryPassInsufficientBalanceFixture =
  Object.freeze({
    ...creationProfileLibraryPassPurchaseOpenFixture,
    coinBalance: 100,
  });
