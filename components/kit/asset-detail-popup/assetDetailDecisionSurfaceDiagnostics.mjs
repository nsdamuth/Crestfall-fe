import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const view = read("components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx");
const vm = read("components/kit/asset-detail-popup/useKitAssetDetailPopupViewModel.js");
const contract = read("components/kit/asset-detail-popup/KitAssetDetailPopup.contract.js");
const community = read("app/studio/v2/community/CommunityV2Mockup.jsx");
const creatorProfile = read("app/studio/v2/creators/CreatorProfileLive.jsx");
const discoverySelection = read("lib/shared/presentation/creatorDiscoverySelection.js");

assert.match(contract, /2\.5\.0/);
assert.match(view, /function IdentitySubtitle/);
assert.match(view, /stripCreatorFromSubtitle/);
assert.doesNotMatch(view, /function CreatorLine/);
assert.match(view, /<MetricRow[\s\S]*className="self-end/);
assert.match(view, /View Full Catalogue/);
assert.match(view, /cf-btn cf-btn--secondary/);
assert.match(view, /function CreditsDisclosure/);
assert.match(view, /function MoreFromCreator/);
assert.match(view, /More from \$\{creator\.handle\}/);
assert.doesNotMatch(view, /MediaLibrary|Search media|MEDIA_TABS/);

assert.match(vm, /function normalizeRelatedItems/);
assert.match(vm, /moreFromCreator: normalizeRelatedItems\(moreFromCreator\)/);
assert.match(vm, /onOpenMoreFromCreator: toCallback\(onOpenMoreFromCreator\)/);

assert.match(discoverySelection, /function pickRandomCreatorDiscoveryItems/);
assert.match(discoverySelection, /random\s*=\s*Math\.random/);
assert.match(discoverySelection, /Number\(random\(\)\)/);
assert.match(community, /const moreFromCreatorSelection = useMemo/);
assert.match(community, /moreFromCreator=\{moreFromCreatorSelection\}/);
assert.match(community, /onOpenMoreFromCreator=\{\(creationId\) => setAssetDetailId\(creationId\)\}/);
assert.match(creatorProfile, /const moreFromCreatorSelection = useMemo/);
assert.match(creatorProfile, /moreFromCreator=\{moreFromCreatorSelection\}/);
assert.match(creatorProfile, /onOpenMoreFromCreator=\{\(creationId\) => setAssetDetailId\(creationId\)\}/);
assert.doesNotMatch(community, /\.filter\([\s\S]*?\.slice\(0, 4\)[\s\S]*?moreFromCreator/);
assert.doesNotMatch(creatorProfile, /works[\s\S]*?\.slice\(0, 4\)[\s\S]*?moreFromCreator/);

console.log("assetDetailDecisionSurfaceDiagnostics: PASS");
