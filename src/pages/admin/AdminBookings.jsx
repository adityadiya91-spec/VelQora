import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { AdminTable } from "@/components/domain/AdminTable";
import { StatusPill } from "@/components/design/StatusPill";
import { Modal } from "@/components/design/Modal";
import { PriceBreakup } from "@/components/domain/PriceBreakup";
import { StatusTimeline } from "@/components/design/StatusTimeline";
import { formatINR, formatDate, formatDateTime } from "@/lib/utils";
import { Filter, Eye, QrCode } from "lucide-react";

export default function AdminBookings() {
  const { bookings, updateBookingStatus, assignDriver } = useData();

  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (modeFilter !== "all" && b.mode !== modeFilter) return false;
    if (paymentFilter !== "all" && b.payment_status !== paymentFilter) return false;
    return true;
  });

  const columns = [
    {
      key: "tracking_id",
      header: "Consignment",
      render: (val, row) => (
        <div>
          <span className="font-heading font-extrabold text-white block">{val}</span>
          <span className="text-[11px] text-slate-400">ID: {row.parcel_id}</span>
        </div>
      ),
    },
    {
      key: "entrepreneur_name",
      header: "Shipper Enterprise",
      render: (val) => <span className="font-semibold text-white">{val}</span>,
    },
    {
      key: "pickup_village",
      header: "Corridor Route",
      render: (_, row) => (
        <div>
          <span className="font-bold text-white block text-xs">
            {row.pickup_village} → {row.destination}
          </span>
          <span className="text-[11px] text-slate-400">
            {formatDate(row.pickup_date)} · {row.dispatch_window}
          </span>
        </div>
      ),
    },
    {
      key: "weight_kg",
      header: "Consignment Spec",
      render: (val, row) => (
        <span className="text-slate-300">
          {val} kg · <span className="capitalize">{row.category}</span>
        </span>
      ),
    },
    {
      key: "mode",
      header: "Mode",
      render: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "shared"
              ? "bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30"
              : "bg-white/10 text-white border border-white/10"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "status",
      header: "Shipment Status",
      render: (val) => <StatusPill status={val} />,
    },
    {
      key: "payment_status",
      header: "Settlement",
      render: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "paid"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "fare_total",
      header: "Total Fare",
      render: (val) => (
        <span className="font-heading font-extrabold text-white">{formatINR(val)}</span>
      ),
    },
    {
      key: "id",
      header: "Action",
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(row);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold text-white hover:border-[#CCFF00]/40 transition shadow-xs"
        >
          <Eye size={12} className="text-[#CCFF00]" /> Inspect
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white">
            Master Consignment Register
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Full audit log of active, completed, and pending rural consignments.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B101D] px-3 py-2 text-xs font-bold text-white outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending_match">Pending Match</option>
            <option value="assigned">Assigned</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B101D] px-3 py-2 text-xs font-bold text-white outline-none"
          >
            <option value="all">All Modes</option>
            <option value="shared">Shared Economy</option>
            <option value="priority">Priority</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B101D] px-3 py-2 text-xs font-bold text-white outline-none"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <AdminTable
        title={`Registered Consignments (${filteredBookings.length})`}
        subtitle="Click any row to open dispatch controls and event audit trail"
        columns={columns}
        data={filteredBookings}
        onRowClick={(row) => setSelectedBooking(row)}
      />

      {/* Booking Details Modal */}
      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking ? `Consignment ${selectedBooking.tracking_id}` : ""}
        subtitle={selectedBooking ? `Shipper: ${selectedBooking.entrepreneur_name}` : ""}
        maxWidth="max-w-[560px]"
      >
        {selectedBooking && (
          <div className="space-y-5 text-white text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B101D] border border-white/10">
              <div>
                <span className="text-slate-400 block text-[11px]">Route Corridor</span>
                <span className="font-heading font-extrabold text-sm text-white">
                  {selectedBooking.pickup_village} → {selectedBooking.destination}
                </span>
              </div>
              <StatusPill status={selectedBooking.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0B101D] border border-white/10">
                <span className="text-slate-400 block">Weight & Volume</span>
                <span className="font-bold text-sm block mt-0.5 text-white">
                  {selectedBooking.weight_kg} kg ({selectedBooking.category})
                </span>
                <span className="text-[11px] text-slate-400">
                  Dims: {selectedBooking.dimensions || "Standard rural crate"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B101D] border border-white/10">
                <span className="text-slate-400 block">Assigned Carrier</span>
                <span className="font-bold text-sm block mt-0.5 text-white">
                  {selectedBooking.driver_name || "Unassigned (Awaiting Match)"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedBooking.vehicle_number || "Corridor Pool"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Fare Breakdown & Rural Allocation
              </h4>
              <div className="p-4 rounded-xl border border-white/10 bg-[#0B101D] text-white">
                <PriceBreakup booking={selectedBooking} />
              </div>
            </div>

            {selectedBooking.status === "pending_match" && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    assignDriver(selectedBooking.id);
                    setSelectedBooking(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#CCFF00] text-black font-heading font-extrabold text-xs shadow-md hover:bg-[#b8e600] transition active:scale-95"
                >
                  Manually Assign Available Driver Now
                </button>
              </div>
            )}

            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">
                Tracking Audit Log
              </h4>
              <StatusTimeline timeline={selectedBooking.timeline} currentStatus={selectedBooking.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
