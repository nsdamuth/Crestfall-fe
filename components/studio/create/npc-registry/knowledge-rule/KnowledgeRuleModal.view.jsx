import ModalActions from "../ModalActions";
import ModalShell from "../ModalShell";
import {
  CheckboxGroup,
  SelectInput,
  TextArea,
  TextInput,
} from "../RegistryUtils";

function toCheckboxEntries(identityOptions) {
  return (Array.isArray(identityOptions) ? identityOptions : []).map((option) => ({
    id: option?.id || "",
    name: option?.label || "Unnamed NPC",
  }));
}

function toSelectOptions(knowledgeLevelOptions) {
  return (Array.isArray(knowledgeLevelOptions)
    ? knowledgeLevelOptions
    : []
  ).map((option) => ({
    value: option?.id || "",
    label: option?.label || "Unnamed knowledge level",
  }));
}

export default function KnowledgeRuleModalView({
  modalTitle = "Knowledge Rule",
  knowledgeTopicLabel = "Subject / Secret",
  knowledgeTopicValue = "",
  knowledgeLevelLabel = "Default Knowledge",
  selectedKnowledgeLevelId = "",
  knowledgeLevelOptions = [],
  knownByTitle = "Known By",
  suspectedByTitle = "Suspected By",
  identityOptions = [],
  knownByIdentityIds = [],
  suspectedByIdentityIds = [],
  falseBeliefLabel = "False Belief Notes",
  falseBeliefValue = "",
  falseBeliefRows = 3,
  notesLabel = "Knowledge Rule Notes",
  notesValue = "",
  notesRows = 5,
  notesPlaceholder = "",
  saveLabel = "Save Knowledge Rule",
  onClose = null,
  onChangeKnowledgeTopic = null,
  onChooseDefaultKnowledge = null,
  onToggleKnownIdentity = null,
  onToggleSuspectedIdentity = null,
  onChangeFalseBeliefNotes = null,
  onChangeKnowledgeNotes = null,
  onSave = null,
}) {
  const checkboxEntries = toCheckboxEntries(identityOptions);

  return (
    <ModalShell title={modalTitle} onClose={onClose}>
      <div className="grid gap-5">
        <TextInput
          label={knowledgeTopicLabel}
          value={knowledgeTopicValue}
          onChange={(value) => onChangeKnowledgeTopic?.(value)}
        />

        <SelectInput
          label={knowledgeLevelLabel}
          value={selectedKnowledgeLevelId}
          onChange={(value) => onChooseDefaultKnowledge?.(value)}
          options={toSelectOptions(knowledgeLevelOptions)}
        />

        <CheckboxGroup
          title={knownByTitle}
          entries={checkboxEntries}
          selectedIds={knownByIdentityIds}
          onToggle={(identityId) => onToggleKnownIdentity?.(identityId)}
        />

        <CheckboxGroup
          title={suspectedByTitle}
          entries={checkboxEntries}
          selectedIds={suspectedByIdentityIds}
          onToggle={(identityId) => onToggleSuspectedIdentity?.(identityId)}
        />

        <TextArea
          label={falseBeliefLabel}
          value={falseBeliefValue}
          onChange={(value) => onChangeFalseBeliefNotes?.(value)}
          rows={falseBeliefRows}
        />

        <TextArea
          label={notesLabel}
          value={notesValue}
          onChange={(value) => onChangeKnowledgeNotes?.(value)}
          rows={notesRows}
          placeholder={notesPlaceholder}
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
