import { notFound } from "next/navigation";

import MechanicsCommandCorePreviewClient from "./MechanicsCommandCorePreviewClient";

export default function MechanicsCommandCorePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsCommandCorePreviewClient />;
}
