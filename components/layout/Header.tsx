"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusIndicator, type ConnectionStatus } from "./StatusIndicator";

interface HeaderProps {
  onMenuClick: () => void;
  connectionStatus: ConnectionStatus;
}

export function Header({ onMenuClick, connectionStatus }: HeaderProps) {
  return (
    <header
      className="flex h-14 items-center justify-between px-3 sm:px-4"
      style={{
        background: "var(--color-panel)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Sohbet panelini aç"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Wordmark — ALFRED in HUD/mono uppercase with amber accent line */}
        <div className="flex flex-col leading-none gap-0.5">
          <div className="flex flex-col gap-px">
            <span
              className="font-mono font-bold tracking-widest uppercase"
              style={{ fontSize: "1rem", color: "var(--color-steel)" }}
            >
              ALFRED
            </span>
            {/* Thin amber accent underline */}
            <span
              aria-hidden="true"
              style={{
                display: "block",
                height: "2px",
                width: "100%",
                background: "var(--color-amber)",
                borderRadius: "1px",
              }}
            />
          </div>
          <span className="hud-label">Kişisel Asistan</span>
        </div>
      </div>

      <StatusIndicator status={connectionStatus} />
    </header>
  );
}
