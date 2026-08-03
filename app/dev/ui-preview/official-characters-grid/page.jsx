import { notFound } from "next/navigation";

import OfficialCharactersGridPreviewClient from "./OfficialCharactersGridPreviewClient";

export default function OfficialCharactersGridPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OfficialCharactersGridPreviewClient />;
}
