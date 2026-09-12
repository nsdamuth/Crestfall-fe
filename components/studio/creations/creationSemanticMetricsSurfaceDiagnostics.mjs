import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

const [profilePage, profileVm, previewVm, popupVm, popupView, community, vault] =
  await Promise.all([
    read("components/studio/creations/CreationProfilePage.jsx"),
    read("components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"),
    read("components/studio/creations/creation-preview-modal/useCreationPreviewModalViewModel.js"),
    read("components/kit/asset-detail-popup/useKitAssetDetailPopupViewModel.js"),
    read("components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx"),
    read("app/studio/v2/community/CommunityV2Mockup.jsx"),
    read("app/studio/v2/vault/VaultV2Mockup.jsx"),
  ]);

assert.match(profileVm, /usageMetrics:\s*creation\.usageMetrics/);
assert.match(profileVm, /type:\s*normalizeText\(creation\.type\)/);
assert.match(profilePage, /creationType=\{creation\.type\}/);
assert.match(profilePage, /usageMetrics=\{creation\.usageMetrics\}/);

assert.match(previewVm, /creationType:\s*creation\.type/);
assert.match(previewVm, /usageMetrics:\s*creation\.usageMetrics/);

assert.match(popupVm, /buildCreationCardMetrics/);
assert.match(popupVm, /normalizeCreationCardMetricEntries/);
assert.match(popupView, /imageUseCount:\s*ImageIcon/);
assert.match(popupView, /storyUseCount:\s*BookOpen/);
assert.match(popupView, /externalCreationUseCount:\s*Network/);
assert.match(popupView, /formatCreationCardMetricCount/);
assert.doesNotMatch(popupView, /STAT_ORDER/);
assert.doesNotMatch(popupView, /saves:\s*Bookmark/);

assert.match(community, /metrics=\{creation\.metrics\}/);
assert.match(vault, /metrics=\{item\.metrics\}/);

console.log("creationSemanticMetricsSurfaceDiagnostics: PASS");
