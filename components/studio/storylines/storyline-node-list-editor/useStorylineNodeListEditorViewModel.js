"use client";

import { useMemo, useState } from "react";

import {
  createStorylineNode,
  createStorylineTrigger,
  normalizeStorylineData,
  STORYLINE_NON_TERMINAL_TRANSITION_POLICIES,
  STORYLINE_TRIGGER_MODES,
  STORYLINE_TRIGGER_TYPES,
  validateStorylineData,
} from "@/lib/shared/storylines/storylineAuthoring.mjs";

const EDITOR_MODES = new Set(["full", "sequence", "transitions"]);

const COPY = Object.freeze({
  addReferenceLabel: "Add Story or Scenario",
  errorsTitle: "Storyline authoring errors",
  warningsTitle: "Draft readiness notes",
  emptyStructure:
    "Add a Story or Scenario to establish the first Storyline node.",
  emptyTransitions:
    "Add Storyline nodes in Narrative Sequence before configuring transitions.",
  sequenceEyebrow: "Narrative Sequence",
  sequenceDescription:
    "The first node loads when the Storyline starts. Later nodes follow the authored order shown here.",
  transitionsEyebrow: "Node Transitions",
  transitionsDescription:
    "Define how each node completes and how the following node becomes eligible.",
});

function replaceAt(items, index, nextItem) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? nextItem : item
  );
}

