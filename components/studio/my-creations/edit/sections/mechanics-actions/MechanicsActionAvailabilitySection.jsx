"use client";

import { useMemo, useState } from "react";
import { Activity, Layers3, Plus, X } from "lucide-react";
import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";
import MechanicsAssetPickerModal from "./MechanicsAssetPickerModal";

const VERSION = "mechanics_action_availability_v0";
const MAX_SETS = 32;
const MAX_DIRECT = 64;
function obj(value) { return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
function arr(value) { return Array.isArray(value) ? value : []; }
function str(value) { return typeof value === "string" ? value.trim() : ""; }

function setReference(creation = {}) {
  const data = obj(creation.data); const definition = obj(data.mechanics_action_set || data.mechanicsActionSet);
  return { referenceVersion: "mechanics_action_set_reference_v0", actionSetCreationId: str(creation.id), actionSetKey: str(data.actionSetKey || data.action_set_key || definition.id), title: str(creation.title) || str(definition.title), enabled: true, metadata: {} };
}
function actionReference(creation = {}) {
  const data = obj(creation.data); const definition = obj(data.mechanics_action || data.mechanicsAction || data.action);
  return { referenceVersion: "mechanics_action_reference_v0", actionCreationId: str(creation.id), actionKey: str(data.actionKey || data.action_key || definition.id), title: str(creation.title) || str(definition.title), enabled: true, metadata: {} };
}

export default function MechanicsActionAvailabilitySection({ form, updateDataField, ownerLabel = "this Story" }) {
  const [pickerType, setPickerType] = useState(null);
  const data = obj(form?.data);
  const availability = obj(data.mechanics_action_availability || data.mechanicsActionAvailability || data.actionAvailability);
  const setRefs = arr(availability.actionSetReferences);
  const actionRefs = arr(availability.actionReferences);
  const excludedSetIds = useMemo(() => setRefs.map((ref) => ref.actionSetCreationId).filter(Boolean), [setRefs]);
  const excludedActionIds = useMemo(() => actionRefs.map((ref) => ref.actionCreationId).filter(Boolean), [actionRefs]);

  function write(nextSets, nextActions) { updateDataField("mechanics_action_availability", { version: VERSION, actionSetReferences: nextSets, actionReferences: nextActions, metadata: obj(availability.metadata) }); }
  function addSet(creation) { if (!creation?.id || setRefs.length >= MAX_SETS) return; write([...setRefs, setReference(creation)], actionRefs); }
  function addAction(creation) { if (!creation?.id || actionRefs.length >= MAX_DIRECT) return; write(setRefs, [...actionRefs, actionReference(creation)]); }

  return <div><SectionTitle title="Available Actions" body={`Make reusable Mechanics Actions available to ${ownerLabel}. Action Sets are the normal path for shared rules; direct Actions are available for small exceptions.`}/>
    <div className="mt-6 grid gap-5">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]"><Layers3 size={20}/></div><div><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Action Sets</p><h3 className="mt-2 font-display text-2xl">Shared action libraries</h3><p className="mt-2 text-sm text-[var(--ink-dim)]">Attach up to {MAX_SETS} reusable Action Sets. Full Action bodies are not embedded here.</p></div></div><button type="button" onClick={() => setPickerType("MECHANICS_ACTION_SET")} disabled={setRefs.length >= MAX_SETS} className="cf-btn cf-btn--primary"><Plus size={14}/> Attach Action Set</button></div>
        {setRefs.length ? <div className="mt-4 grid gap-2">{setRefs.map((ref) => <div key={ref.actionSetCreationId} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3"><div><p className="text-sm">{ref.title || ref.actionSetKey}</p><p className="mt-1 break-all text-xs text-[var(--ink-dim)]">{ref.actionSetKey}</p></div><button type="button" onClick={() => write(setRefs.filter((item) => item.actionSetCreationId !== ref.actionSetCreationId), actionRefs)} className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)]"><X size={14}/></button></div>)}</div> : <p className="mt-4 text-sm text-[var(--ink-dim)]">No Action Sets attached.</p>}
      </div>
      <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-xl border border-white/10 bg-black/20 p-3 text-[var(--gold-ornament)]"><Activity size={20}/></div><div><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Direct Actions</p><h3 className="mt-2 font-display text-2xl">Advanced exceptions</h3><p className="mt-2 text-sm text-[var(--ink-dim)]">Attach individual Actions only when a reusable Set would be unnecessary.</p></div></div><button type="button" onClick={() => setPickerType("MECHANICS_ACTION")} disabled={actionRefs.length >= MAX_DIRECT} className="cf-btn cf-btn--secondary"><Plus size={14}/> Attach Action</button></div>
        {actionRefs.length ? <div className="mt-4 grid gap-2">{actionRefs.map((ref) => <div key={ref.actionCreationId} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"><div><p className="text-sm">{ref.title || ref.actionKey}</p><p className="mt-1 break-all text-xs text-[var(--ink-dim)]">{ref.actionKey}</p></div><button type="button" onClick={() => write(setRefs, actionRefs.filter((item) => item.actionCreationId !== ref.actionCreationId))} className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)]"><X size={14}/></button></div>)}</div> : null}
      </div>
      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--ink-dim)]"><strong className="text-[var(--ink)]">Availability is not executability.</strong> These bindings establish which Actions belong to the Story or actor package. Requirements and current authoritative state still decide whether an actor can execute an Action.</div>
    </div>
    {pickerType ? <MechanicsAssetPickerModal creationType={pickerType} excludedIds={pickerType === "MECHANICS_ACTION_SET" ? excludedSetIds : excludedActionIds} title={pickerType === "MECHANICS_ACTION_SET" ? "Attach Action Set" : "Attach Mechanics Action"} description={pickerType === "MECHANICS_ACTION_SET" ? "Choose a reusable Action Set. Public sets do not become callable unless explicitly attached here." : "Choose one direct Mechanics Action to make explicitly available."} onClose={() => setPickerType(null)} onSelected={pickerType === "MECHANICS_ACTION_SET" ? addSet : addAction}/>:null}
  </div>;
}
