export const CHARACTER_PREVIEW_COIN_COST = 5;
export const CHARACTER_PREVIEW_POLL_INTERVAL_MS = 2500;
export const CHARACTER_PREVIEW_TIMEOUT_MS = 180000;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildCharacterPreviewGenerationPayload({
  creationId,
  creationType = "CHARACTER",
} = {}) {
  const characterId = normalizeString(creationId);
  const isPlayerCharacter =
    normalizeString(creationType).toUpperCase() === "PLAYER_CHARACTER";

  if (!characterId) {
    throw new Error("Save the Character draft before generating a preview.");
  }

  return {
    mode: "image",
    operation: "create_image",
    ingredients: {
      character: isPlayerCharacter
        ? { mode: "none" }
        : {
            mode: "asset",
            assetId: characterId,
          },
      playerCharacter: isPlayerCharacter
        ? {
            mode: "asset",
            assetId: characterId,
          }
        : { mode: "none" },
      pose: { mode: "none" },
      outfit: { mode: "none" },
      location: { mode: "none" },
      renderingPreset: { mode: "none" },
    },
    prompt: {
      userPrompt:
        "full-body character preview, full figure, head to toe, clear character presentation, neutral composition",
      negativePrompt: "",
      promptMode: "natural",
    },
    composition: {
      cameraPreset: "FULL_BODY",
      shotType: "WIDE_SHOT",
      wardrobeTheme: "AUTO",
      cameraAngle: null,
      subjectPlacement: null,
      sceneEmphasis: null,
    },
    referenceInputs: [],
    controlInputs: [],
    settings: {
      // Auto intentionally delegates to the saved Character's Default Rendering
      // Style in services-api. This keeps creator preview aligned with the
      // Character rather than hard-coding an Image Studio workflow family here.
      renderingStyle: "auto",
      renderProfileKey: "auto",
      aspectRatio: "3:4",
      outputCount: 1,
      quality: "standard",
      seed: null,
    },
    modelProfile: "anime_default",
  };
}

export function getCharacterPreviewJobId(generationData = {}) {
  return normalizeString(
    generationData?.job?.id ||
      generationData?.job?.rowId ||
      generationData?.jobId ||
      generationData?.job_id
  );
}

export function getCharacterPreviewOutputId(output = {}) {
  return normalizeString(
    output?.id ||
      output?.rowId ||
      output?.imageOutputId ||
      output?.image_output_id ||
      output?.outputId ||
      output?.output_id
  );
}

export function getCharacterPreviewOutputJobId(output = {}) {
  return normalizeString(
    output?.jobId ||
      output?.job_id ||
      output?.job?.id ||
      output?.imageGenerationJob?.id
  );
}

export function getCharacterPreviewOutputImageUrl(output = {}) {
  const outputId = getCharacterPreviewOutputId(output);

  if (outputId) {
    return `/api/studio/image-generation/outputs/${encodeURIComponent(
      outputId
    )}/file?variant=display`;
  }

  return normalizeString(
    output?.displayUrl || output?.display_url || output?.imageUrl || output?.image_url
  );
}
