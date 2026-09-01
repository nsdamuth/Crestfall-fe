import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  formatStudioNotificationRelativeTime,
  projectStudioNotification,
} from "./studioTopBarNotificationPresentation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("followed creator publication projects to a linked release row", () => {
  const projected = projectStudioNotification(
    {
      id: "release-1",
      type: "FOLLOWED_CREATOR_PUBLISHED",
      occurredAt: "2026-08-31T23:50:00Z",
      actor: { username: "lyra", displayName: "Lyra Vale" },
      creation: { id: "creation-1", type: "CHARACTER", title: "Lysandra" },
      href: "/studio/creations/creation-1",
    },
    new Date("2026-09-01T00:00:00Z").getTime()
  );

  assert.equal(projected.title, "@lyra published “Lysandra”.");
  assert.equal(projected.body, "Character is now public.");
  assert.equal(projected.supportingLine, "10m ago");
  assert.equal(projected.href, "/studio/creations/creation-1");
});

test("Coin receipt projects without manufacturing a navigation target", () => {
  const projected = projectStudioNotification(
    {
      id: "coins-1",
      type: "COINS_RECEIVED",
      occurredAt: "2026-08-31T23:00:00Z",
      coinAmount: 1250,
      senderLabel: "@patron",
      message: "Keep building.",
    },
    new Date("2026-09-01T00:00:00Z").getTime()
  );

  assert.equal(projected.title, "You received 1,250 Coins from @patron.");
  assert.equal(projected.body, "Keep building.");
  assert.equal(projected.supportingLine, "1h ago");
  assert.equal(projected.href, null);
});

test("relative-time formatting stays compact", () => {
  const now = new Date("2026-09-01T00:00:00Z").getTime();
  assert.equal(formatStudioNotificationRelativeTime("2026-08-31T23:59:30Z", now), "Just now");
  assert.equal(formatStudioNotificationRelativeTime("2026-08-31T23:30:00Z", now), "30m ago");
  assert.equal(formatStudioNotificationRelativeTime("2026-08-30T00:00:00Z", now), "2d ago");
});

test("client and both Next proxy contracts use the authenticated notification endpoint", () => {
  const client = read("lib/client/studio/notifications/studioNotificationsClient.js");
  const route = read("app/api/studio/notifications/route.js");
  assert.match(client, /\/api\/studio\/notifications\?limit=/);
  assert.match(client, /credentials: "same-origin"/);
  assert.match(route, /getAuthenticatedUser/);
  assert.match(route, /x-crestfall-user-id/);
  assert.match(route, /\/v1\/studio\/notifications\?limit=/);
});
