import { useState } from "react";
import { Link } from "react-router-dom";
import { Screen } from "@/components/design/Screen";
import { InputBox } from "@/components/design/InputBox";
import { PillButton } from "@/components/design/PillButton";
import { BrandMark } from "@/components/design/BrandMark";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      console.error("Firebase Password Reset error:", err);
      if (err.code === "auth/user-not-found") {
        setErrorMsg("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("Please enter a valid email address.");
      } else {
        setErrorMsg(err.message || "Failed to send reset email.");
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
          <h1 className="text-2xl sm:text-3xl font-black text-white">Reset Password</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Enter your registered email to receive Firebase reset instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {sent ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/15 p-4 text-xs text-green-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <CheckCircle2 size={18} className="text-[#CCFF00]" />
              <span>Password Reset Email Sent</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We have sent password reset instructions to <strong className="text-white">{email}</strong>. Check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputBox
              label="Email"
              type="email"
              icon={<Mail size={16} />}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
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
                    <span>Sending Reset Link...</span>
                  </div>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </PillButton>
            </div>
          </form>
        )}

        <p className="border-t border-white/10 pt-4 text-center text-xs text-slate-400">
          <Link to="/login" className="font-bold text-[#CCFF00] hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </Screen>
  );
}