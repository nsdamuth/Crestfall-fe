import {
  FRONTIER_ARCHITECTURE_FIXTURE_SEEDS,
  FRONTIER_ARCHITECTURE_PRIMARY_STRUCTURED_METRICS,
  FRONTIER_ARCHITECTURE_STATISTICAL_PREREGISTRATION,
  FRONTIER_ARCHITECTURE_VARIANTS,
  hashFrontierBenchmarkValue,
  stableFrontierBenchmarkJson,
} from "./frontierArchitectureBenchmark.js";
import {
  FRONTIER_50_TURN_PROBE_FAMILIES,
} from "./frontierArchitectureQualificationMaterialization.js";
import {
  scoreFrontier50TurnProbeResponse,
} from "./frontierArchitectureQualificationScoring.js";
import {
  buildFrontier250TurnProbeSet,
  validateFrontierConfirmatoryComparisonFamily,
} from "./frontierArchitectureQualification250Foundation.js";
import {
  validateFrontier250TurnExecutionPreflight,
} from "./frontierArchitectureQualification250ExecutionPreflight.js";
import {
  validateFrontier250TurnCheckpoint,
} from "./frontierArchitectureQualification250ScoredExecution.js";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function finiteNullable(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
function percentile(values, percentileValue) {
  const sorted = (Array.isArray(values) ? values : [])
    .map(finiteNullable)
    .filter((value) => value !== null)
    .sort((a, b) => a - b);
  if (!sorted.length) return null;
  if (sorted.length === 1) return sorted[0];
  const rank = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentileValue * sorted.length) - 1));
  return sorted[rank];
}
function distribution(values) {
  const known = (Array.isArray(values) ? values : [])
    .map(finiteNullable)
    .filter((value) => value !== null);
  return {
    sampleCount: known.length,
    p50: percentile(known, 0.5),
    p90: percentile(known, 0.9),
    p95: percentile(known, 0.95),
    max: known.length ? Math.max(...known) : null,
  };
}
function sumKnown(values) {
  const known = (Array.isArray(values) ? values : [])
    .map(finiteNullable)
    .filter((value) => value !== null);
  return known.length ? known.reduce((sum, value) => sum + value, 0) : null;
}
function round(value, digits = 8) {
  if (!Number.isFinite(Number(value))) return null;
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}
function recordHash(record, hashField) {
  const clone = structuredClone(normalizeObject(record));
  delete clone[hashField];
  return hashFrontierBenchmarkValue(clone);
}
function assertHashBoundRecord(record, hashField, label, code) {
  const value = normalizeObject(record);
  const declared = normalizeString(value[hashField]);
  const recomputed = recordHash(value, hashField);
  if (!/^[a-f0-9]{64}$/.test(declared) || declared !== recomputed) {
    throw Object.assign(new Error(`${label} hash is invalid.`), { code, declared: declared || null, recomputed });
  }
  return value;
}

const METRIC_DEFINITIONS = Object.freeze({
  fact_recall_accuracy: Object.freeze({
    family: "FACT_RECALL",
    direction: "HIGHER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 1 : 0),
    numeratorLabel: "correct",
  }),
  wrong_recall_rate: Object.freeze({
    family: "WRONG_RECALL",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 0 : 1),
    numeratorLabel: "wrongRecallErrors",
  }),
  hard_state_violation_rate: Object.freeze({
    family: "HARD_STATE",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 0 : 1),
    numeratorLabel: "hardStateViolations",
  }),
  agency_attribution_error_rate: Object.freeze({
    family: "AGENCY_ATTRIBUTION",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 0 : 1),
    numeratorLabel: "agencyAttributionErrors",
  }),
  witness_boundary_leakage_rate: Object.freeze({
    family: "WITNESS_BOUNDARY",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.outcome === "WITNESS_LEAK" ? 1 : 0),
    numeratorLabel: "witnessLeaks",
  }),
  presence_error_rate: Object.freeze({
    family: "PRESENCE",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 0 : 1),
    numeratorLabel: "presenceErrors",
  }),
  relationship_edge_error_rate: Object.freeze({
    family: "RELATIONSHIP_EDGE",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 0 : 1),
    numeratorLabel: "relationshipEdgeErrors",
  }),
  state_supersession_error_rate: Object.freeze({
    family: "STATE_SUPERSESSION",
    direction: "LOWER_IS_BETTER",
    valueForRow: (row) => (row?.score?.correct ? 0 : 1),
    numeratorLabel: "stateSupersessionErrors",
  }),
});
const HARD_NONINFERIORITY_METRICS = new Set([
  "wrong_recall_rate",
  "hard_state_violation_rate",
  "agency_attribution_error_rate",
  "witness_boundary_leakage_rate",
  "presence_error_rate",
  "relationship_edge_error_rate",
  "state_supersession_error_rate",
]);

