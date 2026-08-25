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

test("Account draft state is compared against a saved profile baseline", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );

  assert.match(viewModel, /savedForm/);
  assert.match(viewModel, /formsMatch/);
  assert.match(viewModel, /hasUnsavedChanges/);
  assert.match(viewModel, /setSavedForm\(nextForm\)/);
});

test("Default PC draft selection no longer mutates persisted account state before save", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );

  const selectStart = viewModel.indexOf(
    "function handleSelectDefaultPlayerCharacter"
  );
  const clearStart = viewModel.indexOf(
    "function handleClearDefaultPlayerCharacter",
    selectStart
  );
  const userStart = viewModel.indexOf("const user = account?.user", clearStart);
  const handlers = viewModel.slice(selectStart, userStart);

  assert.match(handlers, /setDraftDefaultPlayerCharacter/);
  assert.doesNotMatch(handlers, /setAccount\(/);
});

test("Save is gated on dirty state and successful persistence resets the baseline", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );
  const view = read(
    "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
  );

  assert.match(viewModel, /if \(isSaving \|\| !hasUnsavedChanges\) return/);
  assert.match(viewModel, /setSavedForm\(nextForm\)/);
  assert.match(view, /disabled=\{isSaving \|\| !hasUnsavedChanges\}/);
  assert.match(view, /Unsaved changes\. Save profile to persist them\./);
});

test("Unsaved account edits receive a browser unload guard", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );

  assert.match(viewModel, /window\.addEventListener\("beforeunload"/);
  assert.match(viewModel, /window\.removeEventListener\("beforeunload"/);
});

test("Metrics can recover independently from the profile load", () => {
  const viewModel = read(
    "app/studio/v2/account/account-live/useAccountV2LiveViewModel.js"
  );
  const view = read(
    "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
  );

  assert.match(viewModel, /const loadMetrics = useCallback/);
  assert.match(viewModel, /onRetryMetrics: loadMetrics/);
  assert.match(view, /Retry metrics/);
  assert.match(view, /Refreshing account metrics/);
});

test("Account presentation remains transport-free after state hardening", () => {
  const view = read(
    "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /from\s+["\'][^"\']*(studioAccountClient|supabase|postgraphile)|crestfallApiRequest|fetch\(/i
  );
});
