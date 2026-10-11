"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface ComposerProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function Composer({ onSend, onStop, isStreaming, disabled }: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  return (
    <div
      className="px-3 py-3 sm:px-4 relative z-10"
      style={{
        background: "var(--color-panel)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bir mesaj yazın… (Enter gönder, Shift+Enter satır atlat)"
          aria-label="Mesaj gir"
          rows={1}
          className="flex-1 min-h-[40px] max-h-[200px] py-2"
          disabled={disabled}
        />
        {isStreaming ? (
          <Button
            variant="danger"
            size="icon"
            onClick={onStop}
            aria-label="Yanıtı durdur"
            title="Durdur"
            type="button"
          >
            <Square className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="accent"
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Mesajı gönder"
            title="Gönder"
            type="button"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <p
        className="mx-auto mt-1.5 max-w-3xl text-center hud-label"
        style={{ color: "var(--color-dim)" }}
      >
        Alfred şu an{" "}
        <strong style={{ color: "var(--color-muted)", fontWeight: 600 }}>
          Mock modunda
        </strong>{" "}
        çalışıyor — gerçek sunucu bağlantısı yok.
      </p>
    </div>
  );
}
