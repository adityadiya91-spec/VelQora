import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/design/ScreenHeader";
import { PriceBreakup } from "@/components/domain/PriceBreakup";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatINR } from "@/lib/utils";
import { QrCode, ShieldCheck, CheckCircle2, Smartphone, Wallet, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getBooking, payBooking } = useData();
  const { isPrimaryMode } = useTheme();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

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
        <button
          type="button"
          className="mt-4 px-6 py-2.5 rounded-xl border border-white/20 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition"
          onClick={() => navigate("/app")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await payBooking(booking.id, paymentMethod);
      setPaidSuccess(true);
      setTimeout(() => {
        navigate(`/track/${booking.id}`);
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const methods = [
    {
      id: "upi",
      label: "BHIM / PhonePe / GPay (Instant Mobile UPI)",
      desc: "Direct settlement with regional carrier pool",
      icon: Smartphone,
    },
    {
      id: "qr",
      label: "Scan Rural UPI QR Code",
      desc: "Instant dynamic QR for feature/smartphones",
      icon: QrCode,
    },
    {
      id: "cash",
      label: "Cash on Pickup (Village Hub Agent)",
      desc: "Pay cash at verified market collection point",
      icon: Wallet,
    },
  ];

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
          title={t("payment")}
          subtitle={`Consignment: ${booking.tracking_id} · Destination: ${booking.destination}`}
          backTo={`/booking/${booking.id}`}
          showControls={true}
        />

        {/* Demo notice alert */}
        <div
          className={cn(
            "rounded-2xl border p-4 text-xs shadow-xs transition-colors",
            isPrimaryMode
              ? "border-[#CCFF00]/30 bg-[#CCFF00]/10 text-white"
              : "border-orange-300 bg-orange-50 text-slate-800"
          )}
        >
          <div className="flex items-start gap-2.5">
            <ShieldCheck
              size={18}
              className={cn(
                "shrink-0 mt-0.5",
                isPrimaryMode ? "text-[#CCFF00]" : "text-[#FF6600]"
              )}
            />
            <div>
              <span className="font-extrabold block text-sm">
                Demonstration Payment Environment
              </span>
              <span
                className={cn(
                  "leading-relaxed",
                  isPrimaryMode ? "text-slate-300" : "text-slate-600"
                )}
              >
                {t("mockPaymentNote")} No real bank balance is debited. This prototype tests real-time receipt generation and tracking transition.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
          {/* Left Column: Payment Methods & QR Scanner */}
          <div className="lg:col-span-7 space-y-5">
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
                  "font-heading text-sm font-bold uppercase tracking-wider",
                  isPrimaryMode ? "text-slate-400" : "text-slate-500"
                )}
              >
                Choose Payment Instrument
              </h4>

              <div className="space-y-3">
                {methods.map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;

                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        isSelected
                          ? isPrimaryMode
                            ? "border-[#CCFF00] bg-[#CCFF00]/10 ring-2 ring-[#CCFF00]/20 shadow-xs"
                            : "border-[#FF6600] bg-orange-50/80 ring-2 ring-[#FF6600]/20 shadow-xs"
                          : isPrimaryMode
                          ? "border-white/10 bg-[#0B101D] hover:border-white/20"
                          : "border-slate-200 bg-white hover:border-orange-200"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl transition border",
                            isSelected
                              ? isPrimaryMode
                                ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                                : "bg-[#FF6600] text-white border-[#FF6600]"
                              : isPrimaryMode
                              ? "bg-white/5 border-white/10 text-slate-400"
                              : "bg-slate-100 border-slate-200 text-slate-600"
                          )}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm font-extrabold block",
                              isPrimaryMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            {m.label}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              isPrimaryMode ? "text-slate-400" : "text-slate-500"
                            )}
                          >
                            {m.desc}
                          </span>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 ml-2 transition",
                          isSelected
                            ? isPrimaryMode
                              ? "border-[#CCFF00] bg-[#CCFF00] text-black"
                              : "border-[#FF6600] bg-[#FF6600] text-white"
                            : isPrimaryMode
                            ? "border-white/20 bg-white/5"
                            : "border-slate-300 bg-slate-100"
                        )}
                      >
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* QR Scanner Display */}
              {paymentMethod === "qr" && (
                <div
                  className={cn(
                    "mt-5 p-6 rounded-2xl text-center border transition-all",
                    isPrimaryMode
                      ? "bg-[#0B101D] border-white/10"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white border border-slate-300 shadow-md p-4">
                    <svg
                      className="w-full h-full text-slate-950"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      <path d="M10 10h30v30H10zm6 6v18h18V16zm44-6h30v30H60zm6 6v18h18V16zM10 60h30v30H10zm6 6v18h18V66zm44 4h10v10H60zm10 10h10v10H70zm10-10h10v10H80zm0 10h10v10H80zm-20 0h10v10H60zm20-20h10v10H80z" />
                    </svg>
                  </div>
                  <p
                    className={cn(
                      "mt-4 text-sm font-extrabold",
                      isPrimaryMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    Scan with PhonePe / Google Pay / Paytm
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isPrimaryMode ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    VPA: velqora.rural@upi · Auto-verifies in 15s
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Price Breakup & Pay Action */}
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

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  disabled={isProcessing || paidSuccess}
                  onClick={handlePay}
                  className={cn(
                    "w-full rounded-2xl py-4 font-heading text-base font-extrabold tracking-tight transition active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-50",
                    isPrimaryMode
                      ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:bg-[#b8e600]"
                      : "bg-[#FF6600] text-white shadow-[0_0_20px_rgba(255,102,0,0.4)] hover:bg-[#e65c00]"
                  )}
                >
                  <span>
                    {isProcessing
                      ? "Securing Payment..."
                      : paidSuccess
                      ? "Payment Confirmed!"
                      : `${t("payNow")} · ${formatINR(booking.fare_total)}`}
                  </span>
                  {!isProcessing && !paidSuccess && <ArrowRight size={18} />}
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
                  Pay Later at Pickup Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
