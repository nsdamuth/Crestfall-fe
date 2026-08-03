export const mechanicsCommandRequirementsFixtures = Object.freeze([
  Object.freeze({ id: "empty", label: "Empty", requirements: [] }),
  Object.freeze({
    id: "ordinary",
    label: "Ordinary State Requirements",
    requirements: [
      { id: "mana_available", type: "METER", targetId: "mana", operator: "GTE", value: 5, message: "Mana must be at least 5." },
      { id: "spell_unlocked", type: "FLAG", targetId: "spell_unlocked", operator: "EQ", value: true, message: "The spell is not unlocked." },
      { id: "combat_ready", type: "STAGE", targetId: "combat_phase", operator: "EQ", value: "ready", message: "Combat is not ready." },
    ],
  }),
  Object.freeze({
    id: "progression",
    label: "Progression Enforcement",
    requirements: [
      { id: "minimum_level", type: "PROGRESSION_MINIMUM_LEVEL", targetId: "progression", value: 5, enforcement: "ADVISORY" },
      { id: "required_tier", type: "PROGRESSION_REQUIRED_TIER", targetId: "progression", value: ["tier.veteran", "tier.master"], enforcement: "HARD_LOCK" },
      { id: "not_maximum", type: "PROGRESSION_AT_MAXIMUM_LEVEL", targetId: "progression", value: false, enforcement: "HARD_LOCK" },
    ],
  }),
  Object.freeze({
    id: "targets",
    label: "Resolved Target Requirements",
    requirements: [
      { id: "target_present", type: "TARGET_PRESENT", argumentName: "target", value: true },
      { id: "target_held", type: "TARGET_HELD", argumentName: "item", value: true },
    ],
  }),
  Object.freeze({
    id: "legacy",
    label: "Legacy Aliases",
    requirements: [
      { key: "legacy_level", requirement_type: "PROGRESSION_MINIMUM_LEVEL", mechanics_id: "progression", threshold: "3", enforcement_policy: "hard_lock", failure_message: "Reach level 3.", futureRequirementMetadata: { retained: true } },
      { key: "legacy_tier", requirementType: "PROGRESSION_REQUIRED_TIER", tracker_id: "progression", expected_value: "tier.veteran, tier.master", enforcementPolicy: "advisory" },
    ],
  }),
  Object.freeze({
    id: "recoverable",
    label: "Malformed but Recoverable",
    requirements: [
      null,
      { id: "", type: "UNKNOWN", operator: "UNKNOWN", value: "", enabled: "yes" },
      { id: "disabled", type: "FLAG", enabled: false },
    ],
  }),
]);
