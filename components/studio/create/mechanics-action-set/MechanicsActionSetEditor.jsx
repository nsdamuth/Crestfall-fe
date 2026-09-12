"use client";

import { useMemo, useState } from "react";
import { Activity, Plus, X } from "lucide-react";

import MechanicsAssetPickerModal from "@/components/studio/my-creations/edit/sections/mechanics-actions/MechanicsAssetPickerModal";
import {
  MECHANICS_ACTION_SET_DEFINITION_VERSION,
  MECHANICS_ACTION_SET_MAX_ACTIONS,
  buildActionReference,
  normalizeArray,
  normalizeObject,
  normalizeString,
} from "./mechanicsActionSetContract";

export default function MechanicsActionSetEditor({ value = {}, onChange, keyLocked = false }) {
  const source = normalizeObject(value);
  const references = normalizeArray(source.actionReferences);
  const [pickerOpen, setPickerOpen] = useState(false);
  const excludedIds = useMemo(() => references.map((reference) => reference.actionCreationId).filter(Boolean), [references]);

  function patch(field, nextValue) {
    onChange?.({ ...source, setVersion: MECHANICS_ACTION_SET_DEFINITION_VERSION, [field]: nextValue });
  }
  function attachAction(creation) {
    if (!creation?.id || references.length >= MECHANICS_ACTION_SET_MAX_ACTIONS) return;
    patch("actionReferences", [...references, buildActionReference(creation)]);
  }
  function removeAction(creationId) {
    patch("actionReferences", references.filter((reference) => reference.actionCreationId !== creationId));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Stable Action Set key</span><input value={normalizeString(source.id)} readOnly={keyLocked} onChange={(event) => patch("id", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm read-only:opacity-60" /></label>
        <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Set title</span><input value={normalizeString(source.title)} onChange={(event) => patch("title", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm" /></label>
      </div>
      <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Description</span><textarea value={normalizeString(source.description)} onChange={(event) => patch("description", event.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm" /></label>
      <div className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Actions</p><p className="mt-1 text-sm text-[var(--ink-dim)]">{references.length} / {MECHANICS_ACTION_SET_MAX_ACTIONS} reusable Action references</p></div><button type="button" onClick={() => setPickerOpen(true)} disabled={references.length >= MECHANICS_ACTION_SET_MAX_ACTIONS} className="cf-btn cf-btn--primary"><Plus size={14} /> Add Action</button></div>
        {references.length ? <div className="mt-4 grid gap-2">{references.map((reference) => <div key={reference.actionCreationId || reference.actionKey} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3"><div className="min-w-0"><p className="flex items-center gap-2 text-sm text-[var(--ink)]"><Activity size={14} className="text-[var(--gold-ornament)]" />{reference.title || reference.actionKey}</p><p className="mt-1 break-all text-xs text-[var(--ink-dim)]">{reference.actionKey}</p></div><button type="button" onClick={() => removeAction(reference.actionCreationId)} className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)]"><X size={14} /></button></div>)}</div> : <p className="mt-4 text-sm text-[var(--ink-dim)]">No Actions attached yet.</p>}
      </div>
      {pickerOpen ? <MechanicsAssetPickerModal creationType="MECHANICS_ACTION" excludedIds={excludedIds} title="Add Mechanics Action" description="Choose an owned or public first-class Mechanics Action to include in this reusable Action Set." onClose={() => setPickerOpen(false)} onSelected={attachAction} /> : null}
    </div>
  );
}
