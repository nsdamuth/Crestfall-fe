import { notFound } from "next/navigation";

import MechanicsPresetApplicationPreviewClient from "./MechanicsPresetApplicationPreviewClient";

export default function MechanicsPresetApplicationPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsPresetApplicationPreviewClient />;
}
