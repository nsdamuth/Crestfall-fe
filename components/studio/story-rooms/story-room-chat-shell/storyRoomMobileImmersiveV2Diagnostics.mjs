import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("mobile dock is suppressed by the StudioMobileNav binding only for active Story chats", () => {
  const shell = read("components/studio/StudioMobileNav.jsx");
  const view = read("components/studio/studio-mobile-nav/StudioMobileNav.view.jsx");
  const pathPolicy = read("components/studio/studio-shell/studioShellPathPolicy.js");

  assert.match(shell, /isStoryChatPath/);
  assert.match(pathPolicy, /story-rooms/);
  assert.match(pathPolicy, /v2/);
  assert.match(pathPolicy, /stories/);
  assert.match(shell, /showBottomDock=\{!isStoryChatPath\(pathname\)\}/);
  assert.match(view, /showBottomDock = true/);
  assert.match(view, /\{showBottomDock \? \(/);

  const studioShell = read("components/studio/StudioShell.jsx");
  const studioShellView = read("components/studio/studio-shell/StudioShell.view.jsx");
  assert.match(studioShell, /reserveMobileDockSpace: !isStoryChatPath\(pathname\)/);
  assert.match(studioShellView, /reserveMobileDockSpace \? "pb-24" : "pb-0"/);
});

test("Story chat runs flush and full height through the shell flush mode, not negative margins", () => {
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");
  const studioShell = read("components/studio/StudioShell.jsx");
  const studioShellView = read("components/studio/studio-shell/StudioShell.view.jsx");

  assert.match(view, /flex h-\[100dvh\] md:h-\[calc\(100dvh-var\(--topbar-h\)\)\] min-h-0 flex-col overflow-hidden/);
  assert.doesNotMatch(view, /-mx-\[var\(--space-5\)\]/);
  assert.doesNotMatch(view, /-mt-\[var\(--topbar-h\)\]/);
  assert.doesNotMatch(view, /sm:-mx-\[var\(--space-8\)\]/);
  assert.doesNotMatch(view, /xl:rounded-\[var\(--radius-lg\)\]/);
  assert.doesNotMatch(view, /xl:border/);
  assert.match(view, /cf-story-room-grid/);
  assert.match(view, /data-rails=\{railsState\}/);
  assert.match(studioShell, /flush: storyChat/);
  assert.match(studioShell, /hiddenBelowMd=\{storyChat\}/);
  assert.match(studioShellView, /flex min-h-0 flex-col overflow-hidden p-0/);
});

test("mobile composer replaces the dock in Story chat flow with safe-area clearance", () => {
  const shell = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");
  const composer = read("components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx");

  assert.doesNotMatch(composer, /fixed bottom-20 left-3 right-3/);
  assert.doesNotMatch(composer, /fixed bottom-0 left-0 right-0 z-50/);
  assert.match(composer, /relative z-50 shrink-0 bg-transparent/);
  assert.match(composer, /safe-area-inset-bottom/);
  assert.match(shell, /<div className="shrink-0">[\s\S]*ComposerComponent/);
  assert.doesNotMatch(shell, /9rem\+env\(safe-area-inset-bottom\)/);
});

test("transcript retains the accepted automatic newest-message scroll behavior", () => {
  const transcript = read("components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx");

  assert.match(transcript, /bottomRef/);
  assert.match(transcript, /scrollIntoView/);
  assert.match(transcript, /safeMessageItems\.length/);
});

test("mobile transcript no longer reserves legacy fixed-composer bottom clearance", () => {
  const transcript = read("components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx");

  assert.match(transcript, /p-5 scroll-smooth/);
  assert.doesNotMatch(transcript, /pb-\[4rem\]/);
  assert.doesNotMatch(transcript, /11\.5rem/);
  assert.doesNotMatch(transcript, /pb-\[18rem\]/);
});
