import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBox, SelectBox } from "@/components/design/InputBox";
import { PillButton } from "@/components/design/PillButton";
import { VehicleCard } from "@/components/domain/VehicleCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { calculateFare } from "@/lib/fare";
import { saveDraft } from "@/lib/draft";
import { formatINR } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  Ruler,
  Weight,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
} from "lucide-react";

const BOX_PRESETS = [
  {
    name: "Produce Crate",
    desc: "Fruits & Vegetables",
    l: 2.0,
    w: 1.5,
    h: 1.5,
    unit: "ft",
    icon: "📦",
  },
  {
    name: "Gunny Sack",
    desc: "Grains & Pulses",
    l: 3.0,
    w: 2.0,
    h: 1.5,
    unit: "ft",
    icon: "🎒",
  },
  {
    name: "Milk Can (40L)",
    desc: "Dairy Collections",
    l: 1.3,
    w: 1.3,
    h: 2.2,
    unit: "ft",
    icon: "🥛",
  },
  {
    name: "Bulk Carton",
    desc: "Handlooms & Textiles",
    l: 4.0,
    w: 3.0,
    h: 2.5,
    unit: "ft",
    icon: "📦",
  },
];

const PHOTO_PRESETS = [
  {
    name: "Produce Crates",
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Milk Cans",
    url: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Grain Sacks",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Textile Rolls",
    url: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = [
  { value: "produce", label: "Produce (Fruits/Vegetables)" },
  { value: "dairy", label: "Dairy (Milk Cans/Paneer)" },
  { value: "textile", label: "Textile (Handloom/Yarn)" },
  { value: "handicraft", label: "Handicraft & Brass" },
  { value: "grocery", label: "Grocery & Spices" },
  { value: "other", label: "Other Rural Goods" },
];

const timeWindows = [
  "06:00-10:00 (Early Morning)",
  "08:00-12:00 (Standard Morning)",
  "12:00-16:00 (Afternoon Dispatch)",
  "16:00-20:00 (Evening Run)",
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { villages, vehicleTypes } = useData();
  const { isPrimaryMode } = useTheme();

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    pickup_village: profile?.village || villages[0]?.name || "Baramati",
    pickup_landmark: profile?.pickup_point || profile?.landmark || "Main Bazaar Pickup",
    destination: "Phaltan",
    pickup_date: today,
    dispatch_window: "08:00-12:00 (Standard Morning)",
    weight_kg: 35,
    category: "produce",
    vehicle_type: vehicleTypes[0]?.code || "mini_tempo",
  });

  const [dimensionsData, setDimensionsData] = useState({
    length: 3.0,
    width: 2.0,
    height: 1.5,
    unit: "ft",
  });

  const [parcelPhoto, setParcelPhoto] = useState(
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"
  );

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setParcelPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const volumeDetails = useMemo(() => {
    let l_ft = Number(dimensionsData.length) || 0;
    let w_ft = Number(dimensionsData.width) || 0;
    let h_ft = Number(dimensionsData.height) || 0;

    if (dimensionsData.unit === "cm") {
      l_ft = l_ft / 30.48;
      w_ft = w_ft / 30.48;
      h_ft = h_ft / 30.48;
    } else if (dimensionsData.unit === "in") {
      l_ft = l_ft / 12;
      w_ft = w_ft / 12;
      h_ft = h_ft / 12;
    }

    const cu_ft = Math.round(l_ft * w_ft * h_ft * 10) / 10;
    const cbm = Math.round(cu_ft * 0.0283168 * 100) / 100;
    const formattedString = `${dimensionsData.length} × ${dimensionsData.width} × ${dimensionsData.height} ${dimensionsData.unit} (${cu_ft} cu.ft / ${cbm} m³)`;

    return {
      length_ft: Math.round(l_ft * 10) / 10,
      width_ft: Math.round(w_ft * 10) / 10,
      height_ft: Math.round(h_ft * 10) / 10,
      cu_ft,
      cbm,
      formattedString,
    };
  }, [dimensionsData]);

  useEffect(() => {
    if (profile?.village) {
      setForm((prev) => ({
        ...prev,
        pickup_village: profile.village,
        pickup_landmark: profile.pickup_point || profile.landmark || "Main Bazaar Hub",
      }));
    }
  }, [profile]);

  const selectedVehicle = vehicleTypes.find(
    (vehicle) => vehicle.code === form.vehicle_type
  );

  const pickupVillage = villages.find(
    (village) => village.name === form.pickup_village
  );

  const destinationVillage = villages.find(
    (village) => village.name === form.destination
  );

  const estimate = useMemo(() => {
    return calculateFare({
      pickupVillage,
      destinationVillage,
      weight_kg: Number(form.weight_kg || 0),
      mode: "shared",
      vehicleType: selectedVehicle,
    });
  }, [pickupVillage, destinationVillage, form.weight_kg, selectedVehicle]);

  const canContinue =
    pickupVillage &&
    destinationVillage &&
    selectedVehicle &&
    Number(form.weight_kg) > 0;

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    const enrichedDraft = {
      ...form,
      dimensions: volumeDetails.formattedString,
      length_ft: volumeDetails.length_ft,
      width_ft: volumeDetails.width_ft,
      height_ft: volumeDetails.height_ft,
      volume_cbm: volumeDetails.cbm,
      parcel_image: parcelPhoto,
      customer_phone: profile?.phone || "+91 98220 12345",
    };
    saveDraft(enrichedDraft);
    navigate("/booking/new");
  };

  return (
    <div className="space-y-6 text-white">
      {/* Desktop Banner / Welcoming Header */}
      <div className="hidden md:flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#CCFF00]/15 text-[#CCFF00] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
              Entrepreneur Portal
            </span>
            <span className="text-white/40 text-xs">|</span>
            <span className="text-white/60 text-xs font-semibold">Western Maharashtra Corridor</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-black text-white mt-1">
            Book Rural Consignment
          </h1>
          <p className="text-xs lg:text-sm text-white/60 mt-1">
            Aggregate small rural parcels across Baramati, Indapur, Phaltan, Daund, Shirur, & Jejuri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#CCFF00]/15 px-4 py-2 text-xs font-bold text-[#CCFF00] border border-[#CCFF00]/30 shadow-xs">
            <Sparkles size={15} />
            <span>Avg 38% logistics savings vs private hire</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout (Web Resolution 2-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">
        {/* Left Column: Booking Form Hero Card */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`velqora-hero-booking-card relative overflow-hidden rounded-3xl p-6 lg:p-8 text-white border transition-all duration-300 ${
              isPrimaryMode
                ? "bg-gradient-to-br from-[#0052FF] via-[#0047E0] to-[#0036B8] border-white/20 shadow-[0_25px_60px_-10px_rgba(204,255,0,0.35)] ring-1 ring-[#CCFF00]/30"
                : "bg-gradient-to-br from-[#FF6600] via-[#F25C00] to-[#D94E00] border-orange-300 shadow-[0_25px_60px_-10px_rgba(255,102,0,0.35)] ring-1 ring-white/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-black uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${
                  isPrimaryMode
                    ? "bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/30"
                    : "bg-black/25 text-white border-white/20"
                }`}
              >
                New Shared Shipment
              </span>
              <span className="rounded-full bg-black/30 px-3 py-0.5 text-[11px] font-bold backdrop-blur-sm border border-white/15 text-white">
                Maharashtra Central Corridor
              </span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
              Where to deliver?
            </h2>

            <div className="mt-6 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectBox
                  label={t("pickupVillage")}
                  icon={<MapPin size={16} />}
                  className={
                    isPrimaryMode
                      ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                      : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                  }
                  selectClassName="text-white"
                  value={form.pickup_village}
                  onChange={(event) =>
                    updateField("pickup_village", event.target.value)
                  }
                >
                  {villages.map((village) => (
                    <option key={village.id} value={village.name} className="bg-[#121622] text-white">
                      {village.name} ({village.district})
                    </option>
                  ))}
                </SelectBox>

                <InputBox
                  label={t("pickupLandmark")}
                  icon={<MapPin size={16} />}
                  placeholder={t("pickupLandmark")}
                  className={
                    isPrimaryMode
                      ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                      : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                  }
                  inputClassName="text-white placeholder:text-white/60"
                  value={form.pickup_landmark}
                  onChange={(event) =>
                    updateField("pickup_landmark", event.target.value)
                  }
                />
              </div>

              <SelectBox
                label={t("destination")}
                icon={<MapPin size={16} />}
                className={
                  isPrimaryMode
                    ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                    : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                }
                selectClassName="text-white"
                value={form.destination}
                onChange={(event) =>
                  updateField("destination", event.target.value)
                }
              >
                <option value="" disabled className="bg-[#121622] text-white">
                  {t("destination")}
                </option>
                {villages.map((village) => (
                  <option key={village.id} value={village.name} className="bg-[#121622] text-white">
                    {village.name} ({village.district} Corridor)
                  </option>
                ))}
              </SelectBox>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputBox
                  label={t("pickupDate")}
                  type="date"
                  icon={<Calendar size={16} />}
                  className={
                    isPrimaryMode
                      ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                      : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                  }
                  inputClassName="text-white"
                  value={form.pickup_date}
                  onChange={(event) =>
                    updateField("pickup_date", event.target.value)
                  }
                />

                <SelectBox
                  label={t("timeWindow")}
                  icon={<Clock size={16} />}
                  className={
                    isPrimaryMode
                      ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                      : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                  }
                  selectClassName="text-white"
                  value={form.dispatch_window}
                  onChange={(event) =>
                    updateField("dispatch_window", event.target.value)
                  }
                >
                  {timeWindows.map((windowValue) => (
                    <option key={windowValue} value={windowValue} className="bg-[#121622] text-white">
                      {windowValue}
                    </option>
                  ))}
                </SelectBox>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputBox
                  label={t("weight")}
                  type="number"
                  min="1"
                  icon={<Weight size={16} />}
                  placeholder={t("weight")}
                  className={
                    isPrimaryMode
                      ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                      : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                  }
                  inputClassName="text-white placeholder:text-white/60"
                  value={form.weight_kg}
                  onChange={(event) =>
                    updateField("weight_kg", event.target.value)
                  }
                />

                <SelectBox
                  label={t("category")}
                  icon={<Package size={16} />}
                  className={
                    isPrimaryMode
                      ? "border-white/20 bg-black/30 focus-within:border-[#CCFF00]"
                      : "border-orange-300/40 bg-[#C2410C] focus-within:border-white shadow-inner"
                  }
                  selectClassName="text-white"
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className="bg-[#121622] text-white">
                      {category.label}
                    </option>
                  ))}
                </SelectBox>
              </div>

              {/* Proper Consignment Box Measurements (L x W x H) */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/90 flex items-center gap-1.5">
                    <Ruler size={15} className="text-[#CCFF00]" />
                    <span>Consignment Box Dimensions (L × W × H)</span>
                  </label>
                  <span className="text-[11px] font-black text-[#CCFF00] bg-black/25 px-2.5 py-0.5 rounded-full border border-white/10 self-start sm:self-auto">
                    {volumeDetails.cu_ft} cu. ft · {volumeDetails.cbm} m³ (CBM)
                  </span>
                </div>

                {/* Box Size Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {BOX_PRESETS.map((preset) => {
                    const isSelected =
                      dimensionsData.length === preset.l &&
                      dimensionsData.width === preset.w &&
                      dimensionsData.height === preset.h &&
                      dimensionsData.unit === preset.unit;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setDimensionsData({
                            length: preset.l,
                            width: preset.w,
                            height: preset.h,
                            unit: preset.unit,
                          });
                        }}
                        className={`p-2 rounded-xl text-left border transition text-[11px] ${
                          isSelected
                            ? "border-[#CCFF00] bg-[#CCFF00]/20 text-white font-bold shadow-sm"
                            : "border-white/10 bg-black/25 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span className="font-bold block truncate text-white">
                          {preset.icon} {preset.name}
                        </span>
                        <span className="text-[10px] text-white/60 block">
                          {preset.l}×{preset.w}×{preset.h} {preset.unit}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Numerical Dimensions */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/70 block">Length</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={dimensionsData.length}
                      onChange={(e) =>
                        setDimensionsData((prev) => ({ ...prev, length: Number(e.target.value) }))
                      }
                      className={
                        isPrimaryMode
                          ? "w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#CCFF00]"
                          : "w-full rounded-xl border border-orange-300/40 bg-[#C2410C] px-3 py-2 text-xs font-bold text-white outline-none focus:border-white shadow-inner"
                      }
                      placeholder="L"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/70 block">Width</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={dimensionsData.width}
                      onChange={(e) =>
                        setDimensionsData((prev) => ({ ...prev, width: Number(e.target.value) }))
                      }
                      className={
                        isPrimaryMode
                          ? "w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#CCFF00]"
                          : "w-full rounded-xl border border-orange-300/40 bg-[#C2410C] px-3 py-2 text-xs font-bold text-white outline-none focus:border-white shadow-inner"
                      }
                      placeholder="W"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/70 block">Height</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={dimensionsData.height}
                      onChange={(e) =>
                        setDimensionsData((prev) => ({ ...prev, height: Number(e.target.value) }))
                      }
                      className={
                        isPrimaryMode
                          ? "w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#CCFF00]"
                          : "w-full rounded-xl border border-orange-300/40 bg-[#C2410C] px-3 py-2 text-xs font-bold text-white outline-none focus:border-white shadow-inner"
                      }
                      placeholder="H"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-white/70 block">Unit</span>
                    <select
                      value={dimensionsData.unit}
                      onChange={(e) =>
                        setDimensionsData((prev) => ({ ...prev, unit: e.target.value }))
                      }
                      className={
                        isPrimaryMode
                          ? "w-full rounded-xl border border-white/20 bg-black/30 px-2 py-2 text-xs font-bold text-white outline-none focus:border-[#CCFF00]"
                          : "w-full rounded-xl border border-orange-300/40 bg-[#C2410C] px-2 py-2 text-xs font-bold text-white outline-none focus:border-white shadow-inner"
                      }
                    >
                      <option value="ft" className="bg-[#121622] text-white">Feet (ft)</option>
                      <option value="in" className="bg-[#121622] text-white">Inches (in)</option>
                      <option value="cm" className="bg-[#121622] text-white">Centimeters (cm)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Parcel Photo Upload & Necessity Callout */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <Camera size={15} className="text-[#CCFF00]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                      Parcel Photo Verification
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 self-start sm:self-auto">
                    Mandatory for Pickup Verification
                  </span>
                </div>

                <p className="text-[11px] text-white/70 leading-relaxed">
                  Photos allow carrier drivers to visually inspect packing condition, handle fragile loads properly, and match QR tags upon vehicle loading.
                </p>

                {/* Upload Area / Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4 relative group rounded-2xl overflow-hidden border border-white/20 bg-black/40 h-28 flex items-center justify-center">
                    {parcelPhoto ? (
                      <>
                        <img
                          src={parcelPhoto}
                          alt="Parcel Consignment"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setParcelPhoto("")}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            title="Remove photo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <Camera size={24} className="text-white/40 mb-1" />
                        <span className="text-[10px] text-white/60 font-semibold">No photo uploaded</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-8 space-y-2">
                    {/* File Upload Button */}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-bold text-white transition">
                        <Upload size={14} className="text-[#CCFF00]" />
                        <span>Upload Custom Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {parcelPhoto && (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Photo Attached
                        </span>
                      )}
                    </div>

                    {/* Preset Suggestions for instant test */}
                    <div>
                      <span className="text-[10px] text-white/60 font-semibold block mb-1">
                        Or select consignment sample:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PHOTO_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setParcelPhoto(preset.url)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                              parcelPhoto === preset.url
                                ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/15"
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rural Context Callout */}
          <div className="rounded-2xl border border-white/10 bg-[#121622] p-5 shadow-sm flex items-start gap-3.5 text-xs text-white/70">
            <ShieldCheck size={20} className="text-[#CCFF00] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block text-sm">
                No GPS Exact Coordinates Required
              </span>
              <p className="mt-0.5 leading-relaxed text-white/60">
                Rural dispatch operates seamlessly using registered village APMC pickup points, landmark pins, and PIN codes. Your consignment will be aggregated with compatible routes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Vehicle Selection, Fare Estimate & Action */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Vehicle Types Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                {t("vehicle")} Classification
              </p>
              <span className="text-[11px] font-bold text-[#CCFF00]">
                Matched to cargo weight
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {vehicleTypes.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  selected={selectedVehicle?.code === vehicle.code}
                  onSelect={(selected) =>
                    updateField("vehicle_type", selected.code)
                  }
                />
              ))}
            </div>
          </div>

          {/* Live Estimate Card */}
          <div className="rounded-3xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                  {t("liveEstimate")}
                </span>
                <h3 className="font-heading text-lg font-black text-white">
                  {t("sharedEstimate")}
                </h3>
              </div>

              {estimate.savings > 0 && (
                <span className="rounded-full bg-[#CCFF00]/15 px-3 py-1 text-xs font-black text-[#CCFF00] border border-[#CCFF00]/30 flex items-center gap-1">
                  <Sparkles size={12} />
                  {t("savings")} {formatINR(estimate.savings)}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-heading text-3xl lg:text-4xl font-black text-white">
                {formatINR(estimate.fare_total)}
              </span>

              {estimate.individual_total > estimate.fare_total && (
                <span className="text-sm text-white/50 line-through font-medium">
                  {formatINR(estimate.individual_total)} full tempo
                </span>
              )}
            </div>

            {/* Load Capacity Progress */}
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1.5 font-medium">
                <span>Vehicle Load Share</span>
                <span className="font-bold text-[#CCFF00]">
                  {Math.round((estimate.capacity_share || 0) * 100)}% of {selectedVehicle?.capacity_kg} kg
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/40 border border-white/10 p-0.5">
                <div
                  className="h-full rounded-full bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.5)] transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(4, Math.round((estimate.capacity_share || 0) * 100))
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-[11px] text-white/60 border-t border-white/10 pt-3 flex items-center justify-between">
              <span>Estimated Corridor Distance:</span>
              <span className="font-bold text-white">{estimate.distance_km} km</span>
            </div>

            <PillButton
              variant="coral"
              disabled={!canContinue}
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 text-base py-4"
            >
              <span>{t("continue")}</span>
              <ArrowRight size={18} />
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}