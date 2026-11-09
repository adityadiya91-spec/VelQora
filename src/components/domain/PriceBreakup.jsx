import { formatINR } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function PriceBreakup({ booking }) {
  const { isPrimaryMode } = useTheme();

  const rows = [
    {
      label: "Base Vehicle Charge",
      value: booking.fare_base,
    },
    {
      label: "Shared Allocation",
      value: booking.fare_allocation,
    },
    {
      label: "Handling & Surcharges",
      value: booking.fare_extras,
    },
    {
      label: "Tax",
      value: booking.fare_tax,
    },
    {
      label: "Discount",
      value: -booking.fare_discount,
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium",
              isPrimaryMode ? "text-slate-400" : "text-slate-600"
            )}
          >
            {row.label}
          </span>
          <span
            className={cn(
              "text-sm font-bold",
              isPrimaryMode ? "text-white" : "text-slate-900"
            )}
          >
            {formatINR(row.value)}
          </span>
        </div>
      ))}

      <div
        className={cn(
          "mt-4 border-t pt-4",
          isPrimaryMode ? "border-white/10" : "border-slate-200"
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-heading font-extrabold text-base",
              isPrimaryMode ? "text-white" : "text-slate-900"
            )}
          >
            Total
          </span>
          <span
            className={cn(
              "font-heading text-2xl font-black",
              isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
            )}
          >
            {formatINR(booking.fare_total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PriceBreakup;
