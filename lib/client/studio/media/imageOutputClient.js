async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getImageOutputApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

export async function deleteImageOutput(
  imageOutputId,
  {
    deleteReason = null,
  } = {},
  fallbackMessage = "Image could not be deleted."
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  const response = await fetch(
    `/api/media/images/${encodeURIComponent(imageOutputId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteReason,
      }),
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getImageOutputApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.image || null;
}
export async function fetchImageReassignmentContext(
  imageOutputId,
  { sourceCreationId = null } = {}
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  const params = new URLSearchParams();
  if (sourceCreationId) {
    params.set("sourceCreationId", sourceCreationId);
  }

  const query = params.toString();
  const response = await fetch(
    `/api/media/images/${encodeURIComponent(
      imageOutputId
    )}/reassign${query ? `?${query}` : ""}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getImageOutputApiErrorMessage(
        payload,
        "Image reassignment options could not be loaded."
      )
    );
  }

  return payload?.data || null;
}

export async function reassignImageOutput(
  imageOutputId,
  {
    sourceCreationId,
    destinationCreationId,
  } = {}
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  if (!sourceCreationId || !destinationCreationId) {
    throw new Error("Source and destination assets are required.");
  }

  const response = await fetch(
    `/api/media/images/${encodeURIComponent(imageOutputId)}/reassign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceCreationId,
        destinationCreationId,
      }),
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getImageOutputApiErrorMessage(
        payload,
        "Image could not be reassigned."
      )
    );
  }

  return payload?.data || null;
}

export async function updateImageOutputDisplayName(
  imageOutputId,
  displayName,
  fallbackMessage = "Image name could not be saved."
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  const response = await fetch(
    `/api/media/images/${encodeURIComponent(imageOutputId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName,
      }),
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getImageOutputApiErrorMessage(payload, fallbackMessage)
    );
  }

  return payload?.data || null;
}
