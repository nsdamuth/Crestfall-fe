"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Eye,
  EyeOff,
  Plus,
  Save,
  Shield,
  SlidersHorizontal,
  Trash2,
  X,
  Zap,
} from "lucide-react";

const TRACKERS_MODULE_ID = "core.trackers.v1";
const TRACKERS_INSTANCE_DATA_VERSION = "trackers_instance_data.v0_1";

const trackerKindOptions = [
  "TRUST",
  "AFFECTION",
  "SUSPICION",
  "FEAR",
  "REPUTATION",
  "PROGRESS",
  "RESOURCE",
  "GENERIC",
];

const scopeOptions = ["ROOM", "CHARACTER", "LOCATION", "SCENARIO", "NARRATOR"];

const composerVisibilityOptions = [
  { value: "HIDDEN", label: "Hidden" },
  { value: "SUMMARY_ONLY", label: "Summary only" },
  { value: "VALUE", label: "Value" },
  { value: "VALUE_AND_SUMMARY", label: "Value + summary" },
];

const publicVisibilityOptions = [
  { value: "HIDDEN", label: "Hidden" },
  { value: "LABEL_ONLY", label: "Label only" },
  { value: "PHASE_ONLY", label: "Phase only" },
  { value: "VALUE", label: "Value" },
  { value: "VALUE_AND_PHASE", label: "Value + phase" },
  { value: "VALUE_AND_SUMMARY", label: "Value + summary" },
  { value: "VALUE_PHASE_AND_SUMMARY", label: "Value + phase + summary" },
];

const effectTypeOptions = [
  { value: "METER_DELTA", label: "Meter delta" },
  { value: "COUNTER_INCREMENT", label: "Counter increment" },
  { value: "COUNTER_SET", label: "Counter set" },
  { value: "FLAG_SET", label: "Flag set" },
  { value: "FLAG_CLEAR", label: "Flag clear" },
  { value: "STAGE_SET", label: "Stage set" },
];

const guardSourceOptions = [
  { value: "meter", label: "Meter" },
  { value: "tracker", label: "Tracker" },
  { value: "counter", label: "Counter" },
  { value: "flag", label: "Flag" },
  { value: "stage", label: "Stage" },
];

