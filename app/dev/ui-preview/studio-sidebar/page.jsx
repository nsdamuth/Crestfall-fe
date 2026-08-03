import { notFound } from "next/navigation";

import StudioSidebarPreviewClient from "./StudioSidebarPreviewClient";

export default function StudioSidebarPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioSidebarPreviewClient />;
}
