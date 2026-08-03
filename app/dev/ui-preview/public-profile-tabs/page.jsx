import { notFound } from "next/navigation";
import PublicProfileTabsPreviewClient from "./PublicProfileTabsPreviewClient";

export default function PublicProfileTabsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileTabsPreviewClient />;
}
