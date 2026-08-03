import { notFound } from "next/navigation";

import AccountStubPagePreviewClient from "./AccountStubPagePreviewClient";

export default function AccountStubPagePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AccountStubPagePreviewClient />;
}
