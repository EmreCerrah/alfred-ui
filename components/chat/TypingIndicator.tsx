export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-1 py-0.5"
      aria-label="Alfred yazıyor"
      role="status"
    >
      <span
        className="h-2 w-2 rounded-full animate-bounce [animation-delay:0ms]"
        style={{ background: "var(--color-amber)", opacity: 0.8 }}
      />
      <span
        className="h-2 w-2 rounded-full animate-bounce [animation-delay:150ms]"
        style={{ background: "var(--color-amber)", opacity: 0.6 }}
      />
      <span
        className="h-2 w-2 rounded-full animate-bounce [animation-delay:300ms]"
        style={{ background: "var(--color-amber)", opacity: 0.4 }}
      />
    </div>
  );
}
