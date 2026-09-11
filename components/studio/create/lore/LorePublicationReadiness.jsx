"use client";

import { useCallback } from "react";
import Link from "next/link";

import LorePublicationReadinessView from "./lore-publication-readiness/LorePublicationReadiness.view";
import LoreEngineUse from "./LoreEngineUse";
import {
  mergeLoreEngineUseAuthoringIntoDraftDocument,
} from "./lore-engine-use/loreEngineUseJsonEditor.validation";
import { useLorePublicationReadinessViewModel } from "./lore-publication-readiness/useLorePublicationReadinessViewModel";

export default function LorePublicationReadiness(props) {
  const viewProps = useLorePublicationReadinessViewModel(props);
  const draftDocument =
    props.form?.data?.lore_document || props.form?.data?.loreDocument || {};

  const handleDraftEngineUseChange = useCallback(
    (configuration) => {
      if (typeof props.updateDataField !== "function") return;

      props.updateDataField(
        "lore_document",
        mergeLoreEngineUseAuthoringIntoDraftDocument(
          draftDocument,
          configuration
        )
      );
    },
    [draftDocument, props.updateDataField]
  );

  return (
    <LorePublicationReadinessView
      {...viewProps}
      LinkComponent={Link}
      engineUsePanel={
        <LoreEngineUse
          creationId={props.creationId}
          draftDocument={draftDocument}
          draftTitle={props.form?.title || ""}
          onDraftEngineUseChange={handleDraftEngineUseChange}
        />
      }
    />
  );
}
