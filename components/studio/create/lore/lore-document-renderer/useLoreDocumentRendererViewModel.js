"use client";

import { useMemo } from "react";
import { normalizeLoreDocument } from "@/components/studio/create/lore/lore-editor/useLoreEditorViewModel";

export function useLoreDocumentRendererViewModel({
  document,
  title = "",
  description = "",
  creator = null,
  showTestBanner = false,
  testBannerText = "",
  compact = false,
  publicHref = "",
} = {}) {
  const normalizedDocument = useMemo(
    () => normalizeLoreDocument(document),
    [document]
  );

  return {
    document: normalizedDocument,
    title,
    description,
    creator,
    showTestBanner,
    testBannerText,
    compact,
    publicHref,
  };
}
