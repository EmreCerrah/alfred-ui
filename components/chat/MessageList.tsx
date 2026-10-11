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
      <div
        className="flex flex-1 flex-col items-center justify-center gap-3 select-none"
        style={{ color: "var(--color-dim)" }}
      >
        {/* Stylised top-hat icon using pure text/mono — no image */}
        <span
          className="font-mono text-4xl"
          role="img"
          aria-label="Alfred"
          style={{ color: "var(--color-muted)" }}
        >
          🎩
        </span>
        <div className="flex flex-col items-center gap-1">
          <p
            className="hud-label"
            style={{ color: "var(--color-muted)", letterSpacing: "0.18em" }}
          >
            KOMUTA HAZIR
          </p>
          <p className="text-sm" style={{ color: "var(--color-dim)" }}>
            Bir mesaj yazarak başlayın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 relative z-10"
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
