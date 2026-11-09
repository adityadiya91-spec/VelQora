import { useData } from "@/contexts/DataContext";
import { AdminTable } from "@/components/domain/AdminTable";
import { StatusPill } from "@/components/design/StatusPill";
import { formatINR, formatDate } from "@/lib/utils";
import { Package, QrCode } from "lucide-react";

export default function AdminParcels() {
  const { bookings } = useData();

  const columns = [
    {
      key: "parcel_id",
      header: "Parcel ID",
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00]">
            <Package size={15} />
          </div>
          <div>
            <span className="font-heading font-extrabold text-white block">{val}</span>
            <span className="text-[11px] text-slate-400">{row.tracking_id}</span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Commodity Category",
      render: (val) => (
        <span className="capitalize font-bold text-[#CCFF00] inline-block px-2.5 py-0.5 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-xs">
          {val}
        </span>
      ),
    },
    {
      key: "weight_kg",
      header: "Weight & Dimensions",
      render: (val, row) => (
        <div>
          <span className="font-heading font-extrabold text-white block">{val} kg</span>
          <span className="text-[11px] text-slate-400">
            {row.dimensions || "Standard crate"}
          </span>
        </div>
      ),
    },
    {
      key: "pickup_village",
      header: "Route Path",
      render: (_, row) => (
        <span className="font-medium text-white">
          {row.pickup_village} → {row.destination}
        </span>
      ),
    },
    {
      key: "status",
      header: "Current State",
      render: (val) => <StatusPill status={val} />,
    },
    {
      key: "fare_total",
      header: "Settled Share",
      render: (val) => (
        <span className="font-heading font-extrabold text-white">{formatINR(val)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white">
          Parcel Item Inventory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Granular consignment tracking for multi-stop vehicle loading and reconciliation.
        </p>
      </div>

      <AdminTable
        title="Physical Consignment Packages"
        subtitle="Individual parcels tagged with unique tracking QR codes"
        searchPlaceholder="Filter parcel ID or commodity..."
        searchKey="parcel_id"
        columns={columns}
        data={bookings}
      />
    </div>
  );
}
