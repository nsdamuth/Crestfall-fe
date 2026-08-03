import ModalActions from "../ModalActions";
import ModalShell from "../ModalShell";
import { SelectInput, TextArea, TextInput } from "../RegistryUtils";

function toSelectOptions(options = []) {
  return options.map((option) => ({
    value: option?.id || "",
    label: option?.label || "Unnamed option",
  }));
}

export default function RelationshipModalView({
  modalTitle = "Relationship Rule",
  sourceIdentityLabel = "From NPC",
  targetIdentityLabel = "To NPC",
  selectedSourceIdentityId = "",
  selectedTargetIdentityId = "",
  identityOptions = [],
  relationshipTypeLabel = "Relationship Type",
  relationshipTypeValue = "",
  directionLabel = "Direction",
  selectedDirectionId = "mutual",
  directionOptions = [],
  strengthLabel = "Strength",
  selectedStrengthId = "medium",
  strengthOptions = [],
  ruleLabel = "Relationship Rule",
  ruleValue = "",
  ruleRows = 5,
  rulePlaceholder = "",
  saveLabel = "Save Relationship",
  onClose = null,
  onChooseSourceIdentity = null,
  onChooseTargetIdentity = null,
  onChangeRelationshipType = null,
  onChooseDirection = null,
  onChooseStrength = null,
  onChangeRelationshipRule = null,
  onSave = null,
}) {
  return (
    <ModalShell title={modalTitle} onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectInput
            label={sourceIdentityLabel}
            value={selectedSourceIdentityId}
            onChange={(value) => onChooseSourceIdentity?.(value)}
            options={toSelectOptions(identityOptions)}
          />

          <SelectInput
            label={targetIdentityLabel}
            value={selectedTargetIdentityId}
            onChange={(value) => onChooseTargetIdentity?.(value)}
            options={toSelectOptions(identityOptions)}
          />

          <TextInput
            label={relationshipTypeLabel}
            value={relationshipTypeValue}
            onChange={(value) => onChangeRelationshipType?.(value)}
          />

          <SelectInput
            label={directionLabel}
            value={selectedDirectionId}
            onChange={(value) => onChooseDirection?.(value)}
            options={toSelectOptions(directionOptions)}
          />

          <SelectInput
            label={strengthLabel}
            value={selectedStrengthId}
            onChange={(value) => onChooseStrength?.(value)}
            options={toSelectOptions(strengthOptions)}
          />
        </div>

        <TextArea
          label={ruleLabel}
          value={ruleValue}
          onChange={(value) => onChangeRelationshipRule?.(value)}
          rows={ruleRows}
          placeholder={rulePlaceholder}
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel={saveLabel}
        />
      </div>
    </ModalShell>
  );
}
