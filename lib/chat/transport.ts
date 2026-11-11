export interface StreamHandlers {
  onDelta(chunk: string): void;
  onDone(): void;
  onError(err: Error): void;
}

export interface StreamHandle {
  abort(): void;
}

export interface ChatTransport {
  send(
    conversationId: string,
    text: string,
    handlers: StreamHandlers
  ): StreamHandle;
}
