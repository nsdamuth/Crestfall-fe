export const MECHANICS_STATUS_BLOCK_FIXTURES = Object.freeze([
  Object.freeze({
    id: "EMPTY",
    label: "Empty",
    statusBlocks: Object.freeze([]),
  }),
  Object.freeze({
    id: "CURRENT",
    label: "Current Blocks",
    statusBlocks: Object.freeze([
      Object.freeze({
        id: "relationship_footer",
        slot: "main_footer",
        label: "Relationship Footer",
        placement: "response_end",
        required: true,
        visibility: "public",
        lines: Object.freeze([
          "[❤️ Affection: {{trackers.affection.value}}/100]",
          "[Phase: {{trackers.affection.phaseLabel}}]",
        ]),
        futureStatusMetadata: Object.freeze({ retained: true }),
      }),
      Object.freeze({
        id: "private_notes",
        slot: "private_footer",
        label: "Private Notes",
        placement: "response_start",
        required: false,
        visibility: "private",
        lines: Object.freeze(["[Internal: {{defaults.stages.current_perspective}}]" ]),
      }),
    ]),
  }),
  Object.freeze({
    id: "LEGACY",
    label: "Legacy Aliases",
    statusBlocks: Object.freeze([
      Object.freeze({
        key: "legacy_footer",
        title: "Legacy Footer",
        slot_id: "legacy_slot",
        position: "footer",
        is_required: "yes",
        audience: "PUBLIC",
        template: "[Legacy: {{counters.legacy.value}}]",
        futureLegacyMetadata: Object.freeze({ retained: true }),
      }),
      Object.freeze({
        block_id: "legacy_header",
        name: "Legacy Header",
        rendered_lines: Object.freeze(["Header line", "Second line"]),
        placement: "start",
        visibility: "hidden",
      }),
    ]),
  }),
  Object.freeze({
    id: "MALFORMED",
    label: "Malformed but Recoverable",
    statusBlocks: Object.freeze([
      null,
      Object.freeze({
        id: "",
        label: "",
        placement: "sideways",
        visibility: "secret",
        required: "not-a-boolean",
        lines: "not-an-array",
      }),
    ]),
  }),
]);
