import assert from "node:assert/strict";
import crypto from "node:crypto";

import { hashFrontierBenchmarkValue } from "./frontierArchitectureBenchmark.js";
import { buildFrontierArchitectureStateControlPlaneContractHash } from "./frontierArchitectureStateControlPlane.js";
import { buildFrontierCanonicalCorpusChecksums } from "./frontierArchitectureBenchmarkFixture.mjs";
import {
  FRONTIER_V4_MEASURED_SUMMARY_PROMPT_VERSION,
  FRONTIER_V5_MEASURED_QUERY_CONSTRUCTOR_VERSION,
  FRONTIER_V5_MEASURED_RETRIEVAL_METHOD,
} from "./frontierArchitectureMeasuredCalibration.js";
import {
  buildFrontier250TurnQualificationExecutionPlan,
  buildFrontier250TurnQualificationPackage,
  buildFrontierConfirmatoryComparisonFamily,
} from "./frontierArchitectureQualification250Foundation.js";
import { buildFrontier250TurnExecutionPreflight } from "./frontierArchitectureQualification250ExecutionPreflight.js";
import {
  buildFrontier250TurnScoredExecutionManifest,
  buildFrontier250TurnTaskPrompt,
  buildFrontier250TurnScoredResultRow,
  buildFrontier250TurnCheckpoint,
} from "./frontierArchitectureQualification250ScoredExecution.js";
import {
  buildFrontier250TurnQualificationReport,
  renderFrontier250TurnQualificationReportMarkdown,
  validateFrontier250TurnQualificationCompletedInputs,
} from "./frontierArchitectureQualification250Report.js";

function sha(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}
function fakeVector(text, dimensions = 16) {
  const bytes = crypto.createHash("sha256").update(String(text)).digest();
  return Array.from({ length: dimensions }, (_, index) => (bytes[index % bytes.length] - 127.5) / 127.5);
}

const v123Core = {
  version: "frontier_v123_comparator_calibration_v1_provider_measured",
  phase: "CALIBRATION_COMPLETE",
  v2: { selectedRecentMessageCount: 144, recentTranscriptBudgetTokens: 21802 },
  v3: { recentTranscriptBudgetTokens: 21802 },
  postQualificationRetuningAllowed: false,
};
const v123 = { ...v123Core, calibrationSha256: hashFrontierBenchmarkValue(v123Core) };
const v45Core = {
  version: "frontier_v45_comparator_calibration_v1_provider_measured",
  phase: "CALIBRATION_COMPLETE",
  measurementSource: "PROVIDER_REPORTED_USAGE",
  v4: {
    summaryBudgetTokens: 256,
    recentTailBudgetTokens: 21802,
    selectedRecentMessageCount: 144,
    summaryPromptVersion: FRONTIER_V4_MEASURED_SUMMARY_PROMPT_VERSION,
  },
  v5: {
    recentTailBudgetTokens: 20826,
    selectedRecentMessageCount: 144,
    retrievalTopK: 2,
    chunkTargetTokens: 1224,
    retrievalMethod: FRONTIER_V5_MEASURED_RETRIEVAL_METHOD,
    queryConstructorVersion: FRONTIER_V5_MEASURED_QUERY_CONSTRUCTOR_VERSION,
  },
  postQualificationRetuningAllowed: false,
};
const v45 = { ...v45Core, calibrationSha256: hashFrontierBenchmarkValue(v45Core) };
const freeze = {
  evaluationFreezeSha256: sha("w11t-freeze"),
  manifestSha256: sha("w11t-manifest"),
  stateControlPlaneSha256: buildFrontierArchitectureStateControlPlaneContractHash(),
  pricingSnapshotSha256: sha("w11t-pricing"),
  pricingSnapshot: {
    cacheHitInputPerMillion: 0.0028,
    cacheMissInputPerMillion: 0.14,
    outputPerMillion: 0.28,
  },
  manifest: {
    model: { provider: "deepseek", model: "deepseek-v4-flash", version: "DeepSeek-V4-Flash-0731" },
    generationSettings: { temperature: 0.8, maxTokens: 700 },
  },
};
const reportHash = sha("w11p-report-before-250-results");
const confirmatory = buildFrontierConfirmatoryComparisonFamily({
  evaluationFreezeSha256: freeze.evaluationFreezeSha256,
  fiftyTurnQualificationReportSha256: reportHash,
});
const qualificationPackage = buildFrontier250TurnQualificationPackage({
  evaluationFreezeSha256: freeze.evaluationFreezeSha256,
  manifestSha256: freeze.manifestSha256,
  stateControlPlaneSha256: freeze.stateControlPlaneSha256,
  fiftyTurnQualificationReportSha256: reportHash,
  confirmatoryComparisonFamily: confirmatory,
  frozenCorpusChecksums: buildFrontierCanonicalCorpusChecksums(),
  v123CalibrationSha256: v123.calibrationSha256,
  v45CalibrationSha256: v45.calibrationSha256,
  v4SelectedRecentMessageCount: v45.v4.selectedRecentMessageCount,
  v5SelectedRecentMessageCount: v45.v5.selectedRecentMessageCount,
});
const plan = buildFrontier250TurnQualificationExecutionPlan({
  qualificationPackage,
  confirmatoryComparisonFamily: confirmatory,
});
let summaryCalls = 0;
const preflight = await buildFrontier250TurnExecutionPreflight({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  qualificationPackage,
  plan,
  v45Calibration: v45,
  summarizeEvictedHistory: async ({ seed, throughTurn, previousSummary, newlyEvictedMessages }) => {
    summaryCalls += 1;
    return {
      text: `Summary ${seed} through ${throughTurn}; previous=${sha(previousSummary).slice(0, 8)}; newly=${newlyEvictedMessages.map((m) => m.id).join(",")}`,
      inputTokens: newlyEvictedMessages.length * 10,
      outputTokens: 64,
      durationMs: 2,
      providerRequestId: `summary-${summaryCalls}`,
    };
  },
  embedTexts: async ({ texts }) => ({
    vectors: texts.map((text) => fakeVector(text)),
    durationMs: 3,
    httpBatchCount: 1,
  }),
});
const manifest = buildFrontier250TurnScoredExecutionManifest({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  qualificationPackage,
  plan,
  executionPreflight: preflight,
  v123Calibration: v123,
  v45Calibration: v45,
});

