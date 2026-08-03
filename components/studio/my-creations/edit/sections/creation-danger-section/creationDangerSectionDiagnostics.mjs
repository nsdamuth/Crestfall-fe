import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Creation Danger Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/DangerSection.jsx"
  );
  assert.match(shell, /useCreationDangerSectionViewModel/);
  assert.match(shell, /<CreationDangerSectionView/);
  assert.doesNotMatch(
    shell,
    /CANON_LOCKED_STATUSES|DELETABLE_STATUSES|canonStatus|reviewStatus/
  );
});

test("Creation Danger View is API, persistence, and lifecycle-rule free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /canonStatus|reviewStatus|DELETABLE_STATUSES|CANON_LOCKED_STATUSES|ARCHIVED|DRAFT|OFFICIAL|CANDIDATE/
  );
});

test("Creation Danger ViewModel owns lifecycle and canon decisions", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/creation-danger-section/useCreationDangerSectionViewModel.js"
  );
  assert.match(viewModel, /CANON_LOCKED_STATUSES/);
  assert.match(viewModel, /DELETABLE_STATUSES/);
  assert.match(viewModel, /normalizeCreationDangerLifecycleStatus/);
  assert.match(viewModel, /isCreationDangerCanonLocked/);
  assert.match(viewModel, /form\?\.canonStatus/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Creation Danger contract and fixtures cover lifecycle states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.fixtures.js"
  );
  assert.match(contract, /CREATION_DANGER_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /showCanonNotice/);
  assert.match(contract, /onArchive/);
  assert.match(fixtures, /creationDangerSectionDraftFixture/);
  assert.match(fixtures, /creationDangerSectionArchivedFixture/);
  assert.match(fixtures, /creationDangerSectionCanonLockedFixture/);
  assert.match(fixtures, /creationDangerSectionErrorFixture/);
});

test("Creation Danger preview is development-only", () => {
  const page = read("app/dev/ui-preview/creation-danger-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/creation-danger-section/CreationDangerSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CreationDangerSectionView/);
});

test("Creation Edit retains the public Creation Danger Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import DangerSection from/);
  assert.match(editShell, /<DangerSection/);
  assert.match(editShell, /onArchive=\{handleArchive\}/);
  assert.match(editShell, /onDelete=\{handleDelete\}/);
});

test("Creation Danger package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/creation-danger-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /canon-lock interpretation/);
  assert.match(readme, /\/dev\/ui-preview\/creation-danger-section/);
});
