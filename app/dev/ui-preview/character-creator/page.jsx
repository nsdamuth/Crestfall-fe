import { notFound } from "next/navigation";
import CharacterCreatorPreviewClient from "./CharacterCreatorPreviewClient";

export default function CharacterCreatorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterCreatorPreviewClient />;
}
