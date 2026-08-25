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

test("Studio Top Bar View is portable, semantic, and owns no state", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");
  assert.match(view, /searchValue/);
  assert.match(view, /onSearchChange/);
  assert.match(view, /notifications/);
  assert.match(view, /notificationsView/);
  assert.match(view, /bellRef/);
  assert.match(view, /onOpenNotificationCenter/);
  assert.match(view, /accountLinkSlot/);
  assert.match(view, /from "@\/components\/kit\/KitModalFrame"/);
  assert.doesNotMatch(view, /StudioAccountProvider|useStudioAccount/);
  assert.doesNotMatch(view, /useState|useEffect/);
  assert.doesNotMatch(view, /next\/link/);
  assert.doesNotMatch(view, /formattedCoins|onOpenBuyCoins|utilityModal/);
});

test("Studio Top Bar View has no card chrome and frosts with the chrome token, not a literal", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");
  const headerOpenTag = view.match(/<header className="([^"]+)"/);
  assert.ok(headerOpenTag, "expected a <header> element with a className");
  const headerClasses = headerOpenTag[1].split(/\s+/);
  assert.ok(
    headerClasses.includes("border-b"),
    "expected the chrome bar to keep the proof's flush bottom-only border"
  );
  assert.ok(
    !headerClasses.some(
      (c) => /^rounded-|^shadow-/.test(c) || c === "border" || /^border-[tlr]$/.test(c)
    ),
    "expected no radius, shadow, or non-bottom border on the chrome bar"
  );
  assert.match(view, /backdrop-blur-\[var\(--blur-chrome\)\]/);
  assert.doesNotMatch(view, /backdrop-blur-\[(?!var\(--blur-chrome\))/);
  assert.match(view, /color-mix\(in_srgb,var\(--canvas\)_88%,transparent\)/);
});

test("Studio Top Bar ViewModel owns search and panel state", () => {
  const viewModel = read(
    "components/studio/studio-top-bar/useStudioTopBarViewModel.js"
  );
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /useRef/);
  assert.match(viewModel, /searchValue/);
  assert.match(viewModel, /notificationsView/);
  assert.match(viewModel, /bellRef/);
  assert.match(viewModel, /getStudioTopBarAccountLabel/);
  assert.doesNotMatch(viewModel, /useStudioAccount/);
  assert.doesNotMatch(viewModel, /activeUtility|formatStudioCoinBalance/);
  assert.doesNotMatch(viewModel, /<\w+/);
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
  assert.match(contract, /notificationsView/);
  assert.match(fixtures, /studioTopBarIdleFixture/);
  assert.match(fixtures, /studioTopBarSearchFocusedFixture/);
  assert.match(fixtures, /studioTopBarBellIdleFixture/);
  assert.match(fixtures, /studioTopBarBellWithNotificationsFixture/);
  assert.match(fixtures, /studioTopBarCompactPanelOpenFixture/);
  assert.match(fixtures, /studioTopBarFullCenterOpenFixture/);
  assert.match(fixtures, /studioTopBarEmptyPanelOpenFixture/);
});

test("Studio Top Bar preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/studio-top-bar/page.jsx");
  const preview = read(
    "app/dev/ui-preview/studio-top-bar/StudioTopBarPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StudioTopBarView/);
  assert.match(preview, /Bar idle/);
  assert.match(preview, /Search focused/);
  assert.match(preview, /Bell idle/);
  assert.match(preview, /Bell with notifications/);
  assert.match(preview, /Compact panel open/);
  assert.match(preview, /Full notification center open/);
  assert.match(preview, /Empty state/);
});

test("Studio Shell integration and package documentation remain explicit", () => {
  const studioShell = read("components/studio/StudioShell.jsx");
  const readme = read("components/studio/studio-top-bar/README.md");
  const packageJson = read("package.json");
  assert.equal((studioShell.match(/<StudioTopBar/g) || []).length, 1);
  assert.match(readme, /Binding Shell/);
  assert.match(readme, /ModalShell/);
  assert.match(readme, /\/dev\/ui-preview\/studio-top-bar/);
  assert.match(packageJson, /diagnostics:loom:studio-top-bar/);
});
