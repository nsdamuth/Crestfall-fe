import { notFound } from "next/navigation";
import MechanicsCompatibilityBaselinePreviewClient from "./MechanicsCompatibilityBaselinePreviewClient";
export default function MechanicsCompatibilityBaselinePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsCompatibilityBaselinePreviewClient />;
}
