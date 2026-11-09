import { formatINR } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Info, Sparkles } from "lucide-react";

export function FareEstimateCard({ estimate, showDisclaimer = true, className = "" }) {
  const { t } = useLanguage();

  if (!estimate) return null;

  const capacityPct = Math.min(100, Math.round((estimate.capacity_share || 0) * 100));

  return (
    <div className={`rounded-lg border border-hairline bg-white p-5 shadow-card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-primary" />
          <p className="font-heading text-lg font-extrabold text-ink">
            {t("sharedEstimate")}
          </p>
        </div>

        {estimate.savings > 0 ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
            {t("savings")} {formatINR(estimate.savings)}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <p className="font-heading text-3xl font-extrabold text-ink">
          {formatINR(estimate.fare_total)}
        </p>

        {estimate.individual_total > estimate.fare_total ? (
          <p className="text-sm text-muted line-through font-medium">
            {formatINR(estimate.individual_total)}
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted mb-1.5 font-medium">
          <span>{t("capacityUsed")}</span>
          <span className="font-bold text-ink">{capacityPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-canvas border border-hairline/60">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${capacityPct}%` }}
          />
        </div>
      </div>

      {showDisclaimer ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-canvas p-3 text-xs text-muted border border-hairline/60">
          <Info size={14} className="shrink-0 text-primary mt-0.5" />
          <span>
            Shared pricing aggregates compatible parcels on the same route. Fair allocation is finalized at vehicle dispatch.
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default FareEstimateCard;
