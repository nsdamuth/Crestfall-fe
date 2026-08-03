"use client";

import { useState } from "react";

import ActorMechanicsProfileEditorView from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view";
import {
  actorMechanicsProfileBeyondScaleFixture,
  actorMechanicsProfileDisabledFixture,
  actorMechanicsProfileEmptyFixture,
  actorMechanicsProfileFullPcFixture,
  actorMechanicsProfileStattedNpcFixture,
  actorMechanicsProfileValidationFixture,
} from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor/ActorMechanicsProfileEditor.fixtures";

const PREVIEW_STATES = {
  empty: { label: "Empty", props: actorMechanicsProfileEmptyFixture },
  fullPc: { label: "Full PC", props: actorMechanicsProfileFullPcFixture },
  stattedNpc: {
    label: "Statted NPC",
    props: actorMechanicsProfileStattedNpcFixture,
  },
  beyondScale: {
    label: "Beyond Scale",
    props: actorMechanicsProfileBeyondScaleFixture,
  },
  validation: {
    label: "Validation",
    props: actorMechanicsProfileValidationFixture,
  },
  disabled: {
    label: "Disabled",
    props: actorMechanicsProfileDisabledFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    statePolicy: { ...fixture.statePolicy },
    presetOptions: fixture.presetOptions.map((preset) => ({
      ...preset,
      capabilityPolicy: { ...preset.capabilityPolicy },
      bindings: preset.bindings.map((binding) => ({ ...binding })),
    })),
    bindings: fixture.bindings.map((binding) => ({
      ...binding,
      issues: binding.issues.map((issue) => ({ ...issue })),
      references: binding.references.map((reference) => ({
        ...reference,
        issues: reference.issues.map((issue) => ({ ...issue })),
      })),
    })),
    enabledDomains: [...fixture.enabledDomains],
    globalIssues: fixture.globalIssues.map((issue) => ({ ...issue })),
  };
}

function domainOption(props, domain) {
  return (
    props.domainOptions.find((option) => option.value === domain) || {
      value: domain,
      label: domain,
      description: "Actor-scoped mechanics domain.",
    }
  );
}

function refreshMetrics(props, bindings) {
  return {
    ...props,
    bindings: bindings.map((binding, order) => ({
      ...binding,
      order,
      hasStatsPoolsProfileReference:
        binding.domain === "STATS" &&
        binding.references.some(
          (reference) => reference.referenceType === "CREATION"
        ),
    })),
    bindingCount: bindings.length,
    enabledBindingCount: bindings.filter((binding) => binding.enabled).length,
    referenceCount: bindings.reduce(
      (total, binding) => total + binding.references.length,
      0
    ),
    enabledDomains: [
      ...new Set(
        bindings.filter((binding) => binding.enabled).map((binding) => binding.domain)
      ),
    ],
  };
}

