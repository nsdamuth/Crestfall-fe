const DEFAULT_MAX_JSON_BODY_BYTES = 8 * 1024 * 1024;

function payloadTooLarge(maxBytes, receivedBytes = null) {
  const error = new Error(
    `Request body exceeds the ${Math.floor(maxBytes / 1024 / 1024)} MiB limit.`
  );

  error.status = 413;
  error.code = "PAYLOAD_TOO_LARGE";
  error.details = {
    layer: "fe-api-proxy",
    maxBytes,
    receivedBytes,
  };

  return error;
}

export async function readJsonRequestBody(
  request,
  { maxBytes = DEFAULT_MAX_JSON_BODY_BYTES } = {}
) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw payloadTooLarge(maxBytes, contentLength);
  }

  let body;

  try {
    body = await request.json();
  } catch (error) {
    if (error?.status === 413 || error?.code === "PAYLOAD_TOO_LARGE") {
      throw error;
    }

    const invalidJsonError = new Error("Invalid JSON body.");
    invalidJsonError.status = 400;
    invalidJsonError.code = "INVALID_JSON";
    invalidJsonError.details = {
      layer: "fe-api-proxy",
    };
    throw invalidJsonError;
  }

  const receivedBytes = Buffer.byteLength(JSON.stringify(body), "utf8");

  if (receivedBytes > maxBytes) {
    throw payloadTooLarge(maxBytes, receivedBytes);
  }

  return body;
}
