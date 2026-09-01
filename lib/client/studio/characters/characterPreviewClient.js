import {
  createImageGenerationJob,
  fetchImageGenerationHistory,
} from "@/lib/client/studio/image-studio/imageStudioClient";
import {
  CHARACTER_PREVIEW_POLL_INTERVAL_MS,
  CHARACTER_PREVIEW_TIMEOUT_MS,
  buildCharacterPreviewGenerationPayload,
  getCharacterPreviewJobId,
  getCharacterPreviewOutputImageUrl,
  getCharacterPreviewOutputJobId,
} from "@/components/studio/create/character/character-preview/characterPreviewGeneration";

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function findJobOutput(data, jobId) {
  const outputs = Array.isArray(data?.outputs) ? data.outputs : [];

  return (
    outputs.find((output) => getCharacterPreviewOutputJobId(output) === jobId) ||
    null
  );
}

export async function generateCharacterPreviewImage({
  creationId,
  creationType = "CHARACTER",
  pollIntervalMs = CHARACTER_PREVIEW_POLL_INTERVAL_MS,
  timeoutMs = CHARACTER_PREVIEW_TIMEOUT_MS,
} = {}) {
  const payload = buildCharacterPreviewGenerationPayload({
    creationId,
    creationType,
  });
  const generationData = await createImageGenerationJob(payload);
  const immediateOutput = Array.isArray(generationData?.outputs)
    ? generationData.outputs[0]
    : null;

  if (immediateOutput) {
    return {
      generationData,
      output: immediateOutput,
      imageUrl: getCharacterPreviewOutputImageUrl(immediateOutput),
    };
  }

  const jobId = getCharacterPreviewJobId(generationData);
  if (!jobId) {
    throw new Error("Preview generation started, but no generation job ID was returned.");
  }

  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    await wait(pollIntervalMs);

    const history = await fetchImageGenerationHistory({ limit: 12 });
    const output = findJobOutput(history, jobId);

    if (output) {
      return {
        generationData,
        output,
        imageUrl: getCharacterPreviewOutputImageUrl(output),
      };
    }
  }

  throw new Error(
    "Preview generation is taking longer than expected. The image may still finish in Image Studio."
  );
}
