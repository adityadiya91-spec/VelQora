import { useData } from "@/contexts/DataContext";
import { ShieldCheck, Star, Truck, MapPin, Phone, Award, FileCheck, CheckCircle2 } from "lucide-react";
import { PillButton } from "@/components/design/PillButton";
import { Link } from "react-router-dom";

export default function DriverProfile() {
  const { drivers } = useData();
  const driver = drivers[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-white">
          Carrier Partner Profile
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Commercial vehicle licensing, corridor ratings, and carrier compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        {/* Left Column: Carrier Identity Card */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 lg:p-7 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] font-heading font-extrabold text-2xl border border-[#CCFF00]/30 shrink-0 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                {driver.full_name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-extrabold text-white">
                    {driver.full_name}
                  </h2>
                  <ShieldCheck size={20} className="text-[#CCFF00]" />
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-white">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {driver.rating}
                  </span>
                  <span>·</span>
                  <span>{driver.trips_completed} rural trips completed</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="text-slate-400 flex items-center gap-2 font-semibold">
                  <Truck size={15} className="text-[#CCFF00]" /> Vehicle Registration Number
                </span>
                <span className="font-heading font-bold text-white text-sm">
                  {driver.vehicle_number}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="text-slate-400 flex items-center gap-2 font-semibold">
                  <Award size={15} className="text-[#CCFF00]" /> Vehicle Category
                </span>
                <span className="font-bold text-white capitalize">
                  {driver.vehicle_type.replace("_", " ")} (Standard 1000 kg Bed)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="text-slate-400 flex items-center gap-2 font-semibold">
                  <MapPin size={15} className="text-[#CCFF00]" /> Base Operations Hub
                </span>
                <span className="font-bold text-white">
                  {driver.home_village} (Western Maharashtra Corridor)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="text-slate-400 flex items-center gap-2 font-semibold">
                  <Phone size={15} className="text-[#CCFF00]" /> Registered Mobile Contact
                </span>
                <span className="font-bold text-white">{driver.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Carrier Compliance & Quick Links */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">
              Regulatory Compliance & Inspections
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-emerald-400" />
                  <span className="font-medium text-white">Commercial Driving License (LMV)</span>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Verified ✓
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-emerald-400" />
                  <span className="font-medium text-white">Vehicle Fitness & Insurance</span>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Valid 2026 ✓
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-emerald-400" />
                  <span className="font-medium text-white">Maharashtra Goods Permit</span>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Active ✓
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link to="/login">
              <PillButton variant="ghost" className="w-full text-slate-300 hover:text-white border border-white/10">Log Out of Driver Session</PillButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
