"use client";

import { Braces, Plus, Trash2 } from "lucide-react";

import {
  ABILITY_SPELL_CHARGE_MODES,
  ABILITY_SPELL_CHARGE_RESET_POLICIES,
  ABILITY_SPELL_COOLDOWN_MODES,
  ABILITY_SPELL_COOLDOWN_UNITS,
  ABILITY_SPELL_COST_RESOURCE_TYPES,
  ABILITY_SPELL_COST_TIMINGS,
  ABILITY_SPELL_MASTERY_MODES,
  ABILITY_SPELL_TARGET_MODES,
  ABILITY_SPELL_TYPES,
} from "./AbilitySpellProfileEditor.contract";

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50";

function Label({ children }) {
  return <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">{children}</label>;
}

function TextInput({ value, onChange, placeholder = "", type = "text", min, max, step }) {
  return <input type={type} min={min} max={max} step={step} value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className={inputClass} />;
}

function TextArea({ value, onChange, rows = 3, placeholder = "" }) {
  return <textarea rows={rows} value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className={inputClass} />;
}

function Select({ value, options = [], onChange }) {
  return (
    <select value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} className={inputClass}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function ValidationPanel({ errors = [], warnings = [] }) {
  if (!errors.length && !warnings.length) {
    return <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">Ability & Spell Profile definitions are valid.</div>;
  }
  return (
    <div className="space-y-3">
      {errors.length ? <div className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-4 text-sm text-rose-100"><p className="font-semibold">Errors</p><ul className="mt-2 space-y-1">{errors.map((entry, index) => <li key={`${entry.code}-${entry.path}-${index}`}>{entry.path}: {entry.message}</li>)}</ul></div> : null}
      {warnings.length ? <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100"><p className="font-semibold">Warnings</p><ul className="mt-2 space-y-1">{warnings.map((entry, index) => <li key={`${entry.code}-${entry.path}-${index}`}>{entry.message}</li>)}</ul></div> : null}
    </div>
  );
}

function CostRows({ definition, definitionIndex, onAddCost, onUpdateCostField, onRemoveCost }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm font-semibold">Costs</p><p className="mt-1 text-xs text-[var(--muted)]">Definition-time references only. Resource mutation is not implemented by this profile.</p></div>
        <button type="button" onClick={() => onAddCost?.(definitionIndex)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs"><Plus size={13} /> Add Cost</button>
      </div>
      <div className="mt-4 space-y-3">
        {definition.costs.map((cost, costIndex) => (
          <div key={`${cost.id}-${costIndex}`} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-5">
            <div><Label>Cost ID</Label><TextInput value={cost.id} onChange={(value) => onUpdateCostField?.(definitionIndex, costIndex, "id", value)} /></div>
            <div><Label>Resource type</Label><Select value={cost.resourceType} options={ABILITY_SPELL_COST_RESOURCE_TYPES} onChange={(value) => onUpdateCostField?.(definitionIndex, costIndex, "resourceType", value)} /></div>
            <div><Label>Resource ID</Label><TextInput value={cost.resourceId || ""} placeholder="pool.mana" onChange={(value) => onUpdateCostField?.(definitionIndex, costIndex, "resourceId", value)} /></div>
            <div><Label>Amount</Label><TextInput type="number" min={0} step="any" value={cost.amount} onChange={(value) => onUpdateCostField?.(definitionIndex, costIndex, "amount", value)} /></div>
            <div className="flex items-end gap-2"><div className="min-w-0 flex-1"><Label>Timing</Label><Select value={cost.timing} options={ABILITY_SPELL_COST_TIMINGS} onChange={(value) => onUpdateCostField?.(definitionIndex, costIndex, "timing", value)} /></div><button type="button" onClick={() => onRemoveCost?.(definitionIndex, costIndex)} className="mb-1 rounded-lg border border-rose-300/20 p-2 text-rose-100"><Trash2 size={14} /></button></div>
          </div>
        ))}
        {!definition.costs.length ? <p className="text-xs text-[var(--muted)]">No resource costs authored.</p> : null}
      </div>
    </section>
  );
}

function OperationRows({ definition, definitionIndex, onAddOperationReference, onUpdateOperationReferenceField, onRemoveOperationReference }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm font-semibold">Mechanical Operation References</p><p className="mt-1 text-xs text-[var(--muted)]">Legacy v0 references remain declarative. Executable v1 references can be authored through JSON and run only after the trusted Ability/Spell use boundary.</p></div>
        <button type="button" onClick={() => onAddOperationReference?.(definitionIndex)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs"><Plus size={13} /> Add Reference</button>
      </div>
      <div className="mt-4 space-y-3">
        {definition.operationReferences.map((reference, referenceIndex) => (
          <div key={`${reference.id}-${referenceIndex}`} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-4">
            <div><Label>Reference ID</Label><TextInput value={reference.id} onChange={(value) => onUpdateOperationReferenceField?.(definitionIndex, referenceIndex, "id", value)} /></div>
            <div><Label>Domain</Label><TextInput value={reference.domain} placeholder="STATS_POOLS" onChange={(value) => onUpdateOperationReferenceField?.(definitionIndex, referenceIndex, "domain", value)} /></div>
            <div><Label>Operation</Label><TextInput value={reference.operation} placeholder="MUTATE_POOL" onChange={(value) => onUpdateOperationReferenceField?.(definitionIndex, referenceIndex, "operation", value)} /></div>
            <div className="flex items-end gap-2"><div className="min-w-0 flex-1"><Label>Version</Label><TextInput value={reference.version || ""} onChange={(value) => onUpdateOperationReferenceField?.(definitionIndex, referenceIndex, "version", value)} /></div><button type="button" onClick={() => onRemoveOperationReference?.(definitionIndex, referenceIndex)} className="mb-1 rounded-lg border border-rose-300/20 p-2 text-rose-100"><Trash2 size={14} /></button></div>
          </div>
        ))}
        {!definition.operationReferences.length ? <p className="text-xs text-[var(--muted)]">No typed operation references authored.</p> : null}
      </div>
    </section>
  );
}

export default function AbilitySpellProfileEditorView({
  profile = {}, errors = [], warnings = [], metrics = {},
  onUpdateProfileField = null, onAddDefinition = null, onRemoveDefinition = null,
  onUpdateDefinitionField = null, onUpdatePrerequisiteField = null,
  onUpdateTargetField = null, onUpdateRestrictionField = null, onUpdatePolicyField = null,
  onAddCost = null, onUpdateCostField = null, onRemoveCost = null,
  onAddOperationReference = null, onUpdateOperationReferenceField = null, onRemoveOperationReference = null,
  onOpenJsonEditor = null,
}) {
  const definitions = profile.abilityDefinitions || [];
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Definition Profile</p><h2 className="mt-2 font-display text-3xl">Ability & Spell Profile</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--muted)]">Shared definitions for Spells, Abilities, Techniques, Special Attacks, and Passives. Known state, mastery progress, cooldown remaining, charges, and resource balances remain actor-owned runtime state.</p></div>
          <button type="button" onClick={() => onOpenJsonEditor?.()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]"><Braces size={15} /> JSON Editor & AI Guide</button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div><Label>Profile title</Label><TextInput value={profile.title} onChange={(value) => onUpdateProfileField?.("title", value)} /></div>
          <div><Label>Tags</Label><TextInput value={(profile.tags || []).join(", ")} placeholder="abilities, magic, fantasy" onChange={(value) => onUpdateProfileField?.("tags", value)} /></div>
          <div className="lg:col-span-2"><Label>Description</Label><TextArea value={profile.description} onChange={(value) => onUpdateProfileField?.("description", value)} /></div>
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm"><input type="checkbox" checked={profile.enabled !== false} onChange={(event) => onUpdateProfileField?.("enabled", event.target.checked)} /> Profile enabled</label>
      </section>

      <ValidationPanel errors={errors} warnings={warnings} />

      <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">Definitions</p><p className="mt-1 text-sm text-[var(--muted)]">{metrics.enabledDefinitionCount || 0} enabled · {metrics.spellCount || 0} spells · {metrics.abilityCount || 0} abilities · {metrics.techniqueCount || 0} techniques · {metrics.passiveCount || 0} passives</p></div>
          <button type="button" onClick={() => onAddDefinition?.()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.14em]"><Plus size={15} /> Add Definition</button>
        </div>

        <div className="mt-5 space-y-5">
          {definitions.map((definition, definitionIndex) => (
            <article key={`${definition.id}-${definitionIndex}`} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-base font-semibold">{definition.title || definition.id || `Definition ${definitionIndex + 1}`}</p><p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{definition.id} · {definition.type}</p></div>
                <button type="button" onClick={() => onRemoveDefinition?.(definitionIndex)} className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-100"><Trash2 size={14} /> Remove</button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div><Label>Definition ID</Label><TextInput value={definition.id} placeholder="spell.fireball" onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "id", value)} /></div>
                <div><Label>Title</Label><TextInput value={definition.title} onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "title", value)} /></div>
                <div><Label>Type</Label><Select value={definition.type} options={ABILITY_SPELL_TYPES} onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "type", value)} /></div>
                <div><Label>Aliases</Label><TextInput value={(definition.aliases || []).join(", ")} onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "aliases", value)} /></div>
                <div><Label>School</Label><TextInput value={definition.school} placeholder="EVOCATION" onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "school", value)} /></div>
                <div><Label>Category</Label><TextInput value={definition.category} placeholder="OFFENSE" onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "category", value)} /></div>
                <div className="md:col-span-2"><Label>Tags</Label><TextInput value={(definition.tags || []).join(", ")} onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "tags", value)} /></div>
                <div className="md:col-span-2"><Label>Mechanical description</Label><TextArea value={definition.description} onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "description", value)} /></div>
                <div className="md:col-span-2"><Label>Narrative description</Label><TextArea value={definition.narrativeDescription} onChange={(value) => onUpdateDefinitionField?.(definitionIndex, "narrativeDescription", value)} /></div>
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm"><input type="checkbox" checked={definition.enabled !== false} onChange={(event) => onUpdateDefinitionField?.(definitionIndex, "enabled", event.target.checked)} /> Definition enabled</label>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold">Prerequisites</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div><Label>Minimum level</Label><TextInput type="number" min={0} value={definition.prerequisites.minimumLevel} onChange={(value) => onUpdatePrerequisiteField?.(definitionIndex, "minimumLevel", value)} /></div>
                    <div><Label>Required tiers</Label><TextInput value={(definition.prerequisites.requiredTierIds || []).join(", ")} placeholder="tier.apprentice" onChange={(value) => onUpdatePrerequisiteField?.(definitionIndex, "requiredTierIds", value)} /></div>
                    <div className="md:col-span-2"><Label>Required skills (skill.id:rank)</Label><TextInput value={(definition.prerequisites.requiredSkills || []).map((entry) => `${entry.skillId}:${entry.minimumRank}`).join(", ")} placeholder="skill.arcana:2, skill.focus:1" onChange={(value) => onUpdatePrerequisiteField?.(definitionIndex, "requiredSkills", value)} /></div>
                  </div>
                  <p className="mt-3 text-xs text-[var(--muted)]">Unlock references can be authored through the JSON editor in v0.</p>
                </section>

                <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold">Target Model</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div><Label>Mode</Label><Select value={definition.targetModel.mode} options={ABILITY_SPELL_TARGET_MODES} onChange={(value) => onUpdateTargetField?.(definitionIndex, "mode", value)} /></div>
                    <div><Label>Range class</Label><TextInput value={definition.targetModel.rangeClass} placeholder="SHORT" onChange={(value) => onUpdateTargetField?.(definitionIndex, "rangeClass", value)} /></div>
                    <div><Label>Minimum targets</Label><TextInput type="number" min={0} value={definition.targetModel.minimumTargets} onChange={(value) => onUpdateTargetField?.(definitionIndex, "minimumTargets", value)} /></div>
                    <div><Label>Maximum targets</Label><TextInput type="number" min={0} value={definition.targetModel.maximumTargets} onChange={(value) => onUpdateTargetField?.(definitionIndex, "maximumTargets", value)} /></div>
                  </div>
                  <label className="mt-3 flex items-center gap-3 text-sm"><input type="checkbox" checked={definition.targetModel.requiresLineOfSight === true} onChange={(event) => onUpdateTargetField?.(definitionIndex, "requiresLineOfSight", event.target.checked)} /> Requires line of sight</label>
                </section>

                <section className="rounded-xl border border-white/10 bg-black/20 p-4 lg:col-span-2">
                  <p className="text-sm font-semibold">Restrictions</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div><Label>Required tags</Label><TextInput value={(definition.restrictions.requiredTags || []).join(", ")} onChange={(value) => onUpdateRestrictionField?.(definitionIndex, "requiredTags", value)} /></div>
                    <div><Label>Forbidden tags</Label><TextInput value={(definition.restrictions.forbiddenTags || []).join(", ")} onChange={(value) => onUpdateRestrictionField?.(definitionIndex, "forbiddenTags", value)} /></div>
                    <div className="md:col-span-2"><Label>Restriction notes</Label><TextArea rows={2} value={definition.restrictions.notes} onChange={(value) => onUpdateRestrictionField?.(definitionIndex, "notes", value)} /></div>
                  </div>
                </section>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-3">
                <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold">Cooldown Policy</p>
                  <div className="mt-3 space-y-3"><div><Label>Mode</Label><Select value={definition.cooldownPolicy.mode} options={ABILITY_SPELL_COOLDOWN_MODES} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "cooldownPolicy", "mode", value)} /></div><div className="grid grid-cols-2 gap-3"><div><Label>Amount</Label><TextInput type="number" min={0} value={definition.cooldownPolicy.amount} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "cooldownPolicy", "amount", value)} /></div><div><Label>Unit</Label><Select value={definition.cooldownPolicy.unit} options={ABILITY_SPELL_COOLDOWN_UNITS} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "cooldownPolicy", "unit", value)} /></div></div></div>
                </section>
                <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold">Charge Policy</p>
                  <div className="mt-3 space-y-3"><div><Label>Mode</Label><Select value={definition.chargePolicy.mode} options={ABILITY_SPELL_CHARGE_MODES} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "chargePolicy", "mode", value)} /></div><div className="grid grid-cols-2 gap-3"><div><Label>Maximum charges</Label><TextInput type="number" min={0} value={definition.chargePolicy.maximumCharges} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "chargePolicy", "maximumCharges", value)} /></div><div><Label>Reset</Label><Select value={definition.chargePolicy.resetPolicy} options={ABILITY_SPELL_CHARGE_RESET_POLICIES} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "chargePolicy", "resetPolicy", value)} /></div></div></div>
                </section>
                <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold">Mastery Policy</p>
                  <div className="mt-3 space-y-3"><div><Label>Mode</Label><Select value={definition.masteryPolicy.mode} options={ABILITY_SPELL_MASTERY_MODES} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "masteryPolicy", "mode", value)} /></div><div><Label>Maximum mastery</Label><TextInput type="number" min={0} value={definition.masteryPolicy.maximumMastery} onChange={(value) => onUpdatePolicyField?.(definitionIndex, "masteryPolicy", "maximumMastery", value)} /></div></div>
                </section>
              </div>

              <div className="mt-4 space-y-4">
                <CostRows definition={definition} definitionIndex={definitionIndex} onAddCost={onAddCost} onUpdateCostField={onUpdateCostField} onRemoveCost={onRemoveCost} />
                <OperationRows definition={definition} definitionIndex={definitionIndex} onAddOperationReference={onAddOperationReference} onUpdateOperationReferenceField={onUpdateOperationReferenceField} onRemoveOperationReference={onRemoveOperationReference} />
              </div>
            </article>
          ))}
          {!definitions.length ? <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-[var(--muted)]">No definitions are authored yet. Add one or paste a complete profile through the JSON editor.</div> : null}
        </div>
      </section>
    </div>
  );
}
