"use client";

import {
  ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  projectItemOperationAuthoringPresentation,
} from "./ItemOperationAuthoring.contract";
import {
  resolveItemOperationEffectAuthoringOption,
} from "./itemOperationAuthoringCatalog.js";
import ItemOperationEffectReferencesEditorView from "./ItemOperationEffectReferencesEditor.view";

export default function ItemOperationEffectReferencesEditor({
  references = [],
  maxReferences = ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  onAdd = null,
  onUpdate = null,
  onRemove = null,
} = {}) {
  const presentation = projectItemOperationAuthoringPresentation({
    requirementSets: [],
    effectReferences: references,
  });
  const resolvedMaxReferences = Math.min(
    ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
    Math.max(0, Number.parseInt(maxReferences, 10) || 0)
  );
  const operationOptions = presentation.effectOptions.map((entry) => ({
    value: `${entry.domain}::${entry.operation}`,
    label: `${entry.domain.replaceAll("_", " ")} · ${entry.label}`,
  }));

  function selectOperation(index, value) {
    const [domain, operation] = String(value || "").split("::");
    const catalogEntry = resolveItemOperationEffectAuthoringOption({
      domain,
      operation,
    });
    if (!catalogEntry) return;

    onUpdate?.(index, {
      domain: catalogEntry.domain,
      operation: catalogEntry.operation,
      version: catalogEntry.version,
      arguments: { ...catalogEntry.defaultArguments },
    });
  }

  return (
    <ItemOperationEffectReferencesEditorView
      references={presentation.effectReferences.slice(0, resolvedMaxReferences)}
      actionTypes={presentation.actionTypes}
      targetRoles={presentation.effectTargetRoles}
      operationOptions={operationOptions}
      effectCatalogVersion={presentation.effectCatalogVersion}
      maxReferences={resolvedMaxReferences}
      canAdd={presentation.effectReferences.length < resolvedMaxReferences}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onSelectOperation={selectOperation}
    />
  );
}
