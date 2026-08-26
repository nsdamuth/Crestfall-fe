"use client";

import { useMemo } from "react";
import { normalizeLoreDocument } from "@/components/studio/create/lore/lore-editor/useLoreEditorViewModel";
import { buildLoreParchmentPresentation } from "./loreParchmentPresentation";

export function useLoreDocumentRendererViewModel({
  document,
  title = "",
  description = "",
  creator = null,
  showTestBanner = false,
  testBannerText = "",
  compact = false,
  publicHref = "",
  parchmentSeed = "",
} = {}) {
  const normalizedDocument = useMemo(
    () => normalizeLoreDocument(document),
    [document]
  );

  const parchmentPresentation = useMemo(
    () =>
      buildLoreParchmentPresentation({
        seed:
          parchmentSeed ||
          publicHref ||
          title ||
          normalizedDocument.eyebrow ||
          "crestfall-lore",
        chapterIds: normalizedDocument.chapters.map(
          (chapter, chapterIndex) => chapter.id || `chapter-${chapterIndex + 1}`
        ),
      }),
    [normalizedDocument, parchmentSeed, publicHref, title]
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
    parchmentPresentation,
  };
}
