import { notFound } from "next/navigation";

import MechanicsDefaultsPreviewClient from "./MechanicsDefaultsPreviewClient";

export default function MechanicsDefaultsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsDefaultsPreviewClient />;
}
