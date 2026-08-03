import { notFound } from "next/navigation";

import WeatherModuleConfigModalPreviewClient from "./WeatherModuleConfigModalPreviewClient";

export default function WeatherModuleConfigModalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <WeatherModuleConfigModalPreviewClient />;
}
