import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  GLOBAL_SEARCH_TYPES,
  applyGlobalSearchPrefix,
  filterGlobalSearchRows,
  normalizeGlobalSearchText,
  parseGlobalSearchQuery,
} from "./kitGlobalSearchQuery.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

// Patterns assembled from fragments so this file never carries the
// banned literals it checks for (the law greps run on this file too).
const OUT_OF_CONTRACT_VALUES = new RegExp(
  ["#[0-9a-fA-F]{6}", "rgba?\\(", ["rounded", "xl"].join("-"), ["bg", "black"].join("-")].join("|")
);
const EM_DASH = new RegExp("\\u2014");
const RETIRED_WORDS = new RegExp(
  `\\b(${[
    ["A", "rc"].join(""),
    ["Co", "dex"].join(""),
    ["Sess", "ions"].join(""),
    ["Story", "line"].join(""),
    ["Ro", "om"].join(""),
    ["Ro", "om Templates"].join(""),
  ].join("|")})\\b`
);
const CURRENCY_MISNOMER = new RegExp(`\\b${["tok", "ens?"].join("")}\\b(?![-\\w])`, "i");

test("scope words steer the sections from the first word only", () => {
  assert.equal(parseGlobalSearchQuery("my lilith").scope, "own");
  assert.equal(parseGlobalSearchQuery("mine lilith").scope, "own");
  assert.equal(parseGlobalSearchQuery("community lilith").scope, "community");
  assert.equal(parseGlobalSearchQuery("global lilith").scope, "community");
  assert.equal(parseGlobalSearchQuery("lilith my").scope, "all");
  assert.deepEqual(parseGlobalSearchQuery("my lilith").terms, ["lilith"]);
  assert.deepEqual(parseGlobalSearchQuery("lilith my").terms, ["lilith", "my"]);
});

test("typed prefixes narrow to one type, with or without a space after the colon", () => {
  const spaced = parseGlobalSearchQuery("character: lilith");
  assert.equal(spaced.type, "character");
  assert.deepEqual(spaced.terms, ["lilith"]);

  const tight = parseGlobalSearchQuery("story:lilith");
  assert.equal(tight.type, "story");
  assert.deepEqual(tight.terms, ["lilith"]);

  const combined = parseGlobalSearchQuery("my character: lilith");
  assert.equal(combined.scope, "own");
  assert.equal(combined.type, "character");
  assert.deepEqual(combined.terms, ["lilith"]);

  assert.equal(parseGlobalSearchQuery("character:").hasQuery, true);
  assert.equal(parseGlobalSearchQuery("character:").wantsSuggestions, false);
});

test("a bare colon or an unknown word before a colon asks for suggestions", () => {
  assert.equal(parseGlobalSearchQuery(":").wantsSuggestions, true);
  assert.equal(parseGlobalSearchQuery("my :").wantsSuggestions, true);
  assert.equal(parseGlobalSearchQuery("foo:").wantsSuggestions, true);
  assert.equal(parseGlobalSearchQuery("lilith").wantsSuggestions, false);
  assert.deepEqual(parseGlobalSearchQuery("foo:bar").terms, ["foo:bar"]);
});

test("the eleven prefixes match the ruled vocabulary", () => {
  assert.deepEqual(
    GLOBAL_SEARCH_TYPES.map((type) => type.prefix),
    [
      "character",
      "player",
      "pose",
      "outfit",
      "location",
      "preset",
      "story",
      "adventure",
      "creator",
      "lore",
      "media",
    ]
  );
});

test("choosing a suggestion replaces the colon word and leaves a trailing space", () => {
  assert.equal(applyGlobalSearchPrefix("my :", "character"), "my character: ");
  assert.equal(applyGlobalSearchPrefix("foo:", "story"), "story: ");
  assert.equal(applyGlobalSearchPrefix("lilith", "lore"), "lilith lore: ");
  assert.equal(applyGlobalSearchPrefix("", "media"), "media: ");
  assert.equal(applyGlobalSearchPrefix("lilith", "not-a-type"), "lilith");
});

