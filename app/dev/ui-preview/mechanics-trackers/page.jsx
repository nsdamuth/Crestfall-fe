import { notFound } from "next/navigation";

import MechanicsTrackersPreviewClient from "./MechanicsTrackersPreviewClient";

export default function MechanicsTrackersPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsTrackersPreviewClient />;
}
