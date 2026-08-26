import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("public site header enters the Home dashboard rather than the Studio authoring tool", () => {
  const header = read("components/SiteHeader.jsx");
  assert.match(header, /<Link href="\/studio\/v2\/home"[^>]*>[\s\S]*?Studio[\s\S]*?<\/Link>/);
});

test("public hero Enter Crestfall CTA enters the Home dashboard", () => {
  const page = read("app/page.js");
  assert.match(page, /<Link className="sourcebook-button" href="\/studio\/v2\/home">[\s\S]*?Enter Crestfall[\s\S]*?<\/Link>/);
});

test("public entry routing does not redefine the canonical Studio authoring route", () => {
  const header = read("components/SiteHeader.jsx");
  const page = read("app/page.js");
  assert.doesNotMatch(header, /href="\/studio"[^>]*>[\s\S]*?Studio/);
  assert.doesNotMatch(page, /href="\/studio"[^>]*>[\s\S]*?Enter Crestfall/);
});

console.log("V2 public entry Home routing diagnostics passed.");
