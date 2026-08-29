"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchImageGenerationHistory } from "@/lib/client/studio/image-studio/imageStudioClient";
import {
  applyImageOutputDisplayNameResult,
  getImageOutputDisplayTitle,
} from "@/lib/shared/media/imageOutputNaming";

const IMAGE_HISTORY_PAGE_SIZE = 12;
const ACTIVE_JOB_POLL_INTERVAL_MS = 3000;

function makeMediaTitle(output, job = null) {
  return getImageOutputDisplayTitle(
    {
      ...output,
      job: job || output?.job || null,
    },
    { fallbackBase: "Generated Image" }
  );
}

function getImageUrlForOutput(output) {
  if (output?.storageProvider === "r2" && output?.id) {
    return `/api/studio/image-generation/outputs/${encodeURIComponent(
      output.id
    )}/file`;
  }

  return output.displayUrl || output.thumbnailUrl;
}

function hasStoredThumbnail(output) {
  return Boolean(
    output?.thumbnailUrl ||
      output?.providerMetadata?.storage?.thumbnail?.path
  );
}

function getThumbnailUrlForOutput(output) {
  if (output?.storageProvider === "r2" && output?.id && hasStoredThumbnail(output)) {
    return `/api/studio/image-generation/outputs/${encodeURIComponent(
      output.id
    )}/file?variant=thumbnail`;
  }

  return output.thumbnailUrl || output.displayUrl || getImageUrlForOutput(output);
}

function getOutputUuid(output) {
  return (
    output?.id ||
    output?.rowId ||
    output?.imageOutputId ||
    output?.image_output_id ||
    output?.outputId ||
    output?.output_id ||
    null
  );
}

function mapOutputToMediaItem(output, index, jobOverride = null) {
  const job = jobOverride || output.job || null;
  const imageOutputId = getOutputUuid(output);

  return {
    id: imageOutputId || `image-output-${index}`,
    imageOutputId,
    outputId: imageOutputId,
    image_output_id: imageOutputId,

    type: "IMAGE",
    title: makeMediaTitle(output, job),
    imageUrl: getImageUrlForOutput(output),
    thumbnailUrl: getThumbnailUrlForOutput(output),

    jobId: output.jobId || output.job_id || job?.id || null,
    provider: job?.provider || output.storageProvider || "unknown",
    createdAt: job?.completedAt || output.createdAt || job?.createdAt || null,
    status: "ready",

    width: output.width || null,
    height: output.height || null,
    providerMetadata:
      output.providerMetadata || output.provider_metadata || {},
    storagePath: output.storagePath || output.storage_path || null,
    storageProvider: output.storageProvider || output.storage_provider || null,
    ownerId: output.ownerId || output.owner_id || null,
    primarySubjectCreationId:
      output.primarySubjectCreationId ||
      output.primary_subject_creation_id ||
      job?.primarySubjectCreationId ||
      job?.primary_subject_creation_id ||
      null,
    canReassign: Boolean(
      imageOutputId &&
        (output.primarySubjectCreationId ||
          output.primary_subject_creation_id ||
          job?.primarySubjectCreationId ||
          job?.primary_subject_creation_id)
    ),

    output,
    job,
  };
}

function mapGenerationOutputsToMediaItems(generationData) {
  const job = generationData?.job;
  const outputs = Array.isArray(generationData?.outputs)
    ? generationData.outputs
    : [];

  return outputs.map((output, index) =>
    mapOutputToMediaItem(output, index, job)
  );
}

function getOutputJobId(output) {
  return (
    output?.jobId ||
    output?.job_id ||
    output?.job?.id ||
    output?.imageGenerationJob?.id ||
    null
  );
}

function getJobOutputCount(job) {
  const settings = job?.settingsSnapshot || job?.settings_snapshot || {};
  const rawCount = settings.outputCount ?? settings.output_count ?? 1;
  const parsedCount = Number.parseInt(rawCount, 10);

  return Math.min(Math.max(Number.isFinite(parsedCount) ? parsedCount : 1, 1), 4);
}

function getJobDisplayTitle(job) {
  return getImageOutputDisplayTitle(
    { job },
    { fallbackBase: "Generating Image" }
  );
}

function getJobResolvedDimensions(job) {
  const settings = job?.settingsSnapshot || job?.settings_snapshot || {};
  const dimensions =
    settings.resolvedDimensions || settings.resolved_dimensions || {};

  return {
    width: dimensions.width || null,
    height: dimensions.height || null,
  };
}

