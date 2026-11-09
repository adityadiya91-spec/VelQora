import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { PillButton } from "@/components/design/PillButton";
import { StatusPill } from "@/components/design/StatusPill";
import { formatINR } from "@/lib/utils";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  Package,
  Ruler,
  Weight,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DriverHome() {
  const navigate = useNavigate();
  const { drivers, bookings, acceptTrip } = useData();

  const activeDriver = drivers[0];
  const [dutyStatus, setDutyStatus] = useState(activeDriver.status || "available");

  const myTrips = bookings.filter(
    (b) =>
      b.driver_name === activeDriver.full_name ||
      b.driver_phone === activeDriver.phone
  );

  const availableTrips = bookings.filter(
    (b) => b.status === "pending_match" || (!b.driver_name && b.status !== "cancelled")
  );

  const handleAccept = (booking) => {
    acceptTrip(booking.id, activeDriver);
    navigate(`/driver/trips/${booking.id}`);
  };

  // On-Truck Cargo Calculations
  const maxPayloadKg =
    activeDriver.vehicle_type === "cargo_truck"
      ? 3500
      : activeDriver.vehicle_type === "pickup_van"
      ? 1000
      : 750;

  const maxVolumeCbm =
    activeDriver.vehicle_type === "cargo_truck"
      ? 14
      : activeDriver.vehicle_type === "pickup_van"
      ? 6
      : 4;

  const totalTruckWeight = myTrips.reduce(
    (acc, b) => acc + Number(b.weight_kg || 0),
    0
  );

  const totalTruckVolume = myTrips.reduce(
    (acc, b) => acc + Number(b.volume_cbm || 0.25),
    0
  );

  const weightPercent = Math.min(
    100,
    Math.round((totalTruckWeight / maxPayloadKg) * 100)
  );

  const volumePercent = Math.min(
    100,
    Math.round((totalTruckVolume / maxVolumeCbm) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Carrier Header Card */}
      <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] font-heading font-extrabold text-xl border border-[#CCFF00]/30 shrink-0 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
            {activeDriver.full_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg sm:text-xl font-extrabold text-white">
                {activeDriver.full_name}
              </h2>
              <ShieldCheck size={18} className="text-[#CCFF00]" />
              <span className="rounded-full bg-white/10 text-[10px] font-bold text-white px-2 py-0.5 border border-white/15">
                Carrier Partner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vehicle: <span className="font-bold text-white">{activeDriver.vehicle_number}</span> ·{" "}
              <span className="capitalize text-slate-300">
                {activeDriver.vehicle_type.replace("_", " ")}
              </span>{" "}
              ({activeDriver.home_village} APMC Hub)
            </p>
          </div>
        </div>

        {/* Duty Toggle Button */}
        <button
          type="button"
          onClick={() =>
            setDutyStatus(dutyStatus === "available" ? "off_duty" : "available")
          }
          className={cn(
            "px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm",
            dutyStatus === "available"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
              : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              dutyStatus === "available" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
            )}
          />
          <span>{dutyStatus === "available" ? "Carrier On-Duty (Active)" : "Off-Duty"}</span>
        </button>
      </div>

      {/* Live Truck Capacity & Manifest Summary */}
      <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-[#CCFF00]" />
            <h3 className="font-heading text-sm font-black uppercase tracking-wider text-white">
              Truck Load Factor & Cargo Capacity
            </h3>
          </div>
          <span className="text-xs font-bold text-[#CCFF00] bg-[#CCFF00]/15 px-3 py-0.5 rounded-full border border-[#CCFF00]/30 self-start sm:self-auto">
            {myTrips.length} Customer Consignments on Board
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Weight Payload Bar */}
          <div className="p-3.5 rounded-xl bg-[#0B101D] border border-white/5 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Weight size={14} className="text-[#CCFF00]" />
                <span>Weight Payload</span>
              </span>
              <span className="font-bold text-white">
                {totalTruckWeight} kg / {maxPayloadKg} kg ({weightPercent}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#CCFF00] transition-all duration-300"
                style={{ width: `${Math.max(4, weightPercent)}%` }}
              />
            </div>
          </div>

          {/* Volume Capacity Bar */}
          <div className="p-3.5 rounded-xl bg-[#0B101D] border border-white/5 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers size={14} className="text-[#CCFF00]" />
                <span>Volumetric Capacity</span>
              </span>
              <span className="font-bold text-white">
                {totalTruckVolume.toFixed(2)} m³ / {maxVolumeCbm} m³ CBM ({volumePercent}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${Math.max(4, volumePercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        {/* Left Column: My Assigned Shipments with Full Customer & Parcel Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-400">
              Assigned Truck Consignments ({myTrips.length})
            </h3>
            <span className="text-xs text-slate-400">Complete Customer & Cargo Data</span>
          </div>

          <div className="space-y-4">
            {myTrips.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#121622]/60 p-8 text-center text-xs text-slate-400">
                No active shipments assigned. Accept an available trip from the corridor pool to start.
              </div>
            ) : (
              myTrips.map((b) => (
                <div
                  key={b.id}
                  onClick={() => navigate(`/driver/trips/${b.id}`)}
                  className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl hover:border-[#CCFF00]/50 hover:shadow-[0_0_25px_rgba(204,255,0,0.1)] cursor-pointer transition space-y-4 group"
                >
                  {/* Top Bar: Tracking ID & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-[#CCFF00]">
                          {b.tracking_id}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                          {b.mode} transport
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-extrabold text-white mt-1 group-hover:text-[#CCFF00] transition">
                        {b.pickup_village} → {b.destination}
                      </h4>
                    </div>
                    <StatusPill status={b.status} />
                  </div>

                  {/* Customer Information Card */}
                  <div className="rounded-xl bg-[#0B101D] p-3.5 border border-white/5 space-y-2 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Customer & Contact Details
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-white block text-sm">
                          {b.entrepreneur_name || "Santosh Deshmukh (Kisan Agro)"}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-[#CCFF00]" />
                          Pickup Hub: {b.pickup_landmark || "Main Bazaar Hub"} ({b.pickup_village})
                        </span>
                        {b.recipient_name && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Recipient: {b.recipient_name} ({b.destination})
                          </span>
                        )}
                      </div>

                      {/* Direct Call Button */}
                      <a
                        href={`tel:${b.customer_phone || "+919822012345"}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 hover:bg-[#CCFF00]/25 transition font-bold text-xs shrink-0 self-start sm:self-auto"
                      >
                        <PhoneCall size={13} />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>

                  {/* Parcel Details on the Truck */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-xl bg-[#0B101D] p-3.5 border border-white/5 text-xs">
                    {/* Parcel Photo Thumbnail */}
                    <div className="sm:col-span-3 rounded-lg overflow-hidden border border-white/10 h-20 bg-black/40 flex items-center justify-center shrink-0">
                      {b.parcel_image ? (
                        <img
                          src={b.parcel_image}
                          alt="Parcel Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Package size={20} />
                          <span className="text-[9px] mt-1 font-semibold">Standard Box</span>
                        </div>
                      )}
                    </div>

                    {/* Parcel Specs */}
                    <div className="sm:col-span-9 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-xs">
                          {b.weight_kg} kg
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="capitalize text-slate-200 font-semibold">
                          {b.category}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {b.dimensions || "3.0 × 2.0 × 1.5 ft"}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        Handling: {b.handling_notes || "Perishable cargo. Keep protected."}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">
                          Window: <span className="text-slate-200 font-semibold">{b.dispatch_window}</span>
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {b.payment_status === "paid" ? "Prepaid Online" : "Pay at Dropoff"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer: Payout & Advance Button */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Carrier Payout
                      </span>
                      <span className="font-heading font-black text-lg text-white">
                        {formatINR(b.fare_base)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#CCFF00] group-hover:translate-x-1 transition">
                      <span>Trip Actions & Verification</span>
                      <ChevronRight size={15} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Available Corridors Pool */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-400">
              Available Rural Corridors ({availableTrips.length})
            </h3>
            <span className="text-xs font-semibold text-[#CCFF00]">Live Pooling</span>
          </div>

          <div className="space-y-3.5">
            {availableTrips.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl space-y-3 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading text-base font-extrabold text-white">
                      {b.pickup_village} → {b.destination}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Shipper: <span className="text-slate-200">{b.entrepreneur_name || "Village Producer"}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hub: <span className="text-slate-200">{b.pickup_landmark || "Village Collection Point"}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cargo: <span className="text-slate-200">{b.weight_kg} kg</span> ({b.category}) · <span className="font-mono text-slate-300">{b.dimensions || "Standard Crate"}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold font-heading text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full block">
                      {formatINR(b.fare_base)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Payout</span>
                  </div>
                </div>

                <div className="pt-2">
                  <PillButton
                    variant="coral"
                    className="py-2.5 text-xs w-full justify-center"
                    onClick={() => handleAccept(b)}
                  >
                    Accept Consignment & Add to Route
                  </PillButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
