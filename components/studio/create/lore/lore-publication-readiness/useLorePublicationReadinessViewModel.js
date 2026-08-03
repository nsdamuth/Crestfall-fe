"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelLoreValidation,
  fetchLoreValidationState,
  publishLoreValidatedRevision,
  submitLoreValidation,
} from "@/lib/client/studio/creations/loreValidationClient";
import {
  normalizeLoreDocument,
  validateLoreDocument,
} from "@/components/studio/create/lore/lore-editor/useLoreEditorViewModel";
import {
  LORE_PUBLICATION_READINESS_CONTRACT_VERSION,
  LORE_PUBLICATION_READINESS_LIMITS,
} from "./LorePublicationReadiness.contract";

const ACTIVE_VALIDATION_STATUSES = new Set([
  "QUEUED",
  "VALIDATING",
  "CANCELLING",
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function countBlocks(blocks = []) {
  return blocks.reduce((total, block) => {
    const nestedCount =
      block?.type === "two-column"
        ? (block.columns || []).reduce(
            (columnTotal, column) =>
              columnTotal + countBlocks(column?.blocks || []),
            0
          )
        : 0;

    return total + 1 + nestedCount;
  }, 0);
}

function summarizeDocument(document) {
  const chapters = Array.isArray(document?.chapters) ? document.chapters : [];
  let sectionCount = 0;
  let blockCount = 0;
  let imageCount = 0;
  let untitledChapterCount = 0;
  let untitledSectionCount = 0;

  for (const chapter of chapters) {
    if (!normalizeString(chapter?.title)) untitledChapterCount += 1;

    for (const section of chapter?.sections || []) {
      sectionCount += 1;
      if (!normalizeString(section?.title)) untitledSectionCount += 1;
      blockCount += countBlocks(section?.blocks || []);

      const stack = [...(section?.blocks || [])];
      while (stack.length) {
        const block = stack.shift();
        if (block?.type === "image") imageCount += 1;
        if (block?.type === "two-column") {
          for (const column of block.columns || []) {
            stack.push(...(column?.blocks || []));
          }
        }
      }
    }
  }

  return {
    chapterCount: chapters.length,
    sectionCount,
    blockCount,
    imageCount,
    untitledChapterCount,
    untitledSectionCount,
    characterCount: Array.isArray(document?.characterRefs)
      ? document.characterRefs.length
      : 0,
  };
}

function createCheck({ id, label, detail, complete, required = true }) {
  return {
    id,
    label,
    detail,
    complete: Boolean(complete),
    required,
  };
}

export function useLorePublicationReadinessViewModel({
  form = {},
  creationId = "",
  hasUnsavedChanges = false,
} = {}) {
  const [validationState, setValidationState] = useState({
    submissions: [],
    latest: null,
    publication: { active: null, releases: [] },
  });
  const [validationLoadStatus, setValidationLoadStatus] = useState("IDLE");
  const [validationLoadMessage, setValidationLoadMessage] = useState("");
  const [validationActionStatus, setValidationActionStatus] = useState("IDLE");
  const [validationActionMessage, setValidationActionMessage] = useState("");
  const [publicationActionStatus, setPublicationActionStatus] = useState("IDLE");
  const [publicationActionMessage, setPublicationActionMessage] = useState("");

  const document = useMemo(
    () =>
      normalizeLoreDocument(
        form?.data?.lore_document || form?.data?.loreDocument || {}
      ),
    [form?.data?.lore_document, form?.data?.loreDocument]
  );

  const issues = useMemo(() => validateLoreDocument(document), [document]);
  const summary = useMemo(() => summarizeDocument(document), [document]);

  const errors = issues.filter((item) => item.severity !== "WARNING");
  const warnings = issues.filter((item) => item.severity === "WARNING");
  const title = normalizeString(form?.title);
  const description = normalizeString(form?.description);
  const subtitle = normalizeString(document.subtitle);
  const summaryText = normalizeString(document.summary);

  const checks = [
    createCheck({
      id: "title",
      label: "Creation title is set",
      detail: "The public reader needs a clear Lore title.",
      complete: Boolean(title),
    }),
    createCheck({
      id: "description",
      label: "Creation description is set",
      detail: "The creation summary is used by discovery and reader surfaces.",
      complete: Boolean(description),
    }),
    createCheck({
      id: "chapters",
      label: "At least one chapter exists",
      detail: `${summary.chapterCount} chapter${summary.chapterCount === 1 ? "" : "s"} in the current editor.`,
      complete: summary.chapterCount > 0,
    }),
    createCheck({
      id: "sections",
      label: "At least one section exists",
      detail: `${summary.sectionCount} section${summary.sectionCount === 1 ? "" : "s"} in the current editor.`,
      complete: summary.sectionCount > 0,
    }),
    createCheck({
      id: "content",
      label: "Lore contains content blocks",
      detail: `${summary.blockCount} block${summary.blockCount === 1 ? "" : "s"} in the current editor.`,
      complete: summary.blockCount > 0,
    }),
    createCheck({
      id: "validation",
      label: "No blocking Lore validation errors",
      detail: errors.length
        ? `${errors.length} blocking issue${errors.length === 1 ? "" : "s"} remain.`
        : "The saved Lore document passes current structural validation.",
      complete: errors.length === 0,
    }),
    createCheck({
      id: "subtitle",
      label: "Publication subtitle is set",
      detail: "Recommended for a polished sourcebook-style cover page.",
      complete: Boolean(subtitle),
      required: false,
    }),
    createCheck({
      id: "archive-summary",
      label: "Archive summary is set",
      detail: "Recommended for readers and security-validation review.",
      complete: Boolean(summaryText),
      required: false,
    }),
    createCheck({
      id: "section-titles",
      label: "Every section has a title",
      detail: summary.untitledSectionCount
        ? `${summary.untitledSectionCount} untitled section${summary.untitledSectionCount === 1 ? "" : "s"} remain.`
        : "All sections have readable titles for navigation and deep links.",
      complete: summary.sectionCount > 0 && summary.untitledSectionCount === 0,
      required: false,
    }),
  ];

  const requiredChecks = checks.filter((check) => check.required);
  const completedRequiredCount = requiredChecks.filter(
    (check) => check.complete
  ).length;
  const completedCheckCount = checks.filter((check) => check.complete).length;
  const isAuthoringReady = completedRequiredCount === requiredChecks.length;
  const encodedCreationId = encodeURIComponent(creationId || "");
  const latestValidation = validationState.latest || null;
  const latestValidationStatus = normalizeString(
    latestValidation?.status
  ).toUpperCase();
  const isValidationActive = ACTIVE_VALIDATION_STATUSES.has(
    latestValidationStatus
  );
  const publicationState =
    validationState.publication && typeof validationState.publication === "object"
      ? validationState.publication
      : { active: null, releases: [] };
  const activePublication = publicationState.active || null;
  const publicationReleases = Array.isArray(publicationState.releases)
    ? publicationState.releases
    : [];
  const publishedSubmissionIds = new Set(
    publicationReleases
      .map((release) => normalizeString(release?.validationSubmissionId))
      .filter(Boolean)
  );
  const activeSnapshotHash = normalizeString(activePublication?.snapshotHash);
  const publishableValidation = validationState.submissions.find(
    (submission) =>
      normalizeString(submission?.status).toUpperCase() === "PASSED" &&
      !publishedSubmissionIds.has(normalizeString(submission?.id)) &&
      (!activeSnapshotHash ||
        normalizeString(submission?.snapshotHash) !== activeSnapshotHash)
  ) || null;
  const publicHref = creationId
    ? `/studio/creations/${encodedCreationId}`
    : "";

  const loadValidationState = useCallback(
    async ({ quiet = false } = {}) => {
      if (!creationId) return;
      if (!quiet) {
        setValidationLoadStatus("LOADING");
        setValidationLoadMessage("");
      }

      try {
        const nextState = await fetchLoreValidationState(creationId);
        setValidationState({
          submissions: Array.isArray(nextState?.submissions)
            ? nextState.submissions
            : [],
          latest: nextState?.latest || null,
          publication:
            nextState?.publication && typeof nextState.publication === "object"
              ? nextState.publication
              : { active: null, releases: [] },
        });
        setValidationLoadStatus("READY");
      } catch (error) {
        setValidationLoadStatus("ERROR");
        setValidationLoadMessage(
          error.message || "Lore validation status could not be loaded."
        );
      }
    },
    [creationId]
  );

  useEffect(() => {
    void loadValidationState();
  }, [loadValidationState]);

  useEffect(() => {
    if (!isValidationActive || !creationId) return undefined;

    const interval = window.setInterval(() => {
      void loadValidationState({ quiet: true });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [creationId, isValidationActive, loadValidationState]);

  const submitValidation = useCallback(async () => {
    if (
      !creationId ||
      hasUnsavedChanges ||
      validationActionStatus === "WORKING"
    ) {
      return;
    }

    setValidationActionStatus("WORKING");
    setValidationActionMessage("");

    try {
      await submitLoreValidation(creationId);
      setValidationActionStatus("SUCCESS");
      setValidationActionMessage(
        "The last saved Lore draft was added to the validation queue."
      );
      await loadValidationState({ quiet: true });
    } catch (error) {
      setValidationActionStatus("ERROR");
      setValidationActionMessage(
        error.message || "Lore validation could not be submitted."
      );
    }
  }, [
    creationId,
    hasUnsavedChanges,
    loadValidationState,
    validationActionStatus,
  ]);

  const publishValidatedRevision = useCallback(async () => {
    if (
      !creationId ||
      !publishableValidation?.id ||
      publicationActionStatus === "WORKING"
    ) {
      return;
    }

    setPublicationActionStatus("WORKING");
    setPublicationActionMessage("");

    try {
      await publishLoreValidatedRevision(
        creationId,
        publishableValidation.id
      );
      setPublicationActionStatus("SUCCESS");
      setPublicationActionMessage(
        "The validated Lore revision is now publicly available."
      );
      await loadValidationState({ quiet: true });
    } catch (error) {
      setPublicationActionStatus("ERROR");
      setPublicationActionMessage(
        error.message || "Validated Lore revision could not be published."
      );
    }
  }, [
    creationId,
    loadValidationState,
    publicationActionStatus,
    publishableValidation?.id,
  ]);

  const cancelValidation = useCallback(async () => {
    if (
      !creationId ||
      !latestValidation?.id ||
      validationActionStatus === "WORKING"
    ) {
      return;
    }

    setValidationActionStatus("WORKING");
    setValidationActionMessage("");

    try {
      await cancelLoreValidation(creationId, latestValidation.id);
      setValidationActionStatus("SUCCESS");
      setValidationActionMessage("Validation cancellation was requested.");
      await loadValidationState({ quiet: true });
    } catch (error) {
      setValidationActionStatus("ERROR");
      setValidationActionMessage(
        error.message || "Lore validation could not be cancelled."
      );
    }
  }, [
    creationId,
    latestValidation?.id,
    loadValidationState,
    validationActionStatus,
  ]);

  return {
    contractVersion: LORE_PUBLICATION_READINESS_CONTRACT_VERSION,
    checks,
    completedCheckCount,
    totalCheckCount: checks.length,
    completedRequiredCount,
    requiredCheckCount: requiredChecks.length,
    isAuthoringReady,
    hasUnsavedChanges: Boolean(hasUnsavedChanges),
    errors: errors.slice(0, LORE_PUBLICATION_READINESS_LIMITS.maxVisibleIssues),
    warnings: warnings.slice(0, LORE_PUBLICATION_READINESS_LIMITS.maxVisibleIssues),
    hiddenErrorCount: Math.max(
      0,
      errors.length - LORE_PUBLICATION_READINESS_LIMITS.maxVisibleIssues
    ),
    hiddenWarningCount: Math.max(
      0,
      warnings.length - LORE_PUBLICATION_READINESS_LIMITS.maxVisibleIssues
    ),
    summary,
    lifecycleStatus: normalizeString(form?.status || form?.reviewStatus) || "DRAFT",
    visibility: normalizeString(form?.visibility) || "PRIVATE",
    publicReleaseStatus: activePublication ? "PUBLIC" : "NOT PUBLISHED",
    contentRating:
      normalizeString(form?.contentRating || form?.content_rating) || "SFW",
    ownerPreviewHref: creationId
      ? `/studio/my-creations/${encodedCreationId}/preview`
      : "",
    validationSubmissions: validationState.submissions,
    latestValidation,
    validationLoadStatus,
    validationLoadMessage,
    validationActionStatus,
    validationActionMessage,
    publicationActionStatus,
    publicationActionMessage,
    isValidationActive,
    activePublication,
    publicationReleases,
    publishableValidation,
    publicHref,
    canSubmitValidation:
      Boolean(creationId) &&
      !hasUnsavedChanges &&
      isAuthoringReady &&
      !isValidationActive &&
      validationActionStatus !== "WORKING",
    canCancelValidation:
      Boolean(latestValidation?.id) &&
      ["QUEUED", "VALIDATING"].includes(latestValidationStatus) &&
      validationActionStatus !== "WORKING",
    canPublishValidatedRevision:
      Boolean(publishableValidation?.id) &&
      publicationActionStatus !== "WORKING",
    submitValidation,
    cancelValidation,
    publishValidatedRevision,
    refreshValidation: () => loadValidationState(),
  };
}
