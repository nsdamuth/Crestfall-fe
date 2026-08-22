"use client";

import { Plus, Trash2 } from "lucide-react";

import { CheckboxField, SelectField } from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function numberValue(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function ActionButton({ children, onClick, disabled = false, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="cf-btn cf-btn--primary cf-btn--sm"
    >
      {children}
    </button>
  );
}

function ModifierList({
  side,
  title,
  description,
  modifiers = [],
  onAdd,
  onPatch,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            {title}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <ActionButton onClick={() => onAdd(side)}>
          <Plus size={14} />
          Add fixed modifier
        </ActionButton>
      </div>

      {modifiers.length ? (
        <div className="mt-4 grid gap-3">
          {modifiers.map((modifier, modifierIndex) => (
            <div
              key={modifier.id || modifierIndex}
              className="rounded-xl border border-white/10 bg-black/35 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className={EYEBROW_CLASS}>
                  Fixed Modifier {modifierIndex + 1}
                </p>
                <button
                  type="button"
                  onClick={() => onRemove(side, modifierIndex)}
                  className="cf-btn cf-btn--danger cf-btn--sm"
                  title="Remove fixed modifier"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <TextField
                  label="Modifier ID"
                  value={modifier.id}
                  onChange={(value) =>
                    onPatch(side, modifierIndex, { id: value })
                  }
                  placeholder="skill_bonus"
                />
                <TextField
                  label="Label"
                  value={modifier.label}
                  onChange={(value) =>
                    onPatch(side, modifierIndex, { label: value })
                  }
                  placeholder="Skill Bonus"
                />
                <TextField
                  label="Value"
                  type="number"
                  value={String(modifier.value ?? 0)}
                  onChange={(value) =>
                    onPatch(side, modifierIndex, {
                      value: numberValue(value, 0),
                    })
                  }
                  placeholder="2"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
          No fixed modifiers. The raw kept roll is used unless an authoritative source contributes a modifier.
        </p>
      )}
    </div>
  );
}

function ModifierSourceCard({
  side,
  source,
  sourceIndex,
  argumentOptions,
  sourceTypes,
  buckets,
  scopeModes,
  targetProperties,
  roundingModes,
  missingPolicies,
  isBooleanTargetProperty,
  onPatch,
  onRemove,
}) {
  const targetSource = source.type.startsWith("TARGET_");
  const mechanicsSource = source.type.includes("MECHANICS_VALUE");
  const targetProperty = source.type === "TARGET_PROPERTY";
  const booleanProperty =
    targetProperty && isBooleanTargetProperty(source.property);

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>
          Authoritative Source {sourceIndex + 1}
        </p>
        <button
          type="button"
          onClick={() => onRemove(side, sourceIndex)}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove authoritative modifier source"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          label="Source ID"
          value={source.id}
          onChange={(value) => onPatch(side, sourceIndex, { id: value })}
          placeholder="actor_skill"
        />
        <TextField
          label="Label"
          value={source.label}
          onChange={(value) => onPatch(side, sourceIndex, { label: value })}
          placeholder="Actor Skill"
        />

        <SelectField
          label="Source Type"
          value={source.type}
          onChange={(value) => onPatch(side, sourceIndex, { type: value })}
          options={sourceTypes.map((type) => ({
            value: type,
            label: type.replaceAll("_", " "),
          }))}
        />

        {targetSource ? (
          <SelectField
            label="Resolved Argument"
            value={source.argumentName}
            placeholder="Select an argument"
            onChange={(value) =>
              onPatch(side, sourceIndex, { argumentName: value })
            }
            options={argumentOptions.map((argument) => ({
              value: argument.name,
              label: `${argument.label} · ${argument.type}`,
            }))}
          />
        ) : null}

        {mechanicsSource ? (
          <>
            <SelectField
              label="Mechanics Bucket"
              value={source.bucket}
              onChange={(value) => onPatch(side, sourceIndex, { bucket: value })}
              options={buckets.map((bucket) => ({ value: bucket, label: bucket }))}
            />
            <TextField
              label="Mechanics State ID"
              value={source.mechanicsId}
              onChange={(value) =>
                onPatch(side, sourceIndex, { mechanicsId: value })
              }
              placeholder="skill"
            />
          </>
        ) : null}

        {source.type === "MECHANICS_VALUE" ? (
          <>
            <SelectField
              label="Mechanics Scope"
              value={source.scopeMode}
              onChange={(value) =>
                onPatch(side, sourceIndex, { scopeMode: value })
              }
              options={scopeModes.map((mode) => ({
                value: mode,
                label: mode.replaceAll("_", " "),
              }))}
            />
            {source.scopeMode === "EXPLICIT" ? (
              <TextField
                label="Explicit Scope Key"
                value={source.scopeKey}
                onChange={(value) =>
                  onPatch(side, sourceIndex, { scopeKey: value })
                }
                placeholder="PARTICIPANT:..."
              />
            ) : null}
          </>
        ) : null}

        {targetProperty ? (
          <>
            <SelectField
              label="Target Property"
              value={source.property}
              onChange={(value) =>
                onPatch(side, sourceIndex, { property: value })
              }
              options={targetProperties.map((property) => ({
                value: property,
                label: property.replaceAll("_", " "),
              }))}
            />

            {booleanProperty ? (
              <>
                <SelectField
                  label="Expected Property Value"
                  value={source.expected ? "true" : "false"}
                  onChange={(value) =>
                    onPatch(side, sourceIndex, { expected: value === "true" })
                  }
                  options={[
                    { value: "true", label: "true" },
                    { value: "false", label: "false" },
                  ]}
                />
                <TextField
                  label="Modifier When Matched"
                  type="number"
                  value={String(source.valueWhenTrue)}
                  onChange={(value) =>
                    onPatch(side, sourceIndex, {
                      valueWhenTrue: numberValue(value, 1),
                    })
                  }
                  placeholder="2"
                />
                <TextField
                  label="Modifier When Not Matched"
                  type="number"
                  value={String(source.valueWhenFalse)}
                  onChange={(value) =>
                    onPatch(side, sourceIndex, {
                      valueWhenFalse: numberValue(value, 0),
                    })
                  }
                  placeholder="-2"
                />
              </>
            ) : null}
          </>
        ) : null}

        <div className="rounded-xl border border-white/10 bg-black/25 p-4 md:col-span-2">
          <p className={EYEBROW_CLASS}>
            Numeric Transform
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            Crestfall computes (raw × multiplier) ÷ divisor + offset, then rounds and clamps the result.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TextField
              label="Multiplier"
              type="number"
              value={String(source.multiplier)}
              onChange={(value) =>
                onPatch(side, sourceIndex, {
                  multiplier: numberValue(value, 1),
                })
              }
              placeholder="1"
            />
            <TextField
              label="Divisor"
              type="number"
              value={String(source.divisor)}
              onChange={(value) =>
                onPatch(side, sourceIndex, {
                  divisor: numberValue(value, 1) || 1,
                })
              }
              placeholder="1"
            />
            <TextField
              label="Offset"
              type="number"
              value={String(source.offset)}
              onChange={(value) =>
                onPatch(side, sourceIndex, {
                  offset: numberValue(value, 0),
                })
              }
              placeholder="0"
            />
            <SelectField
              label="Rounding"
              value={source.rounding}
              onChange={(value) => onPatch(side, sourceIndex, { rounding: value })}
              options={roundingModes.map((rounding) => ({
                value: rounding,
                label: rounding,
              }))}
            />
            <TextField
              label="Minimum Modifier"
              type="number"
              value={String(source.minModifier)}
              onChange={(value) =>
                onPatch(side, sourceIndex, {
                  minModifier: numberValue(value, -1000),
                })
              }
              placeholder="-5"
            />
            <TextField
              label="Maximum Modifier"
              type="number"
              value={String(source.maxModifier)}
              onChange={(value) =>
                onPatch(side, sourceIndex, {
                  maxModifier: numberValue(value, 1000),
                })
              }
              placeholder="5"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <SelectField
            label="Missing Evidence Policy"
            value={source.missingPolicy}
            onChange={(value) =>
              onPatch(side, sourceIndex, { missingPolicy: value })
            }
            options={missingPolicies.map((policy) => ({
              value: policy,
              label: policy,
            }))}
            helperText="IGNORE records unavailable evidence without a modifier. REJECT blocks the command before any roll."
          />
        </div>
      </div>
    </div>
  );
}

function ModifierSourceList({
  side,
  title,
  description,
  sources = [],
  argumentOptions,
  sourceTypes,
  buckets,
  scopeModes,
  targetProperties,
  roundingModes,
  missingPolicies,
  isBooleanTargetProperty,
  onAdd,
  onPatch,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            {title}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <ActionButton onClick={() => onAdd(side)}>
          <Plus size={14} />
          Add source
        </ActionButton>
      </div>

      {sources.length ? (
        <div className="mt-4 grid gap-3">
          {sources.map((source, sourceIndex) => (
            <ModifierSourceCard
              key={source.id || sourceIndex}
              side={side}
              source={source}
              sourceIndex={sourceIndex}
              argumentOptions={argumentOptions}
              sourceTypes={sourceTypes}
              buckets={buckets}
              scopeModes={scopeModes}
              targetProperties={targetProperties}
              roundingModes={roundingModes}
              missingPolicies={missingPolicies}
              isBooleanTargetProperty={isBooleanTargetProperty}
              onPatch={onPatch}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
          No authoritative sources. Add one to derive a bonus or penalty from Mechanics state or a resolved target.
        </p>
      )}
    </div>
  );
}

export default function MechanicsCommandResolutionView({
  resolution,
  argumentOptions,
  referenceId,
  referenceConfigurations,
  resolutionModes,
  rollModes,
  tiePolicies,
  modifierSourceTypes,
  modifierBuckets,
  modifierScopeModes,
  targetProperties,
  roundingModes,
  missingPolicies,
  isRolling,
  setReferenceId,
  applyReference,
  patchResolution,
  patchOpposed,
  addModifier,
  patchModifier,
  removeModifier,
  addModifierSource,
  patchModifierSource,
  removeModifierSource,
  isBooleanTargetProperty,
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            Resolution
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            Configure server-authoritative automatic, threshold, advantage, disadvantage, opposed, degree-of-success, and modifier-source resolution.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
        <p className={EYEBROW_CLASS}>
          Reference Configuration
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
          Apply a safe starter configuration. This replaces only this command’s Resolution block; arguments, requirements, effects, outcomes, and domain actions remain unchanged.
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
          <div className="min-w-0 flex-1">
            <SelectField
              label="Reference configuration"
              value={referenceId}
              placeholder="Select a reference configuration"
              onChange={(value) => setReferenceId(value)}
              options={referenceConfigurations.map((reference) => ({
                value: reference.id,
                label: `${reference.label} · ${reference.description}`,
              }))}
            />
          </div>

          <ActionButton onClick={applyReference} disabled={!referenceId}>
            Apply reference
          </ActionButton>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SelectField
          label="Resolution Mode"
          value={resolution.mode}
          onChange={(value) => patchResolution({ mode: value })}
          options={resolutionModes.map((mode) => ({
            value: mode,
            label: mode.replaceAll("_", " "),
          }))}
        />

        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
          {resolution.mode === "THRESHOLD_DIE"
            ? "Crestfall rolls the actor check on services-api and compares its final total to the target number."
            : resolution.mode === "OPPOSED_DIE"
              ? "Crestfall rolls actor and opposition checks independently on services-api, then compares their final totals."
              : "No roll is made. The command resolves as an automatic Success and proceeds to its configured effects."}
        </div>
      </div>

      {isRolling ? (
        <div className="mt-4 grid gap-4">
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className={EYEBROW_CLASS}>
              Actor Check
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <TextField
                label="Die Count"
                type="number"
                value={String(resolution.die.count)}
                onChange={(value) =>
                  patchResolution({
                    die: {
                      ...resolution.die,
                      count: numberValue(value, 1),
                    },
                  })
                }
                placeholder="1"
              />
              <TextField
                label="Die Sides"
                type="number"
                value={String(resolution.die.sides)}
                onChange={(value) =>
                  patchResolution({
                    die: {
                      ...resolution.die,
                      sides: numberValue(value, 20),
                    },
                  })
                }
                placeholder="20"
              />

              <SelectField
                label="Roll Policy"
                value={resolution.rollMode}
                onChange={(value) => patchResolution({ rollMode: value })}
                options={rollModes.map((mode) => ({ value: mode, label: mode }))}
              />

              {resolution.mode === "THRESHOLD_DIE" ? (
                <TextField
                  label="Target Number"
                  type="number"
                  value={String(resolution.targetNumber ?? 11)}
                  onChange={(value) =>
                    patchResolution({
                      targetNumber: numberValue(value, 11),
                    })
                  }
                  placeholder="11"
                />
              ) : null}

              <CheckboxField
                label="Actor natural maximum is a Critical Success"
                checked={resolution.criticalOnNaturalMax}
                onChange={(checked) =>
                  patchResolution({ criticalOnNaturalMax: checked })
                }
              />

              <CheckboxField
                label="Actor natural minimum is a Fumble"
                checked={resolution.fumbleOnNaturalMin}
                onChange={(checked) =>
                  patchResolution({ fumbleOnNaturalMin: checked })
                }
              />
            </div>
          </div>

          <ModifierList
            side="ACTOR"
            title="Actor Fixed Modifiers"
            description="Authored constant bonuses and penalties applied after the kept roll set is selected."
            modifiers={resolution.modifiers}
            onAdd={addModifier}
            onPatch={patchModifier}
            onRemove={removeModifier}
          />

          <ModifierSourceList
            side="ACTOR"
            title="Actor Authoritative Modifier Sources"
            description="Resolve bonuses or penalties from current Mechanics state or resolved command-target evidence before the roll result is finalized."
            sources={resolution.modifierSources}
            argumentOptions={argumentOptions}
            sourceTypes={modifierSourceTypes}
            buckets={modifierBuckets}
            scopeModes={modifierScopeModes}
            targetProperties={targetProperties}
            roundingModes={roundingModes}
            missingPolicies={missingPolicies}
            isBooleanTargetProperty={isBooleanTargetProperty}
            onAdd={addModifierSource}
            onPatch={patchModifierSource}
            onRemove={removeModifierSource}
          />

          {resolution.mode === "OPPOSED_DIE" ? (
            <div className="rounded-xl border border-[var(--gold-ornament)]/20 bg-black/25 p-4">
              <p className={EYEBROW_CLASS}>
                Opposition Check
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <TextField
                  label="Opposition Label"
                  value={resolution.opposed?.label || "Opposition"}
                  onChange={(value) => patchOpposed({ label: value })}
                  placeholder="Defense"
                />
                <TextField
                  label="Die Count"
                  type="number"
                  value={String(resolution.opposed?.die?.count ?? 1)}
                  onChange={(value) =>
                    patchOpposed({
                      die: {
                        ...asObject(resolution.opposed?.die),
                        count: numberValue(value, 1),
                      },
                    })
                  }
                  placeholder="1"
                />
                <TextField
                  label="Die Sides"
                  type="number"
                  value={String(resolution.opposed?.die?.sides ?? 20)}
                  onChange={(value) =>
                    patchOpposed({
                      die: {
                        ...asObject(resolution.opposed?.die),
                        sides: numberValue(value, 20),
                      },
                    })
                  }
                  placeholder="20"
                />

                <SelectField
                  label="Roll Policy"
                  value={resolution.opposed?.rollMode || "NORMAL"}
                  onChange={(value) => patchOpposed({ rollMode: value })}
                  options={rollModes.map((mode) => ({ value: mode, label: mode }))}
                />

                <SelectField
                  label="Tie Policy"
                  value={resolution.opposed?.tiePolicy || "OPPOSITION_WINS"}
                  onChange={(value) => patchOpposed({ tiePolicy: value })}
                  options={tiePolicies.map((policy) => ({
                    value: policy,
                    label: policy.replaceAll("_", " "),
                  }))}
                />

                <div className="grid gap-3">
                  <CheckboxField
                    label="Opposition natural maximum is critical"
                    checked={resolution.opposed?.criticalOnNaturalMax !== false}
                    onChange={(checked) =>
                      patchOpposed({ criticalOnNaturalMax: checked })
                    }
                  />
                  <CheckboxField
                    label="Opposition natural minimum is a fumble"
                    checked={resolution.opposed?.fumbleOnNaturalMin !== false}
                    onChange={(checked) =>
                      patchOpposed({ fumbleOnNaturalMin: checked })
                    }
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <ModifierList
                  side="OPPOSITION"
                  title="Opposition Fixed Modifiers"
                  description="Authored constant bonuses and penalties for the opposition side."
                  modifiers={resolution.opposed?.modifiers || []}
                  onAdd={addModifier}
                  onPatch={patchModifier}
                  onRemove={removeModifier}
                />

                <ModifierSourceList
                  side="OPPOSITION"
                  title="Opposition Authoritative Modifier Sources"
                  description="Resolve opposition-side evidence independently from the actor side."
                  sources={resolution.opposed?.modifierSources || []}
                  argumentOptions={argumentOptions}
                  sourceTypes={modifierSourceTypes}
                  buckets={modifierBuckets}
                  scopeModes={modifierScopeModes}
                  targetProperties={targetProperties}
                  roundingModes={roundingModes}
                  missingPolicies={missingPolicies}
                  isBooleanTargetProperty={isBooleanTargetProperty}
                  onAdd={addModifierSource}
                  onPatch={patchModifierSource}
                  onRemove={removeModifierSource}
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <CheckboxField
              label="Enable degree-of-success margin bands"
              checked={resolution.degreeOfSuccess?.enabled === true}
              onChange={(checked) =>
                patchResolution({
                  degreeOfSuccess: {
                    ...asObject(resolution.degreeOfSuccess),
                    enabled: checked,
                  },
                })
              }
            />

            {resolution.degreeOfSuccess?.enabled ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <TextField
                  label="Critical Success Margin"
                  type="number"
                  value={String(
                    resolution.degreeOfSuccess.criticalSuccessMargin
                  )}
                  onChange={(value) =>
                    patchResolution({
                      degreeOfSuccess: {
                        ...resolution.degreeOfSuccess,
                        criticalSuccessMargin: numberValue(value, 10),
                      },
                    })
                  }
                  placeholder="5"
                />
                <TextField
                  label="Fumble Margin"
                  type="number"
                  value={String(resolution.degreeOfSuccess.fumbleMargin)}
                  onChange={(value) =>
                    patchResolution({
                      degreeOfSuccess: {
                        ...resolution.degreeOfSuccess,
                        fumbleMargin: numberValue(value, -10),
                      },
                    })
                  }
                  placeholder="-5"
                />
                <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)] md:col-span-2">
                  Natural critical/fumble rules and opposed tie policy retain precedence. Margin bands classify non-natural results after final modifiers are applied.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