function mapActiveJobsToPendingMediaItems(activeJobs = [], outputs = []) {
  const outputJobIds = new Set(outputs.map(getOutputJobId).filter(Boolean));

  return activeJobs.flatMap((job) => {
    const jobId = job?.id || job?.rowId || job?.jobId || null;

    if (!jobId || outputJobIds.has(jobId)) {
      return [];
    }

    const pendingGroupId = `image-generation-job-${jobId}`;
    const outputCount = getJobOutputCount(job);
    const title = getJobDisplayTitle(job);
    const dimensions = getJobResolvedDimensions(job);

    return Array.from({ length: outputCount }, (_, index) => ({
      id: `${pendingGroupId}-${index}`,
      pendingGroupId,
      type: "IMAGE",
      title,
      imageUrl: null,
      thumbnailUrl: null,
      jobId,
      provider: job.provider || "pending",
      createdAt: job.createdAt || job.updatedAt || null,
      status: "pending",
      width: dimensions.width,
      height: dimensions.height,
      output: null,
      job,
      serverHydrated: true,
    }));
  });
}

function isLocalPendingItem(item) {
  return item?.status === "pending" && !item?.jobId;
}

function isServerPendingItem(item) {
  return item?.status === "pending" && Boolean(item?.jobId);
}

function mergeHistoryMediaItems({
  currentItems,
  nextReadyItems,
  nextActiveItems,
  append,
}) {
  const localPendingItems = currentItems.filter(isLocalPendingItem);
  const retainedItems = append
    ? currentItems.filter(
        (item) => !isLocalPendingItem(item) && !isServerPendingItem(item)
      )
    : [];

  return dedupeById([
    ...localPendingItems,
    ...nextActiveItems,
    ...retainedItems,
    ...nextReadyItems,
  ]);
}

function makeClientId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makePendingMediaItems({ count = 1, prompt = "" }) {
  const pendingGroupId = makeClientId("pending-image-generation");
  const itemCount = Math.max(1, Number.parseInt(count, 10) || 1);
  const now = new Date().toISOString();
  const title = "Generating Image";

  return {
    pendingGroupId,
    items: Array.from({ length: itemCount }, (_, index) => ({
      id: `${pendingGroupId}-${index}`,
      pendingGroupId,
      type: "IMAGE",
      title,
      imageUrl: null,
      thumbnailUrl: null,
      jobId: null,
      provider: "pending",
      createdAt: now,
      status: "pending",
      output: null,
      job: null,
    })),
  };
}

function dedupeById(items = []) {
  const seen = new Set();
  const deduped = [];

  items.forEach((item) => {
    if (!item?.id || seen.has(item.id)) return;

    seen.add(item.id);
    deduped.push(item);
  });

  return deduped;
}

function replacePendingGroup(currentItems, pendingGroupId, replacementItems) {
  const firstPendingIndex = currentItems.findIndex(
    (item) => item.pendingGroupId === pendingGroupId
  );

  const withoutPendingGroup = currentItems.filter(
    (item) => item.pendingGroupId !== pendingGroupId
  );

  if (firstPendingIndex < 0) {
    return dedupeById([...replacementItems, ...withoutPendingGroup]);
  }

  const nextItems = [...withoutPendingGroup];
  nextItems.splice(firstPendingIndex, 0, ...replacementItems);

  return dedupeById(nextItems);
}

