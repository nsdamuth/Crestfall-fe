"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape). Owns
// Next.js navigation and composes the existing `CreationImageLibraryPage`
// (components/studio/my-creations/image-library/**) into a ReactNode
// slot, exactly the way ../Editor.jsx composes the rest of the
// creation-edit-shell lineage. RULED 11 Aug 2026 (Sprint H render
// review, item 4): showBackLink={false} removes that package's own
// inner "Back to editor" control (it routed to the legacy
// /studio/my-creations/[id]/edit address), leaving this page's
// origin-aware Back below as the only back path.
import { useRouter, useSearchParams } from "next/navigation";

import CreationImageLibraryPage from "@/components/studio/my-creations/image-library/CreationImageLibraryPage";

import ImageLibraryView from "./image-library/ImageLibrary.view";
import { useImageLibraryViewModel } from "./image-library/useImageLibraryViewModel";

export default function ImageLibrary({ creationId, originOverride }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = originOverride !== undefined ? originOverride : searchParams.get("origin");

  const { backHref } = useImageLibraryViewModel({ creationId, origin });

  return (
    <ImageLibraryView
      creationId={creationId}
      backLabel="Back to editor"
      onBack={() => router.push(backHref)}
      libraryPanel={
        <CreationImageLibraryPage creationId={creationId} showBackLink={false} />
      }
    />
  );
}
