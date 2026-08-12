"use client";

import ChatComposerView from "./chat-composer/ChatComposer.view";
import { useChatComposerViewModel } from "./chat-composer/useChatComposerViewModel";

export default function ChatComposer(props) {
  const viewProps = useChatComposerViewModel(props);

  return <ChatComposerView {...viewProps} />;
}
