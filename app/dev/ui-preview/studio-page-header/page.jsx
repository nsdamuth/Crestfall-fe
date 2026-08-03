import { notFound } from "next/navigation";
import StudioPageHeaderPreviewClient from "./StudioPageHeaderPreviewClient";

export default function StudioPageHeaderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioPageHeaderPreviewClient />;
}
