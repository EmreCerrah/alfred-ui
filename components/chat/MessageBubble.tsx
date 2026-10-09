"use client";

import { type ReactNode } from "react";
import { type Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { TypingIndicator } from "./TypingIndicator";
import { useIsClient } from "@/hooks/useIsClient";

// ---------------------------------------------------------------------------
// Safe Markdown-like renderer — NO dangerouslySetInnerHTML, NO external libs
// Supports: fenced code blocks, inline code, paragraphs, bold, blockquotes,
// unordered lists.
// ---------------------------------------------------------------------------

type Block =
  | { kind: "code"; lang: string; text: string }
  | { kind: "paragraph"; spans: Span[] }
  | { kind: "blockquote"; spans: Span[] }
  | { kind: "list"; items: Span[][] };

type Span =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "bold"; text: string };

function parseInline(raw: string): Span[] {
  const spans: Span[] = [];
  // Process inline code (`...`) and bold (**...**)
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    if (match.index > last) {
      spans.push({ kind: "text", text: raw.slice(last, match.index) });
    }
    const token = match[0];
    if (token.startsWith("`")) {
      spans.push({ kind: "code", text: token.slice(1, -1) });
    } else {
      spans.push({ kind: "bold", text: token.slice(2, -2) });
    }
    last = match.index + token.length;
  }
  if (last < raw.length) {
    spans.push({ kind: "text", text: raw.slice(last) });
  }
  return spans;
}

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ kind: "code", lang, text: codeLines.join("\n") });
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push({
        kind: "blockquote",
        spans: parseInline(line.slice(2)),
      });
      i++;
      continue;
    }

    // Unordered list item
    if (/^[-*] /.test(line)) {
      const items: Span[][] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(parseInline(lines[i].slice(2)));
        i++;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    // Numbered list item
    if (/^\d+\. /.test(line)) {
      const items: Span[][] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\. /, "")));
        i++;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    // Blank line — skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ kind: "paragraph", spans: parseInline(paraLines.join(" ")) });
    }
  }
  return blocks;
}

function renderSpans(spans: Span[]): ReactNode[] {
  return spans.map((span, idx) => {
    if (span.kind === "code") {
      return (
        <code
          key={idx}
          className="rounded bg-zinc-700 px-1 py-0.5 font-mono text-[0.85em] text-amber-300"
        >
          {span.text}
        </code>
      );
    }
    if (span.kind === "bold") {
      return (
        <strong key={idx} className="font-semibold text-zinc-100">
          {span.text}
        </strong>
      );
    }
    return <span key={idx}>{span.text}</span>;
  });
}

function MarkdownContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        if (block.kind === "code") {
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-xs text-zinc-200 border border-zinc-700"
            >
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.kind === "blockquote") {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-amber-600 pl-3 text-zinc-400 italic"
            >
              {renderSpans(block.spans)}
            </blockquote>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={idx} className="list-disc pl-5 space-y-0.5">
              {block.items.map((item, iIdx) => (
                <li key={iIdx}>{renderSpans(item)}</li>
              ))}
            </ul>
          );
        }
        // paragraph
        return <p key={idx}>{renderSpans(block.spans)}</p>;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timestamp
// ---------------------------------------------------------------------------

function formatTime(ts: number): string {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

// ---------------------------------------------------------------------------
// MessageBubble
// ---------------------------------------------------------------------------

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isClient = useIsClient();
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isStreaming = message.status === "streaming";
  const isAborted = message.status === "aborted";
  const isError = message.status === "error";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]",
        isUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-amber-800 text-amber-50 rounded-br-sm"
            : "bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700",
          isError && "border-red-800 bg-red-950 text-red-300",
          isAborted && "opacity-75"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : isStreaming && message.content === "" ? (
          <TypingIndicator />
        ) : (
          <MarkdownContent content={message.content} />
        )}
        {isStreaming && message.content !== "" && (
          <span
            className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-zinc-400 align-middle"
            aria-hidden="true"
          />
        )}
        {isAborted && (
          <p className="mt-1 text-xs text-zinc-500 italic">— yanıt durduruldu</p>
        )}
        {isError && (
          <p className="mt-1 text-xs text-red-400 italic">Bir hata oluştu.</p>
        )}
      </div>
      <time
        className="text-[10px] text-zinc-600 px-1"
        dateTime={new Date(message.createdAt).toISOString()}
      >
        {isClient ? formatTime(message.createdAt) : "\u00a0"}
      </time>
    </div>
  );
}