function nextBindingId(bindings, domain) {
  const base = String(domain || "stats").toLowerCase();
  const ids = new Set(bindings.map((binding) => binding.id));
  if (!ids.has(base)) return base;

  let index = 2;
  let candidate = `${base}.${index}`;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${base}.${index}`;
  }
  return candidate;
}

function createPreviewBinding(props, definition, order) {
  const option = domainOption(props, definition.domain);

  return {
    id: nextBindingId(props.bindings, definition.domain),
    domain: definition.domain,
    domainLabel: option.label,
    domainDescription: option.description,
    title: option.label,
    enabled: definition.enabled !== false,
    required: definition.required === true,
    stateIsolation: "OWNER_SCOPED",
    activationMode: "ON_DEMAND",
    activationDomainsInput: definition.domain,
    notes: "",
    order,
    expanded: order === 0,
    definitionReferenceMode:
      definition.domain === "STATS" ? "STATS_POOLS_PROFILE" : "GENERIC",
    hasStatsPoolsProfileReference: false,
    references: [],
    issues: [],
  };
}

export default function ActorMechanicsProfileEditorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("empty");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(actorMechanicsProfileEmptyFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No actor, creation, or runtime system is connected."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];
    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateBindings(updater, action) {
    setPreviewProps((current) =>
      refreshMetrics(current, updater(current.bindings))
    );
    setLastAction(action);
  }

  function applyPreset() {
    setPreviewProps((current) => {
      const preset = current.presetOptions.find(
        (option) => option.presetId === current.pendingPresetId
      );
      if (!preset) return current;

      const base = {
        ...current,
        presetId: preset.presetId,
        title: preset.title,
        titleCharacterCount: preset.title.length,
        summary: preset.summary,
        summaryCharacterCount: preset.summary.length,
        ownerType: current.ownerLocked ? current.ownerType : preset.ownerType,
        capabilityMode: preset.capabilityPolicy.mode,
        opposedResolutionPolicy:
          preset.capabilityPolicy.opposedResolutionPolicy,
        workingModeProfile: preset.capabilityPolicy.workingModeProfile,
        workingModeProfileCharacterCount:
          preset.capabilityPolicy.workingModeProfile.length,
        capabilityNotes: preset.capabilityPolicy.notes,
        capabilityNotesCharacterCount: preset.capabilityPolicy.notes.length,
        globalIssues: [],
        errorCount: 0,
        warningCount: 0,
      };
      const bindings = preset.bindings.map((definition, order) =>
        createPreviewBinding({ ...base, bindings: [] }, definition, order)
      );
      return refreshMetrics(base, bindings);
    });
    setLastAction(
      "Applied the selected preset locally. No definitions or actor state were created."
    );
  }

  function updateBinding(bindingId, field, value) {
    updateBindings(
      (bindings) =>
        bindings.map((binding) => {
          if (binding.id !== bindingId) return binding;

          if (field === "id") {
            return { ...binding, id: String(value || "").toLowerCase() };
          }

          if (field === "domain") {
            const option = domainOption(previewProps, value);
            return {
              ...binding,
              domain: value,
              domainLabel: option.label,
              domainDescription: option.description,
              definitionReferenceMode:
                value === "STATS" ? "STATS_POOLS_PROFILE" : "GENERIC",
              hasStatsPoolsProfileReference:
                value === "STATS" &&
                binding.references.some(
                  (reference) => reference.referenceType === "CREATION"
                ),
            };
          }

          return { ...binding, [field]: value };
        }),
      `Updated ${field} for ${bindingId} locally.`
    );
  }

  function addBinding() {
    setPreviewProps((current) => {
      const unused = current.domainOptions.find(
        (option) =>
          !current.bindings.some((binding) => binding.domain === option.value)
      );
      const option = unused || current.domainOptions[0];
      const binding = createPreviewBinding(
        current,
        { domain: option.value, enabled: true, required: false },
        current.bindings.length
      );
      return refreshMetrics(current, [...current.bindings, binding]);
    });
    setLastAction("Added a local domain-binding fixture.");
  }

  function removeBinding(bindingId) {
    updateBindings(
      (bindings) => bindings.filter((binding) => binding.id !== bindingId),
      `Removed ${bindingId} locally.`
    );
  }

  function moveBinding(bindingId, direction) {
    updateBindings(
      (bindings) => {
        const index = bindings.findIndex((binding) => binding.id === bindingId);
        const target = direction === "UP" ? index - 1 : index + 1;
        if (index < 0 || target < 0 || target >= bindings.length) return bindings;

        const next = [...bindings];
        const [binding] = next.splice(index, 1);
        next.splice(target, 0, binding);
        return next;
      },
      `Moved ${bindingId} ${direction.toLowerCase()} locally.`
    );
  }

  function toggleBinding(bindingId) {
    updateBindings(
      (bindings) =>
        bindings.map((binding) =>
          binding.id === bindingId
            ? { ...binding, expanded: !binding.expanded }
            : binding
        ),
      `Toggled ${bindingId} locally.`
    );
  }

  function addReference(bindingId) {
    updateBindings(
      (bindings) =>
        bindings.map((binding) =>
          binding.id === bindingId
            ? {
                ...binding,
                references: [
                  ...binding.references,
                  {
                    index: binding.references.length,
                    referenceType: "CREATION",
                    sourceId: "",
                    version: "",
                    title: "",
                    issues: [],
                  },
                ],
              }
            : binding
        ),
      `Added a reference to ${bindingId} locally.`
    );
  }

  function removeReference(bindingId, referenceIndex) {
    updateBindings(
      (bindings) =>
        bindings.map((binding) =>
          binding.id === bindingId
            ? {
                ...binding,
                references: binding.references
                  .filter((reference) => reference.index !== referenceIndex)
                  .map((reference, index) => ({ ...reference, index })),
              }
            : binding
        ),
      `Removed reference ${referenceIndex + 1} from ${bindingId} locally.`
    );
  }

  function updateReference(bindingId, referenceIndex, field, value) {
    updateBindings(
      (bindings) =>
        bindings.map((binding) =>
          binding.id === bindingId
            ? {
                ...binding,
                references: binding.references.map((reference) =>
                  reference.index === referenceIndex
                    ? { ...reference, [field]: value }
                    : reference
                ),
              }
            : binding
        ),
      `Updated ${field} for a ${bindingId} reference locally.`
    );
  }

  const interactiveProps = {
    ...previewProps,
    onSetEnabled: (enabled) => {
      setPreviewProps((current) => ({ ...current, enabled }));
      setLastAction(`${enabled ? "Enabled" : "Disabled"} the fixture locally.`);
    },
    onUpdateIdentity: (field, value) => {
      setPreviewProps((current) => ({
        ...current,
        [field]: value,
        [`${field}CharacterCount`]: String(value || "").length,
      }));
      setLastAction(`Updated ${field} locally.`);
    },
    onSelectPreset: (presetId) => {
      setPreviewProps((current) => ({ ...current, pendingPresetId: presetId }));
      setLastAction(`Selected the ${presetId} preset locally.`);
    },
    onApplyPreset: applyPreset,
    onUpdateOwner: (field, value) => {
      setPreviewProps((current) => ({ ...current, [field === "bindingMode" ? "ownerBindingMode" : field === "ownerType" ? "ownerType" : field === "ownerId" ? "ownerId" : "ownerTitle"]: value }));
      setLastAction(`Updated owner ${field} locally.`);
    },
    onUpdateCapabilityPolicy: (field, value) => {
      setPreviewProps((current) => {
        const next = {
          ...current,
          [field === "mode"
            ? "capabilityMode"
            : field === "opposedResolutionPolicy"
              ? "opposedResolutionPolicy"
              : field === "workingModeProfile"
                ? "workingModeProfile"
                : "capabilityNotes"]: value,
        };
        if (field === "workingModeProfile") {
          next.workingModeProfileCharacterCount = String(value || "").length;
        }
        if (field === "notes") {
          next.capabilityNotesCharacterCount = String(value || "").length;
        }
        return next;
      });
      setLastAction(`Updated capability ${field} locally.`);
    },
    onAddBinding: addBinding,
    onRemoveBinding: removeBinding,
    onMoveBinding: moveBinding,
    onToggleBinding: toggleBinding,
    onUpdateBinding: updateBinding,
    onAddReference: addReference,
    onRemoveReference: removeReference,
    onUpdateReference: updateReference,
    onOpenStatsPoolsProfilePicker: (bindingId) => {
      updateBindings(
        (bindings) =>
          bindings.map((binding) =>
            binding.id === bindingId
              ? {
                  ...binding,
                  references: [
                    {
                      index: 0,
                      referenceType: "CREATION",
                      sourceId: "22222222-2222-4222-8222-222222222222",
                      version: "stats_pools_profile_contract_v0",
                      title: "Preview Stats & Pools Profile",
                      issues: [],
                    },
                  ],
                }
              : binding
          ),
        `Selected a preview Stats & Pools Profile for ${bindingId}.`
      );
    },
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                Development Preview
              </p>
              <h1 className="mt-2 font-display text-2xl sm:text-3xl">
                Actor Mechanics Profile Editor
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Direct portable-View fixtures. No persistence, actor resolution,
                Advanced Mechanics operation, or provider context is connected.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
                <button
                  key={stateKey}
                  type="button"
                  onClick={() => openState(stateKey)}
                  className={`rounded-lg border px-3 py-2 text-xs transition ${
                    activeStateKey === stateKey
                      ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                      : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/25"
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
            {lastAction}
          </div>
        </div>

        <ActorMechanicsProfileEditorView {...interactiveProps} />
      </div>
    </main>
  );
}
