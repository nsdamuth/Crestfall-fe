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
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

// Local TextField, not SharedFields.TextField: this file needs a
// native numeric input (type="number") for numeric requirement
// values, which SharedFields.TextField does not expose. Kept local
// intentionally rather than guessing at a shared-component change.
function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-[var(--space-1)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] transition placeholder:text-[var(--ink-faint)]"
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
      <SelectField
        label="Expected Maximum-Level State"
        value={requirement.value === false ? "false" : "true"}
        onChange={(value) => onPatch({ value: value === "true" })}
        options={[
          { value: "true", label: "At maximum level" },
          { value: "false", label: "Not at maximum level" },
        ]}
      />
    );
  }

  if (requirement.type === "FLAG") {
    return (
      <SelectField
        label="Expected Value"
        value={requirement.value === false ? "false" : "true"}
        onChange={(value) => onPatch({ value: value === "true" })}
        options={[
          { value: "true", label: "true" },
          { value: "false", label: "false" },
        ]}
      />
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

        <SelectField
          label="Requirement Type"
          value={requirement.type}
          onChange={(nextType) => {
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
          options={COMMAND_REQUIREMENT_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
        />

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
          <SelectField
            label="Operator"
            value={requirement.operator}
            onChange={(value) => onPatch({ operator: value })}
            options={COMMAND_REQUIREMENT_OPERATORS.map((operator) => ({
              value: operator,
              label: operator,
            }))}
          />
        )}

        <RequirementValueField requirement={requirement} onPatch={onPatch} />

        {progressionRequirement ? (
          <>
            <SelectField
              label="Enforcement Policy"
              value={requirement.enforcement}
              onChange={(value) =>
                onPatch({
                  enforcement: normalizeProgressionCommandRequirementEnforcement(value),
                })
              }
              options={COMMAND_PROGRESSION_ENFORCEMENTS.map((enforcement) => ({
                value: enforcement,
                label: enforcement,
              }))}
            />
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
    <div>
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
        <p className="mt-4 text-sm leading-6 text-[var(--ink-faint)]">
          No explicit requirements. The command may still be blocked by an active HARD_LOCK guard.
        </p>
      )}
    </div>
  );
}
