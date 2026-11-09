import { useData } from "@/contexts/DataContext";
import { formatINR } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, Sparkles, Truck, Layers } from "lucide-react";

export default function AdminAnalytics() {
  const { bookings, adminStats } = useData();

  // Daily revenue trend (7-day timeline)
  const dailyData = [
    { day: "Mon", revenue: 4200, savings: 1650, parcels: 6 },
    { day: "Tue", revenue: 5800, savings: 2400, parcels: 9 },
    { day: "Wed", revenue: 7100, savings: 3100, parcels: 12 },
    { day: "Thu", revenue: 6400, savings: 2750, parcels: 10 },
    { day: "Fri", revenue: 8900, savings: 3900, parcels: 15 },
    { day: "Sat", revenue: 11200, savings: 4800, parcels: 19 },
    { day: "Sun", revenue: 9500, savings: 4100, parcels: 14 },
  ];

  // Status breakdown
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    { name: "Delivered", value: statusCounts.delivered || 1, color: "#16A34A" },
    { name: "In Transit", value: statusCounts.in_transit || 1, color: "#FF7958" },
    { name: "Assigned", value: statusCounts.assigned || 1, color: "#3B82F6" },
    { name: "Pending Match", value: statusCounts.pending_match || 1, color: "#F59E0B" },
    { name: "Cancelled", value: statusCounts.cancelled || 0, color: "#EF4444" },
  ];

  // Top Corridors
  const corridorData = [
    { corridor: "Baramati → Jejuri", volume_kg: 890, trips: 14 },
    { corridor: "Indapur → Daund", volume_kg: 740, trips: 11 },
    { corridor: "Phaltan → Baramati", volume_kg: 620, trips: 9 },
    { corridor: "Shirur → Daund", volume_kg: 480, trips: 7 },
    { corridor: "Baramati → Phaltan", volume_kg: 520, trips: 8 },
  ];

  // Vehicle Load Factor Utilization
  const vehicleUtilization = [
    { type: "Mini Tempo", rate: 76, capacity: "750 kg" },
    { type: "Pickup Van", rate: 68, capacity: "1000 kg" },
    { type: "Cargo Truck", rate: 82, capacity: "3500 kg" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white">
          Logistics Performance & Network Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Corridor demand, freight cost compression, and vehicle load factor analytics.
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
            Net Economic Value Created
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-extrabold text-white">
              {formatINR(adminStats.totalRevenue + adminStats.totalSavings)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#CCFF00] font-semibold flex items-center gap-1">
            <Sparkles size={12} /> Combined GMV and rural savings
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
            Average Vehicle Load Factor
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-extrabold text-white">
              74.2%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            +32% vs unaggregated solo freight runs
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
            Average Farmer Freight Savings
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-extrabold text-[#CCFF00]">
              37.4%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Reduction in per-parcel logistics expenditure
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue & Savings Trend */}
        <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl">
          <h3 className="font-heading text-base font-extrabold text-white mb-1">
            Weekly Revenue vs. Shipper Savings (₹)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Daily logistics volume across 6 Maharashtra clusters</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip
                  formatter={(val) => formatINR(val)}
                  contentStyle={{
                    backgroundColor: "#0B101D",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px", color: "#CBD5E1" }} />
                <Bar dataKey="revenue" name="Platform Revenue" fill="#FF6600" radius={[6, 6, 0, 0]} />
                <Bar dataKey="savings" name="Farmer Savings" fill="#CCFF00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consignment Status Distribution */}
        <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl">
          <h3 className="font-heading text-base font-extrabold text-white mb-1">
            Consignment Status Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Current state breakdown of registered consignments</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B101D",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#CBD5E1" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Rural Freight Corridors */}
        <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl">
          <h3 className="font-heading text-base font-extrabold text-white mb-1">
            Top Rural Corridors by Consignment Weight
          </h3>
          <p className="text-xs text-slate-400 mb-4">Total freight moved in past 30 days (Kilograms)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={corridorData}
                margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis dataKey="corridor" type="category" tick={{ fontSize: 10, fill: "#94A3B8" }} width={120} />
                <Tooltip
                  formatter={(val) => `${val} kg`}
                  contentStyle={{
                    backgroundColor: "#0B101D",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="volume_kg" name="Weight (kg)" fill="#CCFF00" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Utilization Progress */}
        <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-extrabold text-white mb-1">
              Vehicle Capacity Load Factors
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-world utilization of aggregated fleet compared to full capacity limits
            </p>

            <div className="space-y-4">
              {vehicleUtilization.map((v) => (
                <div key={v.type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-white">{v.type} ({v.capacity})</span>
                    <span className="font-heading font-extrabold text-[#CCFF00]">{v.rate}% utilization</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#0B101D] border border-white/10 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#CCFF00] transition-all duration-700"
                      style={{ width: `${v.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#0B101D] p-3.5 border border-white/5 text-xs text-slate-400">
            <p className="font-semibold text-white mb-0.5">Economic Insight</p>
            Shared route consolidation raises rural vehicle efficiency from ~35% on empty backhauls to over 74% average fill rate.
          </div>
        </div>
      </div>
    </div>
  );
}
