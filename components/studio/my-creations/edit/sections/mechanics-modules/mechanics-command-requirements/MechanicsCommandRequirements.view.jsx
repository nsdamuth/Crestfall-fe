"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  COMMAND_PROGRESSION_ENFORCEMENTS,
  COMMAND_REQUIREMENT_OPERATORS,
  COMMAND_REQUIREMENT_TYPES,
} from "./MechanicsCommandRequirements.contract.js";
import {
  getDefaultActorMechanicsRequirementBindingId,
  getDefaultCommandRequirementOperator,
  getDefaultCommandRequirementValue,
  isActorMechanicsCommandRequirementType,
  isProgressionCommandRequirementType,
  isTargetCommandRequirementType,
  normalizeMechanicsRequirementReferenceId,
  normalizeProgressionCommandRequirementEnforcement,
  normalizeProgressionRequirementTierIds,
  slugifyMechanicsRequirementId,
} from "./mechanicsCommandRequirementsNormalization.js";

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

function RequirementValueField({ requirement, onPatch }) {
  if (isTargetCommandRequirementType(requirement.type)) {
    return (
      <TextField
        label="Argument Name"
        value={requirement.argumentName || "target"}
        onChange={(value) =>
          onPatch({ argumentName: slugifyMechanicsRequirementId(value, "target") })
        }
        placeholder="target"
      />
    );
  }

  if (requirement.type === "PROGRESSION_AT_MAXIMUM_LEVEL") {
    return (
      <label className="grid gap-2 text-sm text-[var(--muted)]">
        <span>Expected Maximum-Level State</span>
        <select
          value={requirement.value === false ? "false" : "true"}
          onChange={(event) => onPatch({ value: event.target.value === "true" })}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
        >
          <option value="true">At maximum level</option>
          <option value="false">Not at maximum level</option>
        </select>
      </label>
    );
  }

  if (
    requirement.type === "FLAG" ||
    [
      "STATS_POOLS_CONDITION_ACTIVE",
      "STATS_POOLS_CONDITION_INACTIVE",
      "STATS_POOLS_MODIFIER_ACTIVE",
      "STATS_POOLS_MODIFIER_INACTIVE",
    ].includes(requirement.type)
  ) {
    return (
      <label className="grid gap-2 text-sm text-[var(--muted)]">
        <span>Expected Value</span>
        <select
          value={requirement.value === false ? "false" : "true"}
          onChange={(event) => onPatch({ value: event.target.value === "true" })}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </label>
    );
  }

  const tierRequirement = [
    "PROGRESSION_REQUIRED_TIER",
    "PROGRESSION_FORBIDDEN_TIER",
  ].includes(requirement.type);
  const numericRequirement = [
    "COUNTER",
    "METER",
    "PROGRESSION_MINIMUM_LEVEL",
    "PROGRESSION_MAXIMUM_LEVEL",
    "STATS_POOLS_STAT_CURRENT",
    "STATS_POOLS_POOL_CURRENT",
    "STATS_POOLS_POOL_MAXIMUM",
    "SKILLS_RANK",
  ].includes(requirement.type);

  return (
    <TextField
      label={tierRequirement ? "Tier IDs" : "Expected Value"}
      type={numericRequirement ? "number" : "text"}
      value={
        tierRequirement
          ? (Array.isArray(requirement.value) ? requirement.value : []).join(", ")
          : String(requirement.value ?? "")
      }
      onChange={(value) =>
        onPatch({
          value: tierRequirement
            ? normalizeProgressionRequirementTierIds(value)
            : numericRequirement
              ? Number.isFinite(Number(value))
                ? Number(value)
                : 0
              : value,
        })
      }
      placeholder={
        tierRequirement
          ? "tier.veteran, tier.master"
          : requirement.type === "STAGE"
            ? "ready"
            : "5"
      }
    />
  );
}

