"use client";

import { useEffect, useRef } from "react";
import { type Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-zinc-600 select-none">
        <span className="text-4xl" role="img" aria-label="Alfred">
          🎩
        </span>
        <p className="text-sm">Bir mesaj yazarak başlayın.</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      role="log"
      aria-label="Sohbet mesajları"
      aria-live="polite"
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
