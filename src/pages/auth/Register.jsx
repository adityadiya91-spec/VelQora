import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Screen } from "@/components/design/Screen";
import { InputBox } from "@/components/design/InputBox";
import { PillButton } from "@/components/design/PillButton";
import { BrandMark } from "@/components/design/BrandMark";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { register, saveProfile } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await register(email, password, name);
      await saveProfile({
        full_name: name,
        email,
      });
      navigate("/profile-setup");
    } catch (err) {
      console.error("Firebase Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("This email is already registered. Please log in instead.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Password should be at least 6 characters long.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("Please enter a valid email address.");
      } else {
        setErrorMsg(err.message || "Failed to create Firebase account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center mb-8">
        <Link to="/" className="mb-4 inline-block hover:opacity-90 transition">
          <BrandMark size="xl" />
        </Link>
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
          Maharashtra Rural Shared Freight
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#121622] p-6 sm:p-8 shadow-2xl text-white space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create Account</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Sign up with Firebase to share rural freight routes across Western Maharashtra.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputBox
            label="Name"
            icon={<User size={16} />}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="border-white/15 bg-[#0B101D] focus-within:border-[#CCFF00]"
            inputClassName="text-white placeholder:text-slate-500"
          />

          <InputBox
            label={t("email")}
            type="email"
            icon={<Mail size={16} />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border-white/15 bg-[#0B101D] focus-within:border-[#CCFF00]"
            inputClassName="text-white placeholder:text-slate-500"
          />

          <InputBox
            label={t("password")}
            type="password"
            icon={<Lock size={16} />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="border-white/15 bg-[#0B101D] focus-within:border-[#CCFF00]"
            inputClassName="text-white placeholder:text-slate-500"
          />

          <div className="pt-2">
            <PillButton
              type="submit"
              variant="coral"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>{t("continue")}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </PillButton>
          </div>
        </form>

        <p className="border-t border-white/10 pt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#CCFF00] hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </Screen>
  );
}