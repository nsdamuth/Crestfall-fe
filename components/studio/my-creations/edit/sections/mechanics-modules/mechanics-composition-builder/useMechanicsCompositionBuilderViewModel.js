"use client";

import { useMemo, useState } from "react";

import {
  MECHANICS_COMMAND_COMPOSITION_CONDITION_BUCKETS,
  MECHANICS_COMMAND_COMPOSITION_CONDITION_MODES,
  MECHANICS_COMMAND_COMPOSITION_CONDITION_OPERATORS,
  MECHANICS_COMMAND_COMPOSITION_CONDITION_SCOPE_MODES,
  MECHANICS_COMMAND_COMPOSITION_DOMAIN_ACTION_TYPES,
  MECHANICS_COMMAND_COMPOSITION_EFFECT_TYPES,
  MECHANICS_COMMAND_COMPOSITION_FAILURE_POLICIES,
  MECHANICS_COMMAND_COMPOSITION_MAX_DOMAIN_STEPS,
  MECHANICS_COMMAND_COMPOSITION_MAX_MECHANICS_STEPS,
  MECHANICS_COMMAND_COMPOSITION_OUTCOMES,
  MECHANICS_COMMAND_COMPOSITION_PHASES,
  MECHANICS_COMMAND_COMPOSITION_TRAVEL_OPERATIONS,
  buildMechanicsCommandCompositionReference,
  createMechanicsCommandCompositionCondition,
  createMechanicsCommandCompositionDomainStep,
  createMechanicsCommandCompositionEffect,
  createMechanicsCommandCompositionStep,
  getMechanicsCommandCompositionDomainLane,
  listMechanicsCommandCompositionReferences,
  normalizeMechanicsCommandCompositionArgumentOptions,
  normalizeMechanicsCommandCompositionBuilder,
  normalizeMechanicsCommandCompositionCondition,
  normalizeMechanicsCommandCompositionDomainAction,
  normalizeMechanicsCommandCompositionDomainStep,
  normalizeMechanicsCommandCompositionEffect,
  normalizeMechanicsCommandCompositionStep,
  summarizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function moveItem(items, index, direction) {
  const nextIndex = direction === "UP" ? index - 1 : index + 1;

  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

function toggleValue(values, value, checked) {
  const current = Array.isArray(values) ? values : [];

  return checked
    ? [...new Set([...current, value])]
    : current.filter((entry) => entry !== value);
}

function groupArguments(argumentOptions) {
  return Object.fromEntries(
    [
      "SELF",
      "PLAYER_CHARACTER",
      "CHARACTER_PRESENT",
      "CHARACTER_KNOWN",
      "CHARACTER_BOUND",
      "ITEM_HELD",
      "ITEM_VISIBLE",
      "ITEM_KNOWN",
      "LOCATION_CURRENT",
      "LOCATION_KNOWN",
      "LOCATION_CONNECTED",
      "NUMBER",
      "ENUM",
      "TEXT",
    ].map((type) => [
      type,
      argumentOptions.filter((argument) => argument.type === type),
    ])
  );
}

function getRequiredArgumentTypes(actionType) {
  if (["ITEM_TAKE", "ITEM_DAMAGE", "ITEM_REPAIR"].includes(actionType)) {
    return ["ITEM_VISIBLE"];
  }

  if (actionType.startsWith("ITEM_")) {
    return ["ITEM_HELD"];
  }

  if (actionType === "LOCATION_TRANSITION") {
    return ["LOCATION_CONNECTED"];
  }

  if (
    [
      "PARTICIPANT_CONDITION_APPLY",
      "PARTICIPANT_CONDITION_REMOVE",
    ].includes(actionType)
  ) {
    return ["CHARACTER_PRESENT", "TEXT"];
  }

  return [];
}

function buildValidationMessages(composition, argumentGroups) {
  const messages = [];
  const allStepIds = [
    ...composition.mechanicsSteps.map((step) => step.id),
    ...composition.domainSteps.map((step) => step.id),
  ];

  composition.mechanicsSteps.forEach((step, index) => {
    const priorIds = new Set(
      composition.mechanicsSteps.slice(0, index).map((entry) => entry.id)
    );

    step.dependsOnStepIds.forEach((dependencyId) => {
      if (!priorIds.has(dependencyId)) {
        messages.push({
          level: "warning",
          path: `mechanicsSteps[${index}].dependsOnStepIds`,
          message: `Dependency ${dependencyId} must reference an earlier Mechanics step.`,
        });
      }
    });

    step.conditions.forEach((condition, conditionIndex) => {
      if (!condition.mechanicsId) {
        messages.push({
          level: "warning",
          path: `mechanicsSteps[${index}].conditions[${conditionIndex}].mechanicsId`,
          message: "Condition must name a Mechanics State ID.",
        });
      }

      if (
        condition.scopeMode === "TARGET_ARGUMENT" &&
        !argumentGroups.CHARACTER_PRESENT.concat(
          argumentGroups.CHARACTER_KNOWN,
          argumentGroups.CHARACTER_BOUND,
          argumentGroups.ITEM_HELD,
          argumentGroups.ITEM_VISIBLE,
          argumentGroups.ITEM_KNOWN,
          argumentGroups.LOCATION_CURRENT,
          argumentGroups.LOCATION_KNOWN,
          argumentGroups.LOCATION_CONNECTED,
          argumentGroups.SELF,
          argumentGroups.PLAYER_CHARACTER
        ).some((argument) => argument.id === condition.argumentName)
      ) {
        messages.push({
          level: "warning",
          path: `mechanicsSteps[${index}].conditions[${conditionIndex}].argumentName`,
          message: "Target-scoped condition must reference a target-capable command argument.",
        });
      }
    });

    step.effects.forEach((effect, effectIndex) => {
      if (!effect.targetId) {
        messages.push({
          level: "warning",
          path: `mechanicsSteps[${index}].effects[${effectIndex}].targetId`,
          message: "Effect must name a Mechanics State ID.",
        });
      }

      if (
        effect.targetBinding?.mode === "ARGUMENT" &&
        !effect.targetBinding.argumentName
      ) {
        messages.push({
          level: "warning",
          path: `mechanicsSteps[${index}].effects[${effectIndex}].targetBinding.argumentName`,
          message: "Argument-bound effect must select a target argument.",
        });
      }

      if (effect.valueBinding?.mode === "ARGUMENT") {
        const argument = argumentGroups.NUMBER.find(
          (entry) => entry.id === effect.valueBinding.argumentName
        );

        if (!effect.valueBinding.argumentName) {
          messages.push({
            level: "warning",
            path: `mechanicsSteps[${index}].effects[${effectIndex}].valueBinding.argumentName`,
            message: "Argument-bound numeric effect must select a NUMBER command argument.",
          });
        } else if (!argument) {
          messages.push({
            level: "error",
            path: `mechanicsSteps[${index}].effects[${effectIndex}].valueBinding.argumentName`,
            message: `Numeric value binding references missing or non-NUMBER argument ${effect.valueBinding.argumentName}.`,
          });
        }
      }
    });
  });

  const usedLanes = new Set();

  composition.domainSteps.forEach((step, index) => {
    const priorIds = new Set([
      ...composition.mechanicsSteps.map((entry) => entry.id),
      ...composition.domainSteps.slice(0, index).map((entry) => entry.id),
    ]);

    step.dependsOnStepIds.forEach((dependencyId) => {
      if (!priorIds.has(dependencyId)) {
        messages.push({
          level: "warning",
          path: `domainSteps[${index}].dependsOnStepIds`,
          message: `Dependency ${dependencyId} must reference an earlier composition step.`,
        });
      }
    });

    const actionType = step.action.type;
    const lane = getMechanicsCommandCompositionDomainLane(actionType);

    if (lane) {
      if (usedLanes.has(lane)) {
        messages.push({
          level: "error",
          path: `domainSteps[${index}].action.type`,
          message: `Only one ${lane} action may exist in a command composition.`,
        });
      }

      usedLanes.add(lane);
    }

    if (lane === "LOCATION_RUNTIME" && index !== composition.domainSteps.length - 1) {
      messages.push({
        level: "error",
        path: `domainSteps[${index}].action.type`,
        message: "Location action must be the final authored domain step.",
      });
    }

    for (const requiredType of getRequiredArgumentTypes(actionType)) {
      if (!argumentGroups[requiredType]?.length) {
        messages.push({
          level: "warning",
          path: `domainSteps[${index}].action`,
          message: `${actionType} requires a ${requiredType} command argument.`,
        });
      }
    }

    if (actionType === "ITEM_GIVE" && !argumentGroups.CHARACTER_PRESENT.length) {
      messages.push({
        level: "warning",
        path: `domainSteps[${index}].action.targetArgumentName`,
        message: "ITEM_GIVE requires a CHARACTER_PRESENT recipient argument.",
      });
    }

    if (["ITEM_STORE", "ITEM_PLACE"].includes(actionType) && !argumentGroups.TEXT.length) {
      messages.push({
        level: "warning",
        path: `domainSteps[${index}].action.placementArgumentName`,
        message: `${actionType} requires a TEXT placement argument.`,
      });
    }

    if (["ITEM_DAMAGE", "ITEM_REPAIR"].includes(actionType) && !argumentGroups.NUMBER.length) {
      messages.push({
        level: "warning",
        path: `domainSteps[${index}].action.amountArgumentName`,
        message: `${actionType} requires a NUMBER amount argument.`,
      });
    }
  });

  if (allStepIds.length !== new Set(allStepIds).size) {
    messages.push({
      level: "error",
      path: "composition",
      message: "Every Mechanics and domain step must have a unique ID.",
    });
  }

  return messages;
}

function buildDomainActionOptions({ composition, stepIndex }) {
  const usedLanes = new Set(
    composition.domainSteps
      .filter((_step, index) => index !== stepIndex)
      .map((step) =>
        getMechanicsCommandCompositionDomainLane(step.action.type)
      )
      .filter(Boolean)
  );
  const isFinalStep = stepIndex === composition.domainSteps.length - 1;

  return MECHANICS_COMMAND_COMPOSITION_DOMAIN_ACTION_TYPES.map((type) => {
    const lane = getMechanicsCommandCompositionDomainLane(type);
    const laneConflict = Boolean(lane && usedLanes.has(lane));
    const locationOrderConflict = lane === "LOCATION_RUNTIME" && !isFinalStep;

    return {
      id: type,
      label: type.replaceAll("_", " "),
      disabled: laneConflict || locationOrderConflict,
      reason: laneConflict
        ? `The ${lane} lane is already used by another domain step.`
        : locationOrderConflict
          ? "Location actions must be the final authored domain step."
          : "",
    };
  });
}

function applyDomainActionTypeDefaults(action, type, argumentGroups) {
  const next = normalizeMechanicsCommandCompositionDomainAction({
    ...action,
    enabled: type !== "NONE",
    type,
  });
  const heldItem = argumentGroups.ITEM_HELD[0]?.id || "item";
  const visibleItem = argumentGroups.ITEM_VISIBLE[0]?.id || "item";
  const character = argumentGroups.CHARACTER_PRESENT[0]?.id || "target";
  const text = argumentGroups.TEXT[0]?.id || "condition";
  const number = argumentGroups.NUMBER[0]?.id || "amount";
  const destination = argumentGroups.LOCATION_CONNECTED[0]?.id || "destination";

  return normalizeMechanicsCommandCompositionDomainAction({
    ...next,
    itemArgumentName:
      ["ITEM_TAKE", "ITEM_DAMAGE", "ITEM_REPAIR"].includes(type)
        ? visibleItem
        : type.startsWith("ITEM_")
          ? heldItem
          : "",
    targetArgumentName:
      type === "ITEM_GIVE" || type.startsWith("PARTICIPANT_CONDITION_")
        ? character
        : "",
    conditionArgumentName: type.startsWith("PARTICIPANT_CONDITION_")
      ? text
      : "",
    placementArgumentName: ["ITEM_STORE", "ITEM_PLACE"].includes(type)
      ? text
      : "",
    quantityArgumentName: type === "ITEM_CONSUME"
      ? argumentGroups.NUMBER[0]?.id || ""
      : "",
    amountArgumentName: ["ITEM_DAMAGE", "ITEM_REPAIR"].includes(type)
      ? number
      : "",
    destinationArgumentName: type === "LOCATION_TRANSITION"
      ? destination
      : "",
    travelOperation: type === "LOCATION_TRAVEL_OPERATION"
      ? next.travelOperation || "CONTINUE"
      : "",
    applyOnOutcomes:
      type === "NONE"
        ? []
        : next.applyOnOutcomes.length
          ? next.applyOnOutcomes
          : ["CRITICAL_SUCCESS", "SUCCESS"],
  });
}

export function useMechanicsCompositionBuilderViewModel({
  composition = {},
  invocationArguments = [],
  onChange = null,
} = {}) {
  const [referenceId, setReferenceId] = useState("");
  const normalizedComposition = useMemo(
    () => normalizeMechanicsCommandCompositionBuilder(composition),
    [composition]
  );
  const argumentOptions = useMemo(
    () => normalizeMechanicsCommandCompositionArgumentOptions(
      invocationArguments
    ),
    [invocationArguments]
  );
  const argumentGroups = useMemo(
    () => groupArguments(argumentOptions),
    [argumentOptions]
  );
  const referenceOptions = useMemo(
    () => listMechanicsCommandCompositionReferences(argumentOptions),
    [argumentOptions]
  );
  const summary = useMemo(
    () => summarizeMechanicsCommandCompositionBuilder(normalizedComposition),
    [normalizedComposition]
  );
  const validationMessages = useMemo(
    () => buildValidationMessages(normalizedComposition, argumentGroups),
    [normalizedComposition, argumentGroups]
  );

  function commit(nextComposition) {
    onChange?.(
      normalizeMechanicsCommandCompositionBuilder(nextComposition)
    );
  }

  function updateMechanicsSteps(nextSteps) {
    commit({
      ...normalizedComposition,
      mechanicsSteps: nextSteps,
    });
  }

  function updateDomainSteps(nextSteps) {
    commit({
      ...normalizedComposition,
      domainSteps: nextSteps,
    });
  }

  function applyReference() {
    const reference = buildMechanicsCommandCompositionReference(
      referenceId,
      argumentOptions
    );

    if (!reference) return;

    commit(reference);
    setReferenceId("");
  }

  function addMechanicsStep(phase) {
    if (
      normalizedComposition.mechanicsSteps.length >=
      MECHANICS_COMMAND_COMPOSITION_MAX_MECHANICS_STEPS
    ) {
      return;
    }

    updateMechanicsSteps([
      ...normalizedComposition.mechanicsSteps,
      createMechanicsCommandCompositionStep(
        phase,
        normalizedComposition.mechanicsSteps.length
      ),
    ]);
  }

  function patchMechanicsStep(stepId, patch) {
    const nextMechanicsSteps = normalizedComposition.mechanicsSteps.map(
      (step, index) =>
        step.id === stepId
          ? normalizeMechanicsCommandCompositionStep(
              { ...step, ...patch },
              index
            )
          : step
    );
    const patchedIndex = normalizedComposition.mechanicsSteps.findIndex(
      (step) => step.id === stepId
    );
    const resolvedNextId = patchedIndex >= 0
      ? nextMechanicsSteps[patchedIndex].id
      : stepId;
    const idChanged = resolvedNextId !== stepId;

    commit({
      ...normalizedComposition,
      mechanicsSteps: idChanged
        ? nextMechanicsSteps.map((step, index) =>
            index <= patchedIndex
              ? step
              : {
                  ...step,
                  dependsOnStepIds: step.dependsOnStepIds.map(
                    (dependencyId) =>
                      dependencyId === stepId
                        ? resolvedNextId
                        : dependencyId
                  ),
                }
          )
        : nextMechanicsSteps,
      domainSteps: idChanged
        ? normalizedComposition.domainSteps.map((step) => ({
            ...step,
            dependsOnStepIds: step.dependsOnStepIds.map(
              (dependencyId) =>
                dependencyId === stepId
                  ? resolvedNextId
                  : dependencyId
            ),
          }))
        : normalizedComposition.domainSteps,
    });
  }

  function removeMechanicsStep(stepId) {
    updateMechanicsSteps(
      normalizedComposition.mechanicsSteps
        .filter((step) => step.id !== stepId)
        .map((step) => ({
          ...step,
          dependsOnStepIds: step.dependsOnStepIds.filter(
            (dependencyId) => dependencyId !== stepId
          ),
        }))
    );
  }

  function moveMechanicsStep(stepId, direction) {
    const index = normalizedComposition.mechanicsSteps.findIndex(
      (step) => step.id === stepId
    );
    const moved = moveItem(
      normalizedComposition.mechanicsSteps,
      index,
      direction
    );
    const priorIds = new Set();

    updateMechanicsSteps(
      moved.map((step) => {
        const next = {
          ...step,
          dependsOnStepIds: step.dependsOnStepIds.filter(
            (dependencyId) => priorIds.has(dependencyId)
          ),
        };
        priorIds.add(step.id);
        return next;
      })
    );
  }

  function toggleMechanicsDependency(stepId, dependencyId, checked) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchMechanicsStep(stepId, {
      dependsOnStepIds: toggleValue(
        step.dependsOnStepIds,
        dependencyId,
        checked
      ),
    });
  }

  function toggleMechanicsOutcome(stepId, outcome, checked) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step || step.phase !== "OUTCOME") return;

    patchMechanicsStep(stepId, {
      applyOnOutcomes: toggleValue(
        step.applyOnOutcomes,
        outcome,
        checked
      ),
    });
  }

  function addCondition(stepId) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step || step.conditions.length >= 20) return;

    patchMechanicsStep(stepId, {
      conditions: [
        ...step.conditions,
        createMechanicsCommandCompositionCondition(
          step.conditions.length
        ),
      ],
    });
  }

  function patchCondition(stepId, conditionId, patch) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchMechanicsStep(stepId, {
      conditions: step.conditions.map((condition, index) =>
        condition.id === conditionId
          ? normalizeMechanicsCommandCompositionCondition(
              { ...condition, ...patch },
              index
            )
          : condition
      ),
    });
  }

  function removeCondition(stepId, conditionId) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchMechanicsStep(stepId, {
      conditions: step.conditions.filter(
        (condition) => condition.id !== conditionId
      ),
    });
  }

  function addEffect(stepId) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step || step.effects.length >= 40) return;

    patchMechanicsStep(stepId, {
      effects: [
        ...step.effects,
        createMechanicsCommandCompositionEffect(step.effects.length),
      ],
    });
  }

  function patchEffect(stepId, effectId, patch) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchMechanicsStep(stepId, {
      effects: step.effects.map((effect, index) =>
        effect.id === effectId
          ? normalizeMechanicsCommandCompositionEffect(
              { ...effect, ...patch },
              index
            )
          : effect
      ),
    });
  }

  function removeEffect(stepId, effectId) {
    const step = normalizedComposition.mechanicsSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchMechanicsStep(stepId, {
      effects: step.effects.filter((effect) => effect.id !== effectId),
    });
  }

  function addDomainStep() {
    if (
      normalizedComposition.domainSteps.length >=
      MECHANICS_COMMAND_COMPOSITION_MAX_DOMAIN_STEPS ||
      normalizedComposition.domainSteps.some(
        (step) =>
          getMechanicsCommandCompositionDomainLane(step.action.type) ===
          "LOCATION_RUNTIME"
      )
    ) {
      return;
    }

    updateDomainSteps([
      ...normalizedComposition.domainSteps,
      createMechanicsCommandCompositionDomainStep(
        normalizedComposition.domainSteps.length
      ),
    ]);
  }

  function patchDomainStep(stepId, patch) {
    const patchedIndex = normalizedComposition.domainSteps.findIndex(
      (step) => step.id === stepId
    );
    const nextDomainSteps = normalizedComposition.domainSteps.map(
      (step, index) => {
        if (step.id !== stepId) return step;

        const nextPatch = { ...patch };

        if (patch.actionType) {
          nextPatch.action = applyDomainActionTypeDefaults(
            step.action,
            patch.actionType,
            argumentGroups
          );
          delete nextPatch.actionType;
        } else if (patch.action) {
          nextPatch.action = normalizeMechanicsCommandCompositionDomainAction({
            ...step.action,
            ...patch.action,
          });
        }

        return normalizeMechanicsCommandCompositionDomainStep(
          { ...step, ...nextPatch },
          index
        );
      }
    );
    const resolvedNextId = patchedIndex >= 0
      ? nextDomainSteps[patchedIndex].id
      : stepId;
    const idChanged = resolvedNextId !== stepId;

    updateDomainSteps(
      idChanged
        ? nextDomainSteps.map((step, index) =>
            index <= patchedIndex
              ? step
              : {
                  ...step,
                  dependsOnStepIds: step.dependsOnStepIds.map(
                    (dependencyId) =>
                      dependencyId === stepId
                        ? resolvedNextId
                        : dependencyId
                  ),
                }
          )
        : nextDomainSteps
    );
  }

  function removeDomainStep(stepId) {
    updateDomainSteps(
      normalizedComposition.domainSteps
        .filter((step) => step.id !== stepId)
        .map((step) => ({
          ...step,
          dependsOnStepIds: step.dependsOnStepIds.filter(
            (dependencyId) => dependencyId !== stepId
          ),
        }))
    );
  }

  function moveDomainStep(stepId, direction) {
    const index = normalizedComposition.domainSteps.findIndex(
      (step) => step.id === stepId
    );
    const moved = moveItem(
      normalizedComposition.domainSteps,
      index,
      direction
    );
    const locationIndex = moved.findIndex(
      (step) =>
        getMechanicsCommandCompositionDomainLane(step.action.type) ===
        "LOCATION_RUNTIME"
    );

    if (locationIndex >= 0 && locationIndex !== moved.length - 1) {
      return;
    }

    const priorIds = new Set(
      normalizedComposition.mechanicsSteps.map((step) => step.id)
    );

    updateDomainSteps(
      moved.map((step) => {
        const next = {
          ...step,
          dependsOnStepIds: step.dependsOnStepIds.filter(
            (dependencyId) => priorIds.has(dependencyId)
          ),
        };
        priorIds.add(step.id);
        return next;
      })
    );
  }

  function toggleDomainDependency(stepId, dependencyId, checked) {
    const step = normalizedComposition.domainSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchDomainStep(stepId, {
      dependsOnStepIds: toggleValue(
        step.dependsOnStepIds,
        dependencyId,
        checked
      ),
    });
  }

  function toggleDomainOutcome(stepId, outcome, checked) {
    const step = normalizedComposition.domainSteps.find(
      (entry) => entry.id === stepId
    );
    if (!step) return;

    patchDomainStep(stepId, {
      action: {
        applyOnOutcomes: toggleValue(
          step.action.applyOnOutcomes,
          outcome,
          checked
        ),
      },
    });
  }

  const mechanicsSteps = normalizedComposition.mechanicsSteps.map(
    (step, index) => ({
      ...step,
      index,
      canMoveUp: index > 0,
      canMoveDown: index < normalizedComposition.mechanicsSteps.length - 1,
      dependencyOptions: normalizedComposition.mechanicsSteps
        .slice(0, index)
        .map((entry) => ({ id: entry.id, label: entry.label })),
      targetArgumentOptions: argumentOptions.filter(
        (argument) => argument.targetCapable
      ),
      numericArgumentOptions: argumentOptions.filter(
        (argument) => argument.type === "NUMBER"
      ),
    })
  );

  const domainSteps = normalizedComposition.domainSteps.map((step, index) => ({
    ...step,
    index,
    lane: getMechanicsCommandCompositionDomainLane(step.action.type),
    canMoveUp: index > 0,
    canMoveDown:
      index < normalizedComposition.domainSteps.length - 1 &&
      getMechanicsCommandCompositionDomainLane(step.action.type) !==
        "LOCATION_RUNTIME",
    dependencyOptions: [
      ...normalizedComposition.mechanicsSteps.map((entry) => ({
        id: entry.id,
        label: entry.label,
        group: "Mechanics",
      })),
      ...normalizedComposition.domainSteps.slice(0, index).map((entry) => ({
        id: entry.id,
        label: entry.label,
        group: "Domain",
      })),
    ],
    actionTypeOptions: buildDomainActionOptions({
      composition: normalizedComposition,
      stepIndex: index,
    }),
    argumentGroups,
  }));

  return {
    contractVersion: "1.0.0",
    title: "Advanced Composition",
    description:
      "Author ordered Mechanics steps and up to three isolated domain actions. Crestfall validates the complete composition before rolling.",
    summary,
    referenceId,
    referenceOptions,
    mechanicsSteps,
    domainSteps,
    phaseOptions: MECHANICS_COMMAND_COMPOSITION_PHASES,
    outcomeOptions: MECHANICS_COMMAND_COMPOSITION_OUTCOMES,
    failurePolicyOptions:
      MECHANICS_COMMAND_COMPOSITION_FAILURE_POLICIES,
    conditionModeOptions:
      MECHANICS_COMMAND_COMPOSITION_CONDITION_MODES,
    conditionBucketOptions:
      MECHANICS_COMMAND_COMPOSITION_CONDITION_BUCKETS,
    conditionScopeOptions:
      MECHANICS_COMMAND_COMPOSITION_CONDITION_SCOPE_MODES,
    conditionOperatorOptions:
      MECHANICS_COMMAND_COMPOSITION_CONDITION_OPERATORS,
    effectTypeOptions: MECHANICS_COMMAND_COMPOSITION_EFFECT_TYPES,
    travelOperationOptions:
      MECHANICS_COMMAND_COMPOSITION_TRAVEL_OPERATIONS,
    canAddMechanicsStep:
      normalizedComposition.mechanicsSteps.length <
      MECHANICS_COMMAND_COMPOSITION_MAX_MECHANICS_STEPS,
    canAddDomainStep:
      normalizedComposition.domainSteps.length <
        MECHANICS_COMMAND_COMPOSITION_MAX_DOMAIN_STEPS &&
      !normalizedComposition.domainSteps.some(
        (step) =>
          getMechanicsCommandCompositionDomainLane(step.action.type) ===
          "LOCATION_RUNTIME"
      ),
    validationMessages,
    onChooseReference: (value) => setReferenceId(normalizeString(value)),
    onApplyReference: applyReference,
    onAddMechanicsStep: addMechanicsStep,
    onPatchMechanicsStep: patchMechanicsStep,
    onRemoveMechanicsStep: removeMechanicsStep,
    onMoveMechanicsStep: moveMechanicsStep,
    onToggleMechanicsDependency: toggleMechanicsDependency,
    onToggleMechanicsOutcome: toggleMechanicsOutcome,
    onAddCondition: addCondition,
    onPatchCondition: patchCondition,
    onRemoveCondition: removeCondition,
    onAddEffect: addEffect,
    onPatchEffect: patchEffect,
    onRemoveEffect: removeEffect,
    onAddDomainStep: addDomainStep,
    onPatchDomainStep: patchDomainStep,
    onRemoveDomainStep: removeDomainStep,
    onMoveDomainStep: moveDomainStep,
    onToggleDomainDependency: toggleDomainDependency,
    onToggleDomainOutcome: toggleDomainOutcome,
  };
}
