import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { AdminTable } from "@/components/domain/AdminTable";
import { Star, ShieldCheck, Truck, Phone, Award } from "lucide-react";

export default function AdminDrivers() {
  const { drivers } = useData();
  const [driverStates, setDriverStates] = useState(
    drivers.reduce((acc, d) => ({ ...acc, [d.id]: d.verified !== false }), {})
  );

  const toggleVerification = (driverId) => {
    setDriverStates((prev) => ({
      ...prev,
      [driverId]: !prev[driverId],
    }));
  };

  const columns = [
    {
      key: "full_name",
      header: "Carrier Partner",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] font-heading font-extrabold text-sm border border-[#CCFF00]/30">
            {val.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-white text-sm block">
                {val}
              </span>
              {driverStates[row.id] ? (
                <ShieldCheck size={14} className="text-[#CCFF00]" />
              ) : null}
            </div>
            <span className="text-xs text-slate-400">{row.home_village} Corridor</span>
          </div>
        </div>
      ),
    },
    {
      key: "vehicle_number",
      header: "Vehicle & Capacity",
      render: (val, row) => (
        <div>
          <span className="font-heading font-extrabold text-white block text-xs">
            {val}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">
            {row.vehicle_type.replace("_", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating & Experience",
      render: (val, row) => (
        <div>
          <span className="flex items-center gap-1 font-bold text-white">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {val}
          </span>
          <span className="text-[11px] text-slate-400">{row.trips_completed} rural trips</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone Contact",
      render: (val) => <span className="font-medium text-white">{val}</span>,
    },
    {
      key: "status",
      header: "Operational Status",
      render: (val) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "available"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : val === "on_trip"
              ? "bg-orange-500/15 text-[#FF6600] border border-orange-500/30"
              : "bg-white/10 text-slate-300"
          }`}
        >
          {val.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "id",
      header: "Compliance Toggle",
      render: (id) => (
        <button
          type="button"
          onClick={() => toggleVerification(id)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
            driverStates[id]
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
              : "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
          }`}
        >
          {driverStates[id] ? "Approved Active" : "Suspended"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white">
          Commercial Carriers & Drivers
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verified fleet drivers operating mini-tempos, pickup vans, and cargo trucks.
        </p>
      </div>

      <AdminTable
        title="Active Driver Partner Network"
        subtitle="Monitored against driving license, insurance, and vehicle fitness records"
        searchPlaceholder="Search driver name, vehicle number or village..."
        columns={columns}
        data={drivers}
      />
    </div>
  );
}
