import { useParams, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/design/ScreenHeader";
import { PillButton } from "@/components/design/PillButton";
import { StatusPill } from "@/components/design/StatusPill";
import { PriceBreakup } from "@/components/domain/PriceBreakup";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar, Clock, Package, Weight, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getBooking } = useData();
  const { isPrimaryMode } = useTheme();

  const booking = getBooking(id);

  if (!booking) {
    return (
      <div
        className={cn(
          "min-h-screen py-20 text-center flex flex-col items-center justify-center transition-colors duration-300",
          isPrimaryMode ? "bg-[#07090E] text-white" : "bg-[#F8FAFC] text-slate-900"
        )}
      >
        <p className="font-heading text-lg font-bold">Booking not found</p>
        <div className="mt-4">
          <PillButton variant="ghost" onClick={() => navigate("/app")}>
            Back to Home
          </PillButton>
        </div>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    navigate(`/booking/${booking.id}/pay`);
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
          title={t("bookingSummary")}
          subtitle={`Consignment Tracking ID: ${booking.tracking_id} · Mode: ${booking.mode.toUpperCase()}`}
          backTo="/booking/new"
          showControls={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
          {/* Left Column: Route & Parcel Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* Route Card */}
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-7 shadow-xl transition-all duration-300",
                isPrimaryMode
                  ? "border-white/10 bg-[#121622] text-white"
                  : "border-orange-200 bg-white text-slate-900 shadow-md"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between pb-3 border-b",
                  isPrimaryMode ? "border-white/10" : "border-slate-200"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  Corridor Routing Itinerary
                </span>
                <StatusPill status={booking.status} />
              </div>

              <div
                className={cn(
                  "mt-5 relative pl-6 space-y-5 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-[2px]",
                  isPrimaryMode ? "before:bg-white/15" : "before:bg-orange-200"
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2",
                      isPrimaryMode
                        ? "border-[#CCFF00] bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                        : "border-[#FF6600] bg-[#FF6600] shadow-[0_0_8px_rgba(255,102,0,0.6)]"
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        "font-heading text-lg font-black",
                        isPrimaryMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      {booking.pickup_village}
                    </p>
                    <p
                      className={cn(
                        "text-xs flex items-center gap-1.5 mt-0.5 font-medium",
                        isPrimaryMode ? "text-slate-300" : "text-slate-600"
                      )}
                    >
                      <MapPin
                        size={13}
                        className={isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"}
                      />
                      {booking.pickup_landmark || "Registered Village Collection Point"}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={cn(
                      "absolute -left-6 top-1 h-3.5 w-3.5 rounded-full",
                      isPrimaryMode
                        ? "bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                        : "bg-[#FF6600] shadow-[0_0_8px_rgba(255,102,0,0.6)]"
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        "font-heading text-lg font-black",
                        isPrimaryMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      {booking.destination}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5 font-medium",
                        isPrimaryMode ? "text-slate-300" : "text-slate-600"
                      )}
                    >
                      Rural Mandi Delivery Destination ({booking.distance_km} km Corridor)
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "mt-6 grid grid-cols-2 gap-3 border-t pt-4 text-xs",
                  isPrimaryMode ? "border-white/10" : "border-slate-200"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border",
                    isPrimaryMode
                      ? "bg-[#0B101D] border-white/5"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <Calendar
                    size={16}
                    className={isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"}
                  />
                  <div>
                    <span
                      className={cn(
                        "text-[10px] block font-semibold",
                        isPrimaryMode ? "text-slate-400" : "text-slate-500"
                      )}
                    >
                      Pickup Date
                    </span>
                    <span
                      className={cn(
                        "font-extrabold",
                        isPrimaryMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      {formatDate(booking.pickup_date)}
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border",
                    isPrimaryMode
                      ? "bg-[#0B101D] border-white/5"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <Clock
                    size={16}
                    className={isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"}
                  />
                  <div>
                    <span
                      className={cn(
                        "text-[10px] block font-semibold",
                        isPrimaryMode ? "text-slate-400" : "text-slate-500"
                      )}
                    >
                      Time Window
                    </span>
                    <span
                      className={cn(
                        "font-extrabold",
                        isPrimaryMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      {booking.dispatch_window}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Specifications */}
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-7 shadow-xl space-y-4 transition-all duration-300",
                isPrimaryMode
                  ? "border-white/10 bg-[#121622] text-white"
                  : "border-orange-200 bg-white text-slate-900 shadow-md"
              )}
            >
              <h4
                className={cn(
                  "font-heading text-xs font-bold uppercase tracking-wider",
                  isPrimaryMode ? "text-slate-400" : "text-slate-500"
                )}
              >
                Consignment Specifications
              </h4>

              {booking.parcel_image && (
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden border h-40 flex items-center justify-center",
                    isPrimaryMode
                      ? "border-white/10 bg-black/40"
                      : "border-slate-200 bg-slate-100"
                  )}
                >
                  <img
                    src={booking.parcel_image}
                    alt="Consignment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div
                  className={cn(
                    "rounded-2xl p-3.5 border",
                    isPrimaryMode
                      ? "bg-[#0B101D] border-white/5"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs flex items-center gap-1 font-semibold",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    <Weight size={13} /> Weight
                  </span>
                  <span
                    className={cn(
                      "font-heading font-black text-lg mt-0.5 block",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    {booking.weight_kg} kg
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-2xl p-3.5 border",
                    isPrimaryMode
                      ? "bg-[#0B101D] border-white/5"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs flex items-center gap-1 font-semibold",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    <Package size={13} /> Commodity
                  </span>
                  <span
                    className={cn(
                      "font-heading font-black text-lg mt-0.5 block capitalize",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    {booking.category}
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-2xl p-3.5 border col-span-2 sm:col-span-1",
                    isPrimaryMode
                      ? "bg-[#0B101D] border-white/5"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs block font-semibold",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    Dimensions
                  </span>
                  <span
                    className={cn(
                      "font-heading font-bold text-sm mt-1 block",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    {booking.dimensions || "Standard rural crate"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fare Breakdown & Action */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-7 shadow-xl space-y-4 transition-all duration-300",
                isPrimaryMode
                  ? "border-white/10 bg-[#121622] text-white"
                  : "border-orange-200 bg-white text-slate-900 shadow-md"
              )}
            >
              <h4
                className={cn(
                  "font-heading text-sm font-bold uppercase tracking-wider pb-2 border-b",
                  isPrimaryMode
                    ? "border-white/10 text-slate-400"
                    : "border-slate-200 text-slate-500"
                )}
              >
                {t("fareBreakup")}
              </h4>

              <PriceBreakup booking={booking} />

              <div
                className={cn(
                  "rounded-2xl p-3.5 border flex items-start gap-2.5 text-xs leading-relaxed",
                  isPrimaryMode
                    ? "bg-[#0B101D] border-white/5 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                )}
              >
                <Info
                  size={16}
                  className={cn(
                    "shrink-0 mt-0.5",
                    isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
                  )}
                />
                <span>
                  Shared pricing is dynamically consolidated along the {booking.pickup_village} highway corridor and finalized at carrier vehicle dispatch.
                </span>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className={cn(
                    "w-full rounded-2xl py-4 font-heading text-base font-extrabold tracking-tight transition active:scale-[0.98] shadow-xl flex items-center justify-center gap-2",
                    isPrimaryMode
                      ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:bg-[#b8e600]"
                      : "bg-[#FF6600] text-white shadow-[0_0_20px_rgba(255,102,0,0.4)] hover:bg-[#e65c00]"
                  )}
                >
                  <span>{t("proceedPayment")}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/bookings")}
                  className={cn(
                    "w-full rounded-2xl py-3 px-4 font-heading text-xs font-bold transition border",
                    isPrimaryMode
                      ? "border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Save Consignment & View All Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
