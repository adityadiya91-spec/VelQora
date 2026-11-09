import { useData } from "@/contexts/DataContext";
import { CapacityBar } from "@/components/domain/CapacityBar";
import { StatusPill } from "@/components/design/StatusPill";
import { formatINR, formatDate } from "@/lib/utils";
import { Layers, Truck, Users, MapPin, Play, Sparkles } from "lucide-react";

export default function AdminSharedTrips() {
  const { bookings, sharedTrips, drivers, runMatchingEngine } = useData();

  // Group matched shared bookings by assigned driver and date window
  const activeSharedBookings = bookings.filter((b) => b.mode === "shared");

  // Synthetic grouped clusters for visualization if no fresh batch has run
  const defaultClusters = [
    {
      trip_id: "TRIP-MH-101",
      driver_name: "Rajesh Pawar",
      driver_phone: "+91 9812345670",
      vehicle_number: "MH-12-AB-1234",
      vehicle_type: "Pickup Van (1000 kg)",
      corridor: "Baramati → Indapur → Jejuri",
      total_weight_kg: 485,
      capacity_kg: 1000,
      utilization_pct: 48,
      status: "in_transit",
      parcel_count: 3,
      parcels: [
        { id: "PCL-100101", tracking: "VQ-250101-0101", weight: 85, category: "Dairy", shipper: "Kisan Agro Foods" },
        { id: "PCL-100109", tracking: "VQ-250109-0109", weight: 180, category: "Produce", shipper: "Sahyadri Farms" },
        { id: "PCL-100114", tracking: "VQ-250114-0114", weight: 220, category: "Grocery", shipper: "Indapur Stores" },
      ],
      total_gmv: 2450,
      total_savings: 890,
    },
    {
      trip_id: "TRIP-MH-102",
      driver_name: "Sunil More",
      driver_phone: "+91 9812345671",
      vehicle_number: "MH-42-CD-5678",
      vehicle_type: "Mini Tempo (750 kg)",
      corridor: "Phaltan → Baramati → Daund",
      total_weight_kg: 540,
      capacity_kg: 750,
      utilization_pct: 72,
      status: "assigned",
      parcel_count: 2,
      parcels: [
        { id: "PCL-100104", tracking: "VQ-250104-0104", weight: 120, category: "Produce", shipper: "Phaltan Jaggery" },
        { id: "PCL-100118", tracking: "VQ-250118-0118", weight: 420, category: "Sugar / Agro", shipper: "Nira Agro Union" },
      ],
      total_gmv: 3120,
      total_savings: 1140,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white">
            Shared Route Aggregations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Consolidated multi-shipper tempo trips optimizing rural freight capacity.
          </p>
        </div>

        <button
          onClick={() => runMatchingEngine()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-warm transition shrink-0"
        >
          <Play size={13} className="fill-white" /> Run Matching Engine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {defaultClusters.map((cluster) => (
          <div
            key={cluster.trip_id}
            className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] block">
                  Shared Corridor Run #{cluster.trip_id}
                </span>
                <h3 className="font-heading text-base font-extrabold text-white mt-0.5">
                  {cluster.corridor}
                </h3>
              </div>
              <StatusPill status={cluster.status} />
            </div>

            {/* Carrier info */}
            <div className="flex items-center justify-between rounded-xl bg-[#0B101D] p-3 border border-white/5 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10 text-[#CCFF00]">
                  <Truck size={16} />
                </div>
                <div>
                  <span className="font-bold text-white block">{cluster.driver_name}</span>
                  <span className="text-slate-400">{cluster.vehicle_number} · {cluster.vehicle_type}</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#CCFF00]">{cluster.driver_phone}</span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1">
              <CapacityBar
                current={cluster.total_weight_kg}
                max={cluster.capacity_kg}
                label="Vehicle Load Factor"
                unit="kg"
              />
            </div>

            {/* Consolidated Consignments list */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Consolidated Parcels ({cluster.parcel_count})
              </span>

              <div className="space-y-1.5 divide-y divide-white/10 border-t border-white/10 pt-1 text-xs">
                {cluster.parcels.map((p) => (
                  <div key={p.id} className="pt-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{p.tracking}</span>
                      <span className="text-[11px] text-slate-400">{p.shipper} · {p.category}</span>
                    </div>
                    <span className="font-heading font-extrabold text-[#CCFF00]">{p.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Combined Rural Savings</span>
                <span className="font-heading font-extrabold text-emerald-400">
                  {formatINR(cluster.total_savings)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Aggregated GMV</span>
                <span className="font-heading font-extrabold text-white">
                  {formatINR(cluster.total_gmv)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
