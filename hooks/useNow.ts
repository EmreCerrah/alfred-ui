"use client";

import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// Module-level clock store
// ---------------------------------------------------------------------------

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedNow: number = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;
let activeRefreshMs: number | null = null;

function notifyAll(): void {
  cachedNow = Date.now();
  listeners.forEach((l) => l());
}

function startInterval(ms: number): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  activeRefreshMs = ms;
  intervalId = setInterval(notifyAll, ms);
}

function stopInterval(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    activeRefreshMs = null;
  }
}

function subscribe(listener: Listener, refreshMs: number | undefined): () => void {
  listeners.add(listener);
  const ms = refreshMs != null && refreshMs > 0 ? refreshMs : null;
  if (ms !== null && ms !== activeRefreshMs) {
    startInterval(ms);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopInterval();
    }
  };
}

function getSnapshot(): number {
  return cachedNow;
}

function getServerSnapshot(): null {
  return null;
}

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

/**
 * Returns the current timestamp (ms) on the client, or null during
 * SSR / prerender so the first render is deterministic.
 *
 * Pass `refreshMs` to re-render on an interval (e.g. to keep "x min ago"
 * labels accurate).
 */
export function useNow(refreshMs?: number): number | null {
  return useSyncExternalStore(
    (listener) => subscribe(listener, refreshMs),
    getSnapshot,
    getServerSnapshot,
  );
}
