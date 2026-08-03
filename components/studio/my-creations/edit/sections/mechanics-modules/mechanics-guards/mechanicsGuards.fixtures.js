export const MECHANICS_GUARD_FIXTURES = Object.freeze([
  Object.freeze({
    id: "EMPTY",
    label: "Empty",
    guards: Object.freeze([]),
  }),
  Object.freeze({
    id: "CURRENT",
    label: "Current Guards",
    guards: Object.freeze([
      Object.freeze({
        id: "boundary_warning_lock",
        label: "Boundary Warning Lock",
        enforcement: "HARD_LOCK",
        mode: "ALL",
        conditions: Object.freeze([
          Object.freeze({
            conditionType: "COUNTER",
            id: "boundary_warning_count",
            field: "value",
            operator: "lt",
            value: 3,
            futureConditionMetadata: Object.freeze({ retained: true }),
          }),
          Object.freeze({
            conditionType: "FLAG",
            id: "safety_lock_enabled",
            field: "value",
            operator: "eq",
            value: true,
          }),
        ]),
        onFail: Object.freeze({
          summary: "Boundary warning limit reached.",
          composerGuidance: "Do not escalate the blocked scene.",
          futureFailMetadata: Object.freeze({ retained: true }),
        }),
        onPass: Object.freeze({
          summary: "Boundary warning count remains below the limit.",
          futurePassMetadata: Object.freeze({ retained: true }),
        }),
        composerVisibility: "SUMMARY_ONLY",
        publicVisibility: "HIDDEN",
        futureGuardMetadata: Object.freeze({ retained: true }),
      }),
      Object.freeze({
        id: "journey_guidance",
        label: "Journey Guidance",
        enforcement: "GUIDANCE",
        mode: "ANY",
        conditions: Object.freeze([
          Object.freeze({
            conditionType: "STAGE",
            id: "journey_phase",
            field: "value",
            operator: "eq",
            value: "approach",
          }),
          Object.freeze({
            conditionType: "METER",
            id: "domain_test_meter",
            field: "value",
            operator: "gte",
            value: 50,
          }),
        ]),
        onFail: Object.freeze({
          summary: "Journey guidance is unavailable.",
          composerGuidance: "Keep travel narration conservative.",
        }),
        onPass: Object.freeze({
          summary: "Journey guidance may be used.",
        }),
        composerVisibility: "FULL",
        publicVisibility: "SUMMARY_ONLY",
      }),
    ]),
  }),
  Object.freeze({
    id: "LEGACY",
    label: "Legacy Aliases",
    guards: Object.freeze([
      Object.freeze({
        key: "legacy_soft_guard",
        title: "Legacy Soft Guard",
        policy: "soft",
        condition_mode: "or",
        rules: Object.freeze([
          Object.freeze({
            type: "count",
            target_id: "legacy_counter",
            property: "value",
            comparison: ">=",
            threshold: "2",
            futureLegacyConditionMetadata: Object.freeze({ retained: true }),
          }),
          Object.freeze({
            condition_type: "bool",
            mechanics_id: "legacy_flag",
            op: "==",
            expected_value: "true",
          }),
        ]),
        on_fail: Object.freeze({
          message: "Legacy guard failed.",
          guidance: "Use legacy fallback guidance.",
        }),
        on_pass: Object.freeze({
          description: "Legacy guard passed.",
        }),
        composer_audience: "summary",
        public_audience: "public",
        futureLegacyGuardMetadata: Object.freeze({ retained: true }),
      }),
    ]),
  }),
  Object.freeze({
    id: "MALFORMED",
    label: "Malformed but Recoverable",
    guards: Object.freeze([
      null,
      Object.freeze({
        id: "",
        label: "",
        enforcement: "unknown",
        mode: "neither",
        conditions: "not-an-array",
        onFail: null,
        onPass: "not-an-object",
        composerVisibility: "visible-ish",
        publicVisibility: "secret",
      }),
    ]),
  }),
]);
