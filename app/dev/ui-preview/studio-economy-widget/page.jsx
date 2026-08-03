import { notFound } from "next/navigation";

import StudioEconomyWidgetPreviewClient from "./StudioEconomyWidgetPreviewClient";

export default function StudioEconomyWidgetPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioEconomyWidgetPreviewClient />;
}
