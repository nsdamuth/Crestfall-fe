const noop = () => {};

const identityOptions = [
  { id: "npc-elara", label: "Dr. Elara Kade" },
  { id: "npc-finch", label: "Dr. Alistair Finch" },
  { id: "npc-seer", label: "The Seer" },
  { id: "npc-lux", label: "Lux" },
];

const knowledgeLevelOptions = [
  { id: "UNKNOWN", label: "Unknown by default" },
  { id: "SUSPICION", label: "Suspicion by default" },
  { id: "PARTIAL", label: "Partial knowledge by default" },
  { id: "FULL", label: "Full knowledge by default" },
  { id: "FALSE_BELIEF", label: "False belief by default" },
];

const baseFixture = {
  modalTitle: "Knowledge Rule",
  knowledgeTopicLabel: "Subject / Secret",
  knowledgeTopicValue: "The observatory archive survived the fire",
  knowledgeLevelLabel: "Default Knowledge",
  selectedKnowledgeLevelId: "SUSPICION",
  knowledgeLevelOptions,
  knownByTitle: "Known By",
  suspectedByTitle: "Suspected By",
  identityOptions,
  knownByIdentityIds: ["npc-elara"],
  suspectedByIdentityIds: ["npc-finch", "npc-seer"],
  falseBeliefLabel: "False Belief Notes",
  falseBeliefValue:
    "Most outsiders believe the archive was completely destroyed.",
  falseBeliefRows: 3,
  notesLabel: "Knowledge Rule Notes",
  notesValue:
    "Reveal the surviving archive only after the group gains access to the sealed lower observatory.",
  notesRows: 5,
  notesPlaceholder:
    "Explain how this knowledge should be protected, revealed, or constrained.",
  saveLabel: "Save Knowledge Rule",
  onClose: noop,
  onChangeKnowledgeTopic: noop,
  onChooseDefaultKnowledge: noop,
  onToggleKnownIdentity: noop,
  onToggleSuspectedIdentity: noop,
  onChangeFalseBeliefNotes: noop,
  onChangeKnowledgeNotes: noop,
  onSave: noop,
};

export const knowledgeRulePopulatedFixture = {
  ...baseFixture,
};

export const knowledgeRuleEmptyFixture = {
  ...baseFixture,
  knowledgeTopicValue: "",
  selectedKnowledgeLevelId: "UNKNOWN",
  knownByIdentityIds: [],
  suspectedByIdentityIds: [],
  falseBeliefValue: "",
  notesValue: "",
};

export const knowledgeRuleNoEntriesFixture = {
  ...baseFixture,
  identityOptions: [],
  knownByIdentityIds: [],
  suspectedByIdentityIds: [],
};

export const knowledgeRuleFalseBeliefFixture = {
  ...baseFixture,
  knowledgeTopicValue: "Who opened the gate beneath Aethelred Tower",
  selectedKnowledgeLevelId: "FALSE_BELIEF",
  knownByIdentityIds: ["npc-seer"],
  suspectedByIdentityIds: ["npc-elara"],
  falseBeliefValue:
    "The city guard believes an unidentified cult opened the gate, while the Seer knows it was opened from inside the tower.",
};

export const knowledgeRuleLongContentFixture = {
  ...baseFixture,
  identityOptions: [
    ...identityOptions,
    {
      id: "npc-long-name",
      label:
        "Ambassador Seraphina Valecrest, Acting Keeper of the Ninth Archive",
    },
  ],
  knownByIdentityIds: ["npc-elara", "npc-long-name"],
  knowledgeTopicValue:
    "The sealed diplomatic record describing the true cause of the Ninth Archive collapse",
  falseBeliefValue:
    "The public record attributes the collapse to structural failure and an uncontrolled fire, while several factions promote competing stories involving sabotage, forbidden machinery, or a failed ritual.",
  notesValue:
    "Keep the record compartmentalized. Characters with full knowledge may refer to its existence only in secure scenes, characters with suspicion may notice inconsistencies but should not state the truth as fact, and characters without access should continue to rely on the public account until credible evidence is presented.",
};
