import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { AdminStatCard } from "@/components/domain/AdminStatCard";
import { AdminTable } from "@/components/domain/AdminTable";
import { StatusPill } from "@/components/design/StatusPill";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Package,
  Truck,
  TrendingUp,
  Sparkles,
  Play,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminStats, bookings, runMatchingEngine } = useData();
  const [engineMsg, setEngineMsg] = useState("");

  const handleMatch = () => {
    const res = runMatchingEngine();
    setEngineMsg(res.message);
    setTimeout(() => setEngineMsg(""), 5000);
  };

  const columns = [
    {
      key: "tracking_id",
      header: "Tracking ID",
      render: (val, row) => (
        <div>
          <span className="font-heading font-extrabold text-white block">{val}</span>
          <span className="text-[11px] text-slate-400">{row.entrepreneur_name}</span>
        </div>
      ),
    },
    {
      key: "pickup_village",
      header: "Route Corridor",
      render: (_, row) => (
        <span className="font-semibold text-white">
          {row.pickup_village} → {row.destination}
        </span>
      ),
    },
    {
      key: "weight_kg",
      header: "Consignment",
      render: (val, row) => (
        <span className="text-slate-300">
          {val} kg · <span className="capitalize">{row.category}</span>
        </span>
      ),
    },
    {
      key: "mode",
      header: "Mode",
      render: (val) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "shared"
              ? "bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30"
              : "bg-white/10 text-white border border-white/20"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (val) => <StatusPill status={val} />,
    },
    {
      key: "fare_total",
      header: "Fare / Savings",
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{formatINR(val)}</span>
          {row.savings > 0 ? (
            <span className="text-[10px] font-bold text-emerald-400">
              Saved {formatINR(row.savings)}
            </span>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Engine Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
            Maharashtra Operations Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Aggregating rural freight corridors across Baramati, Indapur, Daund, Shirur, Jejuri, & Phaltan.
          </p>
        </div>

        <button
          onClick={handleMatch}
          className="flex items-center gap-2 rounded-xl bg-[#CCFF00] px-5 py-3 font-heading text-xs font-extrabold text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:bg-[#b8e600] transition shrink-0 active:scale-95"
        >
          <Play size={14} className="fill-black" />
          Run Matching Engine
        </button>
      </div>

      {engineMsg && (
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fade-in shadow-sm">
          <Sparkles size={16} className="text-[#CCFF00]" />
          {engineMsg}
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Bookings"
          value={adminStats.totalBookings}
          subtitle="Across 6 active clusters"
          change="+18% this week"
          icon={Package}
        />

        <AdminStatCard
          title="Active Shipments"
          value={adminStats.activeShipments}
          subtitle={`${adminStats.pendingMatches} awaiting corridor match`}
          change="+4 in transit"
          icon={Truck}
        />

        <AdminStatCard
          title="Settled Revenue"
          value={formatINR(adminStats.totalRevenue)}
          subtitle="Carrier & platform GMV"
          change="+₹14,200 vs last month"
          icon={TrendingUp}
        />

        <AdminStatCard
          title="Rural Savings Delivered"
          value={formatINR(adminStats.totalSavings)}
          subtitle="Direct farmer & trader savings"
          change="~38% lower freight costs"
          icon={Sparkles}
        />
      </div>

      {/* Corridor Summary Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="font-heading text-base font-extrabold text-white">
              Automated Shared-Load Aggregation Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Consolidates parcel batches within ≤30 km pickup radius, ≤40 km drop corridor, and ≤25% detour budget.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/shared-trips")}
          className="flex items-center gap-1.5 text-xs font-bold text-[#CCFF00] hover:underline shrink-0"
        >
          View Matched Route Runs <ArrowRight size={14} />
        </button>
      </div>

      {/* Recent Bookings Table */}
      <AdminTable
        title="Recent Rural Consignments"
        subtitle="Live feed of farmer and SME logistics bookings"
        searchPlaceholder="Filter tracking ID or village..."
        searchKey="tracking_id"
        columns={columns}
        data={bookings.slice(0, 8)}
        onRowClick={(row) => navigate(`/admin/bookings`)}
      />
    </div>
  );
}
