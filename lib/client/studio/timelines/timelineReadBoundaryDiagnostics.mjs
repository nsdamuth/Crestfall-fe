import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const client = read("lib/client/studio/timelines/timelineClient.js");
const service = read("lib/server/services/creations/timelineService.js");
const ownerProxy = read("app/api/creations/[id]/timeline/route.js");
const publicProxy = read("app/api/timelines/[id]/publication/route.js");

assert.match(client, /fetchOwnedTimelineProjection/);
assert.match(client, /fetchPublicTimelineProjection/);
assert.match(client, /cache: "no-store"/);
assert.match(client, /\/api\/creations\/\$\{encodeURIComponent\(timelineId\)\}\/timeline/);
assert.match(client, /\/api\/timelines\/\$\{encodeURIComponent\(timelineId\)\}\/publication/);

assert.match(service, /\/v1\/studio\/creations\/\$\{encodeURIComponent\(timelineId\)\}\/timeline/);
assert.match(service, /\/v1\/timelines\/\$\{encodeURIComponent\(timelineId\)\}\/publication/);
assert.match(service, /x-crestfall-user-id/);

assert.match(ownerProxy, /getAuthenticatedUser/);
assert.match(ownerProxy, /getOwnedTimelineProjection/);
assert.match(ownerProxy, /UNAUTHORIZED/);
assert.match(publicProxy, /getPublicTimelineProjection/);
assert.doesNotMatch(publicProxy, /getAuthenticatedUser|createClient/);

console.log(
  JSON.stringify(
    {
      diagnostic: "timeline_read_boundary_fe_v1",
      status: "PASSED",
      ownerReadRequiresAuthenticatedProxy: true,
      publicReadAllowsAnonymousProxy: true,
      clientUsesSameOriginRoutesOnly: true,
      directServicesApiCallsFromClient: false,
      noStoreReads: true,
    },
    null,
    2
  )
);
