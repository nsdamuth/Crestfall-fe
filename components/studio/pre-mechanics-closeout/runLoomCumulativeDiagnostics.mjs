import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")
);

const SKIPPED_AGGREGATES = new Set([
  "diagnostics:loom:cumulative-validation",
  "diagnostics:loom:pre-mechanics-closeout",
  "diagnostics:loom:diagnostic-hardening",
  "diagnostics:loom:lore-package-completion",
]);

const scripts = Object.entries(packageJson.scripts || {})
  .filter(([name]) => name.startsWith("diagnostics:loom:"))
  .filter(([name]) => !SKIPPED_AGGREGATES.has(name))
  .sort(([left], [right]) => left.localeCompare(right));

if (!scripts.length) {
  console.error("No registered LOOM diagnostics were found.");
  process.exit(1);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const failures = [];
const startedAt = Date.now();

console.log(`Running ${scripts.length} registered LOOM diagnostic commands...`);

for (const [name] of scripts) {
  const commandStartedAt = Date.now();
  const result = spawnSync(npmCommand, ["run", "--silent", name], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 32 * 1024 * 1024,
  });
  const duration = Date.now() - commandStartedAt;

  if (result.status === 0) {
    console.log(`✔ ${name} (${duration}ms)`);
    continue;
  }

  failures.push({
    name,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  });
  console.error(`✘ ${name} (${duration}ms)`);
}

const totalDuration = Date.now() - startedAt;
console.log("");
console.log(`LOOM cumulative diagnostics: ${scripts.length - failures.length}/${scripts.length} passed in ${totalDuration}ms.`);

if (failures.length) {
  console.error("");
  console.error(`${failures.length} diagnostic command(s) failed:`);
  for (const failure of failures) {
    console.error(`\n--- ${failure.name} (exit ${failure.status}) ---`);
    if (failure.stdout.trim()) console.error(failure.stdout.trim());
    if (failure.stderr.trim()) console.error(failure.stderr.trim());
  }
  process.exit(1);
}
