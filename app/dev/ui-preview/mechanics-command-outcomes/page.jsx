import { notFound } from "next/navigation";

import MechanicsCommandOutcomesPreviewClient from "./MechanicsCommandOutcomesPreviewClient";

export default function MechanicsCommandOutcomesPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsCommandOutcomesPreviewClient />;
}
