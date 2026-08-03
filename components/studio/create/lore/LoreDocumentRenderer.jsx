"use client";

import Link from "next/link";

import CreationShareButton from "@/components/studio/creations/CreationShareButton";
import LoreDocumentRendererView from "./lore-document-renderer/LoreDocumentRenderer.view";
import { useLoreDocumentRendererViewModel } from "./lore-document-renderer/useLoreDocumentRendererViewModel";

export default function LoreDocumentRenderer(props) {
  const viewProps = useLoreDocumentRendererViewModel(props);

  return (
    <LoreDocumentRendererView
      {...viewProps}
      LinkComponent={Link}
      ShareButtonComponent={CreationShareButton}
    />
  );
}
