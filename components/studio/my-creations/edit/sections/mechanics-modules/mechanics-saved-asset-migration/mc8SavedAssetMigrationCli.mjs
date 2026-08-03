import fs from "node:fs";
import path from "node:path";

import {
  analyzeMechanicsSavedAssetMigration,
  applyMechanicsSavedAssetMigration,
} from "./mechanicsSavedAssetMigration.js";

function parseArgs(argv) {
  const options = {
    input: "",
    output: "",
    apply: false,
    confirm: false,
    allowInvocationSynthesis: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--input") options.input = argv[++index] || "";
    else if (value === "--output") options.output = argv[++index] || "";
    else if (value === "--apply") options.apply = true;
    else if (value === "--confirm") options.confirm = true;
    else if (value === "--allow-invocation-synthesis") {
      options.allowInvocationSynthesis = true;
    }
  }

  return options;
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const options = parseArgs(process.argv.slice(2));
if (!options.input) {
  fail(
    "Usage: node mc8SavedAssetMigrationCli.mjs --input <mechanics.json> [--apply --confirm --output <normalized.json>] [--allow-invocation-synthesis]"
  );
} else {
  const inputPath = path.resolve(options.input);
  if (!fs.existsSync(inputPath)) {
    fail(`Input file not found: ${inputPath}`);
  } else {
    let value;
    try {
      value = JSON.parse(fs.readFileSync(inputPath, "utf8"));
    } catch (error) {
      fail(`Input JSON could not be parsed: ${error?.message || error}`);
    }

    if (value !== undefined && process.exitCode !== 1) {
      const result = options.apply
        ? applyMechanicsSavedAssetMigration({
            value,
            confirmed: options.confirm,
            allowInvocationSynthesis: options.allowInvocationSynthesis,
          })
        : analyzeMechanicsSavedAssetMigration(value, {
            allowInvocationSynthesis: options.allowInvocationSynthesis,
          });

      console.log(
        JSON.stringify(
          {
            version: result.version,
            status: result.status,
            changed: result.changed,
            applyAllowed: result.applyAllowed,
            changedPathCount: result.changedPathCount || 0,
            changedPaths: result.changedPaths,
            notices: result.notices,
            explicitActions: result.explicitActions,
            validation: result.validation,
          },
          null,
          2
        )
      );

      if (options.apply && result.data) {
        if (!options.output) {
          fail("--output is required when --apply produces replacement data.");
        } else {
          const outputPath = path.resolve(options.output);
          if (outputPath === inputPath) {
            fail("MC8B refuses to overwrite the input file. Choose a new --output path.");
          } else if (fs.existsSync(outputPath)) {
            fail(`Output file already exists: ${outputPath}`);
          } else {
            fs.writeFileSync(outputPath, `${JSON.stringify(result.data, null, 2)}\n`);
            console.log(`Wrote normalized copy: ${outputPath}`);
          }
        }
      }

      if (["REJECTED", "NOT_APPLICABLE", "EXPLICIT_ACTION_REQUIRED"].includes(result.status)) {
        process.exitCode = 1;
      }
    }
  }
}
