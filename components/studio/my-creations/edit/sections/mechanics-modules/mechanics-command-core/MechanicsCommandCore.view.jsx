"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import {
  COMMAND_ARGUMENT_TYPES,
  COMMAND_PRESENTATION_MODES,
  COMMAND_RESULT_VISIBILITIES,
} from "./MechanicsCommandCore.contract.js";

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
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <div className="mt-2 rounded-xl border border-white/10 bg-black/35 p-3 focus-within:border-[var(--muted-gold)]/50">
        {safeValues.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {safeValues.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-[var(--foreground)]"
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
          className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
        />
        <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">
          Type one value, then press Enter or comma. Existing values remain editable as chips.
        </p>
      </div>
    </label>
  );
}

function SmallActionButton({ children, onClick, variant = "gold", title }) {
  const className =
    variant === "danger"
      ? "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
      : "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]";

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
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Command
          </p>
          <h4 className="mt-1 text-xl text-[var(--foreground)]">
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
        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Reason
          </span>
          <textarea
            value={model.safeCommand.reason || ""}
            onChange={(event) => model.patchIdentity("reason", event.target.value)}
            rows={2}
            placeholder="The player is now settled."
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
          />
        </label>
      </div>
    </>
  );
}

export function MechanicsCommandInvocationView({ model }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Structured Invocation v1
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Canonical commands parse quoted positional arguments, resolve typed targets,
            and can use deterministic or server-authoritative threshold, advantage,
            disadvantage, opposed, and degree-of-success resolution.
          </p>
        </div>
        <SmallActionButton onClick={model.addArgument}>
          <Plus size={14} />
          Add Argument
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
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Command Mode</span>
          <select
            value={model.presentation.mode}
            onChange={(event) =>
              model.patchPresentation({ mode: event.target.value })
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {COMMAND_PRESENTATION_MODES.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Result Visibility</span>
          <select
            value={model.presentation.resultVisibility}
            onChange={(event) =>
              model.patchPresentation({ resultVisibility: event.target.value })
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {COMMAND_RESULT_VISIBILITIES.map((visibility) => (
              <option key={visibility} value={visibility}>{visibility}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={model.presentation.continueNarrative}
            onChange={(event) =>
              model.patchPresentation({ continueNarrative: event.target.checked })
            }
            className="h-4 w-4 accent-[var(--muted-gold)]"
          />
          Continue the fictional scene after execution
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={model.presentation.advanceTime}
            onChange={(event) =>
              model.patchPresentation({ advanceTime: event.target.checked })
            }
            className="h-4 w-4 accent-[var(--muted-gold)]"
          />
          Allow normal turn-time advancement
        </label>
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
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Argument {argumentIndex + 1}
            </p>
            <button
              type="button"
              onClick={() => model.removeArgument(argumentIndex)}
              className="rounded-[var(--radius-md)] border border-white/10 p-2 text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
              title="Remove argument"
            >
              <Trash2 size={13} />
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
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Type</span>
              <select
                value={argument.type}
                onChange={(event) => {
                  const nextType = event.target.value;
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
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
              >
                {COMMAND_ARGUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            {model.isImplicitTargetArgumentType(argument.type) ? (
              <p className="rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/5 px-4 py-3 text-xs leading-5 text-[var(--muted)] md:col-span-3">
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
                <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
                  Leave either bound empty when the command should not enforce that limit during argument parsing.
                </p>
              </>
            ) : null}

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={argument.required !== false}
                disabled={model.isImplicitTargetArgumentType(argument.type)}
                onChange={(event) =>
                  model.patchArgument(argumentIndex, {
                    required: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              Required
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={argument.consumeRemaining === true}
                disabled={
                  model.isImplicitTargetArgumentType(argument.type) ||
                  argumentIndex !== model.lastPositionalArgumentIndex
                }
                onChange={(event) =>
                  model.patchArgument(argumentIndex, {
                    consumeRemaining: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              Consume remaining text
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={argument.allowQuoted !== false}
                disabled={model.isImplicitTargetArgumentType(argument.type)}
                onChange={(event) =>
                  model.patchArgument(argumentIndex, {
                    allowQuoted: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              Allow quoted values
            </label>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--muted)]">
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
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Triggers
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {model.triggers.map((trigger, triggerIndex) => (
          <span
            key={`${trigger}-${triggerIndex}`}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-[var(--foreground)]"
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
          <span className="text-xs text-[var(--muted)]">No triggers yet.</span>
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
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
        />
        <SmallActionButton onClick={submitTrigger}>
          <Plus size={14} />
          Add Trigger
        </SmallActionButton>
      </div>
    </div>
  );
}
