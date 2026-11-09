import { CheckCircle2, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_VEHICLE_IMAGES = {
  mini_tempo:
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  pickup_van:
    "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80",
  cargo_truck:
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
};

export function VehicleCard({ vehicle, selected, onSelect }) {
  const imageUrl = vehicle.image_url || DEFAULT_VEHICLE_IMAGES[vehicle.code] || "";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(vehicle)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 bg-[#121622] text-left transition-all duration-300 text-white w-full",
        selected
          ? "border-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.35)] ring-1 ring-[#CCFF00]"
          : "border-white/10 hover:border-white/30"
      )}
    >
      {/* Vehicle Image Showcase */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-black/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5">
            <Truck className="h-10 w-10 text-[#CCFF00]" />
          </div>
        )}

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-transparent to-black/30 pointer-events-none" />

        {/* Selection indicator pill */}
        {selected && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-[#CCFF00] text-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
            <CheckCircle2 size={12} className="stroke-[3]" />
            <span>Selected</span>
          </span>
        )}

        {/* Capacity badge */}
        <span className="absolute bottom-2 left-2.5 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white/90 border border-white/15">
          {vehicle.capacity_kg} kg Capacity
        </span>
      </div>

      {/* Info details */}
      <div className="p-3.5 space-y-1 bg-[#121622]">
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-black text-white">{vehicle.name}</p>
          <span className="text-xs font-bold text-[#CCFF00]">
            ₹{vehicle.rate_per_km}/km
          </span>
        </div>

        <p className="text-xs text-white/60">
          {vehicle.capacity_kg} kg max · {vehicle.description || "Rural freight vehicle"}
        </p>
      </div>
    </button>
  );
}

export default VehicleCard;