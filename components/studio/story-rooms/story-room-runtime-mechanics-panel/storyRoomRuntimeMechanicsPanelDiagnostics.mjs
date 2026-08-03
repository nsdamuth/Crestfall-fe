import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Runtime Mechanics shell stays thin and owns the application picker", () => {
  const shell = read(
    "components/studio/story-rooms/StoryRoomRuntimeMechanicsPanel.jsx"
  );

  assert.match(shell, /MechanicsModulePickerModal/);
  assert.match(shell, /useStoryRoomRuntimeMechanicsPanelViewModel/);
  assert.match(shell, /StoryRoomRuntimeMechanicsPanelView/);
  assert.match(shell, /pickerContent/);
  assert.doesNotMatch(
    shell,
    /upsertStoryRoomEngineModuleBinding|deleteStoryRoomEngineModuleBinding|useState|engine_module_bindings/
  );
});

test("ViewModel owns Story Room mutations, refresh, and operation status", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/useStoryRoomRuntimeMechanicsPanelViewModel.js"
  );

  assert.match(viewModel, /upsertStoryRoomEngineModuleBinding/);
  assert.match(viewModel, /deleteStoryRoomEngineModuleBinding/);
  assert.match(viewModel, /Runtime mechanics saved\./);
  assert.match(viewModel, /Runtime mechanics removed\./);
  assert.match(viewModel, /Story runtime mechanics could not be saved\./);
  assert.match(viewModel, /Story runtime mechanics could not be removed\./);
  assert.match(viewModel, /await onUpdated\(\)/);
  assert.doesNotMatch(viewModel, /<div|<button|MechanicsModulePickerModal/);
});

test("binding discovery preserves current raw-room and legacy field compatibility", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/useStoryRoomRuntimeMechanicsPanelViewModel.js"
  );

  assert.match(viewModel, /room\?\.rawRoom\?\.data \|\| room\?\.data/);
  assert.match(viewModel, /data\.engine_module_bindings/);
  assert.match(viewModel, /data\.engineModuleBindings/);
  assert.match(viewModel, /mechanics_module_creation_id/);
  assert.match(viewModel, /module_instance_id/);
  assert.match(viewModel, /target_creation_id/);
  assert.match(viewModel, /role === MECHANICS_MODULE_ROLE/);
  assert.match(viewModel, /sourceType === MECHANICS_MODULE_CREATION_TYPE/);
});

test("attached binding payload preserves runtime ownership and trigger fields", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/useStoryRoomRuntimeMechanicsPanelViewModel.js"
  );

  assert.match(viewModel, /TRACKERS_MODULE_ID = "core\.trackers\.v1"/);
  assert.match(viewModel, /moduleSourceType: MECHANICS_MODULE_CREATION_TYPE/);
  assert.match(viewModel, /mechanicsModuleCreationId: moduleCreation\.id/);
  assert.match(viewModel, /moduleInstanceId: moduleCreation\.id/);
  assert.match(viewModel, /role: MECHANICS_MODULE_ROLE/);
  assert.match(viewModel, /inheritanceMode: "LOCAL_ONLY"/);
  assert.match(viewModel, /mechanicsScopeMode: "STORY_ROOM"/);
  assert.match(viewModel, /ownerType: "STORY_ROOM"/);
  assert.match(viewModel, /ownerSource: "story_room_binding"/);
  assert.match(viewModel, /chatTurnDefault: "get_tracker_context"/);
  assert.match(viewModel, /contractVersion:/);
  assert.match(viewModel, /tags: normalizeArray\(data\.tags\)/);
});

test("portable View renders controls from display-ready state only", () => {
  const view = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.view.jsx"
  );

  assert.match(view, /binding\.enabled/);
  assert.match(view, /binding\.scopeMode/);
  assert.match(view, /binding\.priority/);
  assert.match(view, /onOpenPicker/);
  assert.match(view, /onRemove/);
  assert.match(view, /onToggleEnabled/);
  assert.match(view, /onChangeScopeMode/);
  assert.match(view, /onChangePriority/);
  assert.match(view, /pickerContent/);
  assert.doesNotMatch(
    view,
    /storyRoomClient|MechanicsModulePickerModal|engine_module_bindings|moduleCreation/
  );
});

test("Story Room Chat mounts Runtime Mechanics in desktop and mobile state surfaces", () => {
  const chatShell = read(
    "components/studio/story-rooms/StoryRoomChatShell.jsx"
  );
  const chatViewModel = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const chatView = read(
    "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx"
  );

  assert.match(chatShell, /import StoryRoomRuntimeMechanicsPanel/);
  assert.match(
    chatShell,
    /RuntimeMechanicsPanelComponent=\{StoryRoomRuntimeMechanicsPanel\}/
  );
  assert.equal(
    (chatView.match(/<RuntimeMechanicsPanelComponent/g) || []).length,
    2
  );
  assert.match(chatViewModel, /onUpdated: reloadStoryRoom/);
  assert.match(chatView, /mobilePanel === "state"/);
  assert.match(chatViewModel, /onClose: \(\) => setRightOpen\(false\)/);
});

test("contract, fixtures, and protected preview cover representative states", () => {
  const contract = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.contract.js"
  );
  const fixtures = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.fixtures.js"
  );
  const page = read(
    "app/dev/ui-preview/story-room-runtime-mechanics-panel/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanelPreviewClient.jsx"
  );

  assert.match(
    contract,
    /STORY_ROOM_RUNTIME_MECHANICS_PANEL_VIEW_CONTRACT_VERSION/
  );
  assert.match(contract, /ownsMechanicsModulePicker: "Binding Shell"/);
  assert.match(contract, /ownsStoryRoomClientMutations: "ViewModel"/);
  assert.match(contract, /ownsCoreMechanicsModuleAbstraction: "Deferred Mechanics work"/);
  assert.match(fixtures, /storyRoomRuntimeMechanicsEmptyFixture/);
  assert.match(fixtures, /storyRoomRuntimeMechanicsAttachedFixture/);
  assert.match(fixtures, /storyRoomRuntimeMechanicsBindingOwnerFixture/);
  assert.match(fixtures, /storyRoomRuntimeMechanicsSavingFixture/);
  assert.match(fixtures, /storyRoomRuntimeMechanicsSavedFixture/);
  assert.match(fixtures, /storyRoomRuntimeMechanicsErrorFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StoryRoomRuntimeMechanicsPanelView/);
  assert.match(preview, /PreviewPicker/);
});

test("documentation and package script preserve scope and Mechanics deferral", () => {
  const readme = read(
    "components/studio/story-rooms/story-room-runtime-mechanics-panel/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /ViewModel \/ Chassis/);
  assert.match(readme, /portable \*\*Skin\*\*/);
  assert.match(readme, /engine_module_bindings/);
  assert.match(readme, /get_tracker_context/);
  assert.match(readme, /desktop right rail/);
  assert.match(readme, /mobile Chronicle State drawer/);
  assert.match(readme, /does not abstract or decompose the deferred core\s+Mechanics Module/);
  assert.match(readme, /\/dev\/ui-preview\/story-room-runtime-mechanics-panel/);
  assert.match(
    packageJson,
    /diagnostics:loom:story-room-runtime-mechanics-panel/
  );
});
