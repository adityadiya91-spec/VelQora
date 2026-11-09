import { cn } from "@/lib/utils";

export function CapacityBar({ current = 0, max = 100, label = "Capacity Utilization", unit = "kg", showPercent = true, className }) {
  const percentage = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;

  // Color thresholding using tokens
  const getColorClass = (pct) => {
    if (pct > 85) return "bg-primary";
    if (pct > 50) return "bg-primary-warm";
    return "bg-ink";
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
        <span className="text-muted">{label}</span>
        <span className="font-heading font-bold text-ink">
          {current} / {max} {unit} {showPercent ? `(${percentage}%)` : ""}
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-hairline/60 p-0.5">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColorClass(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default CapacityBar;
