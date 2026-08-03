"use client";

import { Plus, Trash2 } from "lucide-react";

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
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
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
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
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
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {title}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {description}
          </p>
        </div>

        <ActionButton onClick={() => onAdd(side)}>
          <Plus size={14} />
          Add Fixed Modifier
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
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                  Fixed Modifier {modifierIndex + 1}
                </p>
                <button
                  type="button"
                  onClick={() => onRemove(side, modifierIndex)}
                  className="rounded-lg border border-red-300/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
                  title="Remove fixed modifier"
                >
                  <Trash2 size={13} />
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
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
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
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
          Authoritative Source {sourceIndex + 1}
        </p>
        <button
          type="button"
          onClick={() => onRemove(side, sourceIndex)}
          className="rounded-lg border border-red-300/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
          title="Remove authoritative modifier source"
        >
          <Trash2 size={13} />
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

        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Source Type</span>
          <select
            value={source.type}
            onChange={(event) =>
              onPatch(side, sourceIndex, { type: event.target.value })
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {sourceTypes.map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>

        {targetSource ? (
          <label className="grid gap-2 text-sm text-[var(--muted)]">
            <span>Resolved Argument</span>
            <select
              value={source.argumentName}
              onChange={(event) =>
                onPatch(side, sourceIndex, {
                  argumentName: event.target.value,
                })
              }
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
            >
              <option value="">Select an argument</option>
              {argumentOptions.map((argument) => (
                <option key={argument.name} value={argument.name}>
                  {argument.label} · {argument.type}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {mechanicsSource ? (
          <>
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Mechanics Bucket</span>
              <select
                value={source.bucket}
                onChange={(event) =>
                  onPatch(side, sourceIndex, { bucket: event.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {buckets.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {bucket}
                  </option>
                ))}
              </select>
            </label>
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
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Mechanics Scope</span>
              <select
                value={source.scopeMode}
                onChange={(event) =>
                  onPatch(side, sourceIndex, {
                    scopeMode: event.target.value,
                  })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {scopeModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
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
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Target Property</span>
              <select
                value={source.property}
                onChange={(event) =>
                  onPatch(side, sourceIndex, {
                    property: event.target.value,
                  })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {targetProperties.map((property) => (
                  <option key={property} value={property}>
                    {property.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            {booleanProperty ? (
              <>
                <label className="grid gap-2 text-sm text-[var(--muted)]">
                  <span>Expected Property Value</span>
                  <select
                    value={source.expected ? "true" : "false"}
                    onChange={(event) =>
                      onPatch(side, sourceIndex, {
                        expected: event.target.value === "true",
                      })
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </label>
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
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Numeric Transform
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
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
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Rounding</span>
              <select
                value={source.rounding}
                onChange={(event) =>
                  onPatch(side, sourceIndex, {
                    rounding: event.target.value,
                  })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {roundingModes.map((rounding) => (
                  <option key={rounding} value={rounding}>
                    {rounding}
                  </option>
                ))}
              </select>
            </label>
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

        <label className="grid gap-2 text-sm text-[var(--muted)] md:col-span-2">
          <span>Missing Evidence Policy</span>
          <select
            value={source.missingPolicy}
            onChange={(event) =>
              onPatch(side, sourceIndex, {
                missingPolicy: event.target.value,
              })
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {missingPolicies.map((policy) => (
              <option key={policy} value={policy}>
                {policy}
              </option>
            ))}
          </select>
          <span className="text-[11px] leading-5 text-[var(--muted)]">
            IGNORE records unavailable evidence without a modifier. REJECT blocks the command before any roll.
          </span>
        </label>
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
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {title}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {description}
          </p>
        </div>

        <ActionButton onClick={() => onAdd(side)}>
          <Plus size={14} />
          Add Source
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
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
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
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Resolution
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Configure server-authoritative automatic, threshold, advantage, disadvantage, opposed, degree-of-success, and modifier-source resolution.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/5 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Reference Configuration
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Apply a safe starter configuration. This replaces only this command’s Resolution block; arguments, requirements, effects, outcomes, and domain actions remain unchanged.
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <select
            value={referenceId}
            onChange={(event) => setReferenceId(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            <option value="">Select a reference configuration</option>
            {referenceConfigurations.map((reference) => (
              <option key={reference.id} value={reference.id}>
                {reference.label} — {reference.description}
              </option>
            ))}
          </select>

          <ActionButton onClick={applyReference} disabled={!referenceId}>
            Apply Reference
          </ActionButton>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Resolution Mode</span>
          <select
            value={resolution.mode}
            onChange={(event) => patchResolution({ mode: event.target.value })}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {resolutionModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
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
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
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

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>Roll Policy</span>
                <select
                  value={resolution.rollMode}
                  onChange={(event) =>
                    patchResolution({ rollMode: event.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                >
                  {rollModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>

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

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={resolution.criticalOnNaturalMax}
                  onChange={(event) =>
                    patchResolution({
                      criticalOnNaturalMax: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[var(--muted-gold)]"
                />
                Actor natural maximum is a Critical Success
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={resolution.fumbleOnNaturalMin}
                  onChange={(event) =>
                    patchResolution({
                      fumbleOnNaturalMin: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[var(--muted-gold)]"
                />
                Actor natural minimum is a Fumble
              </label>
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
            <div className="rounded-xl border border-[var(--muted-gold)]/20 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
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

                <label className="grid gap-2 text-sm text-[var(--muted)]">
                  <span>Roll Policy</span>
                  <select
                    value={resolution.opposed?.rollMode || "NORMAL"}
                    onChange={(event) =>
                      patchOpposed({ rollMode: event.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                  >
                    {rollModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[var(--muted)]">
                  <span>Tie Policy</span>
                  <select
                    value={
                      resolution.opposed?.tiePolicy || "OPPOSITION_WINS"
                    }
                    onChange={(event) =>
                      patchOpposed({ tiePolicy: event.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                  >
                    {tiePolicies.map((policy) => (
                      <option key={policy} value={policy}>
                        {policy.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-3">
                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={
                        resolution.opposed?.criticalOnNaturalMax !== false
                      }
                      onChange={(event) =>
                        patchOpposed({
                          criticalOnNaturalMax: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[var(--muted-gold)]"
                    />
                    Opposition natural maximum is critical
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={resolution.opposed?.fumbleOnNaturalMin !== false}
                      onChange={(event) =>
                        patchOpposed({
                          fumbleOnNaturalMin: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[var(--muted-gold)]"
                    />
                    Opposition natural minimum is a fumble
                  </label>
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
            <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={resolution.degreeOfSuccess?.enabled === true}
                onChange={(event) =>
                  patchResolution({
                    degreeOfSuccess: {
                      ...asObject(resolution.degreeOfSuccess),
                      enabled: event.target.checked,
                    },
                  })
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              Enable degree-of-success margin bands
            </label>

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
                <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[var(--muted)] md:col-span-2">
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
