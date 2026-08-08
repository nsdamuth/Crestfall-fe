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

test("Studio Mobile Nav Shell stays thin and application-owned", () => {
  const shell = read("components/studio/StudioMobileNav.jsx");
  assert.match(shell, /useStudioMobileNavViewModel/);
  assert.match(shell, /StudioMobileNavView/);
  assert.match(shell, /usePathname/);
  assert.match(shell, /InternalLinkComponent=\{Link\}/);
  assert.match(shell, /variant="drawer"/);
  assert.match(shell, /open, onCloseMenu/);
  assert.doesNotMatch(shell, /variant="mobileHeader"/);
  assert.doesNotMatch(shell, /useState/);
  assert.doesNotMatch(shell, /studioLinks|utilityLinks|socialLinks|bottomLinks/);
  assert.doesNotMatch(shell, /isActivePath|startsWith/);
});

test("Studio Mobile Nav View is portable and semantic, and owns no header", () => {
  const view = read("components/studio/studio-mobile-nav/StudioMobileNav.view.jsx");
  assert.match(view, /InternalLinkComponent/);
  assert.match(view, /drawerEconomySlot/);
  assert.match(view, /primaryLinks/);
  assert.match(view, /utilityLinks/);
  assert.match(view, /socialLinks/);
  assert.match(view, /bottomLinks/);
  assert.match(view, /onCloseMenu/);
  assert.match(view, /onToggleSocial/);
  assert.match(view, /onNavigate/);
  assert.doesNotMatch(view, /next\/link|next\/navigation/);
  assert.doesNotMatch(view, /StudioEconomyWidget/);
  assert.doesNotMatch(view, /useState|usePathname/);
  assert.doesNotMatch(view, /headerEconomySlot|onOpenMenu/);
  assert.doesNotMatch(view, /<header/);
});

test("Studio Mobile Nav ViewModel owns Community Links state, not drawer open state", () => {
  const viewModel = read(
    "components/studio/studio-mobile-nav/useStudioMobileNavViewModel.js"
  );
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /STUDIO_MOBILE_NAV_PRIMARY_LINKS/);
  assert.match(viewModel, /STUDIO_MOBILE_NAV_UTILITY_LINKS/);
  assert.match(viewModel, /STUDIO_MOBILE_NAV_SOCIAL_LINKS/);
  assert.match(viewModel, /STUDIO_MOBILE_NAV_BOTTOM_LINKS/);
  assert.match(viewModel, /isStudioMobileNavPathActive/);
  assert.match(viewModel, /normalizeStudioMobileNavEmail/);
  assert.match(viewModel, /setSocialOpen/);
  assert.doesNotMatch(viewModel, /setOpen\b/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Studio Mobile Nav preserves routes, labels, and active matching", () => {
  const viewModel = read(
    "components/studio/studio-mobile-nav/useStudioMobileNavViewModel.js"
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
  assert.match(viewModel, /"Storys"/);
  assert.match(viewModel, /"Community Links"/);
  assert.match(viewModel, /fixedBottomNavigationCount|STUDIO_MOBILE_NAV_BOTTOM_LINKS/);
});

test("Studio Mobile Nav contract and fixtures cover visible states", () => {
  const contract = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.contract.js"
  );
  const fixtures = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.fixtures.js"
  );
  assert.match(contract, /STUDIO_MOBILE_NAV_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /applicationOwnedDependencies/);
  assert.match(contract, /activeStudioRootExactMatch/);
  assert.match(contract, /fixedBottomNavigationCount: 5/);
  assert.match(fixtures, /studioMobileNavClosedFixture/);
  assert.match(fixtures, /studioMobileNavDrawerOpenFixture/);
  assert.match(fixtures, /studioMobileNavSocialOpenFixture/);
  assert.match(fixtures, /creator@example\.com/);
});

test("Studio Mobile Nav preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/studio-mobile-nav/page.jsx");
  const preview = read(
    "app/dev/ui-preview/studio-mobile-nav/StudioMobileNavPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StudioMobileNavView/);
  assert.match(preview, /Closed/);
  assert.match(preview, /Drawer Open/);
  assert.match(preview, /Community Links Open/);
  assert.doesNotMatch(preview, /headerEconomySlot/);
  assert.match(preview, /drawerEconomySlot/);
});

test("Studio Shell integration and package documentation remain explicit", () => {
  const studioShell = read("components/studio/StudioShell.jsx");
  const readme = read("components/studio/studio-mobile-nav/README.md");
  const packageJson = read("package.json");
  assert.equal((studioShell.match(/<StudioMobileNav/g) || []).length, 1);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /StudioShell\.jsx/);
  assert.match(readme, /StudioSidebar/);
  assert.match(readme, /StudioTopBar/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/studio-mobile-nav/);
  assert.match(packageJson, /diagnostics:loom:studio-mobile-nav/);
});
