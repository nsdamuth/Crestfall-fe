"use client";

import Link from "next/link";

import CreationShareButton from "@/components/studio/creations/CreationShareButton";
import LoreJsonEditorModal from "./lore-json-editor/LoreJsonEditorModal";
import LoreBuilderView from "./lore-builder/LoreBuilder.view";
import { useLoreBuilderViewModel } from "./lore-builder/useLoreBuilderViewModel";

export default function LoreBuilderShell(props) {
  const viewProps = useLoreBuilderViewModel(props);
  const editorViewProps = {
    ...viewProps.editorViewProps,
    jsonEditorSlot: viewProps.editorViewProps?.jsonEditorOpen ? (
      <LoreJsonEditorModal
        loreDocument={viewProps.editorViewProps.document}
        onApply={viewProps.editorViewProps.onApplyJsonDocument}
        onClose={viewProps.editorViewProps.onCloseJsonEditor}
      />
    ) : null,
  };
  const rendererViewProps = {
    ...viewProps.rendererViewProps,
    ShareButtonComponent: CreationShareButton,
  };

  return (
    <LoreBuilderView
      {...viewProps}
      editorViewProps={editorViewProps}
      rendererViewProps={rendererViewProps}
      LinkComponent={Link}
    />
  );
}
