import { notFound } from "next/navigation";

import MechanicsModulePickerPreviewClient from "./MechanicsModulePickerPreviewClient";

export default function MechanicsModulePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsModulePickerPreviewClient />;
}
