export const storylinesHubLoadedFixture = Object.freeze({
  storylines: [
    {
      id: "storyline-aethelgard-arrival",
      title: "Aethelgard Arrival",
      description:
        "A continuity path connecting the market arrival, workshop mystery, and first open-world interlude.",
      data: {
        nodes: [
          { id: "node-1", type: "STORY" },
          { id: "node-2", type: "SCENARIO" },
          { id: "node-3", type: "STORY" },
        ],
      },
    },
    {
      id: "storyline-old-crescent",
      title: "Old Crescent Threads",
      description: "Optional investigations that can surface between major beats.",
      data: {
        ordered_nodes: [{ id: "node-legacy", type: "SCENARIO" }],
      },
    },
  ],
  status: "loaded",
  error: "",
});

export const storylinesHubEmptyFixture = Object.freeze({
  storylines: [],
  status: "loaded",
  error: "",
});

export const storylinesHubLoadingFixture = Object.freeze({
  storylines: [],
  status: "loading",
  error: "",
});

export const storylinesHubErrorFixture = Object.freeze({
  storylines: [],
  status: "error",
  error: "Storylines could not be loaded.",
});
