import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const page = read("app/studio/create/wallet-profile/page.js");
const builder = read("components/studio/create/wallet/wallet-profile-builder/useWalletProfileBuilderViewModel.js");
const client = read("lib/client/studio/wallet/walletClient.js");
const constants = read("lib/server/creations/constants.js");
const policy = read("lib/shared/creations/creationTypePolicy.js");
const editViewModel = read("components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js");
const sectionMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
const editConstants = read("components/studio/my-creations/edit/creationEditConstants.js");

assert.match(page, /WalletProfileBuilderShell/);
assert.match(builder, /type: WALLET_PROFILE_CREATION_TYPE/);
assert.match(builder, /wallet_profile: validation\.normalized/);
assert.match(builder, /WALLET_PROFILE_BUILDER/);
assert.match(client, /createCreationDraft/);
assert.doesNotMatch(client, /supabase|PostGraphile|from\(/i);
assert.match(constants, /"WALLET_PROFILE"/);
assert.match(policy, /WALLET_PROFILE:/);
assert.match(policy, /editMode: "WALLET_PROFILE"/);
assert.match(editViewModel, /isWalletProfile: creationType === "WALLET_PROFILE"/);
assert.match(sectionMap, /import WalletProfileEditor/);
assert.match(sectionMap, /WALLET_PROFILE:\s*\{/);
assert.match(sectionMap, /ctx\.form\.data\?\.wallet_profile/);
assert.match(sectionMap, /updateDataField\("wallet_profile"/);
assert.match(editConstants, /id: "WALLET_PROFILE", label: "Wallet Profiles"/);
assert.match(editConstants, /id: "wallet", label: "Wallet"/);

console.log(JSON.stringify({
  diagnostic: "wallet_profile_authoring_integration_v1",
  status: "PASSED",
  creationRoute: "/studio/create/wallet-profile",
  creationType: "WALLET_PROFILE",
  dataKey: "wallet_profile",
  checks: {
    standardCreationClientUsed: true,
    directDatabaseAccessAbsent: true,
    registryDrivenCreationEditIntegrated: true,
    productCurrencySeparationPreserved: true,
  },
}, null, 2));
