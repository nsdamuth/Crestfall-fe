import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { kitPanelToggleFixtures } from "./KitPanelToggle.fixtures.js";
import { toPanelToggleSide, useKitPanelToggleViewModel } from "./useKitPanelToggleViewModel.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(currentDir, relativePath), "utf8");
}

test("side folds to left or right; anything else falls back to left", () => {
  assert.equal(toPanelToggleSide("left"), "left");
  assert.equal(toPanelToggleSide("right"), "right");
  assert.equal(toPanelToggleSide("top"), "left");
  assert.equal(toPanelToggleSide(undefined), "left");
});

test("the ViewModel normalizes side and open", () => {
  assert.deepEqual(useKitPanelToggleViewModel({ side: "right", open: "yes" }), { side: "right", open: false });
  assert.deepEqual(useKitPanelToggleViewModel({ side: "right", open: true }), { side: "right", open: true });
  assert.deepEqual(useKitPanelToggleViewModel(), { side: "left", open: false });
});

test("the four named fixtures cover both sides open and closed", () => {
  const ids = kitPanelToggleFixtures.map((fixture) => fixture.id);
  assert.deepEqual(ids, ["left-closed", "left-open", "right-closed", "right-open"]);
});

test("the View carries no state and no fetch; only the glyph and the bare icon class", () => {
  const view = read("KitPanelToggle.view.jsx");
  assert.doesNotMatch(view, /useEffect|useState|fetch\(/);
  assert.match(view, /BARE_ICON_BUTTON_CLASS/);
  assert.match(view, /aria-hidden="true"/);
  assert.doesNotMatch(view, /<button/);
});

// The lift must not change what ships: this is the executable code
// (everything from BARE_ICON_BUTTON_CLASS on) of the original
// RailPanelGlyph.jsx as it stood before the lift, captured here
// since the old path is now the re-export shim this file also
// checks. The View matches it byte for byte apart from the default
// export's function name, which no consumer's import binding
// depends on.
const ORIGINAL_GLYPH_BODY = `export const BARE_ICON_BUTTON_CLASS =
  "grid h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation place-items-center rounded-[var(--radius-md)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--gold-action)] active:text-[var(--gold-deep)]";

export default function RailPanelGlyph({ side = "left", open = false }) {
  const turned = side === "right" ? open : !open;

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={\`transition-transform duration-[var(--dur-fast)] ease-[var(--ease)] \${
        turned ? "rotate-180" : "rotate-0"
      }\`}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}
`;

test("the lifted View is byte-identical to the original glyph, apart from its function name", () => {
  const lifted = read("KitPanelToggle.view.jsx");
  const liftedBody = lifted
    .slice(lifted.indexOf("export const BARE_ICON_BUTTON_CLASS"))
    .replace("KitPanelToggleView", "RailPanelGlyph");
  assert.equal(liftedBody, ORIGINAL_GLYPH_BODY);
});

test("the old path is a re-export shim, not a second copy of the glyph", () => {
  const shim = read("../../studio/story-rooms/story-room-chat-shell/RailPanelGlyph.jsx");
  assert.doesNotMatch(shim, /<svg/);
  assert.match(shim, /export \{ default, BARE_ICON_BUTTON_CLASS \} from/);
  assert.match(shim, /kit\/panel-toggle\/KitPanelToggle\.view/);
});