const operatorOptions = [
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

const enforcementOptions = [
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

export default function TrackersModuleConfigModal({
  locationTitle = "",
  trackersBinding = null,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => buildInitialForm(trackersBinding));
  const [message, setMessage] = useState("");

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
    } catch (error) {
      setMessage(error.message || "Mechanics module could not be saved.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
              <Activity size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
                Location Runtime Module
              </p>
              <h2 className="mt-2 font-display text-4xl">
                Configure Mechanics Fields, Effects & Guards
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
                Create abstract mechanics fields, event-driven effects, and guard rules for {locationTitle || "this location"}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">
          {message ? (
            <p className="mb-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--ink-dim)]">
              {message}
            </p>
          ) : null}

          <div className="grid gap-5">
            <EditorPanel title="Module Settings">
              <div className="grid gap-4 md:grid-cols-3">
                <CheckboxField
                  label="Enable mechanics module"
                  checked={form.enabled}
                  onChange={(value) => updateForm({ enabled: value })}
                />

                <SelectField
                  label="Inheritance Mode"
                  value={form.inheritanceMode}
                  options={[
                    {
                      value: "INHERITABLE",
                      label: "Inheritable / available to child spaces",
                    },
                    {
                      value: "LOCAL_ONLY",
                      label: "Local only",
                    },
                    {
                      value: "OVERRIDE",
                      label: "Local override",
                    },
                  ]}
                  onChange={(value) => updateForm({ inheritanceMode: value })}
                />

                <TextField
                  label="Priority"
                  value={form.priority}
                  onChange={(value) => updateForm({ priority: value })}
                  placeholder="65"
                />
              </div>

              <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--ink-dim)] md:grid-cols-3">
                <RuntimeStat label="Module ID" value={TRACKERS_MODULE_ID} />
                <RuntimeStat label="Mechanics fields" value={form.trackers.length} />
                <RuntimeStat label="Guards" value={form.guards.length} />
              </div>
            </EditorPanel>

            <EditorPanel title="Quick Starters">
              <div className="flex flex-wrap gap-3">
                <ActionButton onClick={addTracker} icon={<Plus size={15} />}>
                  Add Meter Field
                </ActionButton>

                <ActionButton onClick={addGuard} icon={<Plus size={15} />}>
                  Add Guard / Gate
                </ActionButton>

                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] transition hover:text-[var(--status-danger)]"
                >
                  <Trash2 size={15} />
                  Clear
                </button>
              </div>
            </EditorPanel>

            <EditorPanel title="Mechanics Fields">
              <div className="grid gap-4">
                {form.trackers.length ? (
                  form.trackers.map((tracker, trackerIndex) => (
                    <TrackerCard
                      key={`${tracker.id}-${trackerIndex}`}
                      tracker={tracker}
                      trackerIndex={trackerIndex}
                      targetOptions={targetOptions}
                      onUpdate={(patch) => updateTracker(trackerIndex, patch)}
                      onRemove={() => removeTracker(trackerIndex)}
                      onAddPhase={() => addPhase(trackerIndex)}
                      onUpdatePhase={(phaseIndex, patch) =>
                        updatePhase(trackerIndex, phaseIndex, patch)
                      }
                      onRemovePhase={(phaseIndex) =>
                        removePhase(trackerIndex, phaseIndex)
                      }
                      onAddHint={() => addHint(trackerIndex)}
                      onUpdateHint={(hintIndex, patch) =>
                        updateHint(trackerIndex, hintIndex, patch)
                      }
                      onRemoveHint={(hintIndex) =>
                        removeHint(trackerIndex, hintIndex)
                      }
                      onAddEffect={(hintIndex) =>
                        addEffect(trackerIndex, hintIndex)
                      }
                      onUpdateEffect={(hintIndex, effectIndex, patch) =>
                        updateEffect(trackerIndex, hintIndex, effectIndex, patch)
                      }
                      onRemoveEffect={(hintIndex, effectIndex) =>
                        removeEffect(trackerIndex, hintIndex, effectIndex)
                      }
                    />
                  ))
                ) : (
                    <EmptyState
                    title="No mechanics fields yet"
                    body="Add a meter field to create the first mechanics field."
                    />
                )}
              </div>
            </EditorPanel>

            <EditorPanel title="Guards / Gates">
              <div className="grid gap-4">
                {form.guards.length ? (
                  form.guards.map((guard, guardIndex) => (
                    <GuardCard
                      key={`${guard.id}-${guardIndex}`}
                      guard={guard}
                      guardIndex={guardIndex}
                      targetOptions={targetOptions}
                      onUpdate={(patch) => updateGuard(guardIndex, patch)}
                      onRemove={() => removeGuard(guardIndex)}
                      onAddCondition={() => addCondition(guardIndex)}
                      onUpdateCondition={(conditionIndex, patch) =>
                        updateCondition(guardIndex, conditionIndex, patch)
                      }
                      onRemoveCondition={(conditionIndex) =>
                        removeCondition(guardIndex, conditionIndex)
                      }
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No guards yet"
                    body="Add an access guard to create a deterministic lock or guidance rule."
                  />
                )}
              </div>
            </EditorPanel>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[var(--ink-dim)]">
            Module changes update the Location form. Save the Location to persist the runtime binding.
          </p>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            >
              Close
            </button>

            <ActionButton onClick={handleSave} icon={<Save size={15} />}>
              Save Mechanics Module
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackerCard({
  tracker,
  trackerIndex,
  targetOptions,
  onUpdate,
  onRemove,
  onAddPhase,
  onUpdatePhase,
  onRemovePhase,
  onAddHint,
  onUpdateHint,
  onRemoveHint,
  onAddEffect,
  onUpdateEffect,
  onRemoveEffect,
}) {
  const percent = Math.min(
    100,
    Math.max(
      0,
      ((Number(tracker.value) - Number(tracker.min)) /
        Math.max(1, Number(tracker.max) - Number(tracker.min))) *
        100
    )
  );

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Field #{trackerIndex + 1}
          </p>
          <h3 className="mt-1 font-display text-3xl">{tracker.label || tracker.id}</h3>
          <p className="mt-1 text-xs text-[var(--ink-dim)]">
            Meter · {tracker.kind} · {tracker.scope} · {tracker.min}–{tracker.max}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)] transition hover:text-[var(--status-danger)]"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="grid gap-5 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Field Name"
            value={tracker.label}
            onChange={(value) =>
              onUpdate({
                label: value,
                id: tracker.id || slugify(value, "tracker"),
              })
            }
          />

          <TextField
            label="Internal ID"
            value={tracker.id}
            onChange={(value) => onUpdate({ id: slugify(value, tracker.id) })}
          />

          <SelectField
            label="Meter Kind"
            value={tracker.kind}
            options={trackerKindOptions.map((option) => ({
              value: option,
              label: option,
            }))}
            onChange={(value) => onUpdate({ kind: value })}
          />

          <SelectField
            label="Scope"
            value={tracker.scope}
            options={scopeOptions.map((option) => ({
              value: option,
              label: option,
            }))}
            onChange={(value) => onUpdate({ scope: value })}
          />

          <NumberField
            label="Min"
            value={tracker.min}
            onChange={(value) => onUpdate({ min: value })}
          />

          <NumberField
            label="Max"
            value={tracker.max}
            onChange={(value) => onUpdate({ max: value })}
          />

          <NumberField
            label="Starting Value"
            value={tracker.value}
            onChange={(value) => onUpdate({ value })}
          />

          <SelectField
            label="Composer Visibility"
            value={tracker.composerVisibility}
            options={composerVisibilityOptions}
            onChange={(value) => onUpdate({ composerVisibility: value })}
          />

          <SelectField
            label="Public Visibility"
            value={tracker.publicVisibility}
            options={publicVisibilityOptions}
            onChange={(value) => onUpdate({ publicVisibility: value })}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            <span>Starting Value Preview</span>
            <span>{tracker.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--gold-ornament)]/80"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <TextAreaField
          label="Field Summary / Composer Cue"
          value={tracker.summary}
          onChange={(value) => onUpdate({ summary: value })}
          rows={3}
        />

        <Subsection
          icon={<SlidersHorizontal size={16} />}
          title="Phases"
          actionLabel="Add Phase"
          onAction={onAddPhase}
        >
          <div className="grid gap-3">
            {tracker.phases.map((phase, phaseIndex) => (
              <div
                key={`${phase.id}-${phaseIndex}`}
                className="rounded-xl border border-white/10 bg-black/25 p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_0.5fr_0.5fr_auto] md:items-end">
                  <TextField
                    label="Label"
                    value={phase.label}
                    onChange={(value) =>
                      onUpdatePhase(phaseIndex, {
                        label: value,
                        id: phase.id || slugify(value, "phase"),
                        publicLabel: phase.publicLabel || value,
                      })
                    }
                  />

                  <TextField
                    label="ID"
                    value={phase.id}
                    onChange={(value) =>
                      onUpdatePhase(phaseIndex, { id: slugify(value, phase.id) })
                    }
                  />

                  <NumberField
                    label="Min"
                    value={phase.min}
                    onChange={(value) => onUpdatePhase(phaseIndex, { min: value })}
                  />

                  <NumberField
                    label="Max"
                    value={phase.max}
                    onChange={(value) => onUpdatePhase(phaseIndex, { max: value })}
                  />

                  <IconButton onClick={() => onRemovePhase(phaseIndex)}>
                    <Trash2 size={14} />
                  </IconButton>
                </div>

                <TextAreaField
                  label="Phase Composer Guidance"
                  value={phase.composerGuidance}
                  onChange={(value) =>
                    onUpdatePhase(phaseIndex, { composerGuidance: value })
                  }
                  rows={2}
                />
              </div>
            ))}
          </div>
        </Subsection>

        <Subsection
          icon={<Zap size={16} />}
          title="Mutation Hints / Triggers"
          actionLabel="Add Hint"
          onAction={onAddHint}
        >
          <div className="grid gap-4">
            {tracker.mutationHints.map((hint, hintIndex) => (
              <HintCard
                key={`${hint.id}-${hintIndex}`}
                hint={hint}
                hintIndex={hintIndex}
                targetOptions={targetOptions}
                onUpdate={(patch) => onUpdateHint(hintIndex, patch)}
                onRemove={() => onRemoveHint(hintIndex)}
                onAddEffect={() => onAddEffect(hintIndex)}
                onUpdateEffect={(effectIndex, patch) =>
                  onUpdateEffect(hintIndex, effectIndex, patch)
                }
                onRemoveEffect={(effectIndex) =>
                  onRemoveEffect(hintIndex, effectIndex)
                }
              />
            ))}
          </div>
        </Subsection>
      </div>
    </section>
  );
}

