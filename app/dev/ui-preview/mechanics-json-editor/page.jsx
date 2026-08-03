import { notFound } from "next/navigation";

import MechanicsJsonEditorPreviewClient from "./MechanicsJsonEditorPreviewClient";

export default function MechanicsJsonEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsJsonEditorPreviewClient />;
}
