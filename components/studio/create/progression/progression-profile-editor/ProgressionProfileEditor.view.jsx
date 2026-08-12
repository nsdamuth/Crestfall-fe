"use client";

import { Fragment } from "react";

import {
  Activity,
  Braces,
  ChevronDown,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  PROGRESSION_CURVE_MODE_OPTIONS,
  PROGRESSION_CURVE_TYPE_OPTIONS,
  PROGRESSION_MAXIMUM_EXPERIENCE_OPTIONS,
  PROGRESSION_REQUIREMENT_MODE_OPTIONS,
  PROGRESSION_ROUNDING_OPTIONS,
} from "./ProgressionProfileEditor.contract";

import ProgressionJsonEditorModal from "../progression-json-editor/ProgressionJsonEditorModal";
import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

function Label({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder = "" }) {
  return (
    <input
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = "any",
  disabled = false,
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none disabled:cursor-not-allowed disabled:opacity-60 focus:border-[var(--gold-ornament)]/50"
    />
  );
}

function SelectInput({ value, onChange, options = [] }) {
  return (
    <select
      value={value || ""}
      onChange={(event) => onChange?.(event.target.value)}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ValidationPanel({ errors = [], warnings = [] }) {
  if (!errors.length && !warnings.length) {
    return (
      <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
        Progression Profile definitions and resolved XP thresholds are valid.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errors.length ? (
        <div className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-4 text-sm text-rose-100">
          <p className="font-semibold">Errors</p>
          <ul className="mt-2 space-y-1">
            {errors.map((entry, index) => (
              <li key={`${entry.code}-${entry.path}-${index}`}>
                {entry.path}: {entry.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {warnings.length ? (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">
          <p className="font-semibold">Warnings</p>
          <ul className="mt-2 space-y-1">
            {warnings.map((entry, index) => (
              <li key={`${entry.code}-${entry.path}-${index}`}>
                {entry.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ThresholdPreview({ rows = [], omittedCount = 0 }) {
  const splitIndex = Math.ceil(rows.length / 2);

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
        <thead className="bg-white/[0.04] text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
          <tr>
            <th className="w-20 px-3 py-2 text-left font-medium">Level</th>
            <th className="w-36 px-3 py-2 text-right font-medium">
              Level cost
            </th>
            <th className="w-44 px-3 py-2 text-right font-medium">
              Cumulative XP
            </th>
            <th className="w-28 px-3 py-2 text-left font-medium">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, index) => (
            <Fragment key={`${row.level}-${row.source}-${index}`}>
              {omittedCount > 0 && index === splitIndex ? (
                <tr>
                  <td
                    colSpan={4}
                    className="bg-white/[0.02] px-3 py-2 text-center text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]"
                  >
                    {omittedCount.toLocaleString("en-US")} levels omitted
                  </td>
                </tr>
              ) : null}
              <tr className="text-[var(--ink)]">
                <td className="px-3 py-2 font-semibold tabular-nums">
                  {row.level}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {Math.round(row.experienceCost).toLocaleString("en-US")}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {Math.round(row.cumulativeExperience).toLocaleString("en-US")}
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
                    {row.source}
                  </span>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProgressionProfileEditorView({
  profile = {},
  errors = [],
  warnings = [],
  metrics = {},
  previewRows = [],
  previewOmittedCount = 0,
  jsonEditorOpen = false,
  onOpenJsonEditor = null,
  onCloseJsonEditor = null,
  onApplyJsonProfile = null,
  onUpdateProfileField = null,
  onUpdateCurveMode = null,
  onUpdateCurveRange = null,
  onUpdateMaximumExperiencePolicy = null,
  onUpdateGenerationField = null,
  onUpdateThreshold = null,
  onAddOverride = null,
  onUpdateOverride = null,
  onRemoveOverride = null,
  onAddTier = null,
  onUpdateTier = null,
  onRemoveTier = null,
}) {
  const curve = profile.curve || {};
  const generation = curve.generation || {};
  const thresholds = Array.isArray(curve.thresholds) ? curve.thresholds : [];
  const overrides = Array.isArray(curve.overrides) ? curve.overrides : [];
  const tiers = Array.isArray(profile.tierDefinitions)
    ? profile.tierDefinitions
    : [];
  const generatedMode = curve.mode !== "EXPLICIT_TABLE";
  const overridesEnabled = curve.mode === "GENERATED_CURVE_WITH_OVERRIDES";
  const selectedMode = PROGRESSION_CURVE_MODE_OPTIONS.find(
    (option) => option.value === curve.mode
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/35 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            <Activity size={18} />
            Progression Definition
          </p>

          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            <Braces size={14} />
            JSON editor
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Profile title</Label>
            <TextInput
              value={profile.title || ""}
              onChange={(value) => onUpdateProfileField?.("title", value)}
              placeholder="Adventurer Progression"
            />
          </div>
          <div>
            <Label>Tags</Label>
            <TextInput
              value={(profile.tags || []).join(", ")}
              onChange={(value) => onUpdateProfileField?.("tags", value)}
              placeholder="progression, fantasy, campaign"
            />
          </div>
          <div className="lg:col-span-2">
            <TextAreaField
              label="Description"
              value={profile.description || ""}
              onChange={(value) =>
                onUpdateProfileField?.("description", value)
              }
              placeholder="Explain how this progression profile should be used."
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            checked={profile.enabled !== false}
            onChange={(event) =>
              onUpdateProfileField?.("enabled", event.target.checked)
            }
          />
          Profile enabled
        </label>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/35 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle
            eyebrow="Progression Curve"
            title="Experience by Level"
            body="Choose a compact algorithmic curve, add selected overrides, or author every cumulative XP threshold directly."
          />
          <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-3 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} />
              Deterministic curve generator
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Curve mode</Label>
            <SelectInput
              value={curve.mode}
              onChange={onUpdateCurveMode}
              options={PROGRESSION_CURVE_MODE_OPTIONS}
            />
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              {selectedMode?.description}
            </p>
          </div>
          <div>
            <Label>Maximum-level XP behavior</Label>
            <SelectInput
              value={curve.maximumExperiencePolicy}
              onChange={onUpdateMaximumExperiencePolicy}
              options={PROGRESSION_MAXIMUM_EXPERIENCE_OPTIONS}
            />
          </div>
          <div>
            <Label>Minimum level</Label>
            <NumberInput
              min={1}
              max={generatedMode ? 10000 : 500}
              step={1}
              value={curve.minimumLevel ?? 1}
              onChange={(value) =>
                onUpdateCurveRange?.("minimumLevel", value)
              }
            />
          </div>
          <div>
            <Label>Level cap</Label>
            <NumberInput
              min={curve.minimumLevel ?? 1}
              max={generatedMode ? 10000 : 500}
              step={1}
              value={curve.maximumLevel ?? 1}
              onChange={(value) =>
                onUpdateCurveRange?.("maximumLevel", value)
              }
            />
            <p className="mt-2 text-xs text-[var(--ink-dim)]">
              Generated curves support up to 10,000 levels; explicit tables
              support up to 500 authored rows.
            </p>
          </div>
        </div>

        {generatedMode ? (
          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
              Algorithmic Settings
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <Label>Curve type</Label>
                <SelectInput
                  value={generation.curveType}
                  onChange={(value) =>
                    onUpdateGenerationField?.("curveType", value)
                  }
                  options={PROGRESSION_CURVE_TYPE_OPTIONS}
                />
              </div>
              <div>
                <Label>Requirement interpretation</Label>
                <SelectInput
                  value={generation.requirementMode}
                  onChange={(value) =>
                    onUpdateGenerationField?.("requirementMode", value)
                  }
                  options={PROGRESSION_REQUIREMENT_MODE_OPTIONS}
                />
              </div>
              <div>
                <Label>Starting requirement</Label>
                <NumberInput
                  min={1}
                  value={generation.startingRequirement}
                  onChange={(value) =>
                    onUpdateGenerationField?.("startingRequirement", value)
                  }
                />
              </div>
              <div>
                <Label>Linear increase</Label>
                <NumberInput
                  min={-Number.MAX_SAFE_INTEGER}
                  value={generation.linearIncrease}
                  onChange={(value) =>
                    onUpdateGenerationField?.("linearIncrease", value)
                  }
                />
              </div>
              <div>
                <Label>Growth multiplier</Label>
                <NumberInput
                  min={0.000001}
                  value={generation.multiplier}
                  onChange={(value) =>
                    onUpdateGenerationField?.("multiplier", value)
                  }
                />
              </div>
              <div>
                <Label>Power exponent</Label>
                <NumberInput
                  min={0.000001}
                  value={generation.exponent}
                  onChange={(value) =>
                    onUpdateGenerationField?.("exponent", value)
                  }
                />
              </div>
              <div>
                <Label>Minimum increase</Label>
                <NumberInput
                  min={0.000001}
                  value={generation.minimumIncrease}
                  onChange={(value) =>
                    onUpdateGenerationField?.("minimumIncrease", value)
                  }
                />
              </div>
              <div>
                <Label>Rounding increment</Label>
                <NumberInput
                  min={0.000001}
                  value={generation.roundTo}
                  onChange={(value) =>
                    onUpdateGenerationField?.("roundTo", value)
                  }
                />
              </div>
              <div>
                <Label>Rounding policy</Label>
                <SelectInput
                  value={generation.rounding}
                  onChange={(value) =>
                    onUpdateGenerationField?.("rounding", value)
                  }
                  options={PROGRESSION_ROUNDING_OPTIONS}
                />
              </div>
            </div>
          </div>
        ) : null}

        {overridesEnabled ? (
          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                  Level Overrides
                </p>
                <p className="mt-2 text-sm text-[var(--ink-dim)]">
                  Override selected levels without storing the full generated table.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAddOverride?.()}
                className="cf-btn cf-btn--secondary"
              >
                <Plus size={16} /> Add override
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {overrides.map((override, index) => (
                <article
                  key={`${override.id}-${index}`}
                  className="rounded-xl border border-white/10 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">
                      {override.id || `Override ${index + 1}`}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRemoveOverride?.(index)}
                      className="cf-btn cf-btn--danger cf-btn--sm"
                      aria-label={`Remove override ${index + 1}`}
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Override ID</Label>
                      <TextInput
                        value={override.id}
                        onChange={(value) =>
                          onUpdateOverride?.(index, "id", value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Level</Label>
                      <NumberInput
                        min={(curve.minimumLevel ?? 1) + 1}
                        max={curve.maximumLevel}
                        step={1}
                        value={override.level}
                        onChange={(value) =>
                          onUpdateOverride?.(index, "level", value)
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        {generation.requirementMode === "PER_LEVEL_COST"
                          ? "Replacement level cost"
                          : "Replacement cumulative XP"}
                      </Label>
                      <NumberInput
                        min={0}
                        value={
                          generation.requirementMode === "PER_LEVEL_COST"
                            ? override.experienceCost
                            : override.cumulativeExperience
                        }
                        onChange={(value) =>
                          onUpdateOverride?.(
                            index,
                            generation.requirementMode === "PER_LEVEL_COST"
                              ? "experienceCost"
                              : "cumulativeExperience",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </article>
              ))}
              {!overrides.length ? (
                <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-[var(--ink-dim)]">
                  No overrides. The generated curve applies to every level.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {curve.mode === "EXPLICIT_TABLE" ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
            <div className="grid gap-1 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] sm:grid-cols-[0.35fr_1fr] sm:gap-0">
              <span>Level</span>
              <span>Cumulative experience</span>
            </div>
            <div className="divide-y divide-white/10">
              {thresholds.map((threshold) => (
                <div
                  key={threshold.level}
                  className="grid items-center gap-2 px-4 py-3 sm:grid-cols-[0.35fr_1fr] sm:gap-4"
                >
                  <span className="text-sm font-semibold">
                    {threshold.level}
                  </span>
                  <NumberInput
                    min={0}
                    step={1}
                    value={threshold.cumulativeExperience}
                    disabled={threshold.level === curve.minimumLevel}
                    onChange={(value) =>
                      onUpdateThreshold?.(threshold.level, value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <details className="group mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                    Generated Threshold Preview
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink-dim)]">
                    {(metrics.thresholdCount || 0).toLocaleString("en-US")} levels
                    {previewRows.length
                      ? ` · ${previewRows.length.toLocaleString("en-US")} shown`
                      : ""}
                    {previewOmittedCount > 0
                      ? ` · ${previewOmittedCount.toLocaleString("en-US")} omitted`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--ink-dim)]">
                  <span className="tabular-nums">
                    Max {Math.round(metrics.maximumThreshold || 0).toLocaleString("en-US")} XP
                  </span>
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-open:rotate-180"
                  />
                </div>
              </div>
            </summary>
            <div className="border-t border-white/10 p-3">
              <p className="mb-3 text-xs leading-5 text-[var(--ink-dim)]">
                The full table is calculated deterministically at runtime. Only
                a bounded first-and-last-level preview is shown here, and generated
                rows are not stored with the profile.
              </p>
              <ThresholdPreview
                rows={previewRows}
                omittedCount={previewOmittedCount}
              />
            </div>
          </details>
        )}
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/35 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle
            eyebrow="Tier Definitions"
            title="Level Bands"
            body="Optional non-overlapping labels for interpreting resolved levels."
          />
          <button
            type="button"
            onClick={() => onAddTier?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/30 px-4 py-2 text-sm text-[var(--gold-ornament)] hover:bg-[var(--gold-ornament)]/10"
          >
            <Plus size={16} /> Add tier
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {tiers.map((tier, index) => (
            <article
              key={`${tier.id}-${index}`}
              className="rounded-xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">{tier.title || tier.id}</p>
                <button
                  type="button"
                  onClick={() => onRemoveTier?.(index)}
                  className="cf-btn cf-btn--danger cf-btn--sm"
                  aria-label={`Remove ${tier.title || tier.id}`}
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <Label>Tier ID</Label>
                  <TextInput
                    value={tier.id || ""}
                    onChange={(value) => onUpdateTier?.(index, "id", value)}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <TextInput
                    value={tier.title || ""}
                    onChange={(value) =>
                      onUpdateTier?.(index, "title", value)
                    }
                  />
                </div>
                <div>
                  <Label>Minimum level</Label>
                  <NumberInput
                    min={curve.minimumLevel ?? 1}
                    max={curve.maximumLevel}
                    step={1}
                    value={tier.minimumLevel}
                    onChange={(value) =>
                      onUpdateTier?.(index, "minimumLevel", value)
                    }
                  />
                </div>
                <div>
                  <Label>Maximum level</Label>
                  <NumberInput
                    min={curve.minimumLevel ?? 1}
                    max={curve.maximumLevel}
                    step={1}
                    value={tier.maximumLevel}
                    onChange={(value) =>
                      onUpdateTier?.(index, "maximumLevel", value)
                    }
                  />
                </div>
                <div className="lg:col-span-2">
                  <TextAreaField
                    label="Description"
                    value={tier.description || ""}
                    onChange={(value) =>
                      onUpdateTier?.(index, "description", value)
                    }
                    maxLength={SHORT_LONGFORM_MAX_LENGTH}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label>Tags</Label>
                  <TextInput
                    value={(tier.tags || []).join(", ")}
                    onChange={(value) =>
                      onUpdateTier?.(index, "tags", value)
                    }
                    placeholder="entry, veteran, capstone"
                  />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={tier.enabled !== false}
                  onChange={(event) =>
                    onUpdateTier?.(index, "enabled", event.target.checked)
                  }
                />
                Tier enabled
              </label>
            </article>
          ))}

          {!tiers.length ? (
            <p className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-[var(--ink-dim)]">
              No tiers are defined. Level evaluation remains available without
              tier labels.
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            Levels
          </p>
          <p className="mt-2 text-2xl">{metrics.thresholdCount || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            Stored rows
          </p>
          <p className="mt-2 text-2xl">{metrics.storedThresholdCount || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            Overrides
          </p>
          <p className="mt-2 text-2xl">{metrics.overrideCount || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            Tiers
          </p>
          <p className="mt-2 text-2xl">{metrics.tierCount || 0}</p>
        </div>
      </section>

      <ValidationPanel errors={errors} warnings={warnings} />

      {jsonEditorOpen ? (
        <ProgressionJsonEditorModal
          progressionProfile={profile}
          onApply={onApplyJsonProfile}
          onClose={onCloseJsonEditor}
        />
      ) : null}
    </div>
  );
}