export function useImageGenerationHistory() {
  const [mediaItems, setMediaItems] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("idle");
  const [historyError, setHistoryError] = useState("");
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null,
  });
  const [activeJobCount, setActiveJobCount] = useState(0);
  const [localPendingCount, setLocalPendingCount] = useState(0);
  const localPendingGroupIdsRef = useRef(new Set());

  const loadImageGenerationHistory = useCallback(
    async ({ cursor = null, append = false, silent = false } = {}) => {
      if (!silent) {
        setHistoryStatus(append ? "loading_more" : "loading");
        setHistoryError("");
      }

      try {
        const data = await fetchImageGenerationHistory({
          limit: IMAGE_HISTORY_PAGE_SIZE,
          cursor,
        });

        const outputs = Array.isArray(data?.outputs) ? data.outputs : [];
        const activeJobs = Array.isArray(data?.activeJobs)
          ? data.activeJobs
          : [];
        const nextReadyItems = outputs.map((output, index) =>
          mapOutputToMediaItem(output, index)
        );
        const nextActiveItems = mapActiveJobsToPendingMediaItems(
          activeJobs,
          outputs
        );
        const activeJobIds = new Set(
          nextActiveItems.map((item) => item.jobId).filter(Boolean)
        );

        setHistoryError("");
        setActiveJobCount(activeJobIds.size);
        setMediaItems((current) =>
          mergeHistoryMediaItems({
            currentItems: current,
            nextReadyItems,
            nextActiveItems,
            append,
          })
        );

        setPageInfo({
          hasNextPage: Boolean(data?.pageInfo?.hasNextPage),
          endCursor: data?.pageInfo?.endCursor || null,
        });

        setHistoryStatus((current) =>
          silent && current !== "idle" ? current : "loaded"
        );
      } catch (error) {
        setHistoryError(
          error.message || "Image generation history could not be loaded."
        );

        if (silent) {
          return;
        }

        setHistoryStatus("error");
        setActiveJobCount(0);

        if (!append) {
          setMediaItems([]);
          setPageInfo({
            hasNextPage: false,
            endCursor: null,
          });
        }
      }
    },
    []
  );

  useEffect(() => {
    loadImageGenerationHistory();
  }, [loadImageGenerationHistory]);

  useEffect(() => {
    if (activeJobCount < 1 || localPendingCount > 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "hidden") {
        return;
      }

      loadImageGenerationHistory({ silent: true });
    }, ACTIVE_JOB_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeJobCount, localPendingCount, loadImageGenerationHistory]);

  async function loadMoreImageGenerationHistory() {
    if (
      historyStatus === "loading" ||
      historyStatus === "loading_more" ||
      !pageInfo.hasNextPage ||
      !pageInfo.endCursor
    ) {
      return;
    }

    await loadImageGenerationHistory({
      cursor: pageInfo.endCursor,
      append: true,
    });
  }

  function setLocalPendingGroupActive(pendingGroupId, isActive) {
    if (!pendingGroupId) return;

    if (isActive) {
      localPendingGroupIdsRef.current.add(pendingGroupId);
    } else {
      localPendingGroupIdsRef.current.delete(pendingGroupId);
    }

    setLocalPendingCount(localPendingGroupIdsRef.current.size);
  }

  function prependPendingGeneration({ count = 1, prompt = "" } = {}) {
    const pendingGeneration = makePendingMediaItems({ count, prompt });

    setLocalPendingGroupActive(pendingGeneration.pendingGroupId, true);
    setMediaItems((current) =>
      dedupeById([...pendingGeneration.items, ...current])
    );

    return pendingGeneration.pendingGroupId;
  }

  function resolvePendingGeneration(pendingGroupId, generationData) {
    const nextItems = mapGenerationOutputsToMediaItems(generationData);

    setLocalPendingGroupActive(pendingGroupId, false);
    setMediaItems((current) =>
      replacePendingGroup(current, pendingGroupId, nextItems)
    );
  }

  function failPendingGeneration(pendingGroupId, error) {
    setLocalPendingGroupActive(pendingGroupId, false);
    const errorMessage =
      error?.message || "Image generation could not be completed.";

    setMediaItems((current) => {
      let insertedError = false;

      return current.flatMap((item) => {
        if (item.pendingGroupId !== pendingGroupId) {
          return [item];
        }

        if (insertedError) {
          return [];
        }

        insertedError = true;

        return [
          {
            ...item,
            id: `${pendingGroupId}-failed`,
            title: "Generation failed",
            status: "error",
            errorMessage,
          },
        ];
      });
    });
  }

  function prependGeneration(generationData) {
    const nextItems = mapGenerationOutputsToMediaItems(generationData);

    setMediaItems((current) => dedupeById([...nextItems, ...current]));
  }

  const applyImageReassignment = useCallback(
    ({ imageOutputId, destinationCreationId } = {}) => {
      if (!imageOutputId || !destinationCreationId) return false;

      let updated = false;
      setMediaItems((currentItems) =>
        currentItems.map((item) => {
          if (String(item?.imageOutputId || item?.outputId || item?.id || "") !== imageOutputId) {
            return item;
          }

          updated = true;
          return {
            ...item,
            primarySubjectCreationId: destinationCreationId,
            primary_subject_creation_id: destinationCreationId,
            canReassign: true,
            output: item?.output
              ? {
                  ...item.output,
                  primarySubjectCreationId: destinationCreationId,
                  primary_subject_creation_id: destinationCreationId,
                }
              : item?.output,
          };
        })
      );

      return updated;
    },
    []
  );

  const applyImageRename = useCallback(
    ({ imageOutputId, result } = {}) => {
      if (!imageOutputId || !result) return false;

      let updated = false;
      setMediaItems((currentItems) =>
        currentItems.map((item) => {
          if (String(item?.imageOutputId || item?.outputId || item?.id || "") !== imageOutputId) {
            return item;
          }

          updated = true;
          const nextItem = applyImageOutputDisplayNameResult(item, result);
          return {
            ...nextItem,
            title: getImageOutputDisplayTitle(nextItem),
          };
        })
      );

      return updated;
    },
    []
  );


  return {
    mediaItems,
    historyStatus,
    historyError,
    hasMoreHistory: pageInfo.hasNextPage,
    isLoadingMoreHistory: historyStatus === "loading_more",
    loadImageGenerationHistory,
    loadMoreImageGenerationHistory,
    prependGeneration,
    prependPendingGeneration,
    resolvePendingGeneration,
    failPendingGeneration,
    applyImageReassignment,
    applyImageRename,
  };
}