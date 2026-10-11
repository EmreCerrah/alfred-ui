"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Header } from "./Header";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { MessageList } from "@/components/chat/MessageList";
import { Composer } from "@/components/chat/Composer";

export function ChatShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    isStreaming,
    sendMessage,
    stopStreaming,
    newConversation,
  } = useChat();

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ background: "var(--color-cave)", color: "var(--color-steel)" }}
    >
      <Header
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        connectionStatus="mock"
      />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          onNewChat={newConversation}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main
          className="flex flex-1 flex-col overflow-hidden cave-scanlines"
          aria-label="Sohbet alanı"
        >
          <MessageList messages={activeConversation?.messages ?? []} />
          <Composer
            onSend={sendMessage}
            onStop={stopStreaming}
            isStreaming={isStreaming}
          />
        </main>
      </div>
    </div>
  );
}
