import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("public preview proxy forwards optional viewer identity to services", () => {
  const route = read("app/api/creations/[id]/preview/route.js");

  assert.match(route, /getOptionalAuthenticatedUser/);
  assert.match(route, /getAuthenticatedUser/);
  assert.match(route, /"x-crestfall-user-id": user\.id/);
  assert.match(route, /\/v1\/creations\/\$\{encodeURIComponent\([\s\S]*?\)\}\/preview/);
});

test("public media proxy preserves creation-library access context", () => {
  const route = read("app/api/media/images/[imageOutputId]/file/route.js");

  assert.match(route, /searchParams\.get\([\s\S]*?"creationId"/);
  assert.match(route, /serviceUrl\.searchParams\.set\([\s\S]*?"creationId"[\s\S]*?creationId/);
  assert.match(route, /"x-crestfall-creation-id"/);
  assert.match(route, /"x-crestfall-image-variant"/);
  assert.match(route, /requestedVariant === "lockedPreview"/);
  assert.match(route, /"x-crestfall-user-id"/);
});

test("server page data carries backend Library Pass state into the profile", () => {
  const loader = read("lib/server/studio/getPublicCreationProfilePageData.js");
  const page = read("app/studio/creations/[id]/page.js");

  assert.match(loader, /libraryPass:\s*preview\.libraryPass \|\| null/);
  assert.match(page, /libraryPass=\{pageData\.libraryPass\}/);
});

test("locked profile media uses only the destructive locked preview", () => {
  const vm = read(
    "components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"
  );

  assert.match(vm, /accessState === "LOCKED"/);
  assert.match(vm, /imageUrl: isLocked \? lockedPreviewUrl : displayUrl/);
  assert.match(vm, /const displayUrl = isLocked[\s\S]*?\? null/);
  assert.match(vm, /const cardUrl = isLocked[\s\S]*?\? null/);
  assert.match(vm, /const thumbnailUrl = isLocked[\s\S]*?\? null/);
  assert.match(vm, /\.filter\(\(item\) => !item\.isLocked\)/);
});

test("Library Pass purchase remains client-bound and refreshes server-projected media", () => {
  const vm = read(
    "components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"
  );
  const shell = read("components/studio/creations/CreationProfilePage.jsx");

  assert.match(vm, /createLibraryPassPurchaseIdempotencyKey/);
  assert.match(vm, /purchaseCreationLibraryPass\(/);
  assert.match(vm, /refreshPage\?\.\(\)/);
  assert.match(shell, /refreshPage: \(\) => router\.refresh\(\)/);
  assert.match(shell, /\.filter\(\(item\) => !item\.isLocked\)/);
});

test("portable view renders lockedPreview without CSS blur or clear-media actions", () => {
  const view = read(
    "components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx"
  );

  assert.match(view, /item\.isLocked/);
  assert.match(view, /src=\{item\.lockedPreviewUrl\}/);
  assert.match(view, /Library Pass required/);
  assert.match(view, /Unlock full image/);
  assert.doesNotMatch(view, /blur\(|filter:\s*blur|backdrop-blur.*item\.lockedPreviewUrl/);
});

test("viewer panel surfaces pass price, preview count, protected count, and future additions", () => {
  const vm = read(
    "components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"
  );
  const view = read(
    "components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx"
  );

  assert.match(vm, /projectCreationProfileLibraryPassPanel/);
  assert.match(vm, /protectedImageCount/);
  assert.match(vm, /currentPriceLabel/);
  assert.match(vm, /includesFutureAdditions/);
  assert.match(view, /Extended Image Library/);
  assert.match(view, /panel\.publicPreviewCount/);
  assert.match(view, /panel\.protectedImageCount/);
  assert.match(view, /panel\.actionLabel/);
});