function rowMetricValue(row, metric) {
  const definition = METRIC_DEFINITIONS[metric];
  if (!definition || row?.family !== definition.family) return null;
  return Number(definition.valueForRow(row));
}
function summarizeMetric(rows, metric) {
  const definition = METRIC_DEFINITIONS[metric];
  const values = rows
    .filter((row) => row?.family === definition.family)
    .map((row) => rowMetricValue(row, metric));
  const numerator = values.reduce((sum, value) => sum + value, 0);
  const denominator = values.length;
  return {
    metric,
    family: definition.family,
    direction: definition.direction,
    numeratorLabel: definition.numeratorLabel,
    numerator,
    denominator,
    value: denominator ? numerator / denominator : null,
  };
}
function costForRow(row, pricing) {
  const input = finiteNullable(row?.usage?.inputTokens);
  const output = finiteNullable(row?.usage?.outputTokens);
  const hit = finiteNullable(row?.usage?.cacheReadTokens);
  const miss = finiteNullable(row?.usage?.cacheMissTokens);
  const hitPrice = finiteNullable(pricing?.cacheHitInputPerMillion);
  const missPrice = finiteNullable(pricing?.cacheMissInputPerMillion);
  const outputPrice = finiteNullable(pricing?.outputPerMillion);
  const counterfactualNoCache =
    input !== null && output !== null && missPrice !== null && outputPrice !== null
      ? (input * missPrice + output * outputPrice) / 1_000_000
      : null;
  let actual = null;
  if (
    output !== null && hit !== null && miss !== null && hitPrice !== null &&
    missPrice !== null && outputPrice !== null
  ) {
    actual = (hit * hitPrice + miss * missPrice + output * outputPrice) / 1_000_000;
  }
  return { actual, counterfactualNoCache };
}
function summarizeOperational(rows, pricing, variantId) {
  const costs = rows.map((row) => costForRow(row, pricing));
  const actualKnown = costs.map((entry) => entry.actual).filter((value) => value !== null);
  const noCacheKnown = costs.map((entry) => entry.counterfactualNoCache).filter((value) => value !== null);
  const attempts = rows.map((row) => finiteNullable(row?.attemptCount)).filter((value) => value !== null);
  return {
    taskCount: rows.length,
    usage: {
      inputTokens: sumKnown(rows.map((row) => row?.usage?.inputTokens)),
      outputTokens: sumKnown(rows.map((row) => row?.usage?.outputTokens)),
      cacheReadTokens: sumKnown(rows.map((row) => row?.usage?.cacheReadTokens)),
      cacheMissTokens: sumKnown(rows.map((row) => row?.usage?.cacheMissTokens)),
      inputTokenCoverageRows: rows.filter((row) => finiteNullable(row?.usage?.inputTokens) !== null).length,
      outputTokenCoverageRows: rows.filter((row) => finiteNullable(row?.usage?.outputTokens) !== null).length,
      cacheReadCoverageRows: rows.filter((row) => finiteNullable(row?.usage?.cacheReadTokens) !== null).length,
      cacheMissCoverageRows: rows.filter((row) => finiteNullable(row?.usage?.cacheMissTokens) !== null).length,
    },
    latencyMs: distribution(rows.map((row) => row?.timing?.durationMs)),
    providerAttempts: {
      total: attempts.length ? attempts.reduce((sum, value) => sum + value, 0) : null,
      retriedTaskCount: rows.filter((row) => Number(row?.attemptCount) > 1).length,
      maxAttempts: attempts.length ? Math.max(...attempts) : null,
    },
    costUsd: {
      actualProviderNative:
        actualKnown.length === rows.length ? round(actualKnown.reduce((sum, value) => sum + value, 0), 10) : null,
      actualProviderNativeCoverageRows: actualKnown.length,
      counterfactualAllInputCacheMiss:
        noCacheKnown.length === rows.length ? round(noCacheKnown.reduce((sum, value) => sum + value, 0), 10) : null,
      counterfactualCoverageRows: noCacheKnown.length,
      v2RequiredCostControl:
        variantId === "V2_FIXED_TRUNCATED_WINDOW" ? "COUNTERFACTUAL_NO_CACHE_COST_CONTROL" : null,
      v2V3ProviderLatencyDifferenceClaimAllowed: false,
    },
  };
}
function supportOperational(executionPreflight, pricing) {
  const summaryUsage = normalizeObject(executionPreflight?.v4?.providerUsage);
  const input = finiteNullable(summaryUsage.inputTokens);
  const output = finiteNullable(summaryUsage.outputTokens);
  const missPrice = finiteNullable(pricing?.cacheMissInputPerMillion);
  const outputPrice = finiteNullable(pricing?.outputPerMillion);
  const v4AllMissCost = input !== null && output !== null && missPrice !== null && outputPrice !== null
    ? round((input * missPrice + output * outputPrice) / 1_000_000, 10)
    : null;
  const chunkDurations = (Array.isArray(executionPreflight?.v5?.chunkEmbeddingEvidence)
    ? executionPreflight.v5.chunkEmbeddingEvidence
    : []).map((row) => row?.durationMs);
  const queryDurations = (Array.isArray(executionPreflight?.v5?.promptRows)
    ? executionPreflight.v5.promptRows
    : []).map((row) => row?.queryEmbeddingDurationMs);
  return {
    v4RunningSummary: {
      providerCallCount: Number(executionPreflight?.v4?.summaryProviderCallCount) || 0,
      inputTokens: input,
      outputTokens: output,
      medianDurationMs: finiteNullable(summaryUsage.medianDurationMs),
      actualProviderNativeCostUsd: null,
      counterfactualAllInputCacheMissCostUsd: v4AllMissCost,
      actualCostNullReason: "PRECHECKPOINT_SUMMARY_USAGE_DID_NOT_PERSIST_CACHE_HIT_MISS_SPLIT",
    },
    v5Retrieval: {
      retrievalQueryCount: Number(executionPreflight?.v5?.retrievalQueryCount) || 0,
      embeddingLogicalCallCount: Number(executionPreflight?.v5?.embeddingLogicalCallCount) || 0,
      embeddingInputCount: Number(executionPreflight?.v5?.embeddingInputCount) || 0,
      uniqueChunkEmbeddingCount: Number(executionPreflight?.v5?.uniqueChunkEmbeddingCount) || 0,
      chunkEmbeddingLatencyMs: distribution(chunkDurations),
      queryEmbeddingLatencyMs: distribution(queryDurations),
      embeddingProviderCostUsd: null,
      embeddingProviderCostNullReason: "FROZEN_PRICING_SNAPSHOT_HAS_NO_RUNPOD_EMBEDDING_UNIT_PRICE",
    },
  };
}

