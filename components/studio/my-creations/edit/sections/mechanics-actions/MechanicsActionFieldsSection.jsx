"use client";

import MechanicsActionJsonEditor from "@/components/studio/create/mechanics-action/MechanicsActionJsonEditor";

export default function MechanicsActionFieldsSection({ value = {}, onChange = null }) {
  return (
    <section className="space-y-5">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-1)] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">Executable Rule</p>
        <h2 className="mt-2 font-display text-3xl">Mechanics Action Definition</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
          This creation stores a first-class Action. Its stable <code>action.id</code> cannot be renamed after creation.
          Story/actor availability and chat invocation are separate runtime bindings.
        </p>
      </div>
      <MechanicsActionJsonEditor value={value} onChange={onChange} />
    </section>
  );
}
