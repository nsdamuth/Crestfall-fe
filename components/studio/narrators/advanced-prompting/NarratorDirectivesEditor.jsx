"use client";

import NarratorDirectivesEditorView from "./narrator-directives/NarratorDirectivesEditor.view";
import { useNarratorDirectivesViewModel } from "./narrator-directives/useNarratorDirectivesViewModel";

export default function NarratorDirectivesEditor(props) {
  const viewProps = useNarratorDirectivesViewModel(props);

  return <NarratorDirectivesEditorView {...viewProps} />;
}