function HintCard({
  hint,
  hintIndex,
  targetOptions,
  onUpdate,
  onRemove,
  onAddEffect,
  onUpdateEffect,
  onRemoveEffect,
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2">
          <TextField
            label={`Hint #${hintIndex + 1}`}
            value={hint.id}
            onChange={(value) => onUpdate({ id: slugify(value, hint.id) })}
          />

          <TextField
            label="Event Types"
            value={hint.eventTypes.join(", ")}
            onChange={(value) =>
              onUpdate({
                eventTypes: value
                  .split(",")
                  .map((item) => item.trim().toUpperCase())
                  .filter(Boolean),
              })
            }
            placeholder="BOUNDARY_RESPECTED"
          />
        </div>

        <IconButton onClick={onRemove}>
          <Trash2 size={14} />
        </IconButton>
      </div>

      <TextAreaField
        label="Reason"
        value={hint.reason}
        onChange={(value) => onUpdate({ reason: value })}
        rows={2}
      />

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <TextField
          label="Min Confidence"
          value={hint.constraints.minConfidence}
          onChange={(value) =>
            onUpdate({
              constraints: {
                minConfidence: value,
              },
            })
          }
          placeholder="0.6"
        />

        <TextField
          label="Max / Turn"
          value={hint.constraints.maxApplicationsPerTurn}
          onChange={(value) =>
            onUpdate({
              constraints: {
                maxApplicationsPerTurn: value,
              },
            })
          }
          placeholder="1"
        />

        <TextField
          label="Max / Room"
          value={hint.constraints.maxApplicationsPerRoom}
          onChange={(value) =>
            onUpdate({
              constraints: {
                maxApplicationsPerRoom: value,
              },
            })
          }
          placeholder="optional"
        />

        <CheckboxField
          label="Allow repeat"
          checked={hint.constraints.allowRepeat}
          onChange={(value) =>
            onUpdate({
              constraints: {
                allowRepeat: value,
              },
            })
          }
        />
      </div>

      <Subsection
        icon={<Activity size={15} />}
        title="Effects"
        actionLabel="Add Effect"
        onAction={onAddEffect}
        compact
      >
        <div className="grid gap-3">
          {hint.effects.map((effect, effectIndex) => (
            <EffectRow
              key={`${effect.id}-${effectIndex}`}
              effect={effect}
              targetOptions={targetOptions}
              onUpdate={(patch) => onUpdateEffect(effectIndex, patch)}
              onRemove={() => onRemoveEffect(effectIndex)}
            />
          ))}
        </div>
      </Subsection>
    </section>
  );
}

