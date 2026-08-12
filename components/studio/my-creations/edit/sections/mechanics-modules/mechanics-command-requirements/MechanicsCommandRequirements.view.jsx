"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  COMMAND_PROGRESSION_ENFORCEMENTS,
  COMMAND_REQUIREMENT_OPERATORS,
  COMMAND_REQUIREMENT_TYPES,
} from "./MechanicsCommandRequirements.contract.js";
import {
  getDefaultCommandRequirementOperator,
  getDefaultCommandRequirementValue,
  isProgressionCommandRequirementType,
  isTargetCommandRequirementType,
  normalizeProgressionCommandRequirementEnforcement,
  normalizeProgressionRequirementTierIds,
  slugifyMechanicsRequirementId,
} from "./mechanicsCommandRequirementsNormalization.js";
import {
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

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
      <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
        <span>Expected Maximum-Level State</span>
        <select
          value={requirement.value === false ? "false" : "true"}
          onChange={(event) => onPatch({ value: event.target.value === "true" })}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
        >
          <option value="true">At maximum level</option>
          <option value="false">Not at maximum level</option>
        </select>
      </label>
    );
  }

  if (requirement.type === "FLAG") {
    return (
      <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
        <span>Expected Value</span>
        <select
          value={requirement.value === false ? "false" : "true"}
          onChange={(event) => onPatch({ value: event.target.value === "true" })}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
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

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className={EYEBROW_CLASS}>
          Requirement {requirementIndex + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove requirement"
        >
          <Trash2 size={13} />
          Remove
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

        <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
          <span>Requirement Type</span>
          <select
            value={requirement.type}
            onChange={(event) => {
              const nextType = event.target.value;
              const nextTargetRequirement = isTargetCommandRequirementType(nextType);
              const nextProgressionRequirement =
                isProgressionCommandRequirementType(nextType);
              onPatch({
                type: nextType,
                operator: getDefaultCommandRequirementOperator(nextType),
                value: getDefaultCommandRequirementValue(nextType),
                targetId: nextTargetRequirement
                  ? ""
                  : nextProgressionRequirement
                    ? requirement.targetId || "progression"
                    : requirement.targetId,
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
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
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
            label={progressionRequirement ? "Progression Binding ID" : "Mechanics State ID"}
            value={requirement.targetId}
            onChange={(value) =>
              onPatch({ targetId: slugifyMechanicsRequirementId(value, value) })
            }
            placeholder={
              progressionRequirement
                ? "progression"
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

        {targetRequirement || progressionRequirement ? null : (
          <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
            <span>Operator</span>
            <select
              value={requirement.operator}
              onChange={(event) => onPatch({ operator: event.target.value })}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
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
            <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
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
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
              >
                {COMMAND_PROGRESSION_ENFORCEMENTS.map((enforcement) => (
                  <option key={enforcement} value={enforcement}>
                    {enforcement}
                  </option>
                ))}
              </select>
            </label>
            <p className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)] md:col-span-2">
              {requirement.enforcement === "HARD_LOCK"
                ? "HARD_LOCK blocks this recognized command before attempt effects, resolution, outcome effects, and domain actions when the deterministic Progression requirement is not met."
                : "ADVISORY is the backward-compatible default. The deterministic Progression result is recorded, but command execution continues when the requirement is not met."}
            </p>
          </>
        ) : null}

        <div className="md:col-span-2">
          <TextAreaField
            label="Failure Message"
            value={requirement.message}
            onChange={(value) => onPatch({ message: value })}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
            placeholder="Mana must be at least 5."
          />
        </div>
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
          <p className={EYEBROW_CLASS}>
            Requirements
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            Ordinary Mechanics requirements must pass before Crestfall rolls or applies effects. Progression requirements may remain ADVISORY or explicitly use HARD_LOCK. Gameplay commands are also blocked while any active Mechanics HARD_LOCK guard is blocked.
          </p>
        </div>
        <button
          type="button"
          onClick={addRequirement}
          className="cf-btn cf-btn--primary cf-btn--sm"
        >
          <Plus size={14} />
          Add requirement
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
        <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
          No explicit requirements. The command may still be blocked by an active HARD_LOCK guard.
        </p>
      )}
    </div>
  );
}
