const identityOptions = [
  { id: "npc-alyera", label: "Alyera Valecourt" },
  { id: "npc-kaela", label: "Kaela Veynskald" },
  { id: "npc-serapha", label: "Serapha Veyloria" },
];

const directionOptions = [
  { id: "mutual", label: "Mutual" },
  { id: "fromTo", label: "From → To" },
  { id: "toFrom", label: "To → From" },
];

const strengthOptions = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "strong", label: "Strong" },
  { id: "locked", label: "Locked / Canon" },
];

const baseFixture = {
  modalTitle: "Relationship Rule",
  sourceIdentityLabel: "From NPC",
  targetIdentityLabel: "To NPC",
  identityOptions,
  relationshipTypeLabel: "Relationship Type",
  directionLabel: "Direction",
  directionOptions,
  strengthLabel: "Strength",
  strengthOptions,
  ruleLabel: "Relationship Rule",
  ruleRows: 5,
  rulePlaceholder:
    "Describe the relationship and how the runtime should preserve it.",
  saveLabel: "Save Relationship",
};

export const relationshipPopulatedFixture = {
  ...baseFixture,
  selectedSourceIdentityId: "npc-alyera",
  selectedTargetIdentityId: "npc-kaela",
  relationshipTypeValue: "Rivals",
  selectedDirectionId: "mutual",
  selectedStrengthId: "strong",
  ruleValue:
    "Their rivalry is intense but disciplined. Neither should willingly allow an outsider to humiliate the other.",
};

export const relationshipEmptyFixture = {
  ...baseFixture,
  selectedSourceIdentityId: "npc-alyera",
  selectedTargetIdentityId: "npc-kaela",
  relationshipTypeValue: "",
  selectedDirectionId: "mutual",
  selectedStrengthId: "medium",
  ruleValue: "",
};

export const relationshipDirectionalFixture = {
  ...baseFixture,
  selectedSourceIdentityId: "npc-serapha",
  selectedTargetIdentityId: "npc-alyera",
  relationshipTypeValue: "Protective mentor",
  selectedDirectionId: "fromTo",
  selectedStrengthId: "locked",
  ruleValue:
    "Serapha protects Alyera and may intervene when Alyera is placed in mortal danger. Alyera does not have the same obligation in return.",
};

export const relationshipNoEntriesFixture = {
  ...baseFixture,
  selectedSourceIdentityId: "",
  selectedTargetIdentityId: "",
  identityOptions: [],
  relationshipTypeValue: "",
  selectedDirectionId: "mutual",
  selectedStrengthId: "medium",
  ruleValue: "",
};

export const relationshipLongContentFixture = {
  ...baseFixture,
  selectedSourceIdentityId: "npc-alyera",
  selectedTargetIdentityId: "npc-serapha",
  identityOptions: [
    {
      id: "npc-alyera",
      label:
        "Alyera Valecourt, Acting Envoy of the Northern Council and Keeper of the First Oath",
    },
    {
      id: "npc-serapha",
      label:
        "Serapha Veyloria, Canon-Bound Guardian of the Western Archive and Last Witness of the Veil",
    },
  ],
  relationshipTypeValue:
    "Politically constrained alliance with unresolved personal distrust",
  selectedDirectionId: "toFrom",
  selectedStrengthId: "strong",
  ruleValue:
    "This relationship carries several simultaneous obligations. Publicly, both parties must appear cooperative. Privately, they remain wary of each other's motives, and any apparent betrayal must be weighed against their shared responsibility to protect the archive, maintain council stability, and prevent old grievances from becoming public knowledge.",
};
