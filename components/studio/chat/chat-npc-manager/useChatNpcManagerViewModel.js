"use client";

import { useState } from "react";

/**
 * Disclosure (isOpen) is presentation-only local state per the LOOM view
 * hard rules; initialOpen seeds it for isolated preview/testing. Section
 * and entry data pass through unchanged; registry lifecycle mapping is
 * caller-owned (wave C5's chat page shell).
 */
export function useChatNpcManagerViewModel({
  title = "Manage Registry NPCs",
  summaryText = "0 loaded",
  initialOpen = false,
  loadingNotice = "",
  registryNotice = "",
  errorMessage = "",
  sections = [],
  onActivateNpc,
} = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    title,
    summaryText,
    isOpen,
    loadingNotice,
    registryNotice,
    errorMessage,
    sections: Array.isArray(sections) ? sections : [],
    onTogglePanel: () => setIsOpen((current) => !current),
    onActivateNpc: (actionId) => onActivateNpc?.(actionId),
  };
}
