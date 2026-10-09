# Alfred UI

Alfred is a personal assistant web interface built on Next.js 16. The UI communicates with a backend through a clean `ChatTransport` abstraction so that the real server connection can be swapped in (Phase 3) without touching any component code.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first, `@theme inline`) |
| Icons | lucide-react |
| Utilities | clsx, tailwind-merge, class-variance-authority |

## Architecture

```
Browser
  └─ ChatShell (Client Component)
       ├─ useChat(transport)          ← all conversation state
       │    └─ ChatTransport (interface)
       │         └─ MockTransport     ← Phase 2: simulated streaming
       │              (Phase 3: ServerTransport — Next.js route handler
       │               proxies WebSocket to the OpenClaw Gateway
       │               so the auth token never reaches the browser)
       ├─ ConversationSidebar
       ├─ MessageList → MessageBubble (safe Markdown renderer)
       └─ Composer (auto-grow, Enter/Shift+Enter, Stop button)
```

### Transport abstraction

`lib/chat/transport.ts` exports:

```ts
interface ChatTransport {
  send(conversationId: string, text: string, handlers: {
    onDelta(chunk: string): void;
    onDone(): void;
    onError(err: Error): void;
  }): { abort(): void };
}
```

In Phase 3 a `ServerTransport` will implement the same interface, posting to a Next.js API route that streams responses from the OpenClaw Gateway over WebSocket. The gateway auth token (`OPENCLAW_GATEWAY_TOKEN`) lives in the server environment only and never touches the browser.

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run typecheck  # Generate Next.js types then TypeScript type check (next typegen && tsc --noEmit)
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values for Phase 3:

```
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=<your-token>
```

**These variables must never use a `NEXT_PUBLIC_` prefix.** They are consumed server-side only.

## Status

**Phase 2 — Mock UI only.** No real network connection. The `MockTransport` simulates streaming replies from canned responses. Phase 3 will add the server-side WebSocket bridge to the OpenClaw Gateway.
