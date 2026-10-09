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
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3 sm:px-4">
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

        {/* Logo / name */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-zinc-100">
            Alfred
          </span>
        </div>
      </div>

      <StatusIndicator status={connectionStatus} />
    </header>
  );
}
