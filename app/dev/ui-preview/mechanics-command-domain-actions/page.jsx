import { notFound } from "next/navigation";

import MechanicsCommandDomainActionsPreviewClient from "./MechanicsCommandDomainActionsPreviewClient.jsx";

export default function MechanicsCommandDomainActionsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsCommandDomainActionsPreviewClient />;
}
