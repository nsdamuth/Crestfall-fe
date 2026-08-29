import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Vault promotes owner actions without changing saved-from-others cards", () => {
  const vault = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.match(vault, /promoteOwnerActions=\{Boolean\(live && item\.isOwn\)\}/);
  assert.match(vault, /onEdit=\{live && item\.isOwn/);
  assert.match(vault, /onPlay=/);
});

test("owner quick actions render Edit, Generate Image, and the existing contextual action", () => {
  const view = read("components/kit/creation-card/KitCreationCard.view.jsx");
  assert.match(view, /function OwnerQuickActions/);
  assert.match(view, /IconActionButton label="Edit"/);
  assert.match(view, /<Pencil size=\{16\}/);
  assert.match(view, /IconActionButton label="Generate Image"/);
  assert.match(view, /<ImageIcon size=\{16\}/);
  assert.match(view, /isOwner && promoteOwnerActions/);
  assert.match(view, /contextualAction=\{contextualAction\}/);
});

test("Like and Save remain the default card face outside promoted owner mode", () => {
  const view = read("components/kit/creation-card/KitCreationCard.view.jsx");
  assert.match(view, /IconActionButton label="Like"/);
  assert.match(view, /IconActionButton label="Save"/);
  assert.match(view, /promoteOwnerActions = false/);
  assert.match(view, /<KebabMenu/);
});

test("portable card viewmodel carries the opt-in owner action mode", () => {
  const vm = read("components/kit/creation-card/useKitCreationCardViewModel.js");
  assert.match(vm, /promoteOwnerActions: Boolean\(props\?\.promoteOwnerActions\)/);
});
