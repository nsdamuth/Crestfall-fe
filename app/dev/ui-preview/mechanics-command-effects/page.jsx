import { notFound } from "next/navigation";
import MechanicsCommandEffectsPreviewClient from "./MechanicsCommandEffectsPreviewClient";

export default function MechanicsCommandEffectsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsCommandEffectsPreviewClient />;
}
