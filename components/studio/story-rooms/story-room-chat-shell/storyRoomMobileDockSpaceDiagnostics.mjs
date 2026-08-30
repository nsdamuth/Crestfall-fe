import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Story chat route policy is shared by mobile-nav and Studio shell", () => {
  const mobileNav = read("components/studio/StudioMobileNav.jsx");
  const shell = read("components/studio/StudioShell.jsx");
  const policy = read("components/studio/studio-shell/studioShellPathPolicy.js");

  assert.match(policy, /story-rooms/);
  assert.match(policy, /v2\\\/stories/);
  assert.match(mobileNav, /isStoryChatPath/);
  assert.match(mobileNav, /showBottomDock=\{!isStoryChatPath\(pathname\)\}/);
  assert.match(shell, /usePathname/);
  assert.match(shell, /reserveMobileDockSpace: !isStoryChatPath\(pathname\)/);
});

test("Studio shell removes only mobile bottom-dock reservation for Story chat", () => {
  const view = read("components/studio/studio-shell/StudioShell.view.jsx");
  const vm = read("components/studio/studio-shell/useStudioShellViewModel.js");

  assert.match(view, /reserveMobileDockSpace = true/);
  assert.match(view, /reserveMobileDockSpace \? "pb-24" : "pb-0"/);
  assert.match(view, /lg:pb-\[var\(--space-8\)\]/);
  assert.match(vm, /reserveMobileDockSpace: reserveMobileDockSpace !== false/);
});

test("Story composer remains in-flow and owns safe-area clearance", () => {
  const composer = read("components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx");

  assert.match(composer, /relative z-50 shrink-0 bg-transparent/);
  assert.match(composer, /safe-area-inset-bottom/);
  assert.doesNotMatch(composer, /fixed bottom-0 left-0 right-0 z-50/);
});
