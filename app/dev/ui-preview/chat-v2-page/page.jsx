import { notFound } from "next/navigation";
import ChatV2PagePreviewClient from "./ChatV2PagePreviewClient";

export default function ChatV2PagePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ChatV2PagePreviewClient />;
}
