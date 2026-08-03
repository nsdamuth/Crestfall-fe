import { notFound } from "next/navigation";

import MechanicsModuleAssemblyPreviewClient from "./MechanicsModuleAssemblyPreviewClient";

export default function MechanicsModuleAssemblyPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MechanicsModuleAssemblyPreviewClient />;
}
