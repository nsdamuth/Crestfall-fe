import { notFound } from "next/navigation";

import CreatorCardPreviewClient from "./CreatorCardPreviewClient";

export default function CreatorCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorCardPreviewClient />;
}