function move(items, from, to) {
  if (to < 0 || to >= items.length || from === to) return items;

  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function formatOptionLabel(value) {
  return String(value || "").replaceAll("_", " ");
}

function getTransitionDescription(policy, isLast) {
  if (isLast || policy === "COMPLETE_STORYLINE") {
    return "The final node completes the Storyline. The same chat remains available for open-world play.";
  }

  if (policy === "IMMEDIATE") {
    return "The next node may begin as soon as this node completes.";
  }

  if (policy === "MANUAL") {
    return "An authorized user starts the next node.";
  }

  if (policy === "OPTIONAL") {
    return "The next node becomes available but is not forced.";
  }

  return "The chat returns to open-world play until a trigger is validated.";
}

function createNodeViewModel(node, nodeIndex, nodeCount) {
  const isLast = nodeIndex === nodeCount - 1;
  const needsTriggers =
    !isLast &&
    ["OPEN_WORLD_UNTIL_TRIGGER", "OPTIONAL"].includes(node.transitionPolicy);
  const transitionPolicies = isLast
    ? ["COMPLETE_STORYLINE"]
    : STORYLINE_NON_TERMINAL_TRANSITION_POLICIES;

  return {
    id: node.id,
    index: nodeIndex,
    positionLabel: String(nodeIndex + 1),
    referenceTypeLabel:
      node.referenceType === "STORY" ? "Story" : "Scenario",
    finalNodeLabel: isLast ? " · Final Node" : "",
    title: node.reference.title,
    subtitle: node.reference.subtitle || "No description provided.",
    isFirst: nodeIndex === 0,
    isLast,
    completionGuidance: node.completionGuidance,
    transitionPolicy: node.transitionPolicy,
    transitionOptions: transitionPolicies.map((policy) => ({
      value: policy,
      label: formatOptionLabel(policy),
    })),
    transitionDescription: getTransitionDescription(
      node.transitionPolicy,
      isLast
    ),
    needsTriggers,
    triggerMode: node.triggerMode,
    triggerModeOptions: STORYLINE_TRIGGER_MODES.map((triggerMode) => ({
      value: triggerMode,
      label: `${triggerMode} TRIGGER`,
    })),
    triggerTypeOptions: STORYLINE_TRIGGER_TYPES.map((type) => ({
      value: type,
      label: formatOptionLabel(type),
    })),
    triggers: node.triggers.map((trigger, triggerIndex) => ({
      id: trigger.id,
      index: triggerIndex,
      type: trigger.type,
      label: trigger.label,
      description: trigger.description,
    })),
    showOpenWorldGuidance:
      node.transitionPolicy === "OPEN_WORLD_UNTIL_TRIGGER" && !isLast,
    openWorldGuidance: node.openWorldGuidance,
    pressureGuidance: node.pressureGuidance,
  };
}

export function useStorylineNodeListEditorViewModel({
  data = {},
  onChange = null,
  stories = [],
  scenarios = [],
  loadError = "",
  mode = "full",
} = {}) {
  const [isReferencePickerOpen, setReferencePickerOpen] = useState(false);
  const normalized = useMemo(() => normalizeStorylineData(data), [data]);
  const validation = useMemo(
    () => validateStorylineData(normalized),
    [normalized]
  );

  const editorMode = EDITOR_MODES.has(mode) ? mode : "full";
  const showStructureControls = editorMode !== "transitions";
  const showTransitionControls = editorMode !== "sequence";
  const visibleWarnings =
    editorMode === "sequence"
      ? validation.warnings.filter((warning) =>
          /add at least one story or scenario node/i.test(warning)
        )
      : validation.warnings;

  function commitNodes(nodes) {
    onChange?.(
      normalizeStorylineData({
        ...normalized,
        nodes,
      })
    );
  }

  function updateNode(index, patch) {
    commitNodes(
      replaceAt(normalized.nodes, index, {
        ...normalized.nodes[index],
        ...patch,
      })
    );
  }

  function selectReference(reference) {
    const nextNode = createStorylineNode(reference, normalized.nodes.length);
    commitNodes([...normalized.nodes, nextNode]);
    setReferencePickerOpen(false);
  }

  function addTrigger(nodeIndex) {
    const node = normalized.nodes[nodeIndex];
    updateNode(nodeIndex, {
      triggers: [
        ...node.triggers,
        createStorylineTrigger({
          label: "New trigger",
          type: "AI_SEMANTIC_TRIGGER",
        }),
      ],
    });
  }

  function updateTrigger(nodeIndex, triggerIndex, patch) {
    const node = normalized.nodes[nodeIndex];
    updateNode(nodeIndex, {
      triggers: replaceAt(node.triggers, triggerIndex, {
        ...node.triggers[triggerIndex],
        ...patch,
      }),
    });
  }

  function removeTrigger(nodeIndex, triggerIndex) {
    const node = normalized.nodes[nodeIndex];
    updateNode(nodeIndex, {
      triggers: node.triggers.filter((_, index) => index !== triggerIndex),
    });
  }

  const nodes = normalized.nodes.map((node, nodeIndex) =>
    createNodeViewModel(node, nodeIndex, normalized.nodes.length)
  );
  const selectedReferenceIds = normalized.nodes.map(
    (node) => node.reference.id
  );
  const isTransitionsOnly = editorMode === "transitions";

  return {
    ...COPY,
    headerEyebrow: isTransitionsOnly
      ? COPY.transitionsEyebrow
      : COPY.sequenceEyebrow,
    headerDescription: isTransitionsOnly
      ? COPY.transitionsDescription
      : COPY.sequenceDescription,
    nodeCountLabel: `${normalized.nodes.length} Storyline Node${
      normalized.nodes.length === 1 ? "" : "s"
    }`,
    showStructureControls,
    showTransitionControls,
    loadError: String(loadError || ""),
    emptyStateMessage: showStructureControls
      ? COPY.emptyStructure
      : COPY.emptyTransitions,
    nodes,
    validationErrors: validation.errors,
    visibleWarnings,
    stories: Array.isArray(stories) ? stories : [],
    scenarios: Array.isArray(scenarios) ? scenarios : [],
    selectedReferenceIds,
    isReferencePickerOpen: showStructureControls && isReferencePickerOpen,
    onOpenReferencePicker: () => setReferencePickerOpen(true),
    onCloseReferencePicker: () => setReferencePickerOpen(false),
    onSelectReference: selectReference,
    onMoveNodeUp: (nodeIndex) =>
      commitNodes(move(normalized.nodes, nodeIndex, nodeIndex - 1)),
    onMoveNodeDown: (nodeIndex) =>
      commitNodes(move(normalized.nodes, nodeIndex, nodeIndex + 1)),
    onRemoveNode: (nodeIndex) =>
      commitNodes(
        normalized.nodes.filter((_, index) => index !== nodeIndex)
      ),
    onChangeCompletionGuidance: (nodeIndex, value) =>
      updateNode(nodeIndex, { completionGuidance: value }),
    onChangeTransitionPolicy: (nodeIndex, value) =>
      updateNode(nodeIndex, { transitionPolicy: value }),
    onChangeTriggerMode: (nodeIndex, value) =>
      updateNode(nodeIndex, { triggerMode: value }),
    onAddTrigger: addTrigger,
    onChangeTriggerType: (nodeIndex, triggerIndex, value) =>
      updateTrigger(nodeIndex, triggerIndex, { type: value }),
    onChangeTriggerLabel: (nodeIndex, triggerIndex, value) =>
      updateTrigger(nodeIndex, triggerIndex, { label: value }),
    onChangeTriggerDescription: (nodeIndex, triggerIndex, value) =>
      updateTrigger(nodeIndex, triggerIndex, { description: value }),
    onRemoveTrigger: removeTrigger,
    onChangeOpenWorldGuidance: (nodeIndex, value) =>
      updateNode(nodeIndex, { openWorldGuidance: value }),
    onChangePressureGuidance: (nodeIndex, value) =>
      updateNode(nodeIndex, { pressureGuidance: value }),
  };
}
