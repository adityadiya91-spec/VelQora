import { CheckCircle2, CircleDot, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function StatusTimeline({ timeline = [] }) {
  const { isPrimaryMode } = useTheme();

  if (!timeline || timeline.length === 0) {
    return (
      <div
        className={cn(
          "py-4 text-center text-xs font-medium",
          isPrimaryMode ? "text-slate-400" : "text-slate-500"
        )}
      >
        No tracking events recorded yet.
      </div>
    );
  }

  // Sort chronological
  const sorted = [...timeline].sort(
    (a, b) => new Date(a.occurred_at) - new Date(b.occurred_at)
  );

  return (
    <div
      className={cn(
        "relative pl-6 space-y-5 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px]",
        isPrimaryMode ? "before:bg-white/15" : "before:bg-orange-200"
      )}
    >
      {sorted.map((event, idx) => {
        const isLast = idx === sorted.length - 1;
        const isCancelled = event.status === "cancelled";

        return (
          <div key={event.id || idx} className="relative group">
            {/* Dot marker */}
            <div
              className={cn(
                "absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                isCancelled
                  ? "border-red-500 bg-red-500/20 text-red-400"
                  : isLast
                  ? isPrimaryMode
                    ? "border-[#CCFF00] bg-[#CCFF00] text-black shadow-[0_0_10px_rgba(204,255,0,0.5)] ring-4 ring-[#CCFF00]/20"
                    : "border-[#FF6600] bg-[#FF6600] text-white shadow-[0_0_10px_rgba(255,102,0,0.5)] ring-4 ring-[#FF6600]/20"
                  : isPrimaryMode
                  ? "border-white/20 bg-[#0B101D] text-[#CCFF00]"
                  : "border-slate-300 bg-white text-[#FF6600]"
              )}
            >
              {isCancelled ? (
                <AlertCircle size={12} />
              ) : isLast ? (
                <CircleDot size={12} />
              ) : (
                <CheckCircle2 size={12} />
              )}
            </div>

            <div
              className={cn(
                "rounded-2xl p-3.5 border transition-colors",
                isPrimaryMode
                  ? "bg-[#0B101D] border-white/5"
                  : "bg-slate-50 border-slate-200"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "font-heading text-sm font-extrabold capitalize",
                    isPrimaryMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {event.note || event.status.replace("_", " ")}
                </p>
                <span
                  className={cn(
                    "shrink-0 text-[11px] font-semibold",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  {formatDateTime(event.occurred_at)}
                </span>
              </div>

              {event.location ? (
                <p
                  className={cn(
                    "mt-1 text-xs flex items-center gap-1 font-medium",
                    isPrimaryMode ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  <span>📍</span> {event.location}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatusTimeline;
