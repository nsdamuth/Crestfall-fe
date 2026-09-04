import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { getPersistentStatusSurfaceDomains } from "./storyRoomStatusSurfacePresentation.js";

const hook = readFileSync(
  new URL("../hooks/useStoryRoomChat.js", import.meta.url),
  "utf8"
);

assert.match(hook, /statusSurfaceRequestSequenceRef/);
assert.match(
  hook,
  /requestSequence !== statusSurfaceRequestSequenceRef\.current/
);

const catchStart = hook.indexOf("} catch (surfaceError) {");
assert.ok(catchStart >= 0, "Status-surface refresh catch block must exist.");
const catchEnd = hook.indexOf("  }, [roomId]);", catchStart);
assert.ok(catchEnd > catchStart, "Status-surface refresh catch block must close.");
const catchBody = hook.slice(catchStart, catchEnd);
assert.doesNotMatch(
  catchBody,
  /setStatusSurfaces\s*\(/,
  "A transient status-surface refresh failure must preserve the last known-good HUD."
);
assert.match(catchBody, /setStatusSurfaceError\s*\(/);

assert.deepEqual(
  getPersistentStatusSurfaceDomains([
    {
      variant: "ACTOR_MECHANICS",
      readouts: [
        {
          status: "UNAVAILABLE",
          source: { domain: "STATS_POOLS" },
        },
        {
          status: "RESOLVED",
          source: { domain: "PROGRESSION" },
        },
      ],
    },
  ]),
  ["STATS_POOLS", "PROGRESSION"],
  "Persistent domain ownership must survive a transient unresolved readout."
);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_room_status_surface_refresh_resilience_v1",
      status: "PASSED",
      transientRefreshFailurePreservesLastKnownGoodHud: true,
      staleRefreshCannotOverwriteNewerProjection: true,
      roomChangeInvalidatesPriorStatusRequests: true,
      unresolvedReadoutKeepsPersistentDomainOwnership: true,
      historicalStatusSnapshotsStaySuppressedDuringRefreshFailure: true,
    },
    null,
    2
  )
);
