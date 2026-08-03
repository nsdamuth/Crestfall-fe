import { notFound } from "next/navigation";

import ProgressionProfileBuilderPreviewClient from "./ProgressionProfileBuilderPreviewClient";

export default function ProgressionProfileBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ProgressionProfileBuilderPreviewClient />;
}
