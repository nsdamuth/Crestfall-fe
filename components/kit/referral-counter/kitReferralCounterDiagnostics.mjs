import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kitReferralCounterFixtures } from "./KitReferralCounter.fixtures.js";
import {
  REFERRAL_COUNTER_COPY,
  formatReferralCount,
  toReferralCreditedCount,
} from "./useKitReferralCounterViewModel.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(currentDir, relativePath), "utf8");
}

test("zero, a served count, and a missing field each fold to a display-ready count", () => {
  const byId = Object.fromEntries(kitReferralCounterFixtures.map((fixture) => [fixture.id, fixture.props]));
  assert.equal(toReferralCreditedCount(byId.zero.referral), 0);
  assert.equal(toReferralCreditedCount(byId.served.referral), 12);
  assert.equal(toReferralCreditedCount(byId.missing.referral), 0);
  assert.equal(formatReferralCount(byId.longest.referral.creditedCount), "1,284");
});

test("a malformed field never hides the row and never goes negative", () => {
  assert.equal(toReferralCreditedCount(null), 0);
  assert.equal(toReferralCreditedCount({ creditedCount: null }), 0);
  assert.equal(toReferralCreditedCount({ creditedCount: "7" }), 7);
  assert.equal(toReferralCreditedCount({ credited_count: 3 }), 3);
  assert.equal(toReferralCreditedCount({ creditedCount: -2 }), 0);
  assert.equal(toReferralCreditedCount({ creditedCount: 2.9 }), 2);
});

test("the copy carries no coin number and the View is stateless presentation", () => {
  assert.equal(REFERRAL_COUNTER_COPY.label, "Referral bonus");
  assert.doesNotMatch(REFERRAL_COUNTER_COPY.tipText, /\d/);
  const view = read("KitReferralCounter.view.jsx");
  assert.doesNotMatch(view, /useEffect|fetch\(|navigator\.|window\.|href=/);
  assert.match(view, /InfoTip/);
});

// Follow-up 2, item 4: one left-aligned line, label then number then tip.
test("the row reads label, number, tip left to right with nothing right-justified", () => {
  const view = read("KitReferralCounter.view.jsx");
  assert.doesNotMatch(view, /justify-between|justify-end|ml-auto/);
  assert.match(view, /justify-start/);
  const labelAt = view.indexOf("{label}");
  const countAt = view.indexOf("{count}");
  const tipAt = view.indexOf("<InfoTip");
  assert.ok(labelAt > -1 && labelAt < countAt && countAt < tipAt);
  assert.match(view, /gap-\[var\(--space-2\)\]/);
  assert.match(view, /text-\[length:var\(--text-body\)\][^"]*text-\[var\(--ink\)\]/);
  assert.equal(formatReferralCount(1284000), "1,284,000");
});
