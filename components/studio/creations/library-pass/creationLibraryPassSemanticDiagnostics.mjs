import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
  projectCreationLibraryPassMediaAccess,
  projectCreationLibraryPassOwnerPresentation,
  projectCreationLibraryPassPublicPresentation,
} from "./CreationLibraryPass.contract.js";
import {
  creationLibraryPassEntitledStateFixture,
  creationLibraryPassExpandedOwnerStateFixture,
  creationLibraryPassMediaFixture,
  creationLibraryPassOwnerStateFixture,
  creationLibraryPassPublicLockedStateFixture,
  creationLibraryPassSalesPausedStateFixture,
} from "./CreationLibraryPass.fixtures.js";

const lockedMedia = projectCreationLibraryPassMediaAccess({
  media: creationLibraryPassMediaFixture,
  libraryPassState: creationLibraryPassPublicLockedStateFixture,
  loadStatus: "loaded",
});

assert.equal(lockedMedia.length, 8);
assert.deepEqual(
  lockedMedia.map((item) => item.libraryPassAccessState),
  [
    "PUBLIC_PREVIEW",
    "PUBLIC_PREVIEW",
    "PUBLIC_PREVIEW",
    "PUBLIC_PREVIEW",
    "LOCKED",
    "LOCKED",
    "LOCKED",
    "LOCKED",
  ]
);
assert.equal(lockedMedia.filter((item) => item.locked).length, 4);

const entitledMedia = projectCreationLibraryPassMediaAccess({
  media: creationLibraryPassMediaFixture,
  libraryPassState: creationLibraryPassEntitledStateFixture,
  loadStatus: "loaded",
});
assert.equal(
  entitledMedia.every(
    (item) =>
      item.locked === false &&
      item.libraryPassAccessState === "PASS_ACCESS"
  ),
  true
);

const ownerMedia = projectCreationLibraryPassMediaAccess({
  media: creationLibraryPassMediaFixture,
  libraryPassState: creationLibraryPassOwnerStateFixture,
  loadStatus: "loaded",
});
assert.equal(
  ownerMedia.every(
    (item) =>
      item.locked === false &&
      item.libraryPassAccessState === "OWNER_ACCESS"
  ),
  true
);

const publicPresentation = projectCreationLibraryPassPublicPresentation({
  libraryPassState: creationLibraryPassPublicLockedStateFixture,
  loadStatus: "loaded",
  viewerSignedIn: true,
  accountStatus: "loaded",
  coinBalance: 997310,
  purchaseOpen: true,
});

assert.equal(
  publicPresentation.contractVersion,
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION
);
assert.equal(publicPresentation.panel.shouldShow, true);
assert.equal(publicPresentation.panel.statusLabel, "Library Pass");
assert.equal(publicPresentation.panel.actionLabel, "Unlock for 250 coins");
assert.equal(publicPresentation.panel.publicPreviewCount, 4);
assert.equal(publicPresentation.panel.includesFutureAdditions, true);
assert.equal(publicPresentation.modal.priceCoins, 250);
assert.equal(publicPresentation.modal.canConfirm, true);
assert.equal(publicPresentation.modal.unavailableMessage, "");

const insufficientPresentation =
  projectCreationLibraryPassPublicPresentation({
    libraryPassState: creationLibraryPassPublicLockedStateFixture,
    loadStatus: "loaded",
    viewerSignedIn: true,
    accountStatus: "loaded",
    coinBalance: 100,
    purchaseOpen: true,
  });
assert.equal(insufficientPresentation.modal.canConfirm, false);
assert.match(
  insufficientPresentation.modal.unavailableMessage,
  /need 250 coins.*current balance is 100 coins/i
);

const pausedPresentation = projectCreationLibraryPassPublicPresentation({
  libraryPassState: creationLibraryPassSalesPausedStateFixture,
  loadStatus: "loaded",
  viewerSignedIn: true,
  accountStatus: "loaded",
  coinBalance: 997310,
});
assert.equal(pausedPresentation.panel.statusLabel, "Sales Paused");
assert.equal(pausedPresentation.panel.actionLabel, "Sales Paused");
assert.equal(pausedPresentation.modal.canConfirm, false);
assert.match(
  pausedPresentation.modal.unavailableMessage,
  /sales are currently paused/i
);

const ownerPresentation = projectCreationLibraryPassOwnerPresentation({
  libraryPassState: creationLibraryPassExpandedOwnerStateFixture,
  loadStatus: "ready",
});
assert.equal(ownerPresentation.currentTier, "EXPANDED");
assert.equal(ownerPresentation.currentPriceLabel, "1,000 coins");
assert.equal(ownerPresentation.creatorRewardLabel, "100 coins");
assert.equal(ownerPresentation.eligibleImageCount, 127);
assert.equal(ownerPresentation.actionLabel, "Pause New Sales");
assert.equal(ownerPresentation.actionDisabled, false);

const pausedOwnerPresentation = projectCreationLibraryPassOwnerPresentation({
  libraryPassState: {
    ...creationLibraryPassExpandedOwnerStateFixture,
    salesEnabled: false,
  },
  loadStatus: "ready",
});
assert.equal(
  pausedOwnerPresentation.actionLabel,
  "Resume Library Pass Sales"
);

const source = fs.readFileSync(
  new URL("./CreationLibraryPass.contract.js", import.meta.url),
  "utf8"
);
for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "purchaseCreationLibraryPass",
  "setCreationLibraryPassSalesEnabled",
  "useStudioAccount",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic: "creation_library_pass_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
  publicPreviewCount:
    creationLibraryPassPublicLockedStateFixture.publicPreviewCount,
  lockedMediaCount: lockedMedia.filter((item) => item.locked).length,
  standardPriceCoins:
    creationLibraryPassPublicLockedStateFixture.currentPriceCoins,
  expandedPriceCoins:
    creationLibraryPassExpandedOwnerStateFixture.currentPriceCoins,
  creatorRewardBps:
    creationLibraryPassPublicLockedStateFixture.creatorRewardBps,
  purchaseMutationExcluded: true,
  ownerSalesMutationExcluded: true,
}, null, 2));
