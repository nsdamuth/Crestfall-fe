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

test("Profile Follow Shell is a thin LOOM binding", () => {
  const shell = read("components/studio/profile/ProfileFollowButton.jsx");

  assert.match(shell, /useProfileFollowButtonViewModel/);
  assert.match(shell, /<ProfileFollowButtonView \{\.\.\.viewProps\} \/>/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Profile Follow View remains portable", () => {
  const view = read(
    "components/studio/profile/profile-follow-button/ProfileFollowButton.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|useRouter|username|onFollowChange/
  );
  assert.match(view, /onToggleFollow/);
  assert.match(view, /isFollowing/);
  assert.match(view, /isSaving/);
});

test("Profile Follow ViewModel owns application behavior without JSX or fetch", () => {
  const viewModel = read(
    "components/studio/profile/profile-follow-button/useProfileFollowButtonViewModel.js"
  );

  assert.match(viewModel, /setProfileFollowByUsername/);
  assert.match(viewModel, /router\.refresh\(\)/);
  assert.match(viewModel, /onFollowChange\?\.\(data \|\| null\)/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Profile Follow client owns the existing username endpoint", () => {
  const client = read("lib/client/studio/profile/profileFollowClient.js");

  assert.match(client, /\/api\/profiles\/\$\{encodeURIComponent\(username\)\}\/follow/);
  assert.match(client, /active \? "POST" : "DELETE"/);
});

test("Profile Follow fixtures and contract cover the portable states", () => {
  const contract = read(
    "components/studio/profile/profile-follow-button/ProfileFollowButton.contract.js"
  );
  const fixtures = read(
    "components/studio/profile/profile-follow-button/ProfileFollowButton.fixtures.js"
  );

  assert.match(contract, /PROFILE_FOLLOW_BUTTON_VIEW_CONTRACT_VERSION/);
  assert.match(fixtures, /profileFollowButtonDefaultFixture/);
  assert.match(fixtures, /profileFollowButtonFollowingFixture/);
  assert.match(fixtures, /profileFollowButtonSavingFollowFixture/);
  assert.match(fixtures, /profileFollowButtonSavingUnfollowFixture/);
  assert.match(fixtures, /profileFollowButtonHiddenFixture/);
});

test("Profile Follow preview remains development-only", () => {
  const previewPage = read("app/dev/ui-preview/profile-follow-button/page.jsx");

  assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
  assert.match(previewPage, /notFound\(\)/);
});

test("Profile connections page retains the public Shell import", () => {
  const connectionsPage = read(
    "app/studio/profile/[username]/connections/page.js"
  );

  assert.match(
    connectionsPage,
    /import ProfileFollowButton from "@\/components\/studio\/profile\/ProfileFollowButton"/
  );
  assert.match(connectionsPage, /<ProfileFollowButton/);
});