function seedFromHex(hex) {
  const normalized = normalizeString(hex).replace(/[^a-f0-9]/gi, "").slice(0, 16).padEnd(16, "0");
  let state = 0n;
  for (const char of normalized) state = (state << 4n) | BigInt(parseInt(char, 16));
  return state || 1n;
}
function createDeterministicRng(seedHex) {
  let state = seedFromHex(seedHex) & ((1n << 64n) - 1n);
  return () => {
    state ^= state >> 12n;
    state ^= (state << 25n) & ((1n << 64n) - 1n);
    state ^= state >> 27n;
    state &= (1n << 64n) - 1n;
    const out = (state * 2685821657736338717n) & ((1n << 64n) - 1n);
    return Number(out >> 11n) / 9007199254740992;
  };
}
function pairedProbeKey(row) {
  const parts = String(row?.probeId || "").split(":");
  return `${row?.fixtureSeed}:${parts.slice(1).join(":")}`;
}
function buildPairedObservations({ v6Rows, comparatorRows, metric }) {
  const family = METRIC_DEFINITIONS[metric].family;
  const v6ByKey = new Map(v6Rows.filter((row) => row?.family === family).map((row) => [pairedProbeKey(row), row]));
  const comparatorByKey = new Map(comparatorRows.filter((row) => row?.family === family).map((row) => [pairedProbeKey(row), row]));
  const groups = [];
  for (const seed of FRONTIER_ARCHITECTURE_FIXTURE_SEEDS) {
    const pairs = [];
    for (const [key, v6] of v6ByKey.entries()) {
      if (!key.startsWith(`${seed}:`)) continue;
      const comparator = comparatorByKey.get(key);
      if (!comparator) continue;
      const v6Value = rowMetricValue(v6, metric);
      const comparatorValue = rowMetricValue(comparator, metric);
      const favorableDifference = METRIC_DEFINITIONS[metric].direction === "HIGHER_IS_BETTER"
        ? v6Value - comparatorValue
        : comparatorValue - v6Value;
      pairs.push({ key, favorableDifference });
    }
    pairs.sort((left, right) => left.key.localeCompare(right.key));
    groups.push({ seed, pairs });
  }
  return groups;
}
function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}
function hierarchicalBootstrap({ seedGroups, replicates, seedMaterial }) {
  const rng = createDeterministicRng(seedMaterial);
  const values = [];
  for (let replicate = 0; replicate < replicates; replicate += 1) {
    const sampled = [];
    for (let seedIndex = 0; seedIndex < seedGroups.length; seedIndex += 1) {
      const selectedSeed = seedGroups[Math.floor(rng() * seedGroups.length)];
      const candidates = selectedSeed.pairs;
      if (!candidates.length) continue;
      for (let probeIndex = 0; probeIndex < candidates.length; probeIndex += 1) {
        sampled.push(candidates[Math.floor(rng() * candidates.length)].favorableDifference);
      }
    }
    values.push(mean(sampled) ?? 0);
  }
  return values;
}
// This exact descriptive bootstrap p-value construction was implemented in W11P before 250-turn results existed.
function centeredBootstrapPValue(distributionValues, observed) {
  if (!distributionValues.length || !Number.isFinite(observed)) return null;
  let extreme = 0;
  for (const value of distributionValues) {
    if (Math.abs(value - observed) >= Math.abs(observed)) extreme += 1;
  }
  return Math.min(1, (extreme + 1) / (distributionValues.length + 1));
}
function holmAdjust(comparisons, alpha) {
  const sortable = comparisons
    .map((entry, index) => ({ index, p: finiteNullable(entry.bootstrapTwoSidedPValue) }))
    .filter((entry) => entry.p !== null)
    .sort((a, b) => a.p - b.p || a.index - b.index);
  const m = sortable.length;
  let runningMax = 0;
  const adjusted = new Array(comparisons.length).fill(null);
  for (let rank = 0; rank < sortable.length; rank += 1) {
    const current = sortable[rank];
    runningMax = Math.max(runningMax, Math.min(1, (m - rank) * current.p));
    adjusted[current.index] = round(runningMax);
  }
  return comparisons.map((entry, index) => {
    const holmAdjustedPValue = adjusted[index];
    const superiorityDemonstrated =
      holmAdjustedPValue !== null && holmAdjustedPValue <= alpha &&
      Number(entry.pointEstimateAdvantage) > 0 && Number(entry.bootstrap.ciLower) > 0;
    return {
      ...entry,
      holmAdjustedPValue,
      superiorityDecision: superiorityDemonstrated ? "V6_SUPERIOR" : "SUPERIORITY_NOT_DEMONSTRATED",
      inferentialClaimAllowed: true,
    };
  });
}
function buildConfirmatoryComparisons(rows, confirmatoryComparisonFamily, reportSeed) {
  const v6Id = confirmatoryComparisonFamily.referenceVariantId;
  const v6Rows = rows.filter((row) => row.variantId === v6Id);
  const hypothesisByKey = new Map(
    confirmatoryComparisonFamily.superiority.hypotheses.map((hypothesis) => [
      `${hypothesis.comparatorVariantId}:${hypothesis.metric}`,
      hypothesis,
    ])
  );
  const raw = [];
  for (const comparatorId of confirmatoryComparisonFamily.comparatorVariantIds) {
    const comparatorRows = rows.filter((row) => row.variantId === comparatorId);
    for (const metric of confirmatoryComparisonFamily.primaryStructuredMetrics) {
      const hypothesis = hypothesisByKey.get(`${comparatorId}:${metric}`);
      if (!hypothesis) throw Object.assign(new Error(`Missing frozen superiority hypothesis for ${comparatorId}:${metric}.`), {
        code: "FRONTIER_250_REPORT_CONFIRMATORY_HYPOTHESIS_MISSING",
      });
      const seedGroups = buildPairedObservations({ v6Rows, comparatorRows, metric });
      const flat = seedGroups.flatMap((entry) => entry.pairs.map((pair) => pair.favorableDifference));
      const observed = mean(flat);
      const bootstrap = hierarchicalBootstrap({
        seedGroups,
        replicates: confirmatoryComparisonFamily.bootstrap.replicates,
        seedMaterial: hashFrontierBenchmarkValue({ reportSeed, hypothesisId: hypothesis.hypothesisId }),
      });
      const ciLower = percentile(bootstrap, 0.025);
      const ciUpper = percentile(bootstrap, 0.975);
      const pValue = centeredBootstrapPValue(bootstrap, observed);
      const margin = HARD_NONINFERIORITY_METRICS.has(metric)
        ? confirmatoryComparisonFamily.nonInferiority.absoluteMargin
        : null;
      let nonInferiorityDecision = "NOT_APPLICABLE";
      if (margin !== null) {
        if (ciLower !== null && ciLower >= -margin) nonInferiorityDecision = "NON_INFERIOR";
        else if (ciUpper !== null && ciUpper < -margin) nonInferiorityDecision = "INFERIOR";
        else nonInferiorityDecision = "INCONCLUSIVE";
      }
      raw.push({
        hypothesisId: hypothesis.hypothesisId,
        comparison: `${v6Id}_VS_${comparatorId}`,
        referenceVariantId: v6Id,
        comparatorVariantId: comparatorId,
        metric,
        favorableDirection: "POSITIVE_FAVORS_V6",
        pairedObservationCount: flat.length,
        fixtureSeedCount: seedGroups.filter((entry) => entry.pairs.length).length,
        pointEstimateAdvantage: round(observed),
        bootstrap: {
          method: confirmatoryComparisonFamily.bootstrap.method,
          replicates: confirmatoryComparisonFamily.bootstrap.replicates,
          confidenceLevel: confirmatoryComparisonFamily.bootstrap.confidenceLevel,
          ciLower: round(ciLower),
          ciUpper: round(ciUpper),
        },
        bootstrapTwoSidedPValue: round(pValue),
        nonInferiorityMargin: margin,
        nonInferiorityDecision,
      });
    }
  }
  const adjusted = holmAdjust(raw, confirmatoryComparisonFamily.superiority.twoSidedFamilywiseAlpha);
  const niByKey = new Map(
    confirmatoryComparisonFamily.nonInferiority.hypotheses.map((hypothesis) => [
      `${hypothesis.comparatorVariantId}:${hypothesis.metric}`,
      hypothesis,
    ])
  );
  return adjusted.map((entry) => ({
    ...entry,
    nonInferiorityHypothesisId: entry.nonInferiorityMargin !== null
      ? niByKey.get(`${entry.comparatorVariantId}:${entry.metric}`)?.hypothesisId || null
      : null,
  }));
}
function validateFrozenScores(rows) {
  const errors = [];
  const probeCache = new Map();
  for (const seed of FRONTIER_ARCHITECTURE_FIXTURE_SEEDS) {
    probeCache.set(seed, new Map(buildFrontier250TurnProbeSet({ seed }).probes.map((probe) => [probe.probeId, probe])));
  }
  for (const row of rows) {
    const probe = probeCache.get(row?.fixtureSeed)?.get(row?.probeId);
    if (!probe) {
      errors.push(`probe.${row?.taskId || "unknown"}`);
      continue;
    }
    const rescored = scoreFrontier50TurnProbeResponse({ probe, responseText: row?.outputText });
    if (stableFrontierBenchmarkJson(rescored) !== stableFrontierBenchmarkJson(row?.score)) {
      errors.push(`score.${row?.taskId || "unknown"}`);
    }
  }
  return errors;
}
function validateCoverage(rows) {
  const errors = [];
  for (const variant of FRONTIER_ARCHITECTURE_VARIANTS) {
    const variantRows = rows.filter((row) => row.variantId === variant.id);
    if (variantRows.length !== 200) errors.push(`coverage.${variant.id}.total`);
    for (const family of FRONTIER_50_TURN_PROBE_FAMILIES) {
      if (variantRows.filter((row) => row.family === family).length !== 25) {
        errors.push(`coverage.${variant.id}.${family}`);
      }
    }
  }
  return errors;
}

