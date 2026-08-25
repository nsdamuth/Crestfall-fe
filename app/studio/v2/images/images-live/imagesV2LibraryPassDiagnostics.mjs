import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Creation Image Library keeps V2 presentation while adding Library Pass owner state", () => {
  const view = read(
    "components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx"
  );
  const vm = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
  );

  assert.match(view, /KitModalFrame/);
  assert.match(view, /KitDropdownView/);
  assert.match(view, /LibraryPassOwnerPanel/);
  assert.match(view, /This action cannot be undone/);
  assert.doesNotMatch(view, /\[X\] days/);
  assert.match(vm, /useCreationLibraryPassOwnerViewModel/);
  assert.match(vm, /libraryPassOwner\.panel/);
  assert.match(vm, /libraryPassOwner\.onToggleSales/);
  assert.match(vm, /deleteConfirmImageId/);
  assert.doesNotMatch(vm, /window\.confirm\s*\(/);
});

test("Library Pass client and FE proxies preserve the MVVM boundary", () => {
  const client = read("lib/client/studio/creations/libraryPassClient.js");
  const stateProxy = read("app/api/creations/[id]/library-pass/route.js");
  const purchaseProxy = read(
    "app/api/creations/[id]/library-pass/purchase/route.js"
  );
  const view = read(
    "components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx"
  );

  assert.match(client, /fetchCreationLibraryPassState/);
  assert.match(client, /setCreationLibraryPassSalesEnabled/);
  assert.match(client, /purchaseCreationLibraryPass/);
  assert.match(stateProxy, /crestfallApiRequest/);
  assert.match(stateProxy, /export async function PATCH/);
  assert.match(purchaseProxy, /export async function POST/);
  assert.doesNotMatch(view, /fetch\(|crestfallApiRequest|supabase|postgraphile/i);
});

test("owner controls preserve live policy semantics", () => {
  const owner = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationLibraryPassOwnerViewModel.js"
  );

  assert.match(owner, /creationIsPublicLive/);
  assert.match(owner, /Sales active/);
  assert.match(owner, /Pause New Sales/);
  assert.match(owner, /Existing purchasers keep access/);
  assert.match(owner, /expandedThreshold/);
  assert.match(owner, /creatorRewardCoins/);
});

test("creation library refresh and reassignment reconcile Library Pass state", () => {
  const vm = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
  );

  assert.match(vm, /Promise\.allSettled/);
  assert.match(vm, /libraryPassOwner\.reload\(\)/);
  assert.match(vm, /onReassignItem/);
  assert.match(vm, /setCoinBalanceFromServer/);
  assert.match(vm, /await handleRefresh\(\)/);
});

test("share behavior is current-runtime backed without leaking into the V2 editor shell", () => {
  const shell = read(
    "components/studio/my-creations/image-library/CreationImageLibraryPage.jsx"
  );
  const vm = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
  );
  const editor = read("app/studio/v2/editor/image-library/ImageLibrary.view.jsx");

  assert.match(shell, /CreationShareButton/);
  assert.match(shell, /ShareButtonComponent=\{CreationShareButton\}/);
  assert.match(vm, /isShareable/);
  assert.match(vm, /visibility/);
  assert.doesNotMatch(editor, /libraryPassClient|CreationShareButton|fetch\(/);
});
