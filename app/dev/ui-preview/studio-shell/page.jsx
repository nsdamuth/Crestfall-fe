import { notFound } from "next/navigation";

import StudioShellPreviewClient from "./StudioShellPreviewClient";

export default function StudioShellPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioShellPreviewClient />;
}