export const FRONTIER_250_TURN_QUALIFICATION_REPORT_VERSION =
  "frontier_250_turn_confirmatory_qualification_report_v0";

export function validateFrontier250TurnQualificationCompletedInputs({
  freeze,
  confirmatoryComparisonFamily,
  executionPreflight,
  manifest,
  checkpoint,
} = {}) {
  const errors = [];
  const familyValidation = validateFrontierConfirmatoryComparisonFamily(confirmatoryComparisonFamily);
  if (!familyValidation.valid) errors.push(...familyValidation.errors.map((entry) => `confirmatory.${entry}`));
  const preflightValidation = validateFrontier250TurnExecutionPreflight(executionPreflight);
  if (!preflightValidation.valid) errors.push(...preflightValidation.errors.map((entry) => `preflight.${entry}`));
  try {
    assertHashBoundRecord(
      manifest,
      "scoredExecutionManifestSha256",
      "250-turn scored execution manifest",
      "FRONTIER_250_REPORT_MANIFEST_HASH_INVALID"
    );
  } catch (error) {
    errors.push(error?.code || "manifest.hash");
  }
  if (manifest?.evaluationFreezeSha256 !== freeze?.evaluationFreezeSha256) errors.push("manifest.freeze");
  if (
    manifest?.confirmatoryComparisonFamilySha256 !==
      confirmatoryComparisonFamily?.confirmatoryComparisonFamilySha256
  ) errors.push("manifest.confirmatory");
  if (manifest?.executionPreflightSha256 !== executionPreflight?.executionPreflightSha256) {
    errors.push("manifest.preflight");
  }
  const checkpointValidation = validateFrontier250TurnCheckpoint(checkpoint, manifest);
  if (!checkpointValidation.valid) errors.push(...checkpointValidation.errors);
  try {
    assertHashBoundRecord(
      checkpoint,
      "checkpointSha256",
      "250-turn scored execution checkpoint",
      "FRONTIER_250_REPORT_CHECKPOINT_HASH_INVALID"
    );
  } catch (error) {
    errors.push(error?.code || "checkpoint.hash");
  }
  if (checkpoint?.phase !== "COMPLETE") errors.push("checkpoint.phase");
  if (Number(checkpoint?.taskCount) !== 1200 || Number(checkpoint?.completedCount) !== 1200 || Number(checkpoint?.remainingCount) !== 0) {
    errors.push("checkpoint.completion");
  }
  const rows = Array.isArray(checkpoint?.results) ? checkpoint.results : [];
  errors.push(...validateCoverage(rows));
  errors.push(...validateFrozenScores(rows));
  if (rows.some((row) => row?.manualRepairApplied !== false)) errors.push("checkpoint.manualRepair");
  return { valid: errors.length === 0, errors: [...new Set(errors)], rows };
}