function EffectRow({ effect, targetOptions, onUpdate, onRemove }) {
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-black/30 p-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
      <SelectField
        label="Effect"
        value={effect.type}
        options={effectTypeOptions}
        onChange={(value) => onUpdate({ type: value })}
      />

      <ComboTextField
        label="Target"
        value={effect.targetId}
        options={targetOptions}
        onChange={(value) => onUpdate({ targetId: slugify(value, value) })}
      />

      {effect.type === "METER_DELTA" ? (
        <NumberField
          label="Delta"
          value={effect.delta}
          onChange={(value) => onUpdate({ delta: value, amount: value })}
        />
      ) : null}

      {effect.type === "COUNTER_INCREMENT" ? (
        <NumberField
          label="Amount"
          value={effect.amount}
          onChange={(value) => onUpdate({ amount: value })}
        />
      ) : null}

      {effect.type === "COUNTER_SET" ? (
        <NumberField
          label="Value"
          value={effect.value}
          onChange={(value) => onUpdate({ value })}
        />
      ) : null}

      {effect.type === "FLAG_SET" ? (
        <SelectField
          label="Value"
          value={String(effect.value === true || effect.value === "true")}
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          onChange={(value) => onUpdate({ value: value === "true" })}
        />
      ) : null}

      {effect.type === "FLAG_CLEAR" ? (
        <ReadOnlyField label="Value" value="false" />
      ) : null}

      {effect.type === "STAGE_SET" ? (
        <TextField
          label="Stage"
          value={effect.value}
          onChange={(value) => onUpdate({ value: slugify(value, value) })}
          placeholder="boundary_respected"
        />
      ) : null}

      <IconButton onClick={onRemove}>
        <Trash2 size={14} />
      </IconButton>
    </div>
  );
}

