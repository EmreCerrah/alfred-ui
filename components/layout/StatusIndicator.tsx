import { Badge } from "@/components/ui/Badge";

export type ConnectionStatus = "mock" | "connected" | "disconnected" | "error";

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  mock: "MOCK MODE",
  connected: "ONLINE",
  disconnected: "OFFLINE",
  error: "ERROR",
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const isMock = status === "mock";
  const isConnected = status === "connected";

  return (
    <Badge variant={isMock ? "mock" : isConnected ? "success" : "warning"}>
      {/* Status dot — amber pulse for mock, green for connected, muted otherwise */}
      <span
        className={isMock ? "h-2 w-2 rounded-full flex-shrink-0 status-dot-pulse" : "h-2 w-2 rounded-full flex-shrink-0"}
        style={{
          background: isMock
            ? "var(--color-amber)"
            : isConnected
            ? "#4ade80"
            : "var(--color-muted)",
        }}
        aria-hidden="true"
      />
      <span className="hud-label" style={{ color: "inherit" }}>
        {STATUS_LABELS[status]}
      </span>
    </Badge>
  );
}
