import { notFound } from "next/navigation";

import RegistryLinkedCreationPickerPreviewClient from "./RegistryLinkedCreationPickerPreviewClient";

export default function RegistryLinkedCreationPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RegistryLinkedCreationPickerPreviewClient />;
}
