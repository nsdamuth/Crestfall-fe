"use client";

import Link from "next/link";

import LorePublicationReadinessView from "./lore-publication-readiness/LorePublicationReadiness.view";
import LoreEngineUse from "./LoreEngineUse";
import { useLorePublicationReadinessViewModel } from "./lore-publication-readiness/useLorePublicationReadinessViewModel";

export default function LorePublicationReadiness(props) {
  const viewProps = useLorePublicationReadinessViewModel(props);
  return (
    <LorePublicationReadinessView
      {...viewProps}
      LinkComponent={Link}
      engineUsePanel={<LoreEngineUse creationId={props.creationId} />}
    />
  );
}
