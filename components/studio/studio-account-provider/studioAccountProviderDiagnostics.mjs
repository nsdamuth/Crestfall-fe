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

test("Studio Account Provider shell stays thin and preserves the public context API", () => {
  const shell = read("components/studio/StudioAccountProvider.jsx");
  assert.match(shell, /createContext/);
  assert.match(shell, /useContext/);
  assert.match(shell, /useStudioAccountProviderViewModel/);
  assert.match(shell, /export function StudioAccountProvider/);
  assert.match(shell, /export function useStudioAccount/);
  assert.match(shell, /loadAccount/);
  assert.doesNotMatch(shell, /useState|useEffect|useMemo|useCallback/);
  assert.doesNotMatch(shell, /fetchCurrentStudioAccount|studioAccountClient/);
  assert.doesNotMatch(shell, /normalizeCoinBalance|getSnapshotProfile/);
});

test("Studio Account Provider ViewModel owns account loading and state orchestration", () => {
  const viewModel = read(
    "components/studio/studio-account-provider/useStudioAccountProviderViewModel.js"
  );
  assert.match(viewModel, /fetchCurrentStudioAccount/);
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /useEffect/);
  assert.match(viewModel, /useCallback/);
  assert.match(viewModel, /useMemo/);
  assert.match(viewModel, /refreshAccount/);
  assert.match(viewModel, /mergeAccountSnapshot/);
  assert.match(viewModel, /setCoinBalanceFromServer/);
  assert.doesNotMatch(viewModel, /<StudioAccountContext|<\w+/);
});

test("Studio Account Provider preserves balance and snapshot normalization", () => {
  const viewModel = read(
    "components/studio/studio-account-provider/useStudioAccountProviderViewModel.js"
  );
  assert.match(viewModel, /Number\.parseInt/);
  assert.match(viewModel, /Math\.max\(0, balance\)/);
  assert.match(viewModel, /snapshot\?\.coinBalance/);
  assert.match(viewModel, /snapshot\?\.coin_balance/);
  assert.match(viewModel, /profile\.coinBalance/);
  assert.match(viewModel, /profile\.coin_balance/);
  assert.match(viewModel, /coin_balance: normalizedBalance/);
  assert.match(viewModel, /coinBalance: normalizedBalance/);
  assert.match(viewModel, /if \(normalizedBalance === null\) return false/);
});

test("Studio Account Provider preserves loading, success, and error behavior", () => {
  const viewModel = read(
    "components/studio/studio-account-provider/useStudioAccountProviderViewModel.js"
  );
  assert.match(viewModel, /useState\(null\)/);
  assert.match(viewModel, /useState\(0\)/);
  assert.match(viewModel, /useState\("idle"\)/);
  assert.match(viewModel, /setAccountStatus\("loading"\)/);
  assert.match(viewModel, /setAccountStatus\("loaded"\)/);
  assert.match(viewModel, /setAccountStatus\("error"\)/);
  assert.match(viewModel, /Studio account could not be loaded\./);
  assert.match(viewModel, /refreshAccount\(\)\.catch\(\(\) => \{\}\)/);
  assert.match(viewModel, /throw error/);
});

test("Studio Account Provider contract and fixtures document the context boundary", () => {
  const contract = read(
    "components/studio/studio-account-provider/StudioAccountProvider.contract.js"
  );
  const fixtures = read(
    "components/studio/studio-account-provider/StudioAccountProvider.fixtures.js"
  );
  assert.match(contract, /STUDIO_ACCOUNT_PROVIDER_CONTRACT_VERSION/);
  assert.match(contract, /accountProfile/);
  assert.match(contract, /coinBalance/);
  assert.match(contract, /refreshAccount/);
  assert.match(contract, /autoRefreshOnMount: true/);
  assert.match(contract, /negativeBalancesClampToZero: true/);
  assert.match(contract, /studioAccountClient/);
  assert.match(fixtures, /studioAccountLoadedFixture/);
  assert.match(fixtures, /studioAccountMergeFixture/);
  assert.match(fixtures, /studioAccountErrorFixture/);
  assert.match(fixtures, /creator@example\.com/);
});

test("Studio Account Provider preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/studio-account-provider/page.jsx");
  const preview = read(
    "app/dev/ui-preview/studio-account-provider/StudioAccountProviderPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StudioAccountProvider/);
  assert.match(preview, /useStudioAccount/);
  assert.match(preview, /loadAccount=\{loadAccount\}/);
  assert.match(preview, /studioAccountLoadedFixture/);
  assert.match(preview, /studioAccountMergeFixture/);
  assert.match(preview, /studioAccountErrorFixture/);
  assert.match(preview, /Refresh fixture/);
  assert.match(preview, /Merge snapshot/);
  assert.match(preview, /Apply server balance/);
});

test("Studio Shell integration, documentation, and diagnostic command remain explicit", () => {
  const studioShell = read("components/studio/StudioShell.jsx");
  const readme = read("components/studio/studio-account-provider/README.md");
  const packageJson = read("package.json");
  assert.equal((studioShell.match(/<StudioAccountProvider/g) || []).length, 1);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /StudioTopBar/);
  assert.match(readme, /StudioEconomyWidget/);
  assert.match(readme, /Image Studio/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/studio-account-provider/);
  assert.match(packageJson, /diagnostics:loom:studio-account-provider/);
});
