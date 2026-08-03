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

test("Creation Publishing Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/PublishingSection.jsx"
  );
  assert.match(shell, /useCreationPublishingSectionViewModel/);
  assert.match(shell, /<CreationPublishingSectionView/);
  assert.doesNotMatch(shell, /form\.|updateField\?\.\(|IN_REVIEW|OFFICIAL/);
});

test("Creation Publishing View is API, persistence, and lifecycle free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateField|form\.|canonStatus|reviewStatus|IN_REVIEW|ARCHIVED|OFFICIAL|REJECTED/
  );
});

test("Creation Publishing ViewModel owns review eligibility and field mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/creation-publishing-section/useCreationPublishingSectionViewModel.js"
  );
  assert.match(viewModel, /isCreationPublishingSubmittable/);
  assert.match(viewModel, /SUBMITTABLE_LIFECYCLE_STATUSES/);
  assert.match(viewModel, /isApprovedInternal/);
  assert.match(viewModel, /updateField\?\.\("visibility"/);
  assert.match(viewModel, /updateField\?\.\("contentRating"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Creation Publishing contract and fixtures cover key portable states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.fixtures.js"
  );
  assert.match(contract, /CREATION_PUBLISHING_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /templateActions/);
  assert.match(contract, /onSubmitCanonReview/);
  assert.match(fixtures, /creationPublishingSectionTemplateFixture/);
  assert.match(fixtures, /creationPublishingSectionInReviewFixture/);
  assert.match(fixtures, /creationPublishingSectionOfficialCanonFixture/);
  assert.match(fixtures, /creationPublishingSectionMissingCallbacksFixture/);
});

test("Creation Publishing preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/creation-publishing-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/creation-publishing-section/CreationPublishingSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CreationPublishingSectionView/);
});

test("Creation Edit retains the public Publishing Section Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import PublishingSection from/);
  assert.match(editShell, /<PublishingSection/);
  assert.match(editShell, /onSubmitPublicReview/);
  assert.match(editShell, /onSubmitCanonReview/);
});

test("Creation Publishing package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/creation-publishing-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /review eligibility/);
  assert.match(readme, /\/dev\/ui-preview\/creation-publishing-section/);
});
