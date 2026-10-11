"use client";

import { useSyncExternalStore } from "react";

// getSnapshot always returns true — once the client runs, we're on the client.
function getSnapshot(): boolean {
  return true;
}

// getServerSnapshot always returns false — deterministic on SSR / prerender.
function getServerSnapshot(): boolean {
  return false;
}

// No external store to subscribe to; the value never changes after mount.
function subscribe(listener: () => void): () => void {
  // Nothing to subscribe to — the value is permanently true on the client.
  // We satisfy the interface by returning a no-op unsubscribe.
  void listener;
  return () => {};
}

/**
 * Returns `false` during SSR / prerender and `true` after the component has
 * hydrated on the client. Use this to defer rendering of content that would
 * differ between server and client (e.g. locale-dependent date formatting).
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
