import { notFound } from "next/navigation";

import MechanicsGuardsPreviewClient from "./MechanicsGuardsPreviewClient";

export default function MechanicsGuardsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsGuardsPreviewClient />;
}
