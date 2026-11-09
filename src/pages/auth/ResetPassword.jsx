import { useState } from "react";
import { Link } from "react-router-dom";
import { Screen } from "@/components/design/Screen";
import { InputBox } from "@/components/design/InputBox";
import { PillButton } from "@/components/design/PillButton";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDone(true);
  };

  return (
    <Screen maxWidth="max-w-lg">
      <div className="mb-10">
        <p className="font-heading text-3xl font-extrabold">
          Vel<span className="text-primary">qora</span>
        </p>

        <h1 className="mt-8 text-3xl font-extrabold">Reset Password</h1>
        <p className="mt-2 text-muted">Set a new password for your account.</p>
      </div>

      {done ? (
        <div className="rounded-lg bg-green-50 p-5 text-sm text-green-800">
          Password reset successfully. Go to login.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputBox
            label="New Password"
            type="password"
            icon={<Lock size={16} />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <InputBox
            label="Confirm Password"
            type="password"
            icon={<Lock size={16} />}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            required
          />

          <PillButton type="submit">Reset Password</PillButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        <Link to="/login" className="font-semibold text-primary">
          Back to login
        </Link>
      </p>
    </Screen>
  );
}