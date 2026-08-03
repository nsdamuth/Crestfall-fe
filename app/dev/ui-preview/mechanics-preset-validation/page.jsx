import { notFound } from "next/navigation";

import MechanicsPresetValidationPreviewClient from "./MechanicsPresetValidationPreviewClient";

export default function MechanicsPresetValidationPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsPresetValidationPreviewClient />;
}
