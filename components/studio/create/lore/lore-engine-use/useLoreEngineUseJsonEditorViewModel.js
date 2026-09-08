"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatLoreEngineUseJsonData,
  formatLoreEngineUseJsonText,
  validateLoreEngineUseJsonText,
} from "./loreEngineUseJsonEditor.validation";

function safeFilename(value) {
  const normalized = String(value || "Lore")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${normalized || "Lore"}_engine_use.json`;
}

export function useLoreEngineUseJsonEditorViewModel({
  configuration = {},
  source = {},
  storyContextOptions = { scenarios: [], roomTemplates: [] },
  storyContextLoadStatus = "IDLE",
  onApply = null,
  onClose = null,
} = {}) {
  const sourceText = useMemo(
    () => formatLoreEngineUseJsonData(configuration),
    [configuration]
  );
  const [jsonText, setJsonText] = useState(sourceText);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");
  const [downloadStatus, setDownloadStatus] = useState("idle");

  useEffect(() => {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
    setCopyStatus("idle");
    setDownloadStatus("idle");
  }, [sourceText]);

  const lineCount = useMemo(() => String(jsonText || "").split("\n").length, [jsonText]);
  const characterCount = String(jsonText || "").length;
  const hasDraftChanges = jsonText !== sourceText;
  const canApply = Boolean(String(jsonText || "").trim());

  function clearValidationState() {
    setErrors([]);
    setWarnings([]);
    setStatusMessage("");
  }

  function onChangeJson(value) {
    setJsonText(String(value ?? ""));
    clearValidationState();
    setCopyStatus("idle");
    setDownloadStatus("idle");
  }

  async function onCopy() {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }
      await navigator.clipboard.writeText(jsonText);
      setCopyStatus("copied");
      setStatusMessage("Engine Use JSON copied to the clipboard.");
    } catch (error) {
      setCopyStatus("error");
      setStatusMessage(error?.message || "Engine Use JSON could not be copied.");
    }
  }

  function onDownload() {
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
      const blob = new Blob([jsonText], { type: "application/json" });
      objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = safeFilename(source?.title);
      anchor.rel = "noopener";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setDownloadStatus("downloaded");
      setStatusMessage("Engine Use JSON downloaded.");
    } catch (error) {
      setDownloadStatus("error");
      setStatusMessage(error?.message || "Engine Use JSON could not be downloaded.");
    } finally {
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    }
  }

  function onFormat() {
    const result = formatLoreEngineUseJsonText(jsonText);
    if (!result.valid) {
      setErrors([result.error]);
      setWarnings([]);
      setStatusMessage("Fix the JSON syntax before formatting.");
      return;
    }
    setJsonText(result.text);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("JSON formatted. The Engine Use form was not changed.");
  }

  function onReset() {
    setJsonText(sourceText);
    setErrors([]);
    setWarnings([]);
    setStatusMessage("Draft reset from the current Engine Use form.");
    setCopyStatus("idle");
    setDownloadStatus("idle");
  }

  function onValidateAndApply() {
    const result = validateLoreEngineUseJsonText(jsonText, {
      source,
      storyContextOptions,
      storyContextLoadStatus,
    });
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
        : "Engine Use JSON validated and applied."
    );
    onClose?.();
  }

  return {
    title: "Engine Use JSON",
    description:
      "Copy, download, or replace the complete Engine Use authoring configuration. Validate & Apply updates this open form only; it does not submit, index, activate, publish, or alter the Lore document.",
    jsonText,
    errors,
    warnings,
    statusMessage,
    copyStatus,
    downloadStatus,
    canApply,
    hasDraftChanges,
    characterCount,
    lineCount,
    onClose,
    onChangeJson,
    onCopy,
    onDownload,
    onFormat,
    onReset,
    onValidateAndApply,
  };
}
