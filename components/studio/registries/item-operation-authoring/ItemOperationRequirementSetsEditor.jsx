"use client";

import {
  ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
  projectItemOperationAuthoringPresentation,
} from "./ItemOperationAuthoring.contract";
import ItemOperationRequirementSetsEditorView from "./ItemOperationRequirementSetsEditor.view";

export default function ItemOperationRequirementSetsEditor({
  requirementSets = [],
  maxSets = ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
  onAdd = null,
  onUpdate = null,
  onRemove = null,
  onAddRequirement = null,
  onUpdateRequirement = null,
  onRemoveRequirement = null,
} = {}) {
  const presentation = projectItemOperationAuthoringPresentation({
    requirementSets,
    effectReferences: [],
  });
  const resolvedMaxSets = Math.min(
    ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
    Math.max(0, Number.parseInt(maxSets, 10) || 0)
  );

  return (
    <ItemOperationRequirementSetsEditorView
      requirementSets={presentation.requirementSets.slice(0, resolvedMaxSets)}
      actionTypes={presentation.actionTypes}
      requirementsVersion="mechanics_command_requirements_v1"
      maxSets={resolvedMaxSets}
      canAdd={presentation.requirementSets.length < resolvedMaxSets}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onAddRequirement={onAddRequirement}
      onUpdateRequirement={onUpdateRequirement}
      onRemoveRequirement={onRemoveRequirement}
    />
  );
}
