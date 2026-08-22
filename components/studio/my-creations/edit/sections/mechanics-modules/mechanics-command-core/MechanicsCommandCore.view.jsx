"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import {
  COMMAND_ARGUMENT_TYPES,
  COMMAND_PRESENTATION_MODES,
  COMMAND_RESULT_VISIBILITIES,
} from "./MechanicsCommandCore.contract.js";
import {
  CheckboxField,
  SelectField,
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
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] transition placeholder:text-[var(--ink-dim)]"
      />
    </label>
  );
}

function TokenListField({
  label,
  values = [],
  onChange,
  placeholder,
  normalizeToken,
}) {
  const [draft, setDraft] = useState("");
  const safeValues = Array.isArray(values) ? values : [];

  function commitDraft() {
    const additions = String(draft || "")
      .split(",")
      .map((value) => normalizeToken(value))
      .filter(Boolean);

    if (!additions.length) {
      setDraft("");
      return;
    }

    onChange([...new Set([...safeValues, ...additions])]);
    setDraft("");
  }

  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <div className="mt-2 rounded-xl border border-white/10 bg-black/35 p-3 focus-within:border-[var(--gold-ornament)]/50">
        {safeValues.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {safeValues.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-[var(--ink)]"
              >
                <span className="break-all">{value}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      safeValues.filter(
                        (_current, currentIndex) => currentIndex !== index
                      )
                    )
                  }
                  className="inline-flex items-center gap-1 text-[var(--status-danger)] transition hover:opacity-80"
                  title={`Remove ${value}`}
                >
                  <X size={12} />
                  Remove
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commitDraft();
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
        />
        <p className="mt-2 text-[11px] leading-5 text-[var(--ink-dim)]">
          Type one value, then press Enter or comma. Existing values remain editable as chips.
        </p>
      </div>
    </label>
  );
}

function SmallActionButton({ children, onClick, variant = "gold", title }) {
  const className = `cf-btn cf-btn--sm ${
    variant === "danger" ? "cf-btn--danger" : "cf-btn--primary"
  }`;

  return (
    <button type="button" title={title} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function MechanicsCommandIdentityView({ model, onRemoveCommand }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            Command
          </p>
          <h4 className="mt-1 text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {model.safeCommand.label ||
              model.safeCommand.id ||
              `Command ${model.commandIndex + 1}`}
          </h4>
        </div>
        <SmallActionButton
          variant="danger"
          title="Remove command"
          onClick={onRemoveCommand}
        >
          <Trash2 size={14} />
          Remove
        </SmallActionButton>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextField
          label="Command ID"
          value={model.safeCommand.id || ""}
          onChange={(value) => model.patchIdentity("id", value)}
          placeholder="mark_player_settled"
        />
        <TextField
          label="Label"
          value={model.safeCommand.label || ""}
          onChange={(value) => model.patchIdentity("label", value)}
          placeholder="Mark Player Settled"
        />
        <div className="md:col-span-2">
          <TextAreaField
            label="Reason"
            value={model.safeCommand.reason || ""}
            onChange={(value) => model.patchIdentity("reason", value)}
            placeholder="The player is now settled."
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </>
  );
}

export function MechanicsCommandInvocationView({ model }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={EYEBROW_CLASS}>
            Structured Invocation v1
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            Canonical commands parse quoted positional arguments, resolve typed targets,
            and can use deterministic or server-authoritative threshold, advantage,
            disadvantage, opposed, and degree-of-success resolution.
          </p>
        </div>
        <SmallActionButton onClick={model.addArgument}>
          <Plus size={14} />
          Add argument
        </SmallActionButton>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          label="Canonical Command"
          value={model.invocation.command}
          onChange={(value) =>
            model.patchInvocation({ command: model.normalizeCommandName(value) })
          }
          placeholder="cast"
        />
        <TokenListField
          label="Prefixes"
          values={model.invocation.prefixes}
          onChange={(values) =>
            model.patchInvocation({
              prefixes: values.map(model.normalizeCommandPrefix).filter(Boolean),
            })
          }
          normalizeToken={model.normalizeCommandPrefix}
          placeholder="Type / then Enter; type # then Enter"
        />
        <TokenListField
          label="Creator Aliases"
          values={model.invocation.aliases}
          onChange={(values) =>
            model.patchInvocation({
              aliases: values.map(model.normalizeCommandName).filter(Boolean),
            })
          }
          normalizeToken={model.normalizeCommandName}
          placeholder="Type an alias, then press Enter"
        />
        <SelectField
          label="Command Mode"
          value={model.presentation.mode}
          onChange={(value) => model.patchPresentation({ mode: value })}
          options={COMMAND_PRESENTATION_MODES.map((mode) => ({
            value: mode,
            label: mode,
          }))}
        />
        <SelectField
          label="Result Visibility"
          value={model.presentation.resultVisibility}
          onChange={(value) => model.patchPresentation({ resultVisibility: value })}
          options={COMMAND_RESULT_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: visibility,
          }))}
        />
        <CheckboxField
          label="Continue the fictional scene after execution"
          checked={model.presentation.continueNarrative}
          onChange={(checked) => model.patchPresentation({ continueNarrative: checked })}
        />
        <CheckboxField
          label="Allow normal turn-time advancement"
          checked={model.presentation.advanceTime}
          onChange={(checked) => model.patchPresentation({ advanceTime: checked })}
        />
      </div>
    </>
  );
}

