import { motion } from "framer-motion";
import { X } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/design/StatusPill";

export function InvoiceDialog({ booking, open, onClose }) {
  if (!open || !booking) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-[#121622] p-6 shadow-2xl text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#CCFF00] font-black">
              Consignment Tax Invoice
            </p>

            <h3 className="mt-1 font-heading text-xl font-extrabold text-white">
              {booking.tracking_id}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-4">
          <StatusPill status={booking.status} />
        </div>

        <div className="space-y-3 rounded-2xl bg-[#0B101D] border border-white/5 p-4 text-xs sm:text-sm text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Route</span>
            <span className="font-semibold text-white">
              {booking.pickup_village} → {booking.destination}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Pickup Date</span>
            <span className="font-semibold text-white">
              {formatDate(booking.pickup_date)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Weight</span>
            <span className="font-semibold text-white">{booking.weight_kg} kg</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Mode</span>
            <span className="font-semibold uppercase text-[#CCFF00]">{booking.mode}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Payment</span>
            <span className="font-semibold uppercase text-emerald-400">
              {booking.payment_status}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs sm:text-sm text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Base Allocation</span>
            <span>{formatINR(booking.fare_base)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Weight Share</span>
            <span>{formatINR(booking.fare_allocation)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Corridor Handling</span>
            <span>{formatINR(booking.fare_extras)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Rural GST (5%)</span>
            <span>{formatINR(booking.fare_tax)}</span>
          </div>

          <div className="flex justify-between border-t border-white/10 pt-3 font-heading text-base font-extrabold text-white">
            <span>Fair Total</span>
            <span className="text-[#CCFF00] text-lg font-black">{formatINR(booking.fare_total)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}