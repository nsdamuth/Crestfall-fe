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

export function useProfileShareButtonViewModel({ username = "" } = {}) {
  const [status, setStatus] = useState("idle");

  async function onShare() {
    const safeUsername = String(username || "").trim();

    if (!safeUsername || status === "copied") return;

    const profileUrl = `${window.location.origin}/studio/profile/${encodeURIComponent(
      safeUsername
    )}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(profileUrl);
      } else {
        copyWithFallback(profileUrl);
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
        ? "Copied"
        : status === "error"
          ? "Copy Failed"
          : "Share",
    onShare,
  };
}
