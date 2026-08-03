import { notFound } from "next/navigation";

import MechanicsCommandResolutionPreviewClient from "./MechanicsCommandResolutionPreviewClient";

export default function MechanicsCommandResolutionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsCommandResolutionPreviewClient />;
}
