"use client";

import { Plus, Trash2 } from "lucide-react";

import { CheckboxField, SelectField as SharedSelectField } from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function FieldLabel({ children }) {
  return (
    <span className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
      {children}
    </span>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] transition placeholder:text-[var(--ink-dim)]"
      />
    </label>
  );
}

// 4.4: native select retired in favor of the branded kit dropdown
// grammar. This wrapper keeps its own id-based option shape (every
// call site in this file already uses it) and translates to
// SharedFields.SelectField's value-based shape underneath.
function SelectField({ label, value, options = [], onChange }) {
  const normalizedOptions = options.map((option) => {
    const item =
      typeof option === "string"
        ? { id: option, label: option.replaceAll("_", " ") }
        : option;
    return { value: item.id, label: item.label, isDisabled: item.disabled === true };
  });

  return (
    <SharedSelectField
      label={label}
      value={value ?? ""}
      options={normalizedOptions}
      onChange={(nextValue) => onChange?.(nextValue)}
    />
  );
}

function NumberField({ label, value, onChange, placeholder = "" }) {
  return (
    <TextField
      label={label}
      type="number"
      value={value ?? ""}
      onChange={(next) => onChange?.(next === "" ? "" : Number(next))}
      placeholder={placeholder}
    />
  );
}

function SmallButton({ children, onClick, danger = false, title = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`cf-btn cf-btn--sm ${danger ? "cf-btn--danger" : "cf-btn--secondary"}`}
    >
      {children}
    </button>
  );
}

function DerivedValueCard({
  rule,
  index,
  derivedMethodOptions = [],
  roundingOptions = [],
  onChange,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>
          Derived Value {index + 1}
        </p>
        <SmallButton danger onClick={onRemove} title="Remove derived value">
          <Trash2 size={13} />
          Remove
        </SmallButton>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Counter ID"
          value={rule.id}
          onChange={(id) => onChange?.({ id })}
          placeholder="proficiency_bonus"
        />
        <TextField
          label="Label"
          value={rule.label}
          onChange={(label) => onChange?.({ label })}
          placeholder="Proficiency Bonus"
        />
        <SelectField
          label="Method"
          value={rule.method}
          options={derivedMethodOptions}
          onChange={(method) => onChange?.({ method })}
        />
        <NumberField
          label="Starting Value"
          value={rule.startingValue}
          onChange={(startingValue) => onChange?.({ startingValue })}
        />
        {rule.method === "RANK_INTERVAL" ? (
          <>
            <NumberField
              label="Increase Every Ranks"
              value={rule.increaseEveryRanks}
              onChange={(increaseEveryRanks) =>
                onChange?.({ increaseEveryRanks })
              }
            />
            <NumberField
              label="Increase Amount"
              value={rule.increaseAmount}
              onChange={(increaseAmount) => onChange?.({ increaseAmount })}
            />
          </>
        ) : null}
        {rule.method === "LINEAR" ? (
          <>
            <NumberField
              label="Per-Rank Multiplier"
              value={rule.multiplierPerRank}
              onChange={(multiplierPerRank) =>
                onChange?.({ multiplierPerRank })
              }
            />
            <NumberField
              label="Per-Rank Add"
              value={rule.increaseAmount}
              onChange={(increaseAmount) => onChange?.({ increaseAmount })}
            />
            <NumberField
              label="Offset"
              value={rule.offset}
              onChange={(offset) => onChange?.({ offset })}
            />
          </>
        ) : null}
        <SelectField
          label="Rounding"
          value={rule.rounding}
          options={roundingOptions}
          onChange={(rounding) => onChange?.({ rounding })}
        />
        <NumberField
          label="Minimum Value"
          value={rule.minValue ?? ""}
          onChange={(minValue) =>
            onChange?.({ minValue: minValue === "" ? null : minValue })
          }
          placeholder="Optional"
        />
        <NumberField
          label="Maximum Value"
          value={rule.maxValue ?? ""}
          onChange={(maxValue) =>
            onChange?.({ maxValue: maxValue === "" ? null : maxValue })
          }
          placeholder="Optional"
        />
      </div>

      {rule.method === "EXPLICIT_TABLE" ? (
        <p className="mt-4 rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] px-4 py-3 text-xs leading-5 text-[var(--status-warning-text)]">
          Explicit derived-value tables remain available through the JSON Editor.
          Generated interval and linear rules are the compact visual-authoring paths.
        </p>
      ) : null}
    </div>
  );
}

