import { notFound } from "next/navigation";

import CreationEditShellPreviewClient from "./CreationEditShellPreviewClient";

export default function CreationEditShellPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <CreationEditShellPreviewClient />;
}
