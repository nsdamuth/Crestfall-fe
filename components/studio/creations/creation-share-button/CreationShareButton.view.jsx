"use client";

import { Share2 } from "lucide-react";

export default function CreationShareButtonView({
  buttonLabel = "Share",
  disabled = false,
  compact = false,
  ariaLabel = "Share",
  onShare = null,
}) {
  return (
    <button
      type="button"
      onClick={() => onShare?.()}
      disabled={disabled}
      aria-label={ariaLabel}
      className={
        compact
          ? "cf-btn cf-btn--secondary cf-btn--sm"
          : "cf-btn cf-btn--secondary"
      }
    >
      <Share2 size={compact ? 12 : 14} />
      {buttonLabel}
    </button>
  );
}
