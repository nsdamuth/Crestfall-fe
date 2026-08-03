import { notFound } from "next/navigation";

import ActorMechanicsProfileEditorPreviewClient from "./ActorMechanicsProfileEditorPreviewClient";

export default function ActorMechanicsProfileEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ActorMechanicsProfileEditorPreviewClient />;
}
