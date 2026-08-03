import { notFound } from "next/navigation";

import MechanicsProgressionProfilePreviewClient from "./MechanicsProgressionProfilePreviewClient";

export default function MechanicsProgressionProfilePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsProgressionProfilePreviewClient />;
}
