import { notFound } from "next/navigation";

import MechanicsDocumentOrchestrationPreviewClient from "./MechanicsDocumentOrchestrationPreviewClient";

export default function MechanicsDocumentOrchestrationPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsDocumentOrchestrationPreviewClient />;
}