export function buildFrontier250TurnQualificationReport({
  freeze,
  confirmatoryComparisonFamily,
  executionPreflight,
  manifest,
  checkpoint,
} = {}) {
  const validation = validateFrontier250TurnQualificationCompletedInputs({
    freeze,
    confirmatoryComparisonFamily,
    executionPreflight,
    manifest,
    checkpoint,
  });
  if (!validation.valid) {
    throw Object.assign(new Error(`250-turn qualification report inputs are invalid: ${validation.errors.join(", ")}`), {
      code: "FRONTIER_250_TURN_REPORT_INPUT_INVALID",
      errors: validation.errors,
    });
  }
  const rows = validation.rows;
  const pricing = normalizeObject(freeze?.pricingSnapshot);
  const variants = FRONTIER_ARCHITECTURE_VARIANTS.map((variant) => {
    const variantRows = rows.filter((row) => row.variantId === variant.id);
    const primaryMetrics = Object.fromEntries(
      FRONTIER_ARCHITECTURE_PRIMARY_STRUCTURED_METRICS.map((metric) => [metric, summarizeMetric(variantRows, metric)])
    );
    const totalCorrect = variantRows.filter((row) => row?.score?.correct).length;
    return {
      variantId: variant.id,
      label: variant.label,
      taskCount: variantRows.length,
      overallDeterministicProbeAccuracy: variantRows.length ? totalCorrect / variantRows.length : null,
      correctProbeCount: totalCorrect,
      incorrectProbeCount: variantRows.length - totalCorrect,
      primaryMetrics,
      operational: summarizeOperational(variantRows, pricing, variant.id),
    };
  });
  const reportSeed = hashFrontierBenchmarkValue({
    evaluationFreezeSha256: freeze.evaluationFreezeSha256,
    confirmatoryComparisonFamilySha256: confirmatoryComparisonFamily.confirmatoryComparisonFamilySha256,
    executionPreflightSha256: executionPreflight.executionPreflightSha256,
    scoredExecutionManifestSha256: manifest.scoredExecutionManifestSha256,
    checkpointSha256: checkpoint.checkpointSha256,
    reportVersion: FRONTIER_250_TURN_QUALIFICATION_REPORT_VERSION,
  });
  const comparisons = buildConfirmatoryComparisons(rows, confirmatoryComparisonFamily, reportSeed);
  const failures = rows.filter((row) => !row?.score?.correct).map((row) => ({
    taskId: row.taskId,
    variantId: row.variantId,
    fixtureSeed: row.fixtureSeed,
    probeId: row.probeId,
    family: row.family,
    outcome: row.score.outcome,
    outputSha256: row.outputSha256,
    scoredResultSha256: row.scoredResultSha256,
  }));
  const superiorityCount = comparisons.filter((entry) => entry.superiorityDecision === "V6_SUPERIOR").length;
  const nonInferiorCount = comparisons.filter((entry) => entry.nonInferiorityDecision === "NON_INFERIOR").length;
  const inferiorCount = comparisons.filter((entry) => entry.nonInferiorityDecision === "INFERIOR").length;
  const inconclusiveCount = comparisons.filter((entry) => entry.nonInferiorityDecision === "INCONCLUSIVE").length;

  const core = {
    version: FRONTIER_250_TURN_QUALIFICATION_REPORT_VERSION,
    phase: "TWO_HUNDRED_FIFTY_TURN_CONFIRMATORY_QUALIFICATION_SCORED",
    turns: 250,
    evaluationFreezeSha256: freeze.evaluationFreezeSha256,
    manifestSha256: freeze.manifestSha256,
    stateControlPlaneSha256: freeze.stateControlPlaneSha256,
    confirmatoryComparisonFamilySha256: confirmatoryComparisonFamily.confirmatoryComparisonFamilySha256,
    qualificationPackageSha256: manifest.qualificationPackageSha256,
    planSha256: manifest.planSha256,
    executionPreflightSha256: executionPreflight.executionPreflightSha256,
    scoredExecutionManifestSha256: manifest.scoredExecutionManifestSha256,
    checkpointSha256: checkpoint.checkpointSha256,
    taskCount: rows.length,
    manualRepairCount: rows.filter((row) => row?.manualRepairApplied === true).length,
    providerRetryTaskCount: rows.filter((row) => Number(row?.attemptCount) > 1).length,
    primaryDecisionUsesCompositeScore: false,
    primaryStructuredMetrics: [...FRONTIER_ARCHITECTURE_PRIMARY_STRUCTURED_METRICS],
    statisticalPreregistration: FRONTIER_ARCHITECTURE_STATISTICAL_PREREGISTRATION,
    confirmatoryFamily: {
      superiorityHypothesisCount: confirmatoryComparisonFamily.superiority.familySize,
      holmFamilySize: confirmatoryComparisonFamily.superiority.familySize,
      familywiseAlpha: confirmatoryComparisonFamily.superiority.twoSidedFamilywiseAlpha,
      correction: confirmatoryComparisonFamily.superiority.multipleComparisonCorrection,
      hardCorrectnessNonInferiorityHypothesisCount: confirmatoryComparisonFamily.nonInferiority.familySize,
      hardCorrectnessAbsoluteMargin: confirmatoryComparisonFamily.nonInferiority.absoluteMargin,
    },
    mechanismActivation: {
      v4SummaryActiveAt250Turns: Number(executionPreflight?.v4?.summaryProviderCallCount) > 0,
      v5RetrievalActiveAt250Turns: (executionPreflight?.v5?.promptRows || []).some((row) => Array.isArray(row.retrievedChunkIds) && row.retrievedChunkIds.length > 0),
      v4SummaryStateCount: Number(executionPreflight?.v4?.summaryStateCount) || 0,
      v5RetrievalQueryCount: Number(executionPreflight?.v5?.retrievalQueryCount) || 0,
      interpretation: "250-turn depth activates frozen V4 running-summary and V5 retrieval history-management paths; this is the first confirmatory depth where those architectures materially diverge from the short-history baseline.",
    },
    variants,
    supportOperational: supportOperational(executionPreflight, pricing),
    v6ConfirmatoryComparisons: comparisons,
    confirmatoryDecisions: {
      superiorityDemonstratedCount: superiorityCount,
      superiorityNotDemonstratedCount: comparisons.length - superiorityCount,
      hardCorrectnessNonInferiorCount: nonInferiorCount,
      hardCorrectnessInferiorCount: inferiorCount,
      hardCorrectnessInconclusiveCount: inconclusiveCount,
    },
    failureAudit: {
      failureCount: failures.length,
      rawProviderOutputIncluded: false,
      rows: failures,
    },
    claims: {
      singleCompositeWinnerDeclared: false,
      confirmatoryFamilyFrozenBefore250Results: true,
      superiorityUsesHolmAdjustedEvidence: true,
      superiorityRequiresPositivePointEstimateAndCiLowerAboveZero: true,
      nonInferiorityUsesFrozenTwoPercentagePointHardCorrectnessMargin: true,
      v2V3ProviderLatencyDifferenceClaimAllowed: false,
      rawProviderOutputsExcludedFromAggregateReport: true,
      postFreezeRetuningAllowed: false,
      thousandTurnQualificationStillRequiredBeforeDraftFrontierMilestone: true,
    },
  };
  return { ...core, qualificationReportSha256: hashFrontierBenchmarkValue(core) };
}

