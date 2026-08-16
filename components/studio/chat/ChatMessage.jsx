"use client";

import ChatMessageView from "./chat-message/ChatMessage.view";
import { useChatMessageViewModel } from "./chat-message/useChatMessageViewModel";

export default function ChatMessage(props) {
  const viewProps = useChatMessageViewModel(props);

  return <ChatMessageView {...viewProps} />;
}
