import { notFound } from "next/navigation";

import VaultV2PagePreviewClient from "./VaultV2PagePreviewClient";

// Fixture mirror of the full Vault v2 composition, so this and future
// sessions can verify the whole page without auth. Harness only,
// never product; the product staging address is /studio/v2/vault.
export default function VaultV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <VaultV2PagePreviewClient />;
}
