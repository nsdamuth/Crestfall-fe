"use client";

import { useMemo, useState } from "react";

import {
  VIDEO_DIRECTOR_JSON_AI_GUIDE_FILENAME,
  VIDEO_DIRECTOR_JSON_AI_GUIDE_MIME_TYPE,
  buildVideoDirectorJsonAiAuthoringGuide,
  buildVideoDirectorJsonDocument,
  formatVideoDirectorJsonData,
  formatVideoDirectorJsonText,
  validateVideoDirectorJsonText,
  videoDirectorDocumentToCueState,
} from "./videoDirectorJsonEditor.js";

export function useVideoDirectorJsonEditorViewModel({
  customPrompt = "",
  cues = [],
  durationSeconds = 5,
  aspectRatio = "",
  quality = "",
  durationMin = 5,
  durationMax = 30,
  durationStep = 5,
  allowedAspectRatios = [],
  allowedQualities = [],
  onApply = null,
} = {}) {
  const sourceDocument = useMemo(
    () =>
      buildVideoDirectorJsonDocument({
        customPrompt,
        cues,
        durationSeconds,
        aspectRatio,
        quality,
      }),
    [customPrompt, cues, durationSeconds, aspectRatio, quality]
  );
  const sourceText = useMemo(
    () => formatVideoDirectorJsonData(sourceDocument),
    [sourceDocument]
  );
  const validationOptions = useMemo(
    () => ({
      durationMin,
      durationMax,
      durationStep,
      allowedAspectRatios,
      allowedQualities,
    }),
    [
      durationMin,
      durationMax,
      durationStep,
      allowedAspectRatios,
      allowedQualities,
    ]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [jsonText, setJsonText] = useState(sourceText);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");
  const [guideDownloadStatus, setGuideDownloadStatus] = useState("idle");

  const hasDraftChanges = jsonText !== sourceText;
  const characterCount = jsonText.length;
  const lineCount = jsonText ? jsonText.split("\n").length : 0;

  function clearValidationState() {
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
  }

  function handleOpen() {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
    setCopyStatus("idle");
    setGuideDownloadStatus("idle");
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleChangeJson(value) {
    setJsonText(String(value ?? ""));
    clearValidationState();
    setCopyStatus("idle");
  }

  async function handleCopy() {
    try {
      if (
        typeof navigator === "undefined" ||
        !navigator.clipboard?.writeText
      ) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }

      await navigator.clipboard.writeText(jsonText);
      setCopyStatus("copied");
      setStatusMessage("Video Director JSON copied to the clipboard.");
    } catch (error) {
      setCopyStatus("error");
      setStatusMessage(
        error?.message || "Video Director JSON could not be copied."
      );
    }
  }

  function handleDownloadAiGuide() {
    let objectUrl = "";

    try {
      if (
        typeof document === "undefined" ||
        typeof Blob === "undefined" ||
        typeof URL === "undefined" ||
        typeof URL.createObjectURL !== "function"
      ) {
        throw new Error("File downloads are unavailable in this browser.");
      }

      const guideText = buildVideoDirectorJsonAiAuthoringGuide(
        sourceDocument,
        validationOptions
      );
      const guideBlob = new Blob([guideText], {
        type: VIDEO_DIRECTOR_JSON_AI_GUIDE_MIME_TYPE,
      });

      objectUrl = URL.createObjectURL(guideBlob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = VIDEO_DIRECTOR_JSON_AI_GUIDE_FILENAME;
      anchor.rel = "noopener";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setGuideDownloadStatus("downloaded");
      setStatusMessage(
        "AI authoring guide downloaded with the current Director JSON and asset-authority rules."
      );
    } catch (error) {
      setGuideDownloadStatus("error");
      setStatusMessage(
        error?.message || "The AI authoring guide could not be downloaded."
      );
    } finally {
      if (objectUrl) {
        setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
      }
    }
  }

  function handleFormat() {
    const result = formatVideoDirectorJsonText(jsonText);

    if (!result.valid) {
      setErrors([result.error]);
      setWarnings([]);
      setStatusMessage("Fix the JSON syntax before formatting.");
      return;
    }

    setJsonText(result.text);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("JSON formatted. Video composer state was not changed.");
  }

  function handleReset() {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("Draft reset from the current Video Director state.");
    setCopyStatus("idle");
  }

  function handleValidateAndApply() {
    const result = validateVideoDirectorJsonText(jsonText, validationOptions);

    setErrors(result.errors);
    setWarnings(result.warnings);

    if (!result.valid || !result.data) {
      setStatusMessage(
        `${result.errors.length} validation ${
          result.errors.length === 1 ? "error" : "errors"
        } must be fixed before the JSON can be applied.`
      );
      return;
    }

    const applied = {
      ...result.data,
      cues: videoDirectorDocumentToCueState(result.data),
    };

    onApply?.(applied);
    setJsonText(result.formattedText);
    setStatusMessage("Video Director JSON validated and applied.");
    setIsOpen(false);
  }

  return {
    isOpen,
    onOpen: handleOpen,
    modalProps: {
      title: "Video Director JSON Editor",
      description:
        "Author the overall video prompt, precise timeline cues, duration, aspect ratio, and quality. Asset selections stay manual and are never part of this JSON.",
      jsonText,
      errors,
      warnings,
      statusMessage,
      copyStatus,
      guideDownloadStatus,
      canApply: true,
      hasDraftChanges,
      characterCount,
      lineCount,
      onClose: handleClose,
      onChangeJson: handleChangeJson,
      onCopy: handleCopy,
      onDownloadAiGuide: handleDownloadAiGuide,
      onFormat: handleFormat,
      onReset: handleReset,
      onValidateAndApply: handleValidateAndApply,
    },
  };
}
