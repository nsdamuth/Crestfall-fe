"use client";

import { Share2 } from "lucide-react";

export default function ProfileShareButtonView({
  buttonLabel = "Share",
  onShare = null,
}) {
  return (
    <button
      type="button"
      onClick={() => onShare?.()}
      className="cf-btn cf-btn--secondary"
    >
      <Share2 size={14} />
      {buttonLabel}
    </button>
  );
}
