import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { InputBox } from "@/components/design/InputBox";
import { SelectBox } from "@/components/design/SelectBox";
import { PillButton } from "@/components/design/PillButton";
import { simulateIVRBooking } from "@/lib/api/telephonyAdapter";
import { Phone, PhoneCall, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminIVR() {
  const { villages, pickupPoints, createBooking } = useData();

  const [form, setForm] = useState({
    caller_phone: "+91 9422019876",
    village_code: "BRM",
    pickup_point_code: "BRM-P1",
    destination_code: "JJR",
    weight_kg: 35,
    category: "produce",
  });

  const [simResult, setSimResult] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setIsSimulating(true);
    try {
      const res = await simulateIVRBooking(form);
      setSimResult(res);

      // Create live booking from IVR draft
      const originVillage = villages.find((v) => v.code === form.village_code) || villages[0];
      const destVillage = villages.find((v) => v.code === form.destination_code) || villages[1];
      const pPoint = pickupPoints.find((p) => p.code === form.pickup_point_code);

      const booking = createBooking({
        entrepreneur_name: `IVR Caller (${form.caller_phone.slice(-4)})`,
        pickupVillage: originVillage,
        destinationVillage: destVillage,
        pickup_landmark: pPoint?.landmark || "Village Landmark",
        weight_kg: Number(form.weight_kg),
        category: form.category,
        mode: "shared",
      });

      setCreatedBooking(booking);
    } finally {
      setIsSimulating(false);
    }
  };

  const villageCodeMap = {
    BRM: "Baramati",
    IND: "Indapur",
    DND: "Daund",
    SHR: "Shirur",
    JJR: "Jejuri",
    PLT: "Phaltan",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-white">
          Rural Keypad IVR Booking Simulator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enabling non-smartphone feature phone users to book shared logistics via standard DTMF keypad codes.
        </p>
      </div>

      {/* Telephony Mock Notice */}
      <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 text-xs text-white shadow-xl">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="text-[#CCFF00] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm text-white">Keypad Telephony Architecture (Mock Module)</span>
            <p className="mt-1 text-slate-400 leading-relaxed">
              In rural areas, farmers often carry basic keypad phones without reliable 4G or GPS. Velqora standardizes village codes, postal landmarks, and registered pickup pins so callers can complete freight bookings in under 60 seconds over toll-free interactive voice response.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator Form */}
        <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <PhoneCall size={18} className="text-[#CCFF00]" />
            <h3 className="font-heading text-base font-extrabold text-white">
              Simulate Inbound Keypad Call
            </h3>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            <InputBox
              label="Caller Mobile Number"
              icon={<Phone size={16} />}
              value={form.caller_phone}
              onChange={(e) => setForm({ ...form, caller_phone: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <SelectBox
                label="Origin Village Code (DTMF)"
                value={form.village_code}
                onChange={(e) => setForm({ ...form, village_code: e.target.value })}
              >
                {villages.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.code} — {v.name}
                  </option>
                ))}
              </SelectBox>

              <SelectBox
                label="Registered Point Code"
                value={form.pickup_point_code}
                onChange={(e) => setForm({ ...form, pickup_point_code: e.target.value })}
              >
                {pickupPoints.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} ({p.village})
                  </option>
                ))}
              </SelectBox>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectBox
                label="Destination Village Code"
                value={form.destination_code}
                onChange={(e) => setForm({ ...form, destination_code: e.target.value })}
              >
                {villages.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.code} — {v.name}
                  </option>
                ))}
              </SelectBox>

              <InputBox
                label="Weight in KG (Keypad Entry)"
                type="number"
                min="1"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                required
              />
            </div>

            <SelectBox
              label="Commodity Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="produce">Press 1: Fresh Farm Produce</option>
              <option value="dairy">Press 2: Milk / Dairy Cans</option>
              <option value="textile">Press 3: Handloom & Textiles</option>
              <option value="grocery">Press 4: General Grocery / Spices</option>
            </SelectBox>

            <div className="pt-2">
              <PillButton type="submit" variant="coral" disabled={isSimulating}>
                {isSimulating ? "Simulating IVR Workflow..." : "Simulate Call & Generate Booking"}
              </PillButton>
            </div>
          </form>
        </div>

        {/* Telephony Output / Dialpad Specs */}
        <div className="space-y-4">
          {simResult && createdBooking ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-[#121622] p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[#CCFF00]" />
                <h4 className="font-heading font-extrabold text-base text-white">
                  IVR Call Confirmed & Transcribed
                </h4>
              </div>

              <div className="rounded-xl bg-[#0B101D] p-4 border border-white/10 text-xs text-white space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Generated Tracking Code:</span>
                  <span className="font-heading font-bold text-[#CCFF00]">
                    {createdBooking.tracking_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Origin & Point:</span>
                  <span className="font-bold text-white">
                    {villageCodeMap[form.village_code]} ({form.pickup_point_code})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-white">{villageCodeMap[form.destination_code]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consignment Weight:</span>
                  <span className="font-bold text-white">{form.weight_kg} kg ({form.category})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Caller SMS Notification:</span>
                  <span className="text-emerald-400 font-bold">Simulated Sent ✓</span>
                </div>
              </div>

              <p className="text-xs text-emerald-400">
                This booking has entered the pending matching queue and is immediately visible in the live Consignments and Home tab.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4 text-xs text-slate-400">
              <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
                Standard Rural DTMF Code Matrix
              </h4>

              <div className="grid grid-cols-2 gap-2 text-white">
                {villages.map((v) => (
                  <div key={v.code} className="p-2.5 rounded-xl bg-[#0B101D] border border-white/5">
                    <span className="font-bold text-[#CCFF00] block">{v.code}</span>
                    <span className="text-xs text-slate-300">{v.name} ({v.district})</span>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-slate-400">
                By relying on standardized 3-letter village codes and 6 registered village pickup pins rather than continuous GPS tracking, Velqora provides 100% digital inclusion for farmers who do not own smartphones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
