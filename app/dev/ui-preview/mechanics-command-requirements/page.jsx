import { notFound } from "next/navigation";
import MechanicsCommandRequirementsPreviewClient from "./MechanicsCommandRequirementsPreviewClient";

export default function MechanicsCommandRequirementsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsCommandRequirementsPreviewClient />;
}
