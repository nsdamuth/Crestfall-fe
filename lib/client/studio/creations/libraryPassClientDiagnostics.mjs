import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  CreationLibraryPassApiError,
  createLibraryPassPurchaseIdempotencyKey,
  fetchCreationLibraryPassState,
  purchaseCreationLibraryPass,
  setCreationLibraryPassSalesEnabled,
} from "./libraryPassClient.js";

const CREATION_ID =
  "a18134a4-0c32-451f-b97b-d012f04d5df7";

const IDEMPOTENCY_KEY =
  "6dc9f8d8-8f4e-44aa-8888-421be4b08f57";

const currentDir = path.dirname(
  fileURLToPath(import.meta.url)
);

const repoRoot = path.resolve(
  currentDir,
  "../../../.."
);

function makeResponse({
  ok = true,
  status = 200,
  payload = null,
} = {}) {
  return {
    ok,
    status,
    async json() {
      return payload;
    },
  };
}

function captureFetch(response) {
  const calls = [];

  return {
    calls,
    fetchImpl: async (...args) => {
      calls.push(args);
      return makeResponse(response);
    },
  };
}

test("state client uses the public same-origin proxy", async () => {
  const capture = captureFetch({
    payload: {
      data: {
        libraryPass: {
          creationId: CREATION_ID,
          publicPreviewCount: 4,
        },
      },
      error: null,
    },
  });

  const state =
    await fetchCreationLibraryPassState(
      CREATION_ID,
      capture
    );

  assert.equal(
    state.publicPreviewCount,
    4
  );

  assert.equal(
    capture.calls[0][0],
    `/api/creations/${CREATION_ID}/library-pass`
  );

  assert.deepEqual(
    capture.calls[0][1],
    {
      method: "GET",
      headers: undefined,
      body: undefined,
      cache: "no-store",
    }
  );
});

test("owner client forwards an explicit sales toggle", async () => {
  const capture = captureFetch({
    payload: {
      data: {
        libraryPass: {
          salesEnabled: true,
        },
      },
      error: null,
    },
  });

  const state =
    await setCreationLibraryPassSalesEnabled(
      CREATION_ID,
      true,
      capture
    );

  assert.equal(
    state.salesEnabled,
    true
  );

  assert.equal(
    capture.calls[0][1].method,
    "PATCH"
  );

  assert.deepEqual(
    JSON.parse(
      capture.calls[0][1].body
    ),
    {
      salesEnabled: true,
    }
  );
});

test("purchase client preserves one caller-owned idempotency key", async () => {
  const capture = captureFetch({
    status: 201,
    payload: {
      data: {
        purchase: {
          charged: true,
          buyerBalance: 750,
        },
        libraryPass: {
          hasActiveEntitlement: true,
        },
      },
      error: null,
    },
  });

  const result =
    await purchaseCreationLibraryPass(
      CREATION_ID,
      IDEMPOTENCY_KEY,
      capture
    );

  assert.equal(
    result.purchase.buyerBalance,
    750
  );

  assert.equal(
    result.libraryPass.hasActiveEntitlement,
    true
  );

  assert.equal(
    capture.calls[0][0],
    `/api/creations/${CREATION_ID}/library-pass/purchase`
  );

  assert.deepEqual(
    JSON.parse(
      capture.calls[0][1].body
    ),
    {
      idempotencyKey:
        IDEMPOTENCY_KEY,
    }
  );
});

test("service error metadata remains available to the ViewModel", async () => {
  const capture = captureFetch({
    ok: false,
    status: 402,
    payload: {
      data: null,
      error: {
        code: "INSUFFICIENT_COINS",
        message:
          "You do not have enough coins.",
        details: {
          coinBalance: 100,
          requiredAmount: 250,
        },
      },
    },
  });

  await assert.rejects(
    () =>
      purchaseCreationLibraryPass(
        CREATION_ID,
        IDEMPOTENCY_KEY,
        capture
      ),
    (error) => {
      assert.ok(
        error instanceof
          CreationLibraryPassApiError
      );
      assert.equal(error.status, 402);
      assert.equal(
        error.code,
        "INSUFFICIENT_COINS"
      );
      assert.deepEqual(
        error.details,
        {
          coinBalance: 100,
          requiredAmount: 250,
        }
      );
      return true;
    }
  );
});

test("purchase idempotency helper creates a UUID", () => {
  assert.match(
    createLibraryPassPurchaseIdempotencyKey(),
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
});

test("client rejects missing or malformed transaction inputs", async () => {
  await assert.rejects(
    () =>
      fetchCreationLibraryPassState(""),
    /Creation id is required\./
  );

  await assert.rejects(
    () =>
      purchaseCreationLibraryPass(
        CREATION_ID,
        "not-a-uuid"
      ),
    /valid purchase idempotency key/
  );
});

test("Next proxies preserve optional read auth and required mutation auth", () => {
  const stateRoute = fs.readFileSync(
    path.join(
      repoRoot,
      "app/api/creations/[id]/library-pass/route.js"
    ),
    "utf8"
  );

  const purchaseRoute = fs.readFileSync(
    path.join(
      repoRoot,
      "app/api/creations/[id]/library-pass/purchase/route.js"
    ),
    "utf8"
  );

  assert.match(
    stateRoute,
    /getOptionalAuthenticatedUser/
  );
  assert.match(
    stateRoute,
    /\/v1\/creations\/\$\{encodeURIComponent\(/
  );
  assert.match(
    stateRoute,
    /\/v1\/studio\/creations\//
  );
  assert.match(
    stateRoute,
    /You must be signed in to manage Library Pass sales\./
  );

  assert.match(
    purchaseRoute,
    /\/library-pass\/purchase/
  );
  assert.match(
    purchaseRoute,
    /You must be signed in to purchase a Library Pass\./
  );
  assert.match(
    purchaseRoute,
    /payload\?\.data\?\.purchase\?\.charged/
  );
});
