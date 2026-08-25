import fs from "node:fs/promises";
import path from "node:path";

import {
  buildFrontier250TurnQualificationReport,
  renderFrontier250TurnQualificationReportMarkdown,
} from "./frontierArchitectureQualification250Report.js";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function requiredEnv(name) {
  const value = normalizeString(process.env[name]);
  if (!value) throw Object.assign(new Error(`${name} is required.`), { code: "FRONTIER_250_TURN_REPORT_ENV_REQUIRED", name });
  return value;
}
async function readJson(file) {
  return JSON.parse(await fs.readFile(path.resolve(file), "utf8"));
}
async function writeText(file, value) {
  const resolved = path.resolve(file);
  await fs.writeFile(resolved, value, "utf8");
  return resolved;
}

async function main() {
  const freeze = await readJson(requiredEnv("CRESTFALL_FRONTIER_EVALUATION_FREEZE_JSON"));
  const confirmatoryComparisonFamily = await readJson(requiredEnv("CRESTFALL_FRONTIER_CONFIRMATORY_FAMILY_JSON"));
  const executionPreflight = await readJson(requiredEnv("CRESTFALL_FRONTIER_250_EXECUTION_PREFLIGHT_JSON"));
  const manifest = await readJson(requiredEnv("CRESTFALL_FRONTIER_250_SCORED_EXECUTION_MANIFEST_JSON"));
  const checkpoint = await readJson(requiredEnv("CRESTFALL_FRONTIER_250_SCORED_CHECKPOINT_JSON"));
  const jsonOutput = path.resolve(
    normalizeString(process.env.CRESTFALL_FRONTIER_250_TURN_REPORT_OUTPUT) ||
      "frontier-250-turn-qualification-report-v0.json"
  );
  const markdownOutput = path.resolve(
    normalizeString(process.env.CRESTFALL_FRONTIER_250_TURN_REPORT_MARKDOWN_OUTPUT) ||
      "frontier-250-turn-qualification-report-v0.md"
  );

  const report = buildFrontier250TurnQualificationReport({
    freeze,
    confirmatoryComparisonFamily,
    executionPreflight,
    manifest,
    checkpoint,
  });
  await writeText(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  await writeText(markdownOutput, renderFrontier250TurnQualificationReportMarkdown(report));

  console.log("Crestfall Frontier W11T 250-Turn Confirmatory Qualification Report");
  console.log(`freeze: ${report.evaluationFreezeSha256}`);
  console.log(`confirmatory family: ${report.confirmatoryComparisonFamilySha256}`);
  console.log(`execution preflight: ${report.executionPreflightSha256}`);
  console.log(`execution manifest: ${report.scoredExecutionManifestSha256}`);
  console.log(`checkpoint: ${report.checkpointSha256}`);
  console.log(`report: ${report.qualificationReportSha256}`);
  console.log(`scored tasks: ${report.taskCount}`);
  console.log(`manual repairs: ${report.manualRepairCount}`);
  console.log(`retried tasks: ${report.providerRetryTaskCount}`);
  console.log(`V4 summary active: ${report.mechanismActivation.v4SummaryActiveAt250Turns}`);
  console.log(`V5 retrieval active: ${report.mechanismActivation.v5RetrievalActiveAt250Turns}`);
  console.log(`Holm superiority decisions: ${report.confirmatoryDecisions.superiorityDemonstratedCount}/${report.confirmatoryFamily.superiorityHypothesisCount}`);
  console.log(`hard-correctness noninferior: ${report.confirmatoryDecisions.hardCorrectnessNonInferiorCount}/${report.confirmatoryFamily.hardCorrectnessNonInferiorityHypothesisCount}`);
  console.log(`hard-correctness inferior: ${report.confirmatoryDecisions.hardCorrectnessInferiorCount}`);
  console.log(`hard-correctness inconclusive: ${report.confirmatoryDecisions.hardCorrectnessInconclusiveCount}`);
  console.log(`json: ${jsonOutput}`);
  console.log(`markdown: ${markdownOutput}`);
  console.log("provider calls: 0");
  console.log("post-freeze retuning: forbidden");
}

main().catch((error) => {
  console.error("FRONTIER W11T 250-TURN REPORT FAILED");
  console.error(error);
  process.exitCode = 1;
});
