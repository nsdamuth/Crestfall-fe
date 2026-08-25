"use client";

import { useMemo } from "react";

import { projectCommunityCreations } from "@/lib/shared/presentation/communityPresentation";
import CommunityV2Mockup from "./CommunityV2Mockup";

export default function CommunityV2Live({ creations = [], loadError = null } = {}) {
  const items = useMemo(() => projectCommunityCreations(creations), [creations]);

  return <CommunityV2Mockup live creations={items} loadError={loadError} />;
}
