import { notFound } from "next/navigation";

import MechanicsStatusBlocksPreviewClient from "./MechanicsStatusBlocksPreviewClient";

export default function MechanicsStatusBlocksPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsStatusBlocksPreviewClient />;
}
