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

## Theme

Alfred uses an original **underground command center** visual theme — a cave headquarters aesthetic built entirely from CSS (no external images, no third-party artwork, no trademarked symbols or logos).

### Design direction

| Element | Treatment |
|---|---|
| Background | Near-black cave stone via layered radial/linear gradients (`#050607` deep, with vignette) |
| Surfaces | Gunmetal/graphite panels (`#14181c` primary, `#1b2026` secondary) with subtle inner borders |
| Text | Cool steel (`#c9d1d9`) for body, muted graphite (`#7d8590`) for labels/timestamps |
| Accent | Single warm amber/signal-yellow (`#f5b301`) — focus rings, send button, active sidebar item, status dot, blockquote borders |
| Monitor detail | Faint cyan (`rgba(56,189,248,0.07)`) for subtle glow-from-screen effects |
| Typography | Headings and HUD labels use Geist Mono (uppercase, tracked); body uses Geist Sans |
| Texture | Subtle scanline overlay on the main chat area; vignette on the page background |
| Motion | Single slow amber pulse on the status dot; respects `prefers-reduced-motion` |

### Tokens (defined in `app/globals.css`)

| CSS variable | Value | Role |
|---|---|---|
| `--color-cave` | `#050607` | Page background |
| `--color-panel` | `#14181c` | Primary surface (header, sidebar, composer) |
| `--color-panel-alt` | `#1b2026` | Secondary surface (user bubbles, hover) |
| `--color-border` | `#252c35` | Panel borders |
| `--color-border-dim` | `#1c2229` | Subtle inner borders |
| `--color-steel` | `#c9d1d9` | Primary text |
| `--color-muted` | `#7d8590` | Secondary text |
| `--color-dim` | `#4a5360` | Tertiary / disabled text |
| `--color-amber` | `#f5b301` | Accent (all active/focus states) |
| `--color-amber-dim` | `#c28e00` | Accent hover/pressed |
| `--color-amber-glow` | `rgba(245,179,1,0.12)` | Soft ambient glow behind active items |
| `--color-amber-fg` | `#0d0f0b` | Text on amber backgrounds |
| `--color-monitor` | `rgba(56,189,248,0.07)` | Optional monitor-glow cyan detail |
| `--color-danger` | `#c0392b` | Stop button / error state |

### Color mode

The theme is **dark-only**. `color-scheme: dark` is set globally on `<html>` and there is no light-mode override. All contrast ratios meet WCAG AA against their respective backgrounds.

## Status

**Phase 2 — Mock UI only.** No real network connection. The `MockTransport` simulates streaming replies from canned responses. Phase 3 will add the server-side WebSocket bridge to the OpenClaw Gateway.
