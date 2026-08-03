import { notFound } from "next/navigation";

import CharacterPreviewPreviewClient from "./CharacterPreviewPreviewClient";

export default function CharacterPreviewPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterPreviewPreviewClient />;
}
