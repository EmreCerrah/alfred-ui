"use client";

import { useCallback, useRef, useState } from "react";
import type { Conversation, Message } from "@/types/chat";
import type { ChatTransport, StreamHandle } from "@/lib/chat/transport";
import { mockTransport } from "@/lib/chat/mock-transport";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function makeConversation(title: string): Conversation {
  return {
    id: generateId(),
    title,
    messages: [],
    updatedAt: Date.now(),
  };
}

// Fixed seed timestamps — deterministic between server prerender and client hydration.
// Using a well-known past instant so relative-time labels are always "hours/days ago"
// rather than "just now", which would shift depending on when the module is evaluated.
const SEED_TS = 1_700_000_000_000; // 2023-11-14T22:13:20.000Z

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Hoş geldiniz",
    messages: [
      {
        id: "msg-sys-1",
        role: "system",
        content: "Alfred mock modunda çalışıyor.",
        createdAt: SEED_TS - 60_000,
        status: "done",
      },
      {
        id: "msg-1",
        role: "assistant",
        content:
          "Merhaba! Ben Alfred, kişisel asistanınızım. Size nasıl yardımcı olabilirim?",
        createdAt: SEED_TS - 55_000,
        status: "done",
      },
    ],
    updatedAt: SEED_TS - 55_000,
  },
];

export interface UseChatReturn {
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  activeConversation: Conversation | undefined;
  isStreaming: boolean;
  sendMessage: (text: string) => void;
  stopStreaming: () => void;
  newConversation: () => void;
}

export function useChat(transport: ChatTransport = mockTransport): UseChatReturn {
  const [conversations, setConversations] = useState<Conversation[]>(
    INITIAL_CONVERSATIONS
  );
  const [activeConversationId, setActiveConversationId] = useState<string>(
    INITIAL_CONVERSATIONS[0].id
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const streamHandleRef = useRef<StreamHandle | null>(null);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isStreaming) return;

      const now = Date.now();
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        createdAt: now,
        status: "done",
      };
      const assistantMsgId = generateId();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        createdAt: now + 1,
        status: "streaming",
      };

      // Determine target conversation
      const targetId = activeConversationId;

      setConversations((prev) => {
        const existing = prev.find((c) => c.id === targetId);
        if (existing) {
          return prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  messages: [...c.messages, userMsg, assistantMsg],
                  updatedAt: now,
                }
              : c
          );
        }
        // Shouldn't happen, but guard
        const newConv: Conversation = {
          id: targetId,
          title: text.slice(0, 40),
          messages: [userMsg, assistantMsg],
          updatedAt: now,
        };
        return [...prev, newConv];
      });

      setIsStreaming(true);

      const handle = transport.send(targetId, text, {
        onDelta(chunk: string) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: m.content + chunk }
                        : m
                    ),
                    updatedAt: Date.now(),
                  }
                : c
            )
          );
        },
        onDone() {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, status: "done" as const } : m
                    ),
                  }
                : c
            )
          );
          setIsStreaming(false);
          streamHandleRef.current = null;
        },
        onError(err: Error) {
          console.error("Chat transport error:", err);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, status: "error" as const, content: m.content || "[Hata oluştu]" }
                        : m
                    ),
                  }
                : c
            )
          );
          setIsStreaming(false);
          streamHandleRef.current = null;
        },
      });

      streamHandleRef.current = handle;
    },
    [activeConversationId, isStreaming, transport]
  );

  const stopStreaming = useCallback(() => {
    if (streamHandleRef.current) {
      streamHandleRef.current.abort();
      streamHandleRef.current = null;
    }
    setIsStreaming(false);
    // Mark last streaming message as aborted
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.status === "streaming" ? { ...m, status: "aborted" as const } : m
              ),
            }
          : c
      )
    );
  }, [activeConversationId]);

  const newConversation = useCallback(() => {
    const conv = makeConversation("Yeni sohbet");
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(conv.id);
  }, []);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    isStreaming,
    sendMessage,
    stopStreaming,
    newConversation,
  };
}
