"use client";

import { useMemo, useState } from "react";

import {
  buildProgressionCurvePreview,
  buildProgressionCurvePreviewRows,
  createDefaultProgressionProfile,
  normalizeProgressionProfileEditorValue,
  PROGRESSION_PROFILE_EDITOR_LIMITS,
  PROGRESSION_TIER_DEFINITION_VERSION,
  rebuildProgressionThresholds,
  validateProgressionProfileEditorValue,
} from "./ProgressionProfileEditor.contract";

function nextTierId(tiers = []) {
  const used = new Set(tiers.map((tier) => tier.id));
  let index = tiers.length + 1;
  while (used.has(`tier.${index}`)) index += 1;
  return `tier.${index}`;
}

function nextOverrideId(overrides = []) {
  const used = new Set(overrides.map((override) => override.id));
  let index = overrides.length + 1;
  while (used.has(`override_${index}`)) index += 1;
  return `override_${index}`;
}

export function useProgressionProfileEditorViewModel({
  value = null,
  onChange = null,
} = {}) {
  const profile = useMemo(
    () =>
      normalizeProgressionProfileEditorValue(
        value || createDefaultProgressionProfile()
      ),
    [value]
  );
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const validation = useMemo(
    () => validateProgressionProfileEditorValue(profile),
    [profile]
  );
  const preview = useMemo(
    () => buildProgressionCurvePreviewRows(profile.curve),
    [profile.curve]
  );

  function commit(nextProfile) {
    onChange?.(normalizeProgressionProfileEditorValue(nextProfile));
  }

  function applyJsonProfile(nextProfile) {
    commit(normalizeProgressionProfileEditorValue(nextProfile));
  }

  function updateProfileField(field, nextValue) {
    if (!["title", "description", "enabled", "tags"].includes(field)) return;
    commit({ ...profile, [field]: nextValue });
  }

  function updateCurveMode(nextMode) {
    const mode = String(nextMode || "").toUpperCase();
    if (
      ![
        "GENERATED_CURVE",
        "GENERATED_CURVE_WITH_OVERRIDES",
        "EXPLICIT_TABLE",
      ].includes(mode)
    ) {
      return;
    }

    const maximumLevel =
      mode === "EXPLICIT_TABLE"
        ? Math.min(
            profile.curve.maximumLevel,
            PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
          )
        : profile.curve.maximumLevel;
    const thresholds =
      mode === "EXPLICIT_TABLE"
        ? buildProgressionCurvePreview({
            ...profile.curve,
            maximumLevel,
          }).map((row) => ({
            level: row.level,
            cumulativeExperience: row.cumulativeExperience,
            metadata: {},
          }))
        : [];

    commit({
      ...profile,
      curve: {
        ...profile.curve,
        mode,
        maximumLevel,
        thresholds,
        overrides:
          mode === "GENERATED_CURVE_WITH_OVERRIDES"
            ? profile.curve.overrides
            : [],
      },
      tierDefinitions: profile.tierDefinitions.map((tier) => ({
        ...tier,
        minimumLevel: Math.min(maximumLevel, tier.minimumLevel),
        maximumLevel: Math.min(maximumLevel, tier.maximumLevel),
      })),
    });
  }

  function updateCurveRange(field, nextValue) {
    const explicit = profile.curve.mode === "EXPLICIT_TABLE";
    const maximumLimit = explicit
      ? PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
      : PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels;
    const nextMinimum =
      field === "minimumLevel"
        ? Math.min(maximumLimit, Math.max(1, Number(nextValue) || 1))
        : profile.curve.minimumLevel;
    const nextMaximum =
      field === "maximumLevel"
        ? Math.min(
            maximumLimit,
            Math.max(nextMinimum, Number(nextValue) || nextMinimum)
          )
        : Math.min(
            maximumLimit,
            Math.max(nextMinimum, profile.curve.maximumLevel)
          );

    commit({
      ...profile,
      curve: {
        ...profile.curve,
        minimumLevel: nextMinimum,
        maximumLevel: nextMaximum,
        thresholds: explicit
          ? rebuildProgressionThresholds({
              thresholds: profile.curve.thresholds,
              minimumLevel: nextMinimum,
              maximumLevel: nextMaximum,
            })
          : [],
        overrides: profile.curve.overrides.filter(
          (override) =>
            override.level > nextMinimum && override.level <= nextMaximum
        ),
      },
      tierDefinitions: profile.tierDefinitions.map((tier) => ({
        ...tier,
        minimumLevel: Math.min(
          nextMaximum,
          Math.max(nextMinimum, tier.minimumLevel)
        ),
        maximumLevel: Math.min(
          nextMaximum,
          Math.max(nextMinimum, tier.maximumLevel)
        ),
      })),
    });
  }

  function updateMaximumExperiencePolicy(nextValue) {
    commit({
      ...profile,
      curve: {
        ...profile.curve,
        maximumExperiencePolicy: nextValue,
      },
    });
  }

  function updateGenerationField(field, nextValue) {
    const supported = new Set([
      "curveType",
      "requirementMode",
      "startingRequirement",
      "linearIncrease",
      "multiplier",
      "exponent",
      "minimumIncrease",
      "roundTo",
      "rounding",
    ]);
    if (!supported.has(field)) return;

    commit({
      ...profile,
      curve: {
        ...profile.curve,
        generation: {
          ...profile.curve.generation,
          [field]: nextValue,
        },
      },
    });
  }

  function updateThreshold(level, nextValue) {
    if (profile.curve.mode !== "EXPLICIT_TABLE") return;
    commit({
      ...profile,
      curve: {
        ...profile.curve,
        thresholds: profile.curve.thresholds.map((threshold) =>
          threshold.level === level
            ? {
                ...threshold,
                cumulativeExperience:
                  level === profile.curve.minimumLevel
                    ? 0
                    : Math.max(0, Math.round(Number(nextValue) || 0)),
              }
            : threshold
        ),
      },
    });
  }

  function addOverride() {
    const id = nextOverrideId(profile.curve.overrides);
    const level = Math.min(
      profile.curve.maximumLevel,
      Math.max(
        profile.curve.minimumLevel + 1,
        profile.curve.minimumLevel + profile.curve.overrides.length + 1
      )
    );
    commit({
      ...profile,
      curve: {
        ...profile.curve,
        overrides: [
          ...profile.curve.overrides,
          {
            id,
            level,
            experienceCost:
              profile.curve.generation.requirementMode === "PER_LEVEL_COST"
                ? profile.curve.generation.startingRequirement
                : null,
            cumulativeExperience:
              profile.curve.generation.requirementMode ===
              "CUMULATIVE_THRESHOLD"
                ? profile.curve.generation.startingRequirement
                : null,
            metadata: {},
          },
        ],
      },
    });
  }

  function updateOverride(index, field, nextValue) {
    const supported = new Set([
      "id",
      "level",
      "experienceCost",
      "cumulativeExperience",
    ]);
    if (!supported.has(field)) return;

    commit({
      ...profile,
      curve: {
        ...profile.curve,
        overrides: profile.curve.overrides.map((override, overrideIndex) =>
          overrideIndex === index
            ? {
                ...override,
                [field]:
                  field === "level"
                    ? Math.round(Number(nextValue) || 0)
                    : field === "experienceCost" ||
                        field === "cumulativeExperience"
                      ? nextValue === ""
                        ? null
                        : Number(nextValue)
                      : nextValue,
              }
            : override
        ),
      },
    });
  }

  function removeOverride(index) {
    commit({
      ...profile,
      curve: {
        ...profile.curve,
        overrides: profile.curve.overrides.filter(
          (_, overrideIndex) => overrideIndex !== index
        ),
      },
    });
  }

  function addTier() {
    const id = nextTierId(profile.tierDefinitions);
    commit({
      ...profile,
      tierDefinitions: [
        ...profile.tierDefinitions,
        {
          definitionVersion: PROGRESSION_TIER_DEFINITION_VERSION,
          id,
          title: `Tier ${profile.tierDefinitions.length + 1}`,
          description: "",
          enabled: false,
          minimumLevel: profile.curve.minimumLevel,
          maximumLevel: profile.curve.minimumLevel,
          tags: [],
          order: profile.tierDefinitions.length,
          metadata: {},
        },
      ],
    });
  }

  function updateTier(index, field, nextValue) {
    const supported = new Set([
      "id",
      "title",
      "description",
      "enabled",
      "minimumLevel",
      "maximumLevel",
      "tags",
    ]);
    if (!supported.has(field)) return;

    commit({
      ...profile,
      tierDefinitions: profile.tierDefinitions.map((tier, tierIndex) =>
        tierIndex === index
          ? {
              ...tier,
              [field]:
                field === "minimumLevel" || field === "maximumLevel"
                  ? Math.round(Number(nextValue) || profile.curve.minimumLevel)
                  : nextValue,
            }
          : tier
      ),
    });
  }

  function removeTier(index) {
    commit({
      ...profile,
      tierDefinitions: profile.tierDefinitions
        .filter((_, tierIndex) => tierIndex !== index)
        .map((tier, order) => ({ ...tier, order })),
    });
  }

  return {
    profile,
    errors: validation.errors,
    warnings: validation.warnings,
    metrics: validation.metrics,
    previewRows: preview.rows,
    previewOmittedCount: preview.omittedCount,
    valid: validation.valid,
    jsonEditorOpen,
    onOpenJsonEditor: () => setJsonEditorOpen(true),
    onCloseJsonEditor: () => setJsonEditorOpen(false),
    onApplyJsonProfile: applyJsonProfile,
    onUpdateProfileField: updateProfileField,
    onUpdateCurveMode: updateCurveMode,
    onUpdateCurveRange: updateCurveRange,
    onUpdateMaximumExperiencePolicy: updateMaximumExperiencePolicy,
    onUpdateGenerationField: updateGenerationField,
    onUpdateThreshold: updateThreshold,
    onAddOverride: addOverride,
    onUpdateOverride: updateOverride,
    onRemoveOverride: removeOverride,
    onAddTier: addTier,
    onUpdateTier: updateTier,
    onRemoveTier: removeTier,
  };
}
