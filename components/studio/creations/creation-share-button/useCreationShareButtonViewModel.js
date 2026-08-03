import { useState } from "react";

function copyWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function useCreationShareButtonViewModel({
  href = "",
  label = "Share",
  copiedLabel = "Copied",
  disabled = false,
  compact = false,
  ariaLabel = "",
} = {}) {
  const [status, setStatus] = useState("idle");
  const isDisabled = Boolean(disabled);

  async function onShare() {
    if (!href || isDisabled || status === "copied") return;

    const shareUrl = new URL(href, window.location.origin).toString();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        copyWithFallback(shareUrl);
      }

      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1600);
    }
  }

  return {
    buttonLabel:
      status === "copied"
        ? copiedLabel
        : status === "error"
          ? "Copy Failed"
          : label,
    disabled: isDisabled,
    compact: compact === true,
    ariaLabel: ariaLabel || label,
    onShare,
  };
}
