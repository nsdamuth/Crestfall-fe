"use client";

import ChatTranscriptView from "./chat-transcript/ChatTranscript.view";
import { useChatTranscriptViewModel } from "./chat-transcript/useChatTranscriptViewModel";

export default function ChatTranscript(props) {
  const viewProps = useChatTranscriptViewModel(props);

  return <ChatTranscriptView {...viewProps} />;
}
