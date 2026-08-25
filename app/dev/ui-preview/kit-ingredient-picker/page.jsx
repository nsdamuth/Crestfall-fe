import { notFound } from "next/navigation";

import KitIngredientPickerPreviewClient from "./KitIngredientPickerPreviewClient";

export default function KitIngredientPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitIngredientPickerPreviewClient />;
}
