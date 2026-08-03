import { notFound } from "next/navigation";

import MechanicsDocumentCorePreviewClient from "./MechanicsDocumentCorePreviewClient";

export default function MechanicsDocumentCorePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <MechanicsDocumentCorePreviewClient />;
}
