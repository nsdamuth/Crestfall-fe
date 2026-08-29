import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  appendImageConditionalRequestHeaders,
  buildImageProxyResponseHeaders,
} from "./imageFileCacheProxy.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("FE forwards browser validators without changing its server-to-server no-store policy", () => {
  const request = {
    headers: new Headers({
      "if-none-match": '"etag-123"',
      "if-modified-since": "Fri, 28 Aug 2026 20:00:00 GMT",
    }),
  };

  assert.deepEqual(
    appendImageConditionalRequestHeaders(request, {
      "x-crestfall-internal-secret": "secret",
    }),
    {
      "x-crestfall-internal-secret": "secret",
      "if-none-match": '"etag-123"',
      "if-modified-since": "Fri, 28 Aug 2026 20:00:00 GMT",
    }
  );
});

test("FE exposes cache validators and varies browser cache entries by Cookie", () => {
  const upstream = new Response(null, {
    headers: {
      "cache-control": "private, max-age=900, must-revalidate",
      etag: '"etag-123"',
      "last-modified": "Fri, 28 Aug 2026 20:00:00 GMT",
      "content-type": "image/webp",
      "content-length": "1234",
    },
  });

  const headers = buildImageProxyResponseHeaders(upstream);

  assert.equal(
    headers.get("cache-control"),
    "private, max-age=900, must-revalidate"
  );
  assert.equal(headers.get("etag"), '"etag-123"');
  assert.equal(headers.get("last-modified"), "Fri, 28 Aug 2026 20:00:00 GMT");
  assert.equal(headers.get("vary"), "Cookie");
});

test("both same-origin image routes preserve 304 revalidation and no-store upstream fetches", () => {
  const routes = [
    read("app/api/studio/image-generation/outputs/[id]/file/route.js"),
    read("app/api/media/images/[imageOutputId]/file/route.js"),
  ];

  for (const source of routes) {
    assert.match(source, /appendImageConditionalRequestHeaders/);
    assert.match(source, /response\.status === 304/);
    assert.match(source, /buildImageProxyResponseHeaders/);
    assert.match(source, /cache: "no-store"/);
  }
});