export function MechanicsCommandArgumentsView({ model }) {
  return model.invocation.arguments.length ? (
    <div className="mt-4 grid gap-3">
      {model.invocation.arguments.map((argument, argumentIndex) => (
        <div
          key={`${argument.name}-${argumentIndex}`}
          className="rounded-xl border border-white/10 bg-black/35 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className={EYEBROW_CLASS}>
              Argument {argumentIndex + 1}
            </p>
            <button
              type="button"
              onClick={() => model.removeArgument(argumentIndex)}
              className="cf-btn cf-btn--danger cf-btn--sm"
              title="Remove argument"
              aria-label="Remove argument"
            >
              <Trash2 size={13} />
              <span className="text-xs">Remove</span>
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TextField
              label="Argument Name"
              value={argument.name}
              onChange={(value) =>
                model.patchArgument(argumentIndex, {
                  name: model.slugifyCommandId(
                    value,
                    `argument_${argumentIndex + 1}`
                  ),
                })
              }
              placeholder="target"
            />
            <TextField
              label="Label"
              value={argument.label}
              onChange={(value) =>
                model.patchArgument(argumentIndex, { label: value })
              }
              placeholder="Target"
            />
            <SelectField
              label="Type"
              value={argument.type}
              onChange={(nextType) => {
                const nextIsImplicit =
                  model.isImplicitTargetArgumentType(nextType);
                const currentIsImplicit =
                  model.isImplicitTargetArgumentType(argument.type);
                model.patchArgument(argumentIndex, {
                  type: nextType,
                  ...(nextIsImplicit
                    ? { required: false, consumeRemaining: false, allowQuoted: false }
                    : currentIsImplicit
                      ? {
                          required: true,
                          consumeRemaining:
                            argumentIndex ===
                            model.invocation.arguments.length - 1,
                          allowQuoted: true,
                        }
                      : {}),
                });
              }}
              options={COMMAND_ARGUMENT_TYPES.map((type) => ({
                value: type,
                label: type,
              }))}
            />

            {model.isImplicitTargetArgumentType(argument.type) ? (
              <p className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)] md:col-span-3">
                This target is resolved automatically from the active Mechanics actor or Player Character. The command takes no text for this argument.
              </p>
            ) : null}

            {argument.type === "ENUM" ? (
              <div className="md:col-span-3">
                <TextField
                  label="Allowed Values (comma-separated)"
                  value={(argument.options || []).join(", ")}
                  onChange={(value) =>
                    model.patchArgument(argumentIndex, {
                      options: model.normalizeCommandStringList(value),
                    })
                  }
                  placeholder="on, off"
                />
              </div>
            ) : null}

            {argument.type === "NUMBER" ? (
              <>
                <TextField
                  label="Min"
                  type="number"
                  value={argument.min ?? ""}
                  onChange={(value) =>
                    model.patchArgument(argumentIndex, {
                      min: value === "" ? null : Number(value),
                    })
                  }
                  placeholder="Optional minimum"
                />
                <TextField
                  label="Max"
                  type="number"
                  value={argument.max ?? ""}
                  onChange={(value) =>
                    model.patchArgument(argumentIndex, {
                      max: value === "" ? null : Number(value),
                    })
                  }
                  placeholder="Optional maximum"
                />
                <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
                  Leave either bound empty when the command should not enforce that limit during argument parsing.
                </p>
              </>
            ) : null}

            <CheckboxField
              label="Required"
              checked={argument.required !== false}
              disabled={model.isImplicitTargetArgumentType(argument.type)}
              onChange={(checked) =>
                model.patchArgument(argumentIndex, { required: checked })
              }
            />
            <CheckboxField
              label="Consume remaining text"
              checked={argument.consumeRemaining === true}
              disabled={
                model.isImplicitTargetArgumentType(argument.type) ||
                argumentIndex !== model.lastPositionalArgumentIndex
              }
              onChange={(checked) =>
                model.patchArgument(argumentIndex, { consumeRemaining: checked })
              }
            />
            <CheckboxField
              label="Allow quoted values"
              checked={argument.allowQuoted !== false}
              disabled={model.isImplicitTargetArgumentType(argument.type)}
              onChange={(checked) =>
                model.patchArgument(argumentIndex, { allowQuoted: checked })
              }
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
      No structured arguments. Commands such as #sheet or /help do not need one.
    </p>
  );
}

export function MechanicsCommandTriggersView({ model }) {
  const [draft, setDraft] = useState("");

  function submitTrigger() {
    if (model.addTrigger(draft)) setDraft("");
  }

  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
      <p className={EYEBROW_CLASS}>
        Triggers
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {model.triggers.map((trigger, triggerIndex) => (
          <span
            key={`${trigger}-${triggerIndex}`}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-[var(--ink)]"
          >
            <span className="break-all">{trigger}</span>
            <button
              type="button"
              onClick={() => model.removeTrigger(triggerIndex)}
              className="inline-flex items-center gap-1 text-[var(--status-danger)] transition hover:opacity-80"
              title="Remove trigger"
            >
              <X size={12} />
              Remove
            </button>
          </span>
        ))}
        {!model.triggers.length ? (
          <span className="text-xs text-[var(--ink-dim)]">No triggers yet.</span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-col gap-2 md:flex-row">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitTrigger();
            }
          }}
          placeholder="/settled"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] transition placeholder:text-[var(--ink-dim)]"
        />
        <SmallActionButton onClick={submitTrigger}>
          <Plus size={14} />
          Add trigger
        </SmallActionButton>
      </div>
    </div>
  );
}