function percent(value) {
  return Number.isFinite(Number(value)) ? `${(Number(value) * 100).toFixed(1)}%` : "n/a";
}
function money(value) {
  return Number.isFinite(Number(value)) ? `$${Number(value).toFixed(6)}` : "n/a";
}

export function renderFrontier250TurnQualificationReportMarkdown(report) {
  const lines = [
    "# Crestfall Frontier — 250-Turn Six-Architecture Confirmatory Qualification",
    "",
    `Report SHA-256: \`${report.qualificationReportSha256}\``,
    `Checkpoint SHA-256: \`${report.checkpointSha256}\``,
    `Confirmatory family SHA-256: \`${report.confirmatoryComparisonFamilySha256}\``,
    "",
    "## Qualification status",
    "",
    `- Scored generations: **${report.taskCount}/1200**`,
    `- Manual repairs: **${report.manualRepairCount}**`,
    `- Retried scored tasks: **${report.providerRetryTaskCount}**`,
    `- V4 running-summary active: **${report.mechanismActivation.v4SummaryActiveAt250Turns ? "yes" : "no"}**`,
    `- V5 retrieval active: **${report.mechanismActivation.v5RetrievalActiveAt250Turns ? "yes" : "no"}**`,
    `- Confirmatory superiority family: **${report.confirmatoryFamily.superiorityHypothesisCount} hypotheses, Holm corrected**`,
    `- Hard-correctness noninferiority family: **${report.confirmatoryFamily.hardCorrectnessNonInferiorityHypothesisCount} hypotheses, ${percent(report.confirmatoryFamily.hardCorrectnessAbsoluteMargin)} absolute margin**`,
    "",
    "## Structured correctness metric vector",
    "",
    "| Architecture | Fact recall | Wrong recall | Hard state | Agency error | Witness leak | Presence error | Relationship error | Supersession error |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
  ];
  for (const variant of report.variants) {
    const m = variant.primaryMetrics;
    lines.push(`| ${variant.label} | ${percent(m.fact_recall_accuracy.value)} | ${percent(m.wrong_recall_rate.value)} | ${percent(m.hard_state_violation_rate.value)} | ${percent(m.agency_attribution_error_rate.value)} | ${percent(m.witness_boundary_leakage_rate.value)} | ${percent(m.presence_error_rate.value)} | ${percent(m.relationship_edge_error_rate.value)} | ${percent(m.state_supersession_error_rate.value)} |`);
  }
  lines.push(
    "",
    "For Fact recall, higher is better. Every other metric is an error/leak rate, so lower is better.",
    "",
    "## Scored-generation operational evidence",
    "",
    "| Architecture | Input tokens | Output tokens | Cache-hit tokens | p50 latency | p95 latency | Actual provider cost | All-miss cost control |",
    "|---|---:|---:|---:|---:|---:|---:|---:|"
  );
  for (const variant of report.variants) {
    const op = variant.operational;
    lines.push(`| ${variant.label} | ${op.usage.inputTokens ?? "n/a"} | ${op.usage.outputTokens ?? "n/a"} | ${op.usage.cacheReadTokens ?? "n/a"} | ${op.latencyMs.p50 ?? "n/a"} ms | ${op.latencyMs.p95 ?? "n/a"} ms | ${money(op.costUsd.actualProviderNative)} | ${money(op.costUsd.counterfactualAllInputCacheMiss)} |`);
  }
  lines.push(
    "",
    "## History-management support evidence",
    "",
    `- V4 summary support calls: **${report.supportOperational.v4RunningSummary.providerCallCount}**`,
    `- V4 summary support input/output tokens: **${report.supportOperational.v4RunningSummary.inputTokens ?? "n/a"} / ${report.supportOperational.v4RunningSummary.outputTokens ?? "n/a"}**`,
    `- V4 summary all-miss cost control: **${money(report.supportOperational.v4RunningSummary.counterfactualAllInputCacheMissCostUsd)}**`,
    `- V5 retrieval queries: **${report.supportOperational.v5Retrieval.retrievalQueryCount}**`,
    `- V5 embedding logical calls: **${report.supportOperational.v5Retrieval.embeddingLogicalCallCount}**`,
    `- V5 unique historical chunk embeddings: **${report.supportOperational.v5Retrieval.uniqueChunkEmbeddingCount}**`,
    "",
    "RunPod embedding unit cost is intentionally left null because the frozen pricing snapshot did not contain a unit price for that infrastructure.",
    "",
    "## Confirmatory V6 comparisons",
    "",
    "Positive advantage values favor Crestfall (V6). Superiority requires a positive point estimate, a 95% paired hierarchical-bootstrap CI entirely above zero, and a Holm-adjusted p-value within the frozen familywise alpha.",
    "",
    "| H | Comparator | Metric | V6 advantage | 95% CI | Raw bootstrap p | Holm p | Superiority | Noninferiority |",
    "|---|---|---|---:|---:|---:|---:|---|---|"
  );
  for (const comparison of report.v6ConfirmatoryComparisons) {
    lines.push(`| ${comparison.hypothesisId} | ${comparison.comparatorVariantId} | ${comparison.metric} | ${percent(comparison.pointEstimateAdvantage)} | ${percent(comparison.bootstrap.ciLower)} to ${percent(comparison.bootstrap.ciUpper)} | ${comparison.bootstrapTwoSidedPValue ?? "n/a"} | ${comparison.holmAdjustedPValue ?? "n/a"} | ${comparison.superiorityDecision} | ${comparison.nonInferiorityDecision} |`);
  }
  lines.push(
    "",
    "## Confirmatory decision counts",
    "",
    `- V6 superiority demonstrated: **${report.confirmatoryDecisions.superiorityDemonstratedCount}/${report.confirmatoryFamily.superiorityHypothesisCount}** hypotheses`,
    `- Hard-correctness noninferior: **${report.confirmatoryDecisions.hardCorrectnessNonInferiorCount}/${report.confirmatoryFamily.hardCorrectnessNonInferiorityHypothesisCount}** hypotheses`,
    `- Hard-correctness inferior: **${report.confirmatoryDecisions.hardCorrectnessInferiorCount}**`,
    `- Hard-correctness inconclusive: **${report.confirmatoryDecisions.hardCorrectnessInconclusiveCount}**`,
    "",
    "## Interpretation boundary",
    "",
    report.mechanismActivation.interpretation,
    "",
    "This is the first confirmatory long-history depth. It can support the preregistered 250-turn hypothesis decisions, but the planned 1,000-turn qualification remains required before the draft Frontier milestone and broader long-horizon product conclusion.",
    ""
  );
  return `${lines.join("\n")}\n`;
}
