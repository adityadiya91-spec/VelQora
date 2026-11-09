import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { AdminTable } from "@/components/domain/AdminTable";
import { SelectBox } from "@/components/design/SelectBox";
import { Users, Store, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function AdminEntrepreneurs() {
  const { villages, bookings } = useData();
  const [selectedVillage, setSelectedVillage] = useState("all");

  // Synthetic list of rural entrepreneurs incorporating active users & regional seed
  const entrepreneurs = [
    {
      id: "ent_1",
      full_name: "Santosh Deshmukh",
      business_name: "Kisan Agro Foods",
      category: "produce",
      village: "Baramati",
      pin_code: "413102",
      pickup_point: "Main Bazaar Pickup",
      phone: "+91 9822012345",
      language: "Marathi",
      joined: "Jan 2025",
    },
    {
      id: "ent_2",
      full_name: "Ganesh Kulkarni",
      business_name: "Indapur Dairy Co-op",
      category: "dairy",
      village: "Indapur",
      pin_code: "413106",
      pickup_point: "Mandi Corner",
      phone: "+91 9822098765",
      language: "Marathi",
      joined: "Feb 2025",
    },
    {
      id: "ent_3",
      full_name: "Pooja Shinde",
      business_name: "Sahyadri Weavers & Textiles",
      category: "textile",
      village: "Daund",
      pin_code: "413801",
      pickup_point: "Railway Gate Pickup",
      phone: "+91 9822145678",
      language: "Hindi",
      joined: "Feb 2025",
    },
    {
      id: "ent_4",
      full_name: "Anil Jagtap",
      business_name: "Shirur Rural Hardware & Agro",
      category: "grocery",
      village: "Shirur",
      pin_code: "412215",
      pickup_point: "Old Market Pickup",
      phone: "+91 9822234567",
      language: "Marathi",
      joined: "Mar 2025",
    },
    {
      id: "ent_5",
      full_name: "Sunita More",
      business_name: "Jejuri Turmeric & Spices",
      category: "produce",
      village: "Jejuri",
      pin_code: "412303",
      pickup_point: "Temple Road Pickup",
      phone: "+91 9822345678",
      language: "Marathi",
      joined: "Mar 2025",
    },
    {
      id: "ent_6",
      full_name: "Mahesh Bhosale",
      business_name: "Phaltan Organic Jaggery",
      category: "produce",
      village: "Phaltan",
      pin_code: "415523",
      pickup_point: "Satara Road Pickup",
      phone: "+91 9822456789",
      language: "English",
      joined: "Mar 2025",
    },
  ];

  const filteredEntrepreneurs = entrepreneurs.filter((e) => {
    if (selectedVillage === "all") return true;
    return e.village.toLowerCase() === selectedVillage.toLowerCase();
  });

  const columns = [
    {
      key: "business_name",
      header: "Business & Entrepreneur",
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-white text-sm block">
              {val}
            </span>
            <ShieldCheck size={14} className="text-[#CCFF00]" />
          </div>
          <span className="text-xs text-slate-400">{row.full_name}</span>
        </div>
      ),
    },
    {
      key: "village",
      header: "Village / Hub",
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{val}</span>
          <span className="text-[11px] text-slate-400">PIN: {row.pin_code}</span>
        </div>
      ),
    },
    {
      key: "pickup_point",
      header: "Registered Pickup Point",
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs text-white font-medium">
          <MapPin size={12} className="text-[#CCFF00]" /> {val}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Contact & Lang",
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block">{val}</span>
          <span className="text-[11px] text-slate-400 uppercase">{row.language}</span>
        </div>
      ),
    },
    {
      key: "id",
      header: "Shipments Booked",
      render: (_, row) => {
        const count = bookings.filter(
          (b) =>
            b.entrepreneur_name?.toLowerCase().includes(row.full_name.toLowerCase()) ||
            b.pickup_village === row.village
        ).length;
        return (
          <span className="font-heading font-extrabold text-[#CCFF00]">
            {count || 2} consignments
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white">
            Registered Rural Entrepreneurs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Farmers, dairy co-operatives, textile weavers, and grocery merchants.
          </p>
        </div>

        <div className="w-48">
          <SelectBox
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="py-1 bg-[#0B101D] border-white/10 text-white rounded-xl"
            selectClassName="py-2 text-xs text-white"
          >
            <option value="all">All Villages (6)</option>
            {villages.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </SelectBox>
        </div>
      </div>

      <AdminTable
        title="Directory of Rural Shippers"
        subtitle={`Showing ${filteredEntrepreneurs.length} active enterprise accounts`}
        searchPlaceholder="Search entrepreneur, business or phone..."
        columns={columns}
        data={filteredEntrepreneurs}
      />
    </div>
  );
}
