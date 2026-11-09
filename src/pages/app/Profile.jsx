import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PillButton } from "@/components/design/PillButton";
import { LanguageSwitcher } from "@/components/design/LanguageSwitcher";
import { Modal } from "@/components/design/Modal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import {
  User,
  Store,
  MapPin,
  Phone,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, logout } = useProfile();

  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-hairline pb-5">
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-ink">
          {t("profile")} & Enterprise Settings
        </h1>
        <p className="text-xs lg:text-sm text-muted mt-0.5">
          Manage your rural enterprise identity, collection hubs, and localization preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        {/* Left Column: Business Card & Regional Hub */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#121622] p-6 lg:p-7 shadow-xl space-y-5 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] font-heading font-black text-2xl border border-[#CCFF00]/30 shrink-0">
                {(profile?.business_name || profile?.full_name || "K")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl font-extrabold text-white">
                    {profile?.business_name || "Kisan Agro Foods"}
                  </h3>
                  <ShieldCheck size={18} className="text-[#CCFF00]" />
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Shipper Representative: {profile?.full_name || "Santosh Deshmukh"}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
              <div className="flex items-center justify-between text-slate-300 p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="flex items-center gap-2 font-semibold">
                  <MapPin size={15} className="text-[#CCFF00]" /> Base Village & PIN Code
                </span>
                <span className="font-bold text-white">
                  {profile?.village || "Baramati"}, PIN {profile?.pin_code || "413102"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300 p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="flex items-center gap-2 font-semibold">
                  <Store size={15} className="text-[#CCFF00]" /> Registered Collection Point
                </span>
                <span className="font-bold text-white">
                  {profile?.pickup_point || profile?.landmark || "Main Bazaar Hub"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300 p-3 rounded-xl bg-[#0B101D] border border-white/5">
                <span className="flex items-center gap-2 font-semibold">
                  <Phone size={15} className="text-[#CCFF00]" /> Registered Mobile (SMS / Telephony)
                </span>
                <span className="font-bold text-white">
                  {profile?.phone || "+91 9822012345"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => navigate("/profile-setup")}
                className="text-xs font-bold text-[#CCFF00] hover:underline"
              >
                Update Enterprise Registration →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Language, Support, About, and Logout */}
        <div className="lg:col-span-5 space-y-5">
          {/* Language Switcher */}
          <div className="rounded-3xl border border-white/10 bg-[#121622] p-6 shadow-xl space-y-3 text-white">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#CCFF00]" />
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
                {t("language")} Preferences
              </h4>
            </div>
            <LanguageSwitcher />
            <p className="text-[11px] text-slate-400">
              Language changes apply immediately across all screens and notifications.
            </p>
          </div>

          {/* Menu links */}
          <div className="rounded-3xl border border-white/10 bg-[#121622] overflow-hidden shadow-xl divide-y divide-white/10 text-white">
            <button
              onClick={() => setShowHelp(true)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition text-xs sm:text-sm font-semibold text-white"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-slate-400" />
                <span>{t("helpSupport")}</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition text-xs sm:text-sm font-semibold text-white"
            >
              <div className="flex items-center gap-3">
                <Info size={18} className="text-slate-400" />
                <span>{t("aboutVelqora")}</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 py-3.5 text-xs font-bold text-red-400 transition"
          >
            <LogOut size={16} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </div>

      {/* Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Rural Support Desk"
        subtitle="Assistance for farmers, traders, and small village enterprises"
      >
        <div className="space-y-4 text-sm text-muted">
          <p>
            Have questions about shared load pricing, pickup points, or vehicle dispatch schedules? Our regional coordinator is available 7 AM – 9 PM.
          </p>
          <div className="rounded-lg bg-canvas p-3 border border-hairline text-ink font-semibold">
            📞 Toll-Free Helpline: 1800-VELQORA (1800-835-7672)
          </div>
          <p className="text-xs">
            For non-smartphone bookings, dial our keypad phone IVR line using your registered village code.
          </p>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="Velqora — One Route. Many Businesses."
        subtitle="Empowering Rural Maharashtra Logistics"
      >
        <div className="space-y-3 text-sm text-muted">
          <p>
            Velqora is a premium rural shared-logistics platform designed to solve the freight aggregation problem across Maharashtra's agrarian belts.
          </p>
          <p>
            Instead of booking an entire tempo for small parcel deliveries, Velqora matches compatible loads across Baramati, Indapur, Daund, Shirur, Jejuri, and Phaltan, distributing base vehicle costs fairly by weight and volume.
          </p>
          <div className="rounded-lg bg-primary-wash p-3 text-xs text-primary font-bold">
            Version 1.0.0 (Production Prototype)
          </div>
        </div>
      </Modal>
    </div>
  );
}