function GuardCard({
  guard,
  guardIndex,
  targetOptions,
  onUpdate,
  onRemove,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Guard #{guardIndex + 1}
          </p>
          <h3 className="mt-1 font-display text-3xl">{guard.label || guard.id}</h3>
          <p className="mt-1 text-xs text-[var(--ink-dim)]">
            {guard.enforcement} · {guard.mode}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)] transition hover:text-[var(--status-danger)]"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="grid gap-5 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Label"
            value={guard.label}
            onChange={(value) =>
              onUpdate({
                label: value,
                id: guard.id || slugify(value, "guard"),
              })
            }
          />

          <TextField
            label="Internal ID"
            value={guard.id}
            onChange={(value) => onUpdate({ id: slugify(value, guard.id) })}
          />

          <SelectField
            label="Enforcement"
            value={guard.enforcement}
            options={enforcementOptions}
            onChange={(value) => onUpdate({ enforcement: value })}
          />

          <SelectField
            label="Mode"
            value={guard.mode}
            options={[
              { value: "ALL", label: "All conditions" },
              { value: "ANY", label: "Any condition" },
            ]}
            onChange={(value) => onUpdate({ mode: value })}
          />

          <SelectField
            label="Composer Visibility"
            value={guard.composerVisibility}
            options={composerVisibilityOptions}
            onChange={(value) => onUpdate({ composerVisibility: value })}
          />

          <SelectField
            label="Public Visibility"
            value={guard.publicVisibility}
            options={publicVisibilityOptions}
            onChange={(value) => onUpdate({ publicVisibility: value })}
          />
        </div>

        <TextAreaField
          label="Summary"
          value={guard.summary}
          onChange={(value) => onUpdate({ summary: value })}
          rows={2}
        />

        <Subsection
          icon={<Shield size={16} />}
          title="Conditions"
          actionLabel="Add Condition"
          onAction={onAddCondition}
        >
          <div className="grid gap-3">
            {guard.conditions.map((condition, conditionIndex) => (
              <ConditionRow
                key={`${condition.id}-${conditionIndex}`}
                condition={condition}
                targetOptions={targetOptions}
                onUpdate={(patch) => onUpdateCondition(conditionIndex, patch)}
                onRemove={() => onRemoveCondition(conditionIndex)}
              />
            ))}
          </div>
        </Subsection>

        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField
            label="On Pass Summary"
            value={guard.onPass?.summary || ""}
            onChange={(value) =>
              onUpdate({
                onPass: {
                  summary: value,
                },
              })
            }
            rows={3}
          />

          <TextAreaField
            label="On Fail Summary"
            value={guard.onFail?.summary || ""}
            onChange={(value) =>
              onUpdate({
                onFail: {
                  summary: value,
                },
              })
            }
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}

function ConditionRow({ condition, targetOptions, onUpdate, onRemove }) {
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-black/30 p-3 md:grid-cols-[0.8fr_1fr_0.8fr_0.8fr_auto] md:items-end">
      <SelectField
        label="Source"
        value={condition.source}
        options={guardSourceOptions}
        onChange={(value) => onUpdate({ source: value })}
      />

      <ComboTextField
        label="Target"
        value={condition.id}
        options={targetOptions}
        onChange={(value) => onUpdate({ id: slugify(value, value) })}
      />

      <SelectField
        label="Operator"
        value={condition.operator}
        options={operatorOptions}
        onChange={(value) => onUpdate({ operator: value })}
      />

      {condition.source === "flag" ? (
        <SelectField
          label="Value"
          value={String(condition.value === true || condition.value === "true")}
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          onChange={(value) => onUpdate({ value: value === "true" })}
        />
      ) : ["exists", "missing", "truthy", "falsy"].includes(condition.operator) ? (
        <ReadOnlyField label="Value" value="not required" />
      ) : (
        <TextField
          label="Value"
          value={condition.value}
          onChange={(value) => onUpdate({ value })}
        />
      )}

      <IconButton onClick={onRemove}>
        <Trash2 size={14} />
      </IconButton>
    </div>
  );
}

function EditorPanel({ title, children }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/35 p-5">
      <h3 className="font-display text-3xl">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Subsection({ icon, title, actionLabel, onAction, children, compact = false }) {
  return (
    <div className={compact ? "mt-4" : ""}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          {icon}
          <span>{title}</span>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20"
        >
          <Plus size={12} />
          {actionLabel}
        </button>
      </div>

      {children}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function NumberField({ label, value, onChange, placeholder }) {
  return (
    <TextField
      label={label}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

function TextAreaField({ label, value, onChange, rows = 5, helperText }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-[var(--ink-dim)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComboTextField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <input
        list={`${label.replace(/\s+/g, "-").toLowerCase()}-options`}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />

      <datalist id={`${label.replace(/\s+/g, "-").toLowerCase()}-options`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </label>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--gold-ornament)]"
      />
      <span>{label}</span>
    </label>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
        {value || "Not set"}
      </div>
    </div>
  );
}

function IconButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-3 text-[var(--ink-dim)] transition hover:text-[var(--status-danger)]"
    >
      {children}
    </button>
  );
}

function ActionButton({ onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/25 hover:text-[var(--ink)]"
    >
      {icon}
      {children}
    </button>
  );
}

function RuntimeStat({ label, value }) {
  return (
    <p>
      {label}: <span className="text-[var(--ink)]">{value}</span>
    </p>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--ink-dim)]">
      <p className="text-[var(--ink)]">{title}</p>
      <p className="mt-2 leading-6">{body}</p>
    </div>
  );
}