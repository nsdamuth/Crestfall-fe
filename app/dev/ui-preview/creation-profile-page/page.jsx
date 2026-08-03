import { notFound } from "next/navigation";

import CreationProfilePagePreviewClient from "./CreationProfilePagePreviewClient";

export default function CreationProfilePagePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationProfilePagePreviewClient />;
}
