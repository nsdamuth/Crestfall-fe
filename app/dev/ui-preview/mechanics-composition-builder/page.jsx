import { notFound } from "next/navigation";

import MechanicsCompositionBuilderPreviewClient from "./MechanicsCompositionBuilderPreviewClient";

export default function MechanicsCompositionBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsCompositionBuilderPreviewClient />;
}
