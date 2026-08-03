import { notFound } from "next/navigation";

import ActorMechanicsProfileAttachmentPreviewClient from "./ActorMechanicsProfileAttachmentPreviewClient";

export default function ActorMechanicsProfileAttachmentPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ActorMechanicsProfileAttachmentPreviewClient />;
}
