import { notFound } from "next/navigation";

import DefaultClothingSelectorPreviewClient from "./DefaultClothingSelectorPreviewClient";

export default function DefaultClothingSelectorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DefaultClothingSelectorPreviewClient />;
}
