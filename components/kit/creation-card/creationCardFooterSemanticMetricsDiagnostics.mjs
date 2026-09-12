import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (relative) =>
  readFile(path.resolve(here, relative), "utf8");

const [
  view,
  vm,
  community,
  vault,
  creatorProfile,
  adventures,
  stories,
  home,
  legacyStatsView,
  legacyCardVm,
] = await Promise.all([
    read("./KitCreationCard.view.jsx"),
    read("./useKitCreationCardViewModel.js"),
    read("../../../lib/shared/presentation/communityPresentation.js"),
    read("../../../lib/shared/presentation/vaultPresentation.js"),
    read("../../../app/studio/v2/creators/CreatorProfileLive.jsx"),
    read("../../../app/studio/v2/adventures/AdventuresLive.jsx"),
    read("../../../app/studio/v2/stories/StoriesV2Live.jsx"),
    read("../../../app/studio/v2/home/home/useHomeViewModel.js"),
    read("../../studio/creations/creation-stats-row/CreationStatsRow.view.jsx"),
    read("../../studio/creations/creation-card/useCreationCardViewModel.js"),
  ]);

assert.match(view, /interactionCount:\s*MessageCircle/);
assert.match(view, /imageUseCount:\s*ImageIcon/);
assert.match(view, /storyUseCount:\s*BookOpen/);
assert.match(view, /externalCreationUseCount:\s*Network/);
assert.match(view, /formatCreationCardMetricCount/);
assert.doesNotMatch(view, /STAT_ORDER/);
assert.doesNotMatch(view, /saves:\s*Bookmark/);
assert.match(vm, /buildCreationCardMetrics/);
assert.doesNotMatch(vm, /stats\?\.saves/);

for (const source of [community, vault]) {
  assert.match(source, /buildCreationCardMetrics/);
  assert.match(source, /usageMetrics/);
  assert.match(source, /metrics:\s*buildCreationCardMetrics/);
}

assert.match(creatorProfile, /metrics:\s*item\.metrics/);
assert.match(adventures, /metrics:\s*item\.metrics/);
assert.match(stories, /metrics=\{item\.metrics\}/);
assert.match(home, /metrics:\s*item\.metrics/);

assert.match(legacyStatsView, /formatCreationCardMetricCount/);
assert.doesNotMatch(legacyStatsView, /toFixed\(1\).*k/);
assert.match(legacyCardVm, /usageMetrics:/);
assert.match(legacyCardVm, /creationType:/);

console.log("creationCardFooterSemanticMetricsDiagnostics: PASS");
