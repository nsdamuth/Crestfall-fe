import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("V2 Account route binds live composition instead of fixtures", () => {
  const page = read("app/studio/v2/account/page.jsx");

  assert.match(page, /AccountV2Live/);
  assert.doesNotMatch(page, /AccountV2Mockup/);
});

test("Account binding shell keeps the owned Player Character picker live", () => {
  const shell = read("app/studio/v2/account/AccountV2Live.jsx");

  assert.match(shell, /useAccountV2LiveViewModel/);
  assert.match(shell, /DefaultPlayerCharacterPickerModal/);
  assert.match(shell, /selectedId=/);
  assert.match(shell, /onSelect=/);
});

test("Account ViewModel reuses current client contracts and preserves MVVM", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );

  assert.match(viewModel, /fetchCurrentStudioAccount/);
  assert.match(viewModel, /fetchStudioAccountMetrics/);
  assert.match(viewModel, /updateCurrentStudioAccount/);
  assert.doesNotMatch(viewModel, /supabase|postgraphile/i);
});

test("V2 Account View is transport-free and exposes recovery/save states", () => {
  const view = read(
    "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /from\s+["\'][^"\']*(studioAccountClient|supabase|postgraphile)|crestfallApiRequest|fetch\(/i
  );
  assert.match(view, /Try again/);
  assert.match(view, /Save profile/);
  assert.match(view, /saveErrorMessage/);
  assert.match(view, /statusMessage/);
});

test("content-rating presentation maps V2 tiers to current backend values", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );
  const terminology = read("lib/shared/presentation/terminology.js");

  assert.match(viewModel, /tier\.backendValue/);
  assert.match(terminology, /backendValue: "SFW"/);
  assert.match(terminology, /backendValue: "MATURE"/);
  assert.match(terminology, /backendValue: "EXPLICIT"/);
});

test("V2 Account has one live metrics block and omits the retired Canon tile", () => {
  const view = read(
    "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
  );
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );

  assert.equal((view.match(/label="Stats"/g) || []).length, 1);
  assert.doesNotMatch(viewModel, /label: "Canon"/);
  assert.match(viewModel, /label: "Interactions"/);
  assert.match(viewModel, /label: "Images"/);
});

test("V2 Account activates sign-out while keeping unsupported media and coin purchase honest", () => {
  const view = read(
    "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
  );

  assert.match(view, /href="\/logout"/);
  assert.match(view, /Choose Soon/);
  assert.match(view, /Buy coins soon/);
  assert.doesNotMatch(view, /FixtureActionNotice/);
});
