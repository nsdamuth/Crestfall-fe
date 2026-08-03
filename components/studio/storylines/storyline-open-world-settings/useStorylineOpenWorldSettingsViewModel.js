"use client";

import {
  normalizeStorylineData,
  STORYLINE_TRANSITION_POLICIES,
} from "@/lib/shared/storylines/storylineAuthoring.mjs";

const DEFAULT_COPY = Object.freeze({
  title: "Open-World Interludes",
  description:
    "Completion normally returns the same chat to open-world play. Cast, world state, Mechanics, and memory remain continuous until an authored trigger makes the next node available.",
  defaultTransitionLabel: "Default Transition",
  defaultTransitionHelp:
    "Used when a node is added or becomes non-final. The final node always completes the Storyline.",
  continuityEyebrow: "Continuity Always Preserved",
  continuityDescription:
    "Same chat, participants, world state, and memory. These are required Storyline invariants and are not optional toggles.",
  guidanceLabel: "Open-World Guidance",
  guidancePlaceholder:
    "Describe what remains available between Storyline nodes without deciding what the player does.",
  pressureCadenceLabel: "Pressure Cadence Guidance",
  pressureCadencePlaceholder:
    "Optional: explain how unresolved consequences may surface naturally without repeated nagging.",
});

function formatPolicyLabel(policy) {
  return String(policy || "").replaceAll("_", " ");
}

export function getStorylineOpenWorldSettingsViewProps({
  data = {},
  onChange = null,
} = {}) {
  const normalized = normalizeStorylineData(data);
  const openWorld = normalized.openWorld;

  function updateOpenWorld(field, value) {
    onChange?.({
      ...normalized,
      openWorld: {
        ...openWorld,
        [field]: value,
      },
    });
  }

  return {
    ...DEFAULT_COPY,
    defaultTransitionValue: openWorld.defaultTransitionPolicy,
    defaultTransitionOptions: STORYLINE_TRANSITION_POLICIES.filter(
      (policy) => policy !== "COMPLETE_STORYLINE"
    ).map((policy) => ({
      value: policy,
      label: formatPolicyLabel(policy),
    })),
    guidanceValue: openWorld.guidance,
    pressureCadenceValue: openWorld.pressureCadenceGuidance,
    onChangeDefaultTransition: (value) =>
      updateOpenWorld("defaultTransitionPolicy", value),
    onChangeGuidance: (value) => updateOpenWorld("guidance", value),
    onChangePressureCadence: (value) =>
      updateOpenWorld("pressureCadenceGuidance", value),
  };
}

export function useStorylineOpenWorldSettingsViewModel(props = {}) {
  return getStorylineOpenWorldSettingsViewProps(props);
}
