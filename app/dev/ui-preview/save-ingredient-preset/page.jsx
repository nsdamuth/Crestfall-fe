import { notFound } from "next/navigation";

import SaveIngredientPresetPreviewClient from "./SaveIngredientPresetPreviewClient";

export default function SaveIngredientPresetPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SaveIngredientPresetPreviewClient />;
}
