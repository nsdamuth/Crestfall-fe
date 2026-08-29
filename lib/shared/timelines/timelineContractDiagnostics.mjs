import assert from "node:assert/strict";
import {
  TIMELINE_CONTRACT_VERSION,
  normalizeTimelineDefinition,
  sortTimelineEntries,
  validateTimelineDefinition,
} from "./timelineContract.js";

const loreA = {
  id: "11111111-1111-4111-8111-111111111111",
  type: "LORE",
  data: { lore_document: { timelineOrder: -100, displayDate: "First Age" } },
};
const loreB = {
  id: "22222222-2222-4222-8222-222222222222",
  type: "LORE",
  data: { lore_document: { timelineOrder: 50, displayDate: "Year 50" } },
};
const loreUndated = {
  id: "33333333-3333-4333-8333-333333333333",
  type: "LORE",
  data: { lore_document: { timelineOrder: null, displayDate: "After the Sundering" } },
};
const loreById = new Map([
  [loreA.id, loreA],
  [loreB.id, loreB],
  [loreUndated.id, loreUndated],
]);

const definition = normalizeTimelineDefinition({
  public_enabled: true,
  sort_direction: "ASC",
  group_by_era: true,
  entries: [
    { lore_creation_id: loreB.id },
    { lore_creation_id: loreUndated.id },
    { lore_creation_id: loreA.id, order_override: -200 },
  ],
});

assert.equal(definition.contractVersion, TIMELINE_CONTRACT_VERSION);
assert.equal(definition.publicEnabled, true);
assert.deepEqual(
  sortTimelineEntries({ entries: definition.entries, loreById }).map(
    (entry) => entry.loreCreationId
  ),
  [loreA.id, loreB.id, loreUndated.id]
);
assert.equal(
  loreUndated.data.lore_document.displayDate,
  "After the Sundering",
  "free-form display dates are never parsed into chronology"
);

const duplicate = validateTimelineDefinition({
  entries: [
    { loreCreationId: loreA.id },
    { loreCreationId: loreA.id },
  ],
});
assert.equal(
  duplicate.errors.some((error) => error.code === "TIMELINE_LORE_REFERENCE_DUPLICATE"),
  true
);

const invalidOrder = validateTimelineDefinition({
  entries: [{ loreCreationId: loreA.id, orderOverride: "not-a-number" }],
});
assert.equal(
  invalidOrder.errors.some((error) => error.code === "TIMELINE_ORDER_OVERRIDE_INVALID"),
  true
);

console.log("Timeline contract diagnostics passed.");
