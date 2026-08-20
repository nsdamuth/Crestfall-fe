"use client";

import { useEffect, useMemo, useState } from "react";

import {
  formatWalletProfileJsonData,
  formatWalletProfileJsonText,
  validateWalletProfileJsonText,
} from "./walletProfileJsonEditor.validation";
import {
  WALLET_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME,
  WALLET_PROFILE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE,
  buildWalletProfileJsonAiAuthoringGuide,
} from "./walletProfileJsonAiAuthoringGuide";

export function useWalletProfileJsonEditorViewModel({
  value = {},
  onApply = null,
  onClose = null,
} = {}) {
  const sourceText = useMemo(() => formatWalletProfileJsonData(value), [value]);
  const [jsonText, setJsonText] = useState(sourceText);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");
  const [guideDownloadStatus, setGuideDownloadStatus] = useState("idle");

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

  function handleChangeJson(nextValue) {
    setJsonText(String(nextValue ?? ""));
    clearValidationState();
    setCopyStatus("idle");
  }

  async function handleCopy() {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }
      await navigator.clipboard.writeText(jsonText);
      setCopyStatus("copied");
      setStatusMessage("Wallet Profile JSON copied to the clipboard.");
    } catch (error) {
      setCopyStatus("error");
      setStatusMessage(
        error?.message || "Wallet Profile JSON could not be copied."
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

      const guideText = buildWalletProfileJsonAiAuthoringGuide(value);
      const guideBlob = new Blob([guideText], {
        type: WALLET_PROFILE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE,
      });
      objectUrl = URL.createObjectURL(guideBlob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = WALLET_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME;
      anchor.rel = "noopener";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setGuideDownloadStatus("downloaded");
      setStatusMessage(
        "AI authoring guide downloaded with the current Wallet Profile JSON and definition-only instructions."
      );
    } catch (error) {
      setGuideDownloadStatus("error");
      setStatusMessage(
        error?.message || "The AI authoring guide could not be downloaded."
      );
    } finally {
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    }
  }

  function handleFormat() {
    const result = formatWalletProfileJsonText(jsonText);
    if (!result.valid) {
      setErrors([result.error]);
      setWarnings([]);
      setStatusMessage("Fix the JSON syntax before formatting.");
      return;
    }

    setJsonText(result.text);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("JSON formatted. No Wallet Profile builder data was changed.");
  }

  function handleReset() {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("Draft reset from the current visual editor state.");
    setCopyStatus("idle");
  }

  function handleValidateAndApply() {
    const result = validateWalletProfileJsonText(jsonText);
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
        : "Wallet Profile JSON validated and applied."
    );
    onClose?.();
  }

  return {
    title: "Wallet Profile JSON Editor",
    description:
      "Copy, inspect, or replace the complete authored Wallet Profile. Validate & Apply updates the current visual editor only; use the page Save action to persist it.",
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
