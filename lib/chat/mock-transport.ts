import type { ChatTransport, StreamHandlers, StreamHandle } from "./transport";

const CANNED_REPLIES: string[] = [
  "Merhaba! Ben Alfred, kişisel asistanınızım. Size nasıl yardımcı olabilirim?\n\nBugün planlarınız neler?",
  "Tabii ki yardımcı olabilirim. Şu an için birkaç seçeneğiniz var:\n\n1. Takviminizdeki etkinlikleri gözden geçirebiliriz\n2. Görev listenizi güncelleyebiliriz\n3. Hatırlatıcı ekleyebilirim\n\nHangisini tercih edersiniz?",
  "Anladım. Bu konuyu araştırıp size daha kapsamlı bir yanıt hazırlayabilirim. Lütfen bekleyin.\n\nAraştırma tamamlandı. İşte bulgularım:\n\n- Birinci madde burada\n- İkinci madde burada\n- Üçüncü madde burada",
  "Of course! Here is a quick summary:\n\n```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n```\n\nYou can call this function with any name you like.",
  "Certainly. Let me outline the key points:\n\nFirst, the architecture separates concerns cleanly. The UI layer communicates only through the `ChatTransport` interface, which means swapping the backend is entirely transparent to the components.\n\nSecond, in Phase 3 a server-side bridge will relay messages to the OpenClaw Gateway via WebSocket, keeping the auth token out of the browser entirely.\n\nThird, all state lives in React memory for now — no persistence layer yet.",
  "Harika bir soru! Kısaca özetlemek gerekirse:\n\n- **Alfred**, OpenClaw altyapısı üzerinde çalışan kişisel bir asistanıdır.\n- Bu arayüz Next.js 16 ve React 19 ile inşa edilmiştir.\n- Şu an **Mock mod** etkin; gerçek sunucu bağlantısı Faz 3'te gelecek.\n\nBaşka bir sorunuz var mı?",
  "I understand. To clarify:\n\n> The token must never be sent to the browser. It stays server-side.\n\nIn the Phase 3 implementation, the Next.js server will act as a proxy, forwarding messages over WebSocket to the OpenClaw Gateway and streaming deltas back to the client via a Server-Sent Events or ReadableStream response.",
];

let replyIndex = 0;

function nextReply(): string {
  const reply = CANNED_REPLIES[replyIndex % CANNED_REPLIES.length];
  replyIndex++;
  return reply;
}

export class MockTransport implements ChatTransport {
  send(
    _conversationId: string,
    _text: string,
    handlers: StreamHandlers
  ): StreamHandle {
    const reply = nextReply();
    const words = reply.split(" ");
    let wordIdx = 0;
    let aborted = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    // Initial latency to simulate "thinking"
    const thinkDelay = 400 + Math.random() * 300;

    const scheduleNext = () => {
      if (aborted) return;
      if (wordIdx >= words.length) {
        handlers.onDone();
        return;
      }
      const chunk = (wordIdx === 0 ? "" : " ") + words[wordIdx];
      wordIdx++;
      handlers.onDelta(chunk);
      const delay = 30 + Math.random() * 60;
      timerId = setTimeout(scheduleNext, delay);
    };

    timerId = setTimeout(scheduleNext, thinkDelay);

    return {
      abort() {
        aborted = true;
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
      },
    };
  }
}

export const mockTransport = new MockTransport();
