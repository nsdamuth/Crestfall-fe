import { notFound } from "next/navigation";

import VoiceModulePickerPreviewClient from "./VoiceModulePickerPreviewClient";

export default function VoiceModulePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <VoiceModulePickerPreviewClient />;
}
