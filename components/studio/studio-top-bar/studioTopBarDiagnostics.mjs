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

test("Studio Top Bar Shell stays thin and uses the live notification ViewModel", () => {
  const shell = read("components/studio/StudioTopBar.jsx");
  assert.match(shell, /useStudioTopBarViewModel/);
  assert.match(shell, /StudioTopBarView/);
  assert.match(shell, /accountLinkSlot/);
  assert.match(shell, /next\/link/);
  assert.doesNotMatch(shell, /MOCK_NOTIFICATIONS|DemoState/);
  assert.doesNotMatch(shell, /useState/);
});

test("Studio Top Bar View is portable, semantic, and owns no state", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");
  assert.match(view, /searchValue/);
  assert.match(view, /notificationsStatus/);
  assert.match(view, /notificationsLoadError/);
  assert.match(view, /notificationsView/);
  assert.match(view, /bellRef/);
  assert.match(view, /import \{ Bell, Menu, Moon, Sun \} from "lucide-react"/);
  assert.match(view, /Recent public releases and Coins received/);
  assert.match(view, /onToggleTheme/);
  assert.match(view, /accountLinkSlot/);
  assert.match(view, /from "@\/components\/kit\/KitModalFrame"/);
  assert.doesNotMatch(view, /useState|useEffect/);
  assert.doesNotMatch(view, /next\/link/);
});

test("notification bell is intentionally quiet regardless of feed contents", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");
  const bell = view.match(/<button\n\s+ref=\{bellRef\}[\s\S]*?<Bell size=\{17\} \/>/)?.[0] || "";
  assert.match(bell, /border-\[var\(--line\)\]/);
  assert.match(bell, /text-\[var\(--ink-dim\)\]/);
  assert.doesNotMatch(bell, /hasNotifications\s*\?/);
  assert.doesNotMatch(view, /badge|unread|animate-pulse|bg-red|text-red/i);
  assert.doesNotMatch(view, /Clear all|Notification Center|Dismiss /);
});

test("Studio Top Bar View has no card chrome and frosts with the chrome token", () => {
  const view = read("components/studio/studio-top-bar/StudioTopBar.view.jsx");
  const headerOpenTag = view.match(/<header className="([^"]+)"/);
  assert.ok(headerOpenTag, "expected a <header> element with a className");
  const headerClasses = headerOpenTag[1].split(/\s+/);
  assert.ok(headerClasses.includes("border-b"));
  assert.ok(
    !headerClasses.some(
      (c) => /^rounded-|^shadow-/.test(c) || c === "border" || /^border-[tlr]$/.test(c)
    )
  );
  assert.match(view, /backdrop-blur-\[var\(--blur-chrome\)\]/);
  assert.match(view, /color-mix\(in_srgb,var\(--canvas\)_88%,transparent\)/);
});

test("Studio Top Bar ViewModel owns on-demand feed loading and panel state", () => {
  const viewModel = read(
    "components/studio/studio-top-bar/useStudioTopBarViewModel.js"
  );
  assert.match(viewModel, /fetchStudioNotifications/);
  assert.match(viewModel, /loadNotifications = fetchStudioNotifications/);
  assert.match(viewModel, /notificationsStatus/);
  assert.match(viewModel, /notificationsLoadError/);
  const presentation = read(
    "components/studio/studio-top-bar/studioTopBarNotificationPresentation.js"
  );
  assert.match(viewModel, /projectStudioNotification/);
  assert.match(presentation, /FOLLOWED_CREATOR_PUBLISHED/);
  assert.match(presentation, /COINS_RECEIVED/);
  assert.match(viewModel, /setNotificationsView\("compact"\)/);
  assert.doesNotMatch(viewModel, /onOpenNotificationCenter|clearAll|dismissNotification/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Studio Top Bar contract and fixtures cover quiet feed states", () => {
  const contract = read("components/studio/studio-top-bar/StudioTopBar.contract.js");
  const fixtures = read("components/studio/studio-top-bar/StudioTopBar.fixtures.js");
  assert.match(contract, /studio-top-bar\.view\.v7/);
  assert.match(contract, /quietBell/);
  assert.match(contract, /followed-creator publication events and Coins received/);
  assert.match(contract, /no clear-all, dismiss-per-row, unread state/);
  assert.match(fixtures, /studioTopBarBellIdleFixture/);
  assert.match(fixtures, /studioTopBarBellWithNotificationsFixture/);
  assert.match(fixtures, /studioTopBarCompactPanelOpenFixture/);
  assert.match(fixtures, /studioTopBarLoadingPanelOpenFixture/);
  assert.match(fixtures, /studioTopBarErrorPanelOpenFixture/);
  assert.match(fixtures, /studioTopBarEmptyPanelOpenFixture/);
});

test("Studio Top Bar preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/studio-top-bar/page.jsx");
  const preview = read("app/dev/ui-preview/studio-top-bar/StudioTopBarPreviewClient.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StudioTopBarView/);
  assert.match(preview, /Bell idle/);
  assert.match(preview, /Bell with feed data/);
  assert.match(preview, /Notifications open/);
  assert.match(preview, /Loading state/);
  assert.match(preview, /Error state/);
  assert.match(preview, /Empty state/);
  assert.doesNotMatch(preview, /Full notification center|dismiss|clear all/i);
});

test("Studio Shell integration and package documentation remain explicit", () => {
  const studioShell = read("components/studio/StudioShell.jsx");
  const packageJson = read("package.json");
  assert.equal((studioShell.match(/<StudioTopBar/g) || []).length, 1);
  assert.match(packageJson, /diagnostics:loom:studio-top-bar/);
});
