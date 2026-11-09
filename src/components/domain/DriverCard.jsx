import { Phone, Star, ShieldCheck, Truck } from "lucide-react";
import { PillButton } from "@/components/design/PillButton";
import { useLanguage } from "@/contexts/LanguageContext";

export function DriverCard({ driver, onCall, showCallButton = true, className = "" }) {
  const { t } = useLanguage();

  if (!driver || !driver.full_name) {
    return (
      <div className={`rounded-lg border border-dashed border-hairline bg-white/60 p-5 text-center ${className}`}>
        <Truck className="mx-auto mb-2 text-muted" size={24} />
        <p className="font-heading text-sm font-bold text-ink">No Driver Assigned</p>
        <p className="text-xs text-muted mt-1">Vehicle and driver will be assigned once matching route is established.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-hairline bg-white p-5 shadow-card ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-wash text-primary font-heading font-extrabold text-base border border-primary/20">
            {driver.full_name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-heading text-base font-extrabold text-ink">{driver.full_name}</h4>
              {driver.verified !== false ? (
                <ShieldCheck size={16} className="text-primary shrink-0" />
              ) : null}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
              <span className="flex items-center gap-0.5 font-bold text-ink">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {driver.rating || "4.8"}
              </span>
              <span>·</span>
              <span>{driver.trips_completed || 120} trips</span>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-wash text-primary">
          {driver.vehicle_number || "MH-12"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-canvas p-3 text-xs border border-hairline/60">
        <div>
          <span className="text-muted block text-[11px]">Vehicle Type</span>
          <span className="font-bold text-ink capitalize">
            {(driver.vehicle_type || "mini_tempo").replace("_", " ")}
          </span>
        </div>
        <div>
          <span className="text-muted block text-[11px]">Phone</span>
          <span className="font-bold text-ink">{driver.phone || "Verified"}</span>
        </div>
      </div>

      {showCallButton && driver.phone ? (
        <div className="mt-4">
          <PillButton
            variant="ghost"
            onClick={() => onCall?.(driver.phone)}
            className="flex items-center justify-center gap-2 text-sm py-3"
          >
            <Phone size={15} />
            {t("callDriver")} ({driver.phone})
          </PillButton>
        </div>
      ) : null}
    </div>
  );
}

export default DriverCard;
