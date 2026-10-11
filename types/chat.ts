export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "streaming" | "done" | "error" | "aborted";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status?: MessageStatus;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
