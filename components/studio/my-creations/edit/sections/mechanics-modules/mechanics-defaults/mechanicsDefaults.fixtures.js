export const MECHANICS_DEFAULTS_FIXTURES = Object.freeze([
  Object.freeze({
    id: "EMPTY",
    label: "Empty Defaults",
    defaults: Object.freeze({ flags: [], counters: [], stages: [] }),
  }),
  Object.freeze({
    id: "CURRENT",
    label: "Current Defaults",
    defaults: Object.freeze({
      futureDefaultsMetadata: Object.freeze({ retained: true }),
      flags: Object.freeze([
        Object.freeze({
          id: "feature_enabled",
          label: "Feature Enabled",
          initial: true,
          futureEntryMetadata: Object.freeze({ retained: true }),
        }),
      ]),
      counters: Object.freeze([
        Object.freeze({ id: "attempt_count", label: "Attempts", initial: 2 }),
      ]),
      stages: Object.freeze([
        Object.freeze({ id: "phase", label: "Phase", initial: "ready" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "LEGACY",
    label: "Legacy Aliases",
    defaults: Object.freeze({
      default_flags: Object.freeze([
        Object.freeze({ key: "legacy_flag", title: "Legacy Flag", value: "yes" }),
      ]),
      defaultCounters: Object.freeze([
        Object.freeze({ key: "legacy_counter", title: "Legacy Counter", value: "7" }),
      ]),
      default_stages: Object.freeze([
        Object.freeze({ key: "legacy_stage", title: "Legacy Stage", value: "active" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "MALFORMED",
    label: "Malformed but Recoverable",
    defaults: Object.freeze({
      flags: "invalid",
      counters: Object.freeze([
        Object.freeze({ id: "", label: "", initial: "not-a-number" }),
      ]),
      stages: Object.freeze([null]),
    }),
  }),
]);
