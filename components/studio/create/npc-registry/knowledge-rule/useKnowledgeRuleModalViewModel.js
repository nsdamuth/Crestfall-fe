"use client";

const DEFAULT_KNOWLEDGE_OPTIONS = [
  { id: "UNKNOWN", label: "Unknown by default" },
  { id: "SUSPICION", label: "Suspicion by default" },
  { id: "PARTIAL", label: "Partial knowledge by default" },
  { id: "FULL", label: "Full knowledge by default" },
  { id: "FALSE_BELIEF", label: "False belief by default" },
];

function toIdentityOption(entry) {
  return {
    id: String(entry?.id || ""),
    label: String(entry?.name || "Unnamed NPC"),
  };
}

function normalizeSelectedIds(value) {
  return (Array.isArray(value) ? value : [])
    .map((entryId) => String(entryId || ""))
    .filter(Boolean);
}

export function useKnowledgeRuleModalViewModel({
  draft = {},
  entries = [],
  onClose = null,
  onChange = null,
  onToggleEntry = null,
  onSave = null,
} = {}) {
  function changeKnowledgeTopic(value) {
    onChange?.("subject", value);
  }

  function chooseDefaultKnowledge(knowledgeLevelId) {
    onChange?.("defaultKnowledge", knowledgeLevelId);
  }

  function toggleKnownIdentity(identityId) {
    onToggleEntry?.("knownByEntryIds", identityId);
  }

  function toggleSuspectedIdentity(identityId) {
    onToggleEntry?.("suspectedByEntryIds", identityId);
  }

  function changeFalseBeliefNotes(value) {
    onChange?.("falseBeliefNotes", value);
  }

  function changeKnowledgeNotes(value) {
    onChange?.("notes", value);
  }

  return {
    modalTitle: "Knowledge Rule",
    knowledgeTopicLabel: "Subject / Secret",
    knowledgeTopicValue: String(draft?.subject || ""),
    knowledgeLevelLabel: "Default Knowledge",
    selectedKnowledgeLevelId: String(draft?.defaultKnowledge || ""),
    knowledgeLevelOptions: DEFAULT_KNOWLEDGE_OPTIONS,
    knownByTitle: "Known By",
    suspectedByTitle: "Suspected By",
    identityOptions: (Array.isArray(entries) ? entries : []).map(
      toIdentityOption
    ),
    knownByIdentityIds: normalizeSelectedIds(draft?.knownByEntryIds),
    suspectedByIdentityIds: normalizeSelectedIds(
      draft?.suspectedByEntryIds
    ),
    falseBeliefLabel: "False Belief Notes",
    falseBeliefValue: String(draft?.falseBeliefNotes || ""),
    falseBeliefRows: 3,
    notesLabel: "Knowledge Rule Notes",
    notesValue: String(draft?.notes || ""),
    notesRows: 5,
    notesPlaceholder:
      "Explain how this knowledge should be protected, revealed, or constrained.",
    saveLabel: "Save Knowledge Rule",
    onClose,
    onChangeKnowledgeTopic: changeKnowledgeTopic,
    onChooseDefaultKnowledge: chooseDefaultKnowledge,
    onToggleKnownIdentity: toggleKnownIdentity,
    onToggleSuspectedIdentity: toggleSuspectedIdentity,
    onChangeFalseBeliefNotes: changeFalseBeliefNotes,
    onChangeKnowledgeNotes: changeKnowledgeNotes,
    onSave,
  };
}
