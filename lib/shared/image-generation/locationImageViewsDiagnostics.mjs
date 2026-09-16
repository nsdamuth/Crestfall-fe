import assert from "node:assert/strict";

import {
  createLocationCustomImageViewId,
  findLocationCustomImageView,
  getLocationCustomViewIdFromMode,
  normalizeLocationCustomImageViews,
  toLocationCustomViewMode,
} from "./locationImageViews.js";

const normalized = normalizeLocationCustomImageViews([
  {
    id: "grand-palace",
    label: "Grand Palace Courtyard",
    prompt: "white marble royal courtyard",
    negative_prompt: "no modern elements",
  },
  {
    id: "grand-palace",
    label: "Duplicate ignored",
    prompt: "ignored",
  },
]);

assert.equal(normalized.length, 1);
assert.equal(normalized[0].label, "Grand Palace Courtyard");
assert.equal(findLocationCustomImageView(normalized, "grand-palace")?.prompt, "white marble royal courtyard");
assert.equal(toLocationCustomViewMode("grand-palace"), "CUSTOM:grand-palace");
assert.equal(getLocationCustomViewIdFromMode("CUSTOM:grand-palace"), "grand-palace");
assert.equal(
  createLocationCustomImageViewId("Grand Palace", normalized),
  "grand-palace-2"
);

console.log(JSON.stringify({
  diagnostic: "location_image_views_v1",
  status: "PASSED",
  stableIds: true,
  duplicateIdsRejected: true,
  customModeRoundTrip: true,
}, null, 2));
