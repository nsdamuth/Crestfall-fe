"use client";

import MechanicsModuleAssembly from "./mechanics-module-assembly/MechanicsModuleAssembly";
import {
  normalizeMechanicsDocument,
} from "./mechanics-core/mechanicsDocumentNormalization.js";

export default function MechanicsModuleFieldsSection({
  form,
  updateDataField,
  replaceData,
}) {
  const canReplaceData = typeof replaceData === "function";

  function replaceMechanicsData(nextData) {
    if (!canReplaceData) return false;
    replaceData(normalizeMechanicsDocument(nextData));
    return true;
  }

  return (
    <MechanicsModuleAssembly
      mechanicsData={form?.data || {}}
      updateDataField={updateDataField}
      canReplaceData={canReplaceData}
      onReplaceMechanicsData={replaceMechanicsData}
    />
  );
}
