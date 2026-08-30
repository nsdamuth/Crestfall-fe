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

test("Studio Sidebar Shell stays thin and application-owned", () => {
  const shell = read("components/studio/StudioSidebar.jsx");
  assert.match(shell, /useStudioSidebarViewModel/);
  assert.match(shell, /StudioSidebarView/);
  assert.match(shell, /usePathname/);
  assert.match(shell, /useStudioAccount/);
  assert.match(shell, /accountProfile/);
  assert.match(shell, /InternalLinkComponent=\{Link\}/);
  assert.match(shell, /economySlot/);
  assert.doesNotMatch(shell, /useState/);
  assert.doesNotMatch(shell, /studioLinks|utilityLinks|socialLinks/);
  assert.doesNotMatch(shell, /isActivePath|startsWith/);
});

test("Studio Sidebar View is portable and semantic", () => {
  const view = read("components/studio/studio-sidebar/StudioSidebar.view.jsx");
  assert.match(view, /InternalLinkComponent/);
  assert.match(view, /economySlot/);
  assert.match(view, /primaryLinks/);
  assert.match(view, /utilityLinks/);
  assert.match(view, /socialLinks/);
  assert.match(view, /onToggleCollapsed/);
  assert.match(view, /onToggleSocial/);
  assert.doesNotMatch(view, /next\/link|next\/navigation/);
  assert.doesNotMatch(view, /StudioEconomyWidget/);
  assert.doesNotMatch(view, /useState|usePathname/);
});

test("Studio Sidebar ViewModel owns navigation and UI state", () => {
  const viewModel = read(
    "components/studio/studio-sidebar/useStudioSidebarViewModel.js"
  );
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /STUDIO_SIDEBAR_PRIMARY_LINKS/);
  assert.match(viewModel, /STUDIO_SIDEBAR_UTILITY_LINKS/);
  assert.match(viewModel, /STUDIO_SIDEBAR_PREVIEW_SUPPORT_GROUP/);
  assert.match(viewModel, /STUDIO_SIDEBAR_SOCIAL_LINKS/);
  assert.match(viewModel, /isStudioSidebarPathActive/);
  assert.match(viewModel, /normalizeStudioSidebarPublicUsername/);
  assert.match(viewModel, /setCollapsed/);
  assert.match(viewModel, /setSocialOpen/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Studio Sidebar preserves routes, labels, and active matching", () => {
  const viewModel = read(
    "components/studio/studio-sidebar/useStudioSidebarViewModel.js"
  );
  for (const route of [
    "/studio",
    "/studio/create",
    "/studio/games",
    "/studio/story-rooms",
    "/studio/image-studio",
    "/studio/official-characters",
    "/studio/storylines",
    "/studio/my-creations",
    "/studio/community",
    "/studio/feedback",
    "/studio/account",
    "/terms",
    "/logout",
  ]) {
    assert.match(viewModel, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(viewModel, /href === "\/studio"/);
  assert.match(viewModel, /pathname === "\/studio"/);
  assert.match(viewModel, /pathname\.startsWith\(href\)/);
  assert.match(viewModel, /"Stories"/);
  assert.match(viewModel, /"Community Links"/);
});

test("V2 Studio Sidebar restores Support links without duplicating Account", () => {
  const viewModel = read(
    "components/studio/studio-sidebar/useStudioSidebarViewModel.js"
  );
  const view = read("components/studio/studio-sidebar/StudioSidebar.view.jsx");
  assert.match(viewModel, /label: "Support"/);
  assert.match(viewModel, /label: "Feedback & Updates"/);
  assert.match(viewModel, /href: "\/studio\/feedback"/);
  assert.match(viewModel, /label: "Terms & Policies"/);
  assert.match(viewModel, /href: "\/terms"/);
  assert.match(viewModel, /previewSupportGroup/);
  assert.match(view, /previewSupportGroup/);
  const supportBlock = viewModel.match(/STUDIO_SIDEBAR_PREVIEW_SUPPORT_GROUP[\s\S]*?\n\}\);/)?.[0] || "";
  assert.doesNotMatch(supportBlock, /label: "Account"/);
});

test("Studio Sidebar contract and fixtures cover visible states", () => {
  const contract = read("components/studio/studio-sidebar/StudioSidebar.contract.js");
  const fixtures = read("components/studio/studio-sidebar/StudioSidebar.fixtures.js");
  assert.match(contract, /STUDIO_SIDEBAR_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /applicationOwnedDependencies/);
  assert.match(contract, /activeStudioRootExactMatch/);
  assert.match(fixtures, /studioSidebarExpandedFixture/);
  assert.match(fixtures, /studioSidebarSocialOpenFixture/);
  assert.match(fixtures, /studioSidebarCollapsedFixture/);
  assert.match(fixtures, /@preview_creator/);
  assert.doesNotMatch(fixtures, /creator@example\.com/);
});

test("Studio Sidebar preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/studio-sidebar/page.jsx");
  const preview = read(
    "app/dev/ui-preview/studio-sidebar/StudioSidebarPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StudioSidebarView/);
  assert.match(preview, /Expanded/);
  assert.match(preview, /Community Links Open/);
  assert.match(preview, /Collapsed/);
  assert.match(preview, /economySlot/);
});

test("Studio Shell integration and package documentation remain explicit", () => {
  const studioShell = read("components/studio/StudioShell.jsx");
  const readme = read("components/studio/studio-sidebar/README.md");
  const packageJson = read("package.json");
  assert.equal((studioShell.match(/<StudioSidebar/g) || []).length, 1);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /StudioShell\.jsx/);
  assert.match(readme, /StudioMobileNav/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/studio-sidebar/);
  assert.match(packageJson, /diagnostics:loom:studio-sidebar/);
});
