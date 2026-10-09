export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-1 py-0.5"
      aria-label="Alfred yazıyor"
      role="status"
    >
      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
