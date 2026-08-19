export const creationLibraryPassMediaFixture = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `library-pass-media-${index + 1}`,
    imageOutputId: `library-pass-output-${index + 1}`,
    title: `Library Study ${index + 1}`,
    type: "IMAGE",
    imageUrl:
      index % 2 === 0
        ? "/assets/covers/crestfall-camellia-cover.png"
        : "/assets/covers/crestfall-compass-cover.png",
  })
);

export const creationLibraryPassPublicLockedStateFixture = Object.freeze({
  policy: {
    contractVersion: "creation_library_pass_policy_v1",
    publicPreviewCount: 4,
    standardPriceCoins: 250,
    expandedPriceCoins: 1000,
    expandedThreshold: 100,
    creatorRewardBps: 1000,
  },
  creationId: "11111111-1111-4111-8111-111111111111",
  creatorProfileId: "22222222-2222-4222-8222-222222222222",
  offerExists: true,
  salesEnabled: true,
  passRequired: true,
  creationIsPublicLive: true,
  highestTierReached: "STANDARD",
  currentTier: "STANDARD",
  currentPriceCoins: 250,
  creatorRewardBps: 1000,
  creatorRewardCoins: 25,
  coinsRemovedFromCirculation: 225,
  eligibleImageCount: 12,
  publicPreviewCount: 4,
  expandedThreshold: 100,
  includesFutureAdditions: true,
  isOwner: false,
  hasActiveEntitlement: false,
  canViewFullLibrary: false,
  canUseProtectedMedia: false,
  canPurchase: true,
  entitlementId: null,
  entitlementGrantedAt: null,
  purchaseId: null,
  pricePaidCoins: null,
  purchasedAt: null,
});

export const creationLibraryPassEntitledStateFixture = Object.freeze({
  ...creationLibraryPassPublicLockedStateFixture,
  hasActiveEntitlement: true,
  canViewFullLibrary: true,
  canUseProtectedMedia: true,
  canPurchase: false,
  entitlementId: "33333333-3333-4333-8333-333333333333",
  entitlementGrantedAt: "2026-08-17T18:00:00.000Z",
  purchaseId: "44444444-4444-4444-8444-444444444444",
  pricePaidCoins: 250,
  purchasedAt: "2026-08-17T18:00:00.000Z",
});

export const creationLibraryPassOwnerStateFixture = Object.freeze({
  ...creationLibraryPassPublicLockedStateFixture,
  isOwner: true,
  canViewFullLibrary: true,
  canUseProtectedMedia: true,
  canPurchase: false,
});

export const creationLibraryPassSalesPausedStateFixture = Object.freeze({
  ...creationLibraryPassPublicLockedStateFixture,
  salesEnabled: false,
  canPurchase: false,
  offerPausedAt: "2026-08-17T19:00:00.000Z",
});

export const creationLibraryPassExpandedOwnerStateFixture = Object.freeze({
  ...creationLibraryPassOwnerStateFixture,
  highestTierReached: "EXPANDED",
  currentTier: "EXPANDED",
  currentPriceCoins: 1000,
  creatorRewardCoins: 100,
  coinsRemovedFromCirculation: 900,
  eligibleImageCount: 127,
  offerExpandedAt: "2026-08-17T17:30:00.000Z",
});
