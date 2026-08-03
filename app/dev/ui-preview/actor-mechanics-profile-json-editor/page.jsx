import { notFound } from "next/navigation";

import ActorMechanicsProfileJsonEditorPreviewClient from "./ActorMechanicsProfileJsonEditorPreviewClient";

export default function ActorMechanicsProfileJsonEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ActorMechanicsProfileJsonEditorPreviewClient />;
}
