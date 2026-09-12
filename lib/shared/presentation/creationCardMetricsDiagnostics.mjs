import assert from "node:assert/strict";

import {
  buildCreationCardMetrics,
  buildLegacyCreationCardMetrics,
  formatCreationCardMetricCount,
  getCreationCardMetricProfile,
} from "./creationCardMetrics.js";

const formattingCases = new Map([
  [0, "0"],
  [999, "999"],
  [1000, "1k"],
  [1250, "1.3k"],
  [9949, "9.9k"],
  [9950, "10k"],
  [10000, "10k"],
  [999499, "999k"],
  [999500, "1M"],
  [1000000, "1M"],
  [1200000, "1.2M"],
  [10000000, "10M"],
  [1000000000, "1B"],
  [2400000000, "2.4B"],
]);

for (const [value, expected] of formattingCases) {
  assert.equal(formatCreationCardMetricCount(value), expected, `format ${value}`);
}

assert.deepEqual(getCreationCardMetricProfile("CHARACTER"), [
  "interactionCount",
  "likeCount",
  "externalCreationUseCount",
]);
assert.deepEqual(getCreationCardMetricProfile("LOCATION"), [
  "imageUseCount",
  "likeCount",
  "externalCreationUseCount",
]);
assert.deepEqual(getCreationCardMetricProfile("POSE"), [
  "imageUseCount",
  "likeCount",
]);
assert.deepEqual(getCreationCardMetricProfile("QUEST_REGISTRY"), [
  "storyUseCount",
  "likeCount",
  "externalCreationUseCount",
]);
assert.deepEqual(getCreationCardMetricProfile("LORE"), ["likeCount"]);

assert.deepEqual(
  buildCreationCardMetrics({
    creationType: "CHARACTER",
    usageMetrics: {
      interactionCount: 275,
      likeCount: 18,
      imageUseCount: 900,
      storyUseCount: 7,
      externalCreationUseCount: 43,
    },
  }),
  [
    { id: "interactionCount", label: "Messages", value: 275 },
    { id: "likeCount", label: "Likes", value: 18 },
    { id: "externalCreationUseCount", label: "Project uses", value: 43 },
  ]
);

assert.deepEqual(
  buildCreationCardMetrics({
    creationType: "OUTFIT",
    usageMetrics: {
      interactionCount: 0,
      likeCount: 5,
      imageUseCount: 1300,
      storyUseCount: 0,
      externalCreationUseCount: 9,
    },
  }),
  [
    { id: "imageUseCount", label: "Image uses", value: 1300 },
    { id: "likeCount", label: "Likes", value: 5 },
    { id: "externalCreationUseCount", label: "Project uses", value: 9 },
  ]
);

assert.deepEqual(
  buildLegacyCreationCardMetrics({ plays: 12, hearts: 3, saves: 999 }),
  [
    { id: "interactionCount", label: "Messages", value: 12 },
    { id: "likeCount", label: "Likes", value: 3 },
  ],
  "bookmark aggregate must not leak through legacy stats"
);

console.log("creationCardMetricsDiagnostics: PASS");
