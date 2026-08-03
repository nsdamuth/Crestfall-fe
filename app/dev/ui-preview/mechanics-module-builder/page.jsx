import { notFound } from "next/navigation";

import MechanicsModuleBuilderPreviewClient from "./MechanicsModuleBuilderPreviewClient";

export default function MechanicsModuleBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MechanicsModuleBuilderPreviewClient />;
}
