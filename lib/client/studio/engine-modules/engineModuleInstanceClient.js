async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

async function requestEngineModuleApi({
  endpoint,
  method = "GET",
  body,
  fallbackMessage,
}) {
  const response = await fetch(endpoint, {
    method,
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error || payload?.ok === false) {
    throw new Error(getApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data;
}

export async function fetchEngineModuleInstances() {
  return requestEngineModuleApi({
    endpoint: "/api/studio/engine-module-instances",
    method: "GET",
    fallbackMessage: "Engine module instances could not be loaded.",
  });
}

export async function createEngineModuleInstance(payload) {
  return requestEngineModuleApi({
    endpoint: "/api/studio/engine-module-instances",
    method: "POST",
    body: payload,
    fallbackMessage: "Engine module instance could not be created.",
  });
}

export async function fetchEngineModuleInstance(moduleInstanceId) {
  return requestEngineModuleApi({
    endpoint: `/api/studio/engine-module-instances/${encodeURIComponent(
      moduleInstanceId
    )}`,
    method: "GET",
    fallbackMessage: "Engine module instance could not be loaded.",
  });
}

export async function updateEngineModuleInstance(moduleInstanceId, payload) {
  return requestEngineModuleApi({
    endpoint: `/api/studio/engine-module-instances/${encodeURIComponent(
      moduleInstanceId
    )}`,
    method: "PATCH",
    body: payload,
    fallbackMessage: "Engine module instance could not be updated.",
  });
}