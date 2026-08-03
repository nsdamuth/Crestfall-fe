import { notFound } from "next/navigation";

import CharacterIdentitySectionPreviewClient from "./CharacterIdentitySectionPreviewClient";

export default function CharacterIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterIdentitySectionPreviewClient />;
}
