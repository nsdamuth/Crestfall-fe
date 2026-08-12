"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape). Owns
// Next.js navigation and composes the existing, read-only
// `CreationImageLibraryPage` (components/studio/my-creations/image-library/**,
// NOT edited by this brief) into a ReactNode slot, exactly the way
// ../Editor.jsx composes the rest of the creation-edit-shell lineage.
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
      libraryPanel={<CreationImageLibraryPage creationId={creationId} />}
    />
  );
}
