import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("FE capability proxy is authenticated and exposes only sanitized booleans", () => {
  const route = read("app/api/account/capabilities/route.js");

  assert.match(route, /getAuthenticatedUser/);
  assert.match(route, /path: "\/v1\/account\/capabilities"/);
  assert.match(route, /"x-crestfall-user-id": user\.id/);
  assert.match(route, /typeof capabilities\.chat !== "boolean"/);
  assert.match(route, /typeof capabilities\.imageGeneration !== "boolean"/);
  assert.match(route, /typeof capabilities\.videoGeneration !== "boolean"/);
  assert.doesNotMatch(route, /reason|setByUserId|audit|expiresAt/);
});

test("Studio Account Provider loads capability projection independently from profile state", () => {
  const client = read("lib/client/studio/profile/studioAccountClient.js");
  const provider = read(
    "components/studio/studio-account-provider/useStudioAccountProviderViewModel.js"
  );

  assert.match(client, /fetchStudioAccountCapabilities/);
  assert.match(client, /fetch\("\/api\/account\/capabilities"/);
  assert.match(provider, /fetchStudioAccountCapabilities/);
  assert.match(provider, /capabilityStatus/);
  assert.match(provider, /capabilityError/);
  assert.match(provider, /refreshCapabilities/);
  assert.match(provider, /setCapabilities\(nextCapabilities\)/);
});

test("Image Studio disables only generation when image capability is denied and gates Video preview by explicit allow", () => {
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );
  const composerVm = read(
    "components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel.js"
  );
  const composerView = read(
    "components/studio/image-studio/image-studio-composer/ImageStudioComposer.view.jsx"
  );

  assert.match(workbench, /capabilities\?\.imageGeneration !== false/);
  assert.match(workbench, /capabilities\?\.videoGeneration === true/);
  assert.match(workbench, /Image generation is not available for this account\./);
  assert.match(workbench, /imageGenerationAllowed/);
  assert.match(composerVm, /disabled: !videoGenerationAllowed/);
  assert.match(composerVm, /Video generation is not available for this account\./);
  assert.match(composerView, /disabled=\{Boolean\(option\.disabled\)\}/);
  assert.match(composerView, /disabled=\{!canGenerateImage\}/);
});

test("Story Chat capability disables authoring, Regenerate, and Continue but not Report", () => {
  const shell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");
  const shellVm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const composerVm = read(
    "components/studio/story-rooms/story-room-composer/useStoryRoomComposerViewModel.js"
  );
  const transcriptVm = read(
    "components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel.js"
  );
  const messageView = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );

  assert.match(shell, /useStudioAccount/);
  assert.match(shellVm, /Chat is not available for this account\./);
  assert.match(shellVm, /if \(!chatAllowed \|\|/);
  assert.match(shellVm, /disabled: loading \|\| Boolean\(error\) \|\| !chatAllowed/);
  assert.match(shellVm, /chatGenerationAllowed: chatAllowed/);
  assert.match(composerVm, /disabledReason/);
  assert.match(transcriptVm, /regenerateDisabled: !chatGenerationAllowed/);
  assert.match(transcriptVm, /continueDisabled: !chatGenerationAllowed/);
  assert.doesNotMatch(transcriptVm, /canReport\s*=\s*[^;]*chatGenerationAllowed/);
  assert.match(messageView, /regenerateDisabled \|\|/);
  assert.match(messageView, /continueDisabled \|\|/);
  assert.match(messageView, /canReport && typeof onReport === "function"/);
});

test("capability presentation stays presentation-only and does not replace Services authority", () => {
  const imageClient = read(
    "lib/client/studio/image-studio/imageStudioClient.js"
  );
  const storyClient = read(
    "lib/client/studio/story-rooms/storyRoomClient.js"
  );

  assert.match(imageClient, /\/api\/studio\/image-generation\/jobs/);
  assert.match(storyClient, /\/api\/studio\/story-rooms\//);
  assert.doesNotMatch(imageClient, /user_access_controls|set_user_access_control/);
  assert.doesNotMatch(storyClient, /user_access_controls|set_user_access_control/);
});
