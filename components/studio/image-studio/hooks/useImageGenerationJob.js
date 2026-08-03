"use client";

import { useState } from "react";
import { createImageGenerationJob } from "@/lib/client/studio/image-studio/imageStudioClient";

export function useImageGenerationJob() {
  const [generationStatus, setGenerationStatus] = useState("idle");
  const [generationError, setGenerationError] = useState("");
  const [latestGenerationJob, setLatestGenerationJob] = useState(null);

  async function submitImageGenerationJob(payload) {
    setGenerationStatus("loading");
    setGenerationError("");

    try {
      const data = await createImageGenerationJob(payload);

      setLatestGenerationJob(data);
      setGenerationStatus("success");

      return data;
    } catch (error) {
      setLatestGenerationJob(null);
      setGenerationStatus("error");
      setGenerationError(
        error.message || "Image generation job could not be created."
      );

      throw error;
    }
  }

  function resetGenerationState() {
    setGenerationStatus("idle");
    setGenerationError("");
    setLatestGenerationJob(null);
  }

  return {
    generationStatus,
    generationError,
    latestGenerationJob,
    submitImageGenerationJob,
    resetGenerationState,
  };
}