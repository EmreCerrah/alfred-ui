import { Badge } from "@/components/ui/Badge";

export type ConnectionStatus = "mock" | "connected" | "disconnected" | "error";

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  mock: "Mock modu",
  connected: "Bağlı",
  disconnected: "Bağlantı yok",
  error: "Hata",
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <Badge variant={status === "mock" ? "mock" : status === "connected" ? "success" : "warning"}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "mock"
            ? "bg-zinc-500"
            : status === "connected"
            ? "bg-emerald-400"
            : "bg-amber-400"
        }`}
        aria-hidden="true"
      />
      <span>{STATUS_LABELS[status]}</span>
    </Badge>
  );
}
