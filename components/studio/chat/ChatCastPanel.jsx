"use client";

import ChatCastPanelView from "./chat-cast-panel/ChatCastPanel.view";
import { useChatCastPanelViewModel } from "./chat-cast-panel/useChatCastPanelViewModel";

export default function ChatCastPanel(props) {
  const viewProps = useChatCastPanelViewModel(props);

  return <ChatCastPanelView {...viewProps} />;
}