function correctAnswer(probe) {
  if (probe?.family === "WITNESS_BOUNDARY" && probe?.expected?.expectedEpistemicStatus === "NOT_KNOWN") {
    return "BENCHMARK_ANSWER: I do not know; I did not witness or receive that information.";
  }
  const required = Array.isArray(probe?.expected?.requiredTerms) ? probe.expected.requiredTerms.filter(Boolean) : [];
  return `BENCHMARK_ANSWER: ${required.length ? required.join(" ") : "no unsupported claim"}`;
}

const results = manifest.tasks.map((task, index) => {
  const built = buildFrontier250TurnTaskPrompt({ task, executionPreflight: preflight, v123Calibration: v123 });
  const comparatorFailure =
    task.variantId !== "V6_CRESTFALL_BOUNDED_STATE_RETRIEVAL" &&
    ((index % 11 === 0) || (task.family === "STATE_SUPERSESSION" && index % 7 === 0));
  return buildFrontier250TurnScoredResultRow({
    task,
    probe: built.probe,
    providerResult: {
      provider: "deepseek",
      providerModel: "deepseek-v4-flash",
      providerRequestId: `w11t-diag-${index}`,
      outputText: comparatorFailure
        ? "BENCHMARK_ANSWER: unsupported incorrect response"
        : correctAnswer(built.probe),
      finishReason: "stop",
      usage: {
        inputTokens: 2000 + index,
        outputTokens: 24,
        raw: {
          prompt_tokens: 2000 + index,
          completion_tokens: 24,
          prompt_cache_hit_tokens: 500,
          prompt_cache_miss_tokens: 1500 + index,
        },
      },
      timing: { durationMs: 900 + (index % 173) },
    },
    attemptCount: 1,
  });
});
const checkpoint = buildFrontier250TurnCheckpoint({ manifest, results, phase: "COMPLETE" });
assert.equal(checkpoint.completedCount, 1200);
assert.equal(validateFrontier250TurnQualificationCompletedInputs({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  executionPreflight: preflight,
  manifest,
  checkpoint,
}).valid, true);

