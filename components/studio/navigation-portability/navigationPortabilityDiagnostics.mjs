import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { NAVIGATION_PORTABILITY_TARGETS } from "./NavigationPortability.targets.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function walk(relativeDir) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  const results = [];

  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(relativePath));
    } else {
      results.push(relativePath.replaceAll(path.sep, "/"));
    }
  }

  return results;
}

test("hardening target inventory remains explicit and complete", () => {
  assert.equal(NAVIGATION_PORTABILITY_TARGETS.length, 16);

  const ids = new Set(NAVIGATION_PORTABILITY_TARGETS.map((target) => target.id));
  const views = new Set(
    NAVIGATION_PORTABILITY_TARGETS.map((target) => target.viewPath)
  );
  const shells = new Set(
    NAVIGATION_PORTABILITY_TARGETS.map((target) => target.shellPath)
  );

  assert.equal(ids.size, 16);
  assert.equal(views.size, 16);
  assert.equal(shells.size, 16);

  for (const target of NAVIGATION_PORTABILITY_TARGETS) {
    assert.ok(fs.existsSync(path.join(repoRoot, target.viewPath)), target.viewPath);
    assert.ok(
      fs.existsSync(path.join(repoRoot, target.shellPath)),
      target.shellPath
    );
  }
});

test("all portable Views are free of Next.js Link imports", () => {
  const portableViews = walk("components").filter((relativePath) =>
    relativePath.endsWith(".view.jsx")
  );
  const violations = portableViews.filter((relativePath) =>
    /from\s+["']next\/link["']|require\(["']next\/link["']\)/.test(
      read(relativePath)
    )
  );

  assert.deepEqual(violations, []);
});

test("targeted Views expose a portable anchor fallback", () => {
  for (const target of NAVIGATION_PORTABILITY_TARGETS) {
    const view = read(target.viewPath);

    assert.match(view, /LinkComponent\s*=\s*["']a["']/);
    assert.match(view, /<LinkComponent(?:\s|>)/);
    assert.doesNotMatch(view, /next\/link/);
  }
});

test("targeted Binding Shells own Next.js Link injection", () => {
  for (const target of NAVIGATION_PORTABILITY_TARGETS) {
    const shell = read(target.shellPath);

    assert.match(shell, /import Link from ["']next\/link["']/);
    assert.match(shell, /LinkComponent=\{Link\}/);
  }
});

test("Account Stub forwards injected navigation to its nested Back Link View", () => {
  const shell = read("components/studio/account/AccountStubPage.jsx");
  const view = read(
    "components/studio/account/account-stub-page/AccountStubPage.view.jsx"
  );

  assert.match(shell, /LinkComponent=\{Link\}/);
  assert.match(view, /<StudioBackLinkView[\s\S]*LinkComponent=\{LinkComponent\}/);
});

test("Lore Builder forwards navigation to its directly embedded renderer", () => {
  const shell = read("components/studio/create/lore/LoreBuilderShell.jsx");
  const builderView = read(
    "components/studio/create/lore/lore-builder/LoreBuilder.view.jsx"
  );
  const rendererView = read(
    "components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx"
  );

  assert.match(shell, /import Link from ["']next\/link["']/);
  assert.match(shell, /LinkComponent=\{Link\}/);
  assert.match(
    builderView,
    /<LoreDocumentRendererView[\s\S]*LinkComponent=\{LinkComponent\}/
  );
  assert.match(rendererView, /function CharacterLinks\([\s\S]*LinkComponent/);
  assert.match(rendererView, /function LocationLinks\([\s\S]*LinkComponent/);
});

test("Official Characters forwards navigation to its embedded character cards", () => {
  const shell = read("components/studio/OfficialCharactersGrid.jsx");
  const gridView = read(
    "components/studio/official-characters-grid/OfficialCharactersGrid.view.jsx"
  );

  assert.match(shell, /import Link from ["']next\/link["']/);
  assert.match(shell, /LinkComponent=\{Link\}/);
  assert.match(gridView, /LinkComponent\s*=\s*["']a["']/);
  assert.match(
    gridView,
    /<StudioCharacterCardView[\s\S]*LinkComponent=\{LinkComponent\}/
  );
});

test("README command and protected audit preview remain discoverable", () => {
  const readme = read("components/studio/navigation-portability/README.md");
  const packageJson = read("package.json");
  const previewPage = read("app/dev/ui-preview/navigation-portability/page.jsx");
  const previewClient = read(
    "app/dev/ui-preview/navigation-portability/NavigationPortabilityPreviewClient.jsx"
  );

  assert.match(readme, /16 portable Views/);
  assert.match(readme, /LinkComponent/);
  assert.match(packageJson, /diagnostics:loom:navigation-portability/);
  assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
  assert.match(previewPage, /notFound\(\)/);
  assert.match(previewClient, /NAVIGATION_PORTABILITY_TARGETS/);
  assert.match(previewClient, /PreviewLink/);
  assert.doesNotMatch(previewClient, /next\/link|@\/lib\/client/);
});
