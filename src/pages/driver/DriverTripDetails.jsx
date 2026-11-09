import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { StatusPill } from "@/components/design/StatusPill";
import { StatusTimeline } from "@/components/design/StatusTimeline";
import { PillButton } from "@/components/design/PillButton";
import { InputBox } from "@/components/design/InputBox";
import { formatINR, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Package,
  Weight,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  User,
  Ruler,
  Layers,
  FileText,
  CreditCard,
} from "lucide-react";

export default function DriverTripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBooking, advanceDriverStatus } = useData();

  const booking = getBooking(id);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  if (!booking) {
    return (
      <div className="py-20 text-center">
        <p className="font-heading text-lg font-bold">Trip not found</p>
        <PillButton variant="ghost" className="mt-4" onClick={() => navigate("/driver")}>
          Back to Trips
        </PillButton>
      </div>
    );
  }

  const handleVerify = (e) => {
    e.preventDefault();
    const cleanInput = verifyCode.trim().toUpperCase();
    if (
      cleanInput === booking.parcel_id.toUpperCase() ||
      cleanInput === booking.tracking_id.toUpperCase() ||
      cleanInput === String(booking.id).toUpperCase()
    ) {
      setIsVerified(true);
      setVerifyError("");
    } else {
      setVerifyError("Code did not match parcel QR/ID. Please check consignment label.");
    }
  };

  const handleAdvance = (nextStatus, note) => {
    advanceDriverStatus(booking.id, nextStatus, note);
  };

  const customerPhone = booking.customer_phone || "+91 98220 12345";
  const recipientName = booking.recipient_name || `${booking.destination} Mandi Union`;
  const recipientPhone = booking.recipient_phone || "+91 98901 23456";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <button
            onClick={() => navigate("/driver")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft size={16} /> Back to Assigned Consignments
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
              Trip Details · Consignment #{booking.parcel_id}
            </span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-white mt-0.5">
            {booking.pickup_village} → {booking.destination}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <StatusPill status={booking.status} />
        </div>
      </div>

      {/* 2-Column Responsive Layout for Web Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        {/* Left Column: Customer Data, Parcel Specs & Verification */}
        <div className="lg:col-span-7 space-y-5">
          {/* Customer & Shipper Contact Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
                <User size={15} />
                <span>Customer & Shipper Profile</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                Registered Rural Entrepreneur
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Shipper Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0B101D] border border-white/5">
                <div>
                  <span className="font-bold text-white text-base block">
                    {booking.entrepreneur_name || "Kisan Agro Foods (Santosh Deshmukh)"}
                  </span>
                  <span className="text-slate-400 text-xs block mt-0.5">
                    Shipper Contact: <span className="text-white font-mono">{customerPhone}</span>
                  </span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    Collection Point: <span className="text-slate-200">{booking.pickup_landmark || "Main Bazaar Hub"}</span> ({booking.pickup_village})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 hover:bg-[#CCFF00]/25 transition font-bold text-xs"
                  >
                    <PhoneCall size={14} />
                    <span>Call Shipper</span>
                  </a>
                  <a
                    href={`sms:${customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/20 transition font-bold text-xs"
                  >
                    <MessageSquare size={14} />
                    <span>SMS</span>
                  </a>
                </div>
              </div>

              {/* Destination Recipient Details */}
              <div className="p-3.5 rounded-xl bg-[#0B101D] border border-white/5 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Delivery Destination & Receiver Details
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white block">
                      {recipientName}
                    </span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Destination Mandi: {booking.destination} Corridor ({booking.distance_km} km)
                    </span>
                  </div>
                  <a
                    href={`tel:${recipientPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 transition text-xs font-semibold self-start sm:self-auto"
                  >
                    <PhoneCall size={12} />
                    <span>{recipientPhone}</span>
                  </a>
                </div>
              </div>

              {/* Date & Window */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0B101D] border border-white/5">
                  <Calendar size={14} className="text-[#CCFF00]" />
                  <span>Pickup: {formatDate(booking.pickup_date)}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0B101D] border border-white/5">
                  <Clock size={14} className="text-[#CCFF00]" />
                  <span>Window: {booking.dispatch_window}</span>
                </div>
              </div>
            </div>
          </div>

          {/* On-Truck Parcel Specifications & Measurements */}
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
                <Package size={15} />
                <span>On-Truck Parcel Specifications & Measurements</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                {booking.category}
              </span>
            </div>

            {/* Photo & Technical Measurements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Parcel Photo Preview */}
              <div className="sm:col-span-5 rounded-2xl overflow-hidden border border-white/15 bg-black/50 h-44 flex flex-col items-center justify-center relative">
                {booking.parcel_image ? (
                  <img
                    src={booking.parcel_image}
                    alt="Verified Consignment"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                    <Package size={32} />
                    <span className="text-xs mt-2 font-bold text-slate-400">Standard Packaged Load</span>
                    <span className="text-[10px] text-slate-500">Produce consignment crate</span>
                  </div>
                )}
                <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-white backdrop-blur-xs border border-white/15">
                  {booking.tracking_id}
                </span>
              </div>

              {/* Exact Measurements Spec Sheet */}
              <div className="sm:col-span-7 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0B101D] border border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Certified Gross Weight
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-2xl text-white">
                      {booking.weight_kg} kg
                    </span>
                    <span className="text-slate-400 text-xs">
                      (Fair Load Share: {Math.round((booking.capacity_share || 0.1) * 100)}% of truck)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B101D] border border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Proper Box Dimensions & Volume
                  </span>
                  <p className="font-bold text-white text-xs font-mono">
                    {booking.dimensions || "3.0 × 2.0 × 1.5 ft (9 cu.ft / 0.25 m³)"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Calculated Cubic Volume: <span className="font-bold text-cyan-300">{booking.volume_cbm || 0.25} m³ CBM</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0B101D] border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Handling Precautions
                  </span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    {booking.handling_notes || "Perishable agricultural produce. Protect from moisture & direct sun."}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Settlement Summary */}
            <div className="p-3.5 rounded-xl bg-[#0B101D] border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-[#CCFF00]" />
                <div>
                  <span className="font-bold text-white block">Payment Settlement</span>
                  <span className="text-[11px] text-slate-400">
                    {booking.payment_status === "paid" ? "Paid Online via UPI (Escrow Protected)" : "Collect on Delivery"}
                  </span>
                </div>
              </div>
              <span className="text-sm font-black text-white">
                {formatINR(booking.fare_total)}
              </span>
            </div>
          </div>

          {/* Parcel Physical Verification */}
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">
                Physical Parcel Verification at Pickup Hub
              </h3>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} /> Verified at Hub
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                  Verification Required Before Loading
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Verify consignment label code (<span className="font-mono font-bold text-white">{booking.tracking_id}</span> or <span className="font-mono font-bold text-white">{booking.parcel_id}</span>) before loading into vehicle.
            </p>

            {!isVerified ? (
              <form onSubmit={handleVerify} className="space-y-3">
                <div className="flex gap-2">
                  <InputBox
                    placeholder="Enter or scan tracking ID..."
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    icon={<QrCode size={18} />}
                    className="py-1 bg-[#0B101D] border-white/10 text-white"
                    inputClassName="py-2.5 text-xs font-mono text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#CCFF00] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#b8e600] transition shrink-0 shadow-md"
                  >
                    Verify
                  </button>
                </div>

                {verifyError && (
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> {verifyError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setVerifyCode(booking.tracking_id);
                    setIsVerified(true);
                  }}
                  className="text-xs font-bold text-[#CCFF00] hover:underline block"
                >
                  ⚡ Simulate One-Click Barcode Scan (Demo)
                </button>
              </form>
            ) : (
              <div className="rounded-xl bg-emerald-500/15 p-4 text-xs text-emerald-300 border border-emerald-500/30">
                ✓ Physical consignment verified: {booking.weight_kg} kg load (<span className="capitalize">{booking.category}</span>). Matches customer specifications.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status Advancement & Timeline */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Status Advancement Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">
              Advance Consignment Status
            </h3>

            <div className="space-y-3">
              {booking.status === "assigned" && (
                <PillButton
                  variant="primary"
                  onClick={() =>
                    handleAdvance("pickup_started", "Driver is traveling to registered pickup hub")
                  }
                  className="py-3.5 w-full justify-center"
                >
                  Start Pickup Run →
                </PillButton>
              )}

              {booking.status === "pickup_started" && (
                <PillButton
                  variant="coral"
                  disabled={!isVerified}
                  onClick={() =>
                    handleAdvance("picked_up", "Parcel verified and loaded into vehicle")
                  }
                  className="py-3.5 w-full justify-center"
                >
                  Confirm Consignment Loaded
                </PillButton>
              )}

              {booking.status === "picked_up" && (
                <PillButton
                  variant="primary"
                  onClick={() =>
                    handleAdvance("in_transit", "Shared vehicle departed on highway toward destination")
                  }
                  className="py-3.5 w-full justify-center"
                >
                  Depart on Highway (In Transit) →
                </PillButton>
              )}

              {booking.status === "in_transit" && (
                <PillButton
                  variant="coral"
                  onClick={() =>
                    handleAdvance("delivered", "Parcel handed over at destination point")
                  }
                  className="py-3.5 w-full justify-center"
                >
                  Mark Consignment Delivered ✓
                </PillButton>
              )}

              {booking.status === "delivered" && (
                <div className="rounded-xl bg-emerald-500/15 p-4 text-center text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Trip completed. Settled payout of {formatINR(booking.fare_base)} credited to carrier account.
                </div>
              )}
            </div>
          </div>

          {/* Trip Timeline */}
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/10">
              Consignment Audit Trail
            </h3>
            <StatusTimeline timeline={booking.timeline} currentStatus={booking.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
