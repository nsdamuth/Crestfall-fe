import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const shell = read("components/studio/studio-shell/StudioShell.view.jsx");
const page = read("components/kit/studio-page/KitStudioPage.view.jsx");
const images = read("app/studio/v2/images/ImagesV2Live.jsx");

assert.match(
  shell,
  /px-\[var\(--space-5\)\] pb-24 pt-0[\s\S]*lg:px-\[var\(--space-10\)\] lg:pb-\[var\(--space-8\)\]/
);
assert.doesNotMatch(
  shell,
  /pb-24 pt-\[var\(--space-20\)\][\s\S]*lg:py-\[var\(--space-8\)\]/
);

assert.match(page, /gap-\[var\(--space-6\)\] pb-\[var\(--space-6\)\]/);
assert.match(page, /pb-\[var\(--space-2\)\][\s\S]*sm:pb-\[var\(--space-6\)\]/);
assert.doesNotMatch(page, /py-\[var\(--space-(?:2|6)\)\]/);

assert.doesNotMatch(images, /-mt-\[var\(--space-12\)\] sm:mt-0/);
assert.match(images, /<KitStudioPageView\s+compactMobile/);

console.log("V2 global page top spacing diagnostics passed.");
