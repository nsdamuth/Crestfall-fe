import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const view = fs.readFileSync(path.join(currentDir, "EditorHeader.view.jsx"), "utf8");

test("primary artwork expands through available phone and tablet width", () => {
  assert.match(view, /w-full max-w-\[500px\]/);
  assert.match(view, /min-w-0 flex-1/);
  assert.doesNotMatch(view, /w-\[148px\]/);
  assert.doesNotMatch(view, /sm:w-\[232px\]/);
});

test("desktop artwork remains bounded while using more hero space", () => {
  assert.match(view, /lg:w-\[300px\]/);
  assert.match(view, /xl:w-\[320px\]/);
  assert.match(view, /lg:w-auto lg:max-w-none/);
});
