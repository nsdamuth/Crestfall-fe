"use client";

import { useMemo } from "react";

import { projectCreationsToVaultItems } from "@/lib/shared/presentation/vaultPresentation";
import VaultV2Mockup from "./VaultV2Mockup";

export default function VaultV2Live({
  creations = [],
  loadError = null,
} = {}) {
  const items = useMemo(
    () => projectCreationsToVaultItems(creations, { isOwn: true }),
    [creations]
  );

  return (
    <VaultV2Mockup
      live
      items={items}
      loadError={loadError}
    />
  );
}
