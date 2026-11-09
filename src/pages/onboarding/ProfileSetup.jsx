import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "@/components/design/Screen";
import { ScreenHeader } from "@/components/design/ScreenHeader";
import { InputBox, SelectBox } from "@/components/design/InputBox";
import { PillButton } from "@/components/design/PillButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useData } from "@/contexts/DataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { MapPin, Phone, User, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { profile, saveProfile } = useProfile();
  const { villages, pickupPoints } = useData();
  const { isPrimaryMode } = useTheme();

  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    business_name: profile?.business_name || "",
    phone: profile?.phone || "",
    village: profile?.village || villages[0]?.name || "",
    pin_code: profile?.pin_code || villages[0]?.pin_code || "",
    landmark: profile?.landmark || "",
    pickup_point: profile?.pickup_point || "",
    language: lang,
  });

  useEffect(() => {
    const village = villages.find((item) => item.name === form.village);

    if (village) {
      setForm((prev) => ({
        ...prev,
        pin_code: village.pin_code,
      }));
    }
  }, [form.village, villages]);

  const villagePickupPoints = pickupPoints.filter(
    (point) => point.village === form.village
  );

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await saveProfile(form);
    navigate("/app");
  };

  return (
    <Screen maxWidth="max-w-xl">
      <ScreenHeader
        title={t("profileSetup")}
        subtitle="Tell us about your business and pickup location."
      />

      <div className="space-y-4">
        <InputBox
          label={t("fullName")}
          icon={<User size={16} />}
          value={form.full_name}
          onChange={(event) => updateField("full_name", event.target.value)}
        />

        <InputBox
          label={t("businessName")}
          icon={<Store size={16} />}
          value={form.business_name}
          onChange={(event) =>
            updateField("business_name", event.target.value)
          }
        />

        <InputBox
          label={t("mobile")}
          icon={<Phone size={16} />}
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />

        <SelectBox
          label={t("village")}
          icon={<MapPin size={16} />}
          value={form.village}
          onChange={(event) => updateField("village", event.target.value)}
        >
          {villages.map((village) => (
            <option key={village.id} value={village.name}>
              {village.name} · {village.district}
            </option>
          ))}
        </SelectBox>

        <InputBox
          label="PIN Code"
          value={form.pin_code}
          onChange={(event) => updateField("pin_code", event.target.value)}
        />

        <InputBox
          label="Landmark"
          value={form.landmark}
          onChange={(event) => updateField("landmark", event.target.value)}
        />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
          {t("pickupPoint")}
        </p>

        <div className="flex flex-wrap gap-2">
          {villagePickupPoints.map((point) => (
            <button
              key={point.id}
              type="button"
              onClick={() => updateField("pickup_point", point.name)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                form.pickup_point === point.name
                  ? isPrimaryMode
                    ? "border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]"
                    : "border-[#FF6600] bg-[#FF6600]/15 text-[#FF6600]"
                  : isPrimaryMode
                  ? "border-white/10 bg-[#121622] text-slate-300 hover:border-white/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
              )}
            >
              {point.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <PillButton variant="coral" onClick={handleSubmit}>
          {t("saveContinue")}
        </PillButton>
      </div>
    </Screen>
  );
}