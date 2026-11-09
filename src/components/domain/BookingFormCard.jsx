import { InputBox, SelectBox } from "@/components/design/InputBox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, MapPin, Package, Ruler, Weight } from "lucide-react";

export function BookingFormCard({
  form,
  onChangeField,
  villages = [],
  timeWindows = ["06:00-10:00", "08:00-12:00", "12:00-16:00", "16:00-20:00"],
  categories = [
    { value: "produce", label: "Produce" },
    { value: "dairy", label: "Dairy" },
    { value: "textile", label: "Textile" },
    { value: "handicraft", label: "Handicraft" },
    { value: "grocery", label: "Grocery" },
    { value: "other", label: "Other" },
  ],
  className = "",
}) {
  const { t } = useLanguage();

  return (
    <div className={`space-y-3 ${className}`}>
      <SelectBox
        icon={<MapPin size={16} />}
        value={form.pickup_village}
        onChange={(e) => onChangeField("pickup_village", e.target.value)}
      >
        {villages.map((v) => (
          <option key={v.id} value={v.name}>
            {v.name} ({v.district})
          </option>
        ))}
      </SelectBox>

      <InputBox
        icon={<MapPin size={16} />}
        placeholder={t("pickupLandmark")}
        value={form.pickup_landmark}
        onChange={(e) => onChangeField("pickup_landmark", e.target.value)}
      />

      <SelectBox
        icon={<MapPin size={16} />}
        value={form.destination}
        onChange={(e) => onChangeField("destination", e.target.value)}
      >
        <option value="" disabled>
          {t("destination")}
        </option>
        {villages.map((v) => (
          <option key={v.id} value={v.name}>
            {v.name} ({v.district})
          </option>
        ))}
      </SelectBox>

      <div className="grid grid-cols-2 gap-3">
        <InputBox
          type="date"
          icon={<Calendar size={16} />}
          value={form.pickup_date}
          onChange={(e) => onChangeField("pickup_date", e.target.value)}
        />

        <SelectBox
          icon={<Clock size={16} />}
          value={form.dispatch_window}
          onChange={(e) => onChangeField("dispatch_window", e.target.value)}
        >
          {timeWindows.map((tw) => (
            <option key={tw} value={tw}>
              {tw}
            </option>
          ))}
        </SelectBox>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InputBox
          type="number"
          min="1"
          icon={<Weight size={16} />}
          placeholder={t("weight")}
          value={form.weight_kg}
          onChange={(e) => onChangeField("weight_kg", e.target.value)}
        />

        <InputBox
          icon={<Ruler size={16} />}
          placeholder={t("dimensions")}
          value={form.dimensions}
          onChange={(e) => onChangeField("dimensions", e.target.value)}
        />
      </div>

      <SelectBox
        icon={<Package size={16} />}
        value={form.category}
        onChange={(e) => onChangeField("category", e.target.value)}
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </SelectBox>
    </div>
  );
}

export default BookingFormCard;
