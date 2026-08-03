"use client";

const DIRECTION_OPTIONS = [
  { id: "mutual", label: "Mutual", value: "MUTUAL" },
  { id: "fromTo", label: "From → To", value: "FROM_TO" },
  { id: "toFrom", label: "To → From", value: "TO_FROM" },
];

const STRENGTH_OPTIONS = [
  { id: "low", label: "Low", value: "LOW" },
  { id: "medium", label: "Medium", value: "MEDIUM" },
  { id: "strong", label: "Strong", value: "STRONG" },
  { id: "locked", label: "Locked / Canon", value: "LOCKED" },
];

function toIdentityOption(entry) {
  return {
    id: String(entry?.id || ""),
    label: String(entry?.name || "Unnamed NPC"),
  };
}

function toViewOption(option) {
  return {
    id: option.id,
    label: option.label,
  };
}

function findViewId(options, rawValue, fallbackId) {
  return (
    options.find((option) => option.value === rawValue)?.id || fallbackId
  );
}

function findRawValue(options, viewId, fallbackValue) {
  return (
    options.find((option) => option.id === viewId)?.value || fallbackValue
  );
}

export function useRelationshipModalViewModel({
  draft = {},
  entries = [],
  onClose = null,
  onChange = null,
  onSave = null,
} = {}) {
  function chooseSourceIdentity(identityId) {
    onChange?.("fromEntryId", identityId);
  }

  function chooseTargetIdentity(identityId) {
    onChange?.("toEntryId", identityId);
  }

  function changeRelationshipType(value) {
    onChange?.("type", value);
  }

  function chooseDirection(directionId) {
    onChange?.(
      "direction",
      findRawValue(DIRECTION_OPTIONS, directionId, "MUTUAL")
    );
  }

  function chooseStrength(strengthId) {
    onChange?.(
      "strength",
      findRawValue(STRENGTH_OPTIONS, strengthId, "MEDIUM")
    );
  }

  function changeRelationshipRule(value) {
    onChange?.("description", value);
  }

  return {
    modalTitle: "Relationship Rule",
    sourceIdentityLabel: "From NPC",
    targetIdentityLabel: "To NPC",
    selectedSourceIdentityId: String(draft?.fromEntryId || ""),
    selectedTargetIdentityId: String(draft?.toEntryId || ""),
    identityOptions: (Array.isArray(entries) ? entries : []).map(
      toIdentityOption
    ),
    relationshipTypeLabel: "Relationship Type",
    relationshipTypeValue: String(draft?.type || ""),
    directionLabel: "Direction",
    selectedDirectionId: findViewId(
      DIRECTION_OPTIONS,
      draft?.direction,
      "mutual"
    ),
    directionOptions: DIRECTION_OPTIONS.map(toViewOption),
    strengthLabel: "Strength",
    selectedStrengthId: findViewId(
      STRENGTH_OPTIONS,
      draft?.strength,
      "medium"
    ),
    strengthOptions: STRENGTH_OPTIONS.map(toViewOption),
    ruleLabel: "Relationship Rule",
    ruleValue: String(draft?.description || ""),
    ruleRows: 5,
    rulePlaceholder:
      "Describe the relationship and how the runtime should preserve it.",
    saveLabel: "Save Relationship",
    onClose,
    onChooseSourceIdentity: chooseSourceIdentity,
    onChooseTargetIdentity: chooseTargetIdentity,
    onChangeRelationshipType: changeRelationshipType,
    onChooseDirection: chooseDirection,
    onChooseStrength: chooseStrength,
    onChangeRelationshipRule: changeRelationshipRule,
    onSave,
  };
}
