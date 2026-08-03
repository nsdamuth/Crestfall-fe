import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { MECHANICS_M0_EXTERNAL_REPOSITORIES } from "./mechanicsCompatibilityBaselineManifest.js";

const requireAll = process.argv.includes("--require");
const failures = [];
console.log("Crestfall Mechanics M0 cross-service repository gate\n");
for (const repository of MECHANICS_M0_EXTERNAL_REPOSITORIES) {
  const root = String(process.env[repository.environmentVariable] || "").trim();
  if (!root) {
    console.log(`DEFERRED ${repository.id}: set ${repository.environmentVariable} to ${repository.repositoryHint}.`);
    if (requireAll) failures.push(`${repository.id}: environment variable is not set`);
    continue;
  }
  const missing = repository.requiredPaths.filter((relativePath) => !fs.existsSync(path.resolve(root, relativePath)));
  if (missing.length) {
    console.log(`INCOMPLETE ${repository.id}: ${root}`);
    missing.forEach((relativePath) => console.log(`  missing ${relativePath}`));
    failures.push(`${repository.id}: ${missing.length} required path(s) missing`);
    continue;
  }
  console.log(`READY ${repository.id}: ${root}`);
  console.log(`  command: ${repository.requiredCommand}`);
}
if (failures.length) {
  console.error("");
  failures.forEach((failure) => console.error(`ERROR ${failure}`));
  process.exit(1);
}
