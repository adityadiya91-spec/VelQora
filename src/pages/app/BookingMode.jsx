import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/design/ScreenHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getDraft, saveDraft } from "@/lib/draft";
import { calculateFare } from "@/lib/fare";
import { formatINR } from "@/lib/utils";
import { Users, Zap, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingMode() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { villages, vehicleTypes, createBooking } = useData();
  const { isPrimaryMode } = useTheme();

  const draft = getDraft();
  const [selectedMode, setSelectedMode] = useState("shared");

  const pickupVillage =
    villages.find((v) => v.name === draft?.pickup_village) || villages[0];

  const destinationVillage =
    villages.find((v) => v.name === draft?.destination) || villages[1];

  const vehicleType =
    vehicleTypes.find((vt) => vt.code === draft?.vehicle_type) || vehicleTypes[0];

  const sharedFare = useMemo(() => {
    return calculateFare({
      pickupVillage,
      destinationVillage,
      weight_kg: Number(draft?.weight_kg || 25),
      mode: "shared",
      vehicleType,
    });
  }, [pickupVillage, destinationVillage, draft?.weight_kg, vehicleType]);

  const priorityFare = useMemo(() => {
    return calculateFare({
      pickupVillage,
      destinationVillage,
      weight_kg: Number(draft?.weight_kg || 25),
      mode: "priority",
      vehicleType,
    });
  }, [pickupVillage, destinationVillage, draft?.weight_kg, vehicleType]);

  const handleContinue = () => {
    const activeFare = selectedMode === "shared" ? sharedFare : priorityFare;

    const newBooking = createBooking({
      ...draft,
      pickupVillage,
      destinationVillage,
      vehicleType,
      mode: selectedMode,
      fare: activeFare,
    });

    saveDraft({
      ...draft,
      bookingId: newBooking.id,
      mode: selectedMode,
      fare: activeFare,
    });

    navigate(`/booking/${newBooking.id}`);
  };

  return (
    <div
      className={cn(
        "min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300",
        isPrimaryMode
          ? "bg-[#07090E] text-white selection:bg-[#CCFF00] selection:text-black"
          : "bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6600] selection:text-white"
      )}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <ScreenHeader
          title={t("selectMode")}
          subtitle="Compare shared corridor load aggregation against dedicated priority vehicle dispatch."
          backTo="/app"
          showControls={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shared Economy Mode */}
          <div
            onClick={() => setSelectedMode("shared")}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-3xl border-2 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group",
              selectedMode === "shared"
                ? isPrimaryMode
                  ? "border-[#CCFF00] bg-[#121622] shadow-[0_0_35px_rgba(204,255,0,0.22)] ring-2 ring-[#CCFF00]/40"
                  : "border-[#FF6600] bg-orange-50/70 shadow-[0_15px_35px_rgba(255,102,0,0.18)] ring-2 ring-[#FF6600]/40"
                : isPrimaryMode
                ? "border-white/10 bg-[#121622]/60 hover:bg-[#121622] hover:border-white/20"
                : "border-slate-200 bg-white hover:border-orange-200 shadow-sm"
            )}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl transition border",
                    isPrimaryMode
                      ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                      : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                  )}
                >
                  <Users size={24} />
                </div>

                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition",
                    selectedMode === "shared"
                      ? isPrimaryMode
                        ? "border-[#CCFF00] bg-[#CCFF00] text-black shadow-sm"
                        : "border-[#FF6600] bg-[#FF6600] text-white shadow-sm"
                      : isPrimaryMode
                      ? "border-white/20 bg-white/5"
                      : "border-slate-300 bg-slate-100"
                  )}
                >
                  {selectedMode === "shared" && <CheckCircle2 size={16} />}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={cn(
                      "font-heading text-xl font-black",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    {t("sharedEconomy")}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                      isPrimaryMode
                        ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    )}
                  >
                    <Sparkles size={11} />
                    Save {formatINR(sharedFare.savings)}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs leading-relaxed font-medium",
                    isPrimaryMode ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {t("sharedEconomyDesc")}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "mt-6 border-t pt-4",
                isPrimaryMode ? "border-white/10" : "border-slate-200"
              )}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <span
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider block",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    Your Fractional Fair Share
                  </span>
                  <span
                    className={cn(
                      "font-heading text-3xl font-black",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    {formatINR(sharedFare.fare_total)}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={cn(
                      "text-xs line-through block font-medium",
                      isPrimaryMode ? "text-slate-500" : "text-slate-400"
                    )}
                  >
                    {formatINR(sharedFare.individual_total)}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-extrabold",
                      isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
                    )}
                  >
                    {Math.round((sharedFare.capacity_share || 0) * 100)}% load capacity
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "mt-3.5 rounded-xl p-3 text-[11px] font-medium border leading-relaxed",
                  isPrimaryMode
                    ? "bg-black/40 text-slate-300 border-white/10"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                Corridor route aggregation with nearby village shipments.
              </div>
            </div>
          </div>

          {/* Priority Dedicated Mode */}
          <div
            onClick={() => setSelectedMode("priority")}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-3xl border-2 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group",
              selectedMode === "priority"
                ? isPrimaryMode
                  ? "border-[#CCFF00] bg-[#121622] shadow-[0_0_35px_rgba(204,255,0,0.22)] ring-2 ring-[#CCFF00]/40"
                  : "border-[#FF6600] bg-orange-50/70 shadow-[0_15px_35px_rgba(255,102,0,0.18)] ring-2 ring-[#FF6600]/40"
                : isPrimaryMode
                ? "border-white/10 bg-[#121622]/60 hover:bg-[#121622] hover:border-white/20"
                : "border-slate-200 bg-white hover:border-orange-200 shadow-sm"
            )}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl transition border",
                    isPrimaryMode
                      ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                      : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                  )}
                >
                  <Zap size={24} />
                </div>

                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition",
                    selectedMode === "priority"
                      ? isPrimaryMode
                        ? "border-[#CCFF00] bg-[#CCFF00] text-black shadow-sm"
                        : "border-[#FF6600] bg-[#FF6600] text-white shadow-sm"
                      : isPrimaryMode
                      ? "border-white/20 bg-white/5"
                      : "border-slate-300 bg-slate-100"
                  )}
                >
                  {selectedMode === "priority" && <CheckCircle2 size={16} />}
                </div>
              </div>

              <div className="mt-5">
                <h3
                  className={cn(
                    "font-heading text-xl font-black",
                    isPrimaryMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {t("priority")}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-xs leading-relaxed font-medium",
                    isPrimaryMode ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {t("priorityDesc")}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "mt-6 border-t pt-4",
                isPrimaryMode ? "border-white/10" : "border-slate-200"
              )}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <span
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider block",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    Dedicated Vehicle Total
                  </span>
                  <span
                    className={cn(
                      "font-heading text-3xl font-black",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    {formatINR(priorityFare.fare_total)}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-bold",
                      isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
                    )}
                  >
                    <ShieldCheck size={14} /> Immediate Dispatch
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "mt-3.5 rounded-xl p-3 text-[11px] font-medium border leading-relaxed",
                  isPrimaryMode
                    ? "bg-black/40 text-slate-300 border-white/10"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                Exclusive single-party carriage directly to destination point.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className={cn(
              "w-full sm:w-auto sm:px-12 rounded-2xl py-4 font-heading text-base font-extrabold tracking-tight transition active:scale-[0.98] shadow-xl flex items-center justify-center gap-2",
              isPrimaryMode
                ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:bg-[#b8e600]"
                : "bg-[#FF6600] text-white shadow-[0_0_20px_rgba(255,102,0,0.4)] hover:bg-[#e65c00]"
            )}
          >
            <span>{t("continue")}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
