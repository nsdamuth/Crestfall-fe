import { notFound } from "next/navigation";

import CustomIngredientEditorPreviewClient from "./CustomIngredientEditorPreviewClient";

export default function CustomIngredientEditorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CustomIngredientEditorPreviewClient />;
}
