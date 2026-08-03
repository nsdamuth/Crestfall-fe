"use client";

import { useState } from "react";

import {
  ITEM_PLACEMENT_SPECIFICITY_OPTIONS,
  ITEM_PLACEMENT_STEP_KIND_OPTIONS,
  ITEM_STARTING_HOLDER_TYPE_OPTIONS,
  createEmptyItemPlacement,
  createEmptyItemPlacementStep,
  itemStartingHolderUsesCreation,
  normalizeItemPlacement,
  normalizeItemStartingAssignment,
} from "@/components/studio/registries/itemRegistryUtils";

const HOLDER_TYPE_LABELS = Object.freeze({
  UNASSIGNED: "Unassigned",
  STORY: "Story Inventory",
  CHARACTER: "Character",
  PLAYER_CHARACTER: "Player Character",
  LOCATION: "Location",
});

const HOLDER_PICKER_CONFIG = Object.freeze({
  CHARACTER: Object.freeze({
    title: "Select Starting Character",
    body:
      "Choose the Character who holds this item when the Story begins. The Character must be present in the Story for the assignment to resolve to a participant.",
    addLabel: "Select Character",
    allowedTypes: Object.freeze(["CHARACTER"]),
  }),
  PLAYER_CHARACTER: Object.freeze({
    title: "Select Starting Player Character",
    body:
      "Choose the Player Character who holds this item when the Story begins. The selected Player Character must be used in the Story for the assignment to resolve.",
    addLabel: "Select Player Character",
    allowedTypes: Object.freeze(["PLAYER_CHARACTER"]),
  }),
  LOCATION: Object.freeze({
    title: "Select Starting Location",
    body: "Choose the Location where this item exists when the Story begins.",
    addLabel: "Select Location",
    allowedTypes: Object.freeze(["LOCATION"]),
  }),
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatOptionLabel(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function moveArrayEntry(entries, fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= entries.length ||
    toIndex >= entries.length
  ) {
    return entries;
  }

  const next = [...entries];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

const HOLDER_TYPE_OPTIONS = Object.freeze(
  ITEM_STARTING_HOLDER_TYPE_OPTIONS.map((holderType) => ({
    value: holderType,
    label: HOLDER_TYPE_LABELS[holderType] || holderType,
  }))
);

const PLACEMENT_SPECIFICITY_OPTIONS = Object.freeze(
  ITEM_PLACEMENT_SPECIFICITY_OPTIONS.map((specificity) => ({
    value: specificity,
    label:
      specificity === "EXPLICIT"
        ? "Explicit — follow the authored placement"
        : "Unspecified — allow reasonable narrative staging",
  }))
);

const PLACEMENT_STEP_KIND_OPTIONS = Object.freeze(
  ITEM_PLACEMENT_STEP_KIND_OPTIONS.map((kind) => ({
    value: kind,
    label: formatOptionLabel(kind),
  }))
);

export function useItemStartingAssignmentEditorViewModel({
  entry = {},
  onChange,
} = {}) {
  const [isPickerOpen, setPickerOpen] = useState(false);

  const assignment = normalizeItemStartingAssignment(
    entry?.startingAssignment
  );
  const placement = normalizeItemPlacement(assignment.placement, {
    legacyPlacementNote: assignment.placementNote,
  });
  const holderType = assignment.holderType;
  const pickerConfig = HOLDER_PICKER_CONFIG[holderType] || null;
  const usesCreation = itemStartingHolderUsesCreation(holderType);

  function updateAssignment(patch) {
    onChange?.(
      normalizeItemStartingAssignment({
        ...assignment,
        ...patch,
      })
    );
  }

  function updatePlacement(nextPlacement) {
    const normalizedPlacement = normalizeItemPlacement(nextPlacement, {
      legacyPlacementNote: nextPlacement?.note,
    });

    updateAssignment({
      placement: normalizedPlacement,
      placementNote: normalizedPlacement.note,
    });
  }

  function changeHolderType(nextHolderType) {
    const safeHolderType = normalizeString(nextHolderType).toUpperCase();

    updateAssignment({
      holderType: safeHolderType,
      holderCreationId: null,
      holderCreationType: null,
      holderTitle: safeHolderType === "STORY" ? "Story Inventory" : "",
    });
    setPickerOpen(false);
  }

  function selectCreation(creation) {
    if (!pickerConfig || !creation?.id) {
      return;
    }

    const creationType = normalizeString(creation.type).toUpperCase();
    if (!pickerConfig.allowedTypes.includes(creationType)) {
      return;
    }

    updateAssignment({
      holderType,
      holderCreationId: creation.id,
      holderCreationType: creationType,
      holderTitle:
        creation.title || creation.data?.name || "Selected Holder",
    });
    setPickerOpen(false);
  }

  function clearHolderCreation() {
    updateAssignment({
      holderCreationId: null,
      holderCreationType: null,
      holderTitle: "",
    });
  }

  function changePlacementSpecificity(specificity) {
    if (specificity === "UNSPECIFIED") {
      updatePlacement(createEmptyItemPlacement());
      return;
    }

    updatePlacement({
      ...placement,
      specificity: "EXPLICIT",
    });
  }

  function updatePlacementStep(stepId, patch) {
    updatePlacement({
      ...placement,
      specificity: "EXPLICIT",
      path: placement.path.map((step) =>
        step.id === stepId
          ? {
              ...step,
              ...patch,
            }
          : step
      ),
    });
  }

  function deletePlacementStep(stepId) {
    updatePlacement({
      ...placement,
      path: placement.path.filter((step) => step.id !== stepId),
    });
  }

  function movePlacementStep(stepIndex, direction) {
    const nextIndex = direction === "UP" ? stepIndex - 1 : stepIndex + 1;

    updatePlacement({
      ...placement,
      path: moveArrayEntry(placement.path, stepIndex, nextIndex),
    });
  }

  function addPlacementStep() {
    const hasUnfinishedStep = placement.path.some(
      (step) => !normalizeString(step?.label)
    );

    if (hasUnfinishedStep) {
      return;
    }

    updatePlacement({
      ...placement,
      specificity: "EXPLICIT",
      path: [
        ...placement.path,
        createEmptyItemPlacementStep({
          kind: "CUSTOM",
          label: "",
        }),
      ],
    });
  }

  const hasUnfinishedPlacementStep = placement.path.some(
    (step) => !normalizeString(step?.label)
  );

  return {
    viewProps: {
      holderType,
      holderTypeOptions: HOLDER_TYPE_OPTIONS,
      holderTypeLabel: HOLDER_TYPE_LABELS[holderType] || holderType,
      usesCreation,
      hasSelectedHolder: Boolean(assignment.holderCreationId),
      selectedHolderTitle: assignment.holderTitle || "Selected Holder",
      emptyHolderLabel:
        HOLDER_TYPE_LABELS[holderType]?.toLowerCase() || "holder",
      pickerAddLabel: pickerConfig?.addLabel || "Select Holder",
      showUnassignedState: holderType === "UNASSIGNED",
      showStoryState: holderType === "STORY",
      showPlacement: holderType !== "UNASSIGNED",
      placementSpecificity: placement.specificity,
      placementSpecificityOptions: PLACEMENT_SPECIFICITY_OPTIONS,
      placementStepKindOptions: PLACEMENT_STEP_KIND_OPTIONS,
      placementSteps: placement.path.map((step, index) => ({
        id: step.id,
        index,
        levelNumber: index + 1,
        kind: step.kind,
        label: step.label || "",
        isFirst: index === 0,
        isLast: index === placement.path.length - 1,
      })),
      placementNote: placement.note || "",
      canAddPlacementStep: !hasUnfinishedPlacementStep,
      onChangeHolderType: changeHolderType,
      onOpenPicker: () => setPickerOpen(true),
      onClearHolderCreation: clearHolderCreation,
      onChangePlacementSpecificity: changePlacementSpecificity,
      onMovePlacementStepUp: (stepIndex) =>
        movePlacementStep(stepIndex, "UP"),
      onMovePlacementStepDown: (stepIndex) =>
        movePlacementStep(stepIndex, "DOWN"),
      onDeletePlacementStep: deletePlacementStep,
      onChangePlacementStepKind: (stepId, kind) =>
        updatePlacementStep(stepId, { kind }),
      onChangePlacementStepLabel: (stepId, label) =>
        updatePlacementStep(stepId, { label }),
      onBlurPlacementStepLabel: (stepId) => {
        const step = placement.path.find((candidate) => candidate.id === stepId);
        if (!normalizeString(step?.label)) {
          deletePlacementStep(stepId);
        }
      },
      onAddPlacementStep: addPlacementStep,
      onChangePlacementNote: (note) =>
        updatePlacement({
          ...placement,
          specificity: "EXPLICIT",
          note,
        }),
    },
    applicationContentProps: {
      isPickerOpen: Boolean(isPickerOpen && pickerConfig),
      pickerTitle: pickerConfig?.title || "Select Starting Holder",
      pickerBody: pickerConfig?.body || "Select the starting holder.",
      pickerAllowedTypes: pickerConfig?.allowedTypes || [],
      selectedCreationIds: assignment.holderCreationId
        ? [assignment.holderCreationId]
        : [],
      onClosePicker: () => setPickerOpen(false),
      onSelectCreation: selectCreation,
    },
  };
}
