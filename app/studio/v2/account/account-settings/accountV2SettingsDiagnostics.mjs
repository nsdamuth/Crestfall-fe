import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const view = read(
  "app/studio/v2/account/account-settings/AccountSettingsPage.jsx"
);
const config = read(
  "app/studio/v2/account/account-settings/accountSettingsConfig.js"
);
const accountView = read(
  "app/studio/v2/account/account-live/AccountV2Live.view.jsx"
);

const routeIds = [
  "subscription",
  "preferences",
  "appearance",
  "notifications",
  "privacy",
  "safety",
];

test("all six V2 Account settings routes use the shared capability-aware surface", () => {
  for (const routeId of routeIds) {
    const route = read(`app/studio/v2/account/${routeId}/page.jsx`);
    assert.match(route, /AccountSettingsPage/);
    assert.match(route, new RegExp(`settingsId=["']${routeId}["']`));
  }
});

test("Account settings stay inside the V2 account route family", () => {
  for (const routeId of routeIds) {
    assert.match(accountView, new RegExp(`/studio/v2/account/${routeId}`));
  }
  assert.doesNotMatch(accountView, /href:\s*["']\/studio\/account\/(subscription|preferences|appearance|notifications|privacy|safety)/);
});

test("settings pages distinguish live capabilities from unsupported account contracts", () => {
  assert.match(config, /status:\s*["']LIVE["']/);
  assert.match(config, /status:\s*["']NOT_CONNECTED["']/);
  assert.match(view, /Live/);
  assert.match(view, /Not connected/);
  assert.match(view, /No saved account control yet/);
});

test("known live account settings deep-link to the authoritative AC1B controls", () => {
  for (const anchor of [
    "#coins",
    "#default-player-character",
    "#content-preference",
    "#account-contact",
    "#public-profile",
  ]) {
    assert.match(config, new RegExp(anchor.replace("#", "\\#")));
  }

  for (const id of [
    "coins",
    "default-player-character",
    "content-preference",
    "account-contact",
    "public-profile",
  ]) {
    assert.match(accountView, new RegExp(`id=["']${id}["']`));
  }
});

test("placeholder settings no longer imply disabled controls are persisted", () => {
  assert.doesNotMatch(view, /<(?:button|input|select|textarea)[^>]*\sdisabled(?:=|\s|>)/i);
  assert.doesNotMatch(view, /window\.(confirm|alert|prompt)/);
  assert.match(
    view,
    /does not use fixtures, local-only toggles, or disabled controls to imply settings are being saved/i
  );
});

test("Account settings View owns presentation only", () => {
  assert.doesNotMatch(
    view,
    /from\s+["'][^"']*(studioAccountClient|supabase|postgraphile)|crestfallApiRequest|fetch\(/i
  );
  assert.doesNotMatch(view, /\/api\//);
  assert.doesNotMatch(view, /\/v1\//);
});

test("unsupported billing, appearance, notification, privacy and safety controls remain honest", () => {
  assert.match(config, /billing provider is connected|billing provider/i);
  assert.match(config, /no user-account persistence|no saved account preference/i);
  assert.match(config, /notification subscriptions and channel preferences are not connected/i);
  assert.match(config, /does not expose a supported mutation/i);
  assert.match(config, /comfort settings[\s\S]*not persisted account settings/i);
});
