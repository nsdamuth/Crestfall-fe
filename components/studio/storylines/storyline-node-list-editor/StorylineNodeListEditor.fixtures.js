export const storylineNodeListReferenceFixture = Object.freeze({
  stories: [
    {
      id: "story-brasswhisker",
      title: "The Brasswhisker Mystery",
      subtitle:
        "A complete playable package centered on Kessa and a suspicious silver charm.",
    },
    {
      id: "story-old-crescent",
      title: "Old Crescent After Dark",
      subtitle:
        "An open-ended city story spanning workshops, bazaars, and hidden routes.",
    },
  ],
  scenarios: [
    {
      id: "scenario-market-pressure",
      title: "Market Pressure",
      subtitle:
        "A commercial conflict structure with competing merchants and escalating stakes.",
    },
    {
      id: "scenario-ledger",
      title: "Charm Ledger Scenario",
      subtitle:
        "A reusable mystery structure for purchases, dropped items, and memory lookup.",
    },
  ],
});

export const storylineNodeListConfiguredFixture = Object.freeze({
  nodes: [
    {
      id: "node-brasswhisker",
      order: 0,
      referenceType: "STORY",
      reference: {
        id: "story-brasswhisker",
        title: "The Brasswhisker Mystery",
        subtitle:
          "A complete playable package centered on Kessa and a suspicious silver charm.",
      },
      completionGuidance:
        "The silver charm is stabilized and the first reliable clue is identified.",
      transitionPolicy: "OPEN_WORLD_UNTIL_TRIGGER",
      triggerMode: "ANY",
      triggers: [
        {
          id: "trigger-market-pressure",
          type: "AI_SEMANTIC_TRIGGER",
          label: "Market pressure surfaces",
          description:
            "The player follows the appraisal trail into the Old Crescent market.",
        },
      ],
      openWorldGuidance:
        "Keep the workshop, nearby merchants, and player-led investigation available.",
      pressureGuidance:
        "Surface guarded merchants or changed prices without forcing travel.",
    },
    {
      id: "node-market-pressure",
      order: 1,
      referenceType: "SCENARIO",
      reference: {
        id: "scenario-market-pressure",
        title: "Market Pressure",
        subtitle:
          "A commercial conflict structure with competing merchants and escalating stakes.",
      },
      completionGuidance:
        "The market dispute reaches a stable outcome or exposes the next durable lead.",
      transitionPolicy: "COMPLETE_STORYLINE",
      triggerMode: "ANY",
      triggers: [],
      openWorldGuidance: "",
      pressureGuidance: "",
    },
  ],
  openWorld: {
    defaultTransitionPolicy: "OPEN_WORLD_UNTIL_TRIGGER",
    guidance: "Preserve the same chat between authored nodes.",
    pressureCadenceGuidance: "Use consequences sparingly.",
  },
});

export const storylineNodeListEmptyFixture = Object.freeze({
  nodes: [],
});

export const storylineNodeListLegacyFixture = Object.freeze({
  ordered_nodes: [
    {
      id: "legacy-node-ledger",
      order: 0,
      reference_type: "SCENARIO",
      reference: {
        id: "scenario-ledger",
        title: "Charm Ledger Scenario",
        subtitle:
          "A reusable mystery structure for purchases, dropped items, and memory lookup.",
      },
      completion_guidance: "The transaction reaches a stable stopping point.",
      transition_policy: "COMPLETE_STORYLINE",
      trigger_mode: "ANY",
      triggers: [],
      open_world_guidance: "",
      pressure_guidance: "",
    },
  ],
});
