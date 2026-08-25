import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const view = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");

test("ingredient cards use intentional compact category labels instead of clipped full labels", () => {
  for (const [id, label] of [
    ["character", "Character"],
    ["playerCharacter", "Player"],
    ["pose", "Pose"],
    ["outfit", "Outfit"],
    ["location", "Location"],
    ["preset", "Preset"],
  ]) {
    assert.match(view, new RegExp(`id: "${id}"[^\\n]+compactLabel: "${label}"`));
  }
  assert.match(view, /\{def\.compactLabel\}/);
  assert.doesNotMatch(view, /<span className="truncate">\{def\.label\}<\/span>/);
});

test("visual ingredient cards are slightly taller without changing the two-column anatomy", () => {
  assert.match(view, /aspect-\[5\/4\]/);
  assert.match(view, /grid-cols-2/);
});

test("selected artwork gets stronger title contrast at the bottom of each card", () => {
  assert.match(view, /h-2\/3 bg-gradient-to-t from-black\/95 via-black\/70 to-transparent/);
  assert.match(view, /bg-gradient-to-b from-black\/50 via-transparent to-transparent/);
});

test("selected-card remove control is explicitly treated as a high-contrast image overlay", () => {
  assert.match(view, /function ClearButton\(\{ label, onClick, overlay = false \}\)/);
  assert.match(view, /border-white\/25 bg-black\/75 text-white shadow-md backdrop-blur-sm/);
  assert.match(view, /<ClearButton overlay label=\{`Clear \$\{def\.label\}`\}/);
});

test("compact ingredient cards show image plus title without a secondary subtitle row", () => {
  const slotStart = view.indexOf("function SlotTile");
  const slotEnd = view.indexOf("function CustomSlotEditor");
  const slotSource = view.slice(slotStart, slotEnd);
  assert.match(slotSource, /const title = hasSelection \? state\.selection\.title : "Select\.\.\."/);
  assert.doesNotMatch(slotSource, /state\.selection\.subtitle/);
  assert.doesNotMatch(slotSource, /\{subtitle \?/);
});
