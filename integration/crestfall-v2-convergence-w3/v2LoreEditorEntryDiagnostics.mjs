import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Lore Write lore CTA opens the real Lore builder directly", () => {
  const vm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
  assert.match(vm, /onCtaClick:\s*\(\) => onNavigate\?\.\("\/studio\/create\/lore"\)/);
  assert.doesNotMatch(vm, /setIsCreateModalOpen\(true\)/);
});

test("Lore no longer carries the obsolete quick-create modal", () => {
  const view = read("app/studio/v2/lore/lore/Lore.view.jsx");
  assert.doesNotMatch(view, /function LoreCreateModal/);
  assert.doesNotMatch(view, /Submit for review/);
  assert.doesNotMatch(view, /KitFormFieldView/);
});

test("Lore bottom loop returns to canonical Studio", () => {
  const vm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
  assert.match(vm, /navigateOrStub\("\/studio", "Return to Studio"\)/);
  assert.doesNotMatch(vm, /\/studio\/v2\/home/);
});
