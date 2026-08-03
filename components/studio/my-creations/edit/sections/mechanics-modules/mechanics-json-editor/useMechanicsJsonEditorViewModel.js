"use client";

import { useEffect, useMemo, useState } from "react";

import {
  formatMechanicsJsonData,
  formatMechanicsJsonText,
  validateMechanicsJsonText,
} from "./mechanicsJsonEditor.validation.js";
import {
  MECHANICS_JSON_AI_AUTHORING_GUIDE_FILENAME,
  MECHANICS_JSON_AI_AUTHORING_GUIDE_MIME_TYPE,
  buildMechanicsJsonAiAuthoringGuide,
} from "./mechanicsJsonAiAuthoringGuide.js";

export function useMechanicsJsonEditorViewModel({
  mechanicsData = {},
  onApply = null,
  onClose = null,
} = {}) {
  const sourceText = useMemo(
    () => formatMechanicsJsonData(mechanicsData),
    [mechanicsData]
  );
  const [jsonText, setJsonText] = useState(sourceText);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");
  const [guideDownloadStatus, setGuideDownloadStatus] =
    useState("idle");

  useEffect(() => {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
    setCopyStatus("idle");
    setGuideDownloadStatus("idle");
  }, [sourceText]);

  const lineCount = useMemo(
    () => String(jsonText || "").split("\n").length,
    [jsonText]
  );
  const characterCount = String(jsonText || "").length;
  const hasDraftChanges = jsonText !== sourceText;
  const canApply = Boolean(String(jsonText || "").trim());

  function clearValidationState() {
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
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
      setStatusMessage("JSON copied to the clipboard.");
    } catch (error) {
      setCopyStatus("error");
      setStatusMessage(
        error?.message || "JSON could not be copied."
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
        throw new Error(
          "File downloads are unavailable in this browser."
        );
      }

      const guideText =
        buildMechanicsJsonAiAuthoringGuide();
      const guideBlob = new Blob(
        [guideText],
        {
          type:
            MECHANICS_JSON_AI_AUTHORING_GUIDE_MIME_TYPE,
        }
      );

      objectUrl = URL.createObjectURL(guideBlob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download =
        MECHANICS_JSON_AI_AUTHORING_GUIDE_FILENAME;
      anchor.rel = "noopener";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setGuideDownloadStatus("downloaded");
      setStatusMessage(
        "AI authoring guide downloaded. Give it to an AI together with the current JSON and the behavior you want."
      );
    } catch (error) {
      setGuideDownloadStatus("error");
      setStatusMessage(
        error?.message ||
          "The AI authoring guide could not be downloaded."
      );
    } finally {
      if (objectUrl) {
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 0);
      }
    }
  }

  function handleFormat() {
    const result = formatMechanicsJsonText(jsonText);

    if (!result.valid) {
      setErrors([result.error]);
      setWarnings([]);
      setStatusMessage("Fix the JSON syntax before formatting.");
      return;
    }

    setJsonText(result.text);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("JSON formatted. No builder data was changed.");
  }

  function handleReset() {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("Draft reset from the current builder state.");
    setCopyStatus("idle");
  }

  function handleValidateAndApply() {
    const result = validateMechanicsJsonText(jsonText);

    setErrors(result.errors);
    setWarnings(result.warnings);

    if (!result.valid || !result.data) {
      setStatusMessage(
        `${result.errors.length} compliance ${
          result.errors.length === 1 ? "error" : "errors"
        } must be fixed before the JSON can be applied.`
      );
      return;
    }

    onApply?.(result.data);
    setJsonText(result.formattedText);
    setStatusMessage(
      result.warnings.length
        ? `Applied with ${result.warnings.length} normalization ${
            result.warnings.length === 1 ? "notice" : "notices"
          }.`
        : "Mechanics JSON validated and applied."
    );
    onClose?.();
  }

  return {
    title: "Mechanics JSON Editor",
    description:
      "Copy, inspect, or replace the complete authored Mechanics Module data. Validate & Apply updates the current builder only; use the page Save action to persist it.",
    jsonText,
    errors,
    warnings,
    statusMessage,
    copyStatus,
    guideDownloadStatus,
    canApply,
    hasDraftChanges,
    characterCount,
    lineCount,
    onClose,
    onChangeJson: handleChangeJson,
    onCopy: handleCopy,
    onDownloadAiGuide: handleDownloadAiGuide,
    onFormat: handleFormat,
    onReset: handleReset,
    onValidateAndApply: handleValidateAndApply,
  };
}
