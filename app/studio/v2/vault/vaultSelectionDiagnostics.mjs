import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

// Select mode on Vault (ASSET-FOLDERS AF6, item 3, 14 Sep 2026): the
// composition pins the brief's G3 proofs and the bar order ruled on
// Media and carried to Vault.
test("the page mounts the one KitSelectionBar once and keeps the kebab's single-item window.confirm", () => {
  const page = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.equal((page.match(/<KitSelectionBar\b/g) || []).length, 1);
  assert.equal((page.match(/window\.confirm/g) || []).length, 1);
});

test("the bar's onDelete resolves to a handler that loops the page's existing deleteCreation from the confirm's primary", () => {
  const page = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.match(page, /onDelete=\{handleDeleteSelected\}/);
  const handler = page.slice(page.indexOf("async function handleDeleteSelected()"), page.indexOf("function toggleId("));
  assert.match(handler, /for \(const item of items\)/);
  assert.match(handler, /canDeleteVaultItem\(item\)/);
  assert.match(handler, /await deleteCreation\(item\.id\)/);
  assert.match(handler, /setIsBulkDeleting\(true\)/);
  assert.match(handler, /selection\.clearSelection\(\)/);
  assert.match(handler, /router\.refresh\(\)/);
  // The count rides the confirmation's copy and the busy flag the bar.
  const bar = page.slice(page.indexOf("<KitSelectionBar"), page.indexOf("/>", page.indexOf("<KitSelectionBar")));
  assert.match(bar, /deleteBody=\{`This deletes \$\{selection\.selectedCount\} selected/);
  assert.match(bar, /isBusy=\{isBulkDeleting\}/);
  assert.match(bar, /isDownloadSoon/);
  assert.match(bar, /onDone=\{selection\.leaveSelectionMode\}/);
  assert.match(bar, /removeFromFolderName=\{activeFolder\?\.name/);
  assert.match(bar, /dockInsets=\{dockInsets\}/);
});

test("bar order after the search field: Select, Folders in the leading slot, then the bar's Filter and Sort, then the view toggle", () => {
  const page = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  const bar = page.slice(page.indexOf("<KitStudioFilterBarView"), page.indexOf("bannerSlot={"));
  const order = ["leadingSlot={", "selection.toggleSelectionMode", "onToggleFolders", "filterGroups={filterGroups}", "sortOptions={SORT_OPTIONS}", "viewModeSlot={"].map((needle) => bar.indexOf(needle));
  assert.ok(order.every((index) => index > -1), "every control is passed to the bar");
  for (let index = 1; index < order.length; index += 1) assert.ok(order[index - 1] < order[index], `order at ${index}`);
  assert.doesNotMatch(bar, /controlsSlot=/);
});

test("cards take the four 3.9.0 props from the page selection hook; the kebab's Add to folder selects the card", () => {
  const page = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.match(page, /isSelectable=\{selection\.isSelectionMode\}/);
  assert.match(page, /isSelected=\{selection\.isSelected\(item\.id\)\}/);
  assert.match(page, /onToggleSelect=\{\(\) => selection\.toggleItem\(item\.id\)\}/);
  assert.match(page, /onAddToFolder=\{live && item\.isOwn \? \(\) => selection\.selectItem\(item\.id\) : undefined\}/);
  const hook = read("app/studio/v2/vault/useVaultSelection.js");
  assert.match(hook, /export function useVaultSelection\(\)/);
  assert.doesNotMatch(hook, /useEffect|fetch\(/);
});

test("the Folders column sits right of the grid at 1100 and up, the sheet below; opening the column collapses the sidebar through claimLeft", () => {
  const page = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  const row = page.slice(page.indexOf('<div className="flex items-start gap-[var(--space-6)]">'), page.indexOf("</KitStudioPageView>"));
  const gridAt = row.indexOf("ref={gridColumnRef}");
  const columnAt = row.indexOf('<KitFoldersPanel host="column"');
  assert.ok(gridAt > -1 && columnAt > gridAt, "the panel column renders after the grid column");
  assert.match(page, /<KitFoldersPanel host="sheet"/);
  assert.match(page, /if \(!foldersOpen && foldersHost === "column"\) claimLeft\?\.\("page"\);/);
  assert.match(page, /useFolderStore\("VAULT"\)/);
  assert.match(page, /surface: "VAULT"/);
});
