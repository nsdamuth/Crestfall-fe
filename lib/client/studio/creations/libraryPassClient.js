const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getApiErrorMessage(
  payload,
  fallbackMessage
) {
  return (
    payload?.error?.message ||
    payload?.message ||
    fallbackMessage
  );
}

export class CreationLibraryPassApiError extends Error {
  constructor({
    message,
    status = 0,
    code = null,
    details = null,
    payload = null,
  }) {
    super(message);
    this.name = "CreationLibraryPassApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.payload = payload;
  }
}

function validateCreationId(creationId) {
  const normalized = normalizeString(creationId);

  if (!normalized) {
    throw new TypeError(
      "Creation id is required."
    );
  }

  return normalized;
}

function validateIdempotencyKey(
  idempotencyKey
) {
  const normalized = normalizeString(
    idempotencyKey
  );

  if (!UUID_PATTERN.test(normalized)) {
    throw new TypeError(
      "A valid purchase idempotency key is required."
    );
  }

  return normalized;
}

async function requestLibraryPassApi({
  endpoint,
  method = "GET",
  body,
  fallbackMessage,
  fetchImpl = globalThis.fetch,
}) {
  if (typeof fetchImpl !== "function") {
    throw new TypeError(
      "A fetch implementation is required."
    );
  }

  const response = await fetchImpl(endpoint, {
    method,
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body
      ? JSON.stringify(body)
      : undefined,
    cache: "no-store",
  });

  const payload =
    await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new CreationLibraryPassApiError({
      message: getApiErrorMessage(
        payload,
        fallbackMessage
      ),
      status: response.status,
      code:
        payload?.error?.code || null,
      details:
        payload?.error?.details || null,
      payload,
    });
  }

  return payload;
}

export function createLibraryPassPurchaseIdempotencyKey() {
  const randomUuid =
    globalThis.crypto?.randomUUID;

  if (typeof randomUuid !== "function") {
    throw new Error(
      "Secure UUID generation is not available."
    );
  }

  return randomUuid.call(
    globalThis.crypto
  );
}

export async function fetchCreationLibraryPassState(
  creationId,
  {
    fetchImpl = globalThis.fetch,
  } = {}
) {
  const normalizedCreationId =
    validateCreationId(creationId);

  const payload =
    await requestLibraryPassApi({
      endpoint: `/api/creations/${encodeURIComponent(
        normalizedCreationId
      )}/library-pass`,
      method: "GET",
      fallbackMessage:
        "Library Pass state could not be loaded.",
      fetchImpl,
    });

  return payload?.data?.libraryPass || null;
}

export async function setCreationLibraryPassSalesEnabled(
  creationId,
  salesEnabled,
  {
    fetchImpl = globalThis.fetch,
  } = {}
) {
  const normalizedCreationId =
    validateCreationId(creationId);

  if (typeof salesEnabled !== "boolean") {
    throw new TypeError(
      "salesEnabled must be a boolean."
    );
  }

  const payload =
    await requestLibraryPassApi({
      endpoint: `/api/creations/${encodeURIComponent(
        normalizedCreationId
      )}/library-pass`,
      method: "PATCH",
      body: {
        salesEnabled,
      },
      fallbackMessage:
        "Library Pass sales could not be updated.",
      fetchImpl,
    });

  return payload?.data?.libraryPass || null;
}

export async function purchaseCreationLibraryPass(
  creationId,
  idempotencyKey,
  {
    fetchImpl = globalThis.fetch,
  } = {}
) {
  const normalizedCreationId =
    validateCreationId(creationId);

  const normalizedIdempotencyKey =
    validateIdempotencyKey(
      idempotencyKey
    );

  const payload =
    await requestLibraryPassApi({
      endpoint: `/api/creations/${encodeURIComponent(
        normalizedCreationId
      )}/library-pass/purchase`,
      method: "POST",
      body: {
        idempotencyKey:
          normalizedIdempotencyKey,
      },
      fallbackMessage:
        "Library Pass purchase could not be completed.",
      fetchImpl,
    });

  return {
    purchase:
      payload?.data?.purchase || null,
    libraryPass:
      payload?.data?.libraryPass || null,
  };
}
