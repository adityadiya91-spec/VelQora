import { StatusPill } from "@/components/design/StatusPill";
import { PillButton } from "@/components/design/PillButton";
import { formatINR, formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function BookingRow({ booking, onTrack, onInvoice }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-xl hover:border-[#CCFF00]/40 transition space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-base font-extrabold text-white">
            {booking.pickup_village} → {booking.destination}
          </p>

          <p className="mt-1 text-xs text-slate-300">
            {formatDate(booking.pickup_date)} · {booking.dispatch_window}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {booking.weight_kg} kg · {booking.category}
          </p>
        </div>

        <StatusPill status={booking.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Fair Share</span>
          <p className="font-heading text-lg font-black text-[#CCFF00]">
            {formatINR(booking.fare_total)}
          </p>
        </div>

        <div className="flex gap-2">
          {booking.status !== "cancelled" ? (
            <PillButton
              variant="ghost"
              className="w-auto px-4 py-2 text-xs border border-white/20 text-white hover:bg-white/10"
              onClick={() => onTrack?.(booking)}
            >
              {t("track")}
            </PillButton>
          ) : null}

          <PillButton
            variant="coral"
            className="w-auto px-4 py-2 text-xs"
            onClick={() => onInvoice?.(booking)}
          >
            {t("invoice")}
          </PillButton>
        </div>
      </div>
    </div>
  );
}