import { notFound } from "next/navigation";

import CreationImageLibraryPagePreviewClient from "./CreationImageLibraryPagePreviewClient";

export default function CreationImageLibraryPagePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <CreationImageLibraryPagePreviewClient />;
}
