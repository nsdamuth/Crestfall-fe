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

test("Creation Card Shell is a thin LOOM binding", () => {
  const shell = read("components/studio/creations/CreationCard.jsx");

  assert.match(shell, /useCreationCardViewModel/);
  assert.match(shell, /import Link from ["\']next\/link["\']/);
  assert.match(
    shell,
    /<CreationCardView \{\.\.\.cardViewProps\} LinkComponent=\{Link\} \/>/
  );
  assert.match(shell, /<CreationPreviewModal \{\.\.\.previewModalProps\} \/>/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Creation Card View remains portable and composes child Views", () => {
  const view = read(
    "components/studio/creations/creation-card/CreationCard.view.jsx"
  );

  assert.match(view, /CreationStatusBadgesView/);
  assert.match(view, /CreationStatsRowView/);
  assert.match(view, /onOpenPreview/);
  assert.match(view, /onStartChat/);
  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|useRouter|next\/link|raw creation|CreationPreviewModal|CreationStatusBadges"|CreationStatsRow"/
  );
});

test("Creation Card ViewModel owns application behavior without JSX or fetch", () => {
  const viewModel = read(
    "components/studio/creations/creation-card/useCreationCardViewModel.js"
  );

  assert.match(viewModel, /fetchCreationPreview/);
  assert.match(viewModel, /startStoryFromCreation/);
  assert.match(viewModel, /setDefaultPlayerCharacter/);
  assert.match(viewModel, /buildModalCreationFromPreviewGraph/);
  assert.match(viewModel, /useCreationStatusBadgesViewModel/);
  assert.match(viewModel, /useCreationStatsRowViewModel/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Creation client owns the preview endpoint", () => {
  const client = read("lib/client/studio/creations/creationClient.js");

  assert.match(client, /export async function fetchCreationPreview/);
  assert.match(
    client,
    /\/api\/creations\/\$\{encodeURIComponent\(creationId\)\}\/preview/
  );
  assert.match(client, /cache: "no-store"/);
});

test("Creation Card fixtures and contract cover the portable states", () => {
  const contract = read(
    "components/studio/creations/creation-card/CreationCard.contract.js"
  );
  const fixtures = read(
    "components/studio/creations/creation-card/CreationCard.fixtures.js"
  );

  assert.match(contract, /CREATION_CARD_VIEW_CONTRACT_VERSION/);
  assert.match(fixtures, /creationCardOwnerFixture/);
  assert.match(fixtures, /creationCardCommunityFixture/);
  assert.match(fixtures, /creationCardPlayerCharacterFixture/);
  assert.match(fixtures, /creationCardMobileFallbackFixture/);
  assert.match(fixtures, /creationCardBusyFixture/);
  assert.match(fixtures, /creationCardErrorFixture/);
});

test("Creation Card preview remains development-only", () => {
  const previewPage = read("app/dev/ui-preview/creation-card/page.jsx");

  assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
  assert.match(previewPage, /notFound\(\)/);
});

test("Public Profile grid retains the public Creation Card Shell import", () => {
  const caller = read(
    "components/studio/profile/PublicProfileCreationGrid.jsx"
  );

  assert.match(
    caller,
    /import CreationCard from "@\/components\/studio\/creations\/CreationCard"/
  );
  assert.match(caller, /<CreationCard/);
});
