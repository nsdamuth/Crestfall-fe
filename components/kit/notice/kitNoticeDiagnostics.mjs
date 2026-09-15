import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kitNoticeFixtures } from "./KitNotice.fixtures.js";
import {
  NOTICE_AUTO_CLEAR_MS,
  toNoticeTone,
  useKitNoticeViewModel,
} from "./useKitNoticeViewModel.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(currentDir, relativePath), "utf8");
}

test("tone folds to neutral or danger; anything else falls back to neutral", () => {
  assert.equal(toNoticeTone("neutral"), "neutral");
  assert.equal(toNoticeTone("danger"), "danger");
  assert.equal(toNoticeTone("warning"), "neutral");
  assert.equal(toNoticeTone(undefined), "neutral");
  assert.equal(toNoticeTone(null), "neutral");
});

test("the ViewModel normalizes message, tone, and the dismiss callback", () => {
  const vm = useKitNoticeViewModel({ message: "  Moved to Portraits.  ", tone: "danger", onDismiss: "not a fn" });
  assert.equal(vm.message, "Moved to Portraits.");
  assert.equal(vm.tone, "danger");
  assert.equal(vm.onDismiss, null);
});

test("the auto-clear window matches the share sheet's status timer (1600ms)", () => {
  // components/kit/share/useKitShareController.js:18, STATUS_RESET_MS.
  assert.equal(NOTICE_AUTO_CLEAR_MS, 1600);
});

test("every fixture matches the brief's three named states", () => {
  const ids = kitNoticeFixtures.map((fixture) => fixture.id);
  assert.deepEqual(ids, ["default", "long", "empty"]);
  const byId = Object.fromEntries(kitNoticeFixtures.map((fixture) => [fixture.id, fixture.props]));
  assert.ok(byId.default.message);
  assert.ok(byId.long.message.length > byId.default.message.length);
  assert.equal(byId.empty.message, "");
});

test("the View is stateless presentation with no fetch, and honors the width and token rules", () => {
  const view = read("KitNotice.view.jsx");
  assert.doesNotMatch(view, /useEffect|useState|fetch\(/);
  assert.doesNotMatch(view, /#[0-9a-fA-F]{3,6}|rgba?\(|text-xs|shadow-2xl/);
  assert.match(view, /role="status"/);
  assert.match(view, /max-w-\[/);
  assert.match(view, /mx-auto/);
  assert.match(view, /space-5/);
  assert.match(view, /control-md/);
});

test("the ViewModel file, not the View, owns the timer state", () => {
  const viewModel = read("useKitNoticeViewModel.js");
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /useEffect/);
});
