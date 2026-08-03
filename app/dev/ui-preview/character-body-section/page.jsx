import { notFound } from "next/navigation";

import CharacterBodySectionPreviewClient from "./CharacterBodySectionPreviewClient";

export default function CharacterBodySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterBodySectionPreviewClient />;
}
