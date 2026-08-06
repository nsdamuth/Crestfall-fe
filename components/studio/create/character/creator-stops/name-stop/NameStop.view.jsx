"use client";

import { Eyebrow, FieldLabel } from "../shared/Controls";
import { NAME_STOP_LIMITS } from "./NameStop.contract";

export default function NameStopView({
  name = "",
  title = "",
  onChangeName = null,
  onChangeTitle = null,
  onOpenTemplate = null,
} = {}) {
  return (
    <>
      <Eyebrow>Forge a soul</Eyebrow>
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
          className="cf-field min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
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
          className="cf-field min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
        />
      </div>

      <button
        type="button"
        onClick={() => onOpenTemplate?.()}
        className="mt-4 text-[var(--text-ui)] text-[var(--ink-dim)] underline decoration-[var(--line-strong)] underline-offset-4 transition hover:text-[var(--gold-bright)]"
      >
        Or start from a template
      </button>
    </>
  );
}
