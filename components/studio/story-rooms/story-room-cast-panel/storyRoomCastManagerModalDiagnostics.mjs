import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const view = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx");
const viewModel = read("components/studio/story-rooms/story-room-cast-panel/useStoryRoomCastPanelViewModel.js");
const contract = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.contract.js");

assert.match(contract, /STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION = "1\.2\.0"/);
for (const prop of ["manageCastOpen", "onOpenManageCast", "onCloseManageCast"]) {
  assert.match(contract, new RegExp(`@property .*${prop}`));
}

assert.match(view, />\s*Manage Cast\s*</);
assert.match(view, /aria-haspopup="dialog"/);
assert.match(view, /role="dialog"/);
assert.match(view, /aria-modal="true"/);
assert.match(view, /Registry NPCs/);
assert.match(view, /Quick Add/);
assert.match(view, /<StoryRoomNpcParticipantManagerView \{\.\.\.npcParticipantManager\} \/>/);
assert.match(view, /onLoadRandomLiked\?\.\(\)/);
assert.match(view, /safeRandomLikedAction\.busy/);
assert.match(view, /randomLikedError/);

const railStart = view.indexOf('<div className="mt-6 grid gap-3">');
const modalStart = view.indexOf('function ManageCastModal');
assert.ok(railStart >= 0 && modalStart > railStart);
const railSource = view.slice(railStart, modalStart);
assert.doesNotMatch(railSource, /StoryRoomNpcParticipantManagerView/);
assert.doesNotMatch(railSource, /safeRandomLikedAction\.busy/);

assert.match(viewModel, /const \[manageCastOpen, setManageCastOpen\] = useState\(false\)/);
assert.match(viewModel, /const onOpenManageCast = useCallback/);
assert.match(viewModel, /if \(!npcParticipantManager\?\.isOpen\)/);
assert.match(viewModel, /npcParticipantManager\?\.onTogglePanel\?\.\(\)/);
assert.match(viewModel, /const onCloseManageCast = useCallback/);
assert.match(viewModel, /manageCastOpen,/);
assert.match(viewModel, /onOpenManageCast,/);
assert.match(viewModel, /onCloseManageCast,/);

for (const source of [view, viewModel]) {
  assert.doesNotMatch(source, /\bfetch\s*\(|crestfallApiRequest|postgraphile|supabase/i);
}

console.log("Story Room Manage Cast modal diagnostics passed.");
