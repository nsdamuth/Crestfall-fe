import { notFound } from "next/navigation";

import IngredientSlotPreviewClient from "./IngredientSlotPreviewClient";

export default function IngredientSlotPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <IngredientSlotPreviewClient />;
}
