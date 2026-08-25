export const storylineOpenWorldConfiguredFixture = Object.freeze({
  nodes: [],
  openWorld: {
    defaultTransitionPolicy: "OPTIONAL",
    guidance:
      "Keep the Old Crescent available for trade, workshop scenes, local rumors, and player-led investigation between authored nodes.",
    pressureCadenceGuidance:
      "Surface unresolved pressure occasionally through changed prices, guarded merchants, or altered workshop routines.",
  },
});

export const storylineOpenWorldDefaultFixture = Object.freeze({});

export const storylineOpenWorldLegacyFixture = Object.freeze({
  ordered_nodes: [],
  open_world: {
    default_transition_policy: "MANUAL",
    guidance: "Preserve the continuing chat between legacy Adventure nodes.",
    pressure_cadence_guidance:
      "Use consequences sparingly and only when supported by prior events.",
  },
});
