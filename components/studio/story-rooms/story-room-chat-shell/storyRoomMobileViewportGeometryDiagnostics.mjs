import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Story chat height subtracts the authoritative top-bar height at md and up", () => {
  const theme = read("app/theme.css");
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");

  assert.match(theme, /--topbar-h:\s*calc\(var\(--control-md\) \+ var\(--space-3\) \* 2 \+ 1px\)/);
  assert.match(view, /md:h-\[calc\(100dvh-var\(--topbar-h\)\)\]/);
  assert.doesNotMatch(view, /-mt-\[var\(--topbar-h\)\]/);
  assert.doesNotMatch(view, /-mt-\[var\(--space-20\)\]/);
});

test("mobile Story chat claims the full dynamic viewport under its own bar and never scrolls the page", () => {
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");
  const designSystem = read("app/design-system.css");

  assert.match(view, /flex h-\[100dvh\] md:h-\[calc\(100dvh-var\(--topbar-h\)\)\] min-h-0 flex-col overflow-hidden/);
  assert.doesNotMatch(view, /h-\[calc\(100dvh-var\(--space-20\)\)\]/);
  assert.doesNotMatch(view, /lg:h-\[calc\(100dvh-5rem\)\]/);
  assert.doesNotMatch(view, /xl:h-\[calc\(100vh-7rem\)\]/);
  assert.match(designSystem, /\[data-studio-top-bar-hidden-below-md\]/);
  assert.match(designSystem, /\.cf-story-room-grid\[data-rails="both"\]/);
});
