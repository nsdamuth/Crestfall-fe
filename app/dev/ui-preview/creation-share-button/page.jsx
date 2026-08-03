import { notFound } from "next/navigation";

import CreationShareButtonPreviewClient from "./CreationShareButtonPreviewClient";

export default function CreationShareButtonPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationShareButtonPreviewClient />;
}
