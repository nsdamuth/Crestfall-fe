const CONDITIONAL_REQUEST_HEADERS = Object.freeze([
  "if-none-match",
  "if-modified-since",
]);

const IMAGE_RESPONSE_HEADERS = Object.freeze([
  "content-type",
  "content-length",
  "cache-control",
  "etag",
  "last-modified",
]);

export function appendImageConditionalRequestHeaders(
  request,
  headers = {}
) {
  const nextHeaders = { ...headers };

  for (const headerName of CONDITIONAL_REQUEST_HEADERS) {
    const value = request?.headers?.get?.(headerName);
    if (value) nextHeaders[headerName] = value;
  }

  return nextHeaders;
}

function appendVary(headers, value) {
  const current = String(headers.get("vary") || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!current.some((entry) => entry.toLowerCase() === value.toLowerCase())) {
    current.push(value);
  }

  headers.set("vary", current.join(", "));
}

export function buildImageProxyResponseHeaders(response) {
  const headers = new Headers();

  for (const headerName of IMAGE_RESPONSE_HEADERS) {
    const value = response?.headers?.get?.(headerName);
    if (value) headers.set(headerName, value);
  }

  // The same image URL can resolve under different authenticated sessions.
  // Keep browser cache entries separated by the session cookie boundary.
  appendVary(headers, "Cookie");

  return headers;
}
