import { notFound } from "next/navigation";
import PublicProfileBadgesPreviewClient from "./PublicProfileBadgesPreviewClient";

export default function PublicProfileBadgesPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileBadgesPreviewClient />;
}
