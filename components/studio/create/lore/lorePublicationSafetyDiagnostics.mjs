import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

const publicRoute = read("app/studio/creations/[id]/page.js");
const editViewModel = read(
  "components/studio/my-creations/edit/hooks/useCreationEditViewModel.js"
);
const editShellViewModel = read(
  "components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js"
);
const editSectionContent = read(
  "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
);
const readinessViewModel = read(
  "components/studio/create/lore/lore-publication-readiness/useLorePublicationReadinessViewModel.js"
);
const readinessView = read(
  "components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view.jsx"
);
const builderView = read(
  "components/studio/create/lore/lore-builder/LoreBuilder.view.jsx"
);
const rendererView = read(
  "components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx"
);
const ownerPreview = read("app/studio/my-creations/[id]/preview/page.js");
const previewPage = read("app/dev/ui-preview/lore-publication-safety/page.jsx");

function assertNoDataBoundaryViolation(source, label) {
  assert.doesNotMatch(source, /\bsupabase\b|PostGraphile|services-api/i, label);
}

test("public Lore route replaces generic Lore data with the immutable publication", () => {
  assert.match(publicRoute, /function isLoreCreation\(creation\)/);
  assert.match(publicRoute, /isLoreCreation\(cataloguePageData\.creation\)/);
  assert.match(publicRoute, /pageData = await getPublicLorePublicationPageData\(id\)/);
  assert.doesNotMatch(
    publicRoute,
    /let pageData = await getPublicCreationProfilePageData\(id\);/
  );
});

test("generic non-Lore creations retain the existing catalogue path", () => {
  assert.match(publicRoute, /getPublicCreationProfilePageData\(id\)/);
  assert.match(
    publicRoute,
    /!cataloguePageData\.creation \|\| isLoreCreation\(cataloguePageData\.creation\)/
  );
  assert.match(publicRoute, /<CreationProfilePage/);
});

test("Creation Edit tracks unsaved mutations and resets only after hydration or save", () => {
  assert.match(editViewModel, /const \[hasUnsavedChanges, setHasUnsavedChanges\]/);
  assert.match(editViewModel, /function updateField[\s\S]*setHasUnsavedChanges\(true\)/);
  assert.match(editViewModel, /function updateDataField[\s\S]*setHasUnsavedChanges\(true\)/);
  assert.match(editViewModel, /function updateFeaturedMediaSlot[\s\S]*setHasUnsavedChanges\(true\)/);
  assert.match(editViewModel, /setHasUnsavedChanges\(false\)[\s\S]*setSaveStatus\("saved"\)/);
  assert.match(editViewModel, /form,\n\s*hasUnsavedChanges,/);
});

test("dirty state reaches Lore Publication Readiness through application composition", () => {
  assert.match(editShellViewModel, /hasUnsavedChanges: edit\.hasUnsavedChanges/);
  assert.match(editSectionContent, /hasUnsavedChanges = false/);
  assert.match(
    editSectionContent,
    /<LorePublicationReadiness[\s\S]*hasUnsavedChanges=\{hasUnsavedChanges\}/
  );
});

test("validation submission is blocked in both the ViewModel capability and mutation", () => {
  assert.match(readinessViewModel, /hasUnsavedChanges = false/);
  assert.match(
    readinessViewModel,
    /const submitValidation[\s\S]*hasUnsavedChanges[\s\S]*return;/
  );
  assert.match(
    readinessViewModel,
    /canSubmitValidation:[\s\S]*!hasUnsavedChanges[\s\S]*isAuthoringReady/
  );
  assert.match(readinessViewModel, /hasUnsavedChanges: Boolean\(hasUnsavedChanges\)/);
});

test("Publication Readiness clearly tells the owner to save before validation", () => {
  assert.match(
    readinessView,
    /Save the current Lore changes before submitting another validation snapshot\./
  );
  assert.match(
    readinessView,
    /Save this Lore Asset before submitting it for validation\./
  );
  assert.match(readinessView, /hasUnsavedChanges=\{hasUnsavedChanges\}/);
});

test("obsolete future-publication wording is removed from active Lore surfaces", () => {
  for (const [label, source] of [
    ["builder", builderView],
    ["renderer", rendererView],
    ["owner preview", ownerPreview],
  ]) {
    assert.doesNotMatch(
      source,
      /production release controls are intentionally not active|Future production publication|Production publication will require/i,
      label
    );
  }
  assert.match(builderView, /publish only an immutable snapshot that passes/);
  assert.match(rendererView, /immutable saved revision that has passed security validation/);
  assert.match(ownerPreview, /does not change the public revision/);
});

test("preview is production protected and the changed files preserve LOOM boundaries", () => {
  assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
  assert.match(previewPage, /notFound\(\)/);
  for (const [label, source] of [
    ["public route", publicRoute],
    ["readiness view", readinessView],
    ["builder view", builderView],
    ["renderer view", rendererView],
  ]) {
    assertNoDataBoundaryViolation(source, label);
  }
  assert.doesNotMatch(readinessView, /\bfetch\s*\(/);
  assert.doesNotMatch(builderView, /\bfetch\s*\(/);
  assert.doesNotMatch(rendererView, /\bfetch\s*\(/);
});
