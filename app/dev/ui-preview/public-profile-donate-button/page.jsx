import { notFound } from "next/navigation";
import PublicProfileDonateButtonPreviewClient from "./PublicProfileDonateButtonPreviewClient";

export default function PublicProfileDonateButtonPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PublicProfileDonateButtonPreviewClient />;
}
