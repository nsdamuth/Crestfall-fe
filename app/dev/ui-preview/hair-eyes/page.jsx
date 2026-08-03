import { notFound } from "next/navigation";

import HairEyesPreviewClient from "./HairEyesPreviewClient";

export default function HairEyesPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <HairEyesPreviewClient />;
}
