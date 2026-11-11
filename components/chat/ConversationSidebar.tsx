"use client";

import { type CSSProperties } from "react";
import { type Conversation } from "@/types/chat";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MessageSquarePlus, X } from "lucide-react";
import { useNow } from "@/hooks/useNow";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  /** Mobile: is drawer open? */
  open: boolean;
  onClose: () => void;
}

function formatRelativeDate(ts: number, now: number): string {
  const diff = now - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Şimdi";
  if (mins < 60) return `${mins}d önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}s önce`;
  const days = Math.floor(hours / 24);
  return `${days}g önce`;
}

/** Stable ISO-date string used as placeholder during SSR / before hydration. */
function absoluteDate(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function SidebarContent({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: Omit<ConversationSidebarProps, "open" | "onClose">) {
  // Refresh every 60 s so "x min ago" labels stay accurate.
  const now = useNow(60_000);

  return (
    <div className="flex h-full flex-col gap-1">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 pb-2 pt-3"
        style={{ borderBottom: "1px solid var(--color-border-dim)" }}
      >
        <span className="hud-label">SOHBETLER</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onNewChat}
          aria-label="Yeni sohbet başlat"
          title="Yeni sohbet"
        >
          <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* List */}
      <nav
        aria-label="Sohbet geçmişi"
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-4 pt-1"
      >
        {conversations.map((conv) => {
          const isActive = activeId === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "group relative flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none",
                isActive
                  ? "text-steel"
                  : "hover:text-steel"
              )}
              style={
                isActive
                  ? {
                      background: "var(--color-panel-alt)",
                      borderLeft: "3px solid var(--color-amber)",
                      boxShadow: "inset 0 0 12px 0 var(--color-amber-glow)",
                      color: "var(--color-steel)",
                      paddingLeft: "calc(0.75rem - 3px)", // compensate for border
                      outline: "none",
                    }
                  : {
                      borderLeft: "3px solid transparent",
                      color: "var(--color-muted)",
                    }
              }
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-amber)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = isActive
                  ? "inset 0 0 12px 0 var(--color-amber-glow)"
                  : "";
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className="truncate font-medium leading-tight"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {conv.title}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "var(--color-dim)" }}
              >
                {now !== null
                  ? formatRelativeDate(conv.updatedAt, now)
                  : absoluteDate(conv.updatedAt)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const SIDEBAR_STYLE: CSSProperties = {
  background: "var(--color-panel)",
  borderRight: "1px solid var(--color-border)",
};

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  open,
  onClose,
}: ConversationSidebarProps) {
  const handleSelect = (id: string) => {
    onSelect(id);
    onClose(); // close drawer on mobile after selecting
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:w-64 md:flex-shrink-0 md:flex-col"
        style={SIDEBAR_STYLE}
        aria-label="Sohbet paneli"
      >
        <SidebarContent
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNewChat={onNewChat}
        />
      </aside>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 flex-col transition-transform duration-200 md:hidden",
          open ? "flex translate-x-0" : "-translate-x-full"
        )}
        style={SIDEBAR_STYLE}
        aria-label="Sohbet paneli"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Paneli kapat"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <SidebarContent
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNewChat={onNewChat}
        />
      </aside>
    </>
  );
}
