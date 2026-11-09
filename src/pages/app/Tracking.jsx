import { useParams, useNavigate } from "react-router-dom";
import { StatusPill } from "@/components/design/StatusPill";
import { StatusTimeline } from "@/components/design/StatusTimeline";
import { TrackingMap } from "@/components/domain/TrackingMap";
import { DriverCard } from "@/components/domain/DriverCard";
import { PillButton } from "@/components/design/PillButton";
import { ThemeToggle } from "@/components/design/ThemeToggle";
import { LanguageSwitcher } from "@/components/design/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDateTime } from "@/lib/utils";
import { Clock, Route, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getBooking, assignDriver, updateBookingStatus } = useData();
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
        <p className="font-heading text-lg font-bold">Shipment not found</p>
        <div className="mt-4">
          <PillButton variant="ghost" onClick={() => navigate("/bookings")}>
            View All Bookings
          </PillButton>
        </div>
      </div>
    );
  }

  const isPending = booking.status === "pending_match";
  const isDelivered = booking.status === "delivered";

  const handleSimulateAssignment = () => {
    assignDriver(booking.id);
  };

  const handleAdvanceStatus = () => {
    if (booking.status === "assigned") {
      updateBookingStatus(booking.id, "picked_up", "Parcel verified and picked up from hub");
    } else if (booking.status === "picked_up") {
      updateBookingStatus(booking.id, "in_transit", "Shared vehicle departed towards destination");
    } else if (booking.status === "in_transit") {
      updateBookingStatus(booking.id, "delivered", "Successfully delivered to destination hub");
    }
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
      <div
        className={cn(
          "rounded-3xl border p-6 md:p-8 lg:p-10 shadow-2xl max-w-6xl mx-auto space-y-6 transition-all duration-300",
          isPrimaryMode
            ? "bg-[#121622] border-white/10 text-white"
            : "bg-white border-orange-200 text-slate-900 shadow-xl"
        )}
      >
        {/* Top Header */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6",
            isPrimaryMode ? "border-white/10" : "border-slate-200"
          )}
        >
          <div>
            <button
              onClick={() => navigate("/bookings")}
              className={cn(
                "mb-2 text-xs font-semibold flex items-center gap-1 transition",
                isPrimaryMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <ArrowLeft size={14} /> Back to Consignments
            </button>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
                )}
              >
                Live Rural Dispatch
              </span>
              <span className={isPrimaryMode ? "text-white/40" : "text-slate-400"}>·</span>
              <span
                className={cn(
                  "text-xs font-medium",
                  isPrimaryMode ? "text-slate-300" : "text-slate-600"
                )}
              >
                Consignment ID: {booking.parcel_id}
              </span>
            </div>

            <h1
              className={cn(
                "font-heading text-2xl sm:text-3xl font-black mt-1 tracking-tight",
                isPrimaryMode ? "text-white" : "text-slate-900"
              )}
            >
              {booking.tracking_id}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <ThemeToggle compact={true} />
            <LanguageSwitcher compact />
            <StatusPill status={booking.status} />
          </div>
        </div>

        {/* ETA & Corridor Banner */}
        <div
          className={cn(
            "rounded-2xl border p-4 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors",
            isPrimaryMode
              ? "border-white/10 bg-white/5 text-slate-200"
              : "border-orange-200 bg-orange-50/70 text-slate-800"
          )}
        >
          <div className="flex items-center gap-2">
            <Route
              size={16}
              className={isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"}
            />
            <span
              className={cn(
                "font-extrabold text-sm",
                isPrimaryMode ? "text-white" : "text-slate-900"
              )}
            >
              {booking.pickup_village} → {booking.destination}
            </span>
            <span className={isPrimaryMode ? "text-slate-400" : "text-slate-500"}>
              ({booking.distance_km} km highway corridor)
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 font-black",
              isPrimaryMode ? "text-white" : "text-slate-900"
            )}
          >
            <Clock
              size={15}
              className={isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"}
            />
            <span>
              {booking.eta
                ? `Estimated Arrival: ${formatDateTime(booking.eta)}`
                : "ETA: Route Matching in Progress"}
            </span>
          </div>
        </div>

        {/* Main Responsive Grid Layout (Web Resolution 2-Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
          {/* Left Column: Interactive Map View */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={cn(
                "overflow-hidden rounded-2xl border shadow-xl relative",
                isPrimaryMode ? "border-white/15" : "border-slate-300"
              )}
            >
              <div className="h-80 sm:h-96 lg:h-[480px] w-full">
                <TrackingMap booking={booking} />
              </div>

              {/* Map Floating Telemetry Overlay */}
              <div
                className={cn(
                  "absolute bottom-4 left-4 right-4 z-[400] flex items-center justify-between rounded-xl backdrop-blur-md p-3 text-xs border pointer-events-none",
                  isPrimaryMode
                    ? "bg-black/80 text-slate-200 border-white/15"
                    : "bg-white/90 text-slate-800 border-slate-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full animate-ping",
                      isPrimaryMode ? "bg-[#CCFF00]" : "bg-[#FF6600]"
                    )}
                  />
                  <span
                    className={cn(
                      "font-bold",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    Active Corridor Polyline
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  Spatial Layer
                </span>
              </div>
            </div>

            {/* Location Milestone tags */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div
                className={cn(
                  "p-3.5 rounded-2xl border",
                  isPrimaryMode
                    ? "bg-[#0B101D] border-white/5"
                    : "bg-slate-50 border-slate-200"
                )}
              >
                <span
                  className={cn(
                    "block text-[11px] font-semibold",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  Collection Hub
                </span>
                <span
                  className={cn(
                    "font-extrabold block mt-0.5",
                    isPrimaryMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {booking.pickup_village}
                </span>
                <span
                  className={cn(
                    "text-[11px]",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  {booking.pickup_landmark || "Village Center"}
                </span>
              </div>

              <div
                className={cn(
                  "p-3.5 rounded-2xl border",
                  isPrimaryMode
                    ? "bg-[#0B101D] border-white/5"
                    : "bg-slate-50 border-slate-200"
                )}
              >
                <span
                  className={cn(
                    "block text-[11px] font-semibold",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  Destination Node
                </span>
                <span
                  className={cn(
                    "font-extrabold block mt-0.5",
                    isPrimaryMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {booking.destination}
                </span>
                <span
                  className={cn(
                    "text-[11px]",
                    isPrimaryMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  Regional Delivery Hub
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Driver, Progress & Timeline */}
          <div className="lg:col-span-5 space-y-5">
            {/* Waiting match card if pending */}
            {isPending ? (
              <div
                className={cn(
                  "rounded-2xl border p-6 text-xs shadow-card space-y-3",
                  isPrimaryMode
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                    : "border-amber-300 bg-amber-50 text-amber-900"
                )}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-amber-400 shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-heading font-black text-base">
                      {t("waitingMatch")}
                    </h4>
                    <p className="mt-1 leading-relaxed opacity-90">
                      Velqora’s shared corridor algorithm is currently aggregating matching parcels along the {booking.pickup_village} corridor.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSimulateAssignment}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition shadow-xs",
                      isPrimaryMode
                        ? "bg-[#CCFF00] text-black hover:bg-[#b8e600]"
                        : "bg-[#FF6600] text-white hover:bg-[#e65c00]"
                    )}
                  >
                    <Sparkles size={14} /> Simulate Driver Match (Demo)
                  </button>
                </div>
              </div>
            ) : (
              /* Assigned Driver Card */
              <div>
                <DriverCard
                  driver={{
                    full_name: booking.driver_name,
                    phone: booking.driver_phone,
                    vehicle_number: booking.vehicle_number,
                    vehicle_type: booking.vehicle_type,
                    rating: 4.8,
                    trips_completed: 142,
                    verified: true,
                  }}
                  onCall={(phone) => alert(`Calling driver at ${phone}... (Mock Telephony)`)}
                />
              </div>
            )}

            {/* Quick Demo Status Step */}
            {!isPending && !isDelivered && (
              <div
                className={cn(
                  "rounded-2xl border p-3.5 text-xs flex items-center justify-between backdrop-blur-md",
                  isPrimaryMode
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-800"
                )}
              >
                <div>
                  <span className="font-bold block">Demo Advancement</span>
                  <span
                    className={cn(
                      "text-[11px]",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    Step through journey
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAdvanceStatus}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl font-black text-xs transition shadow-sm",
                    isPrimaryMode
                      ? "bg-[#CCFF00] text-black hover:bg-[#b8e600]"
                      : "bg-[#FF6600] text-white hover:bg-[#e65c00]"
                  )}
                >
                  Advance Step →
                </button>
              </div>
            )}

            {/* Status Timeline */}
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-7 shadow-xl transition-all duration-300",
                isPrimaryMode
                  ? "border-white/10 bg-[#0B101D] text-white"
                  : "border-slate-200 bg-slate-50/80 text-slate-900"
              )}
            >
              <h4
                className={cn(
                  "font-heading text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b",
                  isPrimaryMode
                    ? "border-white/10 text-slate-400"
                    : "border-slate-200 text-slate-500"
                )}
              >
                {t("shipmentProgress")}
              </h4>
              <StatusTimeline timeline={booking.timeline} currentStatus={booking.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
