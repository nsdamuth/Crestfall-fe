"use client";

import { useMemo } from "react";

import { projectCommunityCreations } from "@/lib/shared/presentation/communityPresentation";
import { projectCreationsToVaultItems } from "@/lib/shared/presentation/vaultPresentation";
import VaultV2Mockup from "./VaultV2Mockup";

export default function VaultV2Live({
  creations = [],
  communityCreations = [],
  loadError = null,
  savedSourceError = null,
} = {}) {
  const items = useMemo(
    () => projectCreationsToVaultItems(creations, { isOwn: true }),
    [creations]
  );
  const bookmarkCandidates = useMemo(
    () =>
      projectCommunityCreations(communityCreations).map((creation) => ({
        ...creation,
        isOwn: false,
        visibility: creation.isCanon ? "CANON" : "PUBLIC",
        isRemix: creation.isRemixable,
        status: "APPROVED",
      })),
    [communityCreations]
  );

  return (
    <VaultV2Mockup
      live
      items={items}
      bookmarkCandidates={bookmarkCandidates}
      loadError={loadError}
      savedSourceError={savedSourceError}
    />
  );
}
