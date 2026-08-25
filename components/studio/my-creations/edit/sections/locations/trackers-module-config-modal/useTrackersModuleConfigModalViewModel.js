"use client";

// CLEANUP (ED1G SW6): the former 1908-line TrackersModuleConfigModal.jsx
// monolith split into the view/viewmodel/contract/fixtures package
// pattern every sibling in this directory already follows (see
// weather-module-config-modal/). This file owns every piece of state,
// normalization, and mutation logic; the View
// (TrackersModuleConfigModal.view.jsx) is presentation-only.

import { useMemo, useState } from "react";

const TRACKERS_MODULE_ID = "core.trackers.v1";
const TRACKERS_INSTANCE_DATA_VERSION = "trackers_instance_data.v0_1";

export const trackerKindOptions = [
  "TRUST",
  "AFFECTION",
  "SUSPICION",
  "FEAR",
  "REPUTATION",
  "PROGRESS",
  "RESOURCE",
  "GENERIC",
];

export const scopeOptions = ["ROOM", "CHARACTER", "LOCATION", "SCENARIO", "NARRATOR"];

export const composerVisibilityOptions = [
  { value: "HIDDEN", label: "Hidden" },
  { value: "SUMMARY_ONLY", label: "Summary only" },
  { value: "VALUE", label: "Value" },
  { value: "VALUE_AND_SUMMARY", label: "Value + summary" },
];

export const publicVisibilityOptions = [
  { value: "HIDDEN", label: "Hidden" },
  { value: "LABEL_ONLY", label: "Label only" },
  { value: "PHASE_ONLY", label: "Phase only" },
  { value: "VALUE", label: "Value" },
  { value: "VALUE_AND_PHASE", label: "Value + phase" },
  { value: "VALUE_AND_SUMMARY", label: "Value + summary" },
  { value: "VALUE_PHASE_AND_SUMMARY", label: "Value + phase + summary" },
];

export const effectTypeOptions = [
  { value: "METER_DELTA", label: "Meter delta" },
  { value: "COUNTER_INCREMENT", label: "Counter increment" },
  { value: "COUNTER_SET", label: "Counter set" },
  { value: "FLAG_SET", label: "Flag set" },
  { value: "FLAG_CLEAR", label: "Flag clear" },
  { value: "STAGE_SET", label: "Stage set" },
];

export const guardSourceOptions = [
  { value: "meter", label: "Meter" },
  { value: "tracker", label: "Tracker" },
  { value: "counter", label: "Counter" },
  { value: "flag", label: "Flag" },
  { value: "stage", label: "Stage" },
];

export const operatorOptions = [
  { value: "gte", label: "≥" },
  { value: "gt", label: ">" },
  { value: "lte", label: "≤" },
  { value: "lt", label: "<" },
  { value: "eq", label: "=" },
  { value: "neq", label: "≠" },
  { value: "exists", label: "exists" },
  { value: "missing", label: "missing" },
  { value: "truthy", label: "truthy" },
  { value: "falsy", label: "falsy" },
];

export const enforcementOptions = [
  { value: "HARD_LOCK", label: "Hard lock" },
  { value: "SOFT_LOCK", label: "Soft lock" },
  { value: "WARNING", label: "Warning" },
  { value: "UNLOCK_HINT", label: "Unlock hint" },
  { value: "NARRATOR_GUIDANCE", label: "Narrator guidance" },
  { value: "STATUS_ONLY", label: "Status only" },
];

const DEFAULT_TRACKERS_DATA = {
  contractVersion: TRACKERS_INSTANCE_DATA_VERSION,
  trackers: [],
  guards: [],
};