test("rows match every term, honor the type, and rank title matches first", () => {
  const rows = [
    { key: "a", scope: "own", type: "character", title: "Lilith", searchText: normalizeGlobalSearchText("Lilith", "private") },
    { key: "b", scope: "own", type: "story", title: "A night with Lilith", searchText: normalizeGlobalSearchText("A night with Lilith") },
    { key: "c", scope: "own", type: "location", title: "Throne room", searchText: normalizeGlobalSearchText("Throne room", "lilith waits here") },
    { key: "d", scope: "own", type: "outfit", title: "Court gown", searchText: normalizeGlobalSearchText("Court gown") },
  ];

  const all = filterGlobalSearchRows(rows, parseGlobalSearchQuery("lilith"));
  assert.deepEqual(all.map((row) => row.key), ["a", "b", "c"]);

  const typed = filterGlobalSearchRows(rows, parseGlobalSearchQuery("story: lilith"));
  assert.deepEqual(typed.map((row) => row.key), ["b"]);

  const twoTerms = filterGlobalSearchRows(rows, parseGlobalSearchQuery("lilith night"));
  assert.deepEqual(twoTerms.map((row) => row.key), ["b"]);

  const limited = filterGlobalSearchRows(rows, parseGlobalSearchQuery("lilith"), { limit: 2 });
  assert.equal(limited.length, 2);
});

test("the View is portable and owns no state, data, or navigation", () => {
  const view = read("components/kit/global-search/KitGlobalSearch.view.jsx");
  assert.doesNotMatch(view, /useState|useEffect|fetch\(|next\/navigation|next\/link|@\/lib\//);
  assert.match(view, /role="combobox"/);
  assert.match(view, /aria-activedescendant/);
  assert.match(view, /variant="sheet"/);
  assert.match(view, /SoonChip/);
  assert.doesNotMatch(view, OUT_OF_CONTRACT_VALUES);
});

test("the ViewModel owns the keyboard, the shortcut, and dismissal", () => {
  const viewModel = read("components/kit/global-search/useKitGlobalSearchViewModel.js");
  assert.match(viewModel, /ArrowDown/);
  assert.match(viewModel, /ArrowUp/);
  assert.match(viewModel, /"Enter"/);
  assert.match(viewModel, /"Escape"/);
  assert.match(viewModel, /metaKey \|\| event\.ctrlKey/);
  assert.match(viewModel, /pointerdown/);
  assert.doesNotMatch(viewModel, /fetch\(|next\/navigation|<\w+/);
});

test("the binding shell is thin and the package is registered", () => {
  const shell = read("components/kit/KitGlobalSearch.jsx");
  assert.match(shell, /useKitGlobalSearchViewModel/);
  assert.match(shell, /KitGlobalSearchView/);
  assert.doesNotMatch(shell, /useState|fetch\(/);
  const contract = read("components/kit/global-search/KitGlobalSearch.contract.js");
  assert.match(contract, /^export const KIT_GLOBAL_SEARCH_VIEW_CONTRACT_VERSION/);
  const packageJson = read("package.json");
  assert.match(packageJson, /diagnostics:loom:global-search/);
});

test("copy carries no em dash, no retired word, and coins are never called anything else", () => {
  const files = [
    "components/kit/global-search/useKitGlobalSearchViewModel.js",
    "components/kit/global-search/KitGlobalSearch.view.jsx",
    "components/kit/global-search/kitGlobalSearchQuery.js",
    "components/kit/global-search/KitGlobalSearch.fixtures.js",
  ];
  files.forEach((file) => {
    const text = read(file);
    assert.doesNotMatch(text, EM_DASH, `${file} carries an em dash`);
    assert.doesNotMatch(text, RETIRED_WORDS, `${file} carries a retired word`);
    assert.doesNotMatch(text, CURRENCY_MISNOMER, `${file} misnames coins`);
  });
});
