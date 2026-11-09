import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingRow } from "@/components/domain/BookingRow";
import { InvoiceDialog } from "@/components/domain/InvoiceDialog";
import { EmptyState } from "@/components/design/EmptyState";
import { PillButton } from "@/components/design/PillButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PackagePlus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Bookings() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { bookings } = useData();
  const { isPrimaryMode } = useTheme();

  const [activeTab, setActiveTab] = useState("active");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const activeBookings = bookings.filter((b) =>
    ["pending_match", "assigned", "pickup_started", "picked_up", "in_transit"].includes(
      b.status
    )
  );

  const completedBookings = bookings.filter((b) => b.status === "delivered");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  const currentList =
    activeTab === "active"
      ? activeBookings
      : activeTab === "completed"
      ? completedBookings
      : cancelledBookings;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-5">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-ink">
            {t("bookings")}
          </h1>
          <p className="text-xs lg:text-sm text-muted mt-0.5">
            Manage, track, and download itemized tax invoices for your rural consignments.
          </p>
        </div>

        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-card hover:opacity-90 transition shrink-0 self-start sm:self-auto"
        >
          <PackagePlus size={16} />
          <span>{t("bookNew")}</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-[#121622] border border-white/10 w-full sm:w-auto shadow-lg">
          {[
            { id: "active", label: t("active"), count: activeBookings.length },
            { id: "completed", label: t("completed"), count: completedBookings.length },
            { id: "cancelled", label: t("cancelled"), count: cancelledBookings.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition",
                activeTab === tab.id
                  ? isPrimaryMode
                    ? "bg-[#CCFF00] text-black shadow-md font-extrabold"
                    : "bg-[#FF6600] text-white shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  activeTab === tab.id
                    ? isPrimaryMode
                      ? "bg-black/20 text-black font-black"
                      : "bg-white/25 text-white font-black"
                    : "bg-white/10 text-slate-400"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Consignments Grid for Web Resolution */}
      {currentList.length === 0 ? (
        <EmptyState
          title={t("noBookings")}
          description="You don't have any consignments under this status right now."
          action={
            <PillButton variant="coral" onClick={() => navigate("/")} className="w-auto px-8">
              {t("bookNew")}
            </PillButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {currentList.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              onTrack={(b) => navigate(`/track/${b.id}`)}
              onInvoice={(b) => setSelectedInvoice(b)}
            />
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceDialog
        booking={selectedInvoice}
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
