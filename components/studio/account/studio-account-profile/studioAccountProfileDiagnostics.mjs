import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const featureDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(featureDirectory, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

test("Studio Account Profile Shell remains a LOOM binding", () => {
  const shell = read("components/studio/account/StudioAccountProfile.jsx");

  assert.match(shell, /useStudioAccountProfileViewModel/);
  assert.match(shell, /<StudioAccountProfileView/);
  assert.match(shell, /<ProfileMediaManager/);
  assert.match(shell, /<StudioAccountMetrics/);
  assert.match(shell, /<DefaultPlayerCharacterPickerModal/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useEffect/);
});

test("Studio Account Profile View is API and persistence free", () => {
  const view = read(
    "components/studio/account/studio-account-profile/StudioAccountProfile.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase\/server|PostGraphile|studioAccountClient|display_name|contact_email|default_player_character_id/
  );
  assert.doesNotMatch(
    view,
    /ProfileMediaManager|StudioAccountMetrics|DefaultPlayerCharacterPickerModal/
  );
  assert.match(view, /profileMediaContent/);
  assert.match(view, /accountMetricsContent/);
});

test("Studio Account Profile ViewModel owns normalization and mutation", () => {
  const viewModel = read(
    "components/studio/account/studio-account-profile/useStudioAccountProfileViewModel.js"
  );

  assert.match(viewModel, /fetchCurrentStudioAccount/);
  assert.match(viewModel, /updateCurrentStudioAccount/);
  assert.match(viewModel, /formToUpdatePayload/);
  assert.match(viewModel, /content_rating_preference/);
  assert.match(viewModel, /default_player_character_id/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Studio account client owns GET and PATCH profile requests", () => {
  const client = read("lib/client/studio/profile/studioAccountClient.js");

  assert.match(client, /fetchCurrentStudioAccount/);
  assert.match(client, /updateCurrentStudioAccount/);
  assert.match(client, /method: "PATCH"/);
  assert.match(client, /JSON\.stringify\(updates\)/);
});

test("Studio Account Profile contract and fixtures cover key states", () => {
  const contract = read(
    "components/studio/account/studio-account-profile/StudioAccountProfile.contract.js"
  );
  const fixtures = read(
    "components/studio/account/studio-account-profile/StudioAccountProfile.fixtures.js"
  );

  assert.match(contract, /STUDIO_ACCOUNT_PROFILE_VIEW_CONTRACT_VERSION/);
  assert.match(fixtures, /studioAccountProfileDefaultFixture/);
  assert.match(fixtures, /studioAccountProfileLoadingFixture/);
  assert.match(fixtures, /studioAccountProfileLoadErrorFixture/);
  assert.match(fixtures, /studioAccountProfileNoUsernameFixture/);
  assert.match(fixtures, /studioAccountProfileNoDefaultPcFixture/);
  assert.match(fixtures, /studioAccountProfileContentNoticeFixture/);
});

test("Studio Account Profile preview is development-only", () => {
  const page = read("app/dev/ui-preview/studio-account-profile/page.jsx");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Account page retains the public StudioAccountProfile Shell", () => {
  const page = read("app/studio/account/page.js");

  assert.match(
    page,
    /import StudioAccountProfile from "@\/components\/studio\/account\/StudioAccountProfile"/
  );
  assert.match(page, /<StudioAccountProfile \/>/);
});
