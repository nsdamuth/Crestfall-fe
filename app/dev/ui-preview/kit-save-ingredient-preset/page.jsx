import { notFound } from "next/navigation";

import KitSaveIngredientPresetPreviewClient from "./KitSaveIngredientPresetPreviewClient";

export default function KitSaveIngredientPresetPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitSaveIngredientPresetPreviewClient />;
}
