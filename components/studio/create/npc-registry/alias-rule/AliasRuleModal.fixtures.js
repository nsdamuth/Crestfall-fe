const noop = () => {};

const identityOptions = [
  { id: "npc-elara", label: "Dr. Elara Kade" },
  { id: "npc-finch", label: "Dr. Alistair Finch" },
  { id: "npc-seer", label: "The Seer" },
];

const baseFixture = {
  modalTitle: "Alias Rule",
  trueIdentityLabel: "True Identity",
  selectedIdentityId: "npc-elara",
  identityOptions,
  publicIdentityLabel: "Public Identity / Alias",
  publicIdentityValue: "Professor Vale",
  ruleLabel: "Alias Rule",
  ruleValue:
    "Most people know Elara only as Professor Vale. Reveal her true identity only after the observatory records are recovered.",
  rulePlaceholder: "Explain how the runtime should treat this alias.",
  ruleRows: 5,
  saveLabel: "Save Alias Rule",
  onClose: noop,
  onChooseTrueIdentity: noop,
  onChangePublicIdentity: noop,
  onChangeRule: noop,
  onSave: noop,
};

export const aliasRulePopulatedFixture = {
  ...baseFixture,
};

export const aliasRuleEmptyFixture = {
  ...baseFixture,
  selectedIdentityId: "",
  publicIdentityValue: "",
  ruleValue: "",
};

export const aliasRuleNoEntriesFixture = {
  ...baseFixture,
  selectedIdentityId: "",
  identityOptions: [],
  publicIdentityValue: "The Unknown Envoy",
  ruleValue:
    "Add an NPC entry before assigning the alias to a true identity.",
};

export const aliasRuleLongContentFixture = {
  ...baseFixture,
  identityOptions: [
    ...identityOptions,
    {
      id: "npc-long-name",
      label:
        "Ambassador Seraphina Valecrest, Acting Keeper of the Ninth Archive",
    },
  ],
  selectedIdentityId: "npc-long-name",
  publicIdentityValue:
    "The Soft-Spoken Archivist Who Appears at Every Restricted Collection",
  ruleValue:
    "Publicly, the character maintains an elaborate archival identity supported by forged credentials, rehearsed professional history, and several cooperating witnesses. The runtime should preserve this identity in ordinary conversation, avoid casually exposing contradictory details, and allow the truth to emerge only when a scene has established credible evidence or direct recognition.",
};
