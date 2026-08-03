import { notFound } from "next/navigation";

import CharacterColorPalettePreviewClient from "./CharacterColorPalettePreviewClient";

export default function CharacterColorPalettePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterColorPalettePreviewClient />;
}