const starterMeterField = {
  id: "meter_1",
  label: "New Meter",
  kind: "GENERIC",
  scope: "ROOM",
  value: 0,
  min: 0,
  max: 100,
  summary: "A creator-defined meter that can change when events happen.",
  visibility: "PRIVATE_TO_MIDDLEWARE",
  composerVisibility: "SUMMARY_ONLY",
  publicVisibility: "HIDDEN",
  phases: [
    {
      id: "low",
      label: "Low",
      min: 0,
      max: 33,
      publicLabel: "Low",
      composerGuidance: "This meter is currently low.",
    },
    {
      id: "medium",
      label: "Medium",
      min: 34,
      max: 66,
      publicLabel: "Medium",
      composerGuidance: "This meter is currently in a middle range.",
    },
    {
      id: "high",
      label: "High",
      min: 67,
      max: 100,
      publicLabel: "High",
      composerGuidance: "This meter is currently high.",
    },
  ],
  mutationHints: [],
};

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value, fallback = "item") {
  const slug = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return slug || fallback;
}

function toNumber(value, fallback = 0) {
  if (value === "" || value === null || value === undefined) return fallback;

  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function getBindingData(binding = {}) {
  return normalizeObject(binding?.data || binding?.instanceData);
}

function getUniqueId(baseId, items = []) {
  const normalizedBase = slugify(baseId);
  const existingIds = new Set(
    normalizeArray(items)
      .map((item) => normalizeString(item?.id))
      .filter(Boolean)
  );

  if (!existingIds.has(normalizedBase)) return normalizedBase;

  let index = 2;
  let nextId = `${normalizedBase}_${index}`;

  while (existingIds.has(nextId)) {
    index += 1;
    nextId = `${normalizedBase}_${index}`;
  }

  return nextId;
}

function normalizePhase(phase = {}, index = 0) {
  const source = normalizeObject(phase);
  const label = normalizeString(source.label || source.name || source.id) || `Phase ${index + 1}`;

  return {
    id: slugify(source.id || source.key || label, `phase_${index + 1}`),
    label,
    min: toNumber(source.min ?? source.minimum, 0),
    max: toNumber(source.max ?? source.maximum, 100),
    publicLabel: normalizeString(source.publicLabel || source.public_label) || label,
    composerGuidance: normalizeString(source.composerGuidance || source.composer_guidance),
  };
}

function normalizeEffect(effect = {}, index = 0, trackerId = "") {
  const source = normalizeObject(effect);
  const type = normalizeString(source.type || source.effectType || "METER_DELTA").toUpperCase();

  return {
    id: slugify(source.id || source.key || `effect_${index + 1}`, `effect_${index + 1}`),
    type,
    targetId: slugify(
      source.targetId ||
        source.target_id ||
        source.trackerId ||
        source.tracker_id ||
        trackerId ||
        "target",
      "target"
    ),
    delta: source.delta ?? source.amount ?? source.change ?? "",
    amount: source.amount ?? source.delta ?? source.change ?? "",
    value: source.value ?? source.stage ?? source.stageId ?? source.stage_id ?? "",
    reason: normalizeString(source.reason || source.summary || source.description),
  };
}

function normalizeMutationHint(hint = {}, index = 0, trackerId = "") {
  const source = normalizeObject(hint);
  const label = source.id || source.label || `hint_${index + 1}`;
  const constraints = normalizeObject(source.constraints);

  return {
    id: slugify(source.id || source.key || label, `hint_${index + 1}`),
    eventTypes: normalizeArray(
      source.eventTypes ||
        source.event_types ||
        source.events ||
        source.eventType ||
        source.event_type
    )
      .flat()
      .map((item) => normalizeString(item).toUpperCase())
      .filter(Boolean),
    reason: normalizeString(source.reason || source.summary || source.description),
    effects: normalizeArray(source.effects).map((effect, effectIndex) =>
      normalizeEffect(effect, effectIndex, trackerId)
    ),
    constraints: {
      minConfidence: constraints.minConfidence ?? constraints.min_confidence ?? "",
      maxApplicationsPerTurn:
        constraints.maxApplicationsPerTurn ?? constraints.max_applications_per_turn ?? 1,
      maxApplicationsPerRoom:
        constraints.maxApplicationsPerRoom ?? constraints.max_applications_per_room ?? "",
      allowRepeat: constraints.allowRepeat !== false && constraints.allow_repeat !== false,
    },
  };
}

function normalizeTracker(tracker = {}, index = 0) {
  const source = normalizeObject(tracker);
  const label = normalizeString(source.label || source.title || source.name) || `Tracker ${index + 1}`;
  const id = slugify(source.id || source.trackerId || source.tracker_id || source.key || label, `tracker_${index + 1}`);

  return {
    id,
    label,
    kind: normalizeString(source.kind || source.type || "GENERIC").toUpperCase(),
    scope: normalizeString(source.scope || "ROOM").toUpperCase(),
    value: source.value ?? source.currentValue ?? source.defaultValue ?? 0,
    min: source.min ?? source.minimum ?? 0,
    max: source.max ?? source.maximum ?? 100,
    summary: normalizeString(source.summary || source.description || source.notes),
    visibility: normalizeString(source.visibility || "PRIVATE_TO_MIDDLEWARE"),
    composerVisibility: normalizeString(source.composerVisibility || source.composer_visibility || "SUMMARY_ONLY"),
    publicVisibility: normalizeString(
      source.publicVisibility || source.public_visibility || source.statusVisibility || "PHASE_ONLY"
    ),
    phases: normalizeArray(
      source.phases ||
        source.phaseDefinitions ||
        source.phase_definitions ||
        source.thresholds
    ).map(normalizePhase),
    mutationHints: normalizeArray(
      source.mutationHints ||
        source.mutation_hints ||
        source.deltaRules ||
        source.delta_rules ||
        source.updateRules ||
        source.update_rules
    ).map((hint, hintIndex) => normalizeMutationHint(hint, hintIndex, id)),
  };
}

function normalizeCondition(condition = {}, index = 0) {
  const source = normalizeObject(condition);
  const sourceType = normalizeString(
    source.source ||
      source.conditionSource ||
      source.condition_source ||
      source.conditionType ||
      source.condition_type ||
      source.type ||
      "meter"
  ).toLowerCase();

  return {
    id: slugify(
      source.id ||
        source.key ||
        source.trackerId ||
        source.tracker_id ||
        source.meterId ||
        source.meter_id ||
        source.flagId ||
        source.flag_id ||
        source.counterId ||
        source.counter_id ||
        source.stageId ||
        source.stage_id ||
        `condition_${index + 1}`,
      `condition_${index + 1}`
    ),
    source: sourceType,
    field: normalizeString(source.field || source.property || "value"),
    operator: normalizeString(source.operator || source.op || "gte").toLowerCase(),
    value: source.value ?? source.targetValue ?? source.threshold ?? "",
    summary: normalizeString(source.summary || source.description),
  };
}

function normalizeGuard(guard = {}, index = 0) {
  const source = normalizeObject(guard);
  const label = normalizeString(source.label || source.title || source.name) || `Guard ${index + 1}`;

  return {
    id: slugify(source.id || source.guardId || source.guard_id || source.key || label, `guard_${index + 1}`),
    label,
    mode: normalizeString(source.mode || source.logic || "ALL").toUpperCase() === "ANY" ? "ANY" : "ALL",
    enforcement: normalizeString(source.enforcement || source.lockType || "NARRATOR_GUIDANCE").toUpperCase(),
    summary: normalizeString(source.summary || source.description || source.notes),
    conditions: normalizeArray(source.conditions).map(normalizeCondition),
    onPass: {
      summary: normalizeString(source.onPass?.summary || source.on_pass?.summary || source.onPass?.message),
    },
    onFail: {
      summary: normalizeString(source.onFail?.summary || source.on_fail?.summary || source.onFail?.message),
    },
    composerVisibility: normalizeString(source.composerVisibility || source.composer_visibility || "SUMMARY_ONLY"),
    publicVisibility: normalizeString(source.publicVisibility || source.public_visibility || "HIDDEN"),
  };
}

function buildInitialForm(trackersBinding = null) {
  const bindingData = {
    ...DEFAULT_TRACKERS_DATA,
    ...getBindingData(trackersBinding),
  };

  return {
    enabled: trackersBinding?.enabled !== false,
    priority:
      trackersBinding?.priority !== null && trackersBinding?.priority !== undefined
        ? String(trackersBinding.priority)
        : "65",
    inheritanceMode: trackersBinding?.inheritanceMode || "INHERITABLE",
    trackers: normalizeArray(bindingData.trackers).map(normalizeTracker),
    guards: normalizeArray(bindingData.guards).map(normalizeGuard),
  };
}

function serializeEffect(effect = {}) {
  const type = normalizeString(effect.type).toUpperCase();

  const base = {
    type,
    targetId: slugify(effect.targetId, "target"),
  };

  if (type === "METER_DELTA") {
    return {
      ...base,
      delta: toNumber(effect.delta, 0),
    };
  }

  if (type === "COUNTER_INCREMENT") {
    return {
      ...base,
      amount: toNumber(effect.amount, 1),
    };
  }

  if (type === "COUNTER_SET") {
    return {
      ...base,
      value: toNumber(effect.value, 0),
    };
  }

  if (type === "FLAG_SET") {
    return {
      ...base,
      value: effect.value === true || effect.value === "true",
    };
  }

  if (type === "FLAG_CLEAR") {
    return base;
  }

  if (type === "STAGE_SET") {
    return {
      ...base,
      value: normalizeString(effect.value),
    };
  }

  return base;
}

function serializeTracker(tracker = {}) {
  return {
    id: slugify(tracker.id, "tracker"),
    label: normalizeString(tracker.label) || "Tracker",
    kind: normalizeString(tracker.kind || "GENERIC").toUpperCase(),
    scope: normalizeString(tracker.scope || "ROOM").toUpperCase(),
    value: toNumber(tracker.value, 0),
    min: toNumber(tracker.min, 0),
    max: toNumber(tracker.max, 100),
    summary: normalizeString(tracker.summary),
    visibility: normalizeString(tracker.visibility || "PRIVATE_TO_MIDDLEWARE"),
    composerVisibility: normalizeString(tracker.composerVisibility || "SUMMARY_ONLY"),
    publicVisibility: normalizeString(tracker.publicVisibility || "PHASE_ONLY"),
    phases: normalizeArray(tracker.phases).map((phase) => ({
      id: slugify(phase.id, "phase"),
      label: normalizeString(phase.label) || "Phase",
      min: toNumber(phase.min, 0),
      max: toNumber(phase.max, 100),
      publicLabel: normalizeString(phase.publicLabel || phase.label),
      composerGuidance: normalizeString(phase.composerGuidance),
    })),
    mutationHints: normalizeArray(tracker.mutationHints).map((hint) => ({
      id: slugify(hint.id, "hint"),
      eventTypes: normalizeArray(hint.eventTypes)
        .map((item) => normalizeString(item).toUpperCase())
        .filter(Boolean),
      reason: normalizeString(hint.reason),
      effects: normalizeArray(hint.effects).map(serializeEffect),
      constraints: {
        minConfidence: toNullableNumber(hint.constraints?.minConfidence),
        maxApplicationsPerTurn: toNullableNumber(
          hint.constraints?.maxApplicationsPerTurn
        ),
        maxApplicationsPerRoom: toNullableNumber(
          hint.constraints?.maxApplicationsPerRoom
        ),
        allowRepeat: hint.constraints?.allowRepeat !== false,
      },
    })),
  };
}

function parseConditionValue(condition = {}) {
  if (["exists", "missing", "truthy", "falsy"].includes(condition.operator)) {
    return null;
  }

  if (condition.source === "flag") {
    return condition.value === true || condition.value === "true";
  }

  const numeric = Number(condition.value);

  if (Number.isFinite(numeric) && condition.source !== "stage") {
    return numeric;
  }

  return condition.value;
}

function serializeGuard(guard = {}) {
  return {
    id: slugify(guard.id, "guard"),
    label: normalizeString(guard.label) || "Guard",
    mode: guard.mode === "ANY" ? "ANY" : "ALL",
    enforcement: normalizeString(guard.enforcement || "NARRATOR_GUIDANCE").toUpperCase(),
    summary: normalizeString(guard.summary),
    conditions: normalizeArray(guard.conditions).map((condition) => ({
      source: normalizeString(condition.source || "meter").toLowerCase(),
      id: slugify(condition.id, "condition_target"),
      field: normalizeString(condition.field || "value"),
      operator: normalizeString(condition.operator || "gte").toLowerCase(),
      value: parseConditionValue(condition),
      summary: normalizeString(condition.summary),
    })),
    onPass: {
      summary: normalizeString(guard.onPass?.summary),
    },
    onFail: {
      summary: normalizeString(guard.onFail?.summary),
    },
    composerVisibility: normalizeString(guard.composerVisibility || "SUMMARY_ONLY"),
    publicVisibility: normalizeString(guard.publicVisibility || "HIDDEN"),
  };
}

function buildStarterTracker(existingTrackers = []) {
  const trackerId = getUniqueId("meter_1", existingTrackers);

  return normalizeTracker({
    ...starterMeterField,
    id: trackerId,
    label: "New Meter",
  });
}

function buildStarterGuard({ trackers = [], guards = [] }) {
  const tracker = normalizeArray(trackers)[0] || starterMeterField;
  const trackerId = tracker.id || "meter_1";

  return normalizeGuard({
    id: getUniqueId("gate_1", guards),
    label: "New Guard / Gate",
    mode: "ALL",
    enforcement: "HARD_LOCK",
    composerVisibility: "SUMMARY_ONLY",
    publicVisibility: "HIDDEN",
    summary: "Blocks or guides a guarded outcome until mechanics conditions are met.",
    conditions: [
      {
        source: "meter",
        id: trackerId,
        field: "value",
        operator: "gte",
        value: 50,
      },
    ],
    onPass: {
      summary: "The guarded outcome is available.",
    },
    onFail: {
      summary: "The guarded outcome is not available yet.",
    },
  });
}

export function useTrackersModuleConfigModalViewModel({
  locationTitle = "",
  trackersBinding = null,
  onClose,
  onSaved,
} = {}) {
  const [form, setForm] = useState(() => buildInitialForm(trackersBinding));
  const [initialFormSnapshot] = useState(() => JSON.stringify(buildInitialForm(trackersBinding)));
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("success");

  const trackerOptions = useMemo(
    () =>
      normalizeArray(form.trackers).map((tracker) => ({
        value: tracker.id,
        label: tracker.label || tracker.id,
      })),
    [form.trackers]
  );

  const targetOptions = useMemo(() => {
    const trackerTargets = normalizeArray(form.trackers).map((tracker) => ({
      value: tracker.id,
      label: `${tracker.label || tracker.id} · meter`,
    }));

    const effectTargets = normalizeArray(form.trackers)
      .flatMap((tracker) => normalizeArray(tracker.mutationHints))
      .flatMap((hint) => normalizeArray(hint.effects))
      .map((effect) => ({
        value: effect.targetId,
        label: `${effect.targetId} · ${effect.type}`,
      }))
      .filter((option) => option.value);

    const seen = new Set();

    return [...trackerTargets, ...effectTargets].filter((option) => {
      if (seen.has(option.value)) return false;
      seen.add(option.value);
      return true;
    });
  }, [form.trackers]);

  function updateForm(patch) {
    setForm((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateTracker(index, patch) {
    updateForm({
      trackers: form.trackers.map((tracker, trackerIndex) =>
        trackerIndex === index
          ? {
              ...tracker,
              ...patch,
            }
          : tracker
      ),
    });
  }

  function removeTracker(index) {
    updateForm({
      trackers: form.trackers.filter((_, trackerIndex) => trackerIndex !== index),
    });
  }

  function addTracker() {
    updateForm({
      trackers: [...form.trackers, buildStarterTracker(form.trackers)],
    });
    setMessage("Meter field added.");
    setMessageTone("success");
  }

  function addPhase(trackerIndex) {
    const tracker = form.trackers[trackerIndex];
    const nextPhase = normalizePhase(
      {
        id: getUniqueId("new_phase", tracker.phases),
        label: "New Phase",
        min: tracker.min || 0,
        max: tracker.max || 100,
      },
      tracker.phases.length
    );

    updateTracker(trackerIndex, {
      phases: [...tracker.phases, nextPhase],
    });
  }

  function updatePhase(trackerIndex, phaseIndex, patch) {
    const tracker = form.trackers[trackerIndex];

    updateTracker(trackerIndex, {
      phases: tracker.phases.map((phase, index) =>
        index === phaseIndex
          ? {
              ...phase,
              ...patch,
            }
          : phase
      ),
    });
  }

  function removePhase(trackerIndex, phaseIndex) {
    const tracker = form.trackers[trackerIndex];

    updateTracker(trackerIndex, {
      phases: tracker.phases.filter((_, index) => index !== phaseIndex),
    });
  }

  function addHint(trackerIndex) {
    const tracker = form.trackers[trackerIndex];

    const nextHint = normalizeMutationHint(
      {
        id: getUniqueId("event_rule", tracker.mutationHints),
        eventTypes: ["CUSTOM_EVENT"],
        reason: "Describe what happened and why it changes mechanics state.",
        effects: [
          {
            type: "METER_DELTA",
            targetId: tracker.id,
            delta: 1,
          },
        ],
        constraints: {
          minConfidence: 0.6,
          maxApplicationsPerTurn: 1,
          maxApplicationsPerRoom: null,
          allowRepeat: true,
        },
      },
      tracker.mutationHints.length,
      tracker.id
    );

    updateTracker(trackerIndex, {
      mutationHints: [...tracker.mutationHints, nextHint],
    });
  }

  function updateHint(trackerIndex, hintIndex, patch) {
    const tracker = form.trackers[trackerIndex];

    updateTracker(trackerIndex, {
      mutationHints: tracker.mutationHints.map((hint, index) =>
        index === hintIndex
          ? {
              ...hint,
              ...patch,
              constraints: {
                ...hint.constraints,
                ...normalizeObject(patch.constraints),
              },
            }
          : hint
      ),
    });
  }

  function removeHint(trackerIndex, hintIndex) {
    const tracker = form.trackers[trackerIndex];

    updateTracker(trackerIndex, {
      mutationHints: tracker.mutationHints.filter((_, index) => index !== hintIndex),
    });
  }

  function addEffect(trackerIndex, hintIndex) {
    const tracker = form.trackers[trackerIndex];
    const hint = tracker.mutationHints[hintIndex];

    updateHint(trackerIndex, hintIndex, {
      effects: [
        ...hint.effects,
        normalizeEffect(
          {
            id: getUniqueId("effect_1", hint.effects),
            type: "METER_DELTA",
            targetId: tracker.id,
            delta: 1,
          },
          hint.effects.length,
          tracker.id
        ),
      ],
    });
  }

  function updateEffect(trackerIndex, hintIndex, effectIndex, patch) {
    const tracker = form.trackers[trackerIndex];
    const hint = tracker.mutationHints[hintIndex];

    updateHint(trackerIndex, hintIndex, {
      effects: hint.effects.map((effect, index) =>
        index === effectIndex
          ? {
              ...effect,
              ...patch,
            }
          : effect
      ),
    });
  }

  function removeEffect(trackerIndex, hintIndex, effectIndex) {
    const tracker = form.trackers[trackerIndex];
    const hint = tracker.mutationHints[hintIndex];

    updateHint(trackerIndex, hintIndex, {
      effects: hint.effects.filter((_, index) => index !== effectIndex),
    });
  }

  function addGuard() {
    updateForm({
      guards: [
        ...form.guards,
        buildStarterGuard({
          trackers: form.trackers,
          guards: form.guards,
        }),
      ],
    });
    setMessage("Guard / gate added.");
    setMessageTone("success");
  }

  function updateGuard(index, patch) {
    updateForm({
      guards: form.guards.map((guard, guardIndex) =>
        guardIndex === index
          ? {
              ...guard,
              ...patch,
              onPass: {
                ...guard.onPass,
                ...normalizeObject(patch.onPass),
              },
              onFail: {
                ...guard.onFail,
                ...normalizeObject(patch.onFail),
              },
            }
          : guard
      ),
    });
  }

  function removeGuard(index) {
    updateForm({
      guards: form.guards.filter((_, guardIndex) => guardIndex !== index),
    });
  }

  function addCondition(guardIndex) {
    const guard = form.guards[guardIndex];
    const firstTrackerId = form.trackers[0]?.id || "meter_1";

    updateGuard(guardIndex, {
      conditions: [
        ...guard.conditions,
        normalizeCondition(
          {
            source: "meter",
            id: firstTrackerId,
            field: "value",
            operator: "gte",
            value: 50,
          },
          guard.conditions.length
        ),
      ],
    });
  }

  function updateCondition(guardIndex, conditionIndex, patch) {
    const guard = form.guards[guardIndex];

    updateGuard(guardIndex, {
      conditions: guard.conditions.map((condition, index) =>
        index === conditionIndex
          ? {
              ...condition,
              ...patch,
            }
          : condition
      ),
    });
  }

  function removeCondition(guardIndex, conditionIndex) {
    const guard = form.guards[guardIndex];

    updateGuard(guardIndex, {
      conditions: guard.conditions.filter((_, index) => index !== conditionIndex),
    });
  }

  function clearAll() {
    updateForm({
      trackers: [],
      guards: [],
    });
    setMessage("Mechanics cleared.");
    setMessageTone("success");
  }

  function buildBindingPatch() {
    return {
      moduleId: TRACKERS_MODULE_ID,
      enabled: Boolean(form.enabled),
      inheritanceMode: normalizeString(form.inheritanceMode).toUpperCase() || "INHERITABLE",
      priority: form.priority === "" ? 65 : Number(form.priority),
      operationTriggers: {
        chatTurnDefault: "get_tracker_context",
      },
      data: {
        contractVersion: TRACKERS_INSTANCE_DATA_VERSION,
        trackers: form.trackers.map(serializeTracker),
        guards: form.guards.map(serializeGuard),
      },
    };
  }

  function handleSave() {
    try {
      onSaved?.({
        bindingPatch: buildBindingPatch(),
      });
      setMessage("Mechanics module configured. Save the Location to persist the binding.");
      setMessageTone("success");
    } catch (error) {
      setMessage(error.message || "Mechanics module could not be saved.");
      setMessageTone("error");
    }
  }

  const percentByTrackerId = normalizeArray(form.trackers).reduce((acc, tracker) => {
    const percent = Math.min(
      100,
      Math.max(
        0,
        ((Number(tracker.value) - Number(tracker.min)) /
          Math.max(1, Number(tracker.max) - Number(tracker.min))) *
          100
      )
    );
    return { ...acc, [tracker.id]: percent };
  }, {});

  return {
    locationTitle,
    eyebrow: "Location Runtime Module",
    title: "Configure Mechanics Fields, Effects & Guards",
    description: `Create abstract mechanics fields, event-driven effects, and guard rules for ${
      locationTitle || "this location"
    }.`,
    message,
    messageTone,
    hasUnsavedChanges: JSON.stringify(form) !== initialFormSnapshot,
    moduleId: TRACKERS_MODULE_ID,
    form,
    trackerOptions,
    targetOptions,
    percentByTrackerId,
    onClose,
    onSave: handleSave,
    onToggleEnabled: (value) => updateForm({ enabled: value }),
    onInheritanceModeChange: (value) => updateForm({ inheritanceMode: value }),
    onPriorityChange: (value) => updateForm({ priority: value }),
    onAddTracker: addTracker,
    onAddGuard: addGuard,
    onClearAll: clearAll,
    onUpdateTracker: updateTracker,
    onRemoveTracker: removeTracker,
    onAddPhase: addPhase,
    onUpdatePhase: updatePhase,
    onRemovePhase: removePhase,
    onAddHint: addHint,
    onUpdateHint: updateHint,
    onRemoveHint: removeHint,
    onAddEffect: addEffect,
    onUpdateEffect: updateEffect,
    onRemoveEffect: removeEffect,
    onUpdateGuard: updateGuard,
    onRemoveGuard: removeGuard,
    onAddCondition: addCondition,
    onUpdateCondition: updateCondition,
    onRemoveCondition: removeCondition,
  };
}

export { slugify };
