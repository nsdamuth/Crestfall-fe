import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { UNREGISTERED_DIAGNOSTIC_EXCLUSIONS } from "./loomGuardrailExclusions.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const AUTH_SUPABASE_ALLOWLIST = new Set([
  "app/auth/callback/route.js",
  "app/login/page.js",
  "app/logout/route.js",
  "app/middleware.js",
  "app/studio/layout.js",
]);

function toPosix(value) {
  return value.replaceAll(path.sep, "/");
}

function absolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function walk(relativeDir) {
  const root = absolute(relativeDir);
  if (!fs.existsSync(root)) return [];

  const results = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(relativePath));
    } else {
      results.push(toPosix(relativePath));
    }
  }
  return results;
}

function sourceFiles(relativeDir) {
  return walk(relativeDir).filter((relativePath) =>
    SOURCE_EXTENSIONS.has(path.extname(relativePath))
  );
}

function packageCommands() {
  const packageJson = JSON.parse(read("package.json"));
  return Object.values(packageJson.scripts || {}).join("\n");
}

function filesInDirectory(relativeDir) {
  return fs
    .readdirSync(absolute(relativeDir), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
}

test("portable Views contain no framework navigation or data-access ownership", () => {
  const views = walk("components").filter((relativePath) =>
    relativePath.endsWith(".view.jsx")
  );
  assert.ok(views.length >= 200, "expected the cumulative portable View inventory");

  const forbidden = [
    /from\s+["']next\/(?:link|navigation)["']/,
    /require\(["']next\/(?:link|navigation)["']\)/,
    /from\s+["']@\/lib\/(?:client|server|supabase)(?:\/|["'])/,
    /from\s+["']@\/app\//,
    /\bfetch\s*\(/,
    /\buseRouter\b/,
    /\busePathname\b/,
    /\buseSearchParams\b/,
  ];

  const violations = [];
  for (const relativePath of views) {
    const source = read(relativePath);
    if (forbidden.some((pattern) => pattern.test(source))) {
      violations.push(relativePath);
    }
  }

  assert.deepEqual(violations, []);
});

test("user-facing app and component source does not call fetch outside API routes", () => {
  const candidates = [...sourceFiles("app"), ...sourceFiles("components")].filter(
    (relativePath) =>
      !relativePath.startsWith("app/api/") &&
      !relativePath.includes("/dev/ui-preview/") &&
      !relativePath.endsWith("Diagnostics.mjs")
  );

  const violations = candidates.filter((relativePath) =>
    /\bfetch\s*\(/.test(read(relativePath))
  );

  assert.deepEqual(violations, []);
});

test("Supabase imports outside API routes remain authentication-only", () => {
  const candidates = [...sourceFiles("app"), ...sourceFiles("components")].filter(
    (relativePath) =>
      !relativePath.startsWith("app/api/") &&
      !relativePath.endsWith("Diagnostics.mjs")
  );

  const supabaseImports = candidates.filter((relativePath) =>
    /(?:@\/lib\/supabase\/|@supabase\/ssr)/.test(read(relativePath))
  );

  assert.deepEqual(supabaseImports.sort(), [...AUTH_SUPABASE_ALLOWLIST].sort());

  for (const relativePath of supabaseImports) {
    const source = read(relativePath);
    assert.match(source, /\.auth\./, `${relativePath} must remain auth/session only`);
    assert.doesNotMatch(
      source,
      /\.from\s*\(|\.rpc\s*\(/,
      `${relativePath} must not access product data`
    );
  }
});

test("every portable View directory has a contract, fixtures, and README", () => {
  const views = walk("components").filter((relativePath) =>
    relativePath.endsWith(".view.jsx")
  );
  const violations = [];

  for (const viewPath of views) {
    const relativeDir = path.posix.dirname(viewPath);
    const files = filesInDirectory(relativeDir);
    const missing = [];

    if (!files.some((name) => name.includes(".contract."))) missing.push("contract");
    if (!files.some((name) => name.includes(".fixtures."))) missing.push("fixtures");
    if (!files.includes("README.md")) missing.push("README");

    if (missing.length) violations.push(`${relativeDir}: ${missing.join(", ")}`);
  }

  assert.deepEqual(violations, []);
});

test("all development preview pages are explicitly unavailable in production", () => {
  const previewPages = walk("app/dev/ui-preview").filter((relativePath) =>
    /\/page\.(?:js|jsx|ts|tsx)$/.test(relativePath)
  );
  assert.ok(previewPages.length >= 200, "expected the cumulative preview inventory");

  const violations = [];
  for (const relativePath of previewPages) {
    const source = read(relativePath);
    const hasProductionGuard =
      /process\.env\.NODE_ENV\s*===\s*["']production["']/.test(source);
    const hasNotFound = /\bnotFound\s*\(/.test(source);

    if (!hasProductionGuard || !hasNotFound) violations.push(relativePath);
  }

  assert.deepEqual(violations, []);
});

test("every focused diagnostic is registered or explicitly classified", () => {
  const diagnostics = walk("components").filter((relativePath) =>
    relativePath.endsWith("Diagnostics.mjs")
  );
  const commands = packageCommands();
  const exclusions = new Map(
    UNREGISTERED_DIAGNOSTIC_EXCLUSIONS.map((item) => [item.path, item])
  );

  assert.equal(exclusions.size, UNREGISTERED_DIAGNOSTIC_EXCLUSIONS.length);

  const unclassified = diagnostics.filter(
    (relativePath) => !commands.includes(relativePath) && !exclusions.has(relativePath)
  );
  assert.deepEqual(unclassified, []);

  for (const item of UNREGISTERED_DIAGNOSTIC_EXCLUSIONS) {
    assert.equal(fs.existsSync(absolute(item.path)), true, item.path);
    assert.ok(item.category.length > 0, `${item.path} requires a category`);
    assert.ok(item.reason.length > 30, `${item.path} requires a concrete reason`);
    assert.equal(commands.includes(item.path), false, `${item.path} is no longer excluded`);
  }
});

test("the repository guardrail command and documentation remain discoverable", () => {
  const packageJson = JSON.parse(read("package.json"));
  const command = packageJson.scripts?.["diagnostics:loom:repository-guardrails"] || "";
  const readme = read("components/studio/loom-guardrails/README.md");

  assert.match(command, /loomGuardrailsDiagnostics\.mjs/);
  assert.match(readme, /Portable View boundaries/);
  assert.match(readme, /API proxy/);
  assert.match(readme, /authentication and session handling/);
  assert.match(readme, /production preview protection/);
  assert.match(readme, /explicit diagnostic exclusions/);
  assert.match(readme, /does not begin Mechanics abstraction/);
});

test("guardrail package contains diagnostics and documentation only", () => {
  const files = filesInDirectory("components/studio/loom-guardrails").sort();
  assert.deepEqual(files, [
    "README.md",
    "loomGuardrailExclusions.mjs",
    "loomGuardrailsDiagnostics.mjs",
  ]);
});
