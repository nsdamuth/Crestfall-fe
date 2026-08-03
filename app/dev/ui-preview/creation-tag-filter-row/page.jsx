import { notFound } from "next/navigation";

import CreationTagFilterRowPreviewClient from "./CreationTagFilterRowPreviewClient";

export default function CreationTagFilterRowPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationTagFilterRowPreviewClient />;
}