function OverrideCard({ override, index, onChange, onRemove }) {
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-black/35 p-4 md:grid-cols-[0.7fr_1fr_1fr_auto]">
      <NumberField
        label="Rank"
        value={override.rank}
        onChange={(rank) => onChange?.({ rank })}
      />
      <NumberField
        label="Per-Rank Cost"
        value={override.requirement ?? ""}
        onChange={(requirement) =>
          onChange?.({ requirement: requirement === "" ? null : requirement })
        }
        placeholder="Optional"
      />
      <NumberField
        label="Total Threshold"
        value={override.totalRequirement ?? ""}
        onChange={(totalRequirement) =>
          onChange?.({
            totalRequirement:
              totalRequirement === "" ? null : totalRequirement,
          })
        }
        placeholder="Optional"
      />
      <div className="flex items-end">
        <SmallButton danger onClick={onRemove} title={`Remove override ${index + 1}`}>
          <Trash2 size={13} />
        </SmallButton>
      </div>
    </div>
  );
}

export default function MechanicsProgressionProfileFieldsView({
  profile = { curve: {}, overrides: [], derivedValues: [] },
  summary = { label: "", transitionCount: 0, maximumThreshold: 0 },
  previewRows = [],
  activeDerivedValues = [],
  modeOptions = [],
  requirementModeOptions = [],
  curveTypeOptions = [],
  maximumPolicyOptions = [],
  derivedMethodOptions = [],
  roundingOptions = [],
  patchProfile = () => {},
  patchCurve = () => {},
  addOverride = () => {},
  patchOverride = () => {},
  removeOverride = () => {},
  addDerivedValue = () => {},
  patchDerivedValue = () => {},
  removeDerivedValue = () => {},
}) {
  return (
    <div className="grid gap-5 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/5 p-5 md:col-span-2 xl:col-span-3">
      <div>
        <p className={EYEBROW_CLASS}>
          Optimized Progression Profile
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
          Reconcile a source counter into a rank and optional derived counters
          without authoring one composition step per rank.
        </p>
        <p className="mt-2 text-xs text-[var(--ink)]">{summary.label}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Profile ID"
          value={profile.id}
          onChange={(id) => patchProfile({ id })}
          placeholder="character_advancement"
        />
        <TextField
          label="Profile Label"
          value={profile.label}
          onChange={(label) => patchProfile({ label })}
          placeholder="Character Advancement"
        />
        <SelectField
          label="Progression Mode"
          value={profile.mode}
          options={modeOptions}
          onChange={(mode) => patchProfile({ mode })}
        />
        <TextField
          label="Source Counter ID"
          value={profile.sourceValueId}
          onChange={(sourceValueId) => patchProfile({ sourceValueId })}
          placeholder="experience_points"
        />
        <TextField
          label="Rank Counter ID"
          value={profile.rankValueId}
          onChange={(rankValueId) => patchProfile({ rankValueId })}
          placeholder="character_level"
        />
        <TextField
          label="Advancement Count ID"
          value={profile.advancementCounterId}
          onChange={(advancementCounterId) => patchProfile({ advancementCounterId })}
          placeholder="level_ups"
        />
        <NumberField
          label="Starting Rank"
          value={profile.startingRank}
          onChange={(startingRank) => patchProfile({ startingRank })}
        />
        <NumberField
          label="Ending Rank"
          value={profile.endingRank}
          onChange={(endingRank) => patchProfile({ endingRank })}
        />
        <SelectField
          label="At Maximum Rank"
          value={profile.maximumPolicy}
          options={maximumPolicyOptions}
          onChange={(maximumPolicy) => patchProfile({ maximumPolicy })}
        />
      </div>

      <CheckboxField
        label="Allow reconciliation to reduce an existing rank"
        checked={profile.allowRankDecrease === true}
        onChange={(checked) => patchProfile({ allowRankDecrease: checked })}
      />

      {profile.mode === "EXPLICIT_TABLE" ? (
        <p className="rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] px-4 py-3 text-xs leading-5 text-[var(--status-warning-text)]">
          Explicit threshold tables remain supported for total manual control and
          can be edited in the JSON Editor. Generated curves are the compact visual path.
        </p>
      ) : (
        <div className="grid gap-4 rounded-xl border border-white/10 bg-black/25 p-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Requirement Mode"
            value={profile.curve.requirementMode}
            options={requirementModeOptions}
            onChange={(requirementMode) => patchCurve({ requirementMode })}
          />
          <SelectField
            label="Curve Method"
            value={profile.curve.type}
            options={curveTypeOptions}
            onChange={(type) => patchCurve({ type })}
          />
          <NumberField
            label="Starting Requirement"
            value={profile.curve.startingRequirement}
            onChange={(startingRequirement) =>
              patchCurve({ startingRequirement })
            }
          />
          <NumberField
            label="Linear Increase"
            value={profile.curve.linearIncrease}
            onChange={(linearIncrease) => patchCurve({ linearIncrease })}
          />
          <NumberField
            label="Growth Multiplier"
            value={profile.curve.multiplier}
            onChange={(multiplier) => patchCurve({ multiplier })}
          />
          <NumberField
            label="Power Exponent"
            value={profile.curve.exponent}
            onChange={(exponent) => patchCurve({ exponent })}
          />
          <NumberField
            label="Minimum Increase"
            value={profile.curve.minimumIncrease}
            onChange={(minimumIncrease) => patchCurve({ minimumIncrease })}
          />
          <NumberField
            label="Round To"
            value={profile.curve.roundTo}
            onChange={(roundTo) => patchCurve({ roundTo })}
          />
          <SelectField
            label="Rounding"
            value={profile.curve.rounding}
            options={roundingOptions}
            onChange={(rounding) => patchCurve({ rounding })}
          />
        </div>
      )}

      {profile.mode === "GENERATED_CURVE_WITH_OVERRIDES" ? (
        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={EYEBROW_CLASS}>Rank Overrides</p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                Override a generated per-rank cost or cumulative threshold for selected ranks.
              </p>
            </div>
            <SmallButton onClick={addOverride}>
              <Plus size={13} />
              Add override
            </SmallButton>
          </div>
          <div className="mt-4 grid gap-3">
            {profile.overrides.map((override, index) => (
              <OverrideCard
                key={override.id || index}
                override={override}
                index={index}
                onChange={(next) => patchOverride(index, next)}
                onRemove={() => removeOverride(index)}
              />
            ))}
            {!profile.overrides.length ? (
              <p className="text-xs text-[var(--ink-dim)]">No rank overrides.</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={EYEBROW_CLASS}>Derived Counters</p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Recalculate proficiency, talent points, health, or other counters from the resulting rank.
            </p>
          </div>
          <SmallButton onClick={addDerivedValue}>
            <Plus size={13} />
            Add derived counter
          </SmallButton>
        </div>
        <div className="mt-4 grid gap-3">
          {profile.derivedValues.map((rule, index) => (
            <DerivedValueCard
              key={rule.id || index}
              rule={rule}
              index={index}
              derivedMethodOptions={derivedMethodOptions}
              roundingOptions={roundingOptions}
              onChange={(next) => patchDerivedValue(index, next)}
              onRemove={() => removeDerivedValue(index)}
            />
          ))}
          {!profile.derivedValues.length ? (
            <p className="text-xs text-[var(--ink-dim)]">No derived counters configured.</p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
        <div className="border-b border-white/10 px-4 py-3">
          <p className={EYEBROW_CLASS}>Generated Threshold Preview</p>
          <p className="mt-2 text-xs text-[var(--ink-dim)]">
            {summary.transitionCount} transitions · maximum threshold {Math.round(summary.maximumThreshold).toLocaleString("en-US")}
          </p>
        </div>
        <div className="max-h-72 overflow-auto">
          <table className="w-full min-w-[34rem] text-left text-xs">
            <thead className="sticky top-0 bg-[#0b0a09] text-[var(--gold-ornament)]">
              <tr>
                <th className="px-4 py-3 font-normal uppercase tracking-[0.12em]">Rank</th>
                <th className="px-4 py-3 font-normal uppercase tracking-[0.12em]">Cost to Reach</th>
                <th className="px-4 py-3 font-normal uppercase tracking-[0.12em]">Total Requirement</th>
                {activeDerivedValues.map((rule) => (
                  <th key={rule.id} className="px-4 py-3 font-normal uppercase tracking-[0.12em]">
                    {rule.label || rule.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row) => (
                <tr key={row.rank} className="border-t border-white/5 text-[var(--ink-dim)]">
                  <td className="px-4 py-3 text-[var(--ink)]">{row.rank}</td>
                  <td className="px-4 py-3">{Math.round(row.requirement).toLocaleString("en-US")}</td>
                  <td className="px-4 py-3">{Math.round(row.totalRequirement).toLocaleString("en-US")}</td>
                  {row.derivedValues.map((derivedValue) => (
                    <td key={derivedValue.id} className="px-4 py-3">
                      {derivedValue.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
