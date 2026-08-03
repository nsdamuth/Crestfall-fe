"use client";

import MechanicsDocumentCoreView from "./MechanicsDocumentCore.view";
import { useMechanicsDocumentCoreViewModel } from "./useMechanicsDocumentCoreViewModel";

export default function MechanicsDocumentCore() {
  return <MechanicsDocumentCoreView {...useMechanicsDocumentCoreViewModel()} />;
}
