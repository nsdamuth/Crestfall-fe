import { notFound } from "next/navigation";
import PublicProfileCreationGridPreviewClient from "./PublicProfileCreationGridPreviewClient";

export default function PublicProfileCreationGridPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileCreationGridPreviewClient />;
}
