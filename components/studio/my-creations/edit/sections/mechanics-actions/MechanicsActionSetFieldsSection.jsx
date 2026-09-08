"use client";
import MechanicsActionSetEditor from "@/components/studio/create/mechanics-action-set/MechanicsActionSetEditor";
export default function MechanicsActionSetFieldsSection({ value = {}, onChange }) {
  return <div><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Mechanics Action Set</p><h2 className="mt-2 font-display text-3xl">Reusable Action availability</h2><p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">The stable Action Set key is immutable after creation. Add or remove trusted Action references here.</p><div className="mt-5"><MechanicsActionSetEditor value={value} onChange={onChange} keyLocked /></div></div>;
}
