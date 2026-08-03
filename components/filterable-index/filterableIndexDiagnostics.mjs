import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Filterable Index Binding Shell stays thin and owns application integration", () => {
  const shell = read("components/FilterableIndex.jsx");

  assert.ok(shell.split("\n").length < 60);
  assert.match(shell, /usePathname/);
  assert.match(shell, /useRouter/);
  assert.match(shell, /useSearchParams/);
  assert.match(shell, /LoreCard/);
  assert.match(shell, /useFilterableIndexViewModel/);
  assert.match(shell, /FilterableIndexView/);
  assert.match(shell, /router\.replace\(href, \{ scroll: false \}\)/);
  assert.doesNotMatch(shell, /entryMatchesSearch|getUniqueValues|getAllTags/);
});

test("Chassis owns URL parsing filtering tags and card projection", () => {
  const viewModel = read(
    "components/filterable-index/useFilterableIndexViewModel.js"
  );

  assert.match(viewModel, /URLSearchParams/);
  assert.match(viewModel, /params\.get\("q"\)/);
  assert.match(viewModel, /params\.get\("tags"\)/);
  assert.match(viewModel, /entryMatchesSearch/);
  assert.match(viewModel, /entryMatchesFilter/);
  assert.match(viewModel, /activeTags\.every/);
  assert.match(viewModel, /getUniqueValues/);
  assert.match(viewModel, /resolveAssetPath/);
  assert.match(viewModel, /entry\.cardText \?\? entry\.subtitle/);
  assert.doesNotMatch(viewModel, /next\/navigation|LoreCard|@\/lib\/client/);
});

test("portable View renders controls and injected cards without application imports", () => {
  const view = read("components/filterable-index/FilterableIndex.view.jsx");

  assert.match(view, /Search the archive/);
  assert.match(view, /filterOptions\.map/);
  assert.match(view, /tags\.map/);
  assert.match(view, /scrollBy/);
  assert.match(view, /renderCard/);
  assert.match(view, /emptyText/);
  assert.doesNotMatch(view, /next\/navigation|next\/link|LoreCard/);
  assert.doesNotMatch(view, /@\/lib\/client|Supabase|PostGraphile/);
});

test("all five public archive routes retain the root Filterable Index integration", () => {
  const routes = [
    "app/characters/page.js",
    "app/locations/page.js",
    "app/factions/page.js",
    "app/stories/page.js",
    "app/chronicle/page.js",
  ];

  routes.forEach((route) => {
    const source = read(route);
    assert.match(source, /@\/components\/FilterableIndex/);
    assert.match(source, /<FilterableIndex/);
    assert.match(source, /<Suspense/);
  });
});

test("query contract preserves q tags route filter keys and clear semantics", () => {
  const viewModel = read(
    "components/filterable-index/useFilterableIndexViewModel.js"
  );

  assert.match(viewModel, /updateUrl\(\{ q: value, tags: \[\] \}\)/);
  assert.match(viewModel, /updateUrl\(\{ \[key\]: value, tags: \[\] \}\)/);
  assert.match(viewModel, /params\.set\(key, value\.join\(","\)\)/);
  assert.match(viewModel, /onReplaceUrl\?\.\(pathname\)/);
  assert.match(viewModel, /activeTags\.includes\(tag\)/);
});

test("contract and fixtures document representative archive states", () => {
  const contract = read("components/filterable-index/FilterableIndex.contract.js");
  const fixtures = read("components/filterable-index/FilterableIndex.fixtures.js");

  assert.match(contract, /FILTERABLE_INDEX_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /FilterableIndexViewProps/);
  assert.match(contract, /FilterableIndexCard/);
  assert.match(fixtures, /Crownlands/);
  assert.match(fixtures, /Mystery/);
  assert.match(fixtures, /missing-record/);
  assert.match(fixtures, /tags=Mystery,Current\+Age/);
});

test("development preview is protected and uses fixtures only", () => {
  const page = read("app/dev/ui-preview/filterable-index/page.jsx");
  const preview = read(
    "app/dev/ui-preview/filterable-index/FilterableIndexPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /FilterableIndexView/);
  assert.match(preview, /useFilterableIndexViewModel/);
  assert.match(preview, /local fixtures only/);
  assert.doesNotMatch(preview, /LoreCard|@\/lib\/client/);
});

test("README and focused diagnostic command remain discoverable", () => {
  const readme = read("components/filterable-index/README.md");
  const packageJson = read("package.json");

  assert.match(readme, /\/characters/);
  assert.match(readme, /\/locations/);
  assert.match(readme, /\/factions/);
  assert.match(readme, /\/stories/);
  assert.match(readme, /\/chronicle/);
  assert.match(readme, /\/dev\/ui-preview\/filterable-index/);
  assert.match(packageJson, /diagnostics:loom:filterable-index/);
});
