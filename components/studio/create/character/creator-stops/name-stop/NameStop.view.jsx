"use client";

import { NAME_STOP_LIMITS } from "./NameStop.contract";

function FieldLabel({ children, count, max }) {
  return (
    <label className="mb-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-3)] text-[var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      <span>{children}</span>
      <span className="flex-none font-normal tabular-nums text-[var(--ink-faint)]">
        {count}/{max}
      </span>
    </label>
  );
}

export default function NameStopView({
  name = "",
  title = "",
  onChangeName = null,
  onChangeTitle = null,
  onOpenTemplate = null,
} = {}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-6">
      <p className="eyebrow eyebrow--ruled text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        Forge a soul
      </p>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        A name is the first spell anyone casts on you.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        You can change anything later. Nothing on this path is required
        except an adult age.
      </p>

      <div className="mt-6">
        <FieldLabel count={name.length} max={NAME_STOP_LIMITS.name}>
          Name
        </FieldLabel>
        <input
          type="text"
          value={name}
          onChange={(event) => onChangeName?.(event.target.value)}
          maxLength={NAME_STOP_LIMITS.name}
          placeholder="Lilith"
          className="min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
        />
      </div>

      <div className="mt-4">
        <FieldLabel count={title.length} max={NAME_STOP_LIMITS.title}>
          Title, if they carry one
        </FieldLabel>
        <input
          type="text"
          value={title}
          onChange={(event) => onChangeTitle?.(event.target.value)}
          maxLength={NAME_STOP_LIMITS.title}
          placeholder="The First Exile"
          className="min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
        />
      </div>

      <button
        type="button"
        onClick={() => onOpenTemplate?.()}
        className="mt-4 text-[var(--text-ui)] text-[var(--ink-dim)] underline decoration-[var(--line-strong)] underline-offset-4 transition hover:text-[var(--gold-bright)]"
      >
        Or start from a template
      </button>
    </div>
  );
}
