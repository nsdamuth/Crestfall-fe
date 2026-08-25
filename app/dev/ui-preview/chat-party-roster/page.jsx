import { notFound } from "next/navigation";
import ChatPartyRosterPreviewClient from "./ChatPartyRosterPreviewClient";

export default function ChatPartyRosterPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatPartyRosterPreviewClient />;
}
