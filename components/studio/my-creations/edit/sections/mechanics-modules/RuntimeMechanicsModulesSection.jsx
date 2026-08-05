"use client";

import { useState } from "react";
import { Activity, Link2, Plus, X } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";
import MechanicsModulePickerModal from "@/components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModulePickerModal";

const TRACKERS_MODULE_ID = "core.trackers.v1";
const MECHANICS_MODULE_CREATION_TYPE = "MECHANICS_MODULE";
const MECHANICS_MODULE_ROLE = "MECHANICS_MODULE";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeScopeMode(value, fallback = "BINDING_OWNER") {
  const normalized = normalizeString(value).toUpperCase();

  if (["STORY_ROOM", "BINDING_OWNER"].includes(normalized)) {
    return normalized;
  }

  return fallback;
}

function getMechanicsModuleId(binding = {}) {
  return (
    binding.mechanicsModuleCreationId ||
    binding.mechanics_module_creation_id ||
    binding.moduleInstanceId ||
    binding.module_instance_id ||
    binding.targetCreationId ||
    binding.target_creation_id ||
    ""
  );
}

function isMechanicsModuleBinding(binding = {}) {
  const role = normalizeString(binding.role).toUpperCase();
  const sourceType = normalizeString(binding.moduleSourceType).toUpperCase();

  return (
    binding?.moduleId === TRACKERS_MODULE_ID ||
    role === MECHANICS_MODULE_ROLE ||
    sourceType === MECHANICS_MODULE_CREATION_TYPE ||
    Boolean(getMechanicsModuleId(binding))
  );
}

function getMechanicsModuleBindings(data = {}) {
  return normalizeArray(data.engine_module_bindings).filter(
    isMechanicsModuleBinding
  );
}

function getNonMechanicsModuleBindings(data = {}) {
  return normalizeArray(data.engine_module_bindings).filter(
    (binding) => !isMechanicsModuleBinding(binding)
  );
}

function getMechanicsModulePriority(moduleCreation) {
  const data = normalizeObject(moduleCreation?.data);
  const priority = Number(data.priority);

  return Number.isFinite(priority) ? priority : 65;
}

function buildMechanicsModuleBinding(
  moduleCreation,
  {
    defaultInheritanceMode = "LOCAL_ONLY",
    defaultMechanicsScopeMode = "BINDING_OWNER",
  } = {}
) {
  const data = normalizeObject(moduleCreation?.data);
  const instanceData = normalizeObject(data.instanceData);

  return {
    moduleId: data.moduleDefinitionId || data.moduleId || TRACKERS_MODULE_ID,
    moduleSourceType: MECHANICS_MODULE_CREATION_TYPE,
    mechanicsModuleCreationId: moduleCreation.id,
    moduleInstanceId: moduleCreation.id,
    moduleInstanceTitle: moduleCreation.title || "Untitled Mechanics Module",
    role: MECHANICS_MODULE_ROLE,
    enabled: true,
    inheritanceMode: defaultInheritanceMode,
    mechanicsScopeMode: defaultMechanicsScopeMode,
    priority: getMechanicsModulePriority(moduleCreation),
    operationTriggers: {
      chatTurnDefault: "get_tracker_context",
      ...(data.operationTriggers || {}),
    },
    data: {
      moduleDefinitionId: data.moduleDefinitionId || TRACKERS_MODULE_ID,
      contractVersion: data.contractVersion || instanceData.contractVersion || "",
      tags: normalizeArray(data.tags),
    },
  };
}

