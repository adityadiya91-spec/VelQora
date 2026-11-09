import { cn } from "@/lib/utils";

const statusLabels = {
  pending_match: "Pending Match",
  assigned: "Assigned",
  pickup_started: "Pickup Started",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusStyles = {
  pending_match: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  assigned: "bg-orange-500/15 text-[#FF6600] border border-orange-500/30",
  pickup_started: "bg-orange-500/15 text-[#FF6600] border border-orange-500/30",
  picked_up: "bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30",
  in_transit: "bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30",
  delivered: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/30",
};

export function StatusPill({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        statusStyles[status] || "bg-gray-100 text-muted"
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}