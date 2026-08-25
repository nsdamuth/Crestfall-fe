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
  onUpdateProfileField = null,
  definitionSelectionModeOptions = [],
  onUpdateDefinitionSelectionMode = null,
  onUpdateDefinitionSelectionUnique = null,
  onAddDefinitionSelectionGroup = null,
  onRemoveDefinitionSelectionGroup = null,
  onUpdateDefinitionSelectionGroupField = null,
  roomLocalDefinitionAuthoringModeOptions = [],
  roomLocalDefinitionCoreFields = [],
  roomLocalDefinitionChoiceInputModes = [],
  roomLocalCustomFieldInputModes = [],
  onUpdateRoomLocalDefinitionAuthoringMode = null,
  onUpdateRoomLocalDefinitionAuthoringUniqueTitles = null,
  onAddRoomLocalDefinitionAuthoringGroup = null,
  onRemoveRoomLocalDefinitionAuthoringGroup = null,
  onUpdateRoomLocalDefinitionAuthoringGroupField = null,
  onToggleRoomLocalDefinitionAuthoringGroupListValue = null,
  onAddRoomLocalDefinitionCustomTextField = null,
  onRemoveRoomLocalDefinitionCustomTextField = null,
  onUpdateRoomLocalDefinitionCustomTextField = null,
  onAddDefinition = null, onRemoveDefinition = null,
  onUpdateDefinitionField = null, onUpdatePrerequisiteField = null,
  onUpdateTargetField = null, onUpdateRestrictionField = null, onUpdatePolicyField = null,
  onAddCost = null, onUpdateCostField = null, onRemoveCost = null,
  onAddOperationReference = null, onUpdateOperationReferenceField = null, onRemoveOperationReference = null,
  onOpenJsonEditor = null,
}) {
  const definitions = profile.abilityDefinitions || [];
  const definitionSelection =
    profile.actorConfiguration?.definitionSelection &&
    typeof profile.actorConfiguration.definitionSelection === "object"
      ? profile.actorConfiguration.definitionSelection
      : { mode: "NONE", requireUniqueDefinitions: false, groups: [] };
  const selectionGroups = Array.isArray(definitionSelection.groups)
    ? definitionSelection.groups
    : [];
  const roomLocalDefinitionAuthoring =
    profile.actorConfiguration?.roomLocalDefinitionAuthoring &&
    typeof profile.actorConfiguration.roomLocalDefinitionAuthoring === "object"
      ? profile.actorConfiguration.roomLocalDefinitionAuthoring
      : { mode: "NONE", requireUniqueTitles: false, groups: [] };
  const roomLocalAuthoringGroups = Array.isArray(roomLocalDefinitionAuthoring.groups)
    ? roomLocalDefinitionAuthoring.groups
    : [];
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Actor Setup · Starting Abilities
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--muted)]">
              Optionally require players to choose starting definitions from this
              profile before play. Groups filter the existing reusable roster by
              type, school, or category. This does not create new player-authored
              Ability or Spell definitions.
            </p>
          </div>
          {definitionSelection.mode === "GROUPS" ? (
            <button
              type="button"
              onClick={() => onAddDefinitionSelectionGroup?.()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.14em]"
            >
              <Plus size={15} /> Add Selection Group
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Starting selection mode</Label>
            <select
              value={definitionSelection.mode || "NONE"}
              onChange={(event) =>
                onUpdateDefinitionSelectionMode?.(event.target.value)
              }
              className={inputClass}
            >
              {definitionSelectionModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-end gap-3 pb-3 text-sm">
            <input
              type="checkbox"
              checked={definitionSelection.requireUniqueDefinitions === true}
              disabled={definitionSelection.mode !== "GROUPS"}
              onChange={(event) =>
                onUpdateDefinitionSelectionUnique?.(event.target.checked)
              }
            />
            A definition can satisfy only one starting group
          </label>
        </div>

        {definitionSelection.mode === "GROUPS" ? (
          <div className="mt-5 space-y-3">
            {selectionGroups.map((group, groupIndex) => (
              <div
                key={`${group.id}-${groupIndex}`}
                className="rounded-xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {group.title || group.id || `Selection Group ${groupIndex + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveDefinitionSelectionGroup?.(groupIndex)}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-100"
                  >
                    <Trash2 size={13} /> Remove Group
                  </button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div><Label>Group ID</Label><TextInput value={group.id} onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "id", value)} /></div>
                  <div><Label>Title</Label><TextInput value={group.title} onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "title", value)} /></div>
                  <div><Label>Minimum selections</Label><TextInput type="number" min={0} value={group.minimumSelections} onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "minimumSelections", value)} /></div>
                  <div><Label>Maximum selections</Label><TextInput type="number" min={0} value={group.maximumSelections} onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "maximumSelections", value)} /></div>
                  <div><Label>Allowed types</Label><TextInput value={(group.allowedTypes || []).join(", ")} placeholder="ABILITY, TECHNIQUE" onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "allowedTypes", value)} /></div>
                  <div><Label>Allowed schools</Label><TextInput value={(group.allowedSchools || []).join(", ")} placeholder="FIRE, WATER" onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "allowedSchools", value)} /></div>
                  <div><Label>Allowed categories</Label><TextInput value={(group.allowedCategories || []).join(", ")} placeholder="OFFENSE, UTILITY" onChange={(value) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "allowedCategories", value)} /></div>
                  <label className="flex items-end gap-3 pb-3 text-sm"><input type="checkbox" checked={group.requireSameSchool === true} onChange={(event) => onUpdateDefinitionSelectionGroupField?.(groupIndex, "requireSameSchool", event.target.checked)} /> Selected definitions must share a school</label>
                </div>
              </div>
            ))}
            {!selectionGroups.length ? (
              <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-[var(--muted)]">
                Add at least one selection group, then filter it using the profile's existing definition types, schools, or categories.
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Actor Setup · Player-Authored Room Abilities
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--muted)]">
              Optionally require players to author room-local Ability/Spell definitions during Character Configuration.
              These definitions are narrative-only in this version: player input cannot create operation references, costs,
              cooldowns, charges, targeting authority, prerequisites, restrictions, or mastery rules.
            </p>
          </div>
          {roomLocalDefinitionAuthoring.mode === "GROUPS" ? (
            <button
              type="button"
              onClick={() => onAddRoomLocalDefinitionAuthoringGroup?.()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.14em]"
            >
              <Plus size={15} /> Add Authoring Group
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Room-local authoring mode</Label>
            <select
              value={roomLocalDefinitionAuthoring.mode || "NONE"}
              onChange={(event) => onUpdateRoomLocalDefinitionAuthoringMode?.(event.target.value)}
              className={inputClass}
            >
              {roomLocalDefinitionAuthoringModeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <label className="flex items-end gap-3 pb-3 text-sm">
            <input
              type="checkbox"
              checked={roomLocalDefinitionAuthoring.requireUniqueTitles === true}
              disabled={roomLocalDefinitionAuthoring.mode !== "GROUPS"}
              onChange={(event) =>
                onUpdateRoomLocalDefinitionAuthoringUniqueTitles?.(event.target.checked)
              }
            />
            Player-authored definition titles must be unique
          </label>
        </div>

        {roomLocalDefinitionAuthoring.mode === "GROUPS" ? (
          <div className="mt-5 space-y-4">
            {roomLocalAuthoringGroups.map((group, groupIndex) => (
              <div key={`${group.id}-${groupIndex}`} className="rounded-xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{group.title || group.id || `Authoring Group ${groupIndex + 1}`}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Mechanics mode: {group.mechanicsMode || "NARRATIVE_ONLY"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveRoomLocalDefinitionAuthoringGroup?.(groupIndex)}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-100"
                  >
                    <Trash2 size={13} /> Remove Group
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div><Label>Group ID</Label><TextInput value={group.id} onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "id", value)} /></div>
                  <div><Label>Title</Label><TextInput value={group.title} onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "title", value)} /></div>
                  <div><Label>Minimum definitions</Label><TextInput type="number" min={0} value={group.minimumDefinitions} onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "minimumDefinitions", value)} /></div>
                  <div><Label>Maximum definitions</Label><TextInput type="number" min={0} value={group.maximumDefinitions} onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "maximumDefinitions", value)} /></div>
                  <div><Label>Allowed types</Label><TextInput value={(group.allowedTypes || []).join(", ")} placeholder="ABILITY, TECHNIQUE" onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "allowedTypes", value)} /></div>
                  <div><Label>School input</Label><Select value={group.schoolInputMode || "AUTO"} options={roomLocalDefinitionChoiceInputModes} onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "schoolInputMode", value)} /></div>
                  <div><Label>School choices</Label><TextInput value={(group.allowedSchools || []).join(", ")} placeholder="FIRE, WATER" onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "allowedSchools", value)} /></div>
                  <div><Label>Category input</Label><Select value={group.categoryInputMode || "AUTO"} options={roomLocalDefinitionChoiceInputModes} onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "categoryInputMode", value)} /></div>
                  <div><Label>Category choices</Label><TextInput value={(group.allowedCategories || []).join(", ")} placeholder="OFFENSE, UTILITY" onChange={(value) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "allowedCategories", value)} /></div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <Label>Visible core fields</Label>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                      {roomLocalDefinitionCoreFields.map((field) => (
                        <label key={field} className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={(group.visibleFields || []).includes(field)}
                            onChange={(event) =>
                              onToggleRoomLocalDefinitionAuthoringGroupListValue?.(
                                groupIndex,
                                "visibleFields",
                                field,
                                event.target.checked
                              )
                            }
                          />
                          {field.replaceAll("_", " ")}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <Label>Required core fields</Label>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                      {["DESCRIPTION", "NARRATIVE_DESCRIPTION"].map((field) => (
                        <label key={field} className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={(group.requiredFields || []).includes(field)}
                            disabled={!(group.visibleFields || []).includes(field)}
                            onChange={(event) =>
                              onToggleRoomLocalDefinitionAuthoringGroupListValue?.(
                                groupIndex,
                                "requiredFields",
                                field,
                                event.target.checked
                              )
                            }
                          />
                          {field.replaceAll("_", " ")}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-end gap-3 pb-3 text-sm"><input type="checkbox" checked={group.requireSameSchool === true} disabled={!(group.visibleFields || []).includes("SCHOOL")} onChange={(event) => onUpdateRoomLocalDefinitionAuthoringGroupField?.(groupIndex, "requireSameSchool", event.target.checked)} /> Authored definitions must share a school</label>
                  <div className="flex items-end"><div className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[var(--muted)]">Descriptive only — does not create or execute game mechanics</div></div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Custom player fields</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">Creator-defined fields can be free text or bounded choices. Their values describe the authored definition; they do not create mechanics authority.</p>
                    </div>
                    <button type="button" onClick={() => onAddRoomLocalDefinitionCustomTextField?.(groupIndex)} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs"><Plus size={13} /> Add Field</button>
                  </div>
                  <div className="mt-3 space-y-3">
                    {(group.customTextFields || []).map((field, fieldIndex) => (
                      <div key={`${field.id}-${fieldIndex}`} className="grid gap-3 rounded-lg border border-white/10 p-3 md:grid-cols-2 xl:grid-cols-8">
                        <div><Label>Field ID</Label><TextInput value={field.id} onChange={(value) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "id", value)} /></div>
                        <div><Label>Field title</Label><TextInput value={field.title} onChange={(value) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "title", value)} /></div>
                        <div><Label>Input type</Label><Select value={field.inputMode || "LONG_TEXT"} options={roomLocalCustomFieldInputModes} onChange={(value) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "inputMode", value)} /></div>
                        <div className="xl:col-span-2"><Label>Choices</Label><TextInput value={(field.options || []).join(", ")} placeholder="OPTION A, OPTION B" onChange={(value) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "options", value)} /></div>
                        <div className="xl:col-span-2"><Label>Helper text</Label><TextInput value={field.helperText || ""} onChange={(value) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "helperText", value)} /></div>
                        <div><Label>Max length</Label><TextInput type="number" min={1} value={field.maxLength} onChange={(value) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "maxLength", value)} /></div>
                        <div className="flex items-end gap-3 pb-2 xl:col-span-8">
                          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={field.required === true} onChange={(event) => onUpdateRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex, "required", event.target.checked)} /> Required</label>
                          <button type="button" onClick={() => onRemoveRoomLocalDefinitionCustomTextField?.(groupIndex, fieldIndex)} className="rounded-lg border border-rose-300/20 p-2 text-rose-100"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                    {!(group.customTextFields || []).length ? <p className="text-xs text-[var(--muted)]">No custom fields. Title plus any visible/required core fields still apply.</p> : null}
                  </div>
                </div>
              </div>
            ))}
            {!roomLocalAuthoringGroups.length ? (
              <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-[var(--muted)]">
                Add an authoring group to define how many room-local definitions the player must create and which descriptive fields the game requires.
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

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