const report = buildFrontier250TurnQualificationReport({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  executionPreflight: preflight,
  manifest,
  checkpoint,
});
const reportAgain = buildFrontier250TurnQualificationReport({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  executionPreflight: preflight,
  manifest,
  checkpoint,
});
assert.equal(report.qualificationReportSha256, reportAgain.qualificationReportSha256);
assert.equal(report.taskCount, 1200);
assert.equal(report.variants.length, 6);
assert.equal(report.v6ConfirmatoryComparisons.length, 40);
assert.equal(report.confirmatoryFamily.holmFamilySize, 40);
assert.equal(report.confirmatoryFamily.hardCorrectnessNonInferiorityHypothesisCount, 35);
assert.equal(report.primaryDecisionUsesCompositeScore, false);
assert.equal(report.statisticalPreregistration.bootstrap.replicates, 10000);
assert.equal(report.mechanismActivation.v4SummaryActiveAt250Turns, true);
assert.equal(report.mechanismActivation.v5RetrievalActiveAt250Turns, true);
assert.equal(report.variants.every((entry) => entry.taskCount === 200), true);
assert.equal(
  report.variants.every((entry) => Object.values(entry.primaryMetrics).every((metric) => metric.denominator === 25)),
  true
);
assert.equal(
  report.v6ConfirmatoryComparisons.every((entry) => entry.pairedObservationCount === 25 && entry.fixtureSeedCount === 5),
  true
);
assert.equal(
  report.v6ConfirmatoryComparisons.every((entry) => Number.isFinite(entry.holmAdjustedPValue)),
  true
);
assert.equal(
  report.v6ConfirmatoryComparisons.filter((entry) => entry.nonInferiorityMargin !== null).length,
  35
);
assert.equal(
  report.confirmatoryDecisions.hardCorrectnessNonInferiorCount +
    report.confirmatoryDecisions.hardCorrectnessInferiorCount +
    report.confirmatoryDecisions.hardCorrectnessInconclusiveCount,
  35
);
assert.equal(report.claims.confirmatoryFamilyFrozenBefore250Results, true);
assert.equal(report.claims.superiorityUsesHolmAdjustedEvidence, true);
assert.equal(report.claims.postFreezeRetuningAllowed, false);
assert.equal(report.supportOperational.v4RunningSummary.providerCallCount, summaryCalls);
assert.ok(report.supportOperational.v5Retrieval.embeddingLogicalCallCount > 0);
assert.equal(report.failureAudit.rawProviderOutputIncluded, false);
assert.equal(JSON.stringify(report).includes("unsupported incorrect response"), false);
assert.ok(renderFrontier250TurnQualificationReportMarkdown(report).includes("250-Turn Six-Architecture Confirmatory Qualification"));

const tampered = structuredClone(checkpoint);
tampered.results[0].outputText = "tampered";
assert.equal(validateFrontier250TurnQualificationCompletedInputs({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  executionPreflight: preflight,
  manifest,
  checkpoint: tampered,
}).valid, false);

const scorerDrift = structuredClone(checkpoint);
scorerDrift.results[0].score.correct = !scorerDrift.results[0].score.correct;
const rowCore = structuredClone(scorerDrift.results[0]);
delete rowCore.scoredResultSha256;
scorerDrift.results[0].scoredResultSha256 = hashFrontierBenchmarkValue(rowCore);
const checkpointCore = structuredClone(scorerDrift);
delete checkpointCore.checkpointSha256;
scorerDrift.checkpointSha256 = hashFrontierBenchmarkValue(checkpointCore);
const driftValidation = validateFrontier250TurnQualificationCompletedInputs({
  freeze,
  confirmatoryComparisonFamily: confirmatory,
  executionPreflight: preflight,
  manifest,
  checkpoint: scorerDrift,
});
assert.equal(driftValidation.valid, false);
assert.equal(driftValidation.errors.some((entry) => entry.startsWith("score.")), true);

console.log(JSON.stringify({
  diagnostic: "frontier_250_turn_confirmatory_qualification_report_v0",
  status: "PASSED",
  complete1200TaskCheckpointRequired: true,
  checkpointHashReverified: true,
  scoredRowHashesReverified: true,
  frozenDeterministicScoresRecomputed: true,
  scorerDriftRejectedEvenWhenRowAndCheckpointRehashed: true,
  sixArchitectureMetricVectorsProduced: true,
  eightPrimaryStructuredMetricsRemainSeparate: true,
  compositeWinnerScoreUsed: false,
  twentyFiveObservationsPerMetricPerArchitectureAt250Turns: true,
  pairedHierarchicalClusterBootstrapReplicates: 10000,
  frozenFortyHypothesisConfirmatoryFamilyRequired: true,
  holmCorrectionAppliedAcrossAllFortySuperiorityHypotheses: true,
  frozenThirtyFiveHardCorrectnessNonInferiorityDecisionsProduced: true,
  hardCorrectnessNonInferiorityMargin: 0.02,
  v4SummaryActiveAt250TurnsRecorded: true,
  v5RetrievalActiveAt250TurnsRecorded: true,
  latencyTokenCacheAndGeneratorCostEvidenceProduced: true,
  v4SummarySupportUsageReported: true,
  v5RetrievalSupportUsageReported: true,
  v2CounterfactualNoCacheCostControlProduced: true,
  v2V3ProviderLatencyDifferenceClaimAllowed: false,
  rawProviderOutputsExcludedFromAggregateReport: true,
  providerCallsMadeByReport: false,
  postFreezeRetuningAllowed: false,
  runtimeBehaviorChanged: false,
  crestfallFeChanged: false,
}, null, 2));
