import { useNavigate } from "react-router-dom";
import { PillButton } from "@/components/design/PillButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { BrandMark } from "@/components/design/BrandMark";
import { Sparkles, Users, Route, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isPrimaryMode } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-colors duration-300",
        isPrimaryMode
          ? "bg-[#07090E] text-white selection:bg-[#CCFF00] selection:text-black"
          : "bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6600] selection:text-white"
      )}
    >
      <div
        className={cn(
          "w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all duration-300",
          isPrimaryMode
            ? "bg-[#121622] border-white/10 text-white"
            : "bg-white border-orange-200 text-slate-900"
        )}
      >
        {/* Left Visual Column */}
        <div className="relative md:col-span-6 h-72 sm:h-96 md:h-auto min-h-[380px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"
            alt="Rural freight transportation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
            <span
              className={cn(
                "text-xs uppercase tracking-widest font-bold block mb-1",
                isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
              )}
            >
              Western Maharashtra Corridor
            </span>
            <p className="font-heading text-xl font-extrabold leading-snug">
              Connecting rural producers in Baramati, Indapur, Daund, Shirur, Jejuri, & Phaltan.
            </p>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="md:col-span-6 p-8 lg:p-12 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <BrandMark size="lg" />
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold border",
                  isPrimaryMode
                    ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                    : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                )}
              >
                Shared Freight PWA
              </span>
            </div>

            <div className="mt-8 space-y-2">
              <h1
                className={cn(
                  "font-heading text-3xl sm:text-4xl font-black tracking-tightest leading-tight",
                  isPrimaryMode ? "text-white" : "text-slate-900"
                )}
              >
                {t("tagline")}
              </h1>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isPrimaryMode ? "text-slate-300" : "text-slate-600"
                )}
              >
                Aggregating compatible small consignments into shared mini-tempos and trucks so you never pay full charter rates for a single parcel.
              </p>
            </div>

            {/* Value propositions */}
            <div
              className={cn(
                "mt-6 space-y-3 border-t pt-6 text-xs",
                isPrimaryMode
                  ? "border-white/10 text-slate-300"
                  : "border-slate-200 text-slate-600"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg shrink-0 border",
                    isPrimaryMode
                      ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                      : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                  )}
                >
                  <Sparkles size={16} />
                </div>
                <span>
                  <strong className={isPrimaryMode ? "text-white" : "text-slate-900"}>
                    38% Average Savings:
                  </strong>{" "}
                  Pay only your consignment&apos;s load share.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg shrink-0 border",
                    isPrimaryMode
                      ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                      : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                  )}
                >
                  <Route size={16} />
                </div>
                <span>
                  <strong className={isPrimaryMode ? "text-white" : "text-slate-900"}>
                    No GPS Constraint:
                  </strong>{" "}
                  Operates using village codes and landmark pins.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg shrink-0 border",
                    isPrimaryMode
                      ? "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30"
                      : "bg-[#FF6600]/15 text-[#FF6600] border-[#FF6600]/30"
                  )}
                >
                  <Users size={16} />
                </div>
                <span>
                  <strong className={isPrimaryMode ? "text-white" : "text-slate-900"}>
                    Trilingual Live Support:
                  </strong>{" "}
                  Marathi, Hindi, & English runtime updates.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <PillButton
              variant="coral"
              onClick={() => navigate("/language")}
              className="flex items-center justify-center gap-2 py-4 text-base"
            >
              <span>{t("getStarted")}</span>
              <ArrowRight size={18} />
            </PillButton>
            <p
              className={cn(
                "text-center text-[11px]",
                isPrimaryMode ? "text-slate-400" : "text-slate-500"
              )}
            >
              Instant demo access · No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