export default function RuntimeMechanicsModulesSection({
  form,
  updateDataField,
  ownerLabel = "this creation",
  defaultInheritanceMode = "LOCAL_ONLY",
  defaultMechanicsScopeMode = "BINDING_OWNER",
  showSectionTitle = true,
}) {
  const [mechanicsPickerOpen, setMechanicsPickerOpen] = useState(false);

  const data = normalizeObject(form.data);
  const mechanicsModuleBindings = getMechanicsModuleBindings(data);
  const attachedMechanicsModuleIds = mechanicsModuleBindings
    .map(getMechanicsModuleId)
    .filter(Boolean);

  function writeMechanicsModuleBindings(nextMechanicsBindings) {
    updateDataField("engine_module_bindings", [
      ...getNonMechanicsModuleBindings(data),
      ...nextMechanicsBindings,
    ]);
  }

  function attachMechanicsModule(moduleCreation) {
    if (!moduleCreation?.id) return;

    writeMechanicsModuleBindings([
      ...mechanicsModuleBindings,
      buildMechanicsModuleBinding(moduleCreation, {
        defaultInheritanceMode,
        defaultMechanicsScopeMode,
      }),
    ]);
  }

  function removeMechanicsModuleBinding(moduleCreationId) {
    writeMechanicsModuleBindings(
      mechanicsModuleBindings.filter(
        (binding) => getMechanicsModuleId(binding) !== moduleCreationId
      )
    );
  }

  function patchMechanicsModuleBinding(moduleCreationId, patch) {
    writeMechanicsModuleBindings(
      mechanicsModuleBindings.map((binding) =>
        getMechanicsModuleId(binding) === moduleCreationId
          ? {
              ...binding,
              ...patch,
            }
          : binding
      )
    );
  }

  return (
    <div>
      {showSectionTitle ? (
        <SectionTitle
          title="Runtime Mechanics Modules"
          body={[
            "Attach reusable Mechanics Module assets to this runtime source.",
            "Status/footer blocks use precedence; meters, flags, counters, and stages roll up by scope.",
          ].join(" ")}
        />
      ) : null}

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
              <Link2 size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                Mechanics Modules
              </p>
              <h3 className="mt-2 font-display text-3xl">
                Attached Runtime Mechanics
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-dim)]">
                Attach Mechanics Module assets to {ownerLabel}. Choose whether
                mechanics values are scoped to this asset or written as
                story-room/root mechanics.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-[var(--gold-ornament)]">
            <Activity size={18} />
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <button
              type="button"
              onClick={() => setMechanicsPickerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
            >
              <Plus size={14} />
              Attach Mechanics Module
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--ink-dim)]">
            <p>
              Scope behavior:{" "}
              <span className="text-[var(--ink)]">
                BINDING_OWNER writes to this asset’s own mechanics scope.
                STORY_ROOM writes root room mechanics.
              </span>
            </p>
            <p>
              Footer/status behavior:{" "}
              <span className="text-[var(--ink)]">
                only one footer/status block wins by precedence.
              </span>
            </p>
            <p>
              Tracker behavior:{" "}
              <span className="text-[var(--ink)]">
                scoped meters/flags/counters/stages can coexist.
              </span>
            </p>
          </div>

          {mechanicsModuleBindings.length ? (
            <div className="grid gap-3">
              {mechanicsModuleBindings.map((binding) => {
                const moduleCreationId = getMechanicsModuleId(binding);
                const scopeMode = normalizeScopeMode(
                  binding.mechanicsScopeMode,
                  defaultMechanicsScopeMode
                );

                return (
                  <div
                    key={moduleCreationId || binding.moduleInstanceTitle}
                    className="rounded-xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                          Mechanics Module
                        </p>

                        <h4 className="mt-1 text-lg text-[var(--ink)]">
                          {binding.moduleInstanceTitle ||
                            "Untitled Mechanics Module"}
                        </h4>

                        <p className="mt-1 break-all text-xs text-[var(--ink-dim)]">
                          {moduleCreationId}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeMechanicsModuleBinding(moduleCreationId)
                        }
                        className="rounded-xl border border-white/10 p-2 text-[var(--status-danger)] transition hover:border-[var(--status-danger)]/40"
                        title="Remove mechanics module"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
                        <input
                          type="checkbox"
                          checked={binding.enabled !== false}
                          onChange={(event) =>
                            patchMechanicsModuleBinding(moduleCreationId, {
                              enabled: Boolean(event.target.checked),
                            })
                          }
                          className="h-4 w-4 accent-[var(--gold-ornament)]"
                        />
                        <span>Enabled</span>
                      </label>

                      <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                        <span>Priority</span>
                        <input
                          type="number"
                          value={
                            Number.isFinite(Number(binding.priority))
                              ? Number(binding.priority)
                              : 65
                          }
                          onChange={(event) =>
                            patchMechanicsModuleBinding(moduleCreationId, {
                              priority: Number.isFinite(
                                Number(event.target.value)
                              )
                                ? Number(event.target.value)
                                : 65,
                            })
                          }
                          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                        />
                      </label>

                      <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                        <span>Inheritance Mode</span>
                        <select
                          value={binding.inheritanceMode || defaultInheritanceMode}
                          onChange={(event) =>
                            patchMechanicsModuleBinding(moduleCreationId, {
                              inheritanceMode: event.target.value,
                            })
                          }
                          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                        >
                          <option value="LOCAL_ONLY">Local only</option>
                          <option value="INHERITABLE">Inheritable</option>
                          <option value="OVERRIDE">Override</option>
                        </select>
                      </label>

                      <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                        <span>Mechanics Scope</span>
                        <select
                          value={scopeMode}
                          onChange={(event) =>
                            patchMechanicsModuleBinding(moduleCreationId, {
                              mechanicsScopeMode: event.target.value,
                            })
                          }
                          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                        >
                          <option value="BINDING_OWNER">
                            BINDING_OWNER — scoped to this asset
                          </option>
                          <option value="STORY_ROOM">
                            STORY_ROOM — root room mechanics
                          </option>
                        </select>
                      </label>
                    </div>

                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--ink-dim)]">
                      <p>
                        Module ID:{" "}
                        <span className="text-[var(--ink)]">
                          {binding.moduleId || TRACKERS_MODULE_ID}
                        </span>
                      </p>
                      <p>
                        Role:{" "}
                        <span className="text-[var(--ink)]">
                          {binding.role || MECHANICS_MODULE_ROLE}
                        </span>
                      </p>
                      <p>
                        Trigger:{" "}
                        <span className="text-[var(--ink)]">
                          {binding.operationTriggers?.chatTurnDefault ||
                            "get_tracker_context"}
                        </span>
                      </p>
                      <p>
                        Scope:{" "}
                        <span className="text-[var(--ink)]">
                          {scopeMode}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
              No Mechanics Modules attached yet.
            </div>
          )}
        </div>
      </div>

      {mechanicsPickerOpen ? (
        <MechanicsModulePickerModal
          excludedModuleIds={attachedMechanicsModuleIds}
          onClose={() => setMechanicsPickerOpen(false)}
          onSelected={attachMechanicsModule}
        />
      ) : null}
    </div>
  );
}