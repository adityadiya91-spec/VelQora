import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Screen } from "@/components/design/Screen";
import { InputBox } from "@/components/design/InputBox";
import { PillButton } from "@/components/design/PillButton";
import { BrandMark } from "@/components/design/BrandMark";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import {
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  Store,
  Truck,
  Settings,
} from "lucide-react";

const ROLES = [
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    subtitle: "Rural Shipper & Farmer",
    icon: Store,
    badge: "Layer 1: Shipper Portal",
    route: "/app",
    email: "kisan.agro@baramati.in",
    password: "password123",
    description: "Book shared tempos, calculate fair loads, and track live consignments.",
  },
  {
    id: "driver",
    title: "Driver Partner",
    subtitle: "Carrier & Fleet Operator",
    icon: Truck,
    badge: "Layer 2: Carrier Portal",
    route: "/driver",
    email: "rajesh.pawar@driver.velqora.in",
    password: "password123",
    description: "Review corridor trips, on-truck cargo manifest, and trip earnings.",
  },
  {
    id: "admin",
    title: "Operations HQ",
    subtitle: "Admin & Logistics Control",
    icon: Settings,
    badge: "Layer 3: Admin Operations",
    route: "/admin",
    email: "ops.admin@velqora.gov.in",
    password: "adminsecure123",
    description: "Run matching engine, manage carrier compliance, DTMF IVR & analytics.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login, register, profile, saveProfile } = useProfile();

  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState(ROLES[0].password);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setEmail(role.email);
    setPassword(role.password);
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      try {
        await login(email, password);
      } catch (authErr) {
        console.warn("Firebase Auth fallback, creating demo session:", authErr);
        try {
          if (register) {
            await register(email, password, activeRole.title);
          } else {
            await login();
          }
        } catch {
          await login();
        }
      }

      if (activeRole.id === "entrepreneur" && !profile) {
        await saveProfile({
          full_name: "Santosh Deshmukh",
          business_name: "Kisan Agro Foods",
          phone: "+91 98220 12345",
          village: "Baramati",
          pin_code: "413102",
          landmark: "Near Market Yard Gate 2",
          pickup_point: "Main Bazaar Pickup",
          language: "en",
        });
      }

      navigate(activeRole.route);
    } catch (err) {
      console.error("Login fallback:", err);
      await login();
      navigate(activeRole.route);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await login();
      if (activeRole.id === "entrepreneur" && !profile) {
        await saveProfile({
          full_name: "Santosh Deshmukh",
          business_name: "Kisan Agro Foods",
          phone: "+91 98220 12345",
          village: "Baramati",
          pin_code: "413102",
          landmark: "Near Market Yard Gate 2",
          pickup_point: "Main Bazaar Pickup",
          language: "en",
        });
      }
      navigate(activeRole.route);
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center mb-6">
        <Link to="/" className="mb-3 inline-block hover:opacity-90 transition">
          <BrandMark size="xl" />
        </Link>
        <p className="text-xs uppercase font-black tracking-widest text-slate-400">
          Maharashtra Rural Shared Freight
        </p>
      </div>

      {/* 3-Layer Role Selection Tabs */}
      <div className="mb-4 space-y-2">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">
          Select Your Access Layer
        </p>
        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[#0B101D] border border-white/10 shadow-lg">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition text-center ${
                  isSelected
                    ? "bg-[#CCFF00] text-black font-black shadow-md scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 font-semibold"
                }`}
              >
                <Icon size={16} />
                <span className="text-[11px] leading-tight block">{role.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="rounded-3xl border border-white/10 bg-[#121622] p-6 sm:p-8 shadow-2xl text-white space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="rounded-full bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
              {activeRole.badge}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">{activeRole.title} Login</h1>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {activeRole.description}
          </p>
        </div>

        {/* Demo notice alert */}
        <div className="rounded-xl border border-[#CCFF00]/30 bg-[#CCFF00]/10 p-3 text-xs text-slate-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#CCFF00] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Role Authenticated Session</span>
              <span className="text-slate-300 text-[11px]">
                Entering directly into the isolated {activeRole.title} portal without external switchers.
              </span>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <InputBox
            label={t("email")}
            type="email"
            icon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-white/15 bg-[#0B101D] focus-within:border-[#CCFF00]"
            inputClassName="text-white placeholder:text-slate-500"
          />

          <InputBox
            label={t("password")}
            type="password"
            icon={<Lock size={16} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-white/15 bg-[#0B101D] focus-within:border-[#CCFF00]"
            inputClassName="text-white placeholder:text-slate-500"
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#CCFF00] hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="pt-2 space-y-2.5">
            <PillButton
              type="submit"
              variant="coral"
              className="w-full justify-center text-sm py-3.5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  <span>Entering {activeRole.title}...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to {activeRole.title}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </PillButton>

            <button
              type="button"
              onClick={handleDemoQuickLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 py-3 text-xs font-bold text-white transition shadow-sm"
            >
              <Sparkles size={15} className="text-[#CCFF00]" />
              <span>1-Click Instant {activeRole.title} Access</span>
            </button>
          </div>
        </form>

        <div className="border-t border-white/10 pt-4 text-center text-xs text-slate-400">
          Need a new account?{" "}
          <Link to="/register" className="font-bold text-[#CCFF00] hover:underline">
            Register Village Business
          </Link>
        </div>
      </div>
    </Screen>
  );
}
