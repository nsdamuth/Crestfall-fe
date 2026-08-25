import { notFound } from "next/navigation";

import AccountV2PagePreviewClient from "./AccountV2PagePreviewClient";

// Fixture mirror of the full Account v2 draft, so this and future
// sessions can verify the whole page without auth. Harness only,
// never product; the staging address is /studio/v2/account.
export default function AccountV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AccountV2PagePreviewClient />;
}
