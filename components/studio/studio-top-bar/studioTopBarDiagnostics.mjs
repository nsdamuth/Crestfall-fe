import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Studio Top Bar Shell stays thin", () => {
  const shell = read("components/studio/StudioTopBar.jsx");
  assert.match(shell, /useStudioTopBarViewModel/);
  assert.match(shell, /StudioTopBarView/);
  assert.match(shell, /accountLinkSlot/);
  assert.match(shell, /next\/link/);
  assert.doesNotMatch(shell, /useStudioAccount/);
  assert.doesNotMatch(shell, /useState/);
  assert.doesNotMatch(shell, /formatCoins|formatStudioCoinBalance/);
});

test("Studio Top Bar View is portable and semantic", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");
  assert.match(view, /formattedCoins/);
  assert.match(view, /onOpenBuyCoins/);
  assert.match(view, /onOpenNotifications/);
  assert.match(view, /utilityModal/);
  assert.match(view, /accountLinkSlot/);
  assert.doesNotMatch(view, /StudioAccountProvider|useStudioAccount/);
  assert.doesNotMatch(view, /useState|useEffect|useMemo/);
  assert.doesNotMatch(view, /next\/link/);
});

test("Studio Top Bar ViewModel owns account and modal state", () => {
  const viewModel = read(
    "components/studio/studio-top-bar/useStudioTopBarViewModel.js"
  );
  assert.match(viewModel, /useStudioAccount/);
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /activeUtility/);
  assert.match(viewModel, /accountStatus === "loading"/);
  assert.match(viewModel, /formatStudioCoinBalance/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Studio Top Bar normalization preserves existing fallback behavior", () => {
  const viewModel = read(
    "components/studio/studio-top-bar/useStudioTopBarViewModel.js"
  );
  assert.match(viewModel, /Number\.parseInt/);
  assert.match(viewModel, /Number\.isFinite/);
  assert.match(viewModel, /return "0"/);
  assert.match(viewModel, /toLocaleString/);
  assert.match(viewModel, /return amount\.toLocaleString/);
  assert.match(viewModel, /"Account"/);
});

test("Studio Top Bar contract and fixtures cover all visible states", () => {
  const contract = read(
    "components/studio/studio-top-bar/StudioTopBar.contract.js"
  );
  const fixtures = read(
    "components/studio/studio-top-bar/StudioTopBar.fixtures.js"
  );
  assert.match(contract, /STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /applicationOwnedDependencies/);
  assert.match(contract, /accountStatusLoadingDisplay/);
  assert.match(fixtures, /studioTopBarDefaultFixture/);
  assert.match(fixtures, /studioTopBarLoadingFixture/);
  assert.match(fixtures, /studioTopBarBuyCoinsFixture/);
  assert.match(fixtures, /studioTopBarNotificationsFixture/);
});

test("Studio Top Bar preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/studio-top-bar/page.jsx");
  const preview = read(
    "app/dev/ui-preview/studio-top-bar/StudioTopBarPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StudioTopBarView/);
  assert.match(preview, /Default/);
  assert.match(preview, /Loading/);
  assert.match(preview, /Buy Coins Modal/);
  assert.match(preview, /Notifications Modal/);
});

test("Studio Shell integration and package documentation remain explicit", () => {
  const studioShell = read("components/studio/StudioShell.jsx");
  const readme = read("components/studio/studio-top-bar/README.md");
  const packageJson = read("package.json");
  assert.equal((studioShell.match(/<StudioTopBar/g) || []).length, 1);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /StudioShell\.jsx/);
  assert.match(readme, /Mobile Studio navigation/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/studio-top-bar/);
  assert.match(packageJson, /diagnostics:loom:studio-top-bar/);
});
