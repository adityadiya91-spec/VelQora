import { useData } from "@/contexts/DataContext";
import { AdminTable } from "@/components/domain/AdminTable";
import { AdminStatCard } from "@/components/domain/AdminStatCard";
import { formatINR, formatDateTime } from "@/lib/utils";
import { CreditCard, CheckCircle2, Clock, ShieldCheck, Wallet } from "lucide-react";

export default function AdminPayments() {
  const { allPayments, adminStats } = useData();

  const columns = [
    {
      key: "reference",
      header: "Payment Reference",
      render: (val, row) => (
        <div>
          <span className="font-heading font-extrabold text-white block text-xs">
            {val || `MOCK-TXN-${row.id}`}
          </span>
          <span className="text-[11px] text-slate-400">Tracking: {row.tracking_id}</span>
        </div>
      ),
    },
    {
      key: "entrepreneur_name",
      header: "Payer Entity",
      render: (val) => <span className="font-semibold text-white">{val || "Rural Shipper"}</span>,
    },
    {
      key: "method",
      header: "Channel",
      render: (val) => (
        <span className="uppercase font-bold text-[#CCFF00] px-2.5 py-0.5 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[11px]">
          {val || "UPI"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount Settled",
      render: (val) => (
        <span className="font-heading font-extrabold text-white text-sm">
          {formatINR(val)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Gateway State",
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "paid"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
          }`}
        >
          <CheckCircle2 size={11} /> {val}
        </span>
      ),
    },
    {
      key: "paid_at",
      header: "Timestamp",
      render: (val) => (
        <span className="text-xs text-slate-400 font-medium">
          {formatDateTime(val)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white">
          Settlements & Escrow Payments
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time transaction settlement ledger between shippers, carriers, and platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          title="Total Platform Revenue"
          value={formatINR(adminStats.totalRevenue)}
          subtitle="Processed via UPI & Banking"
          icon={CreditCard}
        />

        <AdminStatCard
          title="Settled Invoices"
          value={allPayments.length}
          subtitle="Direct carrier disbursements"
          icon={CheckCircle2}
        />

        <AdminStatCard
          title="Carrier Escrow Pool"
          value={formatINR(Math.round(adminStats.totalRevenue * 0.85))}
          subtitle="Earmarked for driver payouts"
          icon={Wallet}
        />
      </div>

      <AdminTable
        title="Payment Transactions"
        subtitle="Itemized receipt records across mobile UPI, QR, and assisted payments"
        searchPlaceholder="Filter reference code or tracking ID..."
        searchKey="reference"
        columns={columns}
        data={allPayments}
      />
    </div>
  );
}