function RequirementCard({ requirement, requirementIndex, onPatch, onRemove }) {
  const targetRequirement = isTargetCommandRequirementType(requirement.type);
  const progressionRequirement = isProgressionCommandRequirementType(requirement.type);
  const actorMechanicsRequirement =
    isActorMechanicsCommandRequirementType(requirement.type);

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Requirement {requirementIndex + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-red-300/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
          title="Remove requirement"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          label="Requirement ID"
          value={requirement.id}
          onChange={(value) =>
            onPatch({
              id: slugifyMechanicsRequirementId(
                value,
                `requirement_${requirementIndex + 1}`
              ),
            })
          }
          placeholder="mana_available"
        />

        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Requirement Type</span>
          <select
            value={requirement.type}
            onChange={(event) => {
              const nextType = event.target.value;
              const nextTargetRequirement = isTargetCommandRequirementType(nextType);
              const nextProgressionRequirement =
                isProgressionCommandRequirementType(nextType);
              const nextActorMechanicsRequirement =
                isActorMechanicsCommandRequirementType(nextType);
              onPatch({
                type: nextType,
                operator: getDefaultCommandRequirementOperator(nextType),
                value: getDefaultCommandRequirementValue(nextType),
                targetId: nextTargetRequirement
                  ? ""
                  : nextProgressionRequirement
                    ? requirement.targetId || "progression"
                    : nextActorMechanicsRequirement
                      ? normalizeMechanicsRequirementReferenceId(
                          requirement.targetId
                        )
                      : requirement.targetId,
                bindingId: nextActorMechanicsRequirement
                  ? normalizeMechanicsRequirementReferenceId(
                      requirement.bindingId,
                      getDefaultActorMechanicsRequirementBindingId(nextType)
                    )
                  : undefined,
                argumentName: nextTargetRequirement
                  ? requirement.argumentName || "target"
                  : "",
                enforcement: nextProgressionRequirement
                  ? normalizeProgressionCommandRequirementEnforcement(
                      requirement.enforcement
                    )
                  : undefined,
              });
            }}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {COMMAND_REQUIREMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {targetRequirement ? null : (
          <TextField
            label={
              progressionRequirement
                ? "Progression Binding ID"
                : actorMechanicsRequirement
                  ? "Definition ID"
                  : "Mechanics State ID"
            }
            value={requirement.targetId}
            onChange={(value) =>
              onPatch({
                targetId: actorMechanicsRequirement
                  ? normalizeMechanicsRequirementReferenceId(value)
                  : slugifyMechanicsRequirementId(value, value),
              })
            }
            placeholder={
              progressionRequirement
                ? "progression"
                : actorMechanicsRequirement
                  ? requirement.type === "SKILLS_RANK"
                    ? "skill.blade-mastery"
                    : requirement.type.includes("CONDITION")
                      ? "condition.injured"
                      : requirement.type.includes("MODIFIER")
                        ? "modifier.focused"
                        : requirement.type.includes("POOL")
                          ? "pool.health"
                          : "stat.strength"
                  : requirement.type === "METER"
                    ? "mana"
                    : requirement.type === "COUNTER"
                      ? "attempts"
                      : requirement.type === "STAGE"
                        ? "combat_phase"
                        : "spell_unlocked"
            }
          />
        )}

        {actorMechanicsRequirement ? (
          <TextField
            label="Actor Mechanics Binding ID"
            value={requirement.bindingId || ""}
            onChange={(value) =>
              onPatch({
                bindingId: normalizeMechanicsRequirementReferenceId(
                  value,
                  getDefaultActorMechanicsRequirementBindingId(requirement.type)
                ),
              })
            }
            placeholder={getDefaultActorMechanicsRequirementBindingId(
              requirement.type
            )}
          />
        ) : null}

        {targetRequirement || progressionRequirement ? null : (
          <label className="grid gap-2 text-sm text-[var(--muted)]">
            <span>Operator</span>
            <select
              value={requirement.operator}
              onChange={(event) => onPatch({ operator: event.target.value })}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
            >
              {COMMAND_REQUIREMENT_OPERATORS.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
          </label>
        )}

        <RequirementValueField requirement={requirement} onPatch={onPatch} />

        {progressionRequirement ? (
          <>
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Enforcement Policy</span>
              <select
                value={requirement.enforcement}
                onChange={(event) =>
                  onPatch({
                    enforcement: normalizeProgressionCommandRequirementEnforcement(
                      event.target.value
                    ),
                  })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {COMMAND_PROGRESSION_ENFORCEMENTS.map((enforcement) => (
                  <option key={enforcement} value={enforcement}>
                    {enforcement}
                  </option>
                ))}
              </select>
            </label>
            <p className="rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/5 px-4 py-3 text-xs leading-5 text-[var(--muted)] md:col-span-2">
              {requirement.enforcement === "HARD_LOCK"
                ? "HARD_LOCK blocks this recognized command before attempt effects, resolution, outcome effects, and domain actions when the deterministic Progression requirement is not met."
                : "ADVISORY is the backward-compatible default. The deterministic Progression result is recorded, but command execution continues when the requirement is not met."}
            </p>
          </>
        ) : null}

        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Failure Message
          </span>
          <textarea
            value={requirement.message}
            onChange={(event) => onPatch({ message: event.target.value })}
            rows={2}
            placeholder="Mana must be at least 5."
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
          />
        </label>
      </div>
    </div>
  );
}

export default function MechanicsCommandRequirementsView({
  requirements = [],
  addRequirement,
  patchRequirement,
  removeRequirement,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Requirements
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Ordinary Mechanics requirements must pass before Crestfall rolls or applies effects. Actor Mechanics requirements read authoritative Stats & Pools or Skills evidence through the same requirement language. Progression requirements may remain ADVISORY or explicitly use HARD_LOCK. Gameplay commands are also blocked while any active Mechanics HARD_LOCK guard is blocked.
          </p>
        </div>
        <button
          type="button"
          onClick={addRequirement}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Plus size={14} />
          Add Requirement
        </button>
      </div>

      {requirements.length ? (
        <div className="mt-4 grid gap-4">
          {requirements.map((requirement, requirementIndex) => (
            <RequirementCard
              key={requirement.id || requirementIndex}
              requirement={requirement}
              requirementIndex={requirementIndex}
              onPatch={(patch) => patchRequirement(requirementIndex, patch)}
              onRemove={() => removeRequirement(requirementIndex)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
          No explicit requirements. The command may still be blocked by an active HARD_LOCK guard.
        </p>
      )}
    </div>
  );
}
