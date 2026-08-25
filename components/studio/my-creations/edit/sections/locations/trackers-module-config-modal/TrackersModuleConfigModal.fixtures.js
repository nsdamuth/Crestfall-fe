const selectOptions = (values) => values.map((value) => ({ value, label: value }));

const sampleTracker = {
  id: "trust",
  label: "Trust",
  kind: "TRUST",
  scope: "ROOM",
  value: 40,
  min: 0,
  max: 100,
  summary: "How much the room's NPCs currently trust the player.",
  visibility: "PRIVATE_TO_MIDDLEWARE",
  composerVisibility: "SUMMARY_ONLY",
  publicVisibility: "PHASE_ONLY",
  phases: [
    {
      id: "low",
      label: "Low",
      min: 0,
      max: 33,
      publicLabel: "Wary",
      composerGuidance: "NPCs are guarded and slow to share information.",
    },
    {
      id: "high",
      label: "High",
      min: 67,
      max: 100,
      publicLabel: "Trusted",
      composerGuidance: "NPCs speak freely and offer help unprompted.",
    },
  ],
  mutationHints: [
    {
      id: "kept_promise",
      eventTypes: ["PROMISE_KEPT"],
      reason: "The player followed through on a stated commitment.",
      effects: [
        {
          id: "effect_1",
          type: "METER_DELTA",
          targetId: "trust",
          delta: 10,
          amount: 10,
          value: "",
          reason: "",
        },
      ],
      constraints: {
        minConfidence: 0.6,
        maxApplicationsPerTurn: 1,
        maxApplicationsPerRoom: "",
        allowRepeat: true,
      },
    },
  ],
};

const sampleGuard = {
  id: "trusted_gate",
  label: "Trusted Access Gate",
  mode: "ALL",
  enforcement: "SOFT_LOCK",
  summary: "Blocks the vault door dialogue option until trust is high.",
  conditions: [
    {
      id: "trust",
      source: "meter",
      field: "value",
      operator: "gte",
      value: 67,
      summary: "",
    },
  ],
  onPass: { summary: "The vault door option is offered." },
  onFail: { summary: "The vault door option stays hidden." },
  composerVisibility: "SUMMARY_ONLY",
  publicVisibility: "HIDDEN",
};

export const trackersModuleConfigFilledFixture = Object.freeze({
  locationTitle: "Old Crescent Vault",
  eyebrow: "Location Runtime Module",
  title: "Configure Mechanics Fields, Effects & Guards",
  description:
    "Create abstract mechanics fields, event-driven effects, and guard rules for Old Crescent Vault.",
  message: "",
  messageTone: "success",
  hasUnsavedChanges: false,
  moduleId: "core.trackers.v1",
  form: {
    enabled: true,
    priority: "65",
    inheritanceMode: "INHERITABLE",
    trackers: [sampleTracker],
    guards: [sampleGuard],
  },
  trackerOptions: [{ value: "trust", label: "Trust" }],
  targetOptions: [
    { value: "trust", label: "Trust · meter" },
    { value: "trust", label: "trust · METER_DELTA" },
  ],
  percentByTrackerId: { trust: 40 },
});

export const trackersModuleConfigEmptyFixture = Object.freeze({
  ...trackersModuleConfigFilledFixture,
  locationTitle: "",
  description: "Create abstract mechanics fields, event-driven effects, and guard rules for this location.",
  form: {
    enabled: true,
    priority: "65",
    inheritanceMode: "INHERITABLE",
    trackers: [],
    guards: [],
  },
  trackerOptions: [],
  targetOptions: [],
  percentByTrackerId: {},
});

export const trackersModuleConfigErrorFixture = Object.freeze({
  ...trackersModuleConfigFilledFixture,
  message: "Mechanics module could not be saved.",
  messageTone: "error",
});

export { selectOptions };
