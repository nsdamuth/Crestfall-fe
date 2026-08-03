import { notFound } from "next/navigation";

import ScenarioReferencePickerPreviewClient from "./ScenarioReferencePickerPreviewClient";

export default function ScenarioReferencePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ScenarioReferencePickerPreviewClient />;
}
