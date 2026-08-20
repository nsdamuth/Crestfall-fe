"use client";

import {
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  projectItemEquipmentModifierReferencesPresentation,
} from "../item-equipment-modifier-references/ItemEquipmentModifierReferences.contract";
import ItemEquipmentModifierReferencesEditorView from "./ItemEquipmentModifierReferencesEditor.view";

export default function ItemEquipmentModifierReferencesEditor({
  references = [],
  maxReferences = ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  onAdd = null,
  onUpdate = null,
  onRemove = null,
} = {}) {
  const presentation = projectItemEquipmentModifierReferencesPresentation({
    references,
    maxReferences,
  });

  return (
    <ItemEquipmentModifierReferencesEditorView
      title={presentation.title}
      description={presentation.description}
      referenceContractVersion={presentation.referenceContractVersion}
      references={presentation.references}
      maxReferences={presentation.maxReferences}
      canAdd={presentation.summary.canAdd}
      emptyState={presentation.emptyState}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onRemove={onRemove}
    />
  );
}
