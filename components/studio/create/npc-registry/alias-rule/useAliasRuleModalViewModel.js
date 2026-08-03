"use client";

function toIdentityOption(entry) {
  return {
    id: String(entry?.id || ""),
    label: String(entry?.name || "Unnamed NPC"),
  };
}

export function useAliasRuleModalViewModel({
  draft = {},
  entries = [],
  onClose = null,
  onChange = null,
  onSave = null,
} = {}) {
  function chooseTrueIdentity(identityId) {
    onChange?.("trueEntryId", identityId);
  }

  function changePublicIdentity(value) {
    onChange?.("publicIdentity", value);
  }

  function changeRule(value) {
    onChange?.("rule", value);
  }

  return {
    modalTitle: "Alias Rule",
    trueIdentityLabel: "True Identity",
    selectedIdentityId: String(draft?.trueEntryId || ""),
    identityOptions: (Array.isArray(entries) ? entries : []).map(
      toIdentityOption
    ),
    publicIdentityLabel: "Public Identity / Alias",
    publicIdentityValue: String(draft?.publicIdentity || ""),
    ruleLabel: "Alias Rule",
    ruleValue: String(draft?.rule || ""),
    rulePlaceholder: "Explain how the runtime should treat this alias.",
    ruleRows: 5,
    saveLabel: "Save Alias Rule",
    onClose,
    onChooseTrueIdentity: chooseTrueIdentity,
    onChangePublicIdentity: changePublicIdentity,
    onChangeRule: changeRule,
    onSave,
  };
}
