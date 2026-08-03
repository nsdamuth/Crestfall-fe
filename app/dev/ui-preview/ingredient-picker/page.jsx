import { notFound } from "next/navigation";

import IngredientPickerPreviewClient from "./IngredientPickerPreviewClient";

export default function IngredientPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <IngredientPickerPreviewClient />;
}
